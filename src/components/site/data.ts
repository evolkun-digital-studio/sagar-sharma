export const person = {
  name: "Sagar Sharma",
  first: "Sagar",
  last: "Sharma",
  role: "Chief Technology Officer",
  org: "SR18 Group",
  email: "sagar@sr18.group",
  linkedin: "https://linkedin.com/in/sagarsharma",
  linkedinLabel: "/in/sagarsharma",
  schedule: "#contact",
};

export const chapters = [
  { href: "#philosophy", label: "Technology Philosophy" },
  { href: "#purpose", label: "Purpose" },
  { href: "#group", label: "The Group" },
  { href: "#journey", label: "Journey" },
  { href: "#principles", label: "Principles" },
  { href: "#practice", label: "Practice" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

export const philosophy = [
  {
    title: "Systems Before Tools",
    body: "Design systems that remain effective regardless of technology trends.",
  },
  {
    title: "Security By Design",
    body: "Security should be embedded from day one, not added later.",
  },
  {
    title: "Automation Over Repetition",
    body: "Remove manual effort wherever intelligent automation can improve outcomes.",
  },
  {
    title: "Scalability First",
    body: "Build foundations capable of supporting future growth.",
  },
  {
    title: "Data-Driven Decisions",
    body: "Technology decisions should be guided by measurable outcomes.",
  },
];

export const focusAreas = [
  "Enterprise Architecture",
  "Artificial Intelligence",
  "Cloud Infrastructure",
  "Cybersecurity",
  "Automation",
  "Technology Leadership",
  "Digital Transformation",
];

export const journey = [
  {
    kicker: "Learning systems",
    years: "2012—16",
    yearsLong: "2012 — 2016",
    role: "B.Tech, Computer Science Engineering",
    org: "Delhi Technological University",
    body: "Built the technical foundation in software engineering, distributed systems, algorithms and architecture.",
  },
  {
    kicker: "Engineering enterprise systems",
    years: "2016—19",
    yearsLong: "2016 — 2019",
    role: "Senior Software Engineer",
    org: "CodeSphere Technologies",
    body: "Designed scalable backend platforms, APIs and enterprise software used by growing businesses.",
  },
  {
    kicker: "Leading engineering organizations",
    years: "2019—23",
    yearsLong: "2019 — 2023",
    role: "Head of Engineering",
    org: "TechSol India Pvt Ltd",
    body: "Led engineering teams, defined technical standards, and delivered enterprise cloud infrastructure and automation platforms.",
  },
  {
    kicker: "Architecting business ecosystems",
    years: "2023—",
    yearsLong: "2023 — Present",
    role: "Chief Technology Officer",
    org: "SR18 Group",
    body: "Leading technology strategy across Gaming, Technology, Real Estate, Textile and Beverages while overseeing enterprise architecture, cybersecurity, AI and digital transformation.",
  },
  {
    kicker: "Building tomorrow",
    years: "Now",
    yearsLong: "Today",
    role: "Long-term vision",
    org: "",
    body: "Building intelligent business ecosystems where AI, cloud computing, cybersecurity and automation work together to create sustainable competitive advantage.",
  },
];

export const principles = [
  "Technology should simplify complexity.",
  "Architecture should scale with the business.",
  "Security begins with design.",
  "AI should empower people.",
  "Innovation without execution has no value.",
  "Business outcomes matter more than technology choices.",
];

export const expertise = [
  {
    title: "Technology Strategy",
    body: "Aligning long-term technology direction with business objectives, capital allocation and market opportunity.",
  },
  {
    title: "Enterprise Architecture",
    body: "Designing resilient, modular systems that scale across business units without accumulating structural debt.",
  },
  {
    title: "Artificial Intelligence",
    body: "Deploying AI where it produces measurable operational leverage — not as an experiment, but as infrastructure.",
  },
  {
    title: "Cloud Infrastructure",
    body: "Multi-region, cost-aware cloud foundations engineered for reliability, security and predictable economics.",
  },
  {
    title: "Cybersecurity",
    body: "Security embedded into architecture, process and culture — protecting revenue, reputation and continuity.",
  },
  {
    title: "Automation",
    body: "Removing manual friction from operations so organizations compound productivity as they scale.",
  },
  {
    title: "Product Engineering",
    body: "Building product organizations that ship with velocity, discipline and a clear sense of craft.",
  },
  {
    title: "Digital Transformation",
    body: "Guiding traditional business verticals through structural technology change with measurable outcomes.",
  },
];

export const industries = [
  {
    name: "Technology",
    short: "Tech",
    body: "Platforms, SaaS infrastructure and internal engineering systems that anchor the group's digital operations.",
  },
  {
    name: "Gaming",
    short: "Gaming",
    body: "Real-time systems, secure transaction infrastructure and player-scale platforms engineered for reliability.",
  },
  {
    name: "Real Estate",
    short: "Real Estate",
    body: "Digitizing lifecycle operations — from acquisition to customer experience — with data-driven workflows.",
  },
  {
    name: "Textile",
    short: "Textile",
    body: "Modernizing supply chain, production and distribution through automation and enterprise systems.",
  },
  {
    name: "Beverages",
    short: "Beverages",
    body: "Building the digital backbone for distribution, retail intelligence and consumer engagement at scale.",
  },
];

/** Add an `href` once an essay is published; rows without one render as "Coming soon". */
export const writing: { title: string; tag: string; href?: string }[] = [
  { title: "Why enterprise architecture determines business success", tag: "Strategy" },
  { title: "The future of AI in business", tag: "Artificial Intelligence" },
  { title: "Technology leadership beyond code", tag: "Leadership" },
  { title: "Building companies that scale", tag: "Operations" },
];
