import type { ChainLink, OrganismData } from '../types';

export function drawChainLinks(
  ctx: CanvasRenderingContext2D,
  chainLinks: ChainLink[],
  organisms: OrganismData[],
  strokeColor: string,
  baseAlpha: number
): void {
  chainLinks.forEach((link) => {
    if (link.orgAIndex >= organisms.length || link.orgBIndex >= organisms.length) return;
    
    const orgA = organisms[link.orgAIndex];
    const orgB = organisms[link.orgBIndex];
    
    if (!orgA || !orgB) return;
    
    const dx = orgB.x - orgA.x;
    const dy = orgB.y - orgA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 0.1) return;
    
    const ageAlpha = link.age < 20 ? link.age / 20 : 
                     link.age > link.maxAge - 20 ? (link.maxAge - link.age) / 20 : 1;
    const alpha = link.strength * ageAlpha * baseAlpha * 0.5;
    
    const segments = 5;
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    ctx.beginPath();
    ctx.moveTo(orgA.x, orgA.y);
    
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const baseX = orgA.x + dx * t;
      const baseY = orgA.y + dy * t;
      const wobble = Math.sin(t * Math.PI * 2 + link.age * 0.05) * 5 * link.strength;
      ctx.lineTo(baseX + perpX * wobble, baseY + perpY * wobble);
    }
    
    ctx.lineTo(orgB.x, orgB.y);
    ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  });
}
