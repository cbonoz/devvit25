import React from 'react';
import type { Post } from '../App';
import { getLogScore, getLooseLowerBound, getLooseUpperBound } from '../util';

interface QuizQuestionProps {
  post: Post;
  current: number;
  guess: string;
  setGuess: (val: string) => void;
  showResult: boolean;
  lastEmoji: string;
  lastFeedback: string;
  lastPoints: number | null;
  handleGuess: () => void;
  loadingPosts: boolean;
  imgError: boolean;
  setImgError: (b: boolean) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  post,
  current,
  guess,
  setGuess,
  showResult,
  lastEmoji,
  lastFeedback,
  lastPoints,
  handleGuess,
  loadingPosts,
  imgError,
  setImgError,
}) => {
  if (loadingPosts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="w-full max-w-md bg-white rounded shadow p-8 flex flex-col items-center">
          <span className="text-lg font-semibold text-[#d93900] mb-2">Loading posts...</span>
          {imgError ? (
            <span style={{ fontSize: '2.5rem' }}>⏳</span>
          ) : (
            <img
              src="/loading.gif"
              alt="Loading"
              className="w-16 h-16"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>
    );
  }
  const [hintIndex, setHintIndex] = React.useState(0);
  const [showHint, setShowHint] = React.useState(false);
  const [hintCount, setHintCount] = React.useState(0);
  const MAX_HINTS = 3;

  // Reset hint state when post changes
  React.useEffect(() => {
    setShowHint(false);
    setHintIndex(0);
  }, [post.id]);


  // Compose hint options
  const hintOptions: string[] = [];
  if (post.created) {
    hintOptions.push(`Posted on: ${new Date(post.created * 1000).toLocaleString()}`);
  }
  if (typeof post.upvotes === 'number') {
    const lower = getLooseLowerBound(post.upvotes);
    if (lower > 0 && post.upvotes > lower) {
      hintOptions.push(`Upvotes are above ${lower.toLocaleString()}`);
    }
    const upper = getLooseUpperBound(post.upvotes);
    if (upper > post.upvotes) {
      hintOptions.push(`Upvotes are below ${upper.toLocaleString()}`);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-center">Post {current + 1} of 5</h2>
        <div className="relative w-full flex flex-col items-center">
          {post.image ? (
            <img
              src={post.image}
              alt="Post"
              className="mb-4 rounded-lg border border-gray-200 shadow z-0 w-48 h-48 object-contain md:w-72 md:h-72"
            />
          ) : null}
        </div>
        {/* Result feedback is now always below the image, never overlapping */}
        {showResult && (
          <div className={`w-full flex flex-col items-center gap-2 mb-8 mt-12 ${showResult ? 'animate-bounce' : ''}`} style={{ animationIterationCount: showResult ? 3 : 0 }}>
            <span className="text-3xl">{lastEmoji}</span>
            <span className="text-2xl font-bold text-[#d93900]">{lastFeedback}</span>
            <span className="text-xl text-gray-900 font-semibold">
              Your guess: <span className="text-[#d93900]">{Number(guess).toLocaleString()}</span>
              <span className="mx-2">vs</span>
              Actual: <span className="text-[#1a7f37]">{post.upvotes.toLocaleString()}</span>
            </span>
            {/* Visual log-diff bar, scaled to points out of 100 */}
            {(() => {
              const actual = post.upvotes;
              const userGuess = Number(guess);
              if (actual > 0 && userGuess > 0) {
                const points = getLogScore(actual, userGuess);
                // 0 = perfect, 100 = perfect, 50 = ok, 0 = bad
                let color = '#22c55e'; // green
                if (points < 73) color = '#facc15'; // yellow
                if (points < 50) color = '#f97316'; // orange
                if (points < 27) color = '#ef4444'; // red
                return (
                  <div className="w-full max-w-xs h-3 bg-gray-200 rounded-full overflow-hidden my-2" title={`Points: ${points}/100`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${points}%`, background: color }}
                    />
                  </div>
                );
              }
              return null;
            })()}
            <span className="text-xs text-gray-500">You earned <b>{lastPoints}</b> points</span>
            <span className="text-xs text-gray-400 mt-1">Scoring uses percentage error: closer guesses earn more points.</span>
          </div>
        )}
        {/* Title, hint, and input only when not showing result */}
        {!showResult && (
          <>
            <div className="text-center text-gray-900 font-semibold mb-6 text-2xl leading-snug break-words max-w-2xl">
              {post.title}
            </div>
            {/* Hint button and reveal, above input */}
            {hintOptions.length > 0 && (
              <div className="mb-2 flex flex-col items-center">
                {hintCount < MAX_HINTS ? (
                  <button
                    className="text-sm underline text-[#d93900] hover:text-[#b32a00]"
                    type="button"
                    onClick={() => {
                      setShowHint(true);
                      setHintIndex((i) => (i + 1) % hintOptions.length);
                      setHintCount((c) => c + 1);
                    }}
                    title="Reveal a hint"
                  >
                    {showHint ? 'Next Hint' : 'Show Hint'} (Hints left: {Math.max(0, MAX_HINTS - hintCount)})
                  </button>
                ) : (
                  <span className="text-sm text-gray-400">No hints remaining</span>
                )}
                {showHint && (
                  <div className="mt-2 text-xs text-gray-700 bg-orange-50 rounded p-2">
                    {hintOptions[hintIndex]}
                  </div>
                )}
              </div>
            )}
            <input
              className="border px-3 py-2 rounded text-center mb-3 text-lg"
              type="number"
              min={1}
              placeholder="Guess upvotes"
              value={guess}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 1) setGuess(val);
              }}
              disabled={showResult}
            />
            <button
              className="bg-[#d93900] text-white px-6 py-2 rounded font-semibold hover:bg-[#b32a00] transition-colors text-lg"
              onClick={handleGuess}
              disabled={!guess || showResult}
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};
