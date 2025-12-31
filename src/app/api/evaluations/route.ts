import { NextResponse } from "next/server";
import { evaluations } from "@/lib/store";
import { Evaluation } from "@/lib/models";
import { randomUUID } from "crypto";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status");
  const model = searchParams.get("model");
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  let results = [...evaluations];

  if (search) {
    results = results.filter(
      e =>
        e.name.toLowerCase().includes(search) ||
        e.prompt.toLowerCase().includes(search)
    );
  }

  if (status) {
    results = results.filter(e => e.status === status);
  }

  if (model) {
    results = results.filter(e => e.models.includes(model));
  }

  const total = results.length;
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    data: results.slice(start, start + pageSize),
    meta: { total, page, pageSize },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { name, prompt, models, weights } = body;

  if (!name || !prompt || !models?.length || !weights) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const evaluation: Evaluation = {
    id: randomUUID(),
    name,
    prompt,
    models,
    weights,
    status: "QUEUED",
    createdAt: new Date().toISOString(),
  };

  evaluations.unshift(evaluation);

  return NextResponse.json(evaluation, { status: 201 });
}
