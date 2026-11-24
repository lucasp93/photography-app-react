import type { EmailProps } from '../interfaces/interfaces';
import emailjs from '@emailjs/browser';

export async function sendEmail(formData: EmailProps): Promise<boolean> {
    try {
        const templateParams = {
            title: formData.subject,
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
        };
        // Send email to customer
        const clientResult = await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        // Send eamil to admin
        const adminResult = await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )

        return adminResult.status === 200 && clientResult.status === 200;
    } catch (err) {
        console.error('Failed to send email:', err);
        return false;
    }
}