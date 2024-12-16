import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginFormData = z.infer<typeof loginSchema>;
export type AuthMethod = 'password' | 'magic-link' | 'email-otp';

export const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
