import React from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

const AnalysisPanel = ({ bestMove, score, loading, onReset, onPlayBestMove }) => {
  return (
    <div className="bg-stone-800 p-6 rounded-lg shadow-xl border border-stone-700 w-full max-w-md flex flex-col gap-4">
      <h2 className="text-xl font-bold text-stone-200 border-b border-stone-700 pb-2">Analysis</h2>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-stone-400">Status:</span>
          <span className={`font-semibold ${loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`}>
            {loading ? 'Stockfish is thinking...' : 'Ready'}
          </span>
        </div>

        <div className="flex justify-between items-center bg-stone-900/50 p-2 rounded">
          <span className="text-stone-400">Evaluation:</span>
          <span className="text-xl font-mono text-white tracking-wider">{score || '-'}</span>
        </div>

        <div className="flex justify-between items-center bg-stone-900/50 p-2 rounded">
          <span className="text-stone-400">Best Move:</span>
          <span className="text-xl font-mono text-blue-400 tracking-wider">{bestMove || '-'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600/90 hover:bg-red-600 text-white font-medium rounded-lg transition-all active:scale-95"
        >
          <RotateCcw size={18} />
          Reset
        </button>
        <button
          onClick={onPlayBestMove}
          disabled={loading || !bestMove}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/90 hover:bg-blue-600 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
           <Lightbulb size={18} />
           Best Move
        </button>
      </div>
    </div>
  );
};

export default AnalysisPanel;
