export default function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}