import type { Particle } from '../types';

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  strokeColor: string,
  baseAlpha: number
): void {
  particles.forEach((p) => {
    const depthFade = 0.4 + p.depth * 0.6;
    const alpha = p.life * baseAlpha * 0.6 * depthFade;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${strokeColor}, ${alpha})`;
    ctx.fill();
  });
}
