export default function FileUploadRow({ label, onSubmit, busy, accept = ".csv" }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget.querySelector("input[type=file]").files?.[0];
        const labelCol = e.currentTarget.querySelector("input[name=labelCol]")?.value || "label";
        if (f) onSubmit(f, labelCol);
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <div className="font-medium text-white">{label}</div>
      <input type="file" accept={accept} className="border rounded p-1.5" />
      <input
        name="labelCol"
        type="text"
        placeholder="label column (default: label)"
        className="border rounded p-1.5 text-sm"
      />
      <button
        className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
        disabled={busy}
      >
        {busy ? "Working…" : "Submit"}
      </button>
    </form>
  );
}
