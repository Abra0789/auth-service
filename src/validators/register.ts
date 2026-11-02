import * as z from 'zod';

export const registerSchema = z.object({
    firstName: z.string().trim().min(1, { message: 'First name is required.' }),

    lastName: z.string().trim().min(1, { message: 'Last name is required.' }),

    email: z.email({ message: 'Please provide a valid email address.' }),

    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .max(20, { message: 'Password cannot exceed 20 characters.' })
        .regex(/[A-Z]/, {
            message:
                'Password must contain at least one uppercase letter (A-Z).',
        })
        .regex(/[a-z]/, {
            message:
                'Password must contain at least one lowercase letter (a-z).',
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number (0-9).',
        })
        .regex(/[!@#$%^&*?]/, {
            message:
                'Password must contain at least one special character (!@#$%^&*?).',
        }),
});

export const validationErrorResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    errors: z.array(
        z.object({
            field: z.string(),
            message: z.string(),
        }),
    ),
});
