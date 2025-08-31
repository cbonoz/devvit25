import React from 'react';
import type { Post } from '../App';

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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-center">Post {current + 1} of 5</h2>
        <div className="relative w-full flex flex-col items-center">
          {post.image ? (
            <img src={post.image} alt="Post" className="w-72 h-72 object-contain mb-4 rounded-lg border border-gray-200 shadow z-0" />
          ) : null}
        </div>
        <div className="text-center text-gray-900 font-semibold mb-6 text-2xl leading-snug break-words max-w-2xl">
          {post.title}
        </div>
        {!showResult ? (
          <>
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
        ) : (
      <div className="w-full flex flex-col items-center gap-2 animate-bounce mb-8">
            <span className="text-3xl">{lastEmoji}</span>
            <span className="text-2xl font-bold text-[#d93900]">
              {lastFeedback}
            </span>
            <span className="text-xl text-gray-900 font-semibold">
              Your guess: <span className="text-[#d93900]">{Number(guess).toLocaleString()}</span>
              <span className="mx-2">vs</span>
              Actual: <span className="text-[#1a7f37]">{post.upvotes.toLocaleString()}</span>
            </span>
            <span className="text-xs text-gray-500">You earned <b>{lastPoints}</b> points</span>
          </div>
        )}
      </div>
    </div>
  );
};
