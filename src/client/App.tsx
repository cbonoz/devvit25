
import { useState } from 'react';

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
}

export const App = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Home);
  const [subreddit, setSubreddit] = useState('');
  const [customSubreddit, setCustomSubreddit] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Simulate fetching posts (replace with real API call)
  const fetchPosts = async (sub: string): Promise<Post[]> => {
    // Placeholder: generate 5 fake posts
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `${sub}-post${i}`,
      title: `Sample post ${i + 1} from r/${sub}`,
      upvotes: Math.floor(Math.random() * 10000),
      image: i % 2 === 0 ? '/snoo.png' : undefined,
    }));
  };

  const startQuiz = async (sub: string) => {
    setSubreddit(sub);
    setScreen(Screen.Quiz);
    setCurrent(0);
    setScore(0);
    setGuess('');
    setShowResult(false);
    setIsCorrect(false);
    const fetched = await fetchPosts(sub);
    setPosts(fetched);
  };

  const handleGuess = () => {
    const post = posts[current];
    if (!post) return;
    const correct = Number(guess) === post.upvotes;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setShowResult(false);
      setGuess('');
      if (current < posts.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setScreen(Screen.Final);
      }
    }, 1200);
  };

  // Home screen: subreddit selection
  if (screen === Screen.Home) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
        <h1 className="text-2xl font-bold text-center">Guess the Upvotes!</h1>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {POPULAR_SUBREDDITS.map((sub) => (
            <button
              key={sub}
              className="bg-[#d93900] text-white py-2 rounded font-semibold hover:bg-[#b32a00] transition-colors"
              onClick={() => startQuiz(sub)}
            >
              r/{sub}
            </button>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 border px-2 py-1 rounded"
              placeholder="Custom subreddit"
              value={customSubreddit}
              onChange={(e) => setCustomSubreddit(e.target.value)}
            />
            <button
              className="bg-[#d93900] text-white px-3 rounded hover:bg-[#b32a00]"
              disabled={!customSubreddit}
              onClick={() => startQuiz(customSubreddit)}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen: show post and input for upvotes
  if (screen === Screen.Quiz && posts.length) {
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
          <div className="mt-4 text-2xl font-bold animate-bounce">
            {isCorrect ? '✅ Correct!' : `❌ Wrong! (${post.upvotes} upvotes)`}
          </div>
        )}
      </div>
    );
  }

  // Final screen: show score and options
  if (screen === Screen.Final) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
        <h2 className="text-2xl font-bold">Your Score: {score} / 5</h2>
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
