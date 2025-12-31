"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { getParam, setParams } from "@/lib/query";

interface Migration {
  id: string;
  name: string;
  sourceModel: string;
  targetModel: string;
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export default function PromptMigrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const search = getParam(searchParams, "search", "");
  const status = getParam(searchParams, "status", "");
  const page = Number(getParam(searchParams, "page", "1"));
  const pageSize = Number(getParam(searchParams, "pageSize", "10"));

  const [data, setData] = useState<Migration[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/migrations?${searchParams.toString()}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setTotal(res.meta.total);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParams = (updates: Record<string, string | null>) => {
    router.push(
      `/prompt-migration?${setParams(searchParams, updates)}`
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Prompt Migrations
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and manage prompt migration jobs across models
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium
                         bg-background text-foreground
                         hover:bg-accent hover:text-accent-foreground transition"
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={() => router.push("/prompt-migration/new")}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground
                         hover:bg-primary/90 transition font-medium"
            >
              + New Migration
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="rounded-lg border bg-card text-card-foreground p-4 flex flex-wrap gap-4 items-center">
          <input
            placeholder="Search migrations…"
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
            <option value="DRAFT">Draft</option>
            <option value="RUNNING">Running</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
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
            <div className="px-4 py-6 text-muted-foreground">
              Loading migrations…
            </div>
          ) : data.length === 0 ? (
            <div className="px-4 py-6 text-muted-foreground">
              No migrations found.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-muted text-muted-foreground text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Target
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Created
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {data.map(m => (
                  <tr
                    key={m.id}
                    className={`border-b transition ${
                      m.status === "RUNNING"
                        ? "bg-yellow-500/10 hover:bg-yellow-500/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {m.sourceModel}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {m.targetModel}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {m.status === "RUNNING" && (
                          <Spinner size={14} />
                        )}
                        <StatusBadge status={m.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={m.status === "RUNNING"}
                        onClick={() =>
                          router.push(
                            `/prompt-migration/${m.id}`
                          )
                        }
                        className={`text-sm font-medium transition ${
                          m.status === "RUNNING"
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-primary hover:underline"
                        }`}
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
            Showing {data.length} of {total} migrations
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
