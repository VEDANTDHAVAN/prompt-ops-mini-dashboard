import Spinner from "./Spinner";
import clsx from "clsx";

export default function StatusBadge({ status }: { status: string }) {
  const isRunning = status === "RUNNING";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border",
        {
          DRAFT: "bg-slate-700 text-slate-200 border-slate-600",
          RUNNING: "bg-yellow-600/20 text-yellow-300 border-yellow-500",
          COMPLETED: "bg-green-600/20 text-green-300 border-green-500",
          FAILED: "bg-red-600/20 text-red-300 border-red-500",
        }[status]
      )}
    >
      {isRunning && <Spinner size={12} />}
      {status}
    </span>
  );
}
