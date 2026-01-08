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
  const baseAlpha = life * depthFade * (observationMode ? 0.55 : 0.3);
  
  const hue = 195 + ((x * 0.1) % 30) - 15;
  const saturation = isDark ? (observationMode ? 45 : 25) : (observationMode ? 35 : 20);
  const lightness = isDark ? 75 : 55;
  
  if (size < 2) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.4})`;
    ctx.fill();
    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 15}%, ${baseAlpha * 0.25})`;
    ctx.lineWidth = 0.3;
    ctx.stroke();
    return;
  }
  
  const gradient = ctx.createRadialGradient(
    x - size * 0.2, y - size * 0.2, 0,
    x, y, size
  );
  
  gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 15}%, ${baseAlpha * 0.05})`);
  gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness + 8}%, ${baseAlpha * 0.12})`);
  gradient.addColorStop(0.8, `hsla(${hue}, ${saturation + 5}%, ${lightness}%, ${baseAlpha * 0.2})`);
  gradient.addColorStop(0.95, `hsla(${hue}, ${saturation + 8}%, ${lightness - 5}%, ${baseAlpha * 0.28})`);
  gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.08})`);
  
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 12}%, ${baseAlpha * 0.35})`;
  ctx.lineWidth = 0.4 + size * 0.04;
  ctx.stroke();
  
  if (size > 2.5) {
    const highlightX = x - size * 0.32;
    const highlightY = y - size * 0.32;
    const highlightSize = size * 0.22;
    
    ctx.beginPath();
    ctx.ellipse(highlightX, highlightY, highlightSize * 0.75, highlightSize * 0.45, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 100%, ${baseAlpha * 0.4})`;
    ctx.fill();
  }
  
  if (size > 4) {
    const highlight2X = x - size * 0.12;
    const highlight2Y = y - size * 0.45;
    ctx.beginPath();
    ctx.arc(highlight2X, highlight2Y, size * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 100%, ${baseAlpha * 0.3})`;
    ctx.fill();
  }
}
