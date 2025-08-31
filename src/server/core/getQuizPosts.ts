import { reddit } from '@devvit/web/server';

export async function getQuizPosts(subreddit: string) {
  // Fetch 15 hot posts, filter out stickied, deleted, or NSFW, and pick 5
  const listing = await reddit.getHotPosts({ subredditName: subreddit, limit: 15 });
  const posts = [...listing];
  const filtered = posts
    .filter((p: any) =>
      !p.stickied &&
      !p.removed &&
      !p.over18 &&
      p.score > 0 &&
      p.title &&
      typeof p.score === 'number'
    )
    .slice(0, 5)
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      upvotes: p.score,
      image: p.thumbnail && typeof p.thumbnail === 'string' && p.thumbnail.startsWith('http') ? p.thumbnail : undefined,
    }));
  return filtered;
}
