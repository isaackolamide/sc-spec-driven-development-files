# Implementation Plan: Phase 1 (Foundational Setup & Models)

This plan details the tasks required to set up the runtime environment and implement the data models.

## Task Group 1: Environment & Configuration

1. **Install Dependencies**: Install `zod` as a production dependency. Install `vitest` as a development dependency.
2. **Configure TypeScript**: Ensure `tsconfig.json` specifies `"strict": true` and appropriate module/moduleResolution targeting (e.g., `NodeNext` or `Node16` or `esnext`).
3. **Configure Package Scripts**: Add `test` (running `vitest run`) and `build` (running `tsc`) to the `package.json` scripts section if not present.

## Task Group 2: Implement Types & Schemas

1. **Create Types File**: Create `src/types/index.ts` containing TypeScript definitions for the entities:
   - `Agent`
   - `Ailment`
   - `Therapy`
   - `Appointment`
2. **Create Schemas File**: Create `src/schemas/index.ts` containing the corresponding Zod schemas:
   - `agentSchema`
   - `ailmentSchema`
   - `therapySchema`
   - `appointmentSchema`
3. **Link Types & Schemas**: Ensure the TypeScript types are aligned with Zod's inferred types (using `z.infer<typeof schema>`) or explicitly checked to match.

## Task Group 3: Testing & Verification

1. **Write Unit Tests**: Create `src/__tests__/models.test.ts` with test suites checking:
   - **Positive Tests**: Valid object inputs pass schema validation.
   - **Negative Tests**: Invalid inputs (e.g. negative `costInTokens`, out-of-range `temperature`, invalid `status`) throw Zod validation errors.
2. **Verify Build**: Run TypeScript compilation (`npm run build`) to ensure zero type errors.
3. **Run Test Suite**: Run `npm run test` to confirm all validation assertions pass successfully.
