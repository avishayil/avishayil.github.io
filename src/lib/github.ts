/**
 * Build-time GitHub data.
 * Fetches public repos for a user and returns a curated, ordered subset.
 * Falls back to a committed snapshot if the API is unavailable at build time,
 * so a network hiccup never breaks the build.
 */

export interface Repo {
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  topics: string[];
  /** npm monthly downloads, when the repo maps to a published package. */
  downloads?: number;
}

const GITHUB_USER = 'avishayil';

/**
 * Curated allowlist — controls WHICH repos appear and in WHAT order.
 * Anything not listed here is ignored on the homepage "selected work" strip.
 */
export const FEATURED_REPOS: readonly string[] = [
  'attestarc-skill',
  'dvah',
  'caponeme',
  'cdk-goat',
  'cf-signer',
  'cdk-bucket-takeover-scanner',
  'secure_ec2',
  'rag-search-homeassistant',
  'react-native-restart',
];

/**
 * Repos pinned to the top of the homepage strip, in display order.
 * Pinned repos bypass the stars sort so current work stays visible
 * even before it accumulates stars.
 */
const PINNED_REPOS: readonly string[] = ['attestarc-skill', 'dvah'];

/**
 * Curated allowlist for the /open-source page: actively maintained,
 * security-relevant, or genuinely popular repos. Anything else (stale toys,
 * tests, personal infra) stays off the site.
 */
export const OPEN_SOURCE_REPOS: readonly string[] = [
  'attestarc-skill',
  'dvah',
  'caponeme',
  'cdk-goat',
  'cdk-private-api-domain',
  'cf-signer',
  'cdk-bucket-takeover-scanner',
  'cloud-custodian-example',
  'secure_ec2',
  'rag-search-homeassistant',
  'react-native-restart',
  'react-native-user-avatar',
];

/** Repos published to npm → their package name (for monthly-download counts). */
const REPO_NPM: Record<string, string> = {
  'react-native-restart': 'react-native-restart',
  'react-native-user-avatar': 'react-native-user-avatar',
};

/** Minimal offline snapshot used only when the live fetch fails. */
const SNAPSHOT: Repo[] = [
  { name: 'caponeme', description: 'Repository demonstrating the Capital One breach on your AWS account.', url: `https://github.com/${GITHUB_USER}/caponeme`, language: 'Python', stars: 244, topics: ['aws', 'security', 'ssrf'] },
  { name: 'cdk-goat', description: 'Vulnerable by Design AWS Cloud Development Kit (CDK) Infrastructure.', url: `https://github.com/${GITHUB_USER}/cdk-goat`, language: 'Python', stars: 48, topics: ['aws', 'cdk', 'security'] },
  { name: 'cf-signer', description: 'Tool for signing and verifying the integrity of CloudFormation templates.', url: `https://github.com/${GITHUB_USER}/cf-signer`, language: 'Python', stars: 15, topics: ['aws', 'cloudformation', 'security'] },
  { name: 'cdk-bucket-takeover-scanner', description: 'Scans a list of AWS accounts for CDK S3 Bucket Takeover exposure.', url: `https://github.com/${GITHUB_USER}/cdk-bucket-takeover-scanner`, language: 'Python', stars: 7, topics: ['aws', 's3', 'security'] },
  { name: 'secure_ec2', description: 'CLI tool that helps you provision EC2 instances securely.', url: `https://github.com/${GITHUB_USER}/secure_ec2`, language: 'Python', stars: 5, topics: ['aws', 'ec2', 'security'] },
  { name: 'attestarc-skill', description: 'Installable agent skill that turns your coding agent (Claude Code, Cursor) into a software supply-chain security engineer for your repo and CI/CD.', url: `https://github.com/${GITHUB_USER}/attestarc-skill`, language: 'Python', stars: 0, topics: ['supply-chain-security', 'agent-skill', 'ci-cd-security'] },
  { name: 'dvah', description: 'Damn Vulnerable Agent Harness: a patch-the-runtime security lab for AI-agent platforms.', url: `https://github.com/${GITHUB_USER}/dvah`, language: 'Python', stars: 0, topics: ['agent-security', 'ai-agents', 'llm'] },
  { name: 'react-native-restart', description: 'React Native package with one purpose: to restart your app.', url: `https://github.com/${GITHUB_USER}/react-native-restart`, language: 'JavaScript', stars: 991, topics: ['react-native'] },
  { name: 'rag-search-homeassistant', description: 'Home Assistant component for querying events history for entities with LLM.', url: `https://github.com/${GITHUB_USER}/rag-search-homeassistant`, language: 'Python', stars: 6, topics: ['home-assistant', 'llm'] },
  { name: 'cloud-custodian-example', description: 'Example Cloud Custodian policies for cloud-security governance.', url: `https://github.com/${GITHUB_USER}/cloud-custodian-example`, language: 'Python', stars: 6, topics: ['aws', 'cloud-custodian', 'security'] },
  { name: 'cdk-private-api-domain', description: 'CDK construct library that provisions a private Amazon API Gateway with a custom domain name, accessible only through VPC endpoints.', url: `https://github.com/${GITHUB_USER}/cdk-private-api-domain`, language: 'TypeScript', stars: 1, topics: ['aws', 'cdk', 'api-gateway'] },
  { name: 'react-native-user-avatar', description: 'Avatar component for React Native.', url: `https://github.com/${GITHUB_USER}/react-native-user-avatar`, language: 'TypeScript', stars: 201, topics: ['react-native'] },
];

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  fork: boolean;
}

