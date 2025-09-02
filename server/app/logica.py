# class Login (TokenObtainPairView):
#      def post(self, request):
#          resposta=super().post(request)
#          data=resposta.data
#          access_token=data.get("access")   
#          refresh_token=data.get('refresh')     
#          resposta.set_cookie(
#              key="access_token",
#              value=access_token,
#              httponly=True,
#              secure=False,
#              samesite='Lax',
#             expires=datetime.utcnow() + timedelta(minutes=60)
#          )
#          resposta.set_cookie(
#              key="refresh_token",
#              value=refresh_token,
#              httponly=True,
#              secure=False,
#              samesite='Lax',
#              expires=datetime.utcnow() + timedelta(days=1)
#          )
#          return resposta