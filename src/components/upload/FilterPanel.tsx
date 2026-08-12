const filters = [
  ["original", "Original"],
  ["golden", "Goa Golden"],
  ["bw", "B&W"],
  ["vintage", "Vintage"],
  ["trance", "Trance"],
];
export default function FilterPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`rounded-full px-3 py-2 text-xs font-bold ${value === id ? "bg-yellow-sun text-ink" : "bg-ink/50 text-cream"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
