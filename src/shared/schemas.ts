import { z } from "zod";

export const createPostSchema = z.object({
  name: z.string().trim().min(1).max(50),
  content: z.string().trim().min(1).max(500),
});

export const createBoardSchema = z.object({
  name: z.string().trim().min(1).max(100),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .refine((s) => {
      try {
        return new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
      } catch {
        return false;
      }
    }, "Date must be a valid calendar date"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
