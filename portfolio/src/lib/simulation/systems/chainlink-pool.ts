import type { ChainLink } from '../types';

export class ChainLinkPool {
  private pool: ChainLink[] = [];
  private active: ChainLink[] = [];
  private maxPoolSize: number;
  private maxActive: number;

  constructor(maxPoolSize: number = 50, maxActive: number = 20) {
    this.maxPoolSize = maxPoolSize;
    this.maxActive = maxActive;
    
    for (let i = 0; i < Math.min(10, maxPoolSize); i++) {
      this.pool.push(this.createChainLink());
    }
  }

  private createChainLink(): ChainLink {
    return {
      orgAIndex: 0,
      orgBIndex: 0,
      strength: 0,
      age: 0,
      maxAge: 0,
    };
  }

  acquire(): ChainLink | null {
    if (this.active.length >= this.maxActive) {
      return null;
    }

    let link: ChainLink;
    if (this.pool.length > 0) {
      link = this.pool.pop()!;
    } else {
      link = this.createChainLink();
    }

    this.active.push(link);
    return link;
  }

  release(link: ChainLink): void {
    const index = this.active.indexOf(link);
    if (index !== -1) {
      this.active.splice(index, 1);
      if (this.pool.length < this.maxPoolSize) {
        link.age = 0;
        link.strength = 0;
        this.pool.push(link);
      }
    }
  }

  releaseAt(index: number): void {
    if (index >= 0 && index < this.active.length) {
      const link = this.active.splice(index, 1)[0];
      if (this.pool.length < this.maxPoolSize) {
        link.age = 0;
        link.strength = 0;
        this.pool.push(link);
      }
    }
  }

  getActive(): ChainLink[] {
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

  findExisting(orgAIndex: number, orgBIndex: number): ChainLink | undefined {
    return this.active.find(
      (c) => (c.orgAIndex === orgAIndex && c.orgBIndex === orgBIndex) || 
             (c.orgAIndex === orgBIndex && c.orgBIndex === orgAIndex)
    );
  }
}

export function initChainLink(
  link: ChainLink,
  orgAIndex: number,
  orgBIndex: number
): void {
  link.orgAIndex = orgAIndex;
  link.orgBIndex = orgBIndex;
  link.strength = 1;
  link.age = 0;
  link.maxAge = 120 + Math.floor(Math.random() * 60);
}
