import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect, useState, useCallback, lazy, Suspense } from "react";
import heroPhone from "@/assets/hero-phone.png";
import coverSurveys from "@/assets/cover-surveys.jpg";
import coverUpi from "@/assets/cover-upi.jpg";
import coverGrowth from "@/assets/cover-growth.jpg";
import { useInView, useScrollY } from "@/hooks/use-scroll";
import { triggerConfetti, triggerCoinRain } from "@/components/3d/ConfettiSystem";

const HeroScene = lazy(() => import("@/components/3d/HeroScene"));
const Global3DBackground = lazy(() => import("@/components/3d/Global3DBackground"));
const MascotScene = lazy(() => import("@/components/3d/MascotScene"));
const SpinningCoin = lazy(() => import("@/components/3d/SpinningCoin"));
const BlueprintScene = lazy(() => import("@/components/3d/BlueprintScene"));
import CheckmarkAnimation from "@/components/3d/CheckmarkAnimation";
import { StepIcon1, StepIcon2, StepIcon3 } from "@/components/3d/StepIcons";

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * A helper component to lazy-render children only when they enter the viewport.
 * This significantly improves initial load and memory usage.
 */
function LazySection({ children, height = "400px" }: { children: React.ReactNode; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "200px" });
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (isInView) setHasBeenInView(true);
  }, [isInView]);

  return (
    <div ref={ref} style={{ minHeight: hasBeenInView ? "auto" : height }}>
      {hasBeenInView ? children : null}
    </div>
  );
}

function LoaderPlaceholder() {
  return <div className="w-full h-full glass animate-pulse rounded-3xl" />;
}

const tasks = [
  ["GAMES", "Register & Play"], ["KYC", "Complete Verification"], ["SURVEYS", "Brand Polls"],
  ["ADS", "Watch & Earn Coins"], ["APPS", "Install & Try"], ["PROJECTS", "Company Briefs"],
  ["SPIN", "Daily Wheel"], ["TRIBES", "Refer & Earn"], ["SAMPLING", "Try Products"],
  ["VIDEOS", "Short Reviews"], ["QUIZZES", "Skill Tests"], ["MICRO", "Quick Wins"],
];

