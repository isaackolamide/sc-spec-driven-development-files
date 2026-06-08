import { z } from 'zod';
import {
  agentSchema,
  ailmentSchema,
  therapySchema,
  appointmentSchema,
} from '../schemas/index.js';

export type Agent = z.infer<typeof agentSchema>;
export type Ailment = z.infer<typeof ailmentSchema>;
export type Therapy = z.infer<typeof therapySchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
