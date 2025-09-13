import React, { useState } from 'react';
import { ViralityTestLogo } from './ViralityTestLogo';
import { showToast } from '@devvit/web/client';
import { MAX_SCORE, APP_URL } from '../constants';
import type { GuessResult } from '../App';

interface FinalScoreProps {
  score: number;
  guesses: GuessResult[];
  subreddit: string;
  startQuiz: (sub: string) => void;
  setScreen: (screen: any) => void;
}


export const FinalScore: React.FC<FinalScoreProps> = ({ score, guesses, subreddit, startQuiz, setScreen }) => {
  const shareMessage = `I scored ${score} on ViralityTest! Can you beat my score? Try it here: ${APP_URL}`;
  const handleShare = async () => {
    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ViralityTest Score',
          text: shareMessage,
          url: APP_URL,
        });
        showToast({ text: 'Shared successfully!', appearance: 'success' });
        return;
      } catch {
        // User cancelled or share failed, continue to clipboard fallback
      }
    }
    
    // Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareMessage);
        showToast({ text: 'Share message copied!', appearance: 'success' });
        return;
      } catch {}
    }
    
    // Fallback: Use input element with execCommand
    try {
      const tempInput = document.createElement('input');
      tempInput.value = shareMessage;
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-999999px';
      tempInput.style.top = '-999999px';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices
      
      const success = document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      if (success) {
        showToast({ text: 'Share message copied!', appearance: 'success' });
        return;
      }
    } catch {}
    
    // Final fallback: Show message for manual copy
    showToast(`Copy this message: ${shareMessage.substring(0, 40)}...`);
  };
  let feedback = '';
  let emoji = '';
  const percent = score / MAX_SCORE;
  if (percent > 0.99) {
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
    feedback = 'Keep practicing! You can get even better. 400+ is a great score.';
    emoji = '💡';
  } else {
    feedback = 'Give it another shot! Virality is tricky.';
    emoji = '😅';
  }
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopy = async (url: string, idx: number) => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedIndex(idx);
        showToast({ text: 'Link copied!', appearance: 'success' });
        return;
      } catch {}
    }
    
    // Fallback 1: Use input element with execCommand
    try {
      const tempInput = document.createElement('input');
      tempInput.value = url;
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-999999px';
      tempInput.style.top = '-999999px';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices
      
      const success = document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      if (success) {
        setCopiedIndex(idx);
        showToast({ text: 'Link copied!', appearance: 'success' });
        return;
      }
    } catch {}
    
    // Fallback 2: Show the URL for manual copy
    showToast(`Copy this link: ${url.substring(0, 50)}...`);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-2">
      {/* Toast handled by Devvit's showToast, no manual toast needed */}
      <div className="flex flex-col items-center w-full mt-2 mb-2">
        <ViralityTestLogo size="sm" />
        <span className="text-2xl font-bold text-[#d93900] mt-1 mb-2">Results</span>
        <button
          className="bg-[#ff9800] text-white px-4 py-2 rounded font-semibold hover:bg-[#d93900] mt-2 mb-2"
          onClick={handleShare}
        >
          Share this result
        </button>
      </div>
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
