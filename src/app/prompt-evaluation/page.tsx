import { Suspense } from "react";
import PromptEvaluationListClient from "@/components/PromptEvaluationListClient";
import { TableSkeleton } from "@/components/TableSkeleton";

export default function PromptEvaluationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-6">
          <TableSkeleton rows={6} />
        </div>
      }
    >
      <PromptEvaluationListClient />
    </Suspense>
  );
}
