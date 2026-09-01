# Boom

Boom is an AI-powered study planning system for Iranian Konkoor students.

## Project goal

Build an adaptive planning engine that maintains a student's academic state, generates a personalized study plan, observes what actually happens, and recalculates the future plan when reality deviates from the plan.

## Current MVP hypothesis

> Can the system take a student's academic state and produce a genuinely useful personalized study plan, then modify that plan when reality deviates from it?

## Repository structure

```text
backend/    Core application and planning engine
frontend/   Frontend application
data/       Structured academic/content data
docs/       Product and technical specifications
tests/      Automated tests
```

## Development principle

The planning engine and underlying data model come before the LLM layer and UI polish. The first implementation should be deterministic, understandable, and testable.
