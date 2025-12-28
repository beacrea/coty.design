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

export function drawOrganism(
  ctx: CanvasRenderingContext2D,
  org: OrganismData,
  strokeColor: string,
  lineAlpha: number,
  vertexAlpha: number,
  observationMode: boolean,
  isDark: boolean
): void {
  const worldVerts = getWorldVertices(org);
  
  const getOrgColor = (alpha: number): string => 
    getColor(strokeColor, alpha, observationMode, isDark, org.hue, org.depth);
  
  const strokeWidth = observationMode ? 1.4 : 1;
  const lobeStrokeWidth = observationMode ? 1.0 : 0.8;
  const vertexRadius = observationMode ? 2.2 : 2;
  const lobeVertexRadius = observationMode ? 1.7 : 1.5;
  
  const effectiveGlow = Math.max(org.glow, org.hoverIntensity * 0.3);
  if (effectiveGlow > 0.05 && observationMode) {
    const clampedGlow = Math.min(effectiveGlow, 0.5);
    const glowRadius = getBoundingRadius(org) * (1.1 + clampedGlow * 0.3);
    const glowAlpha = clampedGlow * 0.15;
    const gradient = ctx.createRadialGradient(org.x, org.y, 0, org.x, org.y, glowRadius);
    gradient.addColorStop(0, getOrgColor(glowAlpha));
    gradient.addColorStop(1, getOrgColor(0));
    ctx.beginPath();
    ctx.arc(org.x, org.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  if (org.hoverIntensity > 0.05) {
    const hoverScale = 1 + org.hoverIntensity * 0.08;
    ctx.save();
    ctx.translate(org.x, org.y);
    ctx.scale(hoverScale, hoverScale);
    ctx.translate(-org.x, -org.y);
  }
  
  if (org.vertices.length >= 4 && org.spokeIntensity > 0) {
    const spokeAlpha = lineAlpha * org.spokeIntensity * 0.4;
    ctx.strokeStyle = getOrgColor(spokeAlpha);
    ctx.lineWidth = 0.5;
    for (let i = 0; i < Math.floor(org.vertices.length / 2); i++) {
      const oppositeIdx = (i + Math.floor(org.vertices.length / 2)) % org.vertices.length;
      ctx.beginPath();
      ctx.moveTo(worldVerts[i].x, worldVerts[i].y);
      ctx.lineTo(worldVerts[oppositeIdx].x, worldVerts[oppositeIdx].y);
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.moveTo(worldVerts[0].x, worldVerts[0].y);
  for (let i = 1; i < worldVerts.length; i++) {
    ctx.lineTo(worldVerts[i].x, worldVerts[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = getOrgColor(lineAlpha);
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  worldVerts.forEach((v) => {
    ctx.beginPath();
    ctx.arc(v.x, v.y, vertexRadius, 0, Math.PI * 2);
    ctx.fillStyle = getOrgColor(vertexAlpha * 2);
    ctx.fill();
  });

  org.lobes.forEach((lobe) => {
    const lobeAngle = org.rotation + lobe.offsetAngle;
    const lobeCenterX = org.x + Math.cos(lobeAngle) * org.size * lobe.offsetDistance;
    const lobeCenterY = org.y + Math.sin(lobeAngle) * org.size * lobe.offsetDistance;
    const lobeRotation = org.rotation + lobe.rotationOffset;
    const lobeSize = org.size * lobe.size;
    
    const lobeVerts = lobe.vertices.map((v) => ({
      x: lobeCenterX + Math.cos(v.angle + lobeRotation) * v.distance * lobeSize,
      y: lobeCenterY + Math.sin(v.angle + lobeRotation) * v.distance * lobeSize,
    }));
    
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
    
    const nearestMainVert = worldVerts.reduce((nearest, v) => {
      const d = Math.hypot(v.x - lobeCenterX, v.y - lobeCenterY);
      return d < nearest.dist ? { v, dist: d } : nearest;
    }, { v: worldVerts[0], dist: Infinity });
    
    ctx.beginPath();
    ctx.moveTo(nearestMainVert.v.x, nearestMainVert.v.y);
    ctx.lineTo(lobeCenterX, lobeCenterY);
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
      
      const endX = org.x + nx * org.tendril.length;
      const endY = org.y + ny * org.tendril.length;
      const ctrlX = (org.x + endX) / 2 + org.tendril.curveOffset * -ny;
      const ctrlY = (org.y + endY) / 2 + org.tendril.curveOffset * nx;
      
      const tendrilAlpha = lineAlpha * (org.tendril.length / org.tendril.maxLength) * 0.7;
      ctx.beginPath();
      ctx.moveTo(org.x, org.y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
      ctx.strokeStyle = getOrgColor(tendrilAlpha);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = getOrgColor(tendrilAlpha);
      ctx.fill();
    }
  }
  
  if (observationMode && org.organelles.length > 0) {
    drawOrganelles(ctx, org, lineAlpha, isDark);
  }
  
  if (org.hoverIntensity > 0.05) {
    ctx.restore();
  }
}

function drawOrganelles(
  ctx: CanvasRenderingContext2D,
  org: OrganismData,
  alpha: number,
  isDark: boolean
): void {
  for (const organelle of org.organelles) {
    const colors = ORGANELLE_COLORS[organelle.type];
    const pulse = Math.sin(organelle.pulsePhase) * 0.1 + 1;
    
    const x = org.x + Math.cos(organelle.angle + org.rotation) * org.size * organelle.radiusRatio;
    const y = org.y + Math.sin(organelle.angle + org.rotation) * org.size * organelle.radiusRatio;
    const size = org.size * organelle.sizeRatio * pulse;
    
    const lightness = isDark ? 60 + org.depth * 20 : 35 + org.depth * 15;
    const organelleAlpha = alpha * (0.4 + org.depth * 0.4);
    
    ctx.beginPath();
    
    if (organelle.type === 'nucleus') {
      ctx.arc(x, y, size, 0, Math.PI * 2);
    } else if (organelle.type === 'mitochondria') {
      ctx.ellipse(x, y, size * 1.5, size * 0.7, organelle.angle + org.rotation, 0, Math.PI * 2);
    } else if (organelle.type === 'vacuole') {
      ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
    } else if (organelle.type === 'chloroplast') {
      ctx.ellipse(x, y, size * 1.3, size * 0.6, organelle.angle + org.rotation + Math.PI / 4, 0, Math.PI * 2);
    } else {
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    }
    
    ctx.fillStyle = `hsla(${colors.h}, ${colors.s}%, ${lightness}%, ${organelleAlpha})`;
    ctx.fill();
    
    if (organelle.type === 'nucleus' || organelle.type === 'vacuole') {
      ctx.strokeStyle = `hsla(${colors.h}, ${colors.s}%, ${lightness - 10}%, ${organelleAlpha * 0.7})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
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
