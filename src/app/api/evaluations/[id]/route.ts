import { NextResponse } from "next/server";
import { evaluations } from "@/lib/store";

export async function GET(
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

  return NextResponse.json(evaluation);
}