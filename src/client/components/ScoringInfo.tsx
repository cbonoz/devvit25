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
    <h3 className="font-semibold text-lg mt-4 mb-1">How Points Are Calculated</h3>
    <p className="mb-2 text-gray-700">
      We use a <b>sigmoid curve</b> for scoring, so close guesses get almost full points and far guesses drop off smoothly.<br />
      <b>Points</b> = <code>100 × sigmoid(10 × (0.18 - |log₁₀(actual) - log₁₀(guess)|))</code><br />
      <span className="text-xs text-gray-500">(sigmoid(x) = 1 / (1 + exp(-x)))</span>
    </p>
    <div className="bg-orange-50 rounded p-3 mb-2 text-sm">
      <b>What does this mean?</b><br />
      - 0 log difference (perfect): 100 points<br />
      - 0.001 log diff (~0.02% error): ~99 points<br />
      - 0.01 log diff (~2% error): ~98 points<br />
      - 0.05 log diff (~12% error): ~93 points<br />
      - 0.1 log diff (~26% error): ~80 points<br />
      - 0.25 log diff (~78% error): ~13 points<br />
      - 0.5 log diff (off by a factor of 3): ~0 points<br />
      <br />
      <b>Visual Feedback:</b> You'll see a colored bar and your log difference after each guess.<br />
      <span className="text-xs text-gray-500">Being off by a factor of 10 is much worse than being off by a factor of 2.</span>
    </div>
    <p className="text-gray-700">
      <b>Why?</b> This system rewards intuition for scale, not just raw numbers. Try to get as close as possible on the log scale!
    </p>
  </div>
);
