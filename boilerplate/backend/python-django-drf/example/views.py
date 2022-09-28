from rest_framework.views import APIView
from django.utils.decorators import method_decorator


from django.http import JsonResponse, HttpResponse

from supertokens_python.recipe.session.framework.django.syncio import verify_session


class HelloAPIView(APIView):
    def get(self, request, format=None):
        return HttpResponse("Hello world")

    def post(self, request, format=None):
        return JsonResponse({"message": "Hello world"})


class SecureAPIView(APIView):
    @method_decorator(verify_session())
    def get(self, request, format=None):
        return HttpResponse("Secure API called")

    @method_decorator(verify_session())
    def post(self, request, format=None):
        return JsonResponse({"message": "Secure API called"})

