export interface Vertex {
  angle: number;
  distance: number;
  baseDistance: number;
  deformation: number;
}

export type OrganelleType = 'nucleus' | 'mitochondria' | 'vacuole' | 'chloroplast' | 'ribosome';

export interface Organelle {
  type: OrganelleType;
  radiusRatio: number;
  angle: number;
  sizeRatio: number;
  rotationSpeed: number;
  pulsePhase: number;
}

export interface GrabState {
  isGrabbed: boolean;
  isDragging: boolean;
  pointerId: number | null;
  offsetX: number;
  offsetY: number;
  springVx: number;
  springVy: number;
}

export interface PointerState {
  x: number;
  y: number;
  isActive: boolean;
  velocity: { x: number; y: number };
}

export interface Tendril {
  targetX: number;
  targetY: number;
  length: number;
  maxLength: number;
  curveOffset: number;
  decaying: boolean;
}

export interface Lobe {
  offsetAngle: number;
  offsetDistance: number;
  vertices: Vertex[];
  size: number;
  rotationOffset: number;
}

export interface OrganismData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vertices: Vertex[];
  rotation: number;
  rotationSpeed: number;
  size: number;
  age: number;
  tendril: Tendril | null;
  spokeIntensity: number;
  lobes: Lobe[];
  wanderAngle: number;
  wanderRate: number;
  baseSpeed: number;
  idlePhase: number;
  idlePauseTimer: number;
  isPaused: boolean;
  decayRate: number;
  minSize: number;
  maxSize: number;
  stabilizing: number;
  glow: number;
  depth: number;
  hue: number;
  organelles: Organelle[];
  grab: GrabState;
  hoverIntensity: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  depth: number;
}

export interface ChainLink {
  orgAIndex: number;
  orgBIndex: number;
  strength: number;
  age: number;
  maxAge: number;
}

export interface FoodSource {
  x: number;
  y: number;
  active: boolean;
  respawnAt: number;
  pulsePhase: number;
}

export interface SpatialCell {
  organismIndices: number[];
}

export interface SpatialHash {
  cells: Map<string, SpatialCell>;
  cellSize: number;
}

export interface SimulationState {
  organisms: OrganismData[];
  particles: Particle[];
  chainLinks: ChainLink[];
  foodSources: FoodSource[];
  lastEvolutionTime: number;
  lastFoodSpawnTime: number;
  currentTime: number;
  width: number;
  height: number;
  birthAccumulator: number;
  deathMultiplier: number;
  pointer: PointerState;
  hoveredOrganismIndex: number | null;
  grabbedOrganismIndex: number | null;
  spatialHash: SpatialHash;
}

export interface SimulationConfig {
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

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  strokeColor: string;
  lineAlpha: number;
  vertexAlpha: number;
  isDark: boolean;
  observationMode: boolean;
}
