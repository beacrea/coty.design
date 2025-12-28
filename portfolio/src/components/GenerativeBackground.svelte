<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '../stores/theme';
  import { defaultWorldConfig, getAlphaFromContrast, type WorldConfig } from '../lib/generative-config';

  export let config: WorldConfig = defaultWorldConfig;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number;
  let organisms: Organism[] = [];
  let lastEvolutionTime = 0;
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

    constructor(canvasWidth: number, canvasHeight: number, cfg: WorldConfig) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed);
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.002;
      this.age = 0;
      this.vertices = this.createVertices(3);
    }

    createVertices(count: number): Vertex[] {
      const verts: Vertex[] = [];
      for (let i = 0; i < count; i++) {
        const baseAngle = (Math.PI * 2 * i) / count;
        verts.push({
          angle: baseAngle + (Math.random() - 0.5) * 0.3,
          distance: 0.7 + Math.random() * 0.3,
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

    simplify(): void {
      if (this.vertices.length > 3) {
        const removeIndex = Math.floor(Math.random() * this.vertices.length);
        this.vertices.splice(removeIndex, 1);
      }
    }

    pulseSize(factor: number): void {
      this.size *= factor;
      this.size = Math.max(15, Math.min(80, this.size));
    }

    update(canvasWidth: number, canvasHeight: number): void {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.age++;

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
      
      ctx.beginPath();
      ctx.moveTo(worldVerts[0].x, worldVerts[0].y);
      for (let i = 1; i < worldVerts.length; i++) {
        ctx.lineTo(worldVerts[i].x, worldVerts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${strokeColor}, ${lineOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      worldVerts.forEach((v) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${strokeColor}, ${vertexOpacity * 2})`;
        ctx.fill();
      });
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
    for (let i = 0; i < adaptedConfig.organismCount; i++) {
      organisms.push(new Organism(logicalWidth, logicalHeight, adaptedConfig));
    }
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
    const alignmentDistance = adaptedConfig.connectionDistance * 0.6;
    const interactionDistance = adaptedConfig.mergeDistance;
    const alignmentStrength = 0.002;
    const spinInfluence = 0.00005;

    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        const dx = organisms[j].x - organisms[i].x;
        const dy = organisms[j].y - organisms[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.1) continue;

        const nx = dx / distance;
        const ny = dy / distance;

        const combinedRadius = (organisms[i].size + organisms[j].size) * 0.6;
        const collisionBuffer = combinedRadius * 1.2;

        if (distance < collisionBuffer) {
          const overlap = collisionBuffer - distance;
          const separationForce = Math.min(overlap * 0.08, 0.5);
          
          organisms[i].vx -= nx * separationForce;
          organisms[i].vy -= ny * separationForce;
          organisms[j].vx += nx * separationForce;
          organisms[j].vy += ny * separationForce;

          if (distance < combinedRadius) {
            const pushStrength = (combinedRadius - distance) * 0.15;
            organisms[i].x -= nx * pushStrength;
            organisms[i].y -= ny * pushStrength;
            organisms[j].x += nx * pushStrength;
            organisms[j].y += ny * pushStrength;
          }

          const spinDelta = (organisms[j].rotationSpeed - organisms[i].rotationSpeed) * spinInfluence;
          organisms[i].rotationSpeed += spinDelta;
          organisms[j].rotationSpeed -= spinDelta;
        }

        if (distance < alignmentDistance && distance > collisionBuffer) {
          const avgVx = (organisms[i].vx + organisms[j].vx) / 2;
          const avgVy = (organisms[i].vy + organisms[j].vy) / 2;
          const blend = (1 - (distance - collisionBuffer) / (alignmentDistance - collisionBuffer)) * alignmentStrength;
          
          organisms[i].vx += (avgVx - organisms[i].vx) * blend;
          organisms[i].vy += (avgVy - organisms[i].vy) * blend;
          organisms[j].vx += (avgVx - organisms[j].vx) * blend;
          organisms[j].vy += (avgVy - organisms[j].vy) * blend;
        }

        if (distance < interactionDistance) {
          const interactionChance = (1 - distance / interactionDistance) * adaptedConfig.evolutionChance;
          
          if (Math.random() < interactionChance) {
            const interactionType = Math.random();
            
            if (interactionType < 0.25) {
              if (organisms[i].vertices.length <= organisms[j].vertices.length) {
                organisms[i].evolve(adaptedConfig.maxVertices);
              } else {
                organisms[j].evolve(adaptedConfig.maxVertices);
              }
            } else if (interactionType < 0.45) {
              if (organisms[i].vertices.length > organisms[j].vertices.length) {
                organisms[i].morphWith(organisms[j]);
              } else {
                organisms[j].morphWith(organisms[i]);
              }
            } else if (interactionType < 0.60) {
              const burstForce = 0.15;
              organisms[i].vx -= nx * burstForce;
              organisms[i].vy -= ny * burstForce;
              organisms[j].vx += nx * burstForce;
              organisms[j].vy += ny * burstForce;
              organisms[i].pulseSize(0.95);
              organisms[j].pulseSize(0.95);
            } else if (interactionType < 0.70) {
              const moreComplex = organisms[i].vertices.length > organisms[j].vertices.length ? organisms[i] : organisms[j];
              moreComplex.simplify();
            } else if (interactionType < 0.80) {
              organisms[i].pulseSize(1.05);
              organisms[j].pulseSize(1.05);
            } else {
              const avgRotSpeed = (organisms[i].rotationSpeed + organisms[j].rotationSpeed) / 2;
              organisms[i].rotationSpeed = avgRotSpeed * 1.2;
              organisms[j].rotationSpeed = avgRotSpeed * 1.2;
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
    const lineContrast = isDark ? adaptedConfig.lineContrast.dark : adaptedConfig.lineContrast.light;
    const vertexContrast = isDark ? adaptedConfig.vertexContrast.dark : adaptedConfig.vertexContrast.light;
    const lineAlpha = getAlphaFromContrast(lineContrast);
    const vertexAlpha = getAlphaFromContrast(vertexContrast);

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    if (adaptedConfig.blur > 0) {
      ctx.filter = `blur(${adaptedConfig.blur}px)`;
    } else {
      ctx.filter = 'none';
    }

    applyProximityInteractions();

    if (timestamp - lastEvolutionTime > adaptedConfig.evolutionInterval) {
      const randomOrg = organisms[Math.floor(Math.random() * organisms.length)];
      if (randomOrg && Math.random() < 0.15) {
        randomOrg.evolve(adaptedConfig.maxVertices);
      }
      lastEvolutionTime = timestamp;
    }

    organisms.forEach((org) => {
      org.update(logicalWidth, logicalHeight);
      org.draw(ctx!, strokeColor, lineAlpha, vertexAlpha);
    });

    drawConnections(ctx, organisms, adaptedConfig, isDark);

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
