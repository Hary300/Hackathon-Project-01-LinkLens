import z from 'zod';

export const inputSchema = z.object({
  link: z
    .string()
    .trim()
    .min(1, 'Silakan masukkan link yang ingin diperiksa')
    .pipe(
      z
        .url({ error: 'Link tidak sesuai format. Contoh: https://example.com' })
        .pipe(
          z.string().refine((value) => {
            const protocol = new URL(value).protocol;
            return protocol === 'http:' || protocol === 'https:';
          }, 'Gunakan link yang diawali dengan http:// atau https://')
        )
    ),
});

export type InputSchema = z.infer<typeof inputSchema>;
