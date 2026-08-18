/**
 * Build-time Medium data.
 * Fetches and parses the author's Medium RSS feed into a typed article list.
 * Falls back to a committed snapshot if the feed is unavailable at build time.
 */
import { XMLParser } from 'fast-xml-parser';

export interface Article {
  title: string;
  link: string;
  /** ISO 8601 date string (e.g. "2021-12-31T00:00:00.000Z"). */
  date: string;
  tags: string[];
}

export const MEDIUM_USER = '@avishayil';
export const MEDIUM_PROFILE = `https://medium.com/${MEDIUM_USER}`;
const FEED_URL = `https://medium.com/feed/${MEDIUM_USER}`;

/** Offline snapshot used only when the live fetch fails. */
const SNAPSHOT: Article[] = [
  { title: "You Shouldn't Use the EC2 Launch Wizard", link: 'https://medium.com/@avishayil', date: '2021-12-31T00:00:00.000Z', tags: ['aws', 'ec2', 'security', 'cloud-security'] },
  { title: 'Clearing the AWS Certified Security — Specialty Exam (Updated 2022)', link: 'https://medium.com/@avishayil', date: '2021-12-17T00:00:00.000Z', tags: ['security-specialty', 'cloud-security', 'aws'] },
  { title: 'Serverless Jupyter Hub with AWS Fargate and CDK', link: 'https://medium.com/@avishayil', date: '2021-06-08T00:00:00.000Z', tags: ['aws', 'fargate', 'serverless'] },
  { title: 'Why Hosting your Blog on GitHub Pages is Great for your Career', link: 'https://medium.com/@avishayil', date: '2020-11-20T00:00:00.000Z', tags: ['serverless', 'github', 'blog'] },
  { title: 'How GitSecOps Can Help You Achieve Least Privilege', link: 'https://medium.com/@avishayil', date: '2020-08-18T00:00:00.000Z', tags: ['least-privilege', 'aws', 'security'] },
];

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  category?: string | string[];
}

/** Normalize RSS <category> (string | string[] | undefined) into a string[]. */
function toTags(category: RssItem['category']): string[] {
  if (!category) return [];
  return Array.isArray(category) ? category : [category];
}

/** Convert an RSS pubDate to an ISO date string, falling back to the raw value. */
function toIso(pubDate?: string): string {
  if (!pubDate) return '';
  const parsed = new Date(pubDate);
  return Number.isNaN(parsed.getTime()) ? pubDate : parsed.toISOString();
}

/**
 * Fetch and parse the Medium RSS feed.
 * @param limit optional cap on the number of returned articles.
 * @returns Article[] newest-first; snapshot on any failure.
 */
export async function getArticles(limit?: number): Promise<Article[]> {
  let articles: Article[];
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'avishay-co-il-build' },
    });
    if (!res.ok) {
      throw new Error(`Medium feed responded ${res.status}`);
    }
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);
    const rawItems: RssItem[] = parsed?.rss?.channel?.item ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    articles = items
      .filter((item) => item?.title && item?.link)
      .map((item) => ({
        title: String(item.title),
        link: String(item.link),
        date: toIso(item.pubDate),
        tags: toTags(item.category),
      }));
    if (articles.length === 0) {
      articles = SNAPSHOT;
    }
  } catch (err) {
    console.warn(
      `[medium] live fetch failed, using snapshot: ${(err as Error).message}`
    );
    articles = SNAPSHOT;
  }
  return typeof limit === 'number' ? articles.slice(0, limit) : articles;
}
