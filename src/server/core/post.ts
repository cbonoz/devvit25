import { reddit } from '@devvit/web/server';

const NUM_QUIZ_QUESTIONS = 5;
const RESULT_LIMIT  = 25;


function filterValidPosts(posts: any[]): any[] {
  return posts.filter((p: any) =>
    !p.stickied &&
    !p.is_ad &&
    typeof p.score === 'number' &&
    p.title &&
    p.score > 0
  );
}

async function fetchPosts(subreddit: string, type: string, topTimeRanges: string[]): Promise<any[]> {
  let postsListing: any;
  if (type === 'hot') {
    postsListing = await reddit.getHotPosts({ subredditName: subreddit, limit: RESULT_LIMIT });
  } else if (type === 'rising') {
    postsListing = await reddit.getRisingPosts({ subredditName: subreddit, limit: RESULT_LIMIT });
  } else if (type === 'top') {
    const idx = Math.floor(Math.random() * topTimeRanges.length);
    const timeframe = topTimeRanges[idx] as "hour"|"day"|"week"|"month"|"year"|"all";
    postsListing = await reddit.getTopPosts({ subredditName: subreddit, timeframe, limit: RESULT_LIMIT });
  } else {
    return [];
  }
  if (postsListing && typeof postsListing.all === 'function') {
    return await postsListing.all();
  }
  return Array.isArray(postsListing) ? postsListing : [];
}

export const getPosts = async (subreddit: string) => {
  if (!subreddit) throw new Error('subreddit is required');
  const listingTypes = ['hot', 'top', 'rising'];
  const topTimeRanges = ['hour', 'day', 'week', 'month', 'year', 'all'];
  let filtered: any[] = [];
  let attempts = 0;
  while (filtered.length < NUM_QUIZ_QUESTIONS && attempts < 4) {
    const idx = Math.floor(Math.random() * listingTypes.length);
    const type: string = listingTypes[idx] ?? 'hot';
    let posts = await fetchPosts(subreddit, type, topTimeRanges);
    filtered = filterValidPosts(posts);
    attempts++;
  }
  // Fallback: if still not enough, try 'hot' only
  if (filtered.length < NUM_QUIZ_QUESTIONS) {
  let postsListing: any = await reddit.getHotPosts({ subredditName: subreddit, limit: RESULT_LIMIT });
  let posts = postsListing && typeof postsListing.all === 'function' ? await postsListing.all() : Array.isArray(postsListing) ? postsListing : [];
  filtered = filterValidPosts(posts);
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
