from celery import shared_task
from django.core.mail import (
    send_mail,
    get_connection,
    EmailMessage,
    EmailMultiAlternatives,
)
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
        text_context = (
            f"Hi {order.client_name},\n\n"
            f"Thank you for your order!\n"
            f"Order number: {order.order_number}\n"
            f"Total price: ${order.price}\n"
            f"We will process it shortly."
        )
        recipient_list = [order.client_email]
        from_email = settings.DEFAULT_FROM_EMAIL

        # HTML version
        html_content = generate_order_email_html(order)
        email = EmailMultiAlternatives(
            subject, text_context, from_email, recipient_list
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        # send_mail(
        #     subject=subject,
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[order.client_email],
        #     text_context=text_context,
        #     fail_silently=False,
        # )
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
    connection.open()  # Ensure the connection is open before sending the email
    try:
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
            connection=connection,
            # recipient_list=[recipient_email],
            # fail_silently=False,
        )

        email.send(fail_silently=False)
        connection.close()
    except User.DoesNotExist:
        # Avoid retrying if the user doesnt exist
        pass
    except Exception as exc:
        # Retry task after exponential backoff in case of SMTP errors
        raise self.retry(exc=exc, countdown=60)


def generate_order_email_html(order):
    photos_html = ""

    # 1. Added .all() to safely iterate over the Django related manager
    for item in order.items.all():
        photo_name = getattr(item.photo, "name", "Unknown Photo")

        # 2. Safe check preventing NoneType crashes
        album = getattr(item.photo, "album", None)
        album_name = album.name if album and hasattr(album, "name") else ""
        author = album.author if album and hasattr(album, "author") else ""

        item_price = item.price

        photos_html += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{photo_name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{album_name} <span style="color: #666;">by {author}</span></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item_price:.2f}</td>
            </tr>
        """

    # Construct the full HTML email structure
    html_message = f"""
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Order Confirmation</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #111; margin-top: 0;">Order Confirmation</h2>
                    <p>Hi <strong>{order.client_name}</strong>,</p>
                    <p>Thank you for your order! We have received your request and will process it shortly.</p>
                    
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb;">
                        <p style="margin: 4px 0;"><strong>Order Number:</strong> {order.order_number}</p>
                        <p style="margin: 4px 0;"><strong>Total Price:</strong> ${order.price:.2f}</p>
                    </div>

                    <h3 style="font-size: 16px; margin-top: 25px; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
                        <thead>
                            <tr style="background-color: #f8fafc; text-align: left;">
                                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Photo</th>
                                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Album & Author</th>
                                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {photos_html}
                        </tbody>
                    </table>
                    <p style="margin-top: 30px; color: #666; font-size: 13px;">If you have any questions or need assistance, feel free to reply directly to this email.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 15px;">Photo Gallery App &copy; 2026</p>
                </div>
            </body>
        </html>
    """
    return html_message
