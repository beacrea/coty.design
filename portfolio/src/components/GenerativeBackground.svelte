<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '../stores/theme';
  import { defaultWorldConfig, type WorldConfig } from '../lib/generative-config';

  export let config: WorldConfig = defaultWorldConfig;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number;
  let organisms: Organism[] = [];
  let lastEvolutionTime = 0;

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

  function drawConnections(ctx: CanvasRenderingContext2D, organisms: Organism[], cfg: WorldConfig, isDark: boolean): void {
    const strokeColor = isDark ? cfg.strokeColor.dark : cfg.strokeColor.light;
    const baseOpacity = isDark ? cfg.lineOpacity.dark : cfg.lineOpacity.light;

    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        const dx = organisms[i].x - organisms[j].x;
        const dy = organisms[i].y - organisms[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < cfg.connectionDistance) {
          const opacity = (1 - distance / cfg.connectionDistance) * baseOpacity * 0.5;
          
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
          ctx.strokeStyle = `rgba(${strokeColor}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function initOrganisms(): void {
    organisms = [];
    for (let i = 0; i < config.organismCount; i++) {
      organisms.push(new Organism(canvas.width, canvas.height, config));
    }
  }

  function resizeCanvas(): void {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function checkProximityEvolution(): void {
    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        const dx = organisms[i].x - organisms[j].x;
        const dy = organisms[i].y - organisms[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mergeDistance) {
          const evolveChance = (1 - distance / config.mergeDistance) * config.evolutionChance;
          
          if (Math.random() < evolveChance) {
            if (organisms[i].vertices.length <= organisms[j].vertices.length) {
              organisms[i].evolve(config.maxVertices);
            } else {
              organisms[j].evolve(config.maxVertices);
            }
          }
        }
      }
    }
  }

  function animate(timestamp: number): void {
    if (!ctx) return;

    const isDark = $theme === 'dark';
    const strokeColor = isDark ? config.strokeColor.dark : config.strokeColor.light;
    const lineOpacity = isDark ? config.lineOpacity.dark : config.lineOpacity.light;
    const vertexOpacity = isDark ? config.vertexOpacity.dark : config.vertexOpacity.light;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    checkProximityEvolution();

    if (timestamp - lastEvolutionTime > config.evolutionInterval) {
      const randomOrg = organisms[Math.floor(Math.random() * organisms.length)];
      if (randomOrg && Math.random() < 0.15) {
        randomOrg.evolve(config.maxVertices);
      }
      lastEvolutionTime = timestamp;
    }

    organisms.forEach((org) => {
      org.update(canvas.width, canvas.height);
      org.draw(ctx!, strokeColor, lineOpacity, vertexOpacity);
    });

    drawConnections(ctx, organisms, config, isDark);

    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    initOrganisms();
    animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
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
