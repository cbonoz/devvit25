import React, { useState } from 'react';
import type { GuessResult } from '../App';

interface FinalScoreProps {
  score: number;
  guesses: GuessResult[];
  subreddit: string;
  startQuiz: (sub: string) => void;
  setScreen: (screen: any) => void;
}

const MAX_SCORE = 500;

export const FinalScore: React.FC<FinalScoreProps> = ({ score, guesses, subreddit, startQuiz, setScreen }) => {
  let feedback = '';
  let emoji = '';
  const percent = score / MAX_SCORE;
  if (percent === 1) {
    feedback = 'Legendary! You are a true Reddit oracle.';
    emoji = '🏆';
  } else if (percent > 0.9) {
    feedback = 'Amazing! You really know your Reddit virality.';
    emoji = '🔥';
  } else if (percent > 0.75) {
    feedback = 'Great job! You have a keen sense for upvotes.';
    emoji = '👏';
  } else if (percent > 0.5) {
    feedback = 'Not bad! You have a decent Reddit intuition.';
    emoji = '👍';
  } else if (percent > 0.3) {
    feedback = 'Keep practicing! You can get even better.';
    emoji = '💡';
  } else {
    feedback = 'Give it another shot! Virality is tricky.';
    emoji = '😅';
  }
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const handleCopy = async (url: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(idx);
      setShowCopied(true);
      setTimeout(() => {
        setCopiedIndex(null);
        setShowCopied(false);
      }, 1200);
    } catch {}
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-2">
      {showCopied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 text-lg animate-bounce">
          Link copied!
        </div>
      )}
      <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl">{emoji}</span>
        <h2 className="text-2xl font-bold">Your Score: {score} / {MAX_SCORE}</h2>
        <span className="text-lg font-semibold text-[#d93900] text-center">{feedback}</span>
      </div>
      <div className="w-full max-w-2xl bg-white/90 rounded-xl shadow p-4 border border-orange-100">
        <h3 className="text-lg font-semibold mb-2 text-[#d93900]">Your Guesses</h3>
        <p className="text-xs text-gray-500 mb-2">If a link doesn't open, copy and paste it into a new browser tab.</p>
        <ol className="space-y-3">
          {(guesses || []).map(({ post, guess }, i) => {
            const url = subreddit ? `https://www.reddit.com/r/${subreddit}/comments/${post.id}` : `https://www.reddit.com/comments/${post.id}`;
            return (
              <li key={post.id} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-base">
                <button
                  className="text-[#d93900] underline font-semibold hover:text-[#b32a00] text-left"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={() => handleCopy(url, i)}
                  type="button"
                  title="Copy Reddit link to clipboard"
                >
                  {post.title} <span className="ml-1 text-xs">{copiedIndex === i ? '✅' : '🔗'}</span>
                </button>
                <span className="text-gray-700">Your guess: <b>{guess.toLocaleString()}</b></span>
                <span className="text-gray-700">Actual: <b>{post.upvotes.toLocaleString()}</b></span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-[#d93900] text-white px-4 py-2 rounded font-semibold hover:bg-[#b32a00]"
          onClick={() => startQuiz(subreddit)}
        >
          Try Again
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300"
          onClick={() => setScreen(0)}
        >
          Home
        </button>
      </div>
    </div>
  );
};
