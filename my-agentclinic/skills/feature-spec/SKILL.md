---
name: feature-spec
description: Identifies the next implementation phase, creates a feature branch, and generates feature specs (plan, requirements, validation) after interviewing the user.
---

# Feature Spec Skill

This skill guides the agent in scoping and starting a new implementation phase by defining the requirements, plan, and validation criteria.

## When to use
Use this skill when starting the next phase of the implementation roadmap and setting up the corresponding specification files.

## Step-by-Step Instructions

1. **Identify the Next Phase**:
   - Inspect [roadmap.md](file:///Users/isaac-bp/Documents/Projects/grow/sc-spec-driven-development-files/my-agentclinic/specs/roadmap.md) to locate the next unimplemented phase of work.
   - Determine the name of the feature (e.g., `database-initialization-seeding`).

2. **Create a Feature Branch**:
   - Create and checkout a new Git branch for the feature (e.g., `feature/database-initialization-seeding`).

3. **Interview the User**:
   - You **must** use the `ask_question` tool or recommend the `/grill-me` command to clarify the requirements, plan, and validation criteria before writing the spec files to disk.
   - Group the questions into these three topics:
     - **Requirements**: Scope, decisions, context.
     - **Plan**: A series of numbered task groups.
     - **Validation**: Exit criteria and verification checks.

4. **Create the Spec Directory**:
   - Create a new directory under `specs/` named `YYYY-MM-DD-feature-name`, where `YYYY-MM-DD` is the current local date and `feature-name` is the kebab-case name of the feature (e.g., `2026-06-08-database-initialization-seeding`).

5. **Generate Spec Files**:
   - In the newly created directory, write:
     - `requirements.md`: Describing scope, key decisions, and context.
     - `plan.md`: Describing the implementation plan as a series of numbered task groups.
     - `validation.md`: Describing how to know the implementation succeeded and can be merged.
   - Ensure the specs align with the guidance in [mission.md](file:///Users/isaac-bp/Documents/Projects/grow/sc-spec-driven-development-files/my-agentclinic/specs/mission.md) and [tech-stack.md](file:///Users/isaac-bp/Documents/Projects/grow/sc-spec-driven-development-files/my-agentclinic/specs/tech-stack.md).
