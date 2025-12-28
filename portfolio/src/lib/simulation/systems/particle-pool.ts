import type { Particle } from '../types';

export class ParticlePool {
  private pool: Particle[] = [];
  private active: Particle[] = [];
  private maxPoolSize: number;
  private maxActive: number;

  constructor(maxPoolSize: number = 200, maxActive: number = 80) {
    this.maxPoolSize = maxPoolSize;
    this.maxActive = maxActive;
    
    for (let i = 0; i < Math.min(20, maxPoolSize); i++) {
      this.pool.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      life: 0,
      maxLife: 0,
      depth: 0,
    };
  }

  acquire(): Particle | null {
    if (this.active.length >= this.maxActive) {
      return null;
    }

    let particle: Particle;
    if (this.pool.length > 0) {
      particle = this.pool.pop()!;
    } else {
      particle = this.createParticle();
    }

    this.active.push(particle);
    return particle;
  }

  release(particle: Particle): void {
    const index = this.active.indexOf(particle);
    if (index !== -1) {
      this.active.splice(index, 1);
      if (this.pool.length < this.maxPoolSize) {
        particle.life = 0;
        this.pool.push(particle);
      }
    }
  }

  releaseAt(index: number): void {
    if (index >= 0 && index < this.active.length) {
      const particle = this.active.splice(index, 1)[0];
      if (this.pool.length < this.maxPoolSize) {
        particle.life = 0;
        this.pool.push(particle);
      }
    }
  }

  getActive(): Particle[] {
    return this.active;
  }

  getActiveCount(): number {
    return this.active.length;
  }

  getPooledCount(): number {
    return this.pool.length;
  }

  clear(): void {
    this.pool.push(...this.active);
    this.active = [];
  }
}

export function initParticle(
  particle: Particle,
  x: number,
  y: number,
  vx: number,
  vy: number,
  size: number,
  maxLife: number,
  depth: number
): void {
  particle.x = x;
  particle.y = y;
  particle.vx = vx;
  particle.vy = vy;
  particle.size = size;
  particle.life = 1;
  particle.maxLife = maxLife;
  particle.depth = depth;
}
