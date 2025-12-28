export interface WorldConfig {
  organismCount: number;
  minSize: number;
  maxSize: number;
  sizeVariation: number;
  minSpeed: number;
  maxSpeed: number;
  connectionDistance: number;
  mergeDistance: number;
  minStartVertices: number;
  maxStartVertices: number;
  maxVertices: number;
  evolutionInterval: number;
  evolutionChance: number;
  interactionChance: number;
  foodSourceCount: number;
  foodAttractionStrength: number;
  foodSize: number;
  foodRespawnTime: number;
  lineContrast: {
    light: number;
    dark: number;
  };
  vertexContrast: {
    light: number;
    dark: number;
  };
  blur: number;
}

function contrastToAlpha(contrastRatio: number): number {
  const targetContrast = Math.max(1, contrastRatio);
  const alpha = (targetContrast - 1) * 0.5;
  return Math.min(1, Math.max(0, alpha));
}

export function getAlphaFromContrast(contrast: number): number {
  return contrastToAlpha(contrast);
}

export const defaultWorldConfig: WorldConfig = {
  organismCount: 16,
  minSize: 20,
  maxSize: 60,
  sizeVariation: 0.5,
  minSpeed: 0.08,
  maxSpeed: 0.3,
  connectionDistance: 200,
  mergeDistance: 80,
  minStartVertices: 3,
  maxStartVertices: 5,
  maxVertices: 8,
  evolutionInterval: 3500,
  evolutionChance: 0.08,
  interactionChance: 0.35,
  foodSourceCount: 4,
  foodAttractionStrength: 0.015,
  foodSize: 8,
  foodRespawnTime: 8000,
  lineContrast: {
    light: 1.15,
    dark: 1.2,
  },
  vertexContrast: {
    light: 1.1,
    dark: 1.15,
  },
  blur: 0,
};
