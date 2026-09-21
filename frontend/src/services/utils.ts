import type { EmailProps, User } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import api from '../services/api';
import emailjs from '@emailjs/browser';

// EmailJS function
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

// User functions
export async function createUser(userData: User): Promise<boolean> {
    const url = userData ? ApiUrls.createUser : '';

    try {
        const response = await api.apiPost(url, userData);
        return response.status;
    } catch (err) {
        console.log('Error creating user:', err);
        return false;
    }
}