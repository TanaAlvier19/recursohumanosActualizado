from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Empresa, UsuarioEmpresa, OTP
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EmpresaSerializer, UsuarioEmpresaSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.conf import settings
import random
import string
import re

User = get_user_model()

class CadastrarEmpresa(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        nif = request.data.get('nif', '').replace(' ', '').replace('.', '').replace('-', '')
        if not nif or len(nif) < 9:
            return Response({
                "error": "NIF inválido",
                "message": "O NIF deve ter pelo menos 9 dígitos.",
                "field": "nif"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if Empresa.objects.filter(nif=nif).exists():
            return Response({
                "error": "NIF já cadastrado",
                "message": "Este NIF já está registrado no sistema.",
                "field": "nif"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validação do email corporativo
        email_corporativo = request.data.get('email_corporativo', '')
        if not self.validar_email(email_corporativo):
            return Response({
                "error": "Email inválido",
                "message": "Por favor, insira um email corporativo válido.",
                "field": "email_corporativo"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if Empresa.objects.filter(email_corporativo=email_corporativo).exists():
            return Response({
                "error": "Email já cadastrado",
                "message": "Este email corporativo já está em uso.",
                "field": "email_corporativo"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validação do email do representante
        email_rep = request.data.get('emailRep', '')
        if not self.validar_email(email_rep):
            return Response({
                "error": "Email inválido",
                "message": "Por favor, insira um email pessoal válido.",
                "field": "emailRep"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if UsuarioEmpresa.objects.filter(emailRep=email_rep).exists():
            return Response({
                "error": "Email já cadastrado",
                "message": "Este email já está cadastrado.",
                "field": "emailRep"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validação da senha
        senha = request.data.get('password', '')
        if not self.validar_senha(senha):
            return Response({
                "error": "Senha fraca",
                "message": "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.",
                "field": "password"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        telefone = request.data.get('telefone', '').replace(' ', '').replace('(', '').replace(')', '').replace('-', '')
        
        try:
            with transaction.atomic():
                # Criar empresa
                empresa_data = {
                    'nome': request.data.get('nome'),
                    'nif': nif,
                    'tipo_empresa': request.data.get('tipo_empresa'),
                    'setor_atuacao': request.data.get('setor_atuacao'),
                    'endereco': request.data.get('endereco'),
                    'email_corporativo': email_corporativo,
                    'telefone': telefone,
                }
                
                empresa_serializer = EmpresaSerializer(data=empresa_data)
                if empresa_serializer.is_valid():
                    empresa = empresa_serializer.save()
                    
                    # Criar usuário
                    usuario_data = {
                        'empresa': empresa.id,
                        'nomeRep': request.data.get('nomeRep'),
                        'emailRep': email_rep,
                        'telefoneRep': telefone,
                        'cargo': request.data.get('cargo'),
                        'nivel_acesso': request.data.get('nivel_acesso'),
                        'password': senha
                    }
                    
                    usuario_serializer = UsuarioEmpresaSerializer(data=usuario_data)
                    
                    if usuario_serializer.is_valid():
                        usuario = usuario_serializer.save()
                        usuario.set_password(senha)
                        usuario.is_active = True  # Ativar automaticamente
                        usuario.save()
                        
                        # Enviar email de boas-vindas
                        self.enviar_email_boas_vindas(usuario, empresa)
                        
                        # Gerar token JWT
                        refresh = RefreshToken.for_user(usuario)
                        
                        return Response({
                            "success": True,
                            "message": "Empresa cadastrada com sucesso!",
                            "empresa": EmpresaSerializer(empresa).data,
                            "usuario": UsuarioEmpresaSerializer(usuario).data,
                            "tokens": {
                                "refresh": str(refresh),
                                "access": str(refresh.access_token),
                            }
                        }, status=status.HTTP_201_CREATED)
                    else:
                        empresa.delete()  # Rollback
                        return Response({
                            "error": "Erro ao cadastrar usuário",
                            "message": "Ocorreu um erro ao processar os dados do representante.",
                            "details": usuario_serializer.errors
                        }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({
                        "error": "Erro ao cadastrar empresa",
                        "message": "Ocorreu um erro ao processar os dados da empresa.",
                        "details": empresa_serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            return Response({
                "error": "Erro interno",
                "message": "Ocorreu um erro inesperado. Tente novamente.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(request,self):
        empresa=EmpresaSerializer(Empresa.objects.all(),many=True)
        return Response(empresa.data)
    def validar_email(self, email):
        """Valida o formato do email"""
        if not email:
            return False
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validar_senha(self, senha):
        """Valida a força da senha"""
        if len(senha) < 8:
            return False
        if not re.search(r'[A-Z]', senha):  # Pelo menos uma maiúscula
            return False
        if not re.search(r'[a-z]', senha):  # Pelo menos uma minúscula
            return False
        if not re.search(r'\d', senha):  # Pelo menos um número
            return False
        return True
    """  """
    
    def enviar_email_boas_vindas(self, usuario, empresa):
        """Envia email de boas-vindas"""
        try:
            subject = 'Bem-vindo ao Sistema de Gestão de RH'
            message = f'''
            Olá {usuario.nomeRep},
            
            Bem-vindo ao nosso Sistema de Gestão de RH!
            
            Sua empresa {empresa.nome} foi cadastrada com sucesso.
            
            Dados da sua conta:
            - Email: {usuario.emailRep}
            - Empresa: {empresa.nome}
            - NIF: {empresa.nif}
            
            Você já pode fazer login no sistema e começar a utilizar todas as funcionalidades.
            
            Atenciosamente,
            Equipe de Suporte
            '''
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[usuario.emailRep],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Erro ao enviar email de boas-vindas: {e}")

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def usuario_list(request):
    if request.method == 'GET':
        usuarios = UsuarioEmpresa.objects.all()
        serializer = UsuarioEmpresaSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def usuario_detail(request, pk):
    try:
        usuario = UsuarioEmpresa.objects.get(id=pk)
    except UsuarioEmpresa.DoesNotExist:
        return Response(
            {'error': 'Usuário não encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = UsuarioEmpresaSerializer(usuario)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UsuarioEmpresaSerializer(usuario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        usuario.delete()
        return Response(
            {'message': f'Usuário {pk} deletado com sucesso.'},
            status=status.HTTP_204_NO_CONTENT
        )

class Login(TokenObtainPairView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('emailRep', '')
        
        # Verificar se usuário existe
        try:
            user = UsuarioEmpresa.objects.get(emailRep=email)
            if not user.is_active:
                return Response({
                    "error": "Conta não ativada",
                    "message": "Sua conta ainda não foi ativada. Por favor, verifique seu email e complete o processo de ativação.",
                    "field": "email"
                }, status=status.HTTP_403_FORBIDDEN)
        except UsuarioEmpresa.DoesNotExist:
            return Response({
                "error": "Usuário não encontrado",
                "message": "Não encontramos uma conta com este email. Verifique o email digitado ou crie uma nova conta.",
                "field": "email"
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.user
        except Exception as e:
            return Response({
                "error": "Credenciais inválidas",
                "message": "Email ou senha incorretos. Por favor, verifique seus dados e tente novamente.",
                "field": "password"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        resposta = super().post(request, *args, **kwargs)
        data = resposta.data
        
        data['nivel_acesso'] = user.nivel_acesso
        data['success'] = True
        data['message'] = "Login realizado com sucesso!"
        data['user'] = {
            'id': user.id,
            'name': user.nomeRep,
            'email': user.emailRep,
            'nivel_acesso': user.nivel_acesso
        }
        
        access_token = data.get("access")
        refresh_token = data.get('refresh')
        
        resposta.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=60*60
        )
        resposta.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=60*60*24*7
        )
        
        return resposta

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuario_logado(request):
    user = request.user
    serializer = UsuarioEmpresaSerializer(user)
    empresa_data = EmpresaSerializer(user.empresa)
    return Response({"user": serializer.data, "empresa": empresa_data.data}, status=status.HTTP_200_OK)

def pegar_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

from .serializers import VerificarOTPSerializer, SetPasswordSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_otp(request):
    serializer = VerificarOTPSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    codigo = serializer.validated_data['otp']

    try:
        otp = OTP.objects.filter(
            funcionario__emailRep=email,  
            codigo=codigo,
            usado=False
        ).latest('criado_em')

        if (timezone.now() - otp.criado_em).total_seconds() > 300:
            return Response({
                'error': 'OTP expirado',
                'message': 'O código OTP expirou. Por favor, solicite um novo código.'
            }, status=status.HTTP_400_BAD_REQUEST)

    except OTP.DoesNotExist:
        return Response({
            'error': 'OTP inválido',
            'message': 'Código OTP inválido ou já utilizado. Por favor, verifique o código e tente novamente.'
        }, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        otp.usado = True
        otp.save()

        funcionario = otp.funcionario
        funcionario.is_active = True
        funcionario.save()

    return Response({
        'success': True,
        'message': 'OTP verificado com sucesso! Agora você pode definir sua senha.'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def set_password(request):
    serializer = SetPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    senha = serializer.validated_data['senha']

    try:
        funcionario = UsuarioEmpresa.objects.get(emailRep=email)
    except UsuarioEmpresa.DoesNotExist:
        return Response({
            'error': 'Usuário não encontrado',
            'message': 'Não encontramos uma conta com este email.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if not funcionario.is_active:
        return Response({
            'error': 'Conta não ativada',
            'message': 'A conta ainda não foi ativada. Verifique o OTP primeiro.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    funcionario.set_password(senha)
    funcionario.save()
    
    return Response({
        'success': True,
        'message': 'Senha criada com sucesso! Você já pode fazer login.'
    }, status=status.HTTP_200_OK)

def gerar_codigo_verificacao():
    """Gera um código de 6 dígitos"""
    return ''.join(random.choices(string.digits, k=6))

@api_view(['POST'])
@permission_classes([AllowAny])
def solicitar_recuperacao_senha(request):
    """Solicita recuperação de senha com validação de email"""
    email = request.data.get('email', '')
    
    if not email:
        return Response({
            'error': 'Email obrigatório',
            'message': 'Por favor, informe o email cadastrado.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar formato do email
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return Response({
            'error': 'Email inválido',
            'message': 'Por favor, insira um email válido.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        usuario = UsuarioEmpresa.objects.get(emailRep=email, is_active=True)
    except UsuarioEmpresa.DoesNotExist:
        # Por segurança, não revelar se o email existe
        return Response({
            'success': True,
            'message': 'Se o email estiver cadastrado, você receberá um código de recuperação.'
        }, status=status.HTTP_200_OK)
    
    # Gerar código
    codigo = gerar_codigo_verificacao()
    
    try:
        with transaction.atomic():
            # Invalidar códigos anteriores
            OTP.objects.filter(funcionario=usuario, usado=False).update(usado=True)
            
            # Criar novo código
            OTP.objects.create(
                funcionario=usuario,
                codigo=codigo,
                usado=False
            )
        
        # Enviar email
        enviar_email_recuperacao(email, codigo, usuario.nomeRep)
        
        return Response({
            'success': True,
            'message': 'Código de recuperação enviado para seu email.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Erro interno',
            'message': 'Erro ao processar solicitação. Tente novamente.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def enviar_email_recuperacao(email, codigo, nome):
    """Envia email de recuperação de senha"""
    try:
        subject = 'Recuperação de Senha - Sistema RH'
        message = f'''
        Olá {nome},
        
        Você solicitou a recuperação de senha para sua conta no Sistema de Gestão de RH.
        
        Seu código de verificação é: {codigo}
        
        Este código é válido por 10 minutos.
        
        Se você não solicitou esta recuperação, ignore este email.
        
        Atenciosamente,
        Equipe de Suporte
        '''
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Erro ao enviar email de recuperação: {e}")

@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_codigo_recuperacao(request):
    """Verifica o código de recuperação"""
    email = request.data.get('email', '')
    codigo = request.data.get('codigo', '')
    
    if not email or not codigo:
        return Response({
            'error': 'Dados incompletos',
            'message': 'Por favor, informe o email e o código de recuperação.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        otp = OTP.objects.filter(
            funcionario__emailRep=email,
            codigo=codigo,
            usado=False
        ).latest('criado_em')
        
        # Verificar expiração (10 minutos)
        if (timezone.now() - otp.criado_em).total_seconds() > 600:
            return Response({
                'error': 'Código expirado',
                'message': 'O código de recuperação expirou. Solicite um novo.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': 'Código verificado com sucesso.'
        }, status=status.HTTP_200_OK)
        
    except OTP.DoesNotExist:
        return Response({
            'error': 'Código inválido',
            'message': 'Código de recuperação inválido ou já utilizado.'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def redefinir_senha(request):
    """Redefine a senha do usuário"""
    email = request.data.get('email', '')
    codigo = request.data.get('codigo', '')
    nova_senha = request.data.get('nova_senha', '')
    confirmar_senha = request.data.get('confirmar_senha', '')
    
    if not email or not codigo or not nova_senha or not confirmar_senha:
        return Response({
            'error': 'Dados incompletos',
            'message': 'Por favor, preencha todos os campos.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar senha
    if len(nova_senha) < 8:
        return Response({
            'error': 'Senha fraca',
            'message': 'A senha deve ter no mínimo 8 caracteres.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if nova_senha != confirmar_senha:
        return Response({
            'error': 'Senhas não coincidem',
            'message': 'As senhas informadas não são iguais.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        otp = OTP.objects.filter(
            funcionario__emailRep=email,
            codigo=codigo,
            usado=False
        ).latest('criado_em')
        
        # Verificar expiração
        if (timezone.now() - otp.criado_em).total_seconds() > 600:
            return Response({
                'error': 'Código expirado',
                'message': 'O código de recuperação expirou.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Redefinir senha
        with transaction.atomic():
            usuario = otp.funcionario
            usuario.set_password(nova_senha)
            usuario.save()
            
            # Marcar código como usado
            otp.usado = True
            otp.save()
        
        # Enviar email de confirmação
        enviar_email_senha_alterada(email, usuario.nomeRep)
        
        return Response({
            'success': True,
            'message': 'Senha redefinida com sucesso!'
        }, status=status.HTTP_200_OK)
        
    except OTP.DoesNotExist:
        return Response({
            'error': 'Código inválido',
            'message': 'Código de recuperação inválido.'
        }, status=status.HTTP_400_BAD_REQUEST)

def enviar_email_senha_alterada(email, nome):
    """Envia email confirmando alteração de senha"""
    try:
        subject = 'Senha Alterada - Sistema RH'
        message = f'''
        Olá {nome},
        
        Sua senha foi alterada com sucesso.
        
        Se você não realizou esta alteração, entre em contato imediatamente com o suporte.
        
        Atenciosamente,
        Equipe de Suporte
        '''
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Erro ao enviar email de confirmação: {e}")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout do usuário"""
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        response = Response({
            'success': True,
            'message': 'Logout realizado com sucesso!'
        }, status=status.HTTP_200_OK)
        
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response
    except Exception as e:
        return Response({
            'error': 'Erro ao fazer logout',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)