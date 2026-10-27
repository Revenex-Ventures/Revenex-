import type { RequestHandler } from "express";
import { z } from "zod";

const text = (max = 200) => z.string().trim().min(1).max(max);
const optional = (max = 200) => z.string().trim().max(max).optional();
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((v) => v.toLowerCase());
const password = z
  .string()
  .min(8)
  .max(72)
  .refine(
    (v) => Buffer.byteLength(v, "utf8") <= 72,
    "Password must be at most 72 UTF-8 bytes",
  );
export const schemas = {
  signup: z.object({
    name: text(100),
    email,
    password,
    phone: optional(30),
    school: optional(),
  }),
  login: z.object({ email, password: z.string().min(1).max(256) }),
  google: z.object({ credential: z.string().min(1).max(10000) }),
  forgot: z.object({ email }),
  reset: z.object({ token: z.string().regex(/^[a-f0-9]{64}$/), password }),
  contact: z.object({
    name: text(100),
    email,
    institution: optional(),
    subject: optional(),
    message: text(5000),
  }),
  demo: z.object({
    name: text(100),
    schoolName: text(),
    email,
    type: optional(50),
    phone: optional(30),
    city: optional(100),
    students: optional(50),
    preferredDate: optional(30),
    preferredTime: optional(30),
    message: optional(5000),
  }),
  review: z.object({
    name: text(100),
    role: text(100),
    school: text(),
    content: text(3000),
    rating: z.number().int().min(1).max(5),
  }),
  chat: z.object({
    message: text(2000),
    language: z.enum(["en", "hi"]).default("en"),
  }),
};

export function validateBody(schema: z.ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      res.status(400).json({ message, error: message });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}
