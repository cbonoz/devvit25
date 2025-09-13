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
      <b>Scoring Breakdown (Very Lenient!):</b><br />
      - Within 1% of actual: 100 points<br />
      - 1-5% error: 95-90 points<br />
      - 5-15% error: 90-80 points<br />
      - 15-35% error: 80-60+ points (50% tolerance for posts under 100 upvotes!)<br />
      - 35%+ error: Very gradual decay, minimum 10 points<br />
      <br />
      <b>Examples:</b><br />
      - Guess 50 on a 29 upvote post: 72% error = ~30 points (small post bonus!)<br />
      - Guess 8,000 on a 10,000 upvote post: 20% error = ~75 points<br />
      - Guess 5,000 on a 10,000 upvote post: 50% error = ~40 points<br />
      <br />
      <b>Visual Feedback:</b> You'll see a colored bar showing your percentage accuracy.<br />
      <span className="text-xs text-gray-500">Much more forgiving - especially for smaller posts where percentage errors look worse!</span>
    </div>
    <p className="text-gray-700">
      <b>Why?</b> This system rewards intuition for scale, not just raw numbers. Try to get as close as possible on the log scale!
    </p>
  </div>
);
