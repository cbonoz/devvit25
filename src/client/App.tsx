
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
