import type { NextApiRequest, NextApiResponse } from 'next';
import { getPosts } from '../../src/server/core/post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subreddit } = req.query;
  if (typeof subreddit !== 'string' || !subreddit) {
    res.status(400).json({ error: 'Missing subreddit' });
    return;
  }
  try {
    const posts = await getPosts(subreddit);
    res.status(200).json(posts);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Failed to fetch posts' });
  }
}
