import { reddit } from '@devvit/web/server';

type RedditPost = {
const NUM_QUIZ_QUESTIONS = 5;
// Fetch 5 hot posts from a subreddit for the quiz


export const getPosts = async (subreddit: string) => {
  if (!subreddit) throw new Error('subreddit is required');
  // Randomize listing type and time range
  const listingTypes = ['hot', 'new', 'top', 'rising'];
  const topTimeRanges = ['hour', 'day', 'week', 'month', 'year', 'all'];
  let posts: any[] = [];
  let filtered: any[] = [];
  let attempts = 0;
  while (filtered.length < NUM_QUIZ_QUESTIONS && attempts < 4) {
    let type = listingTypes[Math.floor(Math.random() * listingTypes.length)];
    let postsListing: any;
    if (type === 'hot') {
      postsListing = await reddit.getHotPosts({ subredditName: subreddit, limit: 15 });
    } else if (type === 'new') {
      postsListing = await reddit.getNewPosts({ subredditName: subreddit, limit: 15 });
    } else if (type === 'rising') {
      postsListing = await reddit.getRisingPosts({ subredditName: subreddit, limit: 15 });
    } else if (type === 'top') {
      const idx = Math.floor(Math.random() * topTimeRanges.length);
      const timeframe = topTimeRanges[idx] as "hour"|"day"|"week"|"month"|"year"|"all";
      postsListing = await reddit.getTopPosts({ subredditName: subreddit, timeframe, limit: 15 });
    }
    posts = postsListing && typeof postsListing.all === 'function' ? await postsListing.all() : Array.isArray(postsListing) ? postsListing : [];
    filtered = posts.filter((p: any) =>
      !p.stickied &&
      !p.is_ad &&
      typeof p.score === 'number' &&
      p.title &&
      p.score > 0 // Only allow posts with positive upvotes
    );
    attempts++;
  }
  // Fallback: if still not enough, try 'hot' only
  if (filtered.length < NUM_QUIZ_QUESTIONS) {
    const postsListing = await reddit.getHotPosts({ subredditName: subreddit, limit: 25 });
    posts = postsListing && typeof postsListing.all === 'function' ? await postsListing.all() : Array.isArray(postsListing) ? postsListing : [];
    filtered = posts.filter((p: any) =>
      !p.stickied &&
      !p.is_ad &&
      typeof p.score === 'number' &&
      p.title &&
      p.score > 0
    );
  }
  const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, NUM_QUIZ_QUESTIONS);
  return shuffled.map((p: any) => {
    let image: string | undefined = undefined;
    if (p.thumbnail && typeof p.thumbnail === 'object' && typeof (p.thumbnail as any).url === 'string' && (p.thumbnail as any).url.startsWith('http')) {
      image = (p.thumbnail as any).url;
    } else if (typeof p.thumbnail === 'string' && p.thumbnail.startsWith('http')) {
      image = p.thumbnail;
    }
    // Use created_utc if available, else created, else undefined
    let created: number | undefined = undefined;
    if (typeof p.created_utc === 'number') {
      created = p.created_utc;
    } else if (typeof p.created === 'number') {
      created = p.created;
    }
    return {
      id: p.id,
      title: p.title,
      upvotes: p.score,
      image,
      created,
    };
  });
};
