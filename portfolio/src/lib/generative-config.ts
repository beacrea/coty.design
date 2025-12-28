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
  lineOpacity: {
    light: number;
    dark: number;
  };
  vertexOpacity: {
    light: number;
    dark: number;
  };
  strokeColor: {
    light: string;
    dark: string;
  };
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
  lineOpacity: {
    light: 0.06,
    dark: 0.08,
  },
  vertexOpacity: {
    light: 0.04,
    dark: 0.06,
  },
  strokeColor: {
    light: '0, 0, 0',
    dark: '255, 255, 255',
  },
};
