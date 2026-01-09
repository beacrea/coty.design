import type { OrganismData, SimulationConfig } from '../types';

export function updateOrganismMovement(org: OrganismData, width: number, height: number, deathMultiplier: number = 1): void {
  org.idlePhase += 0.012;
  
  if (org.idlePauseTimer > 0) {
    org.idlePauseTimer--;
    if (org.idlePauseTimer === 0) {
      org.isPaused = false;
      org.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.4;
    }
  } else if (!org.isPaused && Math.random() < 0.0008) {
    org.isPaused = true;
    org.idlePauseTimer = 40 + Math.floor(Math.random() * 80);
  }
  
  org.wanderAngle += (Math.random() - 0.5) * org.wanderRate * 0.8;
  
  const breathe = Math.sin(org.idlePhase * 0.5) * 0.002;
  const bobX = Math.sin(org.idlePhase) * 0.0012 + breathe * Math.cos(org.wanderAngle);
  const bobY = Math.cos(org.idlePhase * 0.7) * 0.001 + breathe * Math.sin(org.wanderAngle);
  
  if (org.isPaused && Math.random() < 0.008) {
    org.vx += (Math.random() - 0.5) * 0.003;
    org.vy += (Math.random() - 0.5) * 0.003;
    org.rotationSpeed += (Math.random() - 0.5) * 0.001;
  }
  
  const pauseMultiplier = org.isPaused ? 0.2 : 1;
  const targetSpeed = org.baseSpeed * pauseMultiplier;
  
  const desiredVx = Math.cos(org.wanderAngle) * targetSpeed + bobX;
  const desiredVy = Math.sin(org.wanderAngle) * targetSpeed + bobY;
  
  const steerStrength = org.isPaused ? 0.008 : 0.015;
  org.vx += (desiredVx - org.vx) * steerStrength;
  org.vy += (desiredVy - org.vy) * steerStrength;
  
  const speed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
  if (speed > 0.005) {
    const movementAngle = Math.atan2(org.vy, org.vx);
    let angleDiff = movementAngle - org.rotation;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    const alignStrength = Math.min(0.015, 0.004 + speed * 0.004);
    org.rotationSpeed += angleDiff * alignStrength * 0.025;
    org.rotationSpeed = Math.max(-0.006, Math.min(0.006, org.rotationSpeed));
  }
  
  org.rotationSpeed *= 0.94;
  
  if (org.stabilizing > 0) {
    org.stabilizing--;
    org.rotationSpeed *= 0.85;
  }
  
  if (!Number.isFinite(org.vx)) org.vx = 0;
  if (!Number.isFinite(org.vy)) org.vy = 0;
  if (!Number.isFinite(org.rotationSpeed)) org.rotationSpeed = 0;
  
  org.x += org.vx;
  org.y += org.vy;
  org.rotation += org.rotationSpeed;
  org.age++;
  
  const breathePitch = Math.sin(org.idlePhase * 0.3) * 0.008;
  const breatheRoll = Math.cos(org.idlePhase * 0.25) * 0.006;
  const targetPitch = org.vy * 0.08 + breathePitch;
  const targetRoll = -org.vx * 0.08 + breatheRoll;
  
  org.pitchV += (targetPitch - org.pitchV) * 0.0012;
  org.rollV += (targetRoll - org.rollV) * 0.0012;
  
  org.pitchV *= 0.995;
  org.rollV *= 0.995;
  
  org.pitch += org.pitchV;
  org.roll += org.rollV;
  
  const maxAngle = 0.15;
  org.pitch = Math.max(-maxAngle, Math.min(maxAngle, org.pitch));
  org.roll = Math.max(-maxAngle, Math.min(maxAngle, org.roll));
  
  if (!Number.isFinite(org.pitch)) org.pitch = 0;
  if (!Number.isFinite(org.roll)) org.roll = 0;
  if (!Number.isFinite(org.pitchV)) org.pitchV = 0;
  if (!Number.isFinite(org.rollV)) org.rollV = 0;
  
  if (org.glow > 0) {
    org.glow *= 0.97;
    if (org.glow < 0.01) org.glow = 0;
  }
  
  const breatheSize = Math.sin(org.idlePhase * 0.4) * org.size * 0.008;
  org.size += breatheSize * 0.1;
  
  const sizeRatio = org.size / org.minSize;
  const sizeDecayMult = sizeRatio < 1.2 ? 2.0 : 1.0;
  org.size -= org.decayRate * sizeDecayMult * deathMultiplier;

  const margin = org.size;
  if (org.x < -margin) org.x = width + margin;
  if (org.x > width + margin) org.x = -margin;
  if (org.y < -margin) org.y = height + margin;
  if (org.y > height + margin) org.y = -margin;
}

export function updateTendril(org: OrganismData): void {
  if (!org.tendril) return;
  
  if (org.tendril.decaying) {
    org.tendril.length -= 0.8;
    if (org.tendril.length <= 0) {
      org.tendril = null;
    }
  } else {
    org.tendril.length = Math.min(org.tendril.length + 0.5, org.tendril.maxLength);
    if (org.tendril.length >= org.tendril.maxLength) {
      org.tendril.decaying = true;
    }
  }
}

export function enforceMaxBounds(org: OrganismData, maxBoundingRadius: number): void {
  let maxRadius = org.size;
  for (const lobe of org.lobes) {
    const lobeReach = org.size * lobe.offsetDistance + org.size * lobe.size;
    maxRadius = Math.max(maxRadius, lobeReach);
  }
  
  if (maxRadius > maxBoundingRadius) {
    const scale = maxBoundingRadius / maxRadius;
    org.size *= scale;
  }
}

export function clampSpeed(org: OrganismData, cfg: SimulationConfig): void {
  const maxSpeed = cfg.maxSpeed * 1.5;
  const minSpeedThreshold = cfg.minSpeed * 0.5;
  const speed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
  
  if (speed > maxSpeed) {
    org.vx = (org.vx / speed) * maxSpeed;
    org.vy = (org.vy / speed) * maxSpeed;
  }
  if (speed < minSpeedThreshold && speed > 0) {
    org.vx = (org.vx / speed) * minSpeedThreshold;
    org.vy = (org.vy / speed) * minSpeedThreshold;
  }
}
