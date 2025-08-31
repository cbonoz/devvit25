
import { useState } from 'react';

import { ScoringInfo } from './components/ScoringInfo';
import { QuizQuestion } from './components/QuizQuestion';
import { FinalScore } from './components/FinalScore';
import { getFeedback, getLogScore, fetchPosts } from './util';



export type Post = {
  id: string;
  title: string;
  upvotes: number;
  image?: string | undefined;
  created?: number;
};

export type GuessResult = {
  post: Post;
  guess: number;
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
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
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


  const startQuiz = async (sub: string) => {
    setSubreddit(sub);
    setScreen(Screen.Quiz);
    setCurrent(0);
    setScore(0);
    setGuess('');
    setShowResult(false);
    setGuesses([]);
    setLoadingPosts(true);
    try {
      const fetched = await fetchPosts(sub);
      setPosts(fetched);
    } finally {
      setLoadingPosts(false);
    }
  };


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
    setGuesses((prev) => [...prev, { post, guess: userGuess }]);
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
      <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 bg-gradient-to-br from-orange-100 via-white to-red-100 px-4 overflow-hidden">
  {/* Animated background shapes */}
  <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-200 rounded-full opacity-40 blur-2xl animate-pulse z-0" />
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-200 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
  <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-red-200 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
  {/* Subtle rotating shapes */}
  <div className="absolute top-10 left-10 w-10 h-10 bg-blue-300 rounded-lg opacity-40 z-0 animate-spin-slow" style={{ animationDuration: '8s' }} />
  <div className="absolute bottom-16 right-24 w-8 h-8 bg-green-300 rounded-full opacity-30 z-0 animate-spin-reverse" style={{ animationDuration: '12s' }} />
  <div className="absolute top-1/2 right-10 w-6 h-6 bg-purple-300 rounded-md opacity-30 z-0 animate-spin-slow" style={{ animationDuration: '10s' }} />
  {/* New rotating square on the right */}
  <div className="absolute top-24 right-10 w-12 h-12 bg-indigo-300 rounded-lg opacity-40 z-0 animate-spin-slow" style={{ animationDuration: '14s' }} />
        <div className="flex flex-col items-center gap-2 z-10">
          <img
            src="/snoo_wink.png"
            alt="Snoo Wink"
            className="w-36 h-36 md:w-48 md:h-48 mb-2 drop-shadow-lg"
            draggable={false}
          />
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d93900] via-[#ff9800] to-[#d93900] tracking-tight drop-shadow-sm mb-2">ViralityTest</h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium italic mt-1 text-center max-w-xl drop-shadow-sm">Can you guess how viral a Reddit post is? <span className="text-[#d93900] font-bold">Test your upvote intuition</span> and challenge your friends!</p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs bg-white/90 rounded-xl shadow-2xl p-6 border border-orange-200 z-10">
          <span className="text-center text-gray-800 font-semibold mb-2 text-lg">Choose a subreddit to start:</span>
          {POPULAR_SUBREDDITS.map((sub) => (
            <button
              key={sub}
              className="bg-gradient-to-r from-[#d93900] to-[#ff9800] text-white py-2 rounded font-bold hover:from-[#b32a00] hover:to-[#ff9800] transition-all shadow-md text-lg tracking-wide"
              onClick={() => startQuiz(sub)}
            >
              r/{sub}
            </button>
          ))}
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 border border-gray-300 px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#d93900] text-lg"
              placeholder="Custom subreddit"
              value={customSubreddit}
              onChange={(e) => setCustomSubreddit(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-[#d93900] to-[#ff9800] text-white px-4 rounded hover:from-[#b32a00] hover:to-[#ff9800] font-bold shadow-md text-lg"
              disabled={!customSubreddit}
              onClick={() => startQuiz(customSubreddit)}
            >
              Go
            </button>
          </div>
          <button
            className="mt-4 underline text-[#d93900] hover:text-[#b32a00] text-base font-medium"
            onClick={() => setScreen(Screen.ScoringInfo)}
          >
            How does scoring work?
          </button>
        </div>
        <footer className="mt-8 text-gray-400 text-xs text-center z-10">
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
    if (loadingPosts && posts.length === 0) {
      // Show loading indicator while fetching posts
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <div className="w-full max-w-md bg-white rounded shadow p-8 flex flex-col items-center">
            <span className="text-lg font-semibold text-[#d93900] mb-2">Loading posts...</span>
            <img
              src="/loading.gif"
              alt="Loading"
              className="w-20 h-20 max-w-[80px] max-h-[80px] object-contain"
              style={{ width: '100%', maxWidth: 80, height: 'auto' }}
            />
          </div>
        </div>
      );
    }
    if (posts.length) {
      const post = posts[current];
      if (!post) return null;
      return (
        <QuizQuestion
          post={post}
          current={current}
          guess={guess}
          setGuess={setGuess}
          showResult={showResult}
          lastEmoji={lastEmoji}
          lastFeedback={lastFeedback}
          lastPoints={lastPoints}
          handleGuess={handleGuess}
          loadingPosts={loadingPosts}
          imgError={imgError}
          setImgError={setImgError}
        />
      );
    }
    return null;
  }

  if (screen === Screen.Final) {
    return (
      <FinalScore
        score={score}
        guesses={guesses}
        subreddit={subreddit}
        startQuiz={startQuiz}
        setScreen={setScreen}
      />
    );
  }

  return null;
}
