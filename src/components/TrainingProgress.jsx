export default function TrainingProgress({ progress }) {
  if (!progress) return null;

  const getPhaseColor = (phase) => {
    switch (phase) {
      case "start": return "blue";
      case "feature_scan": return "purple";
      case "split": return "yellow";
      case "leaf": return "green";
      case "done": return "emerald";
      case "error": return "red";
      default: return "gray";
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case "start": return "🚀";
      case "feature_scan": return "🔍";
      case "split": return "🌳";
      case "leaf": return "🍃";
      case "done": return "✅";
      case "error": return "❌";
      default: return "⚡";
    }
  };

  const phase = progress.phase || "start";
  const color = getPhaseColor(phase);
  const icon = getPhaseIcon(phase);

  const built = Number(progress.builtNodes) || 0;
  const total = Number(progress.totalNodes) || 0;
  const progressPercent = total > 0 ? Math.min((built / total) * 100, 100) : 0;

  return (
    <div className={`p-4 rounded-lg border bg-${color}-500/10 border-${color}-500/30 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse">{icon}</span>
          <span className={`text-sm font-medium text-${color}-400`}>
            {phase.charAt(0).toUpperCase() + phase.slice(1).replaceAll("_", " ")}
          </span>
        </div>
        {built > 0 && (
          <span className="text-xs text-gray-400">
            {built} / {total || "?"} nodes
          </span>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && phase !== "done" && phase !== "error" && (
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-${color}-400 to-${color}-500`}
            style={{ width: `${progressPercent}%` }}
          >
            <div className="h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Message */}
      {progress.message && <p className="text-sm text-gray-300">{progress.message}</p>}

      {/* Split details */}
      {progress.feature && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
            Feature: <span className="font-mono text-blue-400">{progress.feature}</span>
          </span>
          {typeof progress.threshold === "number" && (
            <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
              Threshold: <span className="text-purple-400">{progress.threshold.toFixed(4)}</span>
            </span>
          )}
          {progress.leftCount > 0 && (
            <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
              Left: <span className="text-blue-400">{progress.leftCount}</span>
            </span>
          )}
          {progress.rightCount > 0 && (
            <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
              Right: <span className="text-purple-400">{progress.rightCount}</span>
            </span>
          )}
        </div>
      )}

      {/* Gini and Gain */}
      {(progress.gini > 0 || progress.gain > 0) && (
        <div className="mt-2 flex gap-3 text-xs text-gray-400">
          {progress.gini > 0 && <span>Gini: {Number(progress.gini).toFixed(4)}</span>}
          {progress.gain > 0 && <span>Gain: {Number(progress.gain).toFixed(4)}</span>}
        </div>
      )}

      {/* Animated dots for ongoing process */}
      {(phase === "feature_scan" || phase === "start") && (
        <div className="mt-2 flex gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></span>
        </div>
      )}
    </div>
  );
}
