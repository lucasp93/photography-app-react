from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .orders.models import Order

@shared_task(bind=True, max_retries=3)
def send_order_confirmation_email(self, order_id):
    """
    Asynchronous taks to send an order confirmation email.
    """
    try:
        order = Order.objects.get(pk=order_id)

        subject = f"Order Confirmation - {order.order_number}"
        message = (
            F"Hi {order.client_name},\n\n"
            f"Thank you for your order!\n"
            f"Order number: {order.order_number}\n"
            f"Total price: ${order.price}\n"
            f"We will process it shortly."
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.client_email],
            fail_silently=False,
        )
    except Order.DoesNotExist:
        # Avoid retrying if the order doesnt exist
        pass
    except Exception as exc:
        # Retry task after exponential backoff in case of SMTP errors
        raise self.retry(exc=exc, countdown=60)

    