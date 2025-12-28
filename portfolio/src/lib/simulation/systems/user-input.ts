import type { SimulationState, SimulationConfig, OrganismData } from '../types';
import { rebuildSpatialHash, getNearbyOrganismIndices, getBoundingRadius } from '../state';

export function updateSpatialHash(state: SimulationState): void {
  rebuildSpatialHash(state);
}

export function findOrganismAtPoint(
  state: SimulationState,
  x: number,
  y: number
): number | null {
  const searchRadius = 60;
  const nearbyIndices = getNearbyOrganismIndices(state, x, y, searchRadius);
  
  let closestIndex: number | null = null;
  let closestDistance = Infinity;
  
  for (const idx of nearbyIndices) {
    const org = state.organisms[idx];
    const dx = org.x - x;
    const dy = org.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const boundingRadius = getBoundingRadius(org);
    
    if (distance < boundingRadius && distance < closestDistance) {
      closestDistance = distance;
      closestIndex = idx;
    }
  }
  
  return closestIndex;
}

export function updateHover(
  state: SimulationState,
  cfg: SimulationConfig
): void {
  const { pointer, organisms } = state;
  
  if (!pointer.isActive) {
    for (const org of organisms) {
      org.hoverIntensity *= (1 - cfg.hoverEaseSpeed);
      if (org.hoverIntensity < 0.01) org.hoverIntensity = 0;
    }
    state.hoveredOrganismIndex = null;
    return;
  }
  
  const hoveredIndex = findOrganismAtPoint(state, pointer.x, pointer.y);
  state.hoveredOrganismIndex = hoveredIndex;
  
  for (let i = 0; i < organisms.length; i++) {
    const org = organisms[i];
    if (!org.grab) continue;
    const targetIntensity = (i === hoveredIndex && !org.grab.isGrabbed) ? 1 : 0;
    org.hoverIntensity += (targetIntensity - org.hoverIntensity) * cfg.hoverEaseSpeed;
  }
}

export function applyGrabSpringPhysics(
  state: SimulationState,
  cfg: SimulationConfig
): void {
  const grabbedIdx = state.grabbedOrganismIndex;
  if (grabbedIdx === null) return;
  
  const org = state.organisms[grabbedIdx];
  if (!org || !org.grab || !org.grab.isGrabbed) return;
  
  const targetX = state.pointer.x + org.grab.offsetX;
  const targetY = state.pointer.y + org.grab.offsetY;
  
  const dx = targetX - org.x;
  const dy = targetY - org.y;
  
  org.grab.springVx += dx * cfg.grabSpringStiffness;
  org.grab.springVy += dy * cfg.grabSpringStiffness;
  
  org.grab.springVx *= cfg.grabSpringDamping;
  org.grab.springVy *= cfg.grabSpringDamping;
  
  if (!Number.isFinite(org.grab.springVx)) org.grab.springVx = 0;
  if (!Number.isFinite(org.grab.springVy)) org.grab.springVy = 0;
  
  org.x += org.grab.springVx;
  org.y += org.grab.springVy;
  
  org.vx = org.grab.springVx * 0.5;
  org.vy = org.grab.springVy * 0.5;
}

export function applySoftBodyCollisions(
  state: SimulationState,
  cfg: SimulationConfig
): void {
  const grabbedIdx = state.grabbedOrganismIndex;
  if (grabbedIdx === null) return;
  
  const grabbedOrg = state.organisms[grabbedIdx];
  const grabbedRadius = getBoundingRadius(grabbedOrg);
  const searchRadius = grabbedRadius * 3;
  
  const nearbyIndices = getNearbyOrganismIndices(
    state,
    grabbedOrg.x,
    grabbedOrg.y,
    searchRadius
  );
  
  for (const idx of nearbyIndices) {
    if (idx === grabbedIdx) continue;
    
    const other = state.organisms[idx];
    const dx = other.x - grabbedOrg.x;
    const dy = other.y - grabbedOrg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 0.1) continue;
    
    const otherRadius = getBoundingRadius(other);
    const combinedRadius = (grabbedRadius + otherRadius) * 0.6;
    
    if (distance < combinedRadius && distance > 0.01) {
      const overlap = combinedRadius - distance;
      const pushStrength = Math.min(overlap * cfg.softCollisionStrength * 0.1, 2);
      
      const nx = dx / distance;
      const ny = dy / distance;
      
      if (Number.isFinite(nx) && Number.isFinite(ny)) {
        other.vx += nx * pushStrength;
        other.vy += ny * pushStrength;
        
        applyCollisionDeformation(other, -nx, -ny, overlap, cfg);
      }
    }
  }
}

function applyCollisionDeformation(
  org: OrganismData,
  impactNx: number,
  impactNy: number,
  overlap: number,
  cfg: SimulationConfig
): void {
  const deformAmount = Math.min(overlap * 0.02, cfg.maxDeformation * 0.5);
  
  for (const vertex of org.vertices) {
    const vertexAngle = vertex.angle + org.rotation;
    const vertexNx = Math.cos(vertexAngle);
    const vertexNy = Math.sin(vertexAngle);
    
    const dot = vertexNx * impactNx + vertexNy * impactNy;
    
    if (dot > 0.3) {
      vertex.deformation -= deformAmount * dot;
      vertex.deformation = Math.max(-cfg.maxDeformation, vertex.deformation);
    }
  }
}

export function beginGrab(
  state: SimulationState,
  x: number,
  y: number,
  pointerId: number = 0
): boolean {
  const idx = findOrganismAtPoint(state, x, y);
  if (idx === null) return false;
  
  const org = state.organisms[idx];
  org.grab.isGrabbed = true;
  org.grab.pointerId = pointerId;
  org.grab.offsetX = org.x - x;
  org.grab.offsetY = org.y - y;
  org.grab.springVx = 0;
  org.grab.springVy = 0;
  
  org.vx = 0;
  org.vy = 0;
  
  state.grabbedOrganismIndex = idx;
  return true;
}

export function endGrab(state: SimulationState): void {
  const grabbedIdx = state.grabbedOrganismIndex;
  if (grabbedIdx === null) return;
  
  const org = state.organisms[grabbedIdx];
  org.grab.isGrabbed = false;
  org.grab.pointerId = null;
  
  org.vx += org.grab.springVx * 0.8;
  org.vy += org.grab.springVy * 0.8;
  
  state.grabbedOrganismIndex = null;
}

export function updatePointer(
  state: SimulationState,
  x: number,
  y: number,
  isActive: boolean
): void {
  const prevX = state.pointer.x;
  const prevY = state.pointer.y;
  
  state.pointer.x = x;
  state.pointer.y = y;
  state.pointer.isActive = isActive;
  state.pointer.velocity.x = x - prevX;
  state.pointer.velocity.y = y - prevY;
}
