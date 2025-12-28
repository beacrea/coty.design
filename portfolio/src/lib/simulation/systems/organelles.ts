import type { SimulationConfig, OrganismData, Organelle, OrganelleType } from '../types';
import { createOrganelle } from '../state';

const ORGANELLE_MODIFIERS: Record<OrganelleType, { speedMod: number; decayMod: number; glowMod: number }> = {
  nucleus: { speedMod: 0, decayMod: -0.2, glowMod: 0.1 },
  mitochondria: { speedMod: 0.15, decayMod: 0, glowMod: 0 },
  vacuole: { speedMod: -0.05, decayMod: -0.3, glowMod: 0 },
  chloroplast: { speedMod: 0, decayMod: 0, glowMod: 0.25 },
  ribosome: { speedMod: 0.05, decayMod: 0, glowMod: 0 },
};

export function updateOrganellePositions(organisms: OrganismData[], dt: number): void {
  for (const org of organisms) {
    for (const organelle of org.organelles) {
      organelle.angle += organelle.rotationSpeed * dt;
      organelle.pulsePhase += dt * 0.002;
    }
  }
}

export function getOrganelleModifiers(org: OrganismData): { speedMod: number; decayMod: number; glowMod: number } {
  let speedMod = 0;
  let decayMod = 0;
  let glowMod = 0;
  
  for (const organelle of org.organelles) {
    const mods = ORGANELLE_MODIFIERS[organelle.type];
    speedMod += mods.speedMod;
    decayMod += mods.decayMod;
    glowMod += mods.glowMod;
  }
  
  speedMod = Math.max(-0.5, Math.min(0.5, speedMod));
  decayMod = Math.max(-0.8, Math.min(0.5, decayMod));
  glowMod = Math.max(0, Math.min(1, glowMod));
  
  return { speedMod, decayMod, glowMod };
}

export function transferOrganelles(
  from: OrganismData,
  to: OrganismData,
  transferChance: number,
  maxOrganelles: number
): void {
  const toTransfer: Organelle[] = [];
  const remaining: Organelle[] = [];
  
  for (const organelle of from.organelles) {
    if (Math.random() < transferChance && to.organelles.length + toTransfer.length < maxOrganelles) {
      toTransfer.push({ ...organelle, angle: Math.random() * Math.PI * 2 });
    } else {
      remaining.push(organelle);
    }
  }
  
  from.organelles = remaining;
  to.organelles.push(...toTransfer);
}

export function grantOrganelleFromFood(
  org: OrganismData,
  grantChance: number,
  maxOrganelles: number
): boolean {
  if (org.organelles.length >= maxOrganelles) return false;
  if (Math.random() >= grantChance) return false;
  
  const preferredTypes: OrganelleType[] = ['chloroplast', 'mitochondria'];
  const type = preferredTypes[Math.floor(Math.random() * preferredTypes.length)];
  
  org.organelles.push(createOrganelle(type));
  return true;
}

export function mergeOrganelles(
  absorber: OrganismData,
  absorbed: OrganismData,
  transferChance: number,
  maxOrganelles: number
): void {
  for (const organelle of absorbed.organelles) {
    if (absorber.organelles.length >= maxOrganelles) break;
    if (Math.random() < transferChance) {
      absorber.organelles.push({
        ...organelle,
        angle: Math.random() * Math.PI * 2,
        radiusRatio: Math.min(0.7, organelle.radiusRatio + 0.1),
      });
    }
  }
}
