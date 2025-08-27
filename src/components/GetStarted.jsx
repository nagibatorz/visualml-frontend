export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated background particles (same as main app) */}
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
  <div className="relative mx-auto max-w-6xl px-6 py-8">
    {/* Hero Section */}
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Welcome to Visual<span className="text-blue-400">ML</span>
      </h1>
      <p className="text-xl text-gray-300">
        An explainable text classification system that shows you exactly how decisions are made
      </p>
    </div>

    {/* What is this app */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-xl mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">🎯</span>
        What is VisualML?
      </h2>
      <div className="space-y-4 text-gray-300">
        <p>
          VisualML is an educational machine learning application that trains decision trees on text data 
          and provides <span className="text-blue-400 font-semibold">visual explanations</span> for every classification.
          <br/>
          VisualML is a primitive and minimalistic way of demonstrating a fascinating process of Machine Learning. You do not have to have 
          a lot of experience in this field in order to understand how classifications are being made. Just look at the tree.
        </p>
        <p>
            VisualML system shows you:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>The complete decision tree structure</li>
          <li>Exactly which features (words) influenced each decision</li>
          <li>The path taken through the tree for each classification</li>
          <li>Visualization of the training process</li>
        </ul>
        <p className="text-m text-red-300">
           <span className="text-yellow-400 mt-1">⚠</span> VisualML is still under development and there will be a lot of improvements made in the future
        </p>
      </div>
    </div>

    {/* How to Use */}
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      {/* Training Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">1</span>
          Training Your Model
        </h3>
        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="text-white font-semibold mb-2">Option A: Train from CSV</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
              <li>Prepare a CSV file with your training data</li>
              <li>Click "Select training CSV" and choose your file</li>
              <li>Watch as the tree builds itself</li>
              <li>The model learns patterns from your text data</li>
            </ol>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Option B: Upload Pre-trained Model</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
              <li>Select a .txt file containing a saved model</li>
              <li>Watch the tree being formed</li>
              <li>Model is instantly ready to classify</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">2</span>
          Classifying Text
        </h3>
        <div className="space-y-4 text-gray-300">
          <p>Once your model is loaded:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
            <li>Enter any text in the classification box</li>
            <li>Click "Classify"</li>
            <li>Watch as the decision path lights up in the tree</li>
            <li>See each feature comparison step-by-step</li>
            <li>Get the final classification</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Tip:</strong> The decision path shows exactly why your text was classified 
              as spam or ham, including which words triggered each decision.
              <p className="text-sm text-blue-300"><br/>P. S. "ham" is just a funny way of saying "not spam".</p>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* File Formats */}
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      {/* CSV Format */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          CSV File Format
        </h3>
        <div className="space-y-4">
          <p className="text-gray-300">
            Training and testing files must be CSV with these columns:
          </p>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <code className="text-green-400 text-sm">
              <div>text,label</div>
              <div>"Your message text here",category (spam/ham)</div>
              <div>"Another message",ham</div>
              <div>"Meeting at 3pm tomorrow",ham</div>
              <div>"Win a FREE prize now!",spam</div>
            </code>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><code className="text-blue-400">text</code> column: The message to classify</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><code className="text-blue-400">label</code> column: The category (e.g., spam/ham)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">⚠</span>
              <span>First row must be headers: <code>text,label</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">⚠</span>
              <span>Save as UTF-8 without BOM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Model Format */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🌳</span>
          Model File Format (.txt)
        </h3>
        <div className="space-y-4">
          <p className="text-gray-300">
            Saved models use a pre-order tree format:
          </p>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <code className="text-green-400 text-sm">
              <div>Feature: call</div>
              <div>Threshold: 0.034</div>
              <div>Feature: txt</div>
              <div>Threshold: 0.016</div>
              <div>ham</div>
              <div>spam</div>
              <div>Feature: uk</div>
              <div>Threshold: 0.017</div>
              <div>ham</div>
              <div>spam</div>
            </code>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Branch nodes: Feature name + threshold value</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Leaf nodes: Just the label (spam/ham)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Tree is saved in pre-order traversal</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Understanding the Visualization */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-xl mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">🔍</span>
        Understanding the Visualization
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">◆</span>
            Decision Nodes
          </h4>
          <p className="text-gray-300 text-sm">
            Blue/purple gradient boxes showing feature names and threshold values. 
            These are where the tree makes decisions.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">🍃</span>
            Leaf Nodes
          </h4>
          <p className="text-gray-300 text-sm">
            Green/amber boxes containing the final classification (spam or ham). 
            Show the number of training samples that reached this leaf.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">→</span>
            Decision Path
          </h4>
          <p className="text-gray-300 text-sm">
            Purple highlighting shows the exact path taken during classification. 
            Watch it animate to see each decision being made in real-time.
          </p>
        </div>
      </div>
    </div>

    {/* Metrics Section */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-3xl">📈</span>
        Evaluating Your Model
      </h2>
      <div className="space-y-4 text-gray-300">
        <p>
          Upload a test CSV file to see how well your model performs:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-2">Metrics Provided:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Overall Accuracy:</strong> Percentage of correct predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Per-label Accuracy:</strong> Performance for each category</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Confusion Matrix:</strong> Shows prediction errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Label Distribution:</strong> Sample counts per category</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Pro Tip:</h4>
            <p className="text-sm text-blue-300">
              Use an 80/20 train-test split for best results. Train on 80% of your data, 
              then test on the remaining 20% to get unbiased performance metrics.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Start */}
    <div className="mt-8 text-center">
      <div className="inline-block p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-3">Ready to Start?</h3>
        <p className="text-gray-300 mb-4">
          Try our SMS spam detector with the provided sample files!
        </p>
        <div className="flex gap-4 justify-center">
          <div className="text-sm text-gray-400">
            <span className="block text-white font-semibold mb-1">1. Upload</span>
            <a 
              href="/api/download/sms_tree.txt" 
              download="sms_tree.txt"
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
            >
              📥 sms_tree.txt
            </a>
          </div>
          <div className="text-sm text-gray-400">
            <span className="block text-white font-semibold mb-1">2. Test with</span>
            <a 
              href="/api/download/test.csv" 
              download="test.csv"
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
            >
              📥 test.csv
            </a>
          </div>
          <div className="text-sm text-gray-400">
            <span className="block text-white font-semibold mb-1">3. Classify</span>
            <span className="text-gray-300">Any text!</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 Click the file names above to download the sample files
          </p>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33% { transform: translateY(-30px) translateX(10px); }
      66% { transform: translateY(30px) translateX(-10px); }
    }
    .animate-float {
      animation: float linear infinite;
    }
  `}</style>
</div>
);
}