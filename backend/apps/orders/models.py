import uuid

from django.core.validators import RegexValidator  # type:ignore
from django.db import models  # type:ignore
from phonenumber_field.modelfields import PhoneNumberField  # type:ignore


class Order(models.Model):
    order_number = models.CharField(
        max_length=200,
        unique=True,
        blank=True,
        validators=[
            RegexValidator(
                regex=r"^ORD-[0-9A-F]{8}$",
                message="Order number must be in the format ORD-XXXXXXXX.",
            )
        ],
    )
    client_name = models.CharField(max_length=200)
    client_email = models.EmailField()
    client_contact = PhoneNumberField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_number}"

    def save(self, *args, **kwards):
        if not self.order_number:
            # Generate a prefix + short unique string
            prefix = "ORD"
            random_str = uuid.uuid4().hex[:8].upper()
            self.order_number = f"{prefix}-{random_str}"

            # Double-check uniqueness in case of extreme edge collision
            while (
                Order.objects.filter(
                    order_number=self.order_number)).exists():
                ramdom_str = uuid.uuid4().hex[:8].upper()
                self.order_number = f"{prefix}-{ramdom_str}"

        super().save(*args, **kwards)

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.oder_number,
            "client_name": self.client_name,
            "client_email": self.client_email,
            "client_contact": self.client_contact,
            "price": self.price,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
