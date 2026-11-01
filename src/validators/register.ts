import * as z from 'zod';

export const registerSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: z.email(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(32, { message: 'Password cannot exceed 32 characters' })

        .refine((val) => /[A-Z]/.test(val), {
            message: 'Must contain at least one uppercase letter',
        })
        .refine((val) => /[a-z]/.test(val), {
            message: 'Must contain at least one lowercase letter',
        })
        .refine((val) => /[0-9]/.test(val), {
            message: 'Must contain at least one number',
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: 'Must contain at least one special character',
        }),
});
