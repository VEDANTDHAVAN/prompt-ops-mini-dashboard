import { NextResponse } from "next/server";
import { migrations } from "@/lib/store";

export async function POST(
  _req: Request, 
  ctx: { params: Promise<{ id: string }> }  
) {
  const { id } = await ctx.params; // await params
  const migration = migrations.find(m => m.id === id);
  
  if(!migration) {
    return NextResponse.json({
        error: "Migration not found"
    }, { status: 404 });
  }

  if(migration.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Migration already started" },
      { status: 400 }  
    );
  }

  migration.status = "RUNNING";

  // Simulating async work 
  setTimeout(() => {
    migration.prompts = migration.prompts.map(p => ({
     ...p, migrated: `${p.source} (migrated to ${migration.targetModel})`,   
    }));
    migration.status = "COMPLETED";
  }, 2000);

  return NextResponse.json({ success: true });
}