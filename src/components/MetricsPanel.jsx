export default function MetricsPanel({ metrics }) {
  if (!metrics) return <div className="text-gray-400 text-sm">No metrics yet.</div>;

  const per = Object.entries(metrics.perLabel || {});
  const counts = Object.entries(metrics.labelCounts || {});
  const conf = metrics.confusion || [];

  return (
    <div className="space-y-4">
      <div className="text-sm text-white">
        Overall accuracy: <span className="font-bold text-green-400">{(metrics.overall * 100).toFixed(2)}%</span>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2 text-white">Per-label accuracy</h4>
        {per.length ? (
          <table className="w-full text-sm border border-gray-600 rounded overflow-hidden">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left p-2 border-b border-gray-600 text-gray-300">Label</th>
                <th className="text-left p-2 border-b border-gray-600 text-gray-300">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {per.map(([label, acc]) => (
                <tr key={label} className="border-b border-gray-700/50">
                  <td className="p-2 text-white">{label}</td>
                  <td className="p-2 text-white">{(acc * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400 text-sm">No per-label breakdown.</div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2 text-white">Label counts (actual in test)</h4>
        {counts.length ? (
          <ul className="text-sm list-disc list-inside text-white">
            {counts.map(([label, c]) => (
              <li key={label}>
                <code className="px-1 bg-gray-700 rounded text-blue-400">{label}</code>
                <span className="text-gray-300"> : {c}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-sm">No labels found.</div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2 text-white">Confusion matrix (tall)</h4>
        {conf.length ? (
          <table className="w-full text-sm border border-gray-600 rounded overflow-hidden">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left p-2 border-b border-gray-600 text-gray-300">Actual</th>
                <th className="text-left p-2 border-b border-gray-600 text-gray-300">Predicted</th>
                <th className="text-left p-2 border-b border-gray-600 text-gray-300">Count</th>
              </tr>
            </thead>
            <tbody>
              {conf.map((row, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="p-2 text-white">{row.actual}</td>
                  <td className="p-2 text-white">{row.predicted}</td>
                  <td className="p-2 text-white">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400 text-sm">No confusion entries.</div>
        )}
      </div>
    </div>
  );
}