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
  
  // Calculate both percentage error and absolute difference
  const ratio = guess / actual;
  const percentError = Math.abs(1 - ratio);
  const absoluteDiff = Math.abs(guess - actual);
  
  // For very small numbers, use a hybrid approach that considers absolute difference
  // This prevents huge percentage penalties when the actual numbers are tiny
  if (actual <= 10) {
    // For posts with 10 or fewer upvotes, use absolute difference primarily
    if (absoluteDiff <= 1) return 100; // Off by 1 = perfect for tiny numbers
    if (absoluteDiff <= 2) return 95;  // Off by 2 = excellent  
    if (absoluteDiff <= 3) return 85;  // Off by 3 = very good
    if (absoluteDiff <= 5) return 70;  // Off by 5 = good
    if (absoluteDiff <= 10) return 50; // Off by 10 = decent
    return Math.max(20, 50 - absoluteDiff); // Gentle decline, min 20 points
  }
  
  // For slightly larger numbers (11-50), use a gentler percentage approach
  if (actual <= 50) {
    const adjustedError = Math.min(percentError, absoluteDiff / actual * 2); // Cap the penalty
    if (adjustedError <= 0.20) return 100 - Math.round(adjustedError * 100); // 80-100 points for reasonable guesses
    if (adjustedError <= 0.50) return Math.round(80 - adjustedError * 60); // 50-80 points 
    return Math.max(25, Math.round(50 - adjustedError * 30)); // 25+ points minimum
  }
  
  // For larger numbers, use the existing percentage-based system but more lenient
  const logActual = Math.log10(actual);
  let baseTolerance = 0.40; // 40% base tolerance
  if (actual < 1000) baseTolerance = 0.50; // 50% for under 1000
  
  const magnitudeBonus = Math.min(0.20, logActual * 0.04);
  const tolerance = baseTolerance + magnitudeBonus;
  
  // Generous scoring curve for larger numbers
  if (percentError <= 0.01) return 100; // Within 1% = perfect
  if (percentError <= 0.05) return Math.round(95 - (percentError - 0.01) * 125); // 1-5% = 95-90 points
  if (percentError <= 0.15) return Math.round(90 - (percentError - 0.05) * 100); // 5-15% = 90-80 points
  if (percentError <= tolerance) return Math.round(80 - (percentError - 0.15) * 60); // 15%-tolerance = 80-60+ points
  
  // Very gradual decay for larger errors
  const scaledError = Math.max(0, (percentError - tolerance) / tolerance);
  const points = Math.round(60 * Math.exp(-scaledError * 0.6)); // Even gentler decay
  return Math.max(15, points); // Minimum 15 points for trying
}
