export type Project = {
  num: string;
  name: string;
  kind: string;
  tag: string;
  blurb: string;
  stack: string[];
  /** No live URLs or repos yet — set this and the card renders as a link. */
  url?: string;
};

export type Role = {
  company: string;
  title: string;
  years: string;
  note: string;
};

export const projects: Project[] = [
  {
    num: '01',
    name: 'Karbon for Clients',
    kind: 'Web + iOS + Android',
    tag: 'Accounting practice management',
    blurb:
      'Primary engineer on the client-facing platform — .NET backend, React web app, and a React Native app I shipped to both stores.',
    stack: ['.NET 8', 'React', 'React Native', 'Azure', 'CQRS'],
  },
  {
    num: '02',
    name: 'RCP Quote Tool',
    kind: 'PDF in, quote out',
    tag: 'Quoting tool for LED Direct Solutions',
    blurb:
      'Upload a ceiling plan PDF; a Python pipeline measures the drawing, matches a product catalogue with confidence scoring, and exports a branded quote.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Python', 'Tailwind'],
  },
  {
    num: '03',
    name: 'Concourse',
    kind: 'Ticket → merged PR',
    tag: 'Control plane for coding agents',
    blurb:
      'Carries an agent-ready ticket to a merged PR through a gated, resumable lifecycle on a Postgres-backed durable kernel.',
    stack: ['TypeScript', 'Node', 'Postgres', 'Electron', 'Astro'],
  },
];

export const roles: Role[] = [
  {
    company: 'Karbon',
    title: 'Full Stack Engineer',
    years: '2024 — now',
    note: 'Client platform across .NET, React and React Native.',
  },
  {
    company: 'Lab3',
    title: 'Software & Data Engineer',
    years: '2023 — 2024',
    note: 'Cloud-migration assessment product, IoT telemetry app, Azure ETL.',
  },
  {
    company: 'Adobe',
    title: 'Solutions Consultant Intern, UI/UX',
    years: '2022',
    note: 'Experience Platform solution design, plus site i18n into three languages.',
  },
];

export const marqueeA = [
  'React',
  'TypeScript',
  'React Native',
  '.NET 8',
  'Node',
  'Azure',
  'Postgres',
  'Tailwind',
];

export const marqueeB = [
  'Playwright',
  'Docker',
  'Terraform',
  'GPT-4o',
  'Storybook',
  'Expo',
  'Datadog',
  'CQRS',
];

export const links = {
  email: 'aaronauld123@gmail.com',
  github: 'https://github.com/aaronauld',
  linkedin: 'https://linkedin.com/in/aa2000',
};
