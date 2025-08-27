import { useEffect, useState, useRef } from "react";
import { api } from "./lib/api";
import DecisionPath from "./components/DecisionPath";
import TreeView from "./components/TreeView";
import FileUploadRow from "./components/FileUploadRow";
import MetricsPanel from "./components/MetricsPanel";
import TrainingProgress from "./components/TrainingProgress";
import GetStarted from "./components/GetStarted";

export default function App() {
  const [isTreeBuilding, setIsTreeBuilding] = useState(false);
  const [ready, setReady] = useState(false);
  const [tree, setTree] = useState(null);
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [training, setTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(null);
  const [metrBusy, setMetrBusy] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [animatingPath, setAnimatingPath] = useState(false);
  const [reconstructing, setReconstructing] = useState(false);
  const [reconstructProgress, setReconstructProgress] = useState(null);
  const [treeLoading, setTreeLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const eventSourceRef = useRef(null);

  async function refreshReady() {
    try {
      const { data } = await api.get("/ready");
      setReady(!!data);
    }
    catch {
      setReady(false);
    }
  }

  async function loadTree(animate = false) {
  setTreeLoading(true);
  
  if (animate) {
    // Clear tree and start building animation
    setTree(null);
    setIsTreeBuilding(true);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try { 
    const { data } = await api.get("/tree"); 
    setTree(data);
    console.log("Tree loaded:", data);
    
    if (animate && data) {
      // Calculate animation duration based on node count
      const nodeCount = countNodes(data);
      const animationDuration = nodeCount * 400 + 2000; // 400ms per node + 2s for complete message
      
      // Stop building animation after it completes
      setTimeout(() => {
        setIsTreeBuilding(false);
      }, animationDuration);
    } else {
      setIsTreeBuilding(false);
    }
  }
  catch (err) { 
    console.error("Failed to load tree:", err);
    setTree(null);
    setIsTreeBuilding(false);
  }
  finally {
    setTreeLoading(false);
  }
}

// Helper function to count nodes
function countNodes(node) {
  if (!node) return 0;
  return 1 + (node.left ? countNodes(node.left) : 0) + (node.right ? countNodes(node.right) : 0);
}

  useEffect(() => {
    refreshReady();
    loadTree();
  }, []);

  // Parse tree file to count nodes for animation
  async function parseTreeFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split('\n').filter(line => line.trim());
        let nodeCount = 0;
        let features = [];
        let i = 0;
        
        while (i < lines.length) {
          const line = lines[i].trim();
          if (line.startsWith('Feature:')) {
            nodeCount++; // Internal node
            const feature = line.substring('Feature:'.length).trim();
            const thresholdLine = lines[i + 1];
            let threshold = 0;
            if (thresholdLine && thresholdLine.startsWith('Threshold:')) {
              threshold = parseFloat(thresholdLine.substring('Threshold:'.length).trim());
            }
            features.push({ type: 'split', feature, threshold });
            i += 2;
          } else {
            nodeCount++; // Leaf node
            features.push({ type: 'leaf', label: line });
            i++;
          }
        }
        
        resolve({ nodeCount, features });
      };
      reader.readAsText(file);
    });
  }

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setReconstructing(true);
    setErr("");
    setReconstructProgress({ phase: "start", message: "Reading model file..." });

    try {
      // Parse the tree file first to get structure
      const treeInfo = await parseTreeFile(file);
      console.log("Tree info:", treeInfo);
      
      // Start reconstruction animation
      setReconstructProgress({ 
        phase: "start", 
        builtNodes: 0,
        totalNodes: treeInfo.nodeCount,
        message: `Loading model with ${treeInfo.nodeCount} nodes...` 
      });
      
      // Simulate reconstruction progress
      let currentNode = 0;
      for (const node of treeInfo.features) {
        currentNode++;
        
        // Adaptive delay: faster for larger trees
        const delay = 200;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        if (node.type === 'split') {
          setReconstructProgress({
            phase: "split",
            builtNodes: currentNode,
            totalNodes: treeInfo.nodeCount,
            feature: node.feature,
            threshold: node.threshold,
            message: `Reconstructing split on '${node.feature}' < ${node.threshold.toFixed(4)}`
          });
        } else {
          setReconstructProgress({
            phase: "leaf",
            builtNodes: currentNode,
            totalNodes: treeInfo.nodeCount,
            message: `Adding leaf node: ${node.label}`
          });
        }
      }
      
      // Actually upload the file
      const fd = new FormData();
      fd.append("file", file);
      await api.post("/load-model", fd, { headers: { "Content-Type": "multipart/form-data" } });
      
      // Show completion
      setReconstructProgress({
        phase: "done",
        builtNodes: treeInfo.nodeCount,
        totalNodes: treeInfo.nodeCount,
        message: "Model loaded successfully!"
      });
      
      await refreshReady();
      await loadTree(true); // Animate tree loading
      
      // Clear progress after 2 seconds
      setTimeout(() => {
        setReconstructProgress(null);
        setReconstructing(false);
      }, 2000);
      
    } catch (ex) {
      setErr(ex?.response?.data || String(ex));
      setReconstructProgress({
        phase: "error",
        message: "Failed to load model"
      });
      setReconstructing(false);
    } finally {
      setUploading(false);
    }
  }

  async function onClassify(e) {
    e.preventDefault();
    console.log("Starting classification animation...");
    setLoading(true);
    setErr("");
    setLabel("");
    setPath([]); // Clear previous path
    setAnimatingPath(false); // Reset animation state
    try {
      const { data } = await api.post("/classify", { text });
      console.log("Classification result:", data);
      
      // Animate path step by step
      if (data.path && data.path.length > 0) {
        setAnimatingPath(true); // Start animation
        console.log("Animating path with", data.path.length, "steps");
        const animatedPath = [];
        for (let i = 0; i < data.path.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 600));
          animatedPath.push(data.path[i]);
          setPath([...animatedPath]);
          console.log("Added step", i + 1, "to path");
        }
      }
      
      // Show final label after path animation
      await new Promise(resolve => setTimeout(resolve, 500));
      setLabel(data.label);
      console.log("Classification complete:", data.label);
    } catch (ex) { 
      setErr(ex?.response?.data || String(ex)); 
    }
    finally { 
      setLoading(false);
      // Keep animatingPath true to maintain highlighting
    }
  }

  // Training with simulated animation
  async function submitTrain(file, labelCol) {
    console.log("Starting training with animation...");
    setTraining(true);
    setErr("");
    setTrainProgress({ phase: "start", message: "Uploading file..." });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("labelCol", labelCol || "label");
      
      // Simulate progress events
      setTimeout(() => {
        setTrainProgress({ 
          phase: "feature_scan", 
          builtNodes: 0,
          totalNodes: 50,
          message: "Scanning features in the dataset..." 
        });
      }, 500);
      
      setTimeout(() => {
        setTrainProgress({ 
          phase: "split", 
          builtNodes: 1,
          totalNodes: 50,
          feature: "call",
          threshold: 0.034,
          leftCount: 3231,
          rightCount: 2341,
          gini: 0.222,
          gain: 0.045,
          message: "Creating root split on 'call' feature" 
        });
      }, 1500);
      
      setTimeout(() => {
        setTrainProgress({ 
          phase: "split", 
          builtNodes: 5,
          totalNodes: 50,
          feature: "txt",
          threshold: 0.016,
          leftCount: 2890,
          rightCount: 341,
          gini: 0.087,
          gain: 0.032,
          message: "Splitting on 'txt' feature" 
        });
      }, 2500);
      
      setTimeout(() => {
        setTrainProgress({ 
          phase: "leaf", 
          builtNodes: 10,
          totalNodes: 50,
          message: "Creating leaf node: ham (2890 samples)" 
        });
      }, 3500);
      
      // Actually train the model
      const response = await api.post("/train", formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      
      console.log("Training complete!");
      
      // Show completion
      setTrainProgress({ 
        phase: "done", 
        builtNodes: 23,
        totalNodes: 23,
        message: "Training complete! Model ready to use." 
      });
      
      await refreshReady();
      await loadTree(true); // Animate tree loading
      
      // Clear progress after 3 seconds
      setTimeout(() => {
        setTrainProgress(null);
      }, 3000);
      
    } catch (ex) {
      console.error("Training failed:", ex);
      setErr(ex?.response?.data || String(ex));
      setTrainProgress({ 
        phase: "error", 
        message: "Training failed: " + (ex?.response?.data || ex.message) 
      });
    } finally {
      setTraining(false);
    }
  }

  async function submitMetrics(file, labelCol) {
    setMetrBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("labelCol", labelCol || "label");
      const { data } = await api.post("/metrics", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMetrics(data);
    } catch (ex) {
      setErr(ex?.response?.data || String(ex));
    } finally {
      setMetrBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
      </div>

      <header className="relative border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">VML</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Visual<span className="text-blue-400">ML</span> Classifier
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2 ml-8">
            <button
              onClick={() => setCurrentPage("home")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === "home"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("getstarted")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === "getstarted"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              Get Started
            </button>
          </nav>
          
          {currentPage === "home" && (
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium transition-all ${
              ready 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}>
              {ready ? "✓ Model Ready" : "○ No Model"}
            </span>
          )}
        </div>
      </header>

      {currentPage === "home" ? (
        <main className="relative mx-auto max-w-7xl px-6 py-6">
          {/* Controls Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Upload Model */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-xl">
                <h2 className="font-semibold mb-3 text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">1</span>
                  Upload Model (.txt)
                </h2>
                <form onSubmit={onUpload} className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 p-2 hover:bg-gray-700 transition-colors"
                  />
                  <button 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium disabled:opacity-50 hover:from-blue-600 hover:to-blue-700 transition-all" 
                    disabled={!file || uploading}
                  >
                    {uploading ? "Loading…" : "Upload"}
                  </button>
                </form>
                {reconstructProgress && (
                  <div className="mt-4">
                    <TrainingProgress progress={reconstructProgress} />
                  </div>
                )}
              </div>

              {/* Train from CSV */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-xl">
                <h2 className="font-semibold mb-3 text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-sm">2</span>
                  Train from CSV
                </h2>
                <p className="text-sm text-gray-400 mb-3">
                  CSV must have <code className="px-1 py-0.5 bg-gray-700 rounded text-blue-400">text</code> and label columns
                </p>
                <FileUploadRow label="Select training CSV:" onSubmit={submitTrain} busy={training} />
                {trainProgress && (
                  <div className="mt-4">
                    <TrainingProgress progress={trainProgress} />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Classify Text */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-xl">
                <h2 className="font-semibold mb-3 text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">3</span>
                  Classify Text
                </h2>
                <form onSubmit={onClassify} className="space-y-3">
                  <div className="relative">
                    <textarea
                      className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Paste text to classify…"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    {text.length > 0 && (
                      <span className="absolute top-2 right-2 text-xs text-gray-400">
                        {text.length} chars
                      </span>
                    )}
                  </div>
                  <button 
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium disabled:opacity-50 hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2" 
                    disabled={!ready || loading || !text.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Classifying…
                      </>
                    ) : (
                      <>➤ Classify</>
                    )}
                  </button>
                </form>

                {err && (
                  <div className="mt-3 p-3 border border-rose-500/30 bg-rose-500/10 text-rose-400 rounded-lg text-sm">
                    {String(err)}
                  </div>
                )}

                {label && (
                  <div className={`mt-4 p-4 rounded-lg border transition-all ${
                    animatingPath ? 'animate-pulse' : ''
                  } ${
                    label === 'spam' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-green-500/10 border-green-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Predicted Label:</span>
                      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        label === 'spam'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {label.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {path?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-white mb-3">Decision Path</h3>
                    <DecisionPath path={path} animated={animatingPath} />
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-xl">
                <h2 className="font-semibold mb-3 text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm">4</span>
                  Evaluate Metrics
                </h2>
                <FileUploadRow label="Select test CSV:" onSubmit={submitMetrics} busy={metrBusy} />
                {metrics && (
                  <div className="mt-4">
                    <MetricsPanel metrics={metrics} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full-width Tree Visualization at Bottom */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl text-white flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                Decision Tree Visualization
              </h2>
              <button 
                onClick={() => {
                  setPath([]); // Clear path when reloading
                  setAnimatingPath(false);
                  loadTree(true);
                }}
                disabled={treeLoading}
                className="px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {treeLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></span>
                    Loading...
                  </>
                ) : (
                  <>↻ Reload Tree</>
                )}
              </button>
            </div>
            <div className="min-h-[400px] max-h-[800px] overflow-auto bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <TreeView 
                node={tree} 
                highlightPath={path}
                animating={path.length > 0}
                buildingNodes={reconstructing ? reconstructProgress?.builtNodes : null}
                isBuilding={isTreeBuilding}
              />
            </div>
          </div>
        </main>
      ) : (
        <GetStarted />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(10px); }
          66% { transform: translateY(30px) translateX(-10px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounceIn {
          animation: bounceIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}