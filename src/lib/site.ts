/** Central site + social configuration. Single source of truth for links/identity. */

export const SITE = {
  name: 'Avishay Bar',
  role: 'Senior Principal Security Architect',
  company: 'Palo Alto Networks',
  domain: 'avishay.co.il',
  url: 'https://avishay.co.il',
  tagline: 'Security for the age of AI.',
  intro:
    'I help teams secure what they build with AI and defend the AI workloads they run, with guardrails that hold across the software and AI development lifecycles.',
} as const;

export const SOCIAL = {
  github: 'https://github.com/avishayil',
  linkedin: 'https://www.linkedin.com/in/avishaybar',
  medium: 'https://medium.com/@avishayil',
  // TODO: confirm X/Twitter handle.
  x: 'https://x.com/avishayil',
  // TODO: confirm LinkedIn newsletter URL.
  newsletter: 'https://www.linkedin.com/in/avishaybar/recent-activity/all/',
} as const;

/** Conversion actions. */
export const CONTACT = {
  booking: 'https://cal.com/avishay-bar-3sybvq/30min',
  email: 'mailto:hello@avishay.co.il',
} as const;

/** Primary in-page navigation (business-first order; anchors on the home page). */
export const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#open-source' },
  { label: 'Posts', href: '/#posts' },
  { label: 'About', href: '/#about' },
] as const;
