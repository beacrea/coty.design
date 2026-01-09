import type { OrganismData, RenderContext, OrganelleType } from '../types';
import { getWorldVertices, getBoundingRadius } from '../state';

const ORGANELLE_COLORS: Record<OrganelleType, { h: number; s: number }> = {
  nucleus: { h: 280, s: 50 },
  mitochondria: { h: 15, s: 70 },
  vacuole: { h: 200, s: 40 },
  chloroplast: { h: 120, s: 60 },
  ribosome: { h: 60, s: 50 },
};

function getColor(
  strokeColor: string,
  alpha: number,
  observationMode: boolean,
  isDark: boolean,
  hue: number,
  depth: number
): string {
  if (observationMode) {
    let saturation: number, lightness: number;
    if (isDark) {
      saturation = 70 + depth * 20;
      lightness = 62 + depth * 20;
    } else {
      saturation = 70 + depth * 20;
      lightness = 18 + depth * 12;
    }
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }
  return `rgba(${strokeColor}, ${alpha})`;
}

interface Point3D { x: number; y: number; z: number }

function transform3D(p: Point3D, yaw: number, pitch: number, roll: number, perspective: number = 0.003): Point3D {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosRoll = Math.cos(roll);
  const sinRoll = Math.sin(roll);
  
  let { x, y, z } = p;
  
  const x1 = x * cosYaw - y * sinYaw;
  const y1 = x * sinYaw + y * cosYaw;
  
  const y2 = y1 * cosPitch - z * sinPitch;
  const z2 = y1 * sinPitch + z * cosPitch;
  
  const x3 = x1 * cosRoll + z2 * sinRoll;
  const z3 = -x1 * sinRoll + z2 * cosRoll;
  
  const scale = 1 / (1 + z3 * perspective);
  
  return { x: x3 * scale, y: y2 * scale, z: z3 };
}

function getLocalVertices3D(org: OrganismData): Point3D[] {
  return org.vertices.map((v) => {
    const localX = Math.cos(v.angle) * v.distance * org.size;
    const localY = Math.sin(v.angle) * v.distance * org.size;
    return transform3D({ x: localX, y: localY, z: 0 }, org.rotation, org.pitch, org.roll);
  });
}

