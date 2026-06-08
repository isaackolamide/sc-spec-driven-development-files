# Implementation Roadmap: AgentClinic

High-level implementation order broken down into very small, incremental phases of work:

## Phase 1: Foundational Setup & Models

- Initialize the TypeScript project and project layout.
- Define TypeScript interfaces and schemas for core resources:
  - `Agent` (Name, Model, Temperature, System Prompt length)
  - `Ailment` (Title, Description, Severity)
  - `Therapy` (Name, Description, Cost in Tokens)
  - `Appointment` (Agent ID, Ailment ID, Therapy ID, Scheduled Time, Status)
- **Validation**: Implement and run Vitest unit tests verifying that entity schemas accurately reject invalid properties and boundaries.

## Phase 2: Database Initialization & Seeding

- Initialize SQLite database setup.
- Define SQLite tables matching the schemas from Phase 1.
- Write a seed script to populate default data:
  - Standard ailments (e.g., "Hallucination Fever", "Token Limit Depletion", "Prompt Injection Stress")
  - Recommended therapies (e.g., "System Instruction Refactoring", "Cooling Period/Sleep", "Context Window Reset")
- **Validation**: Implement Vitest database integration tests verifying correct table schema, row population, and seed integrity.

## Phase 3: Core API Endpoints

- Implement REST API endpoints:
  - `GET /api/ailments` & `GET /api/therapies` to fetch available treatments and diagnoses.
  - `POST /api/agents` to register a new agent.
  - `POST /api/appointments` to schedule an appointment.
  - `GET /api/appointments` to list all scheduled appointments for the staff dashboard.
- **Validation**: Implement API route integration tests using Vitest (sending mock requests to Hono app) to assert correct response status codes, payload structures, and error handling.

## Phase 4: Frontend Landing Page & Booking UI

- Implement an attractive, modern UI with dark-mode styling and glassmorphism.
- Ensure the layout is fully responsive, adapting seamlessly to mobile, tablet, and desktop viewports.
- Create the Agent Intake Form:
  - Select/enter agent characteristics.
  - Choose diagnosed ailment and desired therapy.
  - Select date/time to book an appointment.
- **Validation**: Write tests validating form submission behaviors, user input constraints, and client-side error states. Verify layout responsiveness across different simulated screen dimensions.

## Phase 5: Clinic Dashboard & Appointment Management

- Build the clinic staff dashboard to display list of active and pending appointments.
- Ensure all dashboard tables, stats cards, and action buttons are fully responsive on small screens.
- Allow staff to update status of appointments (e.g., "Completed", "In Progress", "Cancelled").
- Polish UI transitions, hover states, and micro-animations.
- **Validation**: Verify end-to-end appointment lifecycle status changes and dashboard list updates using integration tests. Validate responsiveness of the interactive dashboard under mobile/tablet widths.
