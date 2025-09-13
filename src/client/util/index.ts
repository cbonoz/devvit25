import type { Post } from '../App';
import { MAX_SCORE } from '../constants';

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

// Feedback based on points earned (0-100)
export function getFeedback(points: number) {
  if (points >= 98) return { text: 'Perfect!', emoji: '🎯' };
  if (points >= 90) return { text: 'Awesome!', emoji: '🌟' };
  if (points >= 75) return { text: 'Great job!', emoji: '🔥' };
  if (points >= 60) return { text: 'Right ballpark!', emoji: '�' };
  if (points >= 50) return { text: 'Not bad!', emoji: '🤔' };
  if (points >= 30) return { text: 'Pretty far', emoji: '😐' };
  return { text: 'Way off!', emoji: '😅' };
}

export function getLogScore(actual: number, guess: number) {
  if (actual <= 0 || guess <= 0) return 0;
  
  // Special handling for very small numbers - absolute difference matters more than ratio
  if (actual <= 10 || guess <= 10) {
    const absoluteDiff = Math.abs(guess - actual);
    if (absoluteDiff <= 1) return 100; // Off by 1 = perfect for small numbers
    if (absoluteDiff <= 2) return 95;  // Off by 2 = excellent  
    if (absoluteDiff <= 3) return 90;  // Off by 3 = great (your example: guess 1, actual 3)
    if (absoluteDiff <= 5) return 80;  // Off by 5 = very good
    if (absoluteDiff <= 10) return 70; // Off by 10 = good
    // For larger absolute differences on small numbers, fall through to ratio system
  }
  
  // Calculate basic ratio (how many times off)
  const ratio = Math.max(guess, actual) / Math.min(guess, actual);
  
  // Base scoring tiers - generous but gets harsh for extreme differences
  let baseScore;
  if (ratio <= 1.1) baseScore = 100;   // Within 10%
  else if (ratio <= 1.25) baseScore = 95;   // Within 25%
  else if (ratio <= 1.5) baseScore = 90;    // Within 50%
  else if (ratio <= 2.0) baseScore = 85;    // Within 2x
  else if (ratio <= 3.0) baseScore = 75;    // Within 3x
  else if (ratio <= 5.0) baseScore = 65;    // Within 5x
  else if (ratio <= 10.0) baseScore = 50;   // Within 10x
  else if (ratio <= 20.0) baseScore = 35;   // Within 20x
  else if (ratio <= 50.0) baseScore = 25;   // Within 50x
  else baseScore = 15;                       // Beyond 50x
  
  // Magnitude bonus: reward getting in the right "league" of upvotes
  const actualMagnitude = Math.log10(actual);
  const guessMagnitude = Math.log10(guess);
  const magnitudeDiff = Math.abs(actualMagnitude - guessMagnitude);
  
  // If you're in roughly the right magnitude (within ~1 order), give bonus points
  if (magnitudeDiff <= 0.3) {
    // Same magnitude (e.g., both in 10s, both in 100s, etc.)
    return Math.max(baseScore, 60); // Minimum 60 points for right magnitude
  } else if (magnitudeDiff <= 0.7) {
    // Close magnitude (e.g., 50 vs 200, 1000 vs 3000)
    return Math.max(baseScore, 45); // Minimum 45 points for close magnitude
  } else if (magnitudeDiff <= 1.0) {
    // One order off (e.g., 100 vs 1000, 10 vs 100)
    return Math.max(baseScore, 30); // Minimum 30 points for one order off
  }
  
  // For very different magnitudes, use base score but ensure minimum
  return Math.max(baseScore, 15);
}

// Final score feedback based on percentage of max score
export function getFinalScoreFeedback(score: number): { feedback: string; emoji: string } {
  const percent = score / MAX_SCORE;
  
  if (percent > 0.99) {
    return {
      feedback: 'Legendary! You are a true Reddit oracle.',
      emoji: '🏆'
    };
  } else if (percent > 0.9) {
    return {
      feedback: 'Amazing! You really know your Reddit virality.',
      emoji: '🔥'
    };
  } else if (percent > 0.75) {
    return {
      feedback: 'Great job! You have a keen sense for upvotes.',
      emoji: '👏'
    };
  } else if (percent > 0.5) {
    return {
      feedback: 'Not bad! You have a decent Reddit intuition.',
      emoji: '👍'
    };
  } else if (percent > 0.3) {
    return {
      feedback: 'Keep practicing! You can get even better. Getting to 400+ would be a great score.',
      emoji: '💡'
    };
  } else {
    return {
      feedback: 'Give it another shot! Virality is tricky.',
      emoji: '😅'
    };
  }
}
