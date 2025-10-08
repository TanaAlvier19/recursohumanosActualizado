from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token is None:
            return None
        token_validado=self.get_validated_token(access_token)
        user=self.get_user(token_validado)
        return (user, token_validado)