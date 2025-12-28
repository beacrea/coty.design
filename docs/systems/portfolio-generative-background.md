# Portfolio Generative Background System

> Comprehensive technical documentation for the canvas-based generative background in the portfolio site.

**Component**: `portfolio/src/components/GenerativeBackground.svelte`  
**Configuration**: `portfolio/src/lib/generative-config.ts`  
**Last Updated**: 2025-12-28

---

## Table of Contents

1. [Purpose & Design Goals](#purpose--design-goals)
2. [System Overview](#system-overview)
3. [Architectural Components](#architectural-components)
4. [Behavioral Systems](#behavioral-systems)
5. [Visual Effects](#visual-effects)
6. [Configuration Reference](#configuration-reference)
7. [Rendering & Performance](#rendering--performance)
8. [Extension Points](#extension-points)
9. [Maintenance Playbook](#maintenance-playbook)
10. [Related Documentation](#related-documentation)

---

## Purpose & Design Goals

The generative background creates a subtle, living backdrop that evokes an underwater or fluid environment. It serves as visual texture rather than a focal point, enhancing the portfolio's organic, contemplative aesthetic without distracting from content.

### Design Principles

- **Subtlety over spectacle** — Movement is slow and gentle; organisms drift rather than dart
- **Organic behavior** — Flocking, feeding, and interactions create emergent lifelike patterns
- **Depth and atmosphere** — Layered opacity and bioluminescence suggest 3D space
- **Responsive adaptation** — Scales gracefully across screen sizes and device capabilities
- **Theme-aware** — Integrates with light/dark mode through configurable contrast ratios

---

## System Overview

The background consists of several interacting systems rendered on an HTML5 canvas:

```
┌─────────────────────────────────────────────────────────────┐
│                    Canvas Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Organisms          Particles           Food Sources        │
│  ├─ Main body       ├─ Environmental    ├─ Attraction      │
│  ├─ Lobes             │  bubbles          │  points         │
│  ├─ Tendrils        ├─ Propulsion       └─ Respawn logic   │
│  ├─ Spokes            │  bubbles                            │
│  └─ Glow            └─ Trailing                             │
│                        particles                             │
├─────────────────────────────────────────────────────────────┤
│  Connections        Chain Links         Flow Field          │
│  └─ Inter-organism  └─ Temporary        └─ Perlin-like     │
│     lines              bonds               currents         │
└─────────────────────────────────────────────────────────────┘
```

### Render Loop

Each animation frame:
1. Clear canvas
2. Update flow field time
3. Spawn/update environmental bubbles
4. Update food sources (respawn, attraction)
5. Apply flocking forces to organisms
6. Apply proximity interactions between organisms
7. Update organism positions, rotations, glow decay
8. Handle organism-bubble collisions
9. Draw all elements (depth-sorted by opacity)
10. Clean up expired particles and chain links

---

## Architectural Components

### Organisms

Primary visual elements — geometric polygons (3-8 vertices) that float, interact, and evolve.

```typescript
interface Organism {
  x, y: number;              // Position
  vx, vy: number;            // Velocity
  size: number;              // Base radius
  vertices: Vertex[];        // Polygon shape
  rotation: number;          // Current angle
  rotationSpeed: number;     // Angular velocity
  depth: number;             // 0-1, affects opacity
  glow: number;              // 0-1, bioluminescence intensity
  hue: number;               // HSL hue for observation mode coloring
  lobes: Lobe[];             // Attached appendages
  tendril: Tendril | null;   // Temporary reaching line
  spokeIntensity: number;    // Internal spoke visibility
  // ... additional properties
}
```

**Lifecycle**:
- Initialize with random position, velocity, and 3-5 vertices
- May spawn with 0-3 initial lobes (25% chance)
- Evolve over time (gain vertices) or through interactions
- Can simplify (lose vertices) during certain interactions
- Bounding radius capped at `maxSize × 1.5` (42px default)
- **Death**: Organism dies when size < 60% of minSize or vertices < 3
- **Respawn**: New organisms spawn from screen edges to maintain population count
- **Death particles**: 8 particles spawn at death location

### Lobes

Secondary polygon appendages attached to organisms.

```typescript
interface Lobe {
  offsetAngle: number;       // Angle from organism center
  offsetDistance: number;    // Distance as fraction of organism size
  vertices: Vertex[];        // Lobe polygon shape
  rotationOffset: number;    // Rotation relative to parent
  size: number;              // Size multiplier
}
```

**Behavior**:
- Inherit parent organism's depth for consistent opacity
- Can be absorbed/transferred between organisms during interactions
- Maximum 5 lobes per organism

### Particles

Small visual elements for atmosphere and feedback.

```typescript
interface Particle {
  x, y: number;
  vx, vy: number;
  size: number;              // 0.15-1.8px
  life: number;              // 0-1, current
  maxLife: number;           // Frames until death
  depth: number;             // For opacity calculation
}
```

**Types**:
- **Environmental bubbles** — Spawn from edges/interior, follow flow field
- **Propulsion bubbles** — Emit from rear of moving organisms
- **Trailing particles** — Spawn during burst/simplify interactions

### Food Sources

Attraction points that trigger competitive behavior.

```typescript
interface FoodSource {
  x, y: number;
  active: boolean;
  respawnAt: number;         // Timestamp for respawn
}
```

**Mechanics**:
- Organisms accelerate toward nearest active food (up to 2× normal speed)
- Eating triggers growth, glow, and possible evolution/lobe growth
- Respawns after configurable delay

### Chain Links

Temporary wobbling connections between organisms.

```typescript
interface ChainLink {
  orgA: Organism;
  orgB: Organism;
  life: number;
  phase: number;             // For wobble animation
  maxStretch: number;
}
```

**Behavior**:
- Form during morph/pulse interactions
- Wobble with sinusoidal animation
- Break when stretched beyond threshold or expired

### Flow Field

Perlin-noise-like vector field for environmental bubble movement.

```typescript
function getFlowField(x: number, y: number, time: number): { vx, vy }
```

- Creates organic, swirling current patterns
- Time-varying for continuous evolution
- Environmental bubbles follow field with slight randomness

---

## Behavioral Systems

### Passive/Idle Behavior

When not pursuing food or interacting, organisms exhibit gentle passive behaviors:

- **Wandering**: Gradual random direction changes via `wanderAngle`
- **Bobbing**: Subtle sinusoidal drift (different frequencies for X/Y)
- **Pausing**: Occasional stops (0.08% chance per frame, 1-3 second duration)
- **Direction shifts**: New random heading after pause ends

These behaviors create organic, lifelike movement even in calm periods.

### Flocking (Boids Algorithm)

Organisms exhibit classic boids-style emergent flocking:

| Force | Description | Strength |
|-------|-------------|----------|
| **Cohesion** | Move toward center of nearby neighbors | 0.0008 per neighbor |
| **Alignment** | Match velocity direction with neighbors | 0.003 |
| **Separation** | Avoid collisions with other organisms | 0.025 (overlap-based) |

**Range**: Flocking distance = `connectionDistance × 0.8`

### Food Competition

When food sources are present, organisms shift from passive to active behavior:

- **Attraction**: Accelerate toward nearest food source
- **Speed boost**: Up to 2× normal max speed when approaching food
- **Aggression**: More frequent interactions near food

### Proximity Interactions

When organisms come within `mergeDistance`, random interactions may trigger:

| Interaction | Probability | Effect |
|-------------|-------------|--------|
| **Evolve** | 10% | Gain a vertex, grow tendril toward other |
| **Morph** | 25% | Transfer vertices between organisms |
| **Incorporate** | 20% | Larger absorbs mass/lobes from smaller |
| **Fuse** | 17% | Major merge of lobes and properties |
| **Burst** | 10% | Repel apart with particle spray |
| **Lobe Exchange** | 8% | Transfer or create lobes |
| **Pulse/Spin** | 10% | Size pulse and rotation sync |

All interactions trigger bioluminescence glow (0.4-0.7 intensity).

---

## Visual Effects

### Observation Mode

A viewing mode activated by clicking the crystal ball icon that reveals organism colors:

- **Content Mode** (default): Organisms render in achromatic grayscale to minimize visual distraction from portfolio content
- **Observation Mode**: Organisms display their unique hues from an underwater-themed color palette

**Color Palette**:
Organisms are assigned hues from an underwater palette during initialization:
- Teals (165-195): Sea glass, shallow water
- Blues (195-225): Ocean depth, twilight water
- Indigos (225-260): Deep sea, bioluminescent zones
- Purples (260-280): Abyssal, exotic species

Each hue includes ±10 degrees of variation for natural diversity.

**Rendering in Observation Mode**:

Colors are theme-aware for optimal contrast:

*Dark Theme* (organisms should pop against dark background):
```
saturation = 70% + (depth × 20%)  // 70-90%
lightness = 62% + (depth × 20%)   // 62-82%
```

*Light Theme* (organisms as colored silhouettes):
```
saturation = 70% + (depth × 20%)  // 70-90%
lightness = 18% + (depth × 12%)   // 18-30%
```

Deeper organisms appear more vivid; shallower ones are softer.

**Enhanced Visibility**:
In observation mode, visual elements are slightly emphasized:
- Stroke width: 1.4px (main body), 1.0px (lobes) vs 1px/0.8px normally
- Vertex radius: 2.2px (main), 1.7px (lobes) vs 2px/1.5px normally
- Glow alpha: 0.25 vs 0.15 normally

### Bioluminescence

Organisms glow when stimulated:

- **Trigger sources**: Eating food (0.8), interactions (0.4-0.7)
- **Rendering**: Radial gradient around organism center
- **Decay**: 96% per frame (soft fade over ~25 frames)
- **Color**: Theme-aware, matches organism stroke color (or hue in observation mode)

### Depth Layers

3D parallax effect through opacity variation:

```
opacity = baseOpacity × (0.4 + depth × 0.6)
```

- `depth = 0` → 40% opacity (far/faded)
- `depth = 1` → 100% opacity (near/vivid)
- Applied to: organisms, lobes, tendrils, particles

### Environmental Bubbles

Ambient particles creating underwater atmosphere:

- **Edge spawns**: 50% chance of 1, 20% chance of 2 per frame
- **Interior spawns**: 25% chance per frame
- **Size distribution**:
  - 40% tiny (0.2-0.5px)
  - 35% small (0.4-0.9px)
  - 17% medium (0.8-1.4px)
  - 8% larger (1.2-1.8px)
- **Lifespan**: 600-1400 frames
- **Movement**: Flow field + organism displacement

### Propulsion Bubbles

Sparse particles emitted from moving organisms:

- **Spawn chance**: 8% × (speed/maxSpeed)²
- **Position**: Rear of organism (opposite velocity)
- **Lifespan**: 30-50 frames
- **Inherit**: Parent organism's depth value

---

## Configuration Reference

All configuration lives in `generative-config.ts`:

### WorldConfig Interface

```typescript
interface WorldConfig {
  // Organism population
  organismCount: number;        // Default: 16
  minSize: number;              // Default: 8
  maxSize: number;              // Default: 28
  sizeVariation: number;        // Default: 0.35

  // Movement
  minSpeed: number;             // Default: 0.01
  maxSpeed: number;             // Default: 0.04

  // Interaction ranges
  connectionDistance: number;   // Default: 150
  mergeDistance: number;        // Default: 55

  // Morphology
  minStartVertices: number;     // Default: 3
  maxStartVertices: number;     // Default: 5
  maxVertices: number;          // Default: 8

  // Evolution timing
  evolutionInterval: number;    // Default: 2500ms
  evolutionChance: number;      // Default: 0.15
  interactionChance: number;    // Default: 0.65

  // Food system
  foodSourceCount: number;      // Default: 3
  foodAttractionStrength: number; // Default: 0.015
  foodSize: number;             // Default: 3
  foodRespawnTime: number;      // Default: 4000ms
  foodSpawnInterval: number;    // Default: 3000ms
  maxFoodSources: number;       // Default: 6

  // Visual theming
  lineContrast: { light: number; dark: number };
  vertexContrast: { light: number; dark: number };
  blur: number;                 // Default: 0
}
```

### Adaptive Configuration

The component adapts config based on viewport:

- **Mobile** (`width < 768`): Reduced organism count, slower speeds
- **Small mobile** (`width < 480`): Further reductions
- **Large screens**: Full configuration

---

## Rendering & Performance

### Canvas Setup

- **Device pixel ratio**: Capped at 2× for performance
- **Logical vs physical**: Canvas scales for retina while maintaining logical coordinates
- **Resize handling**: Full re-initialization on viewport change

### Optimization Strategies

1. **Spatial partitioning** — Not currently implemented; viable for higher organism counts
2. **Particle culling** — Particles removed when life depletes
3. **Chain link cleanup** — Broken links removed each frame
4. **Adaptive config** — Fewer organisms on smaller/less capable devices

### Performance Targets

- **60 FPS** on modern desktop browsers
- **30+ FPS** on mobile devices
- **Graceful degradation** when framerates drop

---

## Extension Points

### Adding New Interaction Types

1. Add case in `applyProximityInteractions()` switch
2. Define probability threshold
3. Implement organism method if complex
4. Trigger glow and particles as appropriate

### Adding New Particle Types

1. Define spawn function (similar to `spawnBubbleStream`)
2. Add to particle update loop if special behavior needed
3. Use existing `drawParticles()` or add custom draw

### Modifying Flocking Behavior

Tune constants in `applyProximityInteractions()`:
- `flockingDistance` — Range for neighbor detection
- `cohesionStrength` — Pull toward group center
- `alignmentStrength` — Velocity matching strength

---

## Maintenance Playbook

### Common Adjustments

| Goal | Adjust |
|------|--------|
| Slower/calmer feel | Reduce `minSpeed`, `maxSpeed` |
| More active scene | Increase `interactionChance`, `organismCount` |
| Subtler background | Reduce contrast ratios, increase blur |
| More depth effect | Widen the `0.4 + depth × 0.6` range |
| More bubbles | Increase spawn chances in `spawnAmbientBubbles()` |

### Debugging Tips

1. **Organisms not moving**: Check velocity bounds, flocking forces
2. **No interactions**: Verify `mergeDistance` relative to organism sizes
3. **Glow not visible**: Check `glowIntensity` decay rate, base contrast
4. **Performance issues**: Reduce `organismCount`, particle lifespans

### Testing Checklist

- [ ] Light/dark theme transitions
- [ ] Window resize handling
- [ ] Mobile viewport performance
- [ ] Long-running stability (10+ minutes)
- [ ] Interaction visual feedback

---

## Related Documentation

- **[DER-005: Convergence](../eras/DER-005-convergence.md)** — Design philosophy for v5.0
- **[replit.md](../../replit.md)** — Quick reference summary
- **[portfolio/replit.md](../../portfolio/replit.md)** — Portfolio-specific context

---

*This document is the authoritative reference for the generative background system. For quick summaries, see the Generative Background section in `replit.md`.*
