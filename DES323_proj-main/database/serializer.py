from rest_framework import serializers

class APIforchecking(serializers.Serializer):
   
    first_name = serializers.CharField(required=True, max_length=255)
    last_name = serializers.CharField(required=True, max_length=255)
    account = serializers.CharField(required=True, max_length=255)
    email = serializers.CharField(required=True, max_length=255)
    password = serializers.CharField(required=True)


