import type { Post } from '../App';

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
  
  // Calculate percentage error for more intuitive scoring
  const ratio = guess / actual;
  const percentError = Math.abs(1 - ratio);
  
  // Much more lenient tolerance, especially for smaller numbers
  const logActual = Math.log10(actual);
  let baseTolerance = 0.35; // 35% base tolerance (much more lenient)
  
  // Extra leniency for smaller numbers where percentage errors look worse
  if (actual < 100) {
    baseTolerance = 0.50; // 50% tolerance for posts under 100 upvotes
  } else if (actual < 1000) {
    baseTolerance = 0.40; // 40% tolerance for posts under 1000 upvotes
  }
  
  const magnitudeBonus = Math.min(0.20, logActual * 0.04); // Up to 20% bonus for high-upvote posts
  const tolerance = baseTolerance + magnitudeBonus;
  
  // Much more generous scoring curve with more tiers
  if (percentError <= 0.01) return 100; // Within 1% = perfect
  if (percentError <= 0.05) return Math.round(95 - (percentError - 0.01) * 125); // 1-5% = 95-90 points
  if (percentError <= 0.15) return Math.round(90 - (percentError - 0.05) * 100); // 5-15% = 90-80 points
  if (percentError <= tolerance) return Math.round(80 - (percentError - 0.15) * 100); // 15%-tolerance = 80-60+ points
  
  // Very gradual decay for larger errors
  const scaledError = Math.max(0, (percentError - tolerance) / tolerance);
  const points = Math.round(60 * Math.exp(-scaledError * 0.8)); // Much gentler decay (was 1.5, now 0.8)
  return Math.max(10, points); // Minimum 10 points for trying (was 5)
}
