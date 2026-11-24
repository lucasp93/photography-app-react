from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from ..notifications import notify_password_reset

User = get_user_model()


class InvalidResetTokenError(Exception):
    """Raised when a password reset link is invalid or has expired."""


def send_password_reset_for_email(email: str) -> None:
    """
    Generate a password reset token for the matching user and queue the reset email.
    Silently returns if no user matches to prevent user enumeration.
    """
    cleaned_email = email.strip()
    if not cleaned_email:
        return

    try:
        user = User.objects.get(email=cleaned_email)
    except User.DoesNotExist:
        return

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    frontend_base = settings.FRONTEND_URL.rstrip("/")
    reset_url = f"{frontend_base}/password/reset/confirm/{uid}/{token}"

    notify_password_reset(user.email, reset_url)


def confirm_password_reset(uid: str, token: str, new_password: str) -> None:
    """
    Validate the reset token and new password, then update the user's password.
    Raises InvalidResetTokenError or django.core.exceptions.ValidationError on failure.
    """
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (
        TypeError,
        ValueError,
        OverflowError,
        UnicodeDecodeError,
        User.DoesNotExist,
    ) as exc:
        raise InvalidResetTokenError("This password reset link is invalid or has expired.") from exc

    if not default_token_generator.check_token(user, token):
        raise InvalidResetTokenError("This password reset link is invalid or has expired.")

    validate_password(new_password, user=user)
    user.set_password(new_password)
    user.save(update_fields=["password"])
