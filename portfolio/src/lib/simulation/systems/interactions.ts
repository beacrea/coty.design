import type { OrganismData, SimulationConfig, Vertex, Lobe } from '../types';
import { createVertices, createLobe } from '../state';

export interface InteractionResult {
  spawnParticlesAt: { x: number; y: number; vx: number; vy: number; count: number }[];
  createChainLinks: { orgAIndex: number; orgBIndex: number }[];
}

function triggerGlow(org: OrganismData, intensity: number = 1): void {
  org.glow = Math.min(1, org.glow + intensity);
}

function growTendril(org: OrganismData, targetX: number, targetY: number): void {
  if (!org.tendril) {
    const dx = targetX - org.x;
    const dy = targetY - org.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    org.tendril = {
      targetX,
      targetY,
      length: 0,
      maxLength: Math.min(dist * 0.6, org.size * 1.5),
      curveOffset: (Math.random() - 0.5) * 20,
      decaying: false,
    };
  }
}

function evolve(org: OrganismData, maxVertices: number): void {
  if (org.vertices.length < maxVertices && Math.random() < 0.3) {
    const insertIndex = Math.floor(Math.random() * org.vertices.length);
    const nextIndex = (insertIndex + 1) % org.vertices.length;
    const newAngle = (org.vertices[insertIndex].angle + org.vertices[nextIndex].angle) / 2;
    const newDistance = 0.7 + Math.random() * 0.3;
    org.vertices.splice(insertIndex + 1, 0, { angle: newAngle, distance: newDistance });
  }
}

function morphWith(orgA: OrganismData, orgB: OrganismData): void {
  if (orgA.vertices.length > 3 && orgB.vertices.length < 7) {
    const donorIndex = Math.floor(Math.random() * orgA.vertices.length);
    const donatedVertex = orgA.vertices[donorIndex];
    const newVertex: Vertex = {
      angle: donatedVertex.angle + (Math.random() - 0.5) * 0.5,
      distance: donatedVertex.distance * (0.8 + Math.random() * 0.4),
    };
    orgB.vertices.push(newVertex);
    orgB.vertices.sort((a, b) => a.angle - b.angle);
  }
}

function absorbLobeFrom(receiver: OrganismData, donor: OrganismData, cfg: SimulationConfig): boolean {
  if (donor.lobes.length === 0 || receiver.lobes.length >= 5) return false;
  
  const stolenLobe = donor.lobes.pop()!;
  const newLobe: Lobe = {
    offsetAngle: stolenLobe.offsetAngle + (Math.random() - 0.5) * 0.5,
    offsetDistance: stolenLobe.offsetDistance * (0.9 + Math.random() * 0.3),
    vertices: stolenLobe.vertices.map(v => ({
      angle: v.angle,
      distance: v.distance * (0.8 + Math.random() * 0.4),
    })),
    size: stolenLobe.size * (0.7 + Math.random() * 0.4),
    rotationOffset: stolenLobe.rotationOffset + Math.random() * 0.5,
  };
  receiver.lobes.push(newLobe);
  receiver.size = Math.min(receiver.maxSize, receiver.size + donor.size * 0.1);
  return true;
}

function incorporateFrom(larger: OrganismData, smaller: OrganismData, cfg: SimulationConfig): void {
  if (smaller.lobes.length > 0 && larger.lobes.length < 5 && Math.random() < 0.6) {
    absorbLobeFrom(larger, smaller, cfg);
  }
  
  if (smaller.vertices.length > 3 && larger.vertices.length < cfg.maxVertices) {
    const donorIndex = Math.floor(Math.random() * smaller.vertices.length);
    const donatedVertex = smaller.vertices[donorIndex];
    const newVertex: Vertex = {
      angle: donatedVertex.angle + (Math.random() - 0.5) * 0.3,
      distance: donatedVertex.distance * (0.85 + Math.random() * 0.3),
    };
    larger.vertices.push(newVertex);
    larger.vertices.sort((a, b) => a.angle - b.angle);
    smaller.vertices.splice(donorIndex, 1);
  }
  
  if (Math.random() < 0.3 && larger.lobes.length < 5) {
    const newLobe = createLobe(cfg);
    newLobe.size *= 0.6 + Math.random() * 0.4;
    larger.lobes.push(newLobe);
  }
  
  larger.size = Math.min(larger.maxSize, larger.size + smaller.size * 0.15);
  larger.spokeIntensity = Math.min(0.8, larger.spokeIntensity + 0.1);
}

