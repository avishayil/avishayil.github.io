/**
 * Unified "Posts & Notes" feed: Medium articles + curated LinkedIn posts.
 * Medium is pulled live at build time; LinkedIn has no public feed usable on a
 * static site, so those entries are curated by hand below.
 */
import { getArticles, type Article } from './medium';

export interface Post {
  title: string;
  url: string;
  /** ISO 8601 date string. */
  date: string;
  source: 'Medium' | 'LinkedIn';
}

/**
 * Curated LinkedIn posts (his most recent activity lives here, not on Medium).
 * Permalinks are real; dates are derived from each activity ID's timestamp.
 * Add new posts at the top as they're published.
 */
const LINKEDIN_POSTS: Post[] = [
  {
    title: 'Finishing the AI Security Engineer Foundations track',
    url: 'https://www.linkedin.com/posts/avishaybar_ai-security-engineer-foundations-avishaybar-activity-7495383711803408384-xrrV',
    date: '2026-08-18T00:00:00.000Z',
    source: 'LinkedIn',
  },
  {
    title: "How Dream's researchers exposed an AI-agent attack campaign",
    url: 'https://www.linkedin.com/posts/avishaybar_%D7%97%D7%95%D7%A7%D7%A8%D7%99-%D7%90%D7%91%D7%98%D7%97%D7%94-%D7%A9%D7%9C-%D7%A7%D7%91%D7%95%D7%A6%D7%AA-dream-%D7%97%D7%A9%D7%A4%D7%95-%D7%A7%D7%9E%D7%A4%D7%99%D7%99%D7%9F-%D7%AA%D7%A7%D7%99%D7%A4%D7%94-activity-7495084843307859968-KT08',
    date: '2026-08-17T00:00:00.000Z',
    source: 'LinkedIn',
  },
  {
    title: 'Model-provider defense layers, and the shrinking response window',
    url: 'https://www.linkedin.com/posts/avishaybar_expanding-daybreak-as-the-cyber-defense-window-activity-7494287324940312576-vTL3',
    date: '2026-08-15T00:00:00.000Z',
    source: 'LinkedIn',
  },
  {
    title: 'AWS IAM Role Manager and getting trust policies right',
    url: 'https://www.linkedin.com/posts/avishaybar_aws-recently-introduced-iam-role-manager-activity-7494053019517571072-Acw7',
    date: '2026-08-14T00:00:00.000Z',
    source: 'LinkedIn',
  },
  {
    title: 'Security gates in CI/CD: the recurring DevSecOps debate',
    url: 'https://www.linkedin.com/posts/avishaybar_vulnerabilitymanagement-cicd-devsecops-activity-7493661098320187393-guy7',
    date: '2026-08-13T00:00:00.000Z',
    source: 'LinkedIn',
  },
];

function articleToPost(article: Article): Post {
  return {
    title: article.title,
    url: article.link,
    date: article.date,
    source: 'Medium',
  };
}

function byDateDesc(a: Post, b: Post): number {
  const ta = a.date ? new Date(a.date).getTime() : 0;
  const tb = b.date ? new Date(b.date).getTime() : 0;
  return tb - ta;
}

/**
 * Combined, newest-first list of posts across sources.
 * @param limit optional cap on the number returned.
 */
export async function getPosts(limit?: number): Promise<Post[]> {
  const medium = (await getArticles()).map(articleToPost);
  const combined = [...LINKEDIN_POSTS, ...medium].sort(byDateDesc);
  return typeof limit === 'number' ? combined.slice(0, limit) : combined;
}
