import React from 'react';

export const ScoringInfo: React.FC = () => (
  <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-orange-200 mt-8">
    <h2 className="text-2xl font-bold text-[#d93900] mb-2 flex items-center gap-2">
      <span role="img" aria-label="scales">⚖️</span> Scoring System
    </h2>
    <p className="mb-2 text-gray-700">
      Reddit post scores follow a <b>power-law distribution</b> (most posts get few upvotes, some get hundreds of thousands). To make scoring fair, we normalize guesses:
    </p>
    <h3 className="font-semibold text-lg mt-4 mb-1">Simple & Intuitive Scoring</h3>
    <p className="mb-2 text-gray-700">
      We simply ask: <b>"How many times off were you?"</b><br />
      This works the same for all post sizes - no complex math!
    </p>
    <div className="bg-orange-50 rounded p-3 mb-2 text-sm">
      <b>Smart Multi-Tier Scoring:</b><br />
      
      <b>Small Numbers (≤10 upvotes) - Absolute Difference:</b><br />
      - Off by 1: <b>100 pts</b> | Off by 2: <b>95 pts</b> | Off by 3: <b>90 pts</b><br />
      - Off by 5: <b>80 pts</b> | Off by 10: <b>70 pts</b><br />
      
      <b>Larger Numbers - Ratio + Magnitude Bonus:</b><br />
      - Within 2x: <b>85 pts</b> | Within 3x: <b>75 pts</b> | Within 5x: <b>65 pts</b><br />
      - Same magnitude: <b>Min 60 pts</b> | Close magnitude: <b>Min 45 pts</b><br />
      <br />
      <b>Examples showing the improvements:</b><br />
      - Guess 1 vs Actual 3: Off by 2 = <b>95 pts</b> (absolute difference!)<br />
      - Guess 50 vs Actual 1000: 20x off BUT close magnitude = <b>45 pts</b><br />
      - Guess 800 vs Actual 1200: 1.5x + same magnitude = <b>90 pts</b><br />
      - Guess 2 vs Actual 10: Off by 8 = <b>70 pts</b> (small number bonus)<br />
      <br />
      <span className="text-xs text-gray-500">Perfect for small posts where being off by 2-3 upvotes is actually great!</span>
    </div>
    <p className="text-gray-700">
      <b>Why?</b> This system rewards intuition for scale, not just raw numbers. Try to get as close as possible on the log scale!
    </p>
  </div>
);
