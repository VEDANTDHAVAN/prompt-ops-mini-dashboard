import { NextResponse } from "next/server";
import { migrations } from "@/lib/store";
import { Migration } from "@/lib/models";
import { randomUUID } from "crypto";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") ?? "desc";
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  let results = [...migrations];

  // Search by name
  if (search) {
    results = results.filter(m =>
      m.name.toLowerCase().includes(search)
    );
  }

  // Filter by status
  if (status) {
    results = results.filter(m => m.status === status);
  }

  // Sort
  results.sort((a, b) => {
    const aVal = a[sort as keyof Migration];
    const bVal = b[sort as keyof Migration];
    if (!aVal || !bVal) return 0;

    if (order === "asc") {
      return String(aVal).localeCompare(String(bVal));
    }
    return String(bVal).localeCompare(String(aVal));
  });

  const total = results.length;
  const start = (page - 1) * pageSize;
  const paginated = results.slice(start, start + pageSize);

  return NextResponse.json({
    data: paginated,
    meta: {
      total,
      page,
      pageSize,
    },
  }); 
}

export async function POST(req: Request) {
  const body = await req.json();

  const { name, sourceModel, targetModel, 
      prompts = [], notes } = body;
    
  if(!name || !sourceModel || !targetModel) {
   return NextResponse.json(
    { error: "Source and target models are different" },
    { status: 400 }
   );  
  }
  
  const migration: Migration = {
    id: randomUUID(),
    name, sourceModel, targetModel, 
    status: "DRAFT", createdAt: new Date().toISOString(),
    prompts: prompts.map((p: string) => ({
     id: randomUUID(), source: p, 
    })),
  };

  migrations.unshift(migration);

  return NextResponse.json(migration, { status: 201 });
}