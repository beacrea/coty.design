<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '../stores/theme';
  import { defaultWorldConfig, type WorldConfig } from '../lib/generative-config';
  import { Simulation } from '../lib/simulation/Simulation';

  export let config: WorldConfig = defaultWorldConfig;
  export let enhancedContrast: boolean = false;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number;
  let simulation: Simulation | null = null;
  let isVisible = true;
  let prefersReducedMotion = false;
  let dpr = 1;
  let logicalWidth = 0;
  let logicalHeight = 0;
  let adaptedConfig: WorldConfig;
  let motionQuery: MediaQueryList | null = null;
  let motionHandler: ((e: MediaQueryListEvent) => void) | null = null;

  function getAdaptedConfig(): WorldConfig {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;
    const isMobile = width < 768;
    const isSmallMobile = width < 480;
    
    let speedMultiplier = 1;
    let connectionMultiplier = 1;
    
    if (isSmallMobile) {
      speedMultiplier = 0.7;
      connectionMultiplier = 0.6;
    } else if (isMobile) {
      speedMultiplier = 0.8;
      connectionMultiplier = 0.75;
    }
    
    const densityPerPixel = config.populationDensityPerPixel || 90000;
    const minTarget = config.populationMinTarget || 8;
    const maxTarget = config.populationMaxTarget || 40;
    const dynamicTarget = Math.round(area / densityPerPixel);
    const clampedTarget = Math.max(minTarget, Math.min(maxTarget, dynamicTarget));
    
    return {
      ...config,
      organismCount: clampedTarget,
      populationTarget: clampedTarget,
      minSpeed: config.minSpeed * speedMultiplier,
      maxSpeed: config.maxSpeed * speedMultiplier,
      connectionDistance: config.connectionDistance * connectionMultiplier,
      mergeDistance: config.mergeDistance * connectionMultiplier,
    };
  }

  function resizeCanvas(): void {
    if (!canvas || !ctx) return;
    
    logicalWidth = window.innerWidth;
    logicalHeight = window.innerHeight;
    
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    adaptedConfig = getAdaptedConfig();
    
    if (simulation) {
      simulation.resize(logicalWidth, logicalHeight);
      simulation.updateConfig(adaptedConfig);
    } else {
      simulation = new Simulation(logicalWidth, logicalHeight, adaptedConfig);
    }
  }

  function handleVisibilityChange(): void {
    isVisible = document.visibilityState === 'visible';
    if (isVisible && !animationId) {
      animationId = requestAnimationFrame(animate);
    }
  }

  function animate(timestamp: number): void {
    if (!ctx || !simulation || !isVisible || prefersReducedMotion) {
      animationId = 0;
      return;
    }

    const isDark = $theme === 'dark';
    
    simulation.tick(timestamp);
    simulation.render(ctx, isDark, enhancedContrast, enhancedContrast);

    animationId = requestAnimationFrame(animate);
  }
  
  function getCanvasCoords(e: MouseEvent | Touch): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top)
    };
  }
  
  function handlePointerDown(e: PointerEvent): void {
    if (!simulation) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    if (simulation.beginGrab(coords.x, coords.y, e.pointerId)) {
      canvas.setPointerCapture(e.pointerId);
    }
  }
  
  function handlePointerMove(e: PointerEvent): void {
    if (!simulation) return;
    const coords = getCanvasCoords(e);
    simulation.updatePointer(coords.x, coords.y, true);
  }
  
  function handlePointerUp(e: PointerEvent): void {
    if (!simulation) return;
    e.preventDefault();
    simulation.endGrab();
    canvas.releasePointerCapture(e.pointerId);
  }
  
  function handlePointerLeave(): void {
    if (!simulation) return;
    simulation.updatePointer(0, 0, false);
    simulation.endGrab();
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

<canvas 
  bind:this={canvas} 
  class="generative-background"
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerLeave}
  on:pointercancel={handlePointerLeave}
></canvas>

<style>
  .generative-background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: auto;
    touch-action: none;
    cursor: grab;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  .generative-background:active {
    cursor: grabbing;
  }
</style>
