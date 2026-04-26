import { useRef, useEffect, useCallback, useState } from "react";

interface CParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; rotV: number;
  color: string; alpha: number; gravity: number;
  shape: "rect" | "circle" | "coin";
}

let globalCanvas: HTMLCanvasElement | null = null;
let globalCtx: CanvasRenderingContext2D | null = null;
let particles: CParticle[] = [];
let raf = 0;
let running = false;

function ensureCanvas() {
  if (globalCanvas) return;
  globalCanvas = document.createElement("canvas");
  globalCanvas.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
  document.body.appendChild(globalCanvas);
  globalCtx = globalCanvas.getContext("2d")!;
  const resize = () => {
    globalCanvas!.width = window.innerWidth * devicePixelRatio;
    globalCanvas!.height = window.innerHeight * devicePixelRatio;
    globalCtx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);
}

function loop() {
  if (!globalCtx || !globalCanvas) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  globalCtx.clearRect(0, 0, w, h);

  particles = particles.filter((p) => p.alpha > 0.01 && p.y < h + 50);

  for (const p of particles) {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotV;
    p.alpha *= 0.995;
    p.vx *= 0.99;

    globalCtx.save();
    globalCtx.translate(p.x, p.y);
    globalCtx.rotate(p.rot);
    globalCtx.globalAlpha = p.alpha;

    if (p.shape === "coin") {
      globalCtx.beginPath();
      globalCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      const g = globalCtx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      g.addColorStop(0, "#ffe066");
      g.addColorStop(0.7, "#ffd700");
      g.addColorStop(1, "#b8860b");
      globalCtx.fillStyle = g;
      globalCtx.fill();
      globalCtx.fillStyle = "rgba(0,0,0,0.25)";
      globalCtx.font = `bold ${p.size * 0.9}px sans-serif`;
      globalCtx.textAlign = "center";
      globalCtx.textBaseline = "middle";
      globalCtx.fillText("₹", 0, 1);
    } else if (p.shape === "circle") {
      globalCtx.beginPath();
      globalCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      globalCtx.fillStyle = p.color;
      globalCtx.fill();
    } else {
      globalCtx.fillStyle = p.color;
      globalCtx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
    }
    globalCtx.restore();
  }

  if (particles.length > 0) {
    raf = requestAnimationFrame(loop);
  } else {
    running = false;
  }
}

const COLORS = ["#00d4aa", "#00ffc8", "#00ff88", "#ffd700", "#ffe066", "#00b894", "#55efc4"];

export function triggerConfetti(originX?: number, originY?: number) {
  ensureCanvas();
  const cx = originX ?? window.innerWidth / 2;
  const cy = originY ?? window.innerHeight * 0.35;
  const count = 65;

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 3 + Math.random() * 8;
    const shapes: CParticle["shape"][] = ["rect", "circle", "coin", "rect", "circle"];
    particles.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.85 + Math.random() * 0.15,
      gravity: 0.12 + Math.random() * 0.06,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    });
  }

  if (!running) {
    running = true;
    raf = requestAnimationFrame(loop);
  }
}

export function triggerCoinRain() {
  ensureCanvas();
  const w = window.innerWidth;
  const count = 40;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 2 + Math.random() * 3,
      size: 5 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
      color: "#ffd700",
      alpha: 0.9,
      gravity: 0.08,
      shape: "coin",
    });
  }
  if (!running) {
    running = true;
    raf = requestAnimationFrame(loop);
  }
}
