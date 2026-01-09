import type { FoodSource, OrganismData, SimulationConfig, SimulationState } from '../types';
import { createFoodSource } from '../state';
import { grantOrganelleFromFood } from './organelles';

export function updateFoodSources(
  state: SimulationState,
  cfg: SimulationConfig,
  timestamp: number
): void {
  const { foodSources, width, height } = state;
  
  for (const food of foodSources) {
    food.pulsePhase += 0.02;
    
    if (!food.active && timestamp > food.respawnAt) {
      food.x = 50 + Math.random() * (width - 100);
      food.y = 50 + Math.random() * (height - 100);
      food.active = true;
    }
  }
  
  if (timestamp - state.lastFoodSpawnTime > cfg.foodSpawnInterval && foodSources.length < cfg.maxFoodSources) {
    foodSources.push(createFoodSource(width, height));
    state.lastFoodSpawnTime = timestamp;
  }
}

export function applyFoodAttraction(
  organisms: OrganismData[],
  foodSources: FoodSource[],
  cfg: SimulationConfig,
  timestamp: number
): void {
  for (const org of organisms) {
    let nearestFood: FoodSource | null = null;
    let nearestDist = Infinity;
    
    for (const food of foodSources) {
      if (!food.active) continue;
      const dx = food.x - org.x;
      const dy = food.y - org.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestFood = food;
      }
    }
    
    if (nearestFood && nearestDist < cfg.connectionDistance * 2) {
      const dx = nearestFood.x - org.x;
      const dy = nearestFood.y - org.y;
      const nx = dx / nearestDist;
      const ny = dy / nearestDist;
      
      const attractionMult = 1 - nearestDist / (cfg.connectionDistance * 2);
      org.vx += nx * cfg.foodAttractionStrength * attractionMult;
      org.vy += ny * cfg.foodAttractionStrength * attractionMult;
      
      if (nearestDist < cfg.foodSize * 3) {
        org.size = Math.min(org.maxSize, org.size + 0.5);
        org.glow = Math.min(1, org.glow + 0.12);
        
        org.pitchV += (Math.random() - 0.5) * 0.05;
        org.rollV += (Math.random() - 0.5) * 0.05;
        
        if (org.vertices.length < cfg.maxVertices && Math.random() < 0.15) {
          const insertIndex = Math.floor(Math.random() * org.vertices.length);
          const nextIndex = (insertIndex + 1) % org.vertices.length;
          const angle1 = org.vertices[insertIndex].angle;
          const angle2 = org.vertices[nextIndex].angle;
          const x1 = Math.cos(angle1);
          const y1 = Math.sin(angle1);
          const x2 = Math.cos(angle2);
          const y2 = Math.sin(angle2);
          const midX = x1 + x2;
          const midY = y1 + y2;
          const newAngle = Math.atan2(midY, midX);
          const newDistance = 0.5 + Math.random() * 0.5;
          org.vertices.splice(insertIndex + 1, 0, { 
            angle: newAngle, 
            distance: newDistance,
            baseDistance: newDistance,
            deformation: 0
          });
          org.vertices.sort((a, b) => a.angle - b.angle);
        }
        
        if (org.irregularity !== undefined) {
          org.irregularity = Math.min(1.0, org.irregularity + 0.02);
        }
        
        grantOrganelleFromFood(org, cfg.organelleFoodGrantChance, cfg.organelleMaxPerOrganism, nearestFood.hue);
        
        nearestFood.active = false;
        nearestFood.respawnAt = timestamp + cfg.foodRespawnTime;
      }
    }
  }
}
