export interface WorldConfig {
  organismCount: number;
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  connectionDistance: number;
  mergeDistance: number;
  maxVertices: number;
  evolutionInterval: number;
  evolutionChance: number;
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
  organismCount: 12,
  minSize: 20,
  maxSize: 60,
  minSpeed: 0.08,
  maxSpeed: 0.25,
  connectionDistance: 180,
  mergeDistance: 40,
  maxVertices: 7,
  evolutionInterval: 8000,
  evolutionChance: 0.02,
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
