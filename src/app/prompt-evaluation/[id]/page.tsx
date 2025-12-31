"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import Spinner from "@/components/Spinner";

interface EvaluationResult {
  model: string;
  clarity: number;
  specificity: number;
  safety: number;
  overall: number;
}

interface Evaluation {
  id: string;
  name: string;
  prompt: string;
  models: string[];
  weights: {
    clarity: number;
    specificity: number;
    safety: number;
  };
  status: "QUEUED" | "RUNNING" | "DONE" | "ERROR";
  results?: EvaluationResult[];
  createdAt: string;
}

export default function PromptEvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Resolve params
  useEffect(() => {
    params.then(p => setEvaluationId(p.id));
  }, [params]);
  // Fetch evaluation
  async function fetchEvaluation() {
    if (!evaluationId) return;

    try {
      const res = await fetch(
        `/api/evaluations/${evaluationId}`
      );
      if (!res.ok) {
        throw new Error("Evaluation not found");
      }
      const data = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvaluation();
  }, [evaluationId]);

  // Poll while RUNNING
  useEffect(() => {
    if (!evaluation || evaluation.status !== "RUNNING") return;

    const interval = setInterval(fetchEvaluation, 1500);
    return () => clearInterval(interval);
  }, [evaluation]);

  // Run evaluation
  async function runEvaluation() {
    if (!evaluationId) return;
    setRunning(true);

    await fetch(`/api/evaluations/${evaluationId}/run`, {
      method: "POST",
    });

    await fetchEvaluation();
    setRunning(false);
  }

  // Export JSON
  function exportJSON() {
    if (!evaluation) return;

    const blob = new Blob(
      [JSON.stringify(evaluation, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${evaluation.name}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  // UI states
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => router.push("/prompt-evaluation")}
          className="mt-4 text-sm underline"
        >
          ← Back to list
        </button>
      </div>
    );
  }

  const bestScore = evaluation.results
    ? Math.max(...evaluation.results.map(r => r.overall))
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {evaluation.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Prompt evaluation across multiple models
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={evaluation.status} />

            {evaluation.status === "QUEUED" && (
              <button
                onClick={runEvaluation}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2
                           text-primary-foreground font-medium transition
                           hover:bg-primary/90 disabled:opacity-50"
              >
                {running && <Spinner size={14} />}
                Run Evaluation
              </button>
            )}

            {evaluation.status === "DONE" && (
              <button
                onClick={exportJSON}
                className="rounded-md border px-3 py-2 text-sm
                           hover:bg-accent transition"
              >
                Export JSON
              </button>
            )}
          </div>
        </header>

        {/* Prompt */}
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="text-sm font-medium">Prompt</p>
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
            {evaluation.prompt}
          </pre>
        </div>

        {/* Rubric */}
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium mb-2">
            Scoring Rubric (Weights)
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Clarity: {evaluation.weights.clarity}</li>
            <li>Specificity: {evaluation.weights.specificity}</li>
            <li>Safety: {evaluation.weights.safety}</li>
          </ul>
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-muted text-muted-foreground text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Model
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Clarity
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Specificity
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Safety
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Overall
                </th>
              </tr>
            </thead>

            <tbody>
              {evaluation.results?.map(r => (
                <tr
                  key={r.model}
                  className={`border-b transition ${
                    r.overall === bestScore
                      ? "bg-green-500/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {r.model}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {r.clarity}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {r.specificity}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {r.safety}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {r.overall}
                  </td>
                </tr>
              ))}

              {evaluation.status !== "DONE" && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    {evaluation.status === "RUNNING" ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size={16} />
                        Evaluating…
                      </div>
                    ) : (
                      "Evaluation has not been run yet."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <button
            onClick={() => router.push("/prompt-evaluation")}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to list
          </button>
        </div>
      </div>
    </div>
  );
}
