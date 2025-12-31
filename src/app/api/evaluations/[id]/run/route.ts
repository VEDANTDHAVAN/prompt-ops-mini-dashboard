import { NextResponse } from "next/server";
import { evaluations } from "@/lib/store";
import { scorePrompt } from "@/lib/scoring";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const evaluation = evaluations.find(e => e.id === id);

  if (!evaluation) {
    return NextResponse.json(
      { error: "Evaluation not found" },
      { status: 404 }
    );
  }

  if (evaluation.status !== "QUEUED") {
    return NextResponse.json(
      { error: "Evaluation already running or completed" },
      { status: 400 }
    );
  }

  evaluation.status = "RUNNING";

  setTimeout(() => {
    evaluation.results = evaluation.models.map(model => ({
      model,
      ...scorePrompt(evaluation.weights),
    }));

    evaluation.status = "DONE";
  }, 2000);

  return NextResponse.json({ ok: true });
}
