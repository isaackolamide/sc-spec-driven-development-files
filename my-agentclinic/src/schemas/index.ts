import { z } from 'zod';

export const agentSchema = z.object({
  id: z.string().uuid({ message: "Invalid Agent ID (must be a valid UUID)" }),
  name: z.string().min(1, { message: "Name must not be empty" }),
  model: z.string().min(1, { message: "Model must not be empty" }),
  temperature: z.number().min(0.0).max(2.0, { message: "Temperature must be between 0.0 and 2.0" }),
  systemPromptLength: z.number().int().nonnegative({ message: "System prompt length must be a non-negative integer" }),
});

export const ailmentSchema = z.object({
  id: z.string().uuid({ message: "Invalid Ailment ID (must be a valid UUID)" }),
  title: z.string().min(1, { message: "Title must not be empty" }),
  description: z.string().min(1, { message: "Description must not be empty" }),
  severity: z.enum(['low', 'medium', 'high'], { message: "Severity must be 'low', 'medium', or 'high'" }),
});

export const therapySchema = z.object({
  id: z.string().uuid({ message: "Invalid Therapy ID (must be a valid UUID)" }),
  name: z.string().min(1, { message: "Name must not be empty" }),
  description: z.string().min(1, { message: "Description must not be empty" }),
  costInTokens: z.number().int().nonnegative({ message: "Cost in tokens must be a non-negative integer" }),
});

export const appointmentSchema = z.object({
  id: z.string().uuid({ message: "Invalid Appointment ID (must be a valid UUID)" }),
  agentId: z.string().uuid({ message: "Invalid Agent ID reference (must be a valid UUID)" }),
  ailmentId: z.string().uuid({ message: "Invalid Ailment ID reference (must be a valid UUID)" }),
  therapyId: z.string().uuid({ message: "Invalid Therapy ID reference (must be a valid UUID)" }),
  scheduledTime: z.union([
    z.date(),
    z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid ISO 8601 date string" }),
  ]),
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled'], {
    message: "Status must be 'pending', 'scheduled', 'completed', or 'cancelled'",
  }),
});