function fuseWith(larger: OrganismData, smaller: OrganismData, cfg: SimulationConfig): void {
  const maxLobes = 5;
  
  while (smaller.lobes.length > 0 && larger.lobes.length < maxLobes) {
    absorbLobeFrom(larger, smaller, cfg);
  }
  
  const vertexBudget = cfg.maxVertices - larger.vertices.length;
  const verticesToTake = Math.min(vertexBudget, Math.floor(smaller.vertices.length * 0.5));
  for (let i = 0; i < verticesToTake && smaller.vertices.length > 3; i++) {
    const idx = Math.floor(Math.random() * smaller.vertices.length);
    const v = smaller.vertices.splice(idx, 1)[0];
    larger.vertices.push({
      angle: v.angle + (Math.random() - 0.5) * 0.4,
      distance: v.distance * (0.8 + Math.random() * 0.4),
    });
  }
  larger.vertices.sort((a, b) => a.angle - b.angle);
  
  larger.size = Math.min(larger.maxSize, larger.size + smaller.size * 0.25);
  smaller.size *= 0.7;
  smaller.size = Math.max(smaller.minSize, smaller.size);
  larger.spokeIntensity = Math.min(0.9, larger.spokeIntensity + 0.15);
  
  if (larger.lobes.length < maxLobes && Math.random() < 0.4) {
    const bridgeLobe = createLobe(cfg);
    const dx = smaller.x - larger.x;
    const dy = smaller.y - larger.y;
    bridgeLobe.offsetAngle = Math.atan2(dy, dx) - larger.rotation;
    bridgeLobe.offsetDistance = 1.0 + Math.random() * 0.3;
    bridgeLobe.size *= 0.8;
    larger.lobes.push(bridgeLobe);
  }
}

function simplify(org: OrganismData): void {
  if (org.vertices.length > 3) {
    const removeIndex = Math.floor(Math.random() * org.vertices.length);
    org.vertices.splice(removeIndex, 1);
  }
}

function pulseSize(org: OrganismData, factor: number): void {
  org.size *= factor;
  org.size = Math.max(org.minSize, Math.min(org.maxSize, org.size));
}

