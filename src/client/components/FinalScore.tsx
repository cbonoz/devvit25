import React from 'react';
import type { GuessResult } from '../App';

interface FinalScoreProps {
  score: number;
  guesses: GuessResult[];
  subreddit: string;
  startQuiz: (sub: string) => void;
  setScreen: (screen: any) => void;
}

export const FinalScore: React.FC<FinalScoreProps> = ({ score, guesses, subreddit, startQuiz, setScreen }) => {
  let feedback = '';
  let emoji = '';
  const percent = score / 500;
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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-2">
      <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl">{emoji}</span>
        <h2 className="text-2xl font-bold">Your Score: {score} / 500</h2>
        <span className="text-lg font-semibold text-[#d93900] text-center">{feedback}</span>
      </div>
      <div className="w-full max-w-2xl bg-white/90 rounded-xl shadow p-4 border border-orange-100">
        <h3 className="text-lg font-semibold mb-2 text-[#d93900]">Your Guesses</h3>
        <ol className="space-y-3">
          {guesses.map(({ post, guess }, i) => (
            <li key={post.id} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-base">
              <span className="font-bold text-gray-900">{i + 1}.</span>
              <a
                href={`https://reddit.com/comments/${post.id}`}
                className="text-[#d93900] underline font-semibold hover:text-[#b32a00]"
              >
                {post.title}
              </a>
              <span className="text-gray-700">Your guess: <b>{guess.toLocaleString()}</b></span>
              <span className="text-gray-700">Actual: <b>{post.upvotes.toLocaleString()}</b></span>
            </li>
          ))}
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
