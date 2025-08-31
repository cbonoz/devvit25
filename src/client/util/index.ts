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
  if (diff < 0.0044) return { text: 'Perfect!', emoji: '🎯' };
  if (diff < 0.0414) return { text: 'Awesome!', emoji: '🌟' };
  if (diff < 0.1) return { text: 'So close!', emoji: '🔥' };
  if (diff < 0.25) return { text: 'Not bad!', emoji: '👍' };
  if (diff < 1.0) return { text: 'Pretty far', emoji: '🤔' };
  return { text: 'Way off!', emoji: '😅' };
}

export function getLogScore(actual: number, guess: number) {
  const maxPoints = 100;
  const scaleFactor = 33; // 1 log10 off = lose 33 points
  if (actual <= 0 || guess <= 0) return 0;
  const diff = Math.abs(Math.log10(actual) - Math.log10(guess));
  const points = Math.max(0, Math.round(maxPoints - diff * scaleFactor));
  return points;
}
