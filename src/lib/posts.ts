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
  /** Full post text (LinkedIn entries; Medium renders title-only). */
  content?: string;
  /** Reactions + comments + reposts at collection time; drives LinkedIn ordering. */
  engagement?: number;
}

/**
 * Curated LinkedIn posts, ordered by the site's rule: security-related posts
 * first (all of these are), then by engagement. Permalinks are real; dates are
 * derived from each activity ID's timestamp. Content collected from his public
 * posts; update this list as new posts land.
 */
const LINKEDIN_POSTS: Post[] = [
  {
    title: "Using ChatGPT to secure your cloud environments",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7012800242991394816",
    date: '2022-12-25T00:00:00.000Z',
    engagement: 153,
    source: 'LinkedIn',
    content: "Did you know that you can use ChatGPT to secure your cloud environments, and not just to create malware? One cool example is banging your head against the wall with S3 bucket policies. Instead of doing that, just ask ChatGPT to write a bucket policy for you!#cloud_security#chatgpt#aws\n\n\n(You should not trust AI generated code for security code - it may look correct but can contain hidden bugs that are difficult to spot.)",
  },
  {
    title: "Security gates in CI/CD: the recurring DevSecOps debate",
    url: "https://www.linkedin.com/posts/avishaybar_vulnerabilitymanagement-cicd-devsecops-activity-7493661098320187393-guy7",
    date: '2026-08-13T00:00:00.000Z',
    engagement: 39,
    source: 'LinkedIn',
    content: "אחד הויכוחים החוזרים ונשנים בדיונים שאני שומע מהתעשייה, הוא אודות אסטרטגיית האבטחה שעוטפת את תהליך ה-CI/CD וכוללת בתוכה את ההחלטה על יישום גייטים בתהליך ה-PR.\nאם אתם בונים גייט ב-CI/CD, תתחילו מהחלטה אחת: מה בדיוק שובר את הבילד. לא \"ממצאים קריטיים\", אלא רשימה סגורה של תנאים שאתם מוכנים להגן עליהם מול צוות שנתקע באמצע release. לרוב, כל השאר - כלומר רובו של הפלט של הסקאנרים - הוא מידע, ומידע לבדו לא עוצר פייפליין.\nההבחנה שמשנה בפועל היא האם לממצא יש תיקון ידוע שהמפתח יכול לבצע עכשיו, בתוך ה-PR הזה, בלי לפתוח שיחה עם עוד שני צוותים. אם אין כזה תיקון, הגייט לא אוכף בקרה. הוא מייצר עקיפה, ולרוב העקיפה הזאת נשארת אחר כך גם למקרים שכן היו חשובים.\nמכאן נגזרות שלוש הכרעות תכנוניות שכדאי לקבל מראש:\n- מי מאשר חריגה, ותוך כמה זמן. אם אין נתיב חריגה מוגדר עם SLA, נתיב החריגה יהיה צוות הפיתוח שמתקשר בסוף היום שהפייפליין שלו נתקע והריליס מתעכב.\n- האם ממצא חדש בקוד חדש מטופל אחרת מחוב קיים. גייט שמכריח צוות לתקן את מה שהיה שם לפני שהוא נגע בקובץ יאבד לגיטימיות מהר.\n- מה קורה כשהסקאנר עצמו נופל או מאיט. fail-open ו-fail-closed הן שתיהן החלטות סבירות, אבל צריך לבחור אחת ולתעד אותה.\nבניגוד ללא מעט מקרים שראיתי שמסתכלים על מטריקה של כמה בילדים נכשלו כתוצאה מהגייט, המדד היותר חשוב בעיני הוא איזה אחוז מהכשלונות הסתיים בשינוי קוד ולא בעקיפה או בהחרגה. זה המספר שמראה אם הגייט עובד או רק מייצר תנועה. מספר היעד תלוי בסטאק ובבשלות הצוותים - אבל אם הוא לא נמדד בכלל, אין דרך לדעת אם הגייט הוא בקרה.\nהגייט הטוב ביותר הוא זה שהמפתחים לא מנסים לכבות, כי הוא נכשל רק כשהוא צודק.\n#vulnerability_management #cicd #devsecops",
  },
  {
    title: "AWS IAM Role Manager and getting trust policies right",
    url: "https://www.linkedin.com/posts/avishaybar_aws-recently-introduced-iam-role-manager-activity-7494053019517571072-Acw7",
    date: '2026-08-14T00:00:00.000Z',
    engagement: 23,
    source: 'LinkedIn',
    content: "AWS recently introduced IAM Role Manager to eliminate context switching when authoring trust policies. When enabled, the AWS Console auto-provisions standard IAM roles as you create resources.\nLooking closely at the mechanics described in the announcement, this is explicitly a console-first feature. It optimizes for ClickOps, rapid prototyping, and builders without deep IAM experience.\nFrom a developer experience perspective, this is a clear win. You can wire an EventBridge rule to an SQS queue in seconds without touching JSON. Because the provisioned objects are standard IAM roles, they remain fully visible to existing governance tooling rather than being obscured by the platform.\nHowever, viewing this through an enterprise security architecture lens reveals two significant structural issues:\n- Lack of a secure-by-default posture for custom workloads. When creating a Lambda function, the platform cannot predict the execution path, so IAM Role Manager defaults to attaching the PowerUserAccess managed policy. In a shared development account, this flattens internal trust boundaries. A single compromised third-party dependency in that function immediately gains broad read and write access across the account. AWS already possesses the capability to statically analyze Lambda packages through tools like Amazon Inspector. Defaulting to PowerUserAccess instead of generating a baseline policy restricted to explicitly required SDK calls pushes the operational burden of containment back onto the customer under the Shared Responsibility Model.\n- Anti-pattern with modern engineering pipelines. The official guidance relies on an asynchronous cleanup model: let the workload run, observe it with Access Analyzer, and right size the permissions later. Because this feature targets console-driven prototyping, it creates a translation gap. When a developer moves their POC workload to Terraform, CDK, or a CI/CD pipeline, what goes into the repository? They either port the overly permissive poweruser role, or the deployment fails security checks. Relying on an out-of-band, detective cleanup phase conflicts directly with the mechanics of immutable infrastructure and automated deployments.\nI wonder how AWS envisions the enterprise governance model bridging this gap? Is the intention to eventually integrate this code aware provisioning directly into IaC synthesis, or will this remain a console centric accelerator that requires custom guardrails before entering a deployment pipeline?\nAWS original blog post: https://lnkd.in/eVVZatPy\n20\n2\n1\n1,719 impressions",
  },
  {
    title: "Practical steps to secure your GenAI application",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7170903542415745025",
    date: '2024-03-05T00:00:00.000Z',
    engagement: 20,
    source: 'LinkedIn',
    content: "GenAI is on fire. Every second something is happening. Here are things you can do right now to secure your#genai application: - Include machine learning models in your architecture’s threat model as potential threats (zta). - Treat models as untrusted sources/sinks and apply appropriate validation controls to their outputs (enforcing custom output schemas, validation agents, etc). - Secure user records and sensitive information by traditional access controls (authn, authz). The model does not protect your data.#genai#llm#security\n\nSpot on Avishay, well said 🎯\n\nReply 1 Reaction 2 Reactions",
  },
  {
    title: "How Dream's researchers exposed an AI-agent attack campaign",
    url: "https://www.linkedin.com/posts/avishaybar_%D7%97%D7%95%D7%A7%D7%A8%D7%99-%D7%90%D7%91%D7%98%D7%97%D7%94-%D7%A9%D7%9C-%D7%A7%D7%91%D7%95%D7%A6%D7%AA-dream-%D7%97%D7%A9%D7%A4%D7%95-%D7%A7%D7%9E%D7%A4%D7%99%D7%99%D7%9F-%D7%AA%D7%A7%D7%99%D7%A4%D7%94-activity-7495084843307859968-KT08",
    date: '2026-08-17T00:00:00.000Z',
    engagement: 17,
    source: 'LinkedIn',
    content: "חוקרי אבטחה של קבוצת Dream חשפו קמפיין תקיפה נגד תשתיות בטייוואן, שבו תוקפים השתמשו בעד 8 AI Agents בלולאות עבודה מקבילות כדי למפות מערכות, לבדוק פגיעויות ולהסתגל מול 21 יעדים ממשלתיים. - נפרצו Credentials של 85 חשבונות ממשלתיים, ו-84 מהם אפשרו גישה למערכות פנימיות. - נגנבו יותר מ-2,500 רשומות כוח אדם ממערכות ממשלתיות. - המערכת האוטונומית מיפתה 21 מערכות ממשלתיות וחיפשה דרכי תקיפה נוספות במשך כמה ימים. - הפעילות התרחבה גם לסוכנות הבטיחות הגרעינית ולפחות שבע חברות אנרגיה, שנבדקו במקביל לאיתור בעיות קונפיגורציה, ממשקי ניהול חשופים וחולשות. מה שהופך את האירוע לחריג הוא איך הגיעו לאימפקט הזה: לפי החוקרים, עד שמונה אייג׳נטים עבדו במקביל, ביצעו Reconnaissance, חקרו חולשות, ניסו נתיבי תקיפה וכאשר משהו נכשל שינו כיוון בעצמם. בני אדם עדיין הגדירו את היעדים, אבל חלק משמעותי מלולאת הביצוע וההתאמה כבר עבר ל-AI. בעיניי, השינוי האמיתי היה בדלגציה של לולאת קבלת ההחלטות והביצוע (בתמונה, וסליחה על הבעיות בפונט שג׳יפיטי קצת חרטש). אייג'נטי AI אוטונומיים נעים לטרלית בתוך סביבות על ידי בדיקת הרשאות וזהויות קיימות. אם הגישה אינה מוגבלת באופן הדוק בכל מערכת, אייג'נט מסוגל למפות ולנוע במהירות בין מערכות מקושרות. מערכות התקפיות מסוגלות כעת לבצע אדפטציה מבוססת פידבק במהירות של תוכנה. ארכיטקטורת הגנה שנשענת בעיקר על ניטור ידני של התראות וחוקים סטטיים נכנסת כאן לנחיתות משמעותית: התוקף כבר מסוגל לבצע Discovery, Verification ו-Adaptation בקצב של תוכנה. קישור למחקר: https://lnkd.in/djhA_WRG\n\nWhen agents can dynamically adapt, pivot laterally, and re-query permissions at software speed, traditional static rules and manual monitoring are completely bypassed. You can't prompt-engineer your way out of autonomous state drift or unauthorized lateral movement.\n\nAvishay Bar A very important point. From a cyber risk perspective, we are moving from static, periodic assessments toward Continuous Risk Management. With autonomous AI Agents, where capabilities, integrations and attack surfaces can change rapidly, risk identification and response need to become continuous - with Shift Left wherever possible. Ultimately, the response needs to be as automated as possible. Organizations will need to define clear guardrails and risk tolerance upfront, with deviations triggering automated controls - potentially blocking the action. Some organizations will opt for immediate enforcement, while others, with a different risk appetite, may require Human-in-the-Loop.",
  },
  {
    title: "Panel: DevSecOps journeys at the Snyk TLV meetup",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7032097882165944320",
    date: '2023-02-16T00:00:00.000Z',
    engagement: 16,
    source: 'LinkedIn',
    content: "Honored to be invited to Snyk meetup, alongside awesome panel members! Talking about the DevSecOps journeys - with Bat-Hen Yosefov (Codefresh), Yaniv Toledano (Pagaya) and Alan Idelson (Cybereason).",
  },
  {
    title: "Finishing the AI Security Engineer Foundations track",
    url: "https://www.linkedin.com/posts/avishaybar_ai-security-engineer-foundations-avishaybar-activity-7495383711803408384-xrrV",
    date: '2026-08-18T00:00:00.000Z',
    engagement: 14,
    source: 'LinkedIn',
    content: "I've just finished the AI Security Engineer Foundations track at aisecurity.engineer and passed the assessment. This is one of the better AI security resources I've gone through recently, made by Snyk. It moves quickly beyond the usual \"prompt injection and jailbreaks\" discussion into the problems security teams are actually starting to face: agentic applications, excessive agency, MCP and tool supply chains, Shadow AI, etc. \nWhat I liked most is that the material consistently connects AI security back to engineering controls: inventory, least privilege, trust boundaries, CI/CD enforcement... It gives you frameworks you can actually use rather than another list of theoretical AI threats. There is naturally some Snyk product positioning in the material, but it doesn’t overwhelm the technical content.\nIf you work in Product Security, AppSec, DevSecOps, Cloud Security, or you're trying to understand how security changes when software starts acting through agents, this is worth going through.",
  },
  {
    title: "AttestArc: open-sourcing a supply-chain security skill for AI coding agents",
    url: "https://www.linkedin.com/posts/avishaybar_appsec-devsecops-cybersecurity-activity-7497354365901479936-PMnb",
    date: '2026-08-23T00:00:00.000Z',
    engagement: 13,
    source: 'LinkedIn',
    content: "If you're an open source maintainer, security engineer or even a developer, you've probably been dealing a lot lately with supply chain security. I've been as well.\n\nSo I built an AI skill to help and now I decided to open source it.\n\nPlease meet AttestArc, an open source security skill for Claude Code and Cursor (for now), to test how security context can operate directly inside AI coding agents.\n\nThe architecture relies on separating deterministic fact-gathering from contextual reasoning. When invoked, small helper scripts extract the current state of the repository- reviewing GitHub configurations, Actions, dependencies, OIDC setups, and supply chain controls.\n\nThe host model then takes these facts and handles the reasoning. Findings are written locally to a file, allowing the agent to maintain context across sessions without turning a static report into the final product.\n\nThis structure is designed to avoid simplistic security rules. Configurations like id-token: write, pull_request_target, or self-hosted runners are not inherent vulnerabilities, and generating an SBOM does not mean the artifact is actually verified.\n\nBy analyzing the surrounding architecture first, the agent can guide the engineer through fixing what matters in their specific environment.\nIntegrating security expertise as an installed skill shifts the workflow from an external dashboard to an internal loop of discover, understand, explain, fix, and verify.\n\nIf you are building DevSecOps or software supply chain controls, what specific architectural boundaries would you expect an in-IDE agent to understand before it starts making changes?",
  },
  {
    title: "When the IDE itself opens a reverse shell: Claude Code's /rc and agent permission models",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7500492822974857216",
    date: '2026-09-01T00:00:00.000Z',
    engagement: 12,
    source: 'LinkedIn',
    content: "תארו לעצמכם שה-IDE שלכם פותח פתאום Reverse Shell לשרת צד שלישי בלי לבקש? הייתם מכריזים מיד על אירוע אבטחה חמור. אבל איך אנחנו מתייחסים לאירוע כשקלוד בעצמם עושים את זה?\nדיווחים אחרונים בקהילה של Claude Code מצביעים על כך שיכולת ה-Remote Control שלו (הפקודה /rc) הופעלה אוטומטית עבור חלק מהסשנים החדשים, תוך דריסה של הגדרות Opt Out מקומיות מפורשות של משתמשים.\nלמה? כי איזה Feature Flag בשרת השתנה, העיר לחיים הרשאה שניתנה בעבר, ודרס את ההגדרות המקומיות הנוכחיות של המשתמש. הסכמתם ליכולת הזו פעם אחת בעבר? הסביבה המקומית שלכם שוב פתוחה לגישה מרחוק בסשנים הבאים.\nלסוכני קוד שרצים בסביבה המקומית, כמו קלוד קוד, יש גישה למפתחות שלכם בענן, לקוד, להרצה ישירה של ה-MCP Servers הפנימיים שלכם. כשלקומפוננטה יש כוח ביצועי כזה, פתיחת ערוץ שליטה מרחוק היא פעולת אבטחה בעלת הרשאות אולטרה-גבוהות.\nאנחנו שורפים את רוב הזמן שלנו באובססיה על Prompt Injection והתקפות אחרות על המוצרים והשירותים שלנו, בזמן שאנחנו מתעלמים לחלוטין מסכנות מהותיות הרבה יותר: מודל ההרשאות של האייג׳נט עצמו. Feature Flags נועדו להחליט אם פיצ'ר קיים בקוד. אבל לעקוף את ה-Authorization ליכולת כזו לרוץ בסביבה שלו? סיפור אחר לגמרי.\nה-Issue בקלוד קוד בתגובה הראשונה\n#AISecurity #CyberSecurity #ClaudeCode #DevSecOps #SecurityArchitecture #AI #CodingAgents",
  },
  {
    title: "Reddit's S-1 and the LLM training-data economy",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7171201892096557057",
    date: '2024-03-06T00:00:00.000Z',
    engagement: 11,
    source: 'LinkedIn',
    content: "News say that in a recent S-1 filling by reddit to go public, as at least 10% of their revenue comes from selling data to train LLMs. - Web platforms may prioritize generating valuable data for LLMs, wondering how will it affect user generated content on those platforms. - Traditional ad networks might face reduced inventory, as data shaping for enhancing LLMs could lead them to rethink ad campaigns impact. - Seems like an opportunity for an attack vector here - bots will put garbage content on these platforms just to affect LLMs response as they prioritize data coming from these platforms.#genai#ads#security",
  },
  {
    title: "Fake GitHub stars and AI supply-chain maturity",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7496336462226006016",
    date: '2026-08-20T00:00:00.000Z',
    engagement: 9,
    source: 'LinkedIn',
    content: "How many times did you hear about a new AI open source tool with \"gazillion stars in 3 days\", right? We know GitHub stars are a flawed metric for software supply chain maturity, especially in the AI tooling ecosystem. A few months ago, data from the StarScout project flagged millions of suspected fake stars. But looking at specific repositories reveals a much stranger threat model than simple maintainer fraud. First, cases of highly unusual demographics. An independent 2026 analysis of the RagaAI-Catalyst repository found that over 76% of sampled stargazers had zero followers, and 28% were classified as ghost accounts. These metrics deviate drastically from established organic projects, yet the repository itself has over a thousand commits and real engineering activity. Artificial amplification does not automatically mean the software is empty. Second, historical anomalies overshadowed by actual adoption. Langflow was flagged in early StarScout datasets with a high percentage of suspected fake stars. However, subsequent sampling showed a highly organic population. Today, it has thousands of forks, hundreds of active PRs, and continuous releases. Early unnatural growth patterns can bootstrap visibility, eventually leading to a massive, entirely legitimate user base. Third, and the most obvious for me, is the problem of attribution. An investigation into the openai/openai-fm repository found that 66% of a sampled stargazer group exhibited suspicious, low-activity signatures. But investigators noted this was likely third-party botting rather than OpenAI manipulating its own metrics. This introduces a fascinating dynamic for supply chain security. If a threat actor, an overly aggressive marketing agency, or a random star-farm can point 5,000 bots at any repository, the presence of fake stars no longer proves who commissioned them. We can no longer use top-line social metrics to evaluate AI dependencies for enterprise architecture. A high star count mixed with unnatural growth patterns is an unreliable proxy for maturity. When determining what enters your trust boundary, the signals that carry weight currently are contributor diversity, issue lifecycle health, and actual downstream integration. Link to the paper on the first comment.\n\nLink to the paper: https://cmustrudel.github.io/papers/icse2026fakestars.pdf\n\nyep most are fake. just look at their issues/contributions. and - stars sometimes don't mean a lot besides \"like\", which doesn't mean you will use it. you just liked the concept or the way it sounds for a sec.\n\nReply 1 Reaction 2 Reactions",
  },
  {
    title: "Model-provider defense layers, and the shrinking response window",
    url: "https://www.linkedin.com/posts/avishaybar_expanding-daybreak-as-the-cyber-defense-window-activity-7494287324940312576-vTL3",
    date: '2026-08-15T00:00:00.000Z',
    engagement: 6,
    source: 'LinkedIn',
    content: "במשך זמן רב (בקצב של היום, מספר חודשים 😉 ), אחת משכבות ההגנה המרכזיות של ספקי מודלים כמו Anthropic ו-OpenAI הייתה היכולת של המודל לזהות בקשות מסוכנות ולסרב להן (כן, כמו ה-״לא״ בסגנון המוכר של פוסטים מג׳ונרטים בלינקדאין 😆). ההכרזה האחרונה של OpenAI על GPT-5.6-Cyber מראה עד כמה המודל הזה משתנה. תחת ההגנות הרגילות, GPT-5.6 Sol נענה רק ל-1.5% מהבקשות בבנצ'מרק הפנימי של OpenAI למשימות סייבר מתקדמות. ב-Daybreak Blue, אחרי הסרת חלק מה-guardrails של המודל, המספר עלה ל-2%. GPT-5.6-Cyber, שאומן במיוחד לעבודה עם משימות dual-use מתקדמות, נענה ל-95% מהבקשות. המשמעות, בעיניי, היא שגבול האבטחה עובר לשכבות שמקיפות את המודל. Model alignment נשאר שכבת הגנה חשובה, אבל ההרשאות בפועל צריכות להיקבע מחוץ למודל עצמו: מי יכול להפעיל אותו, לאילו משאבים הוא יכול להגיע, ואילו פעולות הוא רשאי לבצע. מכאן נגזרים כמה עקרונות ארכיטקטוניים שצריך לקחת בחשבון במסגרת ניהול האבטחה במסגרת הטמעה של פרוייקטים המשלבים שימוש במודלים כאלו: - גישה למודלים חזקים צריכה לכלול אימות זהות חזק, hardware security keys והרשאות מצומצמות שמותאמות לתפקיד ול-use case. - מערכת AI שמסוגלת לייצר exploit code וכלי תקיפה ברמת Working POC צריכה לרוץ בסביבה זמנית ומבודדת, עם credentials מצומצמים, egress מבוקר וגישה מוגדרת מראש למערכות שהיא באמת צריכה. - tool calls, הרצת קוד, network access וגישה ל-secrets צריכים לעבור דרך שכבת policy חיצונית שבודקת ומאשרת את הפעולה לפני הביצוע. בעיניי, מודל AI מתקדם הוא workload בעל יכולות גבוהות והרשאות שצריך לנהל בהתאם. ה-harness שמקיף אותו הוא חלק ממערכת האבטחה עצמה: זהות, הרשאות, isolation, policy enforcement ו-observability. וככל שהמודלים הופכים ליותר capable, הארכיטקטורה סביבם הופכת לחשובה לפחות כמו המודל עצמו. לפוסט של OpenAI על GPT-5.6-Cyber: https://lnkd.in/efUhSPHX\n\nExpanding Daybreak as the Cyber Defense Window Narrows openai.com",
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
 * Combined list: curated LinkedIn posts first (site ordering rule above),
 * then Medium articles newest-first.
 * @param limit optional cap on the number returned.
 */
export async function getPosts(limit?: number): Promise<Post[]> {
  const medium = (await getArticles()).map(articleToPost).sort(byDateDesc);
  const combined = [...LINKEDIN_POSTS, ...medium];
  return typeof limit === 'number' ? combined.slice(0, limit) : combined;
}
