# Moshaver — System Specification

## 1. Product objective

Moshaver is intended to reduce the complexity and pressure of Konkoor preparation by maintaining a clear model of the student's past, present, and future work and using that state to produce a personalized study plan.

The study-planning system is the central component. Recovery/lifestyle and psychological information can influence planning, while the AI layer operates across the system and maintains context about the student's academic state, resources, exams, and history.

## 2. MVP hypothesis

Can the system take a student's academic state and produce a useful personalized study plan, then modify that plan when the student's actual behavior deviates from the plan?

## 3. MVP scope

The first implementation will focus on:

1. A structured representation of a student's academic state.
2. A structured representation of one academic subject and its topics/resources.
3. A deterministic planner that converts student state into study tasks.
4. Recording whether planned work was completed, missed, or partially completed.
5. Recalculating future tasks after a deviation from the plan.
6. Automated tests for planner behavior.

The first implementation does **not** attempt to fully implement the chatbot, psychology module, recovery module, notifications, gamification, complete resource corpus, or polished frontend.

## 4. Core state

### 4.1 Student

The student record should eventually contain academic and behavioral information required by the planner.

Initial conceptual fields:

- identity/profile data
- subjects
- available study time
- study preferences/constraints
- academic progress
- current plan
- completed work
- missed work
- exam history
- study-session history
- lifestyle signals where relevant to planning

### 4.2 Academic model

The academic model represents:

```text
Subject
  -> Topic
      -> Subtopic
          -> Resource
          -> Assessment / Question
```

The model should eventually support prerequisite relationships and topic-level mastery/performance.

### 4.3 Tasks

A task is a concrete unit of planned work.

Conceptual fields:

- subject
- topic/resource
- task type
- planned duration
- planned date/time
- priority
- status
- completion evidence

Task types should support at least study, practice/test, correction, analysis, and exam-related work as the system evolves.

### 4.4 Study sessions

A study session records what actually happened rather than what was planned.

Initial conceptual fields:

- start/end or duration
- task reference
- subject/topic
- amount completed
- questions solved/pages covered where applicable
- self-reported state

## 5. Planner

The planner is initially deterministic.

Conceptual interface:

```python
plan = planner(student_state)
```

It should consider at minimum:

- topic mastery/performance
- prerequisite gaps
- outstanding work
- available time
- previously missed work
- upcoming assessments/deadlines

The planner must be understandable and testable before an LLM is introduced into decision-making.

## 6. Adaptive planning loop

```text
Student state
    -> Planner
    -> Planned tasks
    -> Actual student behavior
    -> State update
    -> Planner
    -> Revised future plan
```

A missed or incomplete task must be represented as state, not simply discarded. The planner decides how that deviation affects future work.

## 7. AI layer

The AI layer is not the first implementation target. Once the deterministic system exists, AI can be introduced to interpret unstructured information, communicate decisions, assist the student, and eventually contribute to more sophisticated planning decisions.

Any AI-generated planning decision should remain observable to the user and, where appropriate, capable of being accepted or rejected.

## 8. Data-first principle

The system should not depend on a model's memory of the student's situation. Important state belongs in structured application data and should be queryable by the planner.

## 9. Initial implementation boundary

The first working prototype should answer one question reliably:

> Given a known student state, can Moshaver produce a reasonable plan and adapt that plan after the student fails to follow it?

Everything outside this loop is secondary until this works.
