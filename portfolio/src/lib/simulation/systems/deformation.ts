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
  if (!org.grab.isGrabbed) return;
  
  const pointerDx = state.pointer.velocity.x;
  const pointerDy = state.pointer.velocity.y;
  const speed = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
  
  if (speed < 0.5) return;
  
  const dirX = pointerDx / speed;
  const dirY = pointerDy / speed;
  
  const deformAmount = Math.min(speed * 0.02, cfg.maxDeformation * 0.3);
  
  for (const vertex of org.vertices) {
    const vertexAngle = vertex.angle + org.rotation;
    const vertexNx = Math.cos(vertexAngle);
    const vertexNy = Math.sin(vertexAngle);
    
    const dot = vertexNx * dirX + vertexNy * dirY;
    
    if (dot > 0.2) {
      vertex.deformation += deformAmount * dot * 0.3;
    } else if (dot < -0.2) {
      vertex.deformation -= deformAmount * Math.abs(dot) * 0.15;
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
