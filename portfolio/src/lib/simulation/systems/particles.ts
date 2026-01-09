import type { Particle, OrganismData, SimulationState } from '../types';
import { getBoundingRadius } from '../state';

export function getFlowField(x: number, y: number, time: number): { vx: number; vy: number } {
  const scale = 0.003;
  const noiseX = x * scale + time * 0.0001;
  const noiseY = y * scale + time * 0.0001;
  const angle = (Math.sin(noiseX * 2.5) + Math.cos(noiseY * 2.5) + Math.sin((noiseX + noiseY) * 1.5)) * Math.PI;
  const strength = 0.015;
  return {
    vx: Math.cos(angle) * strength,
    vy: Math.sin(angle) * strength,
  };
}

export function spawnParticles(
  particles: Particle[],
  x: number,
  y: number,
  baseVx: number,
  baseVy: number,
  count: number,
  depth: number = 0.5
): void {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.5;
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: baseVx * 0.3 + Math.cos(angle) * speed,
      vy: baseVy * 0.3 + Math.sin(angle) * speed,
      size: 0.5 + Math.random() * 1.3,
      life: 1,
      maxLife: 40 + Math.floor(Math.random() * 30),
      depth,
    });
  }
}

export function initializeAmbientBubbles(
  particles: Particle[],
  width: number,
  height: number,
  count: number = 60,
  currentTime: number = 0
): void {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    const sizeRoll = Math.random();
    let size: number;
    if (sizeRoll < 0.5) {
      size = 1.0 + Math.random() * 1.5;
    } else if (sizeRoll < 0.8) {
      size = 2.0 + Math.random() * 2.0;
    } else {
      size = 3.5 + Math.random() * 2.5;
    }
    
    const flow = getFlowField(x, y, currentTime);
    
    particles.push({
      x,
      y,
      vx: flow.vx * 1.2,
      vy: flow.vy * 1.2,
      size,
      life: 0.4 + Math.random() * 0.6,
      maxLife: 700 + Math.floor(Math.random() * 500),
      depth: 0.15 + Math.random() * 0.7,
      isBubble: true,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.015,
      fadeIn: Math.random() * 0.5,
    });
  }
}

export function spawnAmbientBubbles(
  particles: Particle[],
  width: number,
  height: number,
  maxParticles: number = 150,
  currentTime: number = 0
): void {
  if (particles.length >= maxParticles) return;
  
  if (Math.random() < 0.12) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    const sizeRoll = Math.random();
    let size: number;
    if (sizeRoll < 0.5) {
      size = 1.0 + Math.random() * 1.5;
    } else if (sizeRoll < 0.8) {
      size = 2.0 + Math.random() * 2.0;
    } else {
      size = 3.5 + Math.random() * 2.5;
    }
    
    const flow = getFlowField(x, y, currentTime);
    
    particles.push({
      x,
      y,
      vx: flow.vx * 1.5,
      vy: flow.vy * 1.5,
      size,
      life: 1,
      maxLife: 800 + Math.floor(Math.random() * 600),
      depth: 0.15 + Math.random() * 0.7,
      isBubble: true,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.015,
      fadeIn: 0,
    });
  }
}

export function spawnBubbleStream(
  particles: Particle[],
  org: OrganismData,
  maxParticles: number = 80
): void {
  if (particles.length >= maxParticles) return;
  
  const speed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
  if (speed < 0.015 || Math.random() > 0.25) return;
  
  const backAngle = Math.atan2(-org.vy, -org.vx);
  const emitDist = org.size * 0.6;
  const emitX = org.x + Math.cos(backAngle) * emitDist;
  const emitY = org.y + Math.sin(backAngle) * emitDist;
  
  const spreadAngle = backAngle + (Math.random() - 0.5) * 0.8;
  const bubbleSpeed = 0.15 + Math.random() * 0.2;
  const size = 0.8 + Math.random() * 1.0;
  
  particles.push({
    x: emitX,
    y: emitY,
    vx: Math.cos(spreadAngle) * bubbleSpeed,
    vy: Math.sin(spreadAngle) * bubbleSpeed,
    size,
    life: 1,
    maxLife: 40 + Math.floor(Math.random() * 30),
    depth: org.depth,
    isBubble: true,
    fadeIn: 0,
  });
}

export function updateParticles(
  state: SimulationState,
  currentTime: number
): void {
  const { particles, organisms, width, height } = state;
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    const flow = getFlowField(p.x, p.y, currentTime);
    
    if (p.isBubble) {
      p.vx += flow.vx * 0.4;
      p.vy += flow.vy * 0.4;
      
      if (Math.random() < 0.03) {
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
      }
      
      p.vx *= 0.99;
      p.vy *= 0.99;
    } else {
      p.vx += flow.vx * 0.15;
      p.vy += flow.vy * 0.15;
      p.vx *= 0.985;
      p.vy *= 0.985;
    }
    
    for (const org of organisms) {
      const dx = p.x - org.x;
      const dy = p.y - org.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pushRadius = getBoundingRadius(org) * 1.3;
      
      if (dist < pushRadius && dist > 0.1) {
        const overlap = pushRadius - dist;
        const pushStrength = (overlap / pushRadius) * (p.isBubble ? 0.12 : 0.08);
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += nx * pushStrength;
        p.vy += ny * pushStrength;
      }
    }
    
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1 / p.maxLife;
    
    if (p.fadeIn !== undefined && p.fadeIn < 1) {
      p.fadeIn = Math.min(1, p.fadeIn + 0.05);
    }
    
    if (p.life <= 0 || p.x < -30 || p.x > width + 30 || p.y < -50 || p.y > height + 50) {
      particles.splice(i, 1);
    }
  }
}
