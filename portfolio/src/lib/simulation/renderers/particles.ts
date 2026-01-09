import type { Particle } from '../types';

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  strokeColor: string,
  baseAlpha: number,
  isDark: boolean = true,
  observationMode: boolean = false
): void {
  particles.forEach((p) => {
    const depthFade = 0.4 + p.depth * 0.6;
    const minAlpha = 0.08;
    const effectiveBase = Math.max(baseAlpha, minAlpha);
    const size = p.size * Math.min(1, p.life + 0.3);
    
    if (p.isBubble) {
      drawBubble(ctx, p.x, p.y, size, p.life, depthFade, isDark, observationMode);
    } else {
      const alpha = p.life * effectiveBase * depthFade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeColor}, ${alpha})`;
      ctx.fill();
    }
  });
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  life: number,
  depthFade: number,
  isDark: boolean,
  observationMode: boolean
): void {
  const baseAlpha = life * depthFade * (observationMode ? 0.4 : 0.2);
  const lightness = isDark ? 70 : 50;
  
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(200, 15%, ${lightness}%, ${baseAlpha})`;
  ctx.lineWidth = 0.5 + size * 0.02;
  ctx.stroke();
}
