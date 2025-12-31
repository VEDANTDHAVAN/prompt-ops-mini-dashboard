import { NextResponse } from "next/server";
import { migrations } from "@/lib/store";

export async function GET(
  _req: Request, ctx: { params: Promise<{ id: string }> }  
) {
  const { id } = await ctx.params;  
  const migration = migrations.find(m => m.id === id);
  
  if(!migration) {
    return NextResponse.json(
     { error: "Migration not found" },
     { status: 404 }   
    );
  }

  return NextResponse.json(migration);
}