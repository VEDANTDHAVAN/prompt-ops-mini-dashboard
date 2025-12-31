"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MODELS = [
  "GPT-4.1",
  "GPT-5.2",
  "Claude 3.5",
  "Gemini 1.5",
  "Llama 3",
  "Mistral Large",
  "Cohere Command R",
  "DeepSeek V2",
  "Qwen 2.5",
];

export default function NewMigrationPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [sourceModel, setSourceModel] = useState("");
    const [targetModel, setTargetModel] = useState("");
    const [prompts, setPrompts] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = name.trim() && sourceModel && targetModel &&
      sourceModel !== targetModel && prompts.trim();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
          const res = await fetch("/api/migrations", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, sourceModel, targetModel, notes,
                prompts: prompts.split("\n").map(p => p.trim()).filter(Boolean),
            }),
          });
          
          if(!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to create migration");
          }

          const migration = await res.json();
          router.push(`/prompt-migration/${migration.id}`);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }  

    return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            New Prompt Migration
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a job to migrate prompts from one model to another
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
              Migration Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. GPT-4 → GPT-5 migration"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Source Model
              </label>
              <select
                value={sourceModel}
                onChange={e => setSourceModel(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select model</option>
                {MODELS.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Target Model
              </label>
              <select
                value={targetModel}
                onChange={e => setTargetModel(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select model</option>
                {MODELS.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sourceModel &&
            targetModel &&
            sourceModel === targetModel && (
              <p className="text-sm text-destructive">
                Source and target models must be different.
              </p>
            )}

          {/* Prompts */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Prompts to Migrate
            </label>
            <textarea
              value={prompts}
              onChange={e => setPrompts(e.target.value)}
              placeholder="Enter one prompt per line"
              rows={6}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <p className="text-xs text-muted-foreground">
              Each line will be treated as a separate prompt.
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional context for this migration"
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => router.push("/prompt-migration")}
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
              {loading ? "Creating…" : "Create Migration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}