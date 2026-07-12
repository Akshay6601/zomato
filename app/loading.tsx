export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}