export function drawOrganism(
  ctx: CanvasRenderingContext2D,
  org: OrganismData,
  strokeColor: string,
  lineAlpha: number,
  vertexAlpha: number,
  observationMode: boolean,
  isDark: boolean
): void {
  const localVerts = getLocalVertices3D(org);
  
  const getOrgColor = (alpha: number): string => 
    getColor(strokeColor, alpha, observationMode, isDark, org.hue, org.depth);
  
  const strokeWidth = observationMode ? 1.4 : 1;
  const lobeStrokeWidth = observationMode ? 1.0 : 0.8;
  const vertexRadius = observationMode ? 2.2 : 2;
  const lobeVertexRadius = observationMode ? 1.7 : 1.5;
  
  ctx.save();
  ctx.translate(org.x, org.y);
  
  if (org.hoverIntensity > 0.05) {
    const hoverScale = 1 + org.hoverIntensity * 0.08;
    ctx.scale(hoverScale, hoverScale);
  }
  
  const effectiveGlow = Math.max(org.glow, org.hoverIntensity * 0.3);
  if (effectiveGlow > 0.05 && observationMode) {
    const clampedGlow = Math.min(effectiveGlow, 0.5);
    const glowRadius = getBoundingRadius(org) * (1.1 + clampedGlow * 0.3);
    const glowAlpha = clampedGlow * 0.15;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
    gradient.addColorStop(0, getOrgColor(glowAlpha));
    gradient.addColorStop(1, getOrgColor(0));
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  if (org.vertices.length >= 4 && org.spokeIntensity > 0) {
    const spokeAlpha = lineAlpha * org.spokeIntensity * 0.4;
    ctx.strokeStyle = getOrgColor(spokeAlpha);
    ctx.lineWidth = 0.5;
    for (let i = 0; i < Math.floor(org.vertices.length / 2); i++) {
      const oppositeIdx = (i + Math.floor(org.vertices.length / 2)) % org.vertices.length;
      ctx.beginPath();
      ctx.moveTo(localVerts[i].x, localVerts[i].y);
      ctx.lineTo(localVerts[oppositeIdx].x, localVerts[oppositeIdx].y);
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.moveTo(localVerts[0].x, localVerts[0].y);
  for (let i = 1; i < localVerts.length; i++) {
    ctx.lineTo(localVerts[i].x, localVerts[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = getOrgColor(lineAlpha);
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  localVerts.forEach((v) => {
    ctx.beginPath();
    ctx.arc(v.x, v.y, vertexRadius, 0, Math.PI * 2);
    ctx.fillStyle = getOrgColor(vertexAlpha * 2);
    ctx.fill();
  });

  org.lobes.forEach((lobe) => {
    const lobeAngle = lobe.offsetAngle;
    const lobeCenterLocal = {
      x: Math.cos(lobeAngle) * org.size * lobe.offsetDistance,
      y: Math.sin(lobeAngle) * org.size * lobe.offsetDistance,
      z: 0
    };
    const lobeCenter = transform3D(lobeCenterLocal, org.rotation, org.pitch, org.roll);
    const lobeRotation = lobe.rotationOffset;
    const lobeSize = org.size * lobe.size;
    
    const lobeVerts = lobe.vertices.map((v) => {
      const x = lobeCenterLocal.x + Math.cos(v.angle + lobeRotation) * v.distance * lobeSize;
      const y = lobeCenterLocal.y + Math.sin(v.angle + lobeRotation) * v.distance * lobeSize;
      return transform3D({ x, y, z: 0 }, org.rotation, org.pitch, org.roll);
    });
    
    ctx.beginPath();
    ctx.moveTo(lobeVerts[0].x, lobeVerts[0].y);
    for (let i = 1; i < lobeVerts.length; i++) {
      ctx.lineTo(lobeVerts[i].x, lobeVerts[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = getOrgColor(lineAlpha * 0.8);
    ctx.lineWidth = lobeStrokeWidth;
    ctx.stroke();
    
    lobeVerts.forEach((v) => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, lobeVertexRadius, 0, Math.PI * 2);
      ctx.fillStyle = getOrgColor(vertexAlpha * 1.5);
      ctx.fill();
    });
    
    const nearestMainVert = localVerts.reduce((nearest, v) => {
      const d = Math.hypot(v.x - lobeCenter.x, v.y - lobeCenter.y);
      return d < nearest.dist ? { v, dist: d } : nearest;
    }, { v: localVerts[0], dist: Infinity });
    
    ctx.beginPath();
    ctx.moveTo(nearestMainVert.v.x, nearestMainVert.v.y);
    ctx.lineTo(lobeCenter.x, lobeCenter.y);
    ctx.strokeStyle = getOrgColor(lineAlpha * 0.5);
    ctx.lineWidth = 0.6;
    ctx.stroke();
  });

  if (org.tendril && org.tendril.length > 0) {
    const dx = org.tendril.targetX - org.x;
    const dy = org.tendril.targetY - org.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= 0.1) {
      const nx = dx / dist;
      const ny = dy / dist;
      
      const endX = nx * org.tendril.length;
      const endY = ny * org.tendril.length;
      const end = transform3D({ x: endX, y: endY, z: 0 }, 0, org.pitch, org.roll);
      const ctrlX = endX / 2 + org.tendril.curveOffset * -ny;
      const ctrlY = endY / 2 + org.tendril.curveOffset * nx;
      const ctrl = transform3D({ x: ctrlX, y: ctrlY, z: 0 }, 0, org.pitch, org.roll);
      
      const tendrilAlpha = lineAlpha * (org.tendril.length / org.tendril.maxLength) * 0.7;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
      ctx.strokeStyle = getOrgColor(tendrilAlpha);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(end.x, end.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = getOrgColor(tendrilAlpha);
      ctx.fill();
    }
  }
  
  if (observationMode && org.organelles.length > 0) {
    drawOrganellesLocal(ctx, org, lineAlpha, isDark);
  }
  
  ctx.restore();
}

function drawOrganellesLocal(
  ctx: CanvasRenderingContext2D,
  org: OrganismData,
  alpha: number,
  isDark: boolean
): void {
  for (const organelle of org.organelles) {
    const defaultColors = ORGANELLE_COLORS[organelle.type];
    const hue = organelle.customHue !== undefined ? organelle.customHue : defaultColors.h;
    const saturation = organelle.customHue !== undefined ? 70 : defaultColors.s;
    const pulse = Math.sin(organelle.pulsePhase) * 0.12 + 1;
    
    const localX = Math.cos(organelle.angle) * org.size * organelle.radiusRatio;
    const localY = Math.sin(organelle.angle) * org.size * organelle.radiusRatio;
    const pos = transform3D({ x: localX, y: localY, z: 0 }, org.rotation, org.pitch, org.roll);
    const size = org.size * organelle.sizeRatio * pulse;
    
    const lightness = isDark ? 60 + org.depth * 20 : 35 + org.depth * 15;
    const organelleAlpha = alpha * (0.5 + org.depth * 0.4);
    
    ctx.beginPath();
    
    if (organelle.type === 'nucleus') {
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    } else if (organelle.type === 'mitochondria') {
      ctx.ellipse(pos.x, pos.y, size * 1.5, size * 0.7, organelle.angle + org.rotation, 0, Math.PI * 2);
    } else if (organelle.type === 'vacuole') {
      ctx.arc(pos.x, pos.y, size * 1.2, 0, Math.PI * 2);
    } else if (organelle.type === 'chloroplast') {
      ctx.ellipse(pos.x, pos.y, size * 1.3, size * 0.6, organelle.angle + org.rotation + Math.PI / 4, 0, Math.PI * 2);
    } else {
      ctx.arc(pos.x, pos.y, size * 0.5, 0, Math.PI * 2);
    }
    
    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${organelleAlpha})`;
    ctx.fill();
    
    if (organelle.type === 'nucleus' || organelle.type === 'vacuole') {
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness - 10}%, ${organelleAlpha * 0.7})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    if (organelle.customHue !== undefined && size > 2) {
      ctx.beginPath();
      ctx.arc(pos.x - size * 0.2, pos.y - size * 0.2, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${saturation - 15}%, ${lightness + 15}%, ${organelleAlpha * 0.4})`;
      ctx.fill();
    }
  }
}

export function drawConnections(
  ctx: CanvasRenderingContext2D,
  organisms: OrganismData[],
  connectionDistance: number,
  strokeColor: string,
  baseAlpha: number
): void {
  for (let i = 0; i < organisms.length; i++) {
    for (let j = i + 1; j < organisms.length; j++) {
      const dx = organisms[i].x - organisms[j].x;
      const dy = organisms[i].y - organisms[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const alpha = (1 - distance / connectionDistance) * baseAlpha * 0.5;
        
        const vertsA = getWorldVertices(organisms[i]);
        const vertsB = getWorldVertices(organisms[j]);
        
        const closestA = vertsA.reduce((closest, v) => {
          const d = Math.sqrt((v.x - organisms[j].x) ** 2 + (v.y - organisms[j].y) ** 2);
          return d < closest.dist ? { v, dist: d } : closest;
        }, { v: vertsA[0], dist: Infinity });
        
        const closestB = vertsB.reduce((closest, v) => {
          const d = Math.sqrt((v.x - organisms[i].x) ** 2 + (v.y - organisms[i].y) ** 2);
          return d < closest.dist ? { v, dist: d } : closest;
        }, { v: vertsB[0], dist: Infinity });

        ctx.beginPath();
        ctx.moveTo(closestA.v.x, closestA.v.y);
        ctx.lineTo(closestB.v.x, closestB.v.y);
        ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}
