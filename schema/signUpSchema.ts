import * as z from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.email({ pattern: z.regexes.rfc5322Email }),
  password: z.string().min(6),
});

export type signUpSchema = z.infer<typeof signUpSchema>;
