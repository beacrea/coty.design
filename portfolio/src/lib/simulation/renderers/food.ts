import type { FoodSource, SimulationConfig } from '../types';

export function drawFoodSources(
  ctx: CanvasRenderingContext2D,
  foodSources: FoodSource[],
  cfg: SimulationConfig,
  strokeColor: string,
  baseAlpha: number,
  isDark: boolean,
  observationMode: boolean = false
): void {
  foodSources.forEach((food) => {
    if (!food.active) return;
    
    const pulse = 1 + Math.sin(food.pulsePhase) * 0.25;
    const shimmer = Math.sin(food.pulsePhase * 2.5) * 0.15 + 1;
    const size = cfg.foodSize * pulse;
    
    if (observationMode) {
      const lightness = isDark ? 65 : 45;
      const saturation = 75 + Math.sin(food.pulsePhase * 1.5) * 10;
      const glowLightness = isDark ? 55 : 35;
      
      const gradient = ctx.createRadialGradient(food.x, food.y, 0, food.x, food.y, size * 4);
      gradient.addColorStop(0, `hsla(${food.hue}, ${saturation}%, ${glowLightness}%, ${baseAlpha * 0.5 * shimmer})`);
      gradient.addColorStop(0.4, `hsla(${food.hue}, ${saturation - 10}%, ${glowLightness}%, ${baseAlpha * 0.25})`);
      gradient.addColorStop(1, `hsla(${food.hue}, ${saturation}%, ${glowLightness}%, 0)`);
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${food.hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.9})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(food.x - size * 0.3, food.y - size * 0.3, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${food.hue}, ${saturation - 20}%, ${lightness + 20}%, ${baseAlpha * 0.5})`;
      ctx.fill();
    } else {
      const gradient = ctx.createRadialGradient(food.x, food.y, 0, food.x, food.y, size * 3);
      gradient.addColorStop(0, `rgba(${strokeColor}, ${baseAlpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${strokeColor}, 0)`);
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeColor}, ${baseAlpha * 0.8})`;
      ctx.fill();
    }
  });
}
