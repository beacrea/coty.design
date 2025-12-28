import type { FoodSource, SimulationConfig } from '../types';

export function drawFoodSources(
  ctx: CanvasRenderingContext2D,
  foodSources: FoodSource[],
  cfg: SimulationConfig,
  strokeColor: string,
  baseAlpha: number,
  isDark: boolean
): void {
  foodSources.forEach((food) => {
    if (!food.active) return;
    
    const pulse = 1 + Math.sin(food.pulsePhase) * 0.2;
    const size = cfg.foodSize * pulse;
    
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
  });
}
