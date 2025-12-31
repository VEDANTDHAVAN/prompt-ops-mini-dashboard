// Typescript entity types

export type MigrationStatus =
  | "DRAFT"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface MigrationPrompt {
  id: string;
  source: string;
  migrated?: string;
}

export interface Migration {
  id: string;
  name: string;
  sourceModel: string;
  targetModel: string;
  status: MigrationStatus;
  createdAt: string;
  prompts: MigrationPrompt[];
}

export type EvaluationStatus =
  | "QUEUED"
  | "RUNNING"
  | "DONE"
  | "ERROR";

export interface EvaluationResult {
  model: string;
  clarity: number;
  specificity: number;
  safety: number;
  overall: number;
}

export interface Evaluation {
  id: string;
  name: string;
  prompt: string;
  models: string[];
  weights: {
    clarity: number;
    specificity: number;
    safety: number;
  };
  status: EvaluationStatus;
  results?: EvaluationResult[];
  createdAt: string;
}
