import { useRef, useEffect, useCallback, useState } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; type: "coin" | "gift" | "sparkle";
  rot: number; rotV: number; baseY: number; phase: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);

  const init = useCallback((w: number, h: number) => {
    const arr: Particle[] = [];
    const count = Math.min(55, Math.floor(w * h / 15000));
    for (let i = 0; i < count; i++) {
      const types: Particle["type"][] = ["coin", "coin", "gift", "sparkle", "sparkle"];
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 6 + Math.random() * 12,
        alpha: 0.25 + Math.random() * 0.45,
        type: types[Math.floor(Math.random() * types.length)],
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.02,
        baseY: Math.random() * h,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particles.current = arr;
  }, []);

  useEffect(() => {
    if (!ok) return;
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      const rect = cvs.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cvs.width = w * devicePixelRatio;
      cvs.height = h * devicePixelRatio;
      cvs.style.width = w + "px";
      cvs.style.height = h + "px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      init(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = cvs.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    cvs.addEventListener("mousemove", onMove);

    let time = 0;
    const loop = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles.current) {
        // Mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Float
        p.y = p.baseY + Math.sin(time * 0.6 + p.phase) * 18;
        p.x += p.vx;
        p.baseY += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.rot += p.rotV;

        // Wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.baseY < -20) p.baseY = h + 20;
        if (p.baseY > h + 20) p.baseY = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;

        if (p.type === "coin") {
          // Emerald coin
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          g.addColorStop(0, "#00ffc8");
          g.addColorStop(0.6, "#00d4aa");
          g.addColorStop(1, "#007755");
          ctx.fillStyle = g;
          ctx.fill();
          // $ symbol
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          ctx.font = `bold ${p.size}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("₹", 0, 1);
        } else if (p.type === "gift") {
          // Gift box
          const s = p.size;
          ctx.fillStyle = "#00d4aa";
          ctx.fillRect(-s * 0.6, -s * 0.4, s * 1.2, s * 0.9);
          ctx.fillStyle = "#00ffcc";
          ctx.fillRect(-s * 0.08, -s * 0.4, s * 0.16, s * 0.9);
          ctx.fillRect(-s * 0.6, s * 0.05, s * 1.2, s * 0.12);
          // Bow
          ctx.beginPath();
          ctx.arc(-s * 0.15, -s * 0.4, s * 0.18, 0, Math.PI, true);
          ctx.arc(s * 0.15, -s * 0.4, s * 0.18, 0, Math.PI, true);
          ctx.fillStyle = "#00ffcc";
          ctx.fill();
        } else {
          // Sparkle
          const s = p.size * 0.6;
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            const a = (j / 4) * Math.PI * 2 - Math.PI / 4;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          }
          ctx.strokeStyle = "#00d4aa";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#00ffc8";
          ctx.fill();
        }
        ctx.restore();
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      cvs.removeEventListener("mousemove", onMove);
    };
  }, [ok, init]);

  if (!ok) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "auto", zIndex: 0 }}
    />
  );
}
