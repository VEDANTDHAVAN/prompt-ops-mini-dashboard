"use client";

import Spinner from "@/components/Spinner";
import StatusBadge from "@/components/StatusBadge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MigrationPrompt {
   id: string;
   source: string;
   migrated?: string; 
}

interface Migration {
  id: string;
  name: string;
  sourceModel: string;
  targetModel: string;
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "FAILED";
  createdAt: string;
  prompts: MigrationPrompt[];
}

export default function MigrationDetailPage({ params }:{
    params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [migration, setMigration] = useState<Migration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
 
  useEffect(() => {
    params.then(p => setMigrationId(p.id));
  }, [params]);

  async function fetchMigration() {
    try {
      if(!migrationId) return;  
      const res = await fetch(`/api/migrations/${migrationId}`);
      if(!res.ok) {
        throw new Error("Migration not found");
      }
      const data = await res.json();
      setMigration(data);
    } catch (error: any) {
      setError(error.message);  
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMigration();
  }, [migrationId]);

  useEffect(() => {
    if(!migration || migration.status !== "RUNNING") return;
    const interval = setInterval(fetchMigration, 1500);
    return () => clearInterval(interval);
  }, [migration]);

  // Start migration
  async function startMigration() {
    if(!migration) return;
    setStarting(true);

    await fetch(`/api/migrations/${migrationId}/start`, { method: "POST" });

    await fetchMigration();
    setStarting(false);
  }
  // Copy helper
  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  if(error || !migration) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
       <p className="text-destructive">{error || "Not found"}</p>
       <button onClick={() => router.push("/prompt-migration")} className="mt-4 text-sm underline">
        ← Back to list
       </button>
      </div>  
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {migration.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {migration.sourceModel} → {migration.targetModel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={migration.status} />

            {migration.status === "DRAFT" && (
              <button
                onClick={startMigration}
                disabled={starting}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2
                           text-primary-foreground font-medium transition
                           hover:bg-primary/90 disabled:opacity-50"
              >
                {starting && <Spinner size={14} />}
                Start Migration
              </button>
            )}
          </div>
        </header>

        {/* Metadata */}
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Created at:{" "}
          {new Date(migration.createdAt).toLocaleString()}
        </div>

        {/* Prompts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Prompts ({migration.prompts.length})
          </h2>

          {migration.prompts.map(p => (
            <div
              key={p.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Source Prompt
                </p>
                <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {p.source}
                </pre>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Migrated Prompt
                </p>

                {migration.status === "COMPLETED" && p.migrated ? (
                  <div className="relative">
                    <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                      {p.migrated}
                    </pre>
                    <button
                      onClick={() => copy(p.migrated!)}
                      className="absolute top-2 right-2 text-xs underline"
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground flex items-center gap-2">
                    {migration.status === "RUNNING" && (
                      <Spinner size={14} />
                    )}
                    {migration.status === "DRAFT"
                      ? "Not started yet"
                      : "Migrating…"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4">
          <button
            onClick={() => router.push("/prompt-migration")}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to list
          </button>
        </div>
      </div>
    </div>
  );
} 