/** Keep only repos in the FEATURED_REPOS allowlist. */
function keepFeatured(repos: Repo[]): Repo[] {
  const featured = new Set(FEATURED_REPOS);
  return repos.filter((r) => featured.has(r.name));
}

/** Sort by stars, most-starred first. */
function byStarsDesc(a: Repo, b: Repo): number {
  return b.stars - a.stars;
}

/**
 * Sort pinned repos first (in PINNED_REPOS order), everything else by stars.
 * @returns negative/0/positive comparator value.
 */
function byPinnedThenStars(a: Repo, b: Repo): number {
  const pa = PINNED_REPOS.indexOf(a.name);
  const pb = PINNED_REPOS.indexOf(b.name);
  if (pa !== -1 || pb !== -1) {
    return (pa === -1 ? PINNED_REPOS.length : pa) - (pb === -1 ? PINNED_REPOS.length : pb);
  }
  return byStarsDesc(a, b);
}

/** Fetch last-month npm downloads for a package. Returns null on failure. */
async function fetchNpmDownloads(pkg: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
      { headers: { 'User-Agent': 'avishay-co-il-build' } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { downloads?: number };
    return typeof data.downloads === 'number' ? data.downloads : null;
  } catch {
    return null;
  }
}

/** Attach npm monthly downloads to any repo that maps to a published package. */
async function attachDownloads(repos: Repo[]): Promise<Repo[]> {
  return Promise.all(
    repos.map(async (repo) => {
      const pkg = REPO_NPM[repo.name];
      if (!pkg) return repo;
      const downloads = await fetchNpmDownloads(pkg);
      return downloads === null ? repo : { ...repo, downloads };
    })
  );
}

/** Fetch all non-fork repos, mapped to our Repo shape. Throws on failure. */
async function fetchRepos(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'avishay-co-il-build',
      },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status}`);
  }
  const data = (await res.json()) as GitHubApiRepo[];
  return data
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description ?? '',
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      topics: r.topics ?? [],
    }));
}

/**
 * Return the curated featured repos, live from GitHub when possible.
 * @returns ordered Repo[]; snapshot on any failure.
 */
export async function getFeaturedRepos(): Promise<Repo[]> {
  try {
    const featured = keepFeatured(await fetchRepos()).sort(byPinnedThenStars);
    if (featured.length === 0) return [...SNAPSHOT].sort(byPinnedThenStars);
    return attachDownloads(featured);
  } catch (err) {
    console.warn(
      `[github] live fetch failed, using snapshot: ${(err as Error).message}`
    );
    return [...SNAPSHOT].sort(byPinnedThenStars);
  }
}

/**
 * Return all non-fork repos sorted by stars (desc), live when possible.
 * @returns Repo[]; snapshot on any failure.
 */
export async function getAllRepos(): Promise<Repo[]> {
  try {
    const allowed = new Set(OPEN_SOURCE_REPOS);
    const repos = (await fetchRepos()).filter((r) => allowed.has(r.name));
    if (repos.length === 0) {
      return [...SNAPSHOT].filter((r) => allowed.has(r.name)).sort(byPinnedThenStars);
    }
    return attachDownloads([...repos].sort(byStarsDesc));
  } catch (err) {
    console.warn(
      `[github] live fetch failed, using snapshot: ${(err as Error).message}`
    );
    return [...SNAPSHOT].sort(byPinnedThenStars);
  }
}

