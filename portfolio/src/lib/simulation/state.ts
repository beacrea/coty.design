import type { SimulationState, SimulationConfig, OrganismData, Particle, ChainLink, FoodSource, Vertex, Lobe } from './types';

const UNDERWATER_HUES = [180, 195, 210, 225, 240, 260, 280, 165];

export function createVertices(count: number): Vertex[] {
  const verts: Vertex[] = [];
  const shapeStyle = Math.random();
  
  for (let i = 0; i < count; i++) {
    const baseAngle = (Math.PI * 2 * i) / count;
    let angleJitter: number;
    let distanceVariation: number;
    
    if (shapeStyle < 0.3) {
      angleJitter = (Math.random() - 0.5) * 0.15;
      distanceVariation = 0.85 + Math.random() * 0.15;
    } else if (shapeStyle < 0.6) {
      angleJitter = (Math.random() - 0.5) * 0.5;
      distanceVariation = 0.5 + Math.random() * 0.5;
    } else {
      angleJitter = (Math.random() - 0.5) * 0.35;
      distanceVariation = 0.65 + Math.random() * 0.35;
    }
    
    verts.push({
      angle: baseAngle + angleJitter,
      distance: distanceVariation,
    });
  }
  return verts;
}

export function createLobe(cfg: SimulationConfig): Lobe {
  const lobeVertexCount = 3 + Math.floor(Math.random() * 2);
  const lobeSize = 0.2 + Math.random() * 0.3;
  return {
    offsetAngle: Math.random() * Math.PI * 2,
    offsetDistance: 0.5 + Math.random() * 0.35,
    vertices: createVertices(lobeVertexCount),
    size: lobeSize,
    rotationOffset: Math.random() * Math.PI * 2,
  };
}

export function createOrganism(x: number, y: number, cfg: SimulationConfig): OrganismData {
  const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed);
  const angle = Math.random() * Math.PI * 2;
  const baseSize = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
  const sizeMultiplier = 1 + (Math.random() - 0.5) * 2 * cfg.sizeVariation;
  const vertexRange = cfg.maxStartVertices - cfg.minStartVertices + 1;
  const startVertices = cfg.minStartVertices + Math.floor(Math.random() * vertexRange);
  
  const lobes: Lobe[] = [];
  if (Math.random() < 0.25) {
    const lobeCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < lobeCount; i++) {
      lobes.push(createLobe(cfg));
    }
  }

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    baseSpeed: speed,
    wanderAngle: angle,
    wanderRate: 0.004 + Math.random() * 0.008,
    idlePhase: Math.random() * Math.PI * 2,
    idlePauseTimer: 0,
    isPaused: false,
    decayRate: 0.001 + Math.random() * 0.002,
    minSize: cfg.minSize * 0.5,
    maxSize: cfg.maxSize * 1.2,
    size: Math.max(cfg.minSize * 0.5, Math.min(cfg.maxSize * 1.5, baseSize * sizeMultiplier)),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.001,
    age: 0,
    tendril: null,
    spokeIntensity: 0.3 + Math.random() * 0.4,
    stabilizing: 0,
    glow: 0,
    depth: Math.random(),
    hue: UNDERWATER_HUES[Math.floor(Math.random() * UNDERWATER_HUES.length)] + (Math.random() - 0.5) * 20,
    vertices: createVertices(startVertices),
    lobes,
  };
}

export function createFoodSource(width: number, height: number): FoodSource {
  return {
    x: 50 + Math.random() * (width - 100),
    y: 50 + Math.random() * (height - 100),
    active: true,
    respawnAt: 0,
    pulsePhase: Math.random() * Math.PI * 2,
  };
}

export function createSimulationState(width: number, height: number, cfg: SimulationConfig): SimulationState {
  const organisms: OrganismData[] = [];
  for (let i = 0; i < cfg.organismCount; i++) {
    organisms.push(createOrganism(
      Math.random() * width,
      Math.random() * height,
      cfg
    ));
  }

  const foodSources: FoodSource[] = [];
  for (let i = 0; i < cfg.foodSourceCount; i++) {
    foodSources.push(createFoodSource(width, height));
  }

  return {
    organisms,
    particles: [],
    chainLinks: [],
    foodSources,
    lastEvolutionTime: 0,
    lastFoodSpawnTime: 0,
    currentTime: 0,
    width,
    height,
  };
}

export function getBoundingRadius(org: OrganismData): number {
  let maxRadius = org.size;
  for (const lobe of org.lobes) {
    const lobeReach = org.size * lobe.offsetDistance + org.size * lobe.size;
    maxRadius = Math.max(maxRadius, lobeReach);
  }
  return maxRadius;
}

export function getWorldVertices(org: OrganismData): { x: number; y: number }[] {
  return org.vertices.map((v) => ({
    x: org.x + Math.cos(v.angle + org.rotation) * org.size * v.distance,
    y: org.y + Math.sin(v.angle + org.rotation) * org.size * v.distance,
  }));
}

export function isOrganismDead(org: OrganismData): boolean {
  return org.size < org.minSize * 0.8 || org.vertices.length < 3;
}
