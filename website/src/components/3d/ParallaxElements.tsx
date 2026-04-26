import { useScrollY } from "@/hooks/use-scroll";
import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  type: "bar" | "graph" | "circle" | "diamond";
  x: string; y: string;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
}

const elements: FloatingElement[] = [
  { id: 1, type: "bar", x: "8%", y: "15%", size: 40, speed: 0.08, delay: 0, opacity: 0.12 },
  { id: 2, type: "graph", x: "88%", y: "25%", size: 55, speed: 0.05, delay: 0.5, opacity: 0.1 },
  { id: 3, type: "circle", x: "92%", y: "55%", size: 30, speed: 0.12, delay: 1, opacity: 0.08 },
  { id: 4, type: "diamond", x: "5%", y: "70%", size: 25, speed: 0.1, delay: 0.3, opacity: 0.1 },
  { id: 5, type: "bar", x: "95%", y: "80%", size: 35, speed: 0.06, delay: 0.7, opacity: 0.09 },
  { id: 6, type: "graph", x: "3%", y: "45%", size: 45, speed: 0.07, delay: 0.2, opacity: 0.08 },
  { id: 7, type: "circle", x: "15%", y: "90%", size: 20, speed: 0.15, delay: 1.2, opacity: 0.07 },
  { id: 8, type: "diamond", x: "85%", y: "10%", size: 18, speed: 0.09, delay: 0.8, opacity: 0.1 },
];

function BarSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="2" y="20" width="8" height="18" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="14" y="10" width="8" height="28" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="26" y="5" width="8" height="33" rx="2" fill="currentColor" />
    </svg>
  );
}

function GraphSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 40" fill="none">
      <polyline points="2,35 12,25 22,28 32,12 42,8 48,15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="42" cy="8" r="3" fill="currentColor" />
    </svg>
  );
}

function CircleSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="15" r="5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function DiamondSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

const SHAPE_MAP = { bar: BarSVG, graph: GraphSVG, circle: CircleSVG, diamond: DiamondSVG };

export default function ParallaxElements() {
  const scrollY = useScrollY();
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {elements.map((el) => {
        const Shape = SHAPE_MAP[el.type];
        const yOffset = scrollY * el.speed;
        const floatY = Math.sin(Date.now() * 0.001 * 0.5 + el.delay * 5) * 8;
        return (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              color: "var(--color-primary)",
              opacity: el.opacity,
              transform: `translateY(${-yOffset + floatY}px) rotate(${scrollY * el.speed * 0.3}deg)`,
              transition: "transform 0.1s linear",
              willChange: "transform",
            }}
          >
            <Shape size={el.size} />
          </div>
        );
      })}
    </div>
  );
}
