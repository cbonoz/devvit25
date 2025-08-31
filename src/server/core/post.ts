import { reddit } from '@devvit/web/server';

type RedditPost = {
  id: string;
  title: string;
  score: number;
  stickied?: boolean;
  is_ad?: boolean;
  thumbnail?: string;
};
// Fetch 5 hot posts from a subreddit for the quiz

export const getPosts = async (subreddit: string) => {
  if (!subreddit) throw new Error('subreddit is required');
  const postsListing = await reddit.getHotPosts({
    subredditName: subreddit,
    limit: 15,
  });
  const posts: RedditPost[] = postsListing && typeof postsListing.all === 'function' ? await postsListing.all() : Array.isArray(postsListing) ? postsListing : [];
  const filtered = posts.filter(
    (p) => !p.stickied && !p.is_ad && typeof p.score === 'number' && p.title
  );
  const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 5);
  return shuffled.map((p) => {
    let image: string | undefined = undefined;
    if (p.thumbnail && typeof p.thumbnail === 'object' && typeof (p.thumbnail as any).url === 'string' && (p.thumbnail as any).url.startsWith('http')) {
      image = (p.thumbnail as any).url;
    } else if (typeof p.thumbnail === 'string' && p.thumbnail.startsWith('http')) {
      image = p.thumbnail;
    }
    return {
      id: p.id,
      title: p.title,
      upvotes: p.score,
      image,
    };
  });
};