function Marquee() {
  const row = [...tasks, ...tasks];
  return (
    <div className="overflow-hidden border-y border-border/10 py-6 glass">
      <div className="marquee flex gap-10 whitespace-nowrap">
        {row.map((b, i) => (
          <div key={i} className="flex items-baseline gap-2 px-2">
            <span className="eyebrow text-primary">{b[0]}</span>
            <span className="font-serif text-2xl text-foreground">{b[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl overflow-hidden border border-primary/30">
            <img src="https://i.ibb.co/bMmCYpfm/logo.jpg" alt="Doearno Logo" className="w-full h-full object-cover" />
          </span>
          <span className="font-serif text-2xl tracking-tight">Doearno</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#earn" className="text-muted-foreground hover:text-primary transition-colors">Earn</a>
          <a href="#how" className="text-muted-foreground hover:text-primary transition-colors">How it works</a>
          <a href="#tribes" className="text-muted-foreground hover:text-primary transition-colors">Tribes</a>
          <a href="#stories" className="text-muted-foreground hover:text-primary transition-colors">Stories</a>
        </nav>
        <a href="https://official.doearno.in" className="btn-3d rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-deep transition-colors">
          Start Earning →
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const handleCta = (e: React.MouseEvent) => {
    const r = (e.target as HTMLElement).getBoundingClientRect();
    triggerConfetti(r.left + r.width / 2, r.top + r.height / 2);
    triggerCoinRain();
  };
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="bg-primary-soft/40 text-foreground text-center py-2 text-xs border-b border-primary/20 backdrop-blur-md">
        <span className="eyebrow text-primary mr-3">🚀 NOW LAUNCHING</span>
        Be among the first to experience Doearno · Beta open
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28 relative z-10">
        <div className="flex flex-col justify-center">
          <p className="eyebrow mb-6">· Learn · Do · Grow ·</p>
          <h1 className="display text-6xl md:text-7xl lg:text-8xl">
            Turn your time into
            <br />
            <em className="shimmer-text">real money</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Doearno is a task-based earning platform. Register, play games,
            complete KYC & surveys, finish real projects from top companies —
            level up, earn coins & XP, withdraw real money to UPI.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="https://official.doearno.in" onClick={handleCta} className="btn-3d glow-pulse group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:bg-primary-deep transition-all">
              Start Earning Now 🚀
              <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground/15 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a href="#how" className="btn-3d glass inline-flex items-center gap-2 rounded-full px-6 py-4 hover:border-primary hover:text-primary transition-colors">
              See how it works ▸
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <div><span className="text-foreground font-semibold">₹20</span> · min withdrawal</div>
            <div><span className="text-foreground font-semibold">UPI</span> · instant payout</div>
            <div><span className="text-foreground font-semibold">100%</span> · free to join</div>
          </div>
        </div>
        <div className="relative flex items-center justify-center min-h-[500px]">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/15 blur-3xl" />
          <Suspense fallback={<LoaderPlaceholder />}>
            <div className="w-full h-full min-h-[500px]"><HeroScene /></div>
          </Suspense>
          <div className="absolute -left-2 top-12 rounded-2xl glass p-4 shadow-[var(--shadow-soft)] border border-border/10 card-3d z-20">
            <p className="eyebrow text-primary mb-1">● XP EARNED</p>
            <p className="font-serif text-2xl">+250 XP</p>
          </div>
          <div className="absolute -right-2 bottom-20 rounded-2xl glass p-4 shadow-[var(--shadow-soft)] border border-border/10 card-3d z-20">
            <p className="eyebrow mb-1">wallet · UPI</p>
            <p className="font-mono text-sm text-primary">₹20 min · withdraw to UPI</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueWall() {
  const stats = [
    ["5", "Ways to earn"], ["₹20", "Min withdrawal"],
    ["1–10", "Coins per ad"], ["25%", "Referral bonus"],
  ];
  return (
    <section className="bg-transparent py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <p className="eyebrow text-center">· The earning wall ·</p>
          <CheckmarkAnimation />
        </div>
        <h2 className="display mt-4 text-center text-5xl md:text-6xl">
          Real tasks. <em className="text-primary">Real rewards.</em>
          <br />Every day.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">
          From quick coin-earning ads to full company projects — Doearno turns
          every spare minute into XP, coins, and real cash in your wallet.
        </p>
        <div className="mt-16 grid grid-cols-2 gap-px bg-border/10 md:grid-cols-4 rounded-3xl overflow-hidden reveal-stagger glass">
          {stats.map(([n, l]) => (
            <div key={l} className="bg-background/20 backdrop-blur-sm p-8 text-center card-3d reveal visible">
              <p className="font-serif text-5xl text-primary">{n}</p>
              <p className="mt-2 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <p className="eyebrow text-center mb-6">· Categories you can earn from ·</p>
          <Marquee />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Sign up & join a tribe", "Register in two minutes. Enter a referral code or paste a tribe link to join your circle."],
    ["02", "Pick a task & do it", "Watch ads, play games, take surveys, complete KYC, or work on real company projects. Earn coins + XP."],
    ["03", "Withdraw to UPI", "Exchange coins to wallet. Once you cross ₹20, withdraw instantly to your UPI. No fees."],
  ];
  const StepIcons = [StepIcon1, StepIcon2, StepIcon3];
  const handleStep = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerConfetti(r.left + r.width / 2, r.top);
  };
  return (
    <section id="how" className="bg-transparent border-y border-border/10 py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <p className="eyebrow text-primary">· How it works ·</p>
            <h2 className="display mt-4 text-5xl md:text-6xl max-w-3xl">
              Get started in <em className="text-primary">three</em> simple steps.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-xl">First payout the same day. The whole flow:</p>
          </div>
          <div className="w-48 h-56 flex-shrink-0 hidden lg:block">
            <LazySection height="224px">
              <Suspense fallback={<LoaderPlaceholder />}>
                <MascotScene />
              </Suspense>
            </LazySection>
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map(([n, t, d], i) => {
            const Icon = StepIcons[i];
            return (
              <div key={n} onClick={handleStep} className="glass rounded-3xl p-10 card-3d cursor-pointer gradient-border">
                <div className="step-icon-3d"><Icon /></div>
                <p className="font-mono text-primary text-sm">{n}</p>
                <h3 className="font-serif text-3xl mt-4">{t}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Ladder() {
  const tiers = [
    ["Stage 01 · Start", "First Coins", "Level 1 → 5", "Watch ads, play games, complete your KYC. Earn 1–10 coins per ad. Build your XP score from day one."],
    ["Stage 02 · Grow · Popular", "Skill & Tribe", "Level 5 → 15", "Take brand surveys, daily spins, refer friends. Earn 25% bonus on every referral's first 2 projects."],
    ["Stage 03 · Pro", "Real Projects", "Level 15+", "Unlock company projects. Real briefs from top brands. Higher payouts, premium tasks, leader status in your tribe."],
  ];
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const h = window.innerHeight;
    const p = Math.max(0, Math.min(1, (h - rect.top) / (h + rect.height)));
    setProgress(p);
  }, [scrollY]);

  return (
    <section id="earn" className="bg-transparent py-24 relative overflow-hidden" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <p className="eyebrow">· The level & XP ladder ·</p>
        <h2 className="display mt-4 text-5xl md:text-6xl max-w-4xl">
          From <em className="shimmer-text">first coin</em> to real projects.
        </h2>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Doearno is built like a game. Every task earns you XP. Every level
          unlocks higher-paying work and better rewards.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map(([s, t, p2, d], i) => (
            <div key={t} className={`relative rounded-3xl p-8 card-3d glass ${i === 1 ? "bg-primary-soft/30 border-primary glow-pulse" : "border-border/10"}`}>
              {i === 0 && (
                <div className="w-full h-40 mb-4">
                  <LazySection height="160px">
                    <Suspense fallback={<LoaderPlaceholder />}>
                      <SpinningCoin />
                    </Suspense>
                  </LazySection>
                </div>
              )}
              {i === 2 && (
                <div className="w-full h-40 mb-4">
                  <LazySection height="160px">
                    <Suspense fallback={<LoaderPlaceholder />}>
                      <BlueprintScene progress={progress} />
                    </Suspense>
                  </LazySection>
                </div>
              )}
              <p className="eyebrow">{s}</p>
              <h3 className="font-serif text-3xl mt-4">{t}</h3>
              <p className="font-serif text-4xl text-primary mt-4">{p2}</p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Daily spin · max <span className="text-foreground font-semibold">4 spins</span> · complete projects to unlock more
        </p>
      </div>
    </section>
  );
}

function WorkTypes() {
  const types = [
    ["01", "Watch ads & earn coins", "Quickest way to start. Earn 1–10 coins per ad. Convert coins to wallet anytime.", "Video ads, banner views, sponsored content"],
    ["02", "Games, KYC & surveys", "Register on partner apps, play games, complete your KYC, answer brand surveys.", "App registrations, KYC bonuses, brand polls, ad recall"],
    ["03", "Company projects", "Real briefs from real brands. Submitted work is reviewed and approved by admin.", "Content tasks, sampling missions, micro-research, app testing"],
    ["04", "Spin & win", "Up to 4 daily spins. Win cash and XP. Complete projects to unlock more spins.", "Daily wheel, surprise bonuses, streak rewards"],
  ];
  return (
    <section className="bg-transparent py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <p className="eyebrow text-primary">· What you can do ·</p>
        <h2 className="display mt-4 text-5xl md:text-6xl max-w-4xl">
          Four ways to earn. <em className="text-primary">All</em> in one app.
        </h2>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Whether you have ten seconds or two hours, there's a task that fits.
          Build habits, skills & confidence — and get paid for it.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {types.map(([n, t, d, ex]) => (
            <div key={n} className="rounded-3xl glass p-10 card-3d gradient-border">
              <p className="font-mono text-primary text-sm">{n}</p>
              <h3 className="font-serif text-3xl mt-4">{t}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{d}</p>
              <p className="mt-6 eyebrow">EXAMPLES</p>
              <p className="mt-2 text-sm">{ex}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tribes() {
  return (
    <section id="tribes" className="bg-transparent py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <p className="eyebrow">· Tribes & referrals ·</p>
          <h2 className="display mt-4 text-5xl md:text-6xl">
            Earn together. <em className="text-primary">Grow faster.</em>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Join a tribe through your friend's WhatsApp link or referral code.
            Your tribe leader supports your journey. Share your own code and
            earn a <span className="text-primary font-semibold">25% bonus</span> on
            every new member's first 2 projects.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              "Paste a tribe WhatsApp link to join instantly",
              "Tribe leaders unlock dashboards & community tools",
              "Climb the leaderboard with your tribe",
              "Earn referral bonuses every time someone you brought in completes a project",
            ].map((x) => (
              <li key={x} className="flex gap-3">
                <span className="mt-1 text-primary">●</span>
                <span className="text-muted-foreground">{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl glass p-8 shadow-[var(--shadow-soft)] card-3d">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-primary">REFER & EARN</p>
            <span className="text-xs text-muted-foreground">in-app</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Already on Doearno? Open the app's <span className="text-foreground font-medium">Refer & Earn</span> section
            on your home screen — share your personal link with friends and earn
            <span className="text-primary font-semibold"> 25% bonus</span> on every referral's first projects.
          </p>
          <div className="mt-5 rounded-2xl bg-background/30 backdrop-blur-sm border border-border/10 p-5">
            <p className="text-xs eyebrow text-muted-foreground">HOW IT WORKS</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Open Doearno app → Home</li>
              <li>Tap <span className="text-foreground">Refer & Earn</span></li>
              <li>Share your link on WhatsApp</li>
              <li>Earn coins as friends complete tasks</li>
            </ol>
          </div>
          <a href="https://official.doearno.in" className="btn-3d mt-6 block text-center rounded-full bg-primary py-3 text-primary-foreground font-semibold hover:bg-primary-deep transition-colors">
            Get the app
          </a>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section id="stories" className="bg-transparent border-y border-border/10 py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
        <p className="eyebrow text-primary">· Real users · Real earnings ·</p>
        <h2 className="display mt-4 text-5xl md:text-6xl max-w-3xl mx-auto">
          Hum abhi <em className="text-primary">journey start</em> kar rahe hain.
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          Stories aur feedback bahut jaldi yahan add karenge. Tab tak, aap khud
          shuru kijiye — pehle cohort ka hissa baniye.
        </p>
        <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary/30 glass px-6 py-3">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm">Be one of the first stories — start earning today</span>
        </div>
        <div className="mt-10">
          <a href="https://official.doearno.in" onClick={(e) => { const r = (e.target as HTMLElement).getBoundingClientRect(); triggerConfetti(r.left + r.width/2, r.top); triggerCoinRain(); }} className="btn-3d glow-pulse inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-primary-foreground font-semibold hover:bg-primary-deep transition-colors">
            Join the beta 🚀
          </a>
        </div>
      </div>
    </section>
  );
}

function Blog() {
  const posts = [
    [coverSurveys, "Earn online · 8 min", "How to make your first ₹500 on Doearno in week one"],
    [coverUpi, "Money · 6 min", "Coins, wallet, UPI — how the Doearno payout flow really works"],
    [coverGrowth, "Growth · 9 min", "Levels & XP explained — and why higher levels unlock better tasks"],
  ];
  return (
    <section id="blog" className="bg-transparent py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="eyebrow">· Dispatches ·</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">Honest guides. <em className="text-primary">Not hype.</em></h2>
          </div>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">All posts ▸</a>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {posts.map(([img, meta, title]) => (
            <a key={title} href="#" className="group rounded-3xl overflow-hidden glass block card-3d">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <p className="eyebrow">{meta}</p>
                <h3 className="font-serif text-2xl mt-3 leading-tight">{title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="download" className="relative py-28 overflow-hidden" style={{ background: "var(--gradient-emerald)" }}>
      <div className="mx-auto max-w-4xl px-6 text-center text-primary-foreground relative z-10">
        <p className="eyebrow text-primary-foreground/70">· Your turn ·</p>
        <h2 className="display mt-4 text-6xl md:text-8xl">
          Your first coin
          <br />
          <em>is one tap away.</em>
        </h2>
        <p className="mt-8 text-lg text-primary-foreground/80">
          Free forever. Zero fees. Real tasks. Real coins. Instant UPI.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="https://official.doearno.in" onClick={(e) => { const r = (e.target as HTMLElement).getBoundingClientRect(); triggerConfetti(r.left + r.width/2, r.top); triggerCoinRain(); }} className="btn-3d rounded-full bg-foreground text-background px-7 py-4 font-semibold hover:bg-background hover:text-foreground transition-colors">
            Start Earning Now 🚀
          </a>
          <a href="mailto:doearno@gmail.com" className="rounded-full border border-foreground/30 px-7 py-4 font-semibold hover:bg-foreground/10 transition-colors">
            doearno@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background/40 backdrop-blur-md border-t border-border/10 py-12 relative z-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl overflow-hidden border border-primary/30">
            <img src="https://i.ibb.co/bMmCYpfm/logo.jpg" alt="Doearno Logo" className="w-full h-full object-cover" />
          </span>
          <span className="font-serif text-2xl">Doearno</span>
        </div>
        <p className="eyebrow text-muted-foreground">LEARN · DO · GROW · UPI PAYOUTS · MADE IN INDIA</p>
        <p className="text-sm text-muted-foreground">© 2026 Doearno · doearno@gmail.com</p>
      </div>
    </footer>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Suspense fallback={null}>
        <Global3DBackground />
      </Suspense>
      <Header />
      <main>
        <Hero />
        <ValueWall />
        <HowItWorks />
        <Ladder />
        <WorkTypes />
        <Tribes />
        <Stories />
        <Blog />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
