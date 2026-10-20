import z from 'zod';

export const inputSchema = z.object({
  link: z.string().trim().min(1, 'Enter the link'),
});

export type InputSchema = z.infer<typeof inputSchema>;
