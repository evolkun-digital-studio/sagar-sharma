import { createFileRoute } from "@tanstack/react-router";
import portrait from "@/assets/sagar-portrait.jpg";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

const focusAreas = [
  "Enterprise Architecture",
  "Artificial Intelligence",
  "Cloud Infrastructure",
  "Cybersecurity",
  "Automation",
  "Technology Leadership",
  "Digital Transformation",
];

const journey = [
  {
    kicker: "Learning Systems",
    years: "2012 — 2016",
    role: "B.Tech, Computer Science Engineering",
    org: "Delhi Technological University",
    body: "Built the technical foundation in software engineering, distributed systems, algorithms and architecture.",
  },
  {
    kicker: "Engineering Enterprise Systems",
    years: "2016 — 2019",
    role: "Senior Software Engineer",
    org: "CodeSphere Technologies",
    body: "Designed scalable backend platforms, APIs and enterprise software used by growing businesses.",
  },
  {
    kicker: "Leading Engineering Organizations",
    years: "2019 — 2023",
    role: "Head of Engineering",
    org: "TechSol India Pvt Ltd",
    body: "Led engineering teams, defined technical standards, and delivered enterprise cloud infrastructure and automation platforms.",
  },
  {
    kicker: "Architecting Business Ecosystems",
    years: "2023 — Present",
    role: "Chief Technology Officer",
    org: "SR18 Group",
    body: "Leading technology strategy across Gaming, Technology, Real Estate, Textile and Beverages while overseeing enterprise architecture, cybersecurity, AI and digital transformation.",
  },
  {
    kicker: "Building Tomorrow",
    years: "Today",
    role: "Long-term Vision",
    org: "",
    body: "Focused on building intelligent business ecosystems where AI, cloud computing, cybersecurity and automation work together to create sustainable competitive advantage.",
  },
];

const philosophy = [
  "Technology should simplify complexity.",
  "Architecture should scale with the business.",
  "Security begins with design.",
  "AI should empower people.",
  "Innovation without execution has no value.",
  "Business outcomes matter more than technology choices.",
];

const expertise = [
  {
    n: "01",
    title: "Technology Strategy",
    body: "Aligning long-term technology direction with business objectives, capital allocation and market opportunity.",
  },
  {
    n: "02",
    title: "Enterprise Architecture",
    body: "Designing resilient, modular systems that scale across business units without accumulating structural debt.",
  },
  {
    n: "03",
    title: "Artificial Intelligence",
    body: "Deploying AI where it produces measurable operational leverage — not as an experiment, but as infrastructure.",
  },
  {
    n: "04",
    title: "Cloud Infrastructure",
    body: "Multi-region, cost-aware cloud foundations engineered for reliability, security and predictable economics.",
  },
  {
    n: "05",
    title: "Cybersecurity",
    body: "Security embedded into architecture, process and culture — protecting revenue, reputation and continuity.",
  },
  {
    n: "06",
    title: "Automation",
    body: "Removing manual friction from operations so organizations compound productivity as they scale.",
  },
  {
    n: "07",
    title: "Product Engineering",
    body: "Building product organizations that ship with velocity, discipline and a clear sense of craft.",
  },
  {
    n: "08",
    title: "Digital Transformation",
    body: "Guiding traditional business verticals through structural technology change with measurable outcomes.",
  },
];

const industries = [
  {
    name: "Technology",
    body: "Platforms, SaaS infrastructure and internal engineering systems that anchor the group's digital operations.",
  },
  {
    name: "Gaming",
    body: "Real-time systems, secure transaction infrastructure and player-scale platforms engineered for reliability.",
  },
  {
    name: "Real Estate",
    body: "Digitizing lifecycle operations — from acquisition to customer experience — with data-driven workflows.",
  },
  {
    name: "Textile",
    body: "Modernizing supply chain, production and distribution through automation and enterprise systems.",
  },
  {
    name: "Beverages",
    body: "Building the digital backbone for distribution, retail intelligence and consumer engagement at scale.",
  },
];

const insights = [
  { title: "Why Enterprise Architecture Determines Business Success", tag: "Strategy" },
  { title: "The Future of AI in Business", tag: "Artificial Intelligence" },
  { title: "Technology Leadership Beyond Code", tag: "Leadership" },
  { title: "Building Companies That Scale", tag: "Operations" },
];

