import type { OrganismData, SimulationConfig } from '../types';

export function applyFlocking(organisms: OrganismData[], cfg: SimulationConfig): void {
  const flockingDistance = cfg.connectionDistance * 0.8;
  const alignmentStrength = 0.003;
  const cohesionStrength = 0.0008;

  for (let i = 0; i < organisms.length; i++) {
    let neighborCount = 0;
    let avgNeighborX = 0;
    let avgNeighborY = 0;
    let avgNeighborVx = 0;
    let avgNeighborVy = 0;
    
    for (let j = 0; j < organisms.length; j++) {
      if (i === j) continue;
      
      const dx = organisms[j].x - organisms[i].x;
      const dy = organisms[j].y - organisms[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < flockingDistance && distance > 0.1) {
        neighborCount++;
        avgNeighborX += organisms[j].x;
        avgNeighborY += organisms[j].y;
        avgNeighborVx += organisms[j].vx;
        avgNeighborVy += organisms[j].vy;
      }
    }
    
    if (neighborCount > 0) {
      avgNeighborX /= neighborCount;
      avgNeighborY /= neighborCount;
      avgNeighborVx /= neighborCount;
      avgNeighborVy /= neighborCount;
      
      const cohesionDx = avgNeighborX - organisms[i].x;
      const cohesionDy = avgNeighborY - organisms[i].y;
      const cohesionDist = Math.sqrt(cohesionDx * cohesionDx + cohesionDy * cohesionDy);
      
      if (cohesionDist > organisms[i].size * 2) {
        organisms[i].vx += (cohesionDx / cohesionDist) * cohesionStrength * neighborCount;
        organisms[i].vy += (cohesionDy / cohesionDist) * cohesionStrength * neighborCount;
      }
      
      organisms[i].vx += (avgNeighborVx - organisms[i].vx) * alignmentStrength;
      organisms[i].vy += (avgNeighborVy - organisms[i].vy) * alignmentStrength;
    }
  }
}

export function applyCollisionSeparation(organisms: OrganismData[]): void {
  const spinInfluence = 0.00005;

  for (let i = 0; i < organisms.length; i++) {
    for (let j = i + 1; j < organisms.length; j++) {
      const dx = organisms[j].x - organisms[i].x;
      const dy = organisms[j].y - organisms[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.1) continue;

      const nx = dx / distance;
      const ny = dy / distance;

      const combinedRadius = (organisms[i].size + organisms[j].size) * 0.5;
      const collisionBuffer = combinedRadius * 0.9;

      if (distance < collisionBuffer) {
        const overlap = collisionBuffer - distance;
        const separationForce = Math.min(overlap * 0.025, 0.18);
        
        const iStable = organisms[i].stabilizing > 0 ? 0.3 : 1;
        const jStable = organisms[j].stabilizing > 0 ? 0.3 : 1;
        
        organisms[i].vx -= nx * separationForce * iStable;
        organisms[i].vy -= ny * separationForce * iStable;
        organisms[j].vx += nx * separationForce * jStable;
        organisms[j].vy += ny * separationForce * jStable;

        if (distance < combinedRadius * 0.5) {
          const pushStrength = (combinedRadius * 0.5 - distance) * 0.05;
          organisms[i].x -= nx * pushStrength;
          organisms[i].y -= ny * pushStrength;
          organisms[j].x += nx * pushStrength;
          organisms[j].y += ny * pushStrength;
        }

        const spinDelta = (organisms[j].rotationSpeed - organisms[i].rotationSpeed) * spinInfluence;
        organisms[i].rotationSpeed += spinDelta * iStable;
        organisms[j].rotationSpeed -= spinDelta * jStable;
        
        organisms[i].stabilizing = 60;
        organisms[j].stabilizing = 60;
      }
    }
  }
}
