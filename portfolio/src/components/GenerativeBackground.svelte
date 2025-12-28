<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '../stores/theme';
  import { defaultWorldConfig, getAlphaFromContrast, type WorldConfig } from '../lib/generative-config';

  export let config: WorldConfig = defaultWorldConfig;
  export let enhancedContrast: boolean = false;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number;
  let organisms: Organism[] = [];
  let lastEvolutionTime = 0;
  let lastFoodSpawnTime = 0;
  let isVisible = true;
  let prefersReducedMotion = false;
  let dpr = 1;
  let logicalWidth = 0;
  let logicalHeight = 0;
  let adaptedConfig: WorldConfig;
  let motionQuery: MediaQueryList | null = null;
  let motionHandler: ((e: MediaQueryListEvent) => void) | null = null;

  interface Vertex {
    angle: number;
    distance: number;
  }

  interface Tendril {
    targetX: number;
    targetY: number;
    length: number;
    maxLength: number;
    curveOffset: number;
    decaying: boolean;
  }

  interface ChainLink {
    orgA: Organism;
    orgB: Organism;
    strength: number;
    age: number;
    maxAge: number;
  }

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    depth: number;
  }

  interface Lobe {
    offsetAngle: number;
    offsetDistance: number;
    vertices: Vertex[];
    size: number;
    rotationOffset: number;
  }

  interface FoodSource {
    x: number;
    y: number;
    active: boolean;
    respawnAt: number;
    pulsePhase: number;
  }

  let chainLinks: ChainLink[] = [];
  let particles: Particle[] = [];
  let foodSources: FoodSource[] = [];

  class Organism {
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

    constructor(canvasWidth: number, canvasHeight: number, cfg: WorldConfig) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed);
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.baseSpeed = speed;
      this.wanderAngle = angle;
      this.wanderRate = 0.004 + Math.random() * 0.008;
      this.idlePhase = Math.random() * Math.PI * 2;
      this.idlePauseTimer = 0;
      this.isPaused = false;
      this.decayRate = 0.001 + Math.random() * 0.002;
      this.minSize = cfg.minSize * 0.5;
      this.maxSize = cfg.maxSize * 1.2;
      const baseSize = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
      const sizeMultiplier = 1 + (Math.random() - 0.5) * 2 * cfg.sizeVariation;
      this.size = Math.max(cfg.minSize * 0.5, Math.min(cfg.maxSize * 1.5, baseSize * sizeMultiplier));
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.001;
      this.age = 0;
      this.tendril = null;
      this.spokeIntensity = 0.3 + Math.random() * 0.4;
      this.stabilizing = 0;
      this.glow = 0;
      this.depth = Math.random();
      this.lobes = [];
      const vertexRange = cfg.maxStartVertices - cfg.minStartVertices + 1;
      const startVertices = cfg.minStartVertices + Math.floor(Math.random() * vertexRange);
      this.vertices = this.createVertices(startVertices);
      
      if (Math.random() < 0.25) {
        const lobeCount = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < lobeCount; i++) {
          this.lobes.push(this.createLobe(cfg));
        }
      }
    }

    createLobe(cfg: WorldConfig): Lobe {
      const lobeVertexCount = 3 + Math.floor(Math.random() * 2);
      const lobeSize = 0.2 + Math.random() * 0.3;
      return {
        offsetAngle: Math.random() * Math.PI * 2,
        offsetDistance: 0.5 + Math.random() * 0.35,
        vertices: this.createVertices(lobeVertexCount),
        size: lobeSize,
        rotationOffset: Math.random() * Math.PI * 2,
      };
    }

    getBoundingRadius(): number {
      let maxRadius = this.size;
      for (const lobe of this.lobes) {
        const lobeReach = this.size * lobe.offsetDistance + this.size * lobe.size;
        maxRadius = Math.max(maxRadius, lobeReach);
      }
      return maxRadius;
    }

    enforceMaxBounds(maxBoundingRadius: number): void {
      const currentRadius = this.getBoundingRadius();
      if (currentRadius > maxBoundingRadius) {
        const scale = maxBoundingRadius / currentRadius;
        this.size *= scale;
        this.size = Math.max(this.minSize, this.size);
      }
    }

    growTendril(targetX: number, targetY: number): void {
      if (!this.tendril) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.tendril = {
          targetX,
          targetY,
          length: 0,
          maxLength: Math.min(dist * 0.6, this.size * 1.5),
          curveOffset: (Math.random() - 0.5) * 20,
          decaying: false,
        };
      }
    }

    updateTendril(): void {
      if (!this.tendril) return;
      
      if (this.tendril.decaying) {
        this.tendril.length -= 0.8;
        if (this.tendril.length <= 0) {
          this.tendril = null;
        }
      } else {
        this.tendril.length = Math.min(this.tendril.length + 0.5, this.tendril.maxLength);
        if (this.tendril.length >= this.tendril.maxLength) {
          this.tendril.decaying = true;
        }
      }
    }

    decayTendril(): void {
      if (this.tendril && !this.tendril.decaying) {
        this.tendril.decaying = true;
      }
    }

    createVertices(count: number): Vertex[] {
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

    evolve(maxVertices: number): void {
      if (this.vertices.length < maxVertices && Math.random() < 0.3) {
        const insertIndex = Math.floor(Math.random() * this.vertices.length);
        const nextIndex = (insertIndex + 1) % this.vertices.length;
        const newAngle = (this.vertices[insertIndex].angle + this.vertices[nextIndex].angle) / 2;
        const newDistance = 0.7 + Math.random() * 0.3;
        this.vertices.splice(insertIndex + 1, 0, { angle: newAngle, distance: newDistance });
      }
    }

    morphWith(other: Organism): void {
      if (this.vertices.length > 3 && other.vertices.length < 7) {
        const donorIndex = Math.floor(Math.random() * this.vertices.length);
        const donatedVertex = this.vertices[donorIndex];
        const newVertex: Vertex = {
          angle: donatedVertex.angle + (Math.random() - 0.5) * 0.5,
          distance: donatedVertex.distance * (0.8 + Math.random() * 0.4),
        };
        other.vertices.push(newVertex);
        other.vertices.sort((a, b) => a.angle - b.angle);
      }
    }

    absorbLobeFrom(other: Organism, cfg: WorldConfig): boolean {
      if (other.lobes.length === 0 || this.lobes.length >= 5) return false;
      
      const stolenLobe = other.lobes.pop()!;
      const newLobe: Lobe = {
        offsetAngle: stolenLobe.offsetAngle + (Math.random() - 0.5) * 0.5,
        offsetDistance: stolenLobe.offsetDistance * (0.9 + Math.random() * 0.3),
        vertices: stolenLobe.vertices.map(v => ({
          angle: v.angle,
          distance: v.distance * (0.8 + Math.random() * 0.4),
        })),
        size: stolenLobe.size * (0.7 + Math.random() * 0.4),
        rotationOffset: stolenLobe.rotationOffset + Math.random() * 0.5,
      };
      this.lobes.push(newLobe);
      this.grow(other.size * 0.1);
      return true;
    }

    incorporateFrom(other: Organism, cfg: WorldConfig): void {
      if (other.lobes.length > 0 && this.lobes.length < 5 && Math.random() < 0.6) {
        this.absorbLobeFrom(other, cfg);
      }
      
      if (other.vertices.length > 3 && this.vertices.length < cfg.maxVertices) {
        const donorIndex = Math.floor(Math.random() * other.vertices.length);
        const donatedVertex = other.vertices[donorIndex];
        const newVertex: Vertex = {
          angle: donatedVertex.angle + (Math.random() - 0.5) * 0.3,
          distance: donatedVertex.distance * (0.85 + Math.random() * 0.3),
        };
        this.vertices.push(newVertex);
        this.vertices.sort((a, b) => a.angle - b.angle);
        other.vertices.splice(donorIndex, 1);
      }
      
      if (Math.random() < 0.3 && this.lobes.length < 5) {
        const newLobe = this.createLobe(cfg);
        newLobe.size *= 0.6 + Math.random() * 0.4;
        this.lobes.push(newLobe);
      }
      
      this.grow(other.size * 0.15);
      this.spokeIntensity = Math.min(0.8, this.spokeIntensity + 0.1);
    }

    fuseWith(other: Organism, cfg: WorldConfig): void {
      const totalLobes = this.lobes.length + other.lobes.length;
      const maxLobes = 5;
      
      while (other.lobes.length > 0 && this.lobes.length < maxLobes) {
        this.absorbLobeFrom(other, cfg);
      }
      
      const vertexBudget = cfg.maxVertices - this.vertices.length;
      const verticesToTake = Math.min(vertexBudget, Math.floor(other.vertices.length * 0.5));
      for (let i = 0; i < verticesToTake && other.vertices.length > 3; i++) {
        const idx = Math.floor(Math.random() * other.vertices.length);
        const v = other.vertices.splice(idx, 1)[0];
        this.vertices.push({
          angle: v.angle + (Math.random() - 0.5) * 0.4,
          distance: v.distance * (0.8 + Math.random() * 0.4),
        });
      }
      this.vertices.sort((a, b) => a.angle - b.angle);
      
      this.grow(other.size * 0.25);
      other.pulseSize(0.7);
      this.spokeIntensity = Math.min(0.9, this.spokeIntensity + 0.15);
      
      if (this.lobes.length < maxLobes && Math.random() < 0.4) {
        const bridgeLobe = this.createLobe(cfg);
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        bridgeLobe.offsetAngle = Math.atan2(dy, dx) - this.rotation;
        bridgeLobe.offsetDistance = 1.0 + Math.random() * 0.3;
        bridgeLobe.size *= 0.8;
        this.lobes.push(bridgeLobe);
      }
    }

    simplify(): void {
      if (this.vertices.length > 3) {
        const removeIndex = Math.floor(Math.random() * this.vertices.length);
        this.vertices.splice(removeIndex, 1);
      }
    }

    pulseSize(factor: number): void {
      this.size *= factor;
      this.size = Math.max(this.minSize, Math.min(this.maxSize, this.size));
    }

    grow(amount: number): void {
      this.size = Math.min(this.maxSize, this.size + amount);
    }

    triggerGlow(intensity: number = 1): void {
      this.glow = Math.min(1, this.glow + intensity);
    }

    startStabilizing(): void {
      this.stabilizing = 60;
    }

    update(canvasWidth: number, canvasHeight: number): void {
      this.idlePhase += 0.008;
      
      if (this.idlePauseTimer > 0) {
        this.idlePauseTimer--;
        if (this.idlePauseTimer === 0) {
          this.isPaused = false;
          this.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.5;
        }
      } else if (!this.isPaused && Math.random() < 0.0008) {
        this.isPaused = true;
        this.idlePauseTimer = 60 + Math.floor(Math.random() * 120);
      }
      
      this.wanderAngle += (Math.random() - 0.5) * this.wanderRate;
      
      const bobX = Math.sin(this.idlePhase) * 0.0008;
      const bobY = Math.cos(this.idlePhase * 0.7) * 0.0006;
      
      const pauseMultiplier = this.isPaused ? 0.15 : 1;
      const targetSpeed = this.baseSpeed * pauseMultiplier;
      
      const desiredVx = Math.cos(this.wanderAngle) * targetSpeed + bobX;
      const desiredVy = Math.sin(this.wanderAngle) * targetSpeed + bobY;
      
      const steerStrength = this.isPaused ? 0.01 : 0.02;
      this.vx += (desiredVx - this.vx) * steerStrength;
      this.vy += (desiredVy - this.vy) * steerStrength;
      
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 0.01) {
        const movementAngle = Math.atan2(this.vy, this.vx);
        let angleDiff = movementAngle - this.rotation;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        const alignStrength = Math.min(0.08, 0.015 + speed * 0.02);
        this.rotationSpeed += angleDiff * alignStrength * 0.1;
      }
      
      this.rotationSpeed *= 0.92;
      
      if (this.stabilizing > 0) {
        this.stabilizing--;
        this.rotationSpeed *= 0.85;
      }
      
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.age++;
      
      if (this.glow > 0) {
        this.glow *= 0.96;
        if (this.glow < 0.01) this.glow = 0;
      }
      
      if (this.size > this.minSize) {
        this.size -= this.decayRate;
        this.size = Math.max(this.minSize, this.size);
      }

      const margin = this.size;
      if (this.x < -margin) this.x = canvasWidth + margin;
      if (this.x > canvasWidth + margin) this.x = -margin;
      if (this.y < -margin) this.y = canvasHeight + margin;
      if (this.y > canvasHeight + margin) this.y = -margin;
    }

    getWorldVertices(): { x: number; y: number }[] {
      return this.vertices.map((v) => ({
        x: this.x + Math.cos(v.angle + this.rotation) * this.size * v.distance,
        y: this.y + Math.sin(v.angle + this.rotation) * this.size * v.distance,
      }));
    }

    draw(ctx: CanvasRenderingContext2D, strokeColor: string, lineOpacity: number, vertexOpacity: number): void {
      const worldVerts = this.getWorldVertices();
      
      const depthFade = 0.4 + this.depth * 0.6;
      const adjustedLineOpacity = lineOpacity * depthFade;
      const adjustedVertexOpacity = vertexOpacity * depthFade;
      
      if (this.glow > 0) {
        const glowRadius = this.getBoundingRadius() * (1.5 + this.glow * 0.5);
        const glowAlpha = this.glow * 0.15 * depthFade;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        gradient.addColorStop(0, `rgba(${strokeColor}, ${glowAlpha})`);
        gradient.addColorStop(1, `rgba(${strokeColor}, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      if (this.vertices.length >= 4 && this.spokeIntensity > 0) {
        const spokeAlpha = adjustedLineOpacity * this.spokeIntensity * 0.4;
        ctx.strokeStyle = `rgba(${strokeColor}, ${spokeAlpha})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < Math.floor(this.vertices.length / 2); i++) {
          const oppositeIdx = (i + Math.floor(this.vertices.length / 2)) % this.vertices.length;
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
      ctx.strokeStyle = `rgba(${strokeColor}, ${adjustedLineOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      worldVerts.forEach((v) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${strokeColor}, ${adjustedVertexOpacity * 2})`;
        ctx.fill();
      });

      this.lobes.forEach((lobe) => {
        const lobeAngle = this.rotation + lobe.offsetAngle;
        const lobeCenterX = this.x + Math.cos(lobeAngle) * this.size * lobe.offsetDistance;
        const lobeCenterY = this.y + Math.sin(lobeAngle) * this.size * lobe.offsetDistance;
        const lobeRotation = this.rotation + lobe.rotationOffset;
        const lobeSize = this.size * lobe.size;
        
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
        ctx.strokeStyle = `rgba(${strokeColor}, ${adjustedLineOpacity * 0.8})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        
        lobeVerts.forEach((v) => {
          ctx.beginPath();
          ctx.arc(v.x, v.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${strokeColor}, ${adjustedVertexOpacity * 1.5})`;
          ctx.fill();
        });
        
        const nearestMainVert = worldVerts.reduce((nearest, v) => {
          const d = Math.hypot(v.x - lobeCenterX, v.y - lobeCenterY);
          return d < nearest.dist ? { v, dist: d } : nearest;
        }, { v: worldVerts[0], dist: Infinity });
        
        ctx.beginPath();
        ctx.moveTo(nearestMainVert.v.x, nearestMainVert.v.y);
        ctx.lineTo(lobeCenterX, lobeCenterY);
        ctx.strokeStyle = `rgba(${strokeColor}, ${adjustedLineOpacity * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      if (this.tendril && this.tendril.length > 0) {
        const dx = this.tendril.targetX - this.x;
        const dy = this.tendril.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.1) return;
        const nx = dx / dist;
        const ny = dy / dist;
        
        const endX = this.x + nx * this.tendril.length;
        const endY = this.y + ny * this.tendril.length;
        const ctrlX = (this.x + endX) / 2 + this.tendril.curveOffset * -ny;
        const ctrlY = (this.y + endY) / 2 + this.tendril.curveOffset * nx;
        
        const tendrilAlpha = adjustedLineOpacity * (this.tendril.length / this.tendril.maxLength) * 0.7;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        ctx.strokeStyle = `rgba(${strokeColor}, ${tendrilAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${strokeColor}, ${tendrilAlpha})`;
        ctx.fill();
      }
    }
  }

  function getAdaptedConfig(): WorldConfig {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;
    const isMobile = width < 768;
    const isSmallMobile = width < 480;
    
    let organismMultiplier = 1;
    let speedMultiplier = 1;
    let connectionMultiplier = 1;
    
    if (isSmallMobile) {
      organismMultiplier = 0.5;
      speedMultiplier = 0.7;
      connectionMultiplier = 0.6;
    } else if (isMobile) {
      organismMultiplier = 0.65;
      speedMultiplier = 0.8;
      connectionMultiplier = 0.75;
    } else if (area < 1200000) {
      organismMultiplier = 0.8;
    }
    
    return {
      ...config,
      organismCount: Math.max(4, Math.floor(config.organismCount * organismMultiplier)),
      minSpeed: config.minSpeed * speedMultiplier,
      maxSpeed: config.maxSpeed * speedMultiplier,
      connectionDistance: config.connectionDistance * connectionMultiplier,
      mergeDistance: config.mergeDistance * connectionMultiplier,
    };
  }

  function getStrokeColor(isDark: boolean): string {
    return isDark ? '255, 255, 255' : '0, 0, 0';
  }

  function drawConnections(ctx: CanvasRenderingContext2D, organisms: Organism[], cfg: WorldConfig, isDark: boolean): void {
    const strokeColor = getStrokeColor(isDark);
    const lineContrast = isDark ? cfg.lineContrast.dark : cfg.lineContrast.light;
    const baseAlpha = getAlphaFromContrast(lineContrast);

    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        const dx = organisms[i].x - organisms[j].x;
        const dy = organisms[i].y - organisms[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < cfg.connectionDistance) {
          const alpha = (1 - distance / cfg.connectionDistance) * baseAlpha * 0.5;
          
          const vertsA = organisms[i].getWorldVertices();
          const vertsB = organisms[j].getWorldVertices();
          
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
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function initOrganisms(): void {
    organisms = [];
    chainLinks = [];
    particles = [];
    foodSources = [];
    currentTime = 0;
    
    const cols = Math.ceil(Math.sqrt(adaptedConfig.organismCount * (logicalWidth / logicalHeight)));
    const rows = Math.ceil(adaptedConfig.organismCount / cols);
    const cellWidth = logicalWidth / cols;
    const cellHeight = logicalHeight / rows;
    const jitter = 0.8;
    
    for (let i = 0; i < adaptedConfig.organismCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const org = new Organism(logicalWidth, logicalHeight, adaptedConfig);
      org.x = (col + 0.5 + (Math.random() - 0.5) * jitter) * cellWidth;
      org.y = (row + 0.5 + (Math.random() - 0.5) * jitter) * cellHeight;
      org.x = Math.max(org.size, Math.min(logicalWidth - org.size, org.x));
      org.y = Math.max(org.size, Math.min(logicalHeight - org.size, org.y));
      organisms.push(org);
    }
    for (let i = 0; i < adaptedConfig.foodSourceCount; i++) {
      foodSources.push({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        active: true,
        respawnAt: 0,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    
    const initialBubbleCount = Math.floor((logicalWidth * logicalHeight) / 8000);
    for (let i = 0; i < initialBubbleCount; i++) {
      const x = Math.random() * logicalWidth;
      const y = Math.random() * logicalHeight;
      const flow = getFlowField(x, y, 0);
      
      particles.push({
        x,
        y,
        vx: flow.vx + (Math.random() - 0.5) * 0.01,
        vy: flow.vy + (Math.random() - 0.5) * 0.01,
        size: 0.3 + Math.random() * 0.9,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 400 + Math.floor(Math.random() * 400),
        depth: Math.random(),
      });
    }
  }

  function spawnRandomFood(timestamp: number): void {
    if (timestamp - lastFoodSpawnTime > adaptedConfig.foodSpawnInterval) {
      if (foodSources.filter(f => f.active).length < adaptedConfig.maxFoodSources) {
        foodSources.push({
          x: Math.random() * logicalWidth,
          y: Math.random() * logicalHeight,
          active: true,
          respawnAt: 0,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      lastFoodSpawnTime = timestamp;
    }
  }

  function applyFoodAttraction(timestamp: number): void {
    spawnRandomFood(timestamp);

    const noticeDistance = 140;
    const speedBoostMax = 4;
    const aggressionDistance = 60;

    for (let i = foodSources.length - 1; i >= 0; i--) {
      const food = foodSources[i];
      
      if (!food.active) {
        if (timestamp >= food.respawnAt) {
          food.active = true;
          food.x = Math.random() * logicalWidth;
          food.y = Math.random() * logicalHeight;
        }
        continue;
      }

      food.pulsePhase += 0.03;

      const nearbyOrgs: { org: Organism; dist: number }[] = [];

      organisms.forEach((org) => {
        const dx = food.x - org.x;
        const dy = food.y - org.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < noticeDistance) {
          nearbyOrgs.push({ org, dist });
          
          const proximityFactor = 1 - dist / noticeDistance;
          const urgencyFactor = dist < aggressionDistance ? 2.5 : 1;
          const speedBoost = 1 + proximityFactor * proximityFactor * (speedBoostMax - 1) * urgencyFactor;
          
          const nx = dx / Math.max(dist, 0.1);
          const ny = dy / Math.max(dist, 0.1);
          
          const targetSpeed = adaptedConfig.maxSpeed * speedBoost;
          const attractionStrength = adaptedConfig.foodAttractionStrength * proximityFactor * speedBoost * urgencyFactor;
          
          org.vx += nx * attractionStrength;
          org.vy += ny * attractionStrength;
          
          if (dist < aggressionDistance) {
            org.rotationSpeed += (Math.random() - 0.5) * 0.01;
            if (Math.random() < 0.02) {
              org.growTendril(food.x, food.y);
            }
          }
          
          const currentSpeed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
          if (currentSpeed > targetSpeed && currentSpeed > 0) {
            org.vx = (org.vx / currentSpeed) * targetSpeed;
            org.vy = (org.vy / currentSpeed) * targetSpeed;
          }
        }

        if (dist < org.size * 0.8) {
          food.active = false;
          food.respawnAt = timestamp + adaptedConfig.foodRespawnTime;
          org.grow(5);
          org.triggerGlow(0.8);
          org.decayRate += 0.0005;
          if (org.vertices.length < adaptedConfig.maxVertices && Math.random() < 0.6) {
            org.evolve(adaptedConfig.maxVertices);
          }
          if (Math.random() < 0.3 && org.lobes.length < 3) {
            org.lobes.push(org.createLobe(adaptedConfig));
          }
          spawnParticles(food.x, food.y, 0, 0, 10);
        }
      });

      if (nearbyOrgs.length >= 2) {
        nearbyOrgs.sort((a, b) => a.dist - b.dist);
        for (let n = 0; n < Math.min(nearbyOrgs.length - 1, 3); n++) {
          const orgA = nearbyOrgs[n].org;
          const orgB = nearbyOrgs[n + 1].org;
          const distBetween = Math.hypot(orgB.x - orgA.x, orgB.y - orgA.y);
          
          if (distBetween < adaptedConfig.mergeDistance * 1.5 && Math.random() < 0.08) {
            orgA.morphWith(orgB);
            createChainLink(orgA, orgB);
            orgA.growTendril(orgB.x, orgB.y);
          }
        }
      }
    }
  }

  function drawFoodSources(ctx: CanvasRenderingContext2D, strokeColor: string, alpha: number): void {
    foodSources.forEach((food) => {
      if (!food.active) return;

      const pulse = 1 + Math.sin(food.pulsePhase) * 0.2;
      const size = adaptedConfig.foodSize * pulse;

      ctx.beginPath();
      ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeColor}, ${alpha * 0.6})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(food.x, food.y, size * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${strokeColor}, ${alpha * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  }

  function spawnParticles(x: number, y: number, vx: number, vy: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.5;
      particles.push({
        x,
        y,
        vx: vx * 0.3 + Math.cos(angle) * speed,
        vy: vy * 0.3 + Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        life: 1,
        maxLife: 60 + Math.floor(Math.random() * 40),
        depth: Math.random(),
      });
    }
  }

  let currentTime = 0;
  
  function getFlowField(x: number, y: number, time: number): { vx: number; vy: number } {
    const scale = 0.003;
    const timeScale = 0.0003;
    
    const nx = x * scale;
    const ny = y * scale;
    const t = time * timeScale;
    
    const angle1 = Math.sin(nx + t) * Math.cos(ny * 0.7 + t * 0.5) * Math.PI;
    const angle2 = Math.cos(nx * 0.8 - t * 0.3) * Math.sin(ny + t * 0.7) * Math.PI * 0.5;
    const flowAngle = angle1 + angle2 + Math.PI * -0.3;
    
    const strength = 0.015 + Math.sin(nx * 2 + ny * 2 + t) * 0.008;
    
    return {
      vx: Math.cos(flowAngle) * strength,
      vy: Math.sin(flowAngle) * strength,
    };
  }

  function spawnAmbientBubbles(): void {
    currentTime++;
    
    const edgeSpawnChance = Math.random();
    const spawnCount = edgeSpawnChance < 0.5 ? 1 : edgeSpawnChance < 0.7 ? 2 : 0;
    for (let i = 0; i < spawnCount; i++) {
      const edge = Math.floor(Math.random() * 4);
      let x: number, y: number;
      
      if (edge === 0) {
        x = Math.random() * logicalWidth;
        y = -5;
      } else if (edge === 1) {
        x = logicalWidth + 5;
        y = Math.random() * logicalHeight;
      } else if (edge === 2) {
        x = Math.random() * logicalWidth;
        y = logicalHeight + 5;
      } else {
        x = -5;
        y = Math.random() * logicalHeight;
      }
      
      const flow = getFlowField(x, y, currentTime);
      const sizeRoll = Math.random();
      const bubbleSize = sizeRoll < 0.4 ? 0.2 + Math.random() * 0.3 :
                         sizeRoll < 0.75 ? 0.4 + Math.random() * 0.5 :
                         sizeRoll < 0.92 ? 0.8 + Math.random() * 0.6 :
                         1.2 + Math.random() * 0.6;
      
      particles.push({
        x,
        y,
        vx: flow.vx + (Math.random() - 0.5) * 0.01,
        vy: flow.vy + (Math.random() - 0.5) * 0.01,
        size: bubbleSize,
        life: 1,
        maxLife: 800 + Math.floor(Math.random() * 600),
        depth: Math.random(),
      });
    }
    
    if (Math.random() < 0.25) {
      const x = Math.random() * logicalWidth;
      const y = Math.random() * logicalHeight;
      const flow = getFlowField(x, y, currentTime);
      const sizeRoll = Math.random();
      const bubbleSize = sizeRoll < 0.5 ? 0.15 + Math.random() * 0.25 :
                         sizeRoll < 0.8 ? 0.3 + Math.random() * 0.4 :
                         0.6 + Math.random() * 0.5;
      
      particles.push({
        x,
        y,
        vx: flow.vx + (Math.random() - 0.5) * 0.008,
        vy: flow.vy + (Math.random() - 0.5) * 0.008,
        size: bubbleSize,
        life: 1,
        maxLife: 600 + Math.floor(Math.random() * 400),
        depth: Math.random(),
      });
    }
  }

  function spawnBubbleStream(org: Organism): void {
    const speed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
    if (speed < adaptedConfig.minSpeed * 0.8) return;
    
    const speedRatio = speed / adaptedConfig.maxSpeed;
    const bubbleChance = speedRatio * speedRatio * 0.08;
    if (Math.random() > bubbleChance) return;
    
    const forwardAngle = Math.atan2(org.vy, org.vx);
    const rearAngle = forwardAngle + Math.PI;
    
    const sideOffset = (Math.random() - 0.5) * 0.3;
    const emitAngle = rearAngle + sideOffset;
    
    const emitDist = org.size * (0.8 + Math.random() * 0.15);
    const emitX = org.x + Math.cos(emitAngle) * emitDist;
    const emitY = org.y + Math.sin(emitAngle) * emitDist;
    
    const bubbleSpeed = speed * (0.2 + Math.random() * 0.15);
    const spreadAngle = rearAngle + (Math.random() - 0.5) * 0.3;
    
    particles.push({
      x: emitX,
      y: emitY,
      vx: Math.cos(spreadAngle) * bubbleSpeed,
      vy: Math.sin(spreadAngle) * bubbleSpeed,
      size: 0.5 + Math.random() * 0.6,
      life: 1,
      maxLife: 30 + Math.floor(Math.random() * 20),
      depth: org.depth,
    });
  }

  function updateParticles(): void {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      const flow = getFlowField(p.x, p.y, currentTime);
      p.vx += flow.vx * 0.15;
      p.vy += flow.vy * 0.15;
      
      for (const org of organisms) {
        const dx = p.x - org.x;
        const dy = p.y - org.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = org.getBoundingRadius() * 1.3;
        
        if (dist < pushRadius && dist > 0.1) {
          const overlap = pushRadius - dist;
          const pushStrength = (overlap / pushRadius) * 0.08;
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * pushStrength;
          p.vy += ny * pushStrength;
        }
      }
      
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= 1 / p.maxLife;
      
      if (p.life <= 0 || p.x < -20 || p.x > logicalWidth + 20 || p.y < -20 || p.y > logicalHeight + 20) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles(ctx: CanvasRenderingContext2D, strokeColor: string, baseAlpha: number): void {
    particles.forEach((p) => {
      const depthFade = 0.4 + p.depth * 0.6;
      const alpha = p.life * baseAlpha * 0.6 * depthFade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeColor}, ${alpha})`;
      ctx.fill();
    });
  }

  function createChainLink(orgA: Organism, orgB: Organism): void {
    const existing = chainLinks.find(
      (c) => (c.orgA === orgA && c.orgB === orgB) || (c.orgA === orgB && c.orgB === orgA)
    );
    if (!existing) {
      chainLinks.push({
        orgA,
        orgB,
        strength: 1,
        age: 0,
        maxAge: 120 + Math.floor(Math.random() * 60),
      });
    }
  }

  function updateChainLinks(): void {
    for (let i = chainLinks.length - 1; i >= 0; i--) {
      const link = chainLinks[i];
      link.age++;
      
      const dx = link.orgB.x - link.orgA.x;
      const dy = link.orgB.y - link.orgA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const maxStretch = adaptedConfig.connectionDistance * 1.2;
      if (distance > maxStretch) {
        link.strength -= 0.05;
      } else {
        link.strength = Math.min(1, link.strength + 0.02);
      }
      
      if (link.age > link.maxAge || link.strength <= 0) {
        chainLinks.splice(i, 1);
      }
    }
  }

  function drawChainLinks(ctx: CanvasRenderingContext2D, strokeColor: string, baseAlpha: number): void {
    chainLinks.forEach((link) => {
      const dx = link.orgB.x - link.orgA.x;
      const dy = link.orgB.y - link.orgA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 0.1) return;
      
      const ageAlpha = link.age < 20 ? link.age / 20 : 
                       link.age > link.maxAge - 20 ? (link.maxAge - link.age) / 20 : 1;
      const alpha = link.strength * ageAlpha * baseAlpha * 0.5;
      
      const segments = 5;
      const perpX = -dy / distance;
      const perpY = dx / distance;
      
      ctx.beginPath();
      ctx.moveTo(link.orgA.x, link.orgA.y);
      
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const baseX = link.orgA.x + dx * t;
        const baseY = link.orgA.y + dy * t;
        const wobble = Math.sin(t * Math.PI * 2 + link.age * 0.05) * 5 * link.strength;
        ctx.lineTo(baseX + perpX * wobble, baseY + perpY * wobble);
      }
      
      ctx.lineTo(link.orgB.x, link.orgB.y);
      ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });
  }

  function resizeCanvas(): void {
    if (!canvas || !ctx) return;
    
    logicalWidth = window.innerWidth;
    logicalHeight = window.innerHeight;
    
    const rawDpr = window.devicePixelRatio || 1;
    dpr = Math.min(rawDpr, 2);
    
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    adaptedConfig = getAdaptedConfig();
    initOrganisms();
  }

  function applyProximityInteractions(): void {
    const flockingDistance = adaptedConfig.connectionDistance * 0.8;
    const alignmentDistance = adaptedConfig.connectionDistance * 0.6;
    const interactionDistance = adaptedConfig.mergeDistance;
    const alignmentStrength = 0.003;
    const cohesionStrength = 0.0008;
    const spinInfluence = 0.00005;

    for (let i = 0; i < organisms.length; i++) {
      let neighborCount = 0;
      let avgNeighborX = 0;
      let avgNeighborY = 0;
      let avgNeighborVx = 0;
      let avgNeighborVy = 0;
      
      for (let j = 0; j < organisms.length; j++) {
        if (i === j) continue;
        
        const dx = organisms[j].x - organisms[i].x;
        const dy = organisms[j].y - organisms[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < flockingDistance && distance > 0.1) {
          neighborCount++;
          avgNeighborX += organisms[j].x;
          avgNeighborY += organisms[j].y;
          avgNeighborVx += organisms[j].vx;
          avgNeighborVy += organisms[j].vy;
        }
      }
      
      if (neighborCount > 0) {
        avgNeighborX /= neighborCount;
        avgNeighborY /= neighborCount;
        avgNeighborVx /= neighborCount;
        avgNeighborVy /= neighborCount;
        
        const cohesionDx = avgNeighborX - organisms[i].x;
        const cohesionDy = avgNeighborY - organisms[i].y;
        const cohesionDist = Math.sqrt(cohesionDx * cohesionDx + cohesionDy * cohesionDy);
        
        if (cohesionDist > organisms[i].size * 2) {
          organisms[i].vx += (cohesionDx / cohesionDist) * cohesionStrength * neighborCount;
          organisms[i].vy += (cohesionDy / cohesionDist) * cohesionStrength * neighborCount;
        }
        
        organisms[i].vx += (avgNeighborVx - organisms[i].vx) * alignmentStrength;
        organisms[i].vy += (avgNeighborVy - organisms[i].vy) * alignmentStrength;
      }
    }

    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        const dx = organisms[j].x - organisms[i].x;
        const dy = organisms[j].y - organisms[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.1) continue;

        const nx = dx / distance;
        const ny = dy / distance;

        const combinedRadius = (organisms[i].size + organisms[j].size) * 0.5;
        const collisionBuffer = combinedRadius * 0.9;

        if (distance < collisionBuffer) {
          const overlap = collisionBuffer - distance;
          const separationForce = Math.min(overlap * 0.025, 0.18);
          
          const iStable = organisms[i].stabilizing > 0 ? 0.3 : 1;
          const jStable = organisms[j].stabilizing > 0 ? 0.3 : 1;
          
          organisms[i].vx -= nx * separationForce * iStable;
          organisms[i].vy -= ny * separationForce * iStable;
          organisms[j].vx += nx * separationForce * jStable;
          organisms[j].vy += ny * separationForce * jStable;

          if (distance < combinedRadius * 0.5) {
            const pushStrength = (combinedRadius * 0.5 - distance) * 0.05;
            organisms[i].x -= nx * pushStrength;
            organisms[i].y -= ny * pushStrength;
            organisms[j].x += nx * pushStrength;
            organisms[j].y += ny * pushStrength;
          }

          const spinDelta = (organisms[j].rotationSpeed - organisms[i].rotationSpeed) * spinInfluence;
          organisms[i].rotationSpeed += spinDelta * iStable;
          organisms[j].rotationSpeed -= spinDelta * jStable;
          
          organisms[i].startStabilizing();
          organisms[j].startStabilizing();
        }

        if (distance < interactionDistance) {
          const proximityFactor = 1 - distance / interactionDistance;
          const baseChance = adaptedConfig.interactionChance * (1 + proximityFactor);
          const triggerChance = proximityFactor * baseChance;
          
          if (Math.random() < triggerChance) {
            const interactionType = Math.random();
            
            organisms[i].triggerGlow(0.4);
            organisms[j].triggerGlow(0.4);
            
            if (interactionType < 0.10) {
              if (organisms[i].vertices.length <= organisms[j].vertices.length) {
                organisms[i].evolve(adaptedConfig.maxVertices);
                organisms[i].growTendril(organisms[j].x, organisms[j].y);
              } else {
                organisms[j].evolve(adaptedConfig.maxVertices);
                organisms[j].growTendril(organisms[i].x, organisms[i].y);
              }
              spawnParticles((organisms[i].x + organisms[j].x) / 2, (organisms[i].y + organisms[j].y) / 2, 0, 0, 3);
            } else if (interactionType < 0.35) {
              organisms[i].morphWith(organisms[j]);
              organisms[j].morphWith(organisms[i]);
              createChainLink(organisms[i], organisms[j]);
              organisms[i].growTendril(organisms[j].x, organisms[j].y);
              organisms[j].growTendril(organisms[i].x, organisms[i].y);
              spawnParticles((organisms[i].x + organisms[j].x) / 2, (organisms[i].y + organisms[j].y) / 2, 0, 0, 4);
            } else if (interactionType < 0.55) {
              const larger = organisms[i].size > organisms[j].size ? organisms[i] : organisms[j];
              const smaller = organisms[i].size > organisms[j].size ? organisms[j] : organisms[i];
              larger.incorporateFrom(smaller, adaptedConfig);
              larger.triggerGlow(0.6);
              createChainLink(organisms[i], organisms[j]);
              larger.growTendril(smaller.x, smaller.y);
              spawnParticles(smaller.x, smaller.y, smaller.vx, smaller.vy, 6);
              spawnParticles(larger.x, larger.y, 0, 0, 4);
            } else if (interactionType < 0.72) {
              const larger = organisms[i].size > organisms[j].size ? organisms[i] : organisms[j];
              const smaller = organisms[i].size > organisms[j].size ? organisms[j] : organisms[i];
              larger.fuseWith(smaller, adaptedConfig);
              larger.triggerGlow(0.7);
              createChainLink(organisms[i], organisms[j]);
              larger.growTendril(smaller.x, smaller.y);
              smaller.growTendril(larger.x, larger.y);
              spawnParticles((organisms[i].x + organisms[j].x) / 2, (organisms[i].y + organisms[j].y) / 2, 0, 0, 8);
            } else if (interactionType < 0.82) {
              const burstForce = 0.35;
              organisms[i].vx -= nx * burstForce;
              organisms[i].vy -= ny * burstForce;
              organisms[j].vx += nx * burstForce;
              organisms[j].vy += ny * burstForce;
              organisms[i].pulseSize(0.90);
              organisms[j].pulseSize(0.90);
              organisms[i].triggerGlow(0.5);
              organisms[j].triggerGlow(0.5);
              const midX = (organisms[i].x + organisms[j].x) / 2;
              const midY = (organisms[i].y + organisms[j].y) / 2;
              spawnParticles(midX, midY, organisms[i].vx, organisms[i].vy, 6);
              spawnParticles(midX, midY, organisms[j].vx, organisms[j].vy, 6);
            } else if (interactionType < 0.90) {
              const hasLobes = organisms[i].lobes.length > 0 || organisms[j].lobes.length > 0;
              if (hasLobes) {
                const donor = organisms[i].lobes.length > organisms[j].lobes.length ? organisms[i] : organisms[j];
                const receiver = organisms[i].lobes.length > organisms[j].lobes.length ? organisms[j] : organisms[i];
                if (receiver.absorbLobeFrom(donor, adaptedConfig)) {
                  createChainLink(organisms[i], organisms[j]);
                  receiver.growTendril(donor.x, donor.y);
                  spawnParticles(donor.x, donor.y, donor.vx, donor.vy, 5);
                }
              } else {
                const moreComplex = organisms[i].vertices.length > organisms[j].vertices.length ? organisms[i] : organisms[j];
                const lessComplex = organisms[i].vertices.length > organisms[j].vertices.length ? organisms[j] : organisms[i];
                moreComplex.simplify();
                lessComplex.evolve(adaptedConfig.maxVertices);
                spawnParticles(moreComplex.x, moreComplex.y, moreComplex.vx, moreComplex.vy, 3);
              }
            } else {
              organisms[i].pulseSize(1.12);
              organisms[j].pulseSize(1.12);
              const avgRotSpeed = (organisms[i].rotationSpeed + organisms[j].rotationSpeed) / 2;
              organisms[i].rotationSpeed = avgRotSpeed * 1.5;
              organisms[j].rotationSpeed = avgRotSpeed * 1.5;
              createChainLink(organisms[i], organisms[j]);
              if (Math.random() < 0.5) {
                const target = Math.random() < 0.5 ? organisms[i] : organisms[j];
                if (target.lobes.length < 4) {
                  target.lobes.push(target.createLobe(adaptedConfig));
                }
              }
            }
          }
        }
      }
    }

    const maxSpeed = adaptedConfig.maxSpeed * 1.5;
    organisms.forEach((org) => {
      const speed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
      if (speed > maxSpeed) {
        org.vx = (org.vx / speed) * maxSpeed;
        org.vy = (org.vy / speed) * maxSpeed;
      }
      const minSpeed = adaptedConfig.minSpeed * 0.5;
      if (speed < minSpeed && speed > 0) {
        org.vx = (org.vx / speed) * minSpeed;
        org.vy = (org.vy / speed) * minSpeed;
      }
    });
  }

  function handleVisibilityChange(): void {
    isVisible = document.visibilityState === 'visible';
    if (isVisible && !animationId) {
      animationId = requestAnimationFrame(animate);
    }
  }

  function animate(timestamp: number): void {
    if (!ctx || !isVisible || prefersReducedMotion) {
      animationId = 0;
      return;
    }

    const isDark = $theme === 'dark';
    const strokeColor = getStrokeColor(isDark);
    const contrastMultiplier = enhancedContrast ? 8 : 1;
    const lineContrast = isDark ? adaptedConfig.lineContrast.dark : adaptedConfig.lineContrast.light;
    const vertexContrast = isDark ? adaptedConfig.vertexContrast.dark : adaptedConfig.vertexContrast.light;
    const lineAlpha = Math.min(1, getAlphaFromContrast(lineContrast) * contrastMultiplier);
    const vertexAlpha = Math.min(1, getAlphaFromContrast(vertexContrast) * contrastMultiplier);

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    if (adaptedConfig.blur > 0) {
      ctx.filter = `blur(${adaptedConfig.blur}px)`;
    } else {
      ctx.filter = 'none';
    }

    applyProximityInteractions();
    applyFoodAttraction(timestamp);

    if (timestamp - lastEvolutionTime > adaptedConfig.evolutionInterval) {
      const randomOrg = organisms[Math.floor(Math.random() * organisms.length)];
      if (randomOrg && Math.random() < 0.15) {
        randomOrg.evolve(adaptedConfig.maxVertices);
      }
      lastEvolutionTime = timestamp;
    }

    spawnAmbientBubbles();
    updateParticles();
    updateChainLinks();

    drawFoodSources(ctx, strokeColor, lineAlpha);

    const maxBoundingRadius = adaptedConfig.maxSize * 1.5;
    organisms.forEach((org) => {
      org.update(logicalWidth, logicalHeight);
      org.updateTendril();
      org.enforceMaxBounds(maxBoundingRadius);
      spawnBubbleStream(org);
      org.draw(ctx!, strokeColor, lineAlpha, vertexAlpha);
    });

    drawConnections(ctx, organisms, adaptedConfig, isDark);
    drawChainLinks(ctx, strokeColor, lineAlpha);
    drawParticles(ctx, strokeColor, lineAlpha);

    ctx.filter = 'none';

    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = motionQuery.matches;
    motionHandler = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (!prefersReducedMotion && isVisible && !animationId) {
        animationId = requestAnimationFrame(animate);
      }
    };
    motionQuery.addEventListener('change', motionHandler);
    
    adaptedConfig = getAdaptedConfig();
    resizeCanvas();
    
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(animate);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', resizeCanvas);
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
    if (motionQuery && motionHandler) {
      motionQuery.removeEventListener('change', motionHandler);
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('resize', resizeCanvas);
  });
</script>

<canvas bind:this={canvas} class="generative-background"></canvas>

<style>
  .generative-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
