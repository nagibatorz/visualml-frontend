import { useState, useEffect } from 'react';

export default function TreeView({ node, highlightPath = [], animating = false, buildingNodes = null, isBuilding = false }) {
  const [visibleNodes, setVisibleNodes] = useState(new Set());
  const [currentBuildIndex, setCurrentBuildIndex] = useState(0);
  const [buildingMessage, setBuildingMessage] = useState('');

  // Calculate total nodes in tree
  const countNodes = (n) => {
    if (!n) return 0;
    return 1 + (n.left ? countNodes(n.left) : 0) + (n.right ? countNodes(n.right) : 0);
  };

  const totalNodes = node ? countNodes(node) : 0;

  // Get node info for building message
  const getNodeInfo = (n, index, currentIndex) => {
    if (!n || index > currentIndex) return null;
    if (index === currentIndex) {
      if (n.isLeaf) {
        return `Adding leaf: ${n.label}`;
      } else {
        return `Creating split on "${n.feature}" at threshold ${n.threshold?.toFixed(4)}`;
      }
    }
    // Traverse tree to find the current node
    const leftCount = n.left ? countNodes(n.left) : 0;
    if (index * 2 <= currentIndex && currentIndex < index * 2 + leftCount) {
      return getNodeInfo(n.left, index * 2, currentIndex);
    }
    if (currentIndex >= index * 2 + leftCount) {
      return getNodeInfo(n.right, index * 2 + 1, currentIndex);
    }
    return null;
  };

  // Animate tree construction when building
  useEffect(() => {
    if (isBuilding && node) {
      // Reset and rebuild
      setVisibleNodes(new Set());
      setCurrentBuildIndex(0);
      setBuildingMessage('Starting tree construction...');

      // Gradually show nodes with slower animation
      let index = 0;
      const buildInterval = setInterval(() => {
        index++;
        setCurrentBuildIndex(index);
        
        // Update building message based on current node
        const nodeMessage = getNodeInfo(node, 1, index);
        if (nodeMessage) {
          setBuildingMessage(nodeMessage);
        }
        
        if (index >= totalNodes) {
          clearInterval(buildInterval);
          setBuildingMessage('Tree construction complete!');
          setTimeout(() => setBuildingMessage(''), 2000);
        }
      }, 400); // 400ms per node for clear visibility
      
      return () => clearInterval(buildInterval);
    } else if (!isBuilding && node) {
      // Show all nodes immediately when not building
      setCurrentBuildIndex(totalNodes);
      setBuildingMessage('');
    }
  }, [isBuilding, node, totalNodes]);

  if (!node) return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <div className="text-center">
        <div className="text-6xl mb-4 opacity-50">🌳</div>
        <p className="text-white">No tree loaded</p>
        <p className="text-sm text-gray-400 mt-2">Upload a model or train from CSV</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* Building Status Message */}
      {isBuilding && buildingMessage && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <span className="text-sm text-blue-300 font-medium">{buildingMessage}</span>
          </div>
          <div className="mt-2 flex gap-2 text-xs text-gray-400">
            <span>Nodes: {currentBuildIndex}/{totalNodes}</span>
            <span>•</span>
            <span>Progress: {Math.round((currentBuildIndex/totalNodes) * 100)}%</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center p-4">
        <div className={`transform ${totalNodes > 50 ? 'scale-50' : totalNodes > 30 ? 'scale-60' : totalNodes > 15 ? 'scale-75' : 'scale-90'}`}>
          <CompactNode 
            node={node} 
            highlightPath={highlightPath} 
            animating={animating}
            nodeIndex={1}
            currentBuildIndex={currentBuildIndex}
            isBuilding={isBuilding}
            depth={0}
          />
        </div>
      </div>
    </div>
  );
}

