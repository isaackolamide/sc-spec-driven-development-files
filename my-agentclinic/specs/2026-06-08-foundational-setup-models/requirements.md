# Requirements: Phase 1 (Foundational Setup & Models)

## Context & Purpose

The goal of this phase is to establish the baseline codebase structure, type definitions, and schema validation rules for the AgentClinic application. By defining these core models up front with strict validation, we ensure subsequent database setup and API development are built on a robust, type-safe foundation.

## Functional Scope

### Core Data Models

We define four main entities. Each entity must have a TypeScript interface for type safety and a Zod schema for runtime validation:

1. **Agent**
   - `id`: UUID or unique string (generated upon registration).
   - `name`: String (non-empty).
   - `model`: String (non-empty, representing LLM name like `"gpt-4o"`, `"claude-3-opus"`, `"gemini-1.5-pro"`).
   - `temperature`: Number between `0.0` and `2.0` (inclusive).
   - `systemPromptLength`: Non-negative integer representing the length of the system prompt in characters.

2. **Ailment**
   - `id`: UUID or unique string.
   - `title`: String (non-empty, e.g., `"Hallucination Fever"`, `"Token Limit Depletion"`, `"Prompt Injection Stress"`).
   - `description`: String (non-empty details about the ailment).
   - `severity`: String enumeration representing the severity level: `"low" | "medium" | "high"`.

3. **Therapy**
   - `id`: UUID or unique string.
   - `name`: String (non-empty, e.g., `"System Instruction Refactoring"`, `"Cooling Period/Sleep"`, `"Context Window Reset"`).
   - `description`: String (non-empty details about what the therapy entails).
   - `costInTokens`: Non-negative integer representing the virtual token cost of the therapy session.

4. **Appointment**
   - `id`: UUID or unique string.
   - `agentId`: String (references an existing `Agent` ID).
   - `ailmentId`: String (references an existing `Ailment` ID).
   - `therapyId`: String (references an existing `Therapy` ID).
   - `scheduledTime`: Date or ISO 8601 Date String.
   - `status`: String enumeration representing the appointment status: `"pending" | "scheduled" | "completed" | "cancelled"`.

## Technical Decisions

- **TypeScript**: Use strict-mode TypeScript to enforce type checking at compile-time.
- **Zod**: Use Zod for schema construction to validate runtime boundaries (e.g., verifying `temperature` is inside `[0, 2]` and checking severity/status string unions).
- **Vitest**: Use Vitest for unit testing due to its speed and native TypeScript support.
- **NodeNext Module Resolution**: Target NodeNext for modular and modern module resolution.

## Non-Goals in This Phase

- Initializing the SQLite database or ORM connections.
- Creating the REST API endpoints.
- Building the frontend user interfaces.
