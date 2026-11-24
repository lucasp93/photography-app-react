from .tasks import (
    send_order_confirmation_email,
    send_password_reset_email_task,
)


def notify_order_created(order_id: int) -> None:
    """Dispatch an asynchronous order confirmation notification."""
    send_order_confirmation_email.delay(order_id)


def notify_password_reset(recipient_email: str, reset_url: str) -> None:
    """Dispatch an asynchronous password reset notification."""
    send_password_reset_email_task.delay(recipient_email, reset_url)