function Home() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative pt-40 pb-32 md:pt-48 md:pb-40">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:px-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="mb-10 flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              Chief Technology Officer · SR18 Group
            </div>
            <h1 className="text-[52px] font-medium leading-[1.02] tracking-[-0.03em] text-foreground sm:text-[68px] lg:text-[80px]">
              Sagar Sharma
            </h1>
            <p className="mt-8 max-w-xl text-[22px] font-light leading-[1.35] tracking-[-0.01em] text-foreground sm:text-[26px]">
              Building technology ecosystems that help businesses scale with confidence.
            </p>
            <p className="mt-10 max-w-xl text-[17px] leading-[1.65] text-muted-foreground sm:text-[18px]">
              Technology should never exist for its own sake. For over a decade
              I've helped organizations build scalable architecture, enterprise
              software, AI systems and secure digital infrastructure that
              enables long-term business growth.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href="#journey"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[15px] font-medium text-background transition-all hover:opacity-90"
              >
                View Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-[15px] font-medium text-foreground transition-all hover:border-foreground"
              >
                Connect
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="animate-fade-up overflow-hidden bg-card" style={{ animationDelay: "200ms" }}>
              <img
                src={portrait}
                alt="Portrait of Sagar Sharma, Chief Technology Officer"
                width={1200}
                height={1504}
                className="h-auto w-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-4">
              <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                About
              </div>
              <h2 className="mt-6 text-[36px] font-medium leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[44px] lg:text-[48px]">
                Technology with Purpose.
              </h2>
            </Reveal>
            <div className="space-y-8 text-[18px] leading-[1.7] text-muted-foreground lg:col-span-7 lg:col-start-6">
              <Reveal>
                Technology should solve business problems. Every system should
                reduce complexity. Every architecture should support growth.
                Every decision should create long-term value.
              </Reveal>
              <Reveal delay={80}>
                The organizations that endure are not the ones with the most
                sophisticated stack — they are the ones whose technology
                choices remain coherent as the business evolves. My work is
                built around that principle: design for the decade, not the
                quarter.
              </Reveal>
              <Reveal delay={160}>
                Across SR18 Group's verticals, this means treating engineering
                as an executive discipline — one that compounds trust,
                velocity and margin over time.
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE SNAPSHOT */}
      <section className="border-t border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="mb-16 flex items-end justify-between gap-8">
            <div>
              <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                Executive Snapshot
              </div>
              <h2 className="mt-6 text-[36px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[48px]">
                A view from the office.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="h-full border border-border bg-card p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(17,17,17,0.12)]">
                <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                  Current Role
                </div>
                <div className="mt-6 text-[28px] font-medium leading-tight tracking-[-0.01em] sm:text-[32px]">
                  Chief Technology Officer
                </div>
                <div className="mt-2 text-[18px] text-muted-foreground">SR18 Group</div>
                <p className="mt-8 max-w-md text-[17px] leading-[1.65] text-muted-foreground">
                  Leading technology strategy across multiple business
                  verticals — Gaming, Technology, Real Estate, Textile and
                  Beverages.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-5">
              <div className="h-full border border-border bg-card p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(17,17,17,0.12)]">
                <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                  Focus Areas
                </div>
                <ul className="mt-6 space-y-3">
                  {focusAreas.map((f) => (
                    <li
                      key={f}
                      className="flex items-baseline gap-3 border-b border-border pb-3 text-[17px] text-foreground last:border-b-0 last:pb-0"
                    >
                      <span className="text-[12px] tabular-nums text-muted-foreground">
                        —
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="border-t border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="mb-20 max-w-3xl">
            <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Career Journey
            </div>
            <h2 className="mt-6 text-[36px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[48px]">
              Evolution of Leadership.
            </h2>
          </Reveal>

          <div className="space-y-0">
            {journey.map((j, i) => (
              <Reveal key={j.kicker}>
                <div className="grid grid-cols-1 gap-8 border-t border-border py-12 md:grid-cols-12 md:gap-10 md:py-16">
                  <div className="md:col-span-3">
                    <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · {j.years}
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-[28px] font-medium leading-tight tracking-[-0.01em] sm:text-[34px]">
                      {j.kicker}
                    </h3>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[17px]">
                      <span className="text-foreground">{j.role}</span>
                      {j.org && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{j.org}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-muted-foreground">
                      {j.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-border" />
          </div>
        </div>
      </section>

      {/* LEADERSHIP PHILOSOPHY */}
      <section id="leadership" className="border-t border-border py-32 md:py-48">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="mb-20">
            <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Leadership Philosophy
            </div>
          </Reveal>
          <div className="space-y-10 md:space-y-14">
            {philosophy.map((line, i) => (
              <Reveal key={line} delay={i * 60}>
                <p className="max-w-4xl text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[42px] lg:text-[52px]">
                  <span className="mr-4 align-top text-[14px] font-normal tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {line}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="border-t border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="mb-20 max-w-3xl">
            <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Expertise
            </div>
            <h2 className="mt-6 text-[36px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[48px]">
              Disciplines that compound.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {expertise.map((e, i) => (
              <Reveal
                key={e.title}
                delay={(i % 2) * 80}
                className={`group border-t border-border py-10 md:py-12 ${
                  i % 2 === 0 ? "md:pr-14" : "md:pl-14 md:border-l"
                }`}
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-[13px] tabular-nums text-muted-foreground">
                    {e.n}
                  </span>
                  <div>
                    <h3 className="text-[24px] font-medium leading-tight tracking-[-0.01em]">
                      {e.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[16px] leading-[1.7] text-muted-foreground">
                      {e.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-border" />
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-t border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="mb-20 max-w-3xl">
            <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Industries
            </div>
            <h2 className="mt-6 text-[36px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[48px]">
              Transformation across sectors.
            </h2>
          </Reveal>

          <div>
            {industries.map((ind, i) => (
              <Reveal key={ind.name}>
                <a
                  href="#contact"
                  className="group grid grid-cols-1 items-baseline gap-6 border-t border-border py-10 transition-colors hover:bg-card md:grid-cols-12 md:gap-10 md:py-12"
                >
                  <div className="text-[13px] tabular-nums text-muted-foreground md:col-span-1">
                    0{i + 1}
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-[28px] font-medium leading-tight tracking-[-0.01em] transition-transform duration-500 group-hover:translate-x-1 sm:text-[36px]">
                      {ind.name}
                    </h3>
                  </div>
                  <p className="text-[17px] leading-[1.65] text-muted-foreground md:col-span-6">
                    {ind.body}
                  </p>
                  <div className="flex justify-end md:col-span-1">
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </a>
              </Reveal>
            ))}
            <div className="border-t border-border" />
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section id="insights" className="border-t border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="mb-20 flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                Thought Leadership
              </div>
              <h2 className="mt-6 text-[36px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[48px]">
                Selected writing.
              </h2>
            </div>
            <a
              href="#contact"
              className="link-underline text-[15px] text-muted-foreground hover:text-foreground"
            >
              View all essays
            </a>
          </Reveal>

          <div>
            {insights.map((post, i) => (
              <Reveal key={post.title}>
                <a
                  href="#"
                  className="group grid grid-cols-1 items-baseline gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-10 md:py-12"
                >
                  <div className="text-[13px] tabular-nums text-muted-foreground md:col-span-1">
                    N° {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.01em] transition-colors group-hover:text-accent md:col-span-8 sm:text-[30px]">
                    {post.title}
                  </h3>
                  <div className="text-[13px] uppercase tracking-[0.16em] text-muted-foreground md:col-span-2">
                    {post.tag}
                  </div>
                  <div className="flex justify-end md:col-span-1">
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </a>
              </Reveal>
            ))}
            <div className="border-t border-border" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-border py-40 md:py-56">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal>
            <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Contact
            </div>
            <h2 className="mt-8 max-w-4xl text-[44px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[64px] lg:text-[80px]">
              Let's build technology that lasts.
            </h2>
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-10 border-t border-border pt-12 md:grid-cols-3">
            <Reveal>
              <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </div>
              <a
                href="mailto:sagar@sr18.group"
                className="link-underline mt-4 inline-block text-[20px] text-foreground"
              >
                sagar@sr18.group
              </a>
            </Reveal>
            <Reveal delay={80}>
              <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                LinkedIn
              </div>
              <a
                href="https://linkedin.com"
                className="link-underline mt-4 inline-block text-[20px] text-foreground"
              >
                /in/sagarsharma
              </a>
            </Reveal>
            <Reveal delay={160}>
              <div className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                Schedule
              </div>
              <a
                href="#"
                className="link-underline mt-4 inline-block text-[20px] text-foreground"
              >
                Schedule a Conversation
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 text-[13px] text-muted-foreground md:flex-row md:items-center md:px-12">
          <div>© {new Date().getFullYear()} Sagar Sharma. All rights reserved.</div>
          <div>Chief Technology Officer · SR18 Group</div>
        </div>
      </footer>
    </div>
  );
}
