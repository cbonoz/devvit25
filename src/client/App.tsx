

import { useState } from 'react';
import { ScoringInfo } from './ScoringInfo';

type Post = {
  id: string;
  title: string;
  upvotes: number;
  image?: string | undefined;
};

const POPULAR_SUBREDDITS = ['pics', 'funny', 'AskReddit'];

enum Screen {
  Home,
  Quiz,
  Result,
  Final,
  ScoringInfo,
}

export const App = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Home);
  const [subreddit, setSubreddit] = useState('');
  const [customSubreddit, setCustomSubreddit] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [imgError, setImgError] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [lastFeedback, setLastFeedback] = useState<string>('');
  const [lastEmoji, setLastEmoji] = useState<string>('');

  // Fetch posts from API
  const fetchPosts = async (sub: string): Promise<Post[]> => {
    const res = await fetch(`/api/getPosts?subreddit=${encodeURIComponent(sub)}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  };

  const startQuiz = async (sub: string) => {
    setSubreddit(sub);
    setScreen(Screen.Quiz);
    setCurrent(0);
    setScore(0);
    setGuess('');
    setShowResult(false);
    setLoadingPosts(true);
    try {
      const fetched = await fetchPosts(sub);
      setPosts(fetched);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Log-based scoring and feedback
  const maxPoints = 100;
  const scaleFactor = 33; // 1 log10 off = lose 33 points
  function getLogScore(actual: number, guess: number) {
    if (actual <= 0 || guess <= 0) return 0;
    const diff = Math.abs(Math.log10(actual) - Math.log10(guess));
    const points = Math.max(0, Math.round(maxPoints - diff * scaleFactor));
    return points;
  }

  function getFeedback(diff: number) {
    if (diff < 0.1) return { text: 'Perfect!', emoji: '🎯' };
    if (diff < 0.25) return { text: 'So close!', emoji: '🔥' };
    if (diff < 0.5) return { text: 'Not bad!', emoji: '👍' };
    if (diff < 1.0) return { text: 'Pretty far', emoji: '🤔' };
    return { text: 'Way off!', emoji: '😅' };
  }

  const handleGuess = () => {
    const post = posts[current];
    if (!post) return;
    const actual = post.upvotes;
    const userGuess = Number(guess);
    let points = 0;
    let diff = 0;
    if (actual > 0 && userGuess > 0) {
      diff = Math.abs(Math.log10(actual) - Math.log10(userGuess));
      points = getLogScore(actual, userGuess);
    }
    setLastPoints(points);
    setScore((s) => s + points);
    const feedback = getFeedback(diff);
    setLastFeedback(feedback.text);
    setLastEmoji(feedback.emoji);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setGuess('');
      setLastPoints(null);
      setLastFeedback('');
      setLastEmoji('');
      if (current < posts.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setScreen(Screen.Final);
      }
    }, 1800);
  };

  // Home screen: subreddit selection
  if (screen === Screen.Home) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gradient-to-br from-orange-100 via-white to-red-100 px-4">
        <div className="flex flex-col items-center gap-2">
          <img className="object-contain w-28 h-28 mb-2 drop-shadow-lg" src="/snoo.png" alt="Snoo" />
          <h1 className="text-4xl font-extrabold text-[#d93900] tracking-tight drop-shadow-sm">ViralityTest</h1>
          <p className="text-lg text-gray-700 font-medium italic mt-1 text-center max-w-md">Can you guess how viral a Reddit post is? Test your upvote intuition and challenge your friends!</p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs bg-white/80 rounded-xl shadow-lg p-6 border border-orange-200">
          <span className="text-center text-gray-800 font-semibold mb-2">Choose a subreddit to start:</span>
          {POPULAR_SUBREDDITS.map((sub) => (
            <button
              key={sub}
              className="bg-[#d93900] text-white py-2 rounded font-semibold hover:bg-[#b32a00] transition-colors shadow"
              onClick={() => startQuiz(sub)}
            >
              r/{sub}
            </button>
          ))}
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#d93900]"
              placeholder="Custom subreddit"
              value={customSubreddit}
              onChange={(e) => setCustomSubreddit(e.target.value)}
            />
            <button
              className="bg-[#d93900] text-white px-3 rounded hover:bg-[#b32a00] font-semibold shadow"
              disabled={!customSubreddit}
              onClick={() => startQuiz(customSubreddit)}
            >
              Go
            </button>
          </div>
          <button
            className="mt-4 underline text-[#d93900] hover:text-[#b32a00] text-sm font-medium"
            onClick={() => setScreen(Screen.ScoringInfo)}
          >
            How does scoring work?
          </button>
        </div>
        <footer className="mt-8 text-gray-400 text-xs text-center">
          &copy; {new Date().getFullYear()} ViralityTest &mdash; Not affiliated with Reddit
        </footer>
      </div>
    );
  }
  if (screen === Screen.ScoringInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-red-100 px-4 py-8 flex flex-col items-center">
        <button
          className="mb-6 text-[#d93900] underline hover:text-[#b32a00] text-sm font-medium self-start"
          onClick={() => setScreen(Screen.Home)}
        >
          ← Back to Home
        </button>
        <ScoringInfo />
      </div>
    );
  }

  // Quiz screen: show post and input for upvotes
  if (screen === Screen.Quiz) {
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
    if (posts.length) {
      const post = posts[current];
      if (!post) return null;
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <div className="w-full max-w-md bg-white rounded shadow p-4 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2 text-center">Post {current + 1} of 5</h2>
            {post.image ? (
              <img src={post.image} alt="Post" className="w-32 h-32 object-contain mb-2" />
            ) : null}
            <div className="text-center text-gray-900 font-medium mb-4">{post.title}</div>
            <input
              className="border px-2 py-1 rounded text-center mb-2"
              type="number"
              placeholder="Guess upvotes"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={showResult}
            />
            <button
              className="bg-[#d93900] text-white px-4 py-2 rounded font-semibold hover:bg-[#b32a00] transition-colors"
              onClick={handleGuess}
              disabled={!guess || showResult}
            >
              Submit
            </button>
          </div>
          {showResult && post && (
            <div className="mt-4 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-3xl">{lastEmoji}</span>
              <span className="text-xl font-bold text-[#d93900]">{lastFeedback}</span>
              <span className="text-base text-gray-700">You earned <b>{lastPoints}</b> points</span>
              <span className="text-xs text-gray-500">Actual: {post.upvotes.toLocaleString()} | Your guess: {guess}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  // Final screen: show score and options
  if (screen === Screen.Final) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
        <h2 className="text-2xl font-bold">Your Score: {score} / 500</h2>
        <div className="flex gap-4">
          <button
            className="bg-[#d93900] text-white px-4 py-2 rounded font-semibold hover:bg-[#b32a00]"
            onClick={() => startQuiz(subreddit)}
          >
            Try Again
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300"
            onClick={() => setScreen(Screen.Home)}
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
};
