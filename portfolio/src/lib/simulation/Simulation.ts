import type { SimulationState, SimulationConfig, OrganismData } from './types';
import { createSimulationState, createOrganism, isOrganismDead } from './state';
import { updateOrganismMovement, updateTendril, enforceMaxBounds, clampSpeed } from './systems/movement';
import { applyFlocking, applyCollisionSeparation } from './systems/flocking';
import { applyProximityInteractions } from './systems/interactions';
import { updateParticles, spawnParticles, spawnAmbientBubbles, spawnBubbleStream } from './systems/particles';
import { updateFoodSources, applyFoodAttraction } from './systems/food';
import { createChainLink, updateChainLinks, remapChainLinkIndices } from './systems/chainlinks';
import { updateSpatialHash, updateHover, applyGrabSpringPhysics, applySoftBodyCollisions, beginGrab as beginGrabImpl, endGrab as endGrabImpl, updatePointer as updatePointerImpl, findOrganismAtPoint } from './systems/user-input';
import { updateDeformations } from './systems/deformation';
import { updateOrganellePositions } from './systems/organelles';
import { drawOrganism, drawConnections } from './renderers/organisms';
import { drawParticles } from './renderers/particles';
import { drawChainLinks } from './renderers/chainlinks';
import { drawFoodSources } from './renderers/food';
import { getAlphaFromContrast } from '../generative-config';

export class Simulation {
  private state: SimulationState;
  private config: SimulationConfig;
  
  constructor(width: number, height: number, config: SimulationConfig) {
    this.config = config;
    this.state = createSimulationState(width, height, config);
  }
  
  resize(newWidth: number, newHeight: number): void {
    const oldWidth = this.state.width;
    const oldHeight = this.state.height;
    
    if (oldWidth === newWidth && oldHeight === newHeight) {
      return;
    }
    
    const scaleX = oldWidth > 0 ? newWidth / oldWidth : 1;
    const scaleY = oldHeight > 0 ? newHeight / oldHeight : 1;
    
    this.state.width = newWidth;
    this.state.height = newHeight;
    
    for (const org of this.state.organisms) {
      org.x *= scaleX;
      org.y *= scaleY;
    }
    
    for (const particle of this.state.particles) {
      particle.x *= scaleX;
      particle.y *= scaleY;
    }
    
    for (const food of this.state.foodSources) {
      food.x = Math.max(50, Math.min(newWidth - 50, food.x * scaleX));
      food.y = Math.max(50, Math.min(newHeight - 50, food.y * scaleY));
    }
  }
  
  updateConfig(config: SimulationConfig): void {
    this.config = config;
  }
  
  tick(timestamp: number): void {
    this.state.currentTime = timestamp;
    const { organisms, particles, chainLinks, foodSources, width, height } = this.state;
    const cfg = this.config;
    
    updateSpatialHash(this.state);
    updateHover(this.state, cfg);
    applyGrabSpringPhysics(this.state, cfg);
    applySoftBodyCollisions(this.state, cfg);
    
    updateOrganellePositions(organisms, 1);
    updateDeformations(this.state, cfg);
    
    const target = cfg.populationTarget;
    const aggr = Math.max(0, Math.min(1, cfg.populationAggressiveness));
    const count = organisms.length;
    const error = target > 0 ? (target - count) / target : 0;
    
    const birthPressure = Math.max(0, error) * (0.4 + 1.6 * aggr);
    const deathPressure = Math.max(0, -error) * (0.3 + 1.7 * aggr);
    
    const targetDeathMult = 1 + deathPressure;
    this.state.deathMultiplier += (targetDeathMult - this.state.deathMultiplier) * 0.1;
    
    this.state.birthAccumulator += birthPressure;
    
    applyFlocking(organisms, cfg, this.state.grabbedOrganismIndex);
    applyCollisionSeparation(organisms);
    
    const interactionResult = applyProximityInteractions(organisms, cfg);
    
    for (const spawn of interactionResult.spawnParticlesAt) {
      spawnParticles(particles, spawn.x, spawn.y, spawn.vx, spawn.vy, spawn.count);
    }
    
    for (const link of interactionResult.createChainLinks) {
      createChainLink(chainLinks, link.orgAIndex, link.orgBIndex);
    }
    
    updateFoodSources(this.state, cfg, timestamp);
    applyFoodAttraction(organisms, foodSources, cfg, timestamp);
    
    if (timestamp - this.state.lastEvolutionTime > cfg.evolutionInterval) {
      const randomOrg = organisms[Math.floor(Math.random() * organisms.length)];
      if (randomOrg && Math.random() < cfg.evolutionChance) {
        if (randomOrg.vertices.length < cfg.maxVertices) {
          const insertIndex = Math.floor(Math.random() * randomOrg.vertices.length);
          const nextIndex = (insertIndex + 1) % randomOrg.vertices.length;
          const newAngle = (randomOrg.vertices[insertIndex].angle + randomOrg.vertices[nextIndex].angle) / 2;
          const newDistance = 0.7 + Math.random() * 0.3;
          randomOrg.vertices.splice(insertIndex + 1, 0, { 
            angle: newAngle, 
            distance: newDistance,
            baseDistance: newDistance,
            deformation: 0
          });
        }
      }
      this.state.lastEvolutionTime = timestamp;
    }
    
    spawnAmbientBubbles(particles, width, height);
    updateParticles(this.state, timestamp);
    updateChainLinks(chainLinks, organisms, cfg);
    
    const maxBoundingRadius = cfg.maxSize * 1.5;
    
    for (let i = organisms.length - 1; i >= 0; i--) {
      const org = organisms[i];
      updateOrganismMovement(org, width, height, this.state.deathMultiplier);
      updateTendril(org);
      enforceMaxBounds(org, maxBoundingRadius);
      clampSpeed(org, cfg);
      
      if (isOrganismDead(org)) {
        spawnParticles(particles, org.x, org.y, org.vx, org.vy, 8);
        organisms.splice(i, 1);
        remapChainLinkIndices(chainLinks, i);
        continue;
      }
      
      spawnBubbleStream(particles, org);
    }
    
    const spawnCount = Math.min(Math.floor(this.state.birthAccumulator), 3);
    this.state.birthAccumulator -= spawnCount;
    
    for (let s = 0; s < spawnCount; s++) {
      const edge = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if (edge === 0) {
        x = Math.random() * width;
        y = -20;
      } else if (edge === 1) {
        x = width + 20;
        y = Math.random() * height;
      } else if (edge === 2) {
        x = Math.random() * width;
        y = height + 20;
      } else {
        x = -20;
        y = Math.random() * height;
      }
      const newOrg = createOrganism(x, y, cfg);
      newOrg.glow = 0.15;
      organisms.push(newOrg);
    }
  }
  
  render(
    ctx: CanvasRenderingContext2D,
    isDark: boolean,
    observationMode: boolean = false,
    enhancedContrast: boolean = false
  ): void {
    const { organisms, particles, chainLinks, foodSources, width, height } = this.state;
    const cfg = this.config;
    
    const strokeColor = isDark ? '255, 255, 255' : '0, 0, 0';
    const contrastMultiplier = enhancedContrast ? 8 : 1;
    const lineContrast = isDark ? cfg.lineContrast.dark : cfg.lineContrast.light;
    const vertexContrast = isDark ? cfg.vertexContrast.dark : cfg.vertexContrast.light;
    const lineAlpha = Math.min(1, getAlphaFromContrast(lineContrast) * contrastMultiplier);
    const vertexAlpha = Math.min(1, getAlphaFromContrast(vertexContrast) * contrastMultiplier);
    
    ctx.clearRect(0, 0, width, height);
    
    drawFoodSources(ctx, foodSources, cfg, strokeColor, lineAlpha, isDark);
    
    for (const org of organisms) {
      drawOrganism(ctx, org, strokeColor, lineAlpha, vertexAlpha, observationMode, isDark);
    }
    
    drawConnections(ctx, organisms, cfg.connectionDistance, strokeColor, lineAlpha);
    drawChainLinks(ctx, chainLinks, organisms, strokeColor, lineAlpha);
    drawParticles(ctx, particles, strokeColor, lineAlpha);
  }
  
  getState(): SimulationState {
    return this.state;
  }
  
  getOrganismCount(): number {
    return this.state.organisms.length;
  }
  
  getParticleCount(): number {
    return this.state.particles.length;
  }
  
  beginGrab(x: number, y: number, pointerId: number = 0): boolean {
    return beginGrabImpl(this.state, x, y, pointerId);
  }
  
  endGrab(): void {
    endGrabImpl(this.state);
  }
  
  updatePointer(x: number, y: number, isActive: boolean): void {
    updatePointerImpl(this.state, x, y, isActive);
  }
  
  findNearestOrganism(x: number, y: number): number | null {
    return findOrganismAtPoint(this.state, x, y);
  }
  
  isGrabbing(): boolean {
    return this.state.grabbedOrganismIndex !== null;
  }
}
