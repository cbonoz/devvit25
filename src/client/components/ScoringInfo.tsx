import React from 'react';

export const ScoringInfo: React.FC = () => (
  <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-orange-200 mt-8">
    <h2 className="text-2xl font-bold text-[#d93900] mb-2 flex items-center gap-2">
      <span role="img" aria-label="scales">⚖️</span> Scoring System
    </h2>
    <p className="mb-2 text-gray-700">
      Reddit post scores follow a <b>power-law distribution</b> (most posts get few upvotes, some get hundreds of thousands). To make scoring fair, we normalize guesses:
    </p>
    <h3 className="font-semibold text-lg mt-4 mb-1">Percentage-Based Scoring</h3>
    <p className="mb-2 text-gray-700">
      We calculate your percentage error and use a more intuitive scoring system.<br />
      <b>Percentage Error</b> = <code>|1 - (your_guess / actual_upvotes)|</code><br />
      Higher upvote posts get slightly more forgiving scoring.
    </p>
    <div className="bg-orange-50 rounded p-3 mb-2 text-sm">
      <b>Smart Hybrid Scoring System:</b><br />
      
      <b>For tiny posts (≤10 upvotes):</b> Uses absolute difference instead of percentages<br />
      - Off by 1: 100 points | Off by 2: 95 points | Off by 3: 85 points<br />
      - Off by 5: 70 points | Off by 10: 50 points | Minimum: 20 points<br />
      
      <b>For small posts (11-50 upvotes):</b> Gentle percentage approach<br />
      - Within 20%: 80-100 points | Within 50%: 50-80 points | Minimum: 25 points<br />
      
      <b>For larger posts (50+ upvotes):</b> Percentage-based with high tolerance<br />
      - 1-5% error: 95-90 points | 5-15%: 90-80 points<br />
      - Up to 40-70% tolerance depending on size | Minimum: 15 points<br />
      <br />
      <b>Examples:</b><br />
      - Guess 5 on a 2 upvote post: Off by 3 = 85 points (absolute difference!)<br />
      - Guess 30 on a 20 upvote post: 50% error = ~50 points (gentle percentage)<br />
      - Guess 8,000 on a 10,000 upvote post: 20% error = ~75 points<br />
      <br />
      <span className="text-xs text-gray-500">The system automatically picks the fairest scoring method based on post size!</span>
    </div>
    <p className="text-gray-700">
      <b>Why?</b> This system rewards intuition for scale, not just raw numbers. Try to get as close as possible on the log scale!
    </p>
  </div>
);
