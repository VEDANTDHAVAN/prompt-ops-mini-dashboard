"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MODELS } from "@/app/prompt-migration/new/page";

export default function PromptEvaluationCreatePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [weights, setWeights] = useState({
    clarity: 1,
    specificity: 1,
    safety: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim() &&
    prompt.trim() &&
    models.length >= 2 &&
    Object.values(weights).every(w => w > 0);

  // Handlers
  function toggleModel(model: string) {
    setModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          prompt,
          models,
          weights,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create evaluation");
      }

      const evaluation = await res.json();
      router.push(`/prompt-evaluation/${evaluation.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // UI
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            New Prompt Evaluation
          </h1>
          <p className="text-sm text-muted-foreground">
            Compare prompt quality across multiple models
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border bg-card text-card-foreground p-6 space-y-6"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Evaluation Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Marketing prompt comparison"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Prompt */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={5}
              placeholder="Enter the prompt you want to evaluate"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Models */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Models (select at least 2)
            </p>

            <div className="grid grid-cols-2 gap-2">
              {MODELS.map(model => (
                <label
                  key={model}
                  className="flex items-center gap-2 rounded-md border p-2 text-sm
                             hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={models.includes(model)}
                    onChange={() => toggleModel(model)}
                  />
                  {model}
                </label>
              ))}
            </div>
          </div>

          {/* Weights */}
          <div className="space-y-4">
           <div>
           <p className="text-sm font-medium">
           Scoring Importance
           </p>
           <p className="text-xs text-muted-foreground">
           Set relative importance. Higher means more influence.
           Scores are normalized automatically.
           </p>
           </div>

          {(["clarity", "specificity", "safety"] as const).map(
           key => (
           <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
            <label className="text-sm capitalize">
            {key}
            </label>
            <span className="text-sm font-medium">
             {weights[key]}
            </span>
            </div>

         <input
          type="range" min={1} max={5}
          step={1} value={weights[key]}
          onChange={e => setWeights({
              ...weights,
              [key]: Number(e.target.value),
            })
          }
          className="w-full accent-primary cursor-pointer"
        />

         <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
         </div>
        </div>
        )
        )} 
    </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() =>
                router.push("/prompt-evaluation")
              }
              className="text-sm text-muted-foreground hover:underline"
            >
              ← Back to list
            </button>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2
                         text-primary-foreground font-medium transition
                         hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Evaluation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}