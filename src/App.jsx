import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { analyzeBoard } from './api/chessApi';
import AnalysisPanel from './components/AnalysisPanel';

function App() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [analysis, setAnalysis] = useState({ bestMove: null, score: null, loading: false });
  const [boardWidth, setBoardWidth] = useState(560);

  // Responsive board size
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setBoardWidth(window.innerWidth - 48); // 24px padding on each side
      } else {
        setBoardWidth(560);
      }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to make a move
  const makeMove = useCallback((move) => {
    try {
      const result = game.move(move);
      if (result) {
        const newFen = game.fen();
        setFen(newFen);
        // Trigger analysis
        fetchAnalysis(newFen);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game]);

  // Handle drag and drop
  function onDrop(sourceSquare, targetSquare) {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen for simplicity
    };
    
    // Check if move is legal before trying
    try {
        const tempGame = new Chess(game.fen());
        const moveResult = tempGame.move(move);
        if (!moveResult) return false;
        
        // Apply on real game
        game.move(move);
        const newFen = game.fen();
        setFen(newFen);
        fetchAnalysis(newFen);
        return true;
    } catch (e) {
        return false;
    }
  }

  // Fetch analysis from API
  const fetchAnalysis = async (currentFen) => {
    setAnalysis(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await analyzeBoard(currentFen);
      if (data.error) {
        setAnalysis({ bestMove: '-', score: 'Error', loading: false, error: true });
      } else {
        setAnalysis({ 
          bestMove: data.best_move, 
          score: data.score, 
          loading: false, 
          error: null 
        });
      }
    } catch (error) {
      setAnalysis({ bestMove: '-', score: 'Error', loading: false, error: true });
    }
  };

  // Reset Game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setAnalysis({ bestMove: null, score: null, loading: false });
  };

  // Play Best Move
  const playBestMove = () => {
    if (analysis.bestMove && analysis.bestMove !== '-') {
      // Best move is usually in UCI format like "e2e4"
      const from = analysis.bestMove.substring(0, 2);
      const to = analysis.bestMove.substring(2, 4);
      const promotion = analysis.bestMove.length === 5 ? analysis.bestMove[4] : 'q';
      
      const move = { from, to, promotion };
      
      try {
          game.move(move);
          const newFen = game.fen();
          setFen(newFen);
          fetchAnalysis(newFen);
      } catch (e) {
          console.error("Failed to play best move", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col xl:flex-row items-center justify-center p-4 md:p-8 gap-8 xl:gap-16 font-sans">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 drop-shadow-sm">
          Chess Analysis
        </h1>
        <div className="shadow-2xl shadow-black/60 rounded-md overflow-hidden ring-4 ring-stone-800">
          <Chessboard 
            position={fen} 
            onPieceDrop={onDrop}
            boardWidth={boardWidth}
            customDarkSquareStyle={{ backgroundColor: '#779954' }}
            customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
            animationDuration={200}
          />
        </div>
      </div>

      <div className="w-full max-w-md">
        <AnalysisPanel
          bestMove={analysis.bestMove}
          score={analysis.score}
          loading={analysis.loading}
          onReset={resetGame}
          onPlayBestMove={playBestMove}
        />
      </div>
    </div>
  );
}

export default App;
