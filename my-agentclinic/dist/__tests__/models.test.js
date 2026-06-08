import { describe, it, expect } from 'vitest';
import { agentSchema, ailmentSchema, therapySchema, appointmentSchema, } from '../schemas/index.js';
const VALID_UUID_1 = '123e4567-e89b-12d3-a456-426614174000';
const VALID_UUID_2 = '550e8400-e29b-41d4-a716-446655440000';
const VALID_UUID_3 = '3b241101-e2bb-4255-8caf-4136c566a962';
const VALID_UUID_4 = '4f76269b-3c46-4e50-93ad-ff110058b8f2';
describe('Agent Validation Schema', () => {
    it('should pass validation for a valid agent', () => {
        const validAgent = {
            id: VALID_UUID_1,
            name: 'Dr. GPT',
            model: 'gpt-4o',
            temperature: 0.7,
            systemPromptLength: 1500,
        };
        const result = agentSchema.safeParse(validAgent);
        expect(result.success).toBe(true);
    });
    it('should fail validation when temperature is less than 0', () => {
        const invalidAgent = {
            id: VALID_UUID_1,
            name: 'Dr. GPT',
            model: 'gpt-4o',
            temperature: -0.1,
            systemPromptLength: 1500,
        };
        const result = agentSchema.safeParse(invalidAgent);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('temperature');
        }
    });
    it('should fail validation when temperature is greater than 2', () => {
        const invalidAgent = {
            id: VALID_UUID_1,
            name: 'Dr. GPT',
            model: 'gpt-4o',
            temperature: 2.1,
            systemPromptLength: 1500,
        };
        const result = agentSchema.safeParse(invalidAgent);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('temperature');
        }
    });
    it('should fail validation when system prompt length is negative', () => {
        const invalidAgent = {
            id: VALID_UUID_1,
            name: 'Dr. GPT',
            model: 'gpt-4o',
            temperature: 1.0,
            systemPromptLength: -5,
        };
        const result = agentSchema.safeParse(invalidAgent);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('systemPromptLength');
        }
    });
});
describe('Ailment Validation Schema', () => {
    it('should pass validation for a valid ailment', () => {
        const validAilment = {
            id: VALID_UUID_2,
            title: 'Hallucination Fever',
            description: 'Spits out confident nonsense at 100 degrees Celsius',
            severity: 'medium',
        };
        const result = ailmentSchema.safeParse(validAilment);
        expect(result.success).toBe(true);
    });
    it('should fail validation with invalid severity level', () => {
        const invalidAilment = {
            id: VALID_UUID_2,
            title: 'Hallucination Fever',
            description: 'Spits out confident nonsense',
            severity: 'extreme', // invalid
        };
        const result = ailmentSchema.safeParse(invalidAilment);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('severity');
        }
    });
});
describe('Therapy Validation Schema', () => {
    it('should pass validation for a valid therapy', () => {
        const validTherapy = {
            id: VALID_UUID_3,
            name: 'Context Window Reset',
            description: 'Wipe all conversation history to clear short-term memory.',
            costInTokens: 2000,
        };
        const result = therapySchema.safeParse(validTherapy);
        expect(result.success).toBe(true);
    });
    it('should fail validation with negative token cost', () => {
        const invalidTherapy = {
            id: VALID_UUID_3,
            name: 'Context Window Reset',
            description: 'Wipe all conversation history to clear short-term memory.',
            costInTokens: -1,
        };
        const result = therapySchema.safeParse(invalidTherapy);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('costInTokens');
        }
    });
});
describe('Appointment Validation Schema', () => {
    it('should pass validation for a valid appointment with Date object', () => {
        const validAppointment = {
            id: VALID_UUID_4,
            agentId: VALID_UUID_1,
            ailmentId: VALID_UUID_2,
            therapyId: VALID_UUID_3,
            scheduledTime: new Date(),
            status: 'pending',
        };
        const result = appointmentSchema.safeParse(validAppointment);
        expect(result.success).toBe(true);
    });
    it('should pass validation for a valid appointment with ISO string', () => {
        const validAppointment = {
            id: VALID_UUID_4,
            agentId: VALID_UUID_1,
            ailmentId: VALID_UUID_2,
            therapyId: VALID_UUID_3,
            scheduledTime: '2026-06-08T14:20:32Z',
            status: 'scheduled',
        };
        const result = appointmentSchema.safeParse(validAppointment);
        expect(result.success).toBe(true);
    });
    it('should fail validation with invalid status value', () => {
        const invalidAppointment = {
            id: VALID_UUID_4,
            agentId: VALID_UUID_1,
            ailmentId: VALID_UUID_2,
            therapyId: VALID_UUID_3,
            scheduledTime: new Date(),
            status: 'active', // invalid status
        };
        const result = appointmentSchema.safeParse(invalidAppointment);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('status');
        }
    });
    it('should fail validation with malformed UUID/ID properties', () => {
        const invalidAppointment = {
            id: 'malformed-uuid',
            agentId: VALID_UUID_1,
            ailmentId: VALID_UUID_2,
            therapyId: VALID_UUID_3,
            scheduledTime: new Date(),
            status: 'pending',
        };
        const result = appointmentSchema.safeParse(invalidAppointment);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('id');
        }
    });
});
