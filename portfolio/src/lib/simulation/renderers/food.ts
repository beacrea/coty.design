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
    
    const pulse = 1 + Math.sin(food.pulsePhase) * 0.15;
    const size = cfg.foodSize * pulse;
    
    if (observationMode) {
      const lightness = isDark ? 60 : 45;
      const saturation = 65;
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size * 1.8, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${food.hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.25})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${food.hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.8})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeColor}, ${baseAlpha * 0.6})`;
      ctx.fill();
    }
  });
}
