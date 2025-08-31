import React from 'react';

export const ScoringInfo: React.FC = () => (
  <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-orange-200 mt-8">
    <h2 className="text-2xl font-bold text-[#d93900] mb-2 flex items-center gap-2">
      <span role="img" aria-label="scales">⚖️</span> Scoring System
    </h2>
    <p className="mb-2 text-gray-700">
      Reddit post scores follow a <b>power-law distribution</b> (most posts get few upvotes, some get hundreds of thousands). To make scoring fair, we normalize guesses:
    </p>
    <h3 className="font-semibold text-lg mt-4 mb-1">Logarithmic Scoring</h3>
    <p className="mb-2 text-gray-700">
      Upvotes are converted to <code>log₁₀(upvotes)</code> before comparing.
    </p>
    <div className="bg-orange-50 rounded p-3 mb-2 text-sm">
      <b>Example:</b><br />
      100 upvotes → log₁₀ = 2<br />
      10,000 upvotes → log₁₀ = 4
    </div>
    <p className="mb-2 text-gray-700">
      <b>Points</b> = <code>max_points - (|log₁₀(actual) - log₁₀(guess)| × scale_factor)</code>
    </p>
    <p className="text-gray-700">
      This means guessing 1,000 when the actual is 10,000 feels “close,” but guessing 10 when it’s 10,000 feels way off.
    </p>
  </div>
);
