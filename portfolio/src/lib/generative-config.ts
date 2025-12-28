export interface OrganismConfig {
  count: number;
  minSize: number;
  maxSize: number;
  sizeVariation: number;
  minStartVertices: number;
  maxStartVertices: number;
  maxVertices: number;
}

export interface MovementConfig {
  minSpeed: number;
  maxSpeed: number;
  connectionDistance: number;
  mergeDistance: number;
}

export interface EvolutionConfig {
  interval: number;
  chance: number;
  interactionChance: number;
}

export interface FoodConfig {
  sourceCount: number;
  attractionStrength: number;
  size: number;
  respawnTime: number;
  spawnInterval: number;
  maxSources: number;
}

export interface VisualConfig {
  lineContrast: { light: number; dark: number };
  vertexContrast: { light: number; dark: number };
}

export interface PoolingConfig {
  maxParticles: number;
  maxParticlePool: number;
  maxChainLinks: number;
  maxChainLinkPool: number;
}

export interface PopulationConfig {
  target: number;
  aggressiveness: number;
  densityPerPixel: number;
  minTarget: number;
  maxTarget: number;
}

export interface OrganelleConfig {
  spawnChance: number;
  maxPerOrganism: number;
  foodGrantChance: number;
  mergeTransferChance: number;
  types: {
    nucleus: { weight: number; speedMod: number; decayMod: number; glowMod: number };
    mitochondria: { weight: number; speedMod: number; decayMod: number; glowMod: number };
    vacuole: { weight: number; speedMod: number; decayMod: number; glowMod: number };
    chloroplast: { weight: number; speedMod: number; decayMod: number; glowMod: number };
    ribosome: { weight: number; speedMod: number; decayMod: number; glowMod: number };
  };
}

export interface InteractionConfig {
  grabSpringStiffness: number;
  grabSpringDamping: number;
  softCollisionStrength: number;
  hoverEaseSpeed: number;
  deformationStiffness: number;
  deformationDamping: number;
  maxDeformation: number;
}

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
  lineContrast: { light: number; dark: number };
  vertexContrast: { light: number; dark: number };
  populationTarget: number;
  populationAggressiveness: number;
  populationDensityPerPixel: number;
  populationMinTarget: number;
  populationMaxTarget: number;
  organelleSpawnChance: number;
  organelleMaxPerOrganism: number;
  organelleFoodGrantChance: number;
  organelleMergeTransferChance: number;
  grabSpringStiffness: number;
  grabSpringDamping: number;
  softCollisionStrength: number;
  hoverEaseSpeed: number;
  deformationStiffness: number;
  deformationDamping: number;
  maxDeformation: number;
}

export interface StructuredConfig {
  organism: OrganismConfig;
  movement: MovementConfig;
  evolution: EvolutionConfig;
  food: FoodConfig;
  visual: VisualConfig;
  pooling: PoolingConfig;
  population: PopulationConfig;
  organelles: OrganelleConfig;
  interaction: InteractionConfig;
}

function contrastToAlpha(contrastRatio: number): number {
  const targetContrast = Math.max(1, contrastRatio);
  const alpha = (targetContrast - 1) * 0.5;
  return Math.min(1, Math.max(0, alpha));
}

export function getAlphaFromContrast(contrast: number): number {
  return contrastToAlpha(contrast);
}

export const defaultStructuredConfig: StructuredConfig = {
  organism: {
    count: 16,
    minSize: 8,
    maxSize: 28,
    sizeVariation: 0.35,
    minStartVertices: 3,
    maxStartVertices: 5,
    maxVertices: 8,
  },
  movement: {
    minSpeed: 0.01,
    maxSpeed: 0.04,
    connectionDistance: 150,
    mergeDistance: 55,
  },
  evolution: {
    interval: 2500,
    chance: 0.15,
    interactionChance: 0.65,
  },
  food: {
    sourceCount: 3,
    attractionStrength: 0.015,
    size: 3,
    respawnTime: 4000,
    spawnInterval: 3000,
    maxSources: 6,
  },
  visual: {
    lineContrast: { light: 1.08, dark: 1.12 },
    vertexContrast: { light: 1.06, dark: 1.1 },
  },
  pooling: {
    maxParticles: 80,
    maxParticlePool: 200,
    maxChainLinks: 20,
    maxChainLinkPool: 50,
  },
  population: {
    target: 20,
    aggressiveness: 0.5,
    densityPerPixel: 50000,
    minTarget: 12,
    maxTarget: 50,
  },
  organelles: {
    spawnChance: 0.25,
    maxPerOrganism: 5,
    foodGrantChance: 0.12,
    mergeTransferChance: 0.6,
    types: {
      nucleus: { weight: 0.18, speedMod: 0, decayMod: -0.15, glowMod: 0.12 },
      mitochondria: { weight: 0.28, speedMod: 0.12, decayMod: 0, glowMod: 0 },
      vacuole: { weight: 0.22, speedMod: -0.03, decayMod: -0.25, glowMod: 0 },
      chloroplast: { weight: 0.18, speedMod: 0, decayMod: 0, glowMod: 0.2 },
      ribosome: { weight: 0.14, speedMod: 0.04, decayMod: 0, glowMod: 0 },
    },
  },
  interaction: {
    grabSpringStiffness: 0.12,
    grabSpringDamping: 0.88,
    softCollisionStrength: 0.5,
    hoverEaseSpeed: 0.08,
    deformationStiffness: 0.15,
    deformationDamping: 0.92,
    maxDeformation: 0.35,
  },
};

