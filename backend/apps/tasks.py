from celery import shared_task
from django.core.mail import send_mail, get_connection, EmailMessage
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from .orders.models import Order
from .users.models import User


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_order_confirmation_email(self, order_id):
    """
    Asynchronous taks to send an order confirmation email.
    """
    try:
        order = Order.objects.get(pk=order_id)

        subject = f"Order Confirmation - {order.order_number}"
        message = (
            f"Hi {order.client_name},\n\n"
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


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_password_reset_email_task(self, recipient_email: str, reset_url: str):
    """
    Asynchronous task to send a email with a link where the user can update their password.
    """
    subject = "Password Reset Confirmation"
    message = (
        f"Hi,\n\n"
        f"You requested to update your password.\n"
        f"Please click the link below to proceed:\n"
        f"{reset_url}/\n\n"
        f"If you did not request this, please ignore this email."
    )

    connection = get_connection()
    connection.open() # Ensure the connection is open before sending the email
    try:
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
            connection=connection,
            #recipient_list=[recipient_email],
            #fail_silently=False,
        )

        email.send(fail_silently=False)
        connection.close()
    except User.DoesNotExist:
        # Avoid retrying if the user doesnt exist
        pass
    except Exception as exc:
        # Retry task after exponential backoff in case of SMTP errors
        raise self.retry(exc=exc, countdown=60)
