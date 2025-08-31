import type { Post } from '../App';

export const fetchPosts = async (sub: string): Promise<Post[]> => {
  const res = await fetch(`/api/getPosts?subreddit=${encodeURIComponent(sub)}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json();
};
// Utility functions for quiz calculations

// diff is log10(actual) - log10(guess)
// 1% error: log10(1.01) ≈ 0.0044
// 10% error: log10(1.1) ≈ 0.0414
export function getFeedback(diff: number) {
  if (diff < 0.0044) return { text: `Perfect! (log diff: ${diff.toFixed(3)})`, emoji: '🎯' };
  if (diff < 0.0414) return { text: `Awesome! (log diff: ${diff.toFixed(3)})`, emoji: '🌟' };
  if (diff < 0.1) return { text: `So close! (log diff: ${diff.toFixed(3)})`, emoji: '🔥' };
  if (diff < 0.25) return { text: `Not bad! (log diff: ${diff.toFixed(3)})`, emoji: '👍' };
  if (diff < 1.0) return { text: `Pretty far (log diff: ${diff.toFixed(3)})`, emoji: '🤔' };
  return { text: `Way off! (log diff: ${diff.toFixed(3)})`, emoji: '😅' };
}

export function getLogScore(actual: number, guess: number) {
  const maxPoints = 100;
  if (actual <= 0 || guess <= 0) return 0;
  const diff = Math.abs(Math.log10(actual) - Math.log10(guess));
  // Sigmoid-based scoring: close guesses get most points, far guesses drop off smoothly
  // 0 diff = 100 pts, 0.1 diff ~88 pts, 0.25 diff ~73 pts, 0.5 diff ~50 pts, 1.0 diff ~27 pts
  const sigmoid = (x: number) => 1 / (1 + Math.exp(4 * (x - 0.25)));
  const points = Math.round(maxPoints * sigmoid(diff));
  return points;
}