export function applyProximityInteractions(
  organisms: OrganismData[],
  cfg: SimulationConfig
): InteractionResult {
  const result: InteractionResult = {
    spawnParticlesAt: [],
    createChainLinks: [],
  };

  const interactionDistance = cfg.mergeDistance;

  for (let i = 0; i < organisms.length; i++) {
    for (let j = i + 1; j < organisms.length; j++) {
      const dx = organisms[j].x - organisms[i].x;
      const dy = organisms[j].y - organisms[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.1) continue;

      const nx = dx / distance;
      const ny = dy / distance;

      if (distance < interactionDistance) {
        const proximityFactor = 1 - distance / interactionDistance;
        const baseChance = cfg.interactionChance * (1 + proximityFactor);
        const triggerChance = proximityFactor * baseChance;
        
        if (Math.random() < triggerChance) {
          const interactionType = Math.random();
          
          triggerGlow(organisms[i], 0.15);
          triggerGlow(organisms[j], 0.15);
          
          if (interactionType < 0.10) {
            if (organisms[i].vertices.length <= organisms[j].vertices.length) {
              evolve(organisms[i], cfg.maxVertices);
              growTendril(organisms[i], organisms[j].x, organisms[j].y);
            } else {
              evolve(organisms[j], cfg.maxVertices);
              growTendril(organisms[j], organisms[i].x, organisms[i].y);
            }
            result.spawnParticlesAt.push({
              x: (organisms[i].x + organisms[j].x) / 2,
              y: (organisms[i].y + organisms[j].y) / 2,
              vx: 0, vy: 0, count: 3
            });
          } else if (interactionType < 0.35) {
            morphWith(organisms[i], organisms[j]);
            morphWith(organisms[j], organisms[i]);
            result.createChainLinks.push({ orgAIndex: i, orgBIndex: j });
            growTendril(organisms[i], organisms[j].x, organisms[j].y);
            growTendril(organisms[j], organisms[i].x, organisms[i].y);
            result.spawnParticlesAt.push({
              x: (organisms[i].x + organisms[j].x) / 2,
              y: (organisms[i].y + organisms[j].y) / 2,
              vx: 0, vy: 0, count: 4
            });
          } else if (interactionType < 0.55) {
            const larger = organisms[i].size > organisms[j].size ? organisms[i] : organisms[j];
            const smaller = organisms[i].size > organisms[j].size ? organisms[j] : organisms[i];
            incorporateFrom(larger, smaller, cfg);
            triggerGlow(larger, 0.25);
            result.createChainLinks.push({ orgAIndex: i, orgBIndex: j });
            growTendril(larger, smaller.x, smaller.y);
            result.spawnParticlesAt.push({ x: smaller.x, y: smaller.y, vx: smaller.vx, vy: smaller.vy, count: 6 });
            result.spawnParticlesAt.push({ x: larger.x, y: larger.y, vx: 0, vy: 0, count: 4 });
          } else if (interactionType < 0.72) {
            const larger = organisms[i].size > organisms[j].size ? organisms[i] : organisms[j];
            const smaller = organisms[i].size > organisms[j].size ? organisms[j] : organisms[i];
            fuseWith(larger, smaller, cfg);
            triggerGlow(larger, 0.3);
            result.createChainLinks.push({ orgAIndex: i, orgBIndex: j });
            growTendril(larger, smaller.x, smaller.y);
            growTendril(smaller, larger.x, larger.y);
            result.spawnParticlesAt.push({
              x: (organisms[i].x + organisms[j].x) / 2,
              y: (organisms[i].y + organisms[j].y) / 2,
              vx: 0, vy: 0, count: 8
            });
          } else if (interactionType < 0.82) {
            const burstForce = 0.35;
            organisms[i].vx -= nx * burstForce;
            organisms[i].vy -= ny * burstForce;
            organisms[j].vx += nx * burstForce;
            organisms[j].vy += ny * burstForce;
            pulseSize(organisms[i], 0.90);
            pulseSize(organisms[j], 0.90);
            triggerGlow(organisms[i], 0.2);
            triggerGlow(organisms[j], 0.2);
            const midX = (organisms[i].x + organisms[j].x) / 2;
            const midY = (organisms[i].y + organisms[j].y) / 2;
            result.spawnParticlesAt.push({ x: midX, y: midY, vx: organisms[i].vx, vy: organisms[i].vy, count: 6 });
            result.spawnParticlesAt.push({ x: midX, y: midY, vx: organisms[j].vx, vy: organisms[j].vy, count: 6 });
          } else if (interactionType < 0.90) {
            const hasLobes = organisms[i].lobes.length > 0 || organisms[j].lobes.length > 0;
            if (hasLobes) {
              const donor = organisms[i].lobes.length > organisms[j].lobes.length ? organisms[i] : organisms[j];
              const receiver = organisms[i].lobes.length > organisms[j].lobes.length ? organisms[j] : organisms[i];
              if (absorbLobeFrom(receiver, donor, cfg)) {
                result.createChainLinks.push({ orgAIndex: i, orgBIndex: j });
                growTendril(receiver, donor.x, donor.y);
                result.spawnParticlesAt.push({ x: donor.x, y: donor.y, vx: donor.vx, vy: donor.vy, count: 5 });
              }
            } else {
              const moreComplex = organisms[i].vertices.length > organisms[j].vertices.length ? organisms[i] : organisms[j];
              const lessComplex = organisms[i].vertices.length > organisms[j].vertices.length ? organisms[j] : organisms[i];
              simplify(moreComplex);
              evolve(lessComplex, cfg.maxVertices);
              result.spawnParticlesAt.push({ x: moreComplex.x, y: moreComplex.y, vx: moreComplex.vx, vy: moreComplex.vy, count: 3 });
            }
          } else {
            pulseSize(organisms[i], 1.12);
            pulseSize(organisms[j], 1.12);
            const avgRotSpeed = (organisms[i].rotationSpeed + organisms[j].rotationSpeed) / 2;
            organisms[i].rotationSpeed = avgRotSpeed * 1.5;
            organisms[j].rotationSpeed = avgRotSpeed * 1.5;
            result.createChainLinks.push({ orgAIndex: i, orgBIndex: j });
            if (Math.random() < 0.5) {
              const target = Math.random() < 0.5 ? organisms[i] : organisms[j];
              if (target.lobes.length < 4) {
                target.lobes.push(createLobe(cfg));
              }
            }
          }
        }
      }
    }
  }

  return result;
}