function CompactNode({ node, highlightPath, animating, nodeIndex, currentBuildIndex, isBuilding, depth = 0 }) {
  if (!node) return null;

  // More aggressive depth scaling for compact layout
  const maxDepth = 6;
  const depthFactor = Math.max(0.2, 1 - (depth / maxDepth) * 0.8);
  const horizontalGap = Math.max(4, 20 * depthFactor); // Smaller gaps

  const isVisible = nodeIndex <= currentBuildIndex;
  const isNewlyAdded = isBuilding && nodeIndex === currentBuildIndex;
  const isAboutToAdd = isBuilding && nodeIndex === currentBuildIndex + 1;
  const step = highlightPath?.find(p => p.feature === node.feature && Math.abs((p.threshold || 0) - (node.threshold || 0)) < 0.0001);
  const onPath = !!step;

  if (node.isLeaf) {
    const isHighlighted = highlightPath.some(p => !p.feature);
    // Adaptive sizing for leaf nodes
    const leafPadding = depth > 4 ? 'px-2 py-1' : depth > 2 ? 'px-3 py-1' : 'px-4 py-2';
    const fontSize = depth > 4 ? 'text-xs' : 'text-sm';

    return (
      <div 
        className={`
          relative transition-all transform
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          ${isNewlyAdded ? 'animate-zoomIn' : ''}
          ${isAboutToAdd ? 'opacity-30 scale-90' : ''}
        `}
        style={{
          transitionDuration: isBuilding ? '400ms' : '300ms',
        }}
      >
        {/* Leaf Node */}
        <div className={`
          ${leafPadding} rounded-lg border transition-all duration-500 text-center min-w-[50px]
          ${isHighlighted && animating 
            ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-500/20 scale-110' 
            : 'bg-gradient-to-br from-slate-700/50 to-slate-600/50 border-slate-500/50 hover:border-slate-400/70'
          }
          ${isNewlyAdded ? 'ring-4 ring-yellow-400 ring-opacity-60 shadow-xl shadow-yellow-400/30' : ''}
        `}>
          <div className={`${fontSize} text-gray-400`}>Leaf</div>
          <div className={`text-white font-bold ${fontSize}`}>{node.label}</div>
          {node.samples && depth < 4 && (
            <div className="text-xs text-gray-400 mt-1">{node.samples}</div>
          )}
          {isNewlyAdded && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 font-bold animate-bounce">
              NEW!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Internal node with adaptive sizing
  const nodePadding = depth > 3 ? 'px-2 py-1' : depth > 1 ? 'px-3 py-2' : 'px-4 py-3';
  const nodeMinWidth = depth > 3 ? 'min-w-[70px]' : depth > 1 ? 'min-w-[90px]' : 'min-w-[110px]';

  return (
    <div
      className={`
        relative transition-all transform 
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        ${isNewlyAdded ? 'animate-zoomIn' : ''}
        ${isAboutToAdd ? 'opacity-30 scale-90' : ''}
      `}
      style={{
        transitionDuration: isBuilding ? '400ms' : '300ms',
      }}
    >
      {/* Internal Node */}
      <div className="flex flex-col items-center">
        <div className={`
          ${nodePadding} rounded-lg border transition-all duration-500 ${nodeMinWidth} text-center 
          ${onPath && animating
            ? 'bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-purple-400 shadow-lg shadow-purple-500/20 scale-105'
            : 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-slate-600/70 hover:border-slate-500'
          }
          ${isNewlyAdded ? 'ring-4 ring-yellow-400 ring-opacity-60 shadow-xl shadow-yellow-400/30' : ''}
        `}>
          <div className="text-white font-semibold text-sm">{node.feature}</div>
          <div className="text-xs text-gray-400 mt-1">
            ≤ {node.threshold?.toFixed(3)}
          </div>
          {step && animating && (
            <div className="text-xs text-purple-300 mt-1 animate-pulse">
              {step.value?.toFixed(3)}
            </div>
          )}
          {isNewlyAdded && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 font-bold animate-bounce">
              SPLIT!
            </div>
          )}
        </div>

        {/* Branches Container with minimal spacing */}
        <div 
          className="flex mt-1"
          style={{ gap: `${horizontalGap}px` }}
        >
          {/* Left Branch */}
          <div className="flex flex-col items-center">
            <svg 
              className={`h-6 -my-2 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              width={Math.max(20, 40 * depthFactor)}
              viewBox={`0 0 ${Math.max(20, 40 * depthFactor)} 24`}
              preserveAspectRatio="xMidYMid meet"
            >
              <path 
                d={`M ${Math.max(10, 20 * depthFactor)} 2 Q ${Math.max(5, 10 * depthFactor)} 8, ${Math.max(5, 10 * depthFactor)} 22`}
                stroke={onPath && step?.direction === 'left' && animating ? '#60a5fa' : '#475569'}
                strokeWidth="2"
                fill="none"
                className={`transition-all duration-300 ${onPath && step?.direction === 'left' && animating ? 'stroke-blue-400' : ''}`}
                strokeDasharray={isNewlyAdded ? "100" : "0"}
                strokeDashoffset={isNewlyAdded ? "100" : "0"}
                style={{
                  animation: isNewlyAdded ? 'drawLine 0.5s ease-out forwards' : 'none'
                }}
              />
            </svg>
            <div className={`
              px-1 py-0 rounded text-xs transition-all duration-500
              ${onPath && step?.direction === 'left' && animating
                ? 'bg-blue-500/30 text-blue-300 border border-blue-400'
                : 'bg-slate-700/50 text-slate-400'
              }
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}>
              True
            </div>
            <CompactNode 
              node={node.left} 
              highlightPath={highlightPath} 
              animating={animating}
              nodeIndex={nodeIndex * 2}
              currentBuildIndex={currentBuildIndex}
              isBuilding={isBuilding}
              depth={depth + 1}
            />
          </div>
          
          {/* Right Branch */}
          <div className="flex flex-col items-center">
            <svg 
              className={`h-6 -my-2 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              width={Math.max(20, 40 * depthFactor)}
              viewBox={`0 0 ${Math.max(20, 40 * depthFactor)} 24`}
              preserveAspectRatio="xMidYMid meet"
            >
              <path 
                d={`M ${Math.max(10, 20 * depthFactor)} 2 Q ${Math.max(15, 30 * depthFactor)} 8, ${Math.max(15, 30 * depthFactor)} 22`}
                stroke={onPath && step?.direction === 'right' && animating ? '#a78bfa' : '#475569'}
                strokeWidth="2"
                fill="none"
                className={`transition-all duration-300 ${onPath && step?.direction === 'right' && animating ? 'stroke-purple-400' : ''}`}
                strokeDasharray={isNewlyAdded ? "100" : "0"}
                strokeDashoffset={isNewlyAdded ? "100" : "0"}
                style={{
                  animation: isNewlyAdded ? 'drawLine 0.5s ease-out forwards 0.2s' : 'none'
                }}
              />
            </svg>
            <div className={`
              px-1 py-0 rounded text-xs transition-all duration-500
              ${onPath && step?.direction === 'right' && animating
                ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                : 'bg-slate-700/50 text-slate-400'
              }
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}>
              False
            </div>
            <CompactNode 
              node={node.right} 
              highlightPath={highlightPath} 
              animating={animating}
              nodeIndex={nodeIndex * 2 + 1}
              currentBuildIndex={currentBuildIndex}
              isBuilding={isBuilding}
              depth={depth + 1}
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes zoomIn {
          0% { 
            transform: scale(0) rotate(180deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2) rotate(90deg); 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
        }
        .animate-zoomIn {
          animation: zoomIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}