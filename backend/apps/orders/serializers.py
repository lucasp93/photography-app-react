from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField
from ..orders.models import Order


class OrderSerializer(serializers.ModelSerializer):
    client_contact = PhoneNumberField()
    order_number = serializers.CharField(required=False)

    def validate_order_number(self, value):
        if not str(value).startswith("ORD-"):
            raise serializers.ValidationError("order_number must start with 'ORD-'.")
        return value

    class Meta:
        model = Order
        fields = [
            "order_number",
            "client_name",
            "client_email",
            "client_contact",
            "price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
