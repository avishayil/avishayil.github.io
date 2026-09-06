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
  /** Short excerpt (max ~50 words) of the post body, for LinkedIn entries. */
  excerpt?: string;
}

/**
 * Curated LinkedIn posts (his real activity; security/professional posts only).
 * Permalinks are real; dates are derived from each activity ID's timestamp.
 * Sorted with everything else by date (newest first) in getPosts().
 */
const LINKEDIN_POSTS: Post[] = [
  {
    title: "When the IDE itself opens a reverse shell: Claude Code's /rc and agent permission models",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7500492822974857216",
    date: '2026-09-01T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "תארו לעצמכם שה-IDE שלכם פותח פתאום Reverse Shell לשרת צד שלישי בלי לבקש? הייתם מכריזים מיד על אירוע אבטחה חמור. אבל איך אנחנו מתייחסים לאירוע כשקלוד בעצמם עושים את זה? דיווחים אחרונים בקהילה של Claude Code מצביעים על כך שיכולת ה-Remote Control שלו (הפקודה /rc) הופעלה אוטומטית עבור חלק מהסשנים…",
  },
  {
    title: "AttestArc: open-sourcing a supply-chain security skill for AI coding agents",
    url: "https://www.linkedin.com/posts/avishaybar_appsec-devsecops-cybersecurity-activity-7497354365901479936-PMnb",
    date: '2026-08-23T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "If you're an open source maintainer, security engineer or even a developer, you've probably been dealing a lot lately with supply chain security. I've been as well. So I built an AI skill to help and now I decided to open source it. Please meet AttestArc, an open source security…",
  },
  {
    title: "Fake GitHub stars and AI supply-chain maturity",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7496336462226006016",
    date: '2026-08-20T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "How many times did you hear about a new AI open source tool with \"gazillion stars in 3 days\", right? We know GitHub stars are a flawed metric for software supply chain maturity, especially in the AI tooling ecosystem. A few months ago, data from the StarScout project flagged millions…",
  },
  {
    title: "Finishing the AI Security Engineer Foundations track",
    url: "https://www.linkedin.com/posts/avishaybar_ai-security-engineer-foundations-avishaybar-activity-7495383711803408384-xrrV",
    date: '2026-08-18T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "I've just finished the AI Security Engineer Foundations track at aisecurity.engineer and passed the assessment. This is one of the better AI security resources I've gone through recently, made by Snyk. It moves quickly beyond the usual \"prompt injection and jailbreaks\" discussion into the problems security teams are actually starting…",
  },
  {
    title: "How Dream's researchers exposed an AI-agent attack campaign",
    url: "https://www.linkedin.com/posts/avishaybar_%D7%97%D7%95%D7%A7%D7%A8%D7%99-%D7%90%D7%91%D7%98%D7%97%D7%94-%D7%A9%D7%9C-%D7%A7%D7%91%D7%95%D7%A6%D7%AA-dream-%D7%97%D7%A9%D7%A4%D7%95-%D7%A7%D7%9E%D7%A4%D7%99%D7%99%D7%9F-%D7%AA%D7%A7%D7%99%D7%A4%D7%94-activity-7495084843307859968-KT08",
    date: '2026-08-17T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "חוקרי אבטחה של קבוצת Dream חשפו קמפיין תקיפה נגד תשתיות בטייוואן, שבו תוקפים השתמשו בעד 8 AI Agents בלולאות עבודה מקבילות כדי למפות מערכות, לבדוק פגיעויות ולהסתגל מול 21 יעדים ממשלתיים. - נפרצו Credentials של 85 חשבונות ממשלתיים, ו-84 מהם אפשרו גישה למערכות פנימיות. - נגנבו יותר מ-2,500 רשומות כוח…",
  },
  {
    title: "Model-provider defense layers, and the shrinking response window",
    url: "https://www.linkedin.com/posts/avishaybar_expanding-daybreak-as-the-cyber-defense-window-activity-7494287324940312576-vTL3",
    date: '2026-08-15T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "במשך זמן רב (בקצב של היום, מספר חודשים 😉 ), אחת משכבות ההגנה המרכזיות של ספקי מודלים כמו Anthropic ו-OpenAI הייתה היכולת של המודל לזהות בקשות מסוכנות ולסרב להן (כן, כמו ה-״לא״ בסגנון המוכר של פוסטים מג׳ונרטים בלינקדאין 😆). ההכרזה האחרונה של OpenAI על GPT-5.6-Cyber מראה עד כמה המודל הזה…",
  },
  {
    title: "AWS IAM Role Manager and getting trust policies right",
    url: "https://www.linkedin.com/posts/avishaybar_aws-recently-introduced-iam-role-manager-activity-7494053019517571072-Acw7",
    date: '2026-08-14T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "AWS recently introduced IAM Role Manager to eliminate context switching when authoring trust policies. When enabled, the AWS Console auto-provisions standard IAM roles as you create resources. Looking closely at the mechanics described in the announcement, this is explicitly a console-first feature. It optimizes for ClickOps, rapid prototyping, and builders…",
  },
  {
    title: "Security gates in CI/CD: the recurring DevSecOps debate",
    url: "https://www.linkedin.com/posts/avishaybar_vulnerabilitymanagement-cicd-devsecops-activity-7493661098320187393-guy7",
    date: '2026-08-13T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "אחד הויכוחים החוזרים ונשנים בדיונים שאני שומע מהתעשייה, הוא אודות אסטרטגיית האבטחה שעוטפת את תהליך ה-CI/CD וכוללת בתוכה את ההחלטה על יישום גייטים בתהליך ה-PR. אם אתם בונים גייט ב-CI/CD, תתחילו מהחלטה אחת: מה בדיוק שובר את הבילד. לא \"ממצאים קריטיים\", אלא רשימה סגורה של תנאים שאתם מוכנים להגן עליהם…",
  },
  {
    title: "Reddit's S-1 and the LLM training-data economy",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7171201892096557057",
    date: '2024-03-06T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "News say that in a recent S-1 filling by reddit to go public, as at least 10% of their revenue comes from selling data to train LLMs. - Web platforms may prioritize generating valuable data for LLMs, wondering how will it affect user generated content on those platforms. - Traditional…",
  },
  {
    title: "Practical steps to secure your GenAI application",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7170903542415745025",
    date: '2024-03-05T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "GenAI is on fire. Every second something is happening. Here are things you can do right now to secure your#genai application: - Include machine learning models in your architecture’s threat model as potential threats (zta). - Treat models as untrusted sources/sinks and apply appropriate validation controls to their outputs (enforcing…",
  },
  {
    title: "Panel: DevSecOps journeys at the Snyk TLV meetup",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7032097882165944320",
    date: '2023-02-16T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "Honored to be invited to Snyk meetup, alongside awesome panel members! Talking about the DevSecOps journeys - with Bat-Hen Yosefov (Codefresh), Yaniv Toledano (Pagaya) and Alan Idelson (Cybereason).",
  },
  {
    title: "Using ChatGPT to secure your cloud environments",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7012800242991394816",
    date: '2022-12-25T00:00:00.000Z',
    source: 'LinkedIn',
    excerpt: "Did you know that you can use ChatGPT to secure your cloud environments, and not just to create malware? One cool example is banging your head against the wall with S3 bucket policies. Instead of doing that, just ask ChatGPT to write a bucket policy for you!#cloud_security#chatgpt#aws (You should not…",
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
