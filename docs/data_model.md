# Boom — Initial Data Model

This is the first conceptual data model. It is intentionally small and will evolve as the planner is implemented.

## Entities

### Student

Represents the person whose study plan is being generated.

Initial attributes:

- id
- profile
- availability
- study_preferences
- subjects
- current_plan_id

### Subject

An academic subject such as mathematics or physics.

Initial attributes:

- id
- name
- topics

### Topic

A unit of academic knowledge within a subject.

Initial attributes:

- id
- subject_id
- name
- parent_topic_id (nullable)
- prerequisite_topic_ids
- mastery
- priority
- resources

### Resource

A book, chapter, lesson, question set, or other study source.

Initial attributes:

- id
- type
- title
- topic_ids
- sections

### Task

A concrete unit of planned work.

Initial attributes:

- id
- student_id
- subject_id
- topic_id
- resource_id (nullable)
- type
- duration_minutes
- scheduled_for
- priority
- status

### StudySession

A record of actual study activity.

Initial attributes:

- id
- student_id
- task_id (nullable)
- subject_id
- topic_id
- started_at
- ended_at
- duration_minutes
- completion_data

### Assessment

An exam/test event and its results.

Initial attributes:

- id
- student_id
- title
- date
- source
- results

### Plan

A generated collection of tasks for a time period.

Initial attributes:

- id
- student_id
- generated_at
- start_date
- end_date
- task_ids
- planner_version

## Relationships

```text
Student
  |
  +-- Subjects
  |     +-- Topics
  |           +-- Prerequisites
  |           +-- Resources
  |
  +-- Plans
  |     +-- Tasks
  |
  +-- StudySessions
  |
  +-- Assessments
```

## Core invariant

The planner should derive decisions from structured state. A Task records what was planned; a StudySession records what actually happened. The difference between the two is important input to future planning.

## Deliberately deferred

The following are not part of the initial schema unless implementation proves they are necessary:

- detailed psychological profiles
- full lifestyle history
- chat transcripts as authoritative state
- gamification state
- notification state
- complete question-level knowledge graphs
