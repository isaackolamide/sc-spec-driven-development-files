# Implementation Roadmap: AgentClinic

High-level implementation order broken down into very small, incremental phases of work:

## Phase 1: Foundational Setup & Models

- Initialize the TypeScript project and project layout.
- Define TypeScript interfaces and schemas for core resources:
  - `Agent` (Name, Model, Temperature, System Prompt length)
  - `Ailment` (Title, Description, Severity)
  - `Therapy` (Name, Description, Cost in Tokens)
  - `Appointment` (Agent ID, Ailment ID, Therapy ID, Scheduled Time, Status)

## Phase 2: Database Initialization & Seeding

- Initialize SQLite database setup.
- Define SQLite tables matching the schemas from Phase 1.
- Write a seed script to populate default data:
  - Standard ailments (e.g., "Hallucination Fever", "Token Limit Depletion", "Prompt Injection Stress")
  - Recommended therapies (e.g., "System Instruction Refactoring", "Cooling Period/Sleep", "Context Window Reset")

## Phase 3: Core API Endpoints

- Implement REST API endpoints:
  - `GET /api/ailments` & `GET /api/therapies` to fetch available treatments and diagnoses.
  - `POST /api/agents` to register a new agent.
  - `POST /api/appointments` to schedule an appointment.
  - `GET /api/appointments` to list all scheduled appointments for the staff dashboard.

## Phase 4: Frontend Landing Page & Booking UI

- Implement an attractive, modern UI with dark-mode styling and glassmorphism.
- Create the Agent Intake Form:
  - Select/enter agent characteristics.
  - Choose diagnosed ailment and desired therapy.
  - Select date/time to book an appointment.

## Phase 5: Clinic Dashboard & Appointment Management

- Build the clinic staff dashboard to display list of active and pending appointments.
- Allow staff to update status of appointments (e.g., "Completed", "In Progress", "Cancelled").
- Polish UI transitions, hover states, and micro-animations.
