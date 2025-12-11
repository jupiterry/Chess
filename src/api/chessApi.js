import axios from 'axios';

const API_URL = 'http://38.76.35.142:8000';

export const analyzeBoard = async (fen) => {
  try {
    const response = await axios.get(`${API_URL}/analyze`, {
      params: { fen },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing board:', error);
    // Return a safe fallback or rethrow
    return { best_move: null, score: null, error: true };
  }
};
