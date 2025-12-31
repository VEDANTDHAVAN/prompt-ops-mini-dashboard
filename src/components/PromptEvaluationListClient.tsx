"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { getParam, setParams } from "@/lib/query";

interface Evaluation {
  id: string;
  name: string;
  prompt: string;
  models: string[];
  status: "QUEUED" | "RUNNING" | "DONE" | "ERROR";
  createdAt: string;
  results?: {
    model: string;
    overall: number;
  }[];
}

export default function PromptEvaluationListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Query params
  const search = getParam(searchParams, "search", "");
  const status = getParam(searchParams, "status", "");
  const page = Number(getParam(searchParams, "page", "1"));
  const pageSize = Number(getParam(searchParams, "pageSize", "10"));
  // Data state
  const [data, setData] = useState<Evaluation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Fetch evaluations
  useEffect(() => {
    setLoading(true);
    fetch(`/api/evaluations?${searchParams.toString()}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setTotal(res.meta.total);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParams = (updates: Record<string, string | null>) => {
    router.push(
      `/prompt-evaluation?${setParams(searchParams, updates)}`
    );
  };
  // Helpers
  function overallScore(e: Evaluation) {
    if (!e.results || e.results.length === 0) return "—";
    const best = Math.max(...e.results.map(r => r.overall));
    return best;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Prompt Evaluations
            </h1>
            <p className="text-sm text-muted-foreground">
              Evaluate prompts across multiple models using scoring rubrics
            </p>
          </div>
          <div className="flex items-center gap-3">
          <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium
                         bg-background text-foreground
                         hover:bg-accent hover:text-accent-foreground transition">
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={() =>
              router.push("/prompt-evaluation/new")
            }
            className="inline-flex items-center rounded-md bg-primary px-4 py-2
                       text-primary-foreground font-medium transition
                       hover:bg-primary/90"
          >
            + New Evaluation
          </button>
         </div>
        </header>

        {/* Filters */}
        <div className="rounded-lg border bg-card p-4 flex flex-wrap gap-4 items-center">
          <input
            placeholder="Search evaluations…"
            value={search}
            onChange={e =>
              updateParams({ search: e.target.value, page: "1" })
            }
            className="w-64 rounded-md border bg-background px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <select
            value={status}
            onChange={e =>
              updateParams({
                status: e.target.value || null,
                page: "1",
              })
            }
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="QUEUED">Queued</option>
            <option value="RUNNING">Running</option>
            <option value="DONE">Done</option>
            <option value="ERROR">Error</option>
          </select>

          <select
            value={pageSize}
            onChange={e =>
              updateParams({
                pageSize: e.target.value,
                page: "1",
              })
            }
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          {loading ? (
            <div className="px-4 py-6 text-muted-foreground flex items-center gap-2">
              <Spinner size={16} />
              Loading evaluations…
            </div>
          ) : data.length === 0 ? (
            <div className="px-4 py-6 text-muted-foreground">
              No evaluations found.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-muted text-muted-foreground text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Prompt
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Models
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Best Score
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {data.map(e => (
                  <tr
                    key={e.id}
                    className={`border-b transition ${
                      e.status === "RUNNING"
                        ? "bg-yellow-500/10 hover:bg-yellow-500/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {e.name}
                    </td>

                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-sm truncate">
                      {e.prompt}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {e.models.join(", ")}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium">
                      {overallScore(e)}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {e.status === "RUNNING" && (
                          <Spinner size={14} />
                        )}
                        <StatusBadge status={e.status} />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          router.push(
                            `/prompt-evaluation/${e.id}`
                          )
                        }
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {data.length} of {total} evaluations
          </span>

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={p =>
              updateParams({ page: String(p) })
            }
          />
        </div>
      </div>
    </div>
  );
}
