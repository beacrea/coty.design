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
    
    const fadeIn = food.fadeIn ?? 1;
    const pulse = 1 + Math.sin(food.pulsePhase) * 0.15;
    const size = cfg.foodSize * pulse * (0.5 + fadeIn * 0.5);
    
    if (observationMode) {
      const lightness = isDark ? 60 : 45;
      const saturation = 65;
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size * 1.8, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${food.hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.25 * fadeIn})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${food.hue}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.8 * fadeIn})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeColor}, ${baseAlpha * 0.6 * fadeIn})`;
      ctx.fill();
    }
  });
}
