import type { ChainLink, OrganismData, SimulationConfig } from '../types';

export function createChainLink(
  chainLinks: ChainLink[],
  orgAIndex: number,
  orgBIndex: number
): void {
  const existing = chainLinks.find(
    (c) => (c.orgAIndex === orgAIndex && c.orgBIndex === orgBIndex) || 
           (c.orgAIndex === orgBIndex && c.orgBIndex === orgAIndex)
  );
  if (!existing) {
    chainLinks.push({
      orgAIndex,
      orgBIndex,
      strength: 1,
      age: 0,
      maxAge: 120 + Math.floor(Math.random() * 60),
    });
  }
}

export function updateChainLinks(
  chainLinks: ChainLink[],
  organisms: OrganismData[],
  cfg: SimulationConfig
): void {
  for (let i = chainLinks.length - 1; i >= 0; i--) {
    const link = chainLinks[i];
    
    if (link.orgAIndex >= organisms.length || link.orgBIndex >= organisms.length) {
      chainLinks.splice(i, 1);
      continue;
    }
    
    const orgA = organisms[link.orgAIndex];
    const orgB = organisms[link.orgBIndex];
    
    if (!orgA || !orgB) {
      chainLinks.splice(i, 1);
      continue;
    }
    
    link.age++;
    
    const dx = orgB.x - orgA.x;
    const dy = orgB.y - orgA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxStretch = cfg.connectionDistance * 0.8;
    const breakDistance = cfg.connectionDistance * 1.5;
    
    if (distance > breakDistance) {
      chainLinks.splice(i, 1);
      continue;
    }
    
    if (distance > maxStretch) {
      link.strength -= 0.08;
    } else {
      link.strength = Math.min(1, link.strength + 0.02);
    }
    
    if (link.age > link.maxAge || link.strength <= 0) {
      chainLinks.splice(i, 1);
    }
  }
}

export function remapChainLinkIndices(
  chainLinks: ChainLink[],
  removedIndex: number
): void {
  for (let i = chainLinks.length - 1; i >= 0; i--) {
    const link = chainLinks[i];
    
    if (link.orgAIndex === removedIndex || link.orgBIndex === removedIndex) {
      chainLinks.splice(i, 1);
      continue;
    }
    
    if (link.orgAIndex > removedIndex) link.orgAIndex--;
    if (link.orgBIndex > removedIndex) link.orgBIndex--;
  }
}
