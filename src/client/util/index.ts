// Loose upvote bounds for hints
export function getLooseLowerBound(upvotes: number) {
  if (upvotes > 100000) return 10000;
  if (upvotes > 10000) return 1000;
  if (upvotes > 1000) return 100;
  if (upvotes > 100) return 10;
  if (upvotes > 10) return 1;
  return 0;
}

export function getLooseUpperBound(upvotes: number) {
  if (upvotes < 10) return 10;
  if (upvotes < 100) return 100;
  if (upvotes < 1000) return 1000;
  if (upvotes < 10000) return 10000;
  if (upvotes < 100000) return 100000;
  return 1000000;
}
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
  if (diff < 0.001) return { text: 'Perfect!', emoji: '🎯' };
  if (diff < 0.0414) return { text: 'Awesome!', emoji: '🌟' };
  if (diff < 0.1) return { text: 'So close!', emoji: '🔥' };
  if (diff < 0.25) return { text: 'Not bad!', emoji: '👍' };
  if (diff < 1.0) return { text: 'Pretty far', emoji: '🤔' };
  return { text: 'Way off!', emoji: '😅' };
}

export function getLogScore(actual: number, guess: number) {
  const maxPoints = 100;
  if (actual <= 0 || guess <= 0) return 0;
  const diff = Math.abs(Math.log10(actual) - Math.log10(guess));
  // Use a much steeper sigmoid, centered lower, for a continuous but more generous curve
  const sigmoid = (x: number) => 1 / (1 + Math.exp(10 * (x - 0.18)));
  const points = Math.round(maxPoints * sigmoid(diff));
  return points;
}
