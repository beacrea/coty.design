export interface WorldConfig {
  organismCount: number;
  minSize: number;
  maxSize: number;
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
  minSpeed: 0.08,
  maxSpeed: 0.3,
  connectionDistance: 200,
  mergeDistance: 70,
  minStartVertices: 3,
  maxStartVertices: 5,
  maxVertices: 8,
  evolutionInterval: 4000,
  evolutionChance: 0.06,
  interactionChance: 0.18,
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
