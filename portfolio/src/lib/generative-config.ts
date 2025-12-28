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
  foodSpawnInterval: number;
  maxFoodSources: number;
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
  minSize: 8,
  maxSize: 28,
  sizeVariation: 0.35,
  minSpeed: 0.01,
  maxSpeed: 0.04,
  connectionDistance: 150,
  mergeDistance: 55,
  minStartVertices: 3,
  maxStartVertices: 5,
  maxVertices: 8,
  evolutionInterval: 2500,
  evolutionChance: 0.15,
  interactionChance: 0.65,
  foodSourceCount: 3,
  foodAttractionStrength: 0.015,
  foodSize: 3,
  foodRespawnTime: 4000,
  foodSpawnInterval: 3000,
  maxFoodSources: 6,
  lineContrast: {
    light: 1.08,
    dark: 1.12,
  },
  vertexContrast: {
    light: 1.06,
    dark: 1.1,
  },
  blur: 0,
};