export function structuredToWorldConfig(structured: StructuredConfig): WorldConfig {
  return {
    organismCount: structured.organism.count,
    minSize: structured.organism.minSize,
    maxSize: structured.organism.maxSize,
    sizeVariation: structured.organism.sizeVariation,
    minStartVertices: structured.organism.minStartVertices,
    maxStartVertices: structured.organism.maxStartVertices,
    maxVertices: structured.organism.maxVertices,
    minSpeed: structured.movement.minSpeed,
    maxSpeed: structured.movement.maxSpeed,
    connectionDistance: structured.movement.connectionDistance,
    mergeDistance: structured.movement.mergeDistance,
    evolutionInterval: structured.evolution.interval,
    evolutionChance: structured.evolution.chance,
    interactionChance: structured.evolution.interactionChance,
    foodSourceCount: structured.food.sourceCount,
    foodAttractionStrength: structured.food.attractionStrength,
    foodSize: structured.food.size,
    foodRespawnTime: structured.food.respawnTime,
    foodSpawnInterval: structured.food.spawnInterval,
    maxFoodSources: structured.food.maxSources,
    lineContrast: structured.visual.lineContrast,
    vertexContrast: structured.visual.vertexContrast,
    populationTarget: structured.population.target,
    populationAggressiveness: structured.population.aggressiveness,
    populationDensityPerPixel: structured.population.densityPerPixel,
    populationMinTarget: structured.population.minTarget,
    populationMaxTarget: structured.population.maxTarget,
    organelleSpawnChance: structured.organelles.spawnChance,
    organelleMaxPerOrganism: structured.organelles.maxPerOrganism,
    organelleFoodGrantChance: structured.organelles.foodGrantChance,
    organelleMergeTransferChance: structured.organelles.mergeTransferChance,
    grabSpringStiffness: structured.interaction.grabSpringStiffness,
    grabSpringDamping: structured.interaction.grabSpringDamping,
    softCollisionStrength: structured.interaction.softCollisionStrength,
    hoverEaseSpeed: structured.interaction.hoverEaseSpeed,
    deformationStiffness: structured.interaction.deformationStiffness,
    deformationDamping: structured.interaction.deformationDamping,
    maxDeformation: structured.interaction.maxDeformation,
  };
}

export function worldConfigToStructured(config: WorldConfig): StructuredConfig {
  return {
    organism: {
      count: config.organismCount,
      minSize: config.minSize,
      maxSize: config.maxSize,
      sizeVariation: config.sizeVariation,
      minStartVertices: config.minStartVertices,
      maxStartVertices: config.maxStartVertices,
      maxVertices: config.maxVertices,
    },
    movement: {
      minSpeed: config.minSpeed,
      maxSpeed: config.maxSpeed,
      connectionDistance: config.connectionDistance,
      mergeDistance: config.mergeDistance,
    },
    evolution: {
      interval: config.evolutionInterval,
      chance: config.evolutionChance,
      interactionChance: config.interactionChance,
    },
    food: {
      sourceCount: config.foodSourceCount,
      attractionStrength: config.foodAttractionStrength,
      size: config.foodSize,
      respawnTime: config.foodRespawnTime,
      spawnInterval: config.foodSpawnInterval,
      maxSources: config.maxFoodSources,
    },
    visual: {
      lineContrast: config.lineContrast,
      vertexContrast: config.vertexContrast,
    },
    pooling: defaultStructuredConfig.pooling,
    population: {
      target: config.populationTarget,
      aggressiveness: config.populationAggressiveness,
      densityPerPixel: config.populationDensityPerPixel,
      minTarget: config.populationMinTarget,
      maxTarget: config.populationMaxTarget,
    },
    organelles: {
      spawnChance: config.organelleSpawnChance,
      maxPerOrganism: config.organelleMaxPerOrganism,
      foodGrantChance: config.organelleFoodGrantChance,
      mergeTransferChance: config.organelleMergeTransferChance,
      types: defaultStructuredConfig.organelles.types,
    },
    interaction: {
      grabSpringStiffness: config.grabSpringStiffness,
      grabSpringDamping: config.grabSpringDamping,
      softCollisionStrength: config.softCollisionStrength,
      hoverEaseSpeed: config.hoverEaseSpeed,
      deformationStiffness: config.deformationStiffness,
      deformationDamping: config.deformationDamping,
      maxDeformation: config.maxDeformation,
    },
  };
}

export const defaultWorldConfig: WorldConfig = structuredToWorldConfig(defaultStructuredConfig);
