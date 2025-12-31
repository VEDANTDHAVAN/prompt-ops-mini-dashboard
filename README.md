# Prompt Ops Mini-Dashboard (Next.js)

A lightweight **Prompt Operations dashboard** built with **Next.js App Router**, demonstrating how teams can **migrate prompts between models** and **evaluate prompt quality across multiple LLMs** using a clean, extensible workflow.

This project focuses on **system design, async workflows, and UX correctness**, rather than raw LLM performance.

---

## ✨ Features

### Prompt Migration

* Create prompt migration jobs between source and target models
* Async job execution with lifecycle states:

  * `DRAFT → RUNNING → COMPLETED`
* Row-level loading indicators
* Detail view showing source vs migrated prompts
* Copy-to-clipboard for migrated prompts

### Prompt Evaluation

* Create evaluations across multiple models
* Configurable **relative scoring weights** (clarity, specificity, safety)
* Async evaluation runs:

  * `QUEUED → RUNNING → DONE`
* Rubric-based scoring (0–100)
* Best-model highlighting
* Export results as JSON (bonus)

---

## 🧱 Architecture Overview

* **Next.js App Router** (v15+ compatible)
* **Route Handlers** for API endpoints
* **In-memory data store** (mocked persistence)
* **Client components** for interactivity
* **Reusable UI components**:

  * `<DataTable />` (shared list layout)
  * `<TableSkeleton />` (loading states)
  * `<StatusBadge />`, `<Spinner />`
* **tweakcn / shadcn-style theming** with semantic tokens

---

## 📁 Project Structure (Simplified)

```
src/
├── app/
│   ├── prompt-migration/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── prompt-evaluation/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   └── api/
│       ├── migrations/
│       │   ├── route.ts
│       │   └── [id]/
|       |        ├── route.ts 
|       |        └── start/route.ts
|       |            
│       └── evaluations/
│       │   ├── route.ts
│       │   └── [id]/
|       |        ├── route.ts 
|       |        └── run/route.ts
├── components/
│   ├── DataTable.tsx
│   ├── TableSkeleton.tsx
│   ├── StatusBadge.tsx
|   ├── Pagination.tsx 
│   └── Spinner.tsx
├── lib/
│   ├── models.ts
|   ├── query.ts
│   ├── scoring.ts
|   ├── scoring.test.ts
|   ├── store.ts
│   └── utils.ts
```

---

## 🔌 API Endpoints

### Prompt Migration

* `GET /api/migrations` — list migrations
* `POST /api/migrations` — create migration
* `GET /api/migrations/:id` — migration detail
* `POST /api/migrations/:id/start` — start migration

### Prompt Evaluation

* `GET /api/evaluations` — list evaluations
* `POST /api/evaluations` — create evaluation
* `GET /api/evaluations/:id` — evaluation detail
* `POST /api/evaluations/:id/run` — run evaluation

All async behavior is simulated to demonstrate workflow handling.

---

## ⚖️ Scoring Logic (Prompt Evaluation)

* Each criterion (clarity, specificity, safety) is scored in the range **60–100**
* User inputs **relative importance weights**
* Weights are **normalized internally**
* Overall score is a weighted average in the range **0–100**

This ensures:

* Mathematical correctness
* Intuitive UX
* Reviewer-friendly explainability

---

## 🧪 Testing

* Lightweight **Jest + ts-jest** setup
* Focused unit tests for:

  * Scoring normalization logic
  * Query parameter utilities
* Manual testing for all critical UI flows

Example test coverage:

* Overall score always within `0–100`
* Query params update correctly

This balances confidence without over-engineering.

---

## ♿ Accessibility

* Semantic labels for all inputs
* Keyboard-friendly forms
* Accessible sliders for scoring weights
* Clear focus states and readable empty/loading states

---

## 🚀 Deployment

The application is deployed on **Vercel**.

> **Note:**
> This project uses **in-memory storage** for migrations and evaluations.
> Data resets on redeploy or cold starts.
> This is intentional for the scope of the assignment.

In a production system, this layer would be replaced with persistent storage (e.g. PostgreSQL, Redis, or a job queue).

---

## ▶️ Demo Video (Optional)

A short (1–2 minute) screencast demonstrates:

1. Creating a prompt migration
2. Running the migration and viewing results
3. Creating a prompt evaluation
4. Running evaluation and comparing model scores

*(Link to video can be added here.)*

---

## 🧠 Design Decisions & Trade-offs

* **In-memory store** instead of a database for simplicity
* **Mocked async jobs** to focus on workflow and UX
* **Selective abstraction** (DataTable, Skeletons) to avoid premature complexity
* **Client-side polling** instead of WebSockets for clarity

These choices keep the project focused, readable, and easy to extend.

---

## 🏁 Conclusion

This mini-dashboard demonstrates:

* Async job lifecycle handling
* Clean Next.js App Router usage
* Thoughtful UX and accessibility
* Practical abstraction and testing discipline

It is designed to be **easy to reason about**, **easy to review**, and **easy to extend**.