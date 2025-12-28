import type { FoodSource, OrganismData, SimulationConfig, SimulationState } from '../types';
import { createFoodSource } from '../state';

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
        org.glow = Math.min(1, org.glow + 0.3);
        nearestFood.active = false;
        nearestFood.respawnAt = timestamp + cfg.foodRespawnTime;
      }
    }
  }
}
