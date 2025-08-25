import * as z from 'zod';

export const signInSchema = z.object({
  email: z.email({ pattern: z.regexes.rfc5322Email }),
  password: z.string().min(2),
});

export type signInSchema = z.infer<typeof signInSchema>;
