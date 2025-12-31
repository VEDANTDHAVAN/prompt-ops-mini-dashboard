"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
    useEffect(() => {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-xl w-full p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Prompt Ops Mini-Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage prompt migrations and evaluations across LLMs
          </p>
           <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium
                         bg-background text-foreground
                         hover:bg-accent hover:text-accent-foreground transition">
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/prompt-migration"
            className="block rounded-lg border bg-card p-4 hover:bg-muted transition"
          >
            <h2 className="text-lg font-medium">
              Prompt Migration →
            </h2>
            <p className="text-sm text-muted-foreground">
              Migrate prompts between models with async execution
            </p>
          </Link>

          <Link
            href="/prompt-evaluation"
            className="block rounded-lg border bg-card p-4 hover:bg-muted transition"
          >
            <h2 className="text-lg font-medium">
              Prompt Evaluation →
            </h2>
            <p className="text-sm text-muted-foreground">
              Compare prompt quality across multiple models
            </p>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Built with Next.js App Router
        </p>
      </div>
    </div>
  );
}
