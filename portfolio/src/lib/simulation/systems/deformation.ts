import type { SimulationState, SimulationConfig, OrganismData } from '../types';

export function relaxVertexDeformations(
  organisms: OrganismData[],
  cfg: SimulationConfig
): void {
  for (const org of organisms) {
    for (const vertex of org.vertices) {
      vertex.deformation *= cfg.deformationDamping;
      
      const springForce = -vertex.deformation * cfg.deformationStiffness;
      vertex.deformation += springForce;
      
      if (Math.abs(vertex.deformation) < 0.001) {
        vertex.deformation = 0;
      }
      
      vertex.deformation = Math.max(-cfg.maxDeformation, Math.min(cfg.maxDeformation, vertex.deformation));
      
      vertex.distance = vertex.baseDistance + vertex.deformation;
    }
  }
}

export function applyHoverDeformation(
  organisms: OrganismData[],
  cfg: SimulationConfig
): void {
  for (const org of organisms) {
    if (org.hoverIntensity <= 0) continue;
    
    const pulseAmount = Math.sin(org.age * 0.003) * org.hoverIntensity * 0.03;
    
    for (const vertex of org.vertices) {
      vertex.deformation += pulseAmount * (1 - Math.abs(vertex.deformation) / cfg.maxDeformation);
    }
  }
}

export function applyGrabDeformation(
  state: SimulationState,
  cfg: SimulationConfig
): void {
  const grabbedIdx = state.grabbedOrganismIndex;
  if (grabbedIdx === null) return;
  
  const org = state.organisms[grabbedIdx];
  if (!org || !org.grab || !org.grab.isGrabbed) return;
  
  const springVx = org.grab.springVx || 0;
  const springVy = org.grab.springVy || 0;
  const speed = Math.sqrt(springVx * springVx + springVy * springVy);
  
  if (speed < 0.3) return;
  
  const dirX = springVx / speed;
  const dirY = springVy / speed;
  
  const speedFactor = Math.min(speed / 2, 1);
  const baseDeform = speed * 0.08 * (1 + speedFactor * 0.5);
  const deformAmount = Math.min(baseDeform, cfg.maxDeformation * 0.6);
  
  for (const vertex of org.vertices) {
    const vertexAngle = vertex.angle + org.rotation;
    const vertexNx = Math.cos(vertexAngle);
    const vertexNy = Math.sin(vertexAngle);
    
    const dot = vertexNx * dirX + vertexNy * dirY;
    
    if (dot > 0.1) {
      vertex.deformation += deformAmount * dot * 0.5;
    } else if (dot < -0.1) {
      vertex.deformation -= deformAmount * Math.abs(dot) * 0.35;
    }
  }
}

export function updateDeformations(
  state: SimulationState,
  cfg: SimulationConfig
): void {
  applyHoverDeformation(state.organisms, cfg);
  applyGrabDeformation(state, cfg);
  relaxVertexDeformations(state.organisms, cfg);
}
