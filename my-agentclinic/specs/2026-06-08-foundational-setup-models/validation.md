# Validation & Acceptance Criteria: Phase 1 (Foundational Setup & Models)

This document outlines the validation criteria required to verify that the foundational setup and models have been correctly implemented.

## Verification Checklist

### 1. Build Verification

- Running `npm run build` must complete with a `0` exit code.
- No TypeScript compiler warnings or errors should be present.
- Output files must be correctly generated in the build output directory (`dist/`).

### 2. Test Verification

- Running `npm run test` (via Vitest) must pass all assertions.
- Test suite in `src/__tests__/models.test.ts` must explicitly verify:
  - **Agent Validation**:
    - Valid agent configuration.
    - Invalid temperature (e.g., `< 0` or `> 2`).
    - Negative system prompt length.
  - **Ailment Validation**:
    - Valid ailment configuration.
    - Invalid severity level (must be `"low"`, `"medium"`, or `"high"`).
  - **Therapy Validation**:
    - Valid therapy configuration.
    - Negative token cost.
  - **Appointment Validation**:
    - Valid appointment configuration.
    - Invalid status value (must be `"pending"`, `"scheduled"`, `"completed"`, or `"cancelled"`).
    - Missing or malformed UUID/ID properties.

### 3. Code Quality & Integration Check

- Verify that TypeScript files use explicit import and export statements.
- Ensure Zod validation schemas are imported into the unit test suite from `src/schemas/index.ts`.
- Ensure type definitions are imported from `src/types/index.ts` where necessary.
