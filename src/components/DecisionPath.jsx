export default function DecisionPath({ path = [], animated = false }) {
  if (!path.length) return null;

  return (
    <ol className="space-y-3">
      {path.map((s, i) => (
        <li
          key={i}
          className={`
            flex items-center gap-3 p-3 rounded-lg border transition-all
            ${animated ? 'animate-slideIn' : ''}
            ${s.direction === "left" 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-purple-500/10 border-purple-500/30'
            }
          `}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${s.direction === "left" 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
            }
          `}>
            {i + 1}
          </div>
          
          <div className="flex-1">
            <div className="text-white">
              Feature <code className="px-2 py-0.5 bg-gray-700 rounded text-blue-400 font-mono">{s.feature}</code>
              <span className="text-gray-400 mx-2">=</span>
              <span className="text-white font-semibold">{Number(s.value).toFixed(4)}</span>
              <span className="text-gray-400 mx-2">{s.direction === "left" ? "<" : "≥"}</span>
              <span className="text-gray-300">{Number(s.threshold).toFixed(4)}</span>
            </div>
          </div>
          
          <div className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${s.direction === "left" 
              ? "bg-blue-500/20 text-blue-300" 
              : "bg-purple-500/20 text-purple-300"
            }
          `}>
            {s.direction === "left" ? "← Left" : "Right →"}
          </div>
        </li>
      ))}
    </ol>
  );
}