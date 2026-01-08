import type { SimulationState, SimulationConfig, OrganismData } from './types';
import { createSimulationState, createOrganism, isOrganismDead } from './state';
import { updateOrganismMovement, updateTendril, enforceMaxBounds, clampSpeed } from './systems/movement';
import { applyFlocking, applyCollisionSeparation } from './systems/flocking';
import { applyProximityInteractions } from './systems/interactions';
import { updateParticles, spawnParticles, spawnAmbientBubbles, spawnBubbleStream, initializeAmbientBubbles } from './systems/particles';
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
    initializeAmbientBubbles(this.state.particles, width, height, 100);
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
    
    applyFlocking(organisms, cfg, this.state.grabbedOrganismIndex ?? -1);
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
    
    const time = this.state.currentTime;
    const baseLightness = isDark ? 6 : 98;
    ctx.fillStyle = isDark ? '#0a0c10' : '#f8fbff';
    ctx.fillRect(0, 0, width, height);
    
    this.drawAuroraBackground(ctx, width, height, time, isDark);
    
    drawFoodSources(ctx, foodSources, cfg, strokeColor, lineAlpha, isDark, observationMode);
    
    for (const org of organisms) {
      drawOrganism(ctx, org, strokeColor, lineAlpha, vertexAlpha, observationMode, isDark);
    }
    
    drawConnections(ctx, organisms, cfg.connectionDistance, strokeColor, lineAlpha);
    drawChainLinks(ctx, chainLinks, organisms, strokeColor, lineAlpha);
    drawParticles(ctx, particles, strokeColor, lineAlpha, isDark, observationMode);
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
  
  private drawAuroraBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isDark: boolean
  ): void {
    const bandCount = 3;
    const baseAlpha = isDark ? 0.08 : 0.04;
    
    for (let i = 0; i < bandCount; i++) {
      const bandOffset = i * 0.33;
      const speed = 0.000025 + i * 0.000008;
      const ySpeed = 0.000018 + i * 0.000006;
      
      const xDrift = Math.sin(time * speed + bandOffset * Math.PI * 2) * width * 0.25;
      const yDrift = Math.cos(time * ySpeed + bandOffset * Math.PI) * height * 0.12;
      
      const hue1 = isDark 
        ? 180 + Math.sin(time * 0.00003 + i * 1.2) * 50
        : 200 + Math.sin(time * 0.00003 + i * 1.2) * 30;
      const hue2 = isDark
        ? 220 + Math.cos(time * 0.000025 + i * 0.8) * 40
        : 210 + Math.cos(time * 0.000025 + i * 0.8) * 25;
      
      const centerX = width * (0.25 + bandOffset * 0.5) + xDrift;
      const centerY = height * (0.35 + i * 0.18) + yDrift;
      const radiusX = width * (0.45 + Math.sin(time * 0.000015 + i) * 0.15);
      const radiusY = height * (0.35 + Math.cos(time * 0.00002 + i) * 0.12);
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.max(radiusX, radiusY)
      );
      
      const saturation = isDark ? 55 : 35;
      const lightness = isDark ? 45 : 70;
      const alpha1 = baseAlpha * (0.7 + Math.sin(time * 0.00005 + i * 2) * 0.3);
      const alpha2 = baseAlpha * 0.4;
      
      gradient.addColorStop(0, `hsla(${hue1}, ${saturation}%, ${lightness}%, ${alpha1})`);
      gradient.addColorStop(0.4, `hsla(${hue2}, ${saturation - 5}%, ${lightness + 5}%, ${alpha2})`);
      gradient.addColorStop(0.7, `hsla(${hue1}, ${saturation - 10}%, ${lightness + 8}%, ${alpha2 * 0.3})`);
      gradient.addColorStop(1, `hsla(${hue1}, ${saturation}%, ${lightness}%, 0)`);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(radiusX / Math.max(radiusX, radiusY), radiusY / Math.max(radiusX, radiusY));
      ctx.translate(-centerX, -centerY);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.max(radiusX, radiusY), 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
    
    for (let i = 0; i < 2; i++) {
      const flowTime = time * (0.00006 + i * 0.000015);
      const flowY = height * (0.25 + i * 0.4) + Math.sin(flowTime) * height * 0.08;
      const flowHue = isDark 
        ? 190 + Math.sin(flowTime * 1.2 + i) * 25
        : 200 + Math.sin(flowTime * 1.2 + i) * 15;
      
      ctx.beginPath();
      ctx.moveTo(0, flowY);
      
      for (let x = 0; x <= width; x += 25) {
        const waveY = flowY + 
          Math.sin(x * 0.0025 + flowTime * 1.5) * 20 +
          Math.sin(x * 0.005 + flowTime * 1.2) * 10 +
          Math.cos(x * 0.0015 + flowTime * 0.8) * 15;
        ctx.lineTo(x, waveY);
      }
      
      ctx.lineTo(width, flowY + 50);
      ctx.lineTo(0, flowY + 50);
      ctx.closePath();
      
      const streamGradient = ctx.createLinearGradient(0, flowY - 25, 0, flowY + 50);
      const streamAlpha = isDark ? 0.025 : 0.015;
      const streamLightness = isDark ? 50 : 75;
      streamGradient.addColorStop(0, `hsla(${flowHue}, 50%, ${streamLightness}%, 0)`);
      streamGradient.addColorStop(0.35, `hsla(${flowHue}, 55%, ${streamLightness}%, ${streamAlpha})`);
      streamGradient.addColorStop(0.65, `hsla(${flowHue + 15}, 50%, ${streamLightness + 5}%, ${streamAlpha * 0.6})`);
      streamGradient.addColorStop(1, `hsla(${flowHue}, 45%, ${streamLightness}%, 0)`);
      
      ctx.fillStyle = streamGradient;
      ctx.fill();
    }
  }
}
