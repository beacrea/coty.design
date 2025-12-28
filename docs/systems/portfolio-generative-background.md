# Portfolio Generative Background System

> Comprehensive technical documentation for the canvas-based generative background in the portfolio site.

**Component**: `portfolio/src/components/GenerativeBackground.svelte`  
**Simulation Core**: `portfolio/src/lib/simulation/`  
**Configuration**: `portfolio/src/lib/generative-config.ts`  
**Last Updated**: 2025-12-28

## Architecture Overview

The simulation uses an ECS-lite (Entity-Component-System) architecture for maintainability and extensibility:

```
portfolio/src/lib/simulation/
├── types.ts              # All entity interfaces (OrganismData, Particle, etc.)
├── state.ts              # Factory functions for creating entities
├── Simulation.ts         # Main orchestrator class
├── index.ts              # Public exports
├── systems/              # Behavior systems
│   ├── movement.ts       # Organism movement, tendril updates
│   ├── flocking.ts       # Boids algorithm, collision separation
│   ├── interactions.ts   # Evolve, morph, fuse, burst interactions
│   ├── particles.ts      # Particle spawning and updates
│   ├── food.ts           # Food source logic
│   ├── chainlinks.ts     # Chain link management
│   ├── user-input.ts     # Pointer tracking, hover detection, grab physics
│   ├── deformation.ts    # Vertex deformation and spring relaxation
│   ├── organelles.ts     # Internal organelle behavior and stat modifiers
│   ├── particle-pool.ts  # Object pooling (ready for optimization)
│   └── chainlink-pool.ts # Object pooling (ready for optimization)
└── renderers/            # Drawing logic
    ├── organisms.ts      # Organism rendering (with organelles)
    ├── particles.ts      # Particle rendering
    ├── chainlinks.ts     # Chain link rendering
    └── food.ts           # Food source rendering
```

### Key Design Decisions

- **Separation of concerns**: State, systems, and rendering are decoupled
- **Data-oriented**: Entities are plain objects, not classes with behavior
- **Immutable-friendly**: Systems operate on state without side effects where possible
- **Pooling-ready**: Particle and chain link pools prepared for future optimization
- **Spatial hashing**: Efficient O(k) neighbor queries for hover detection and collisions
- **User interaction**: Direct manipulation through pointer events with physics-based response

---

## Table of Contents

1. [Purpose & Design Goals](#purpose--design-goals)
2. [System Overview](#system-overview)
3. [Architectural Components](#architectural-components)
4. [User Interactions](#user-interactions)
5. [Organelles System](#organelles-system)
6. [Behavioral Systems](#behavioral-systems)
7. [Visual Effects](#visual-effects)
8. [Configuration Reference](#configuration-reference)
9. [Rendering & Performance](#rendering--performance)
10. [Extension Points](#extension-points)
11. [Maintenance Playbook](#maintenance-playbook)
12. [Related Documentation](#related-documentation)

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
- **Death**: Organism dies when size < 80% of minSize or vertices < 3
- **Accelerated decay**: Organisms near minSize (within 120%) decay at 2× normal rate
- **Respawn**: New organisms spawn from screen edges based on population controller
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

## User Interactions

The simulation supports direct manipulation of organisms through pointer events, creating an engaging tactile experience.

### Grab and Drag

Users can click/tap and drag organisms around the canvas:

- **Detection**: Spatial hash enables efficient nearest-organism lookup
- **Physics**: Spring-based connection between pointer and organism
- **Behavior**: Grabbed organisms are excluded from flocking forces
- **Release**: Organisms retain momentum from drag velocity

**Configuration:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `grabSpringStiffness` | 0.12 | How tightly organism follows pointer |
| `grabSpringDamping` | 0.88 | Velocity damping during grab |

### Hover Effects

Organisms respond to pointer proximity:

- **Detection**: Pointer position tracked continuously via `pointermove`
- **Visual**: Subtle glow intensifies as pointer approaches
- **Scale**: Hovered organisms grow slightly (1.05× scale)
- **Transition**: Smooth easing in/out controlled by `hoverEaseSpeed`

### Soft Body Collisions

Organisms push each other with deformable boundaries:

- **Per-vertex deformation**: Each vertex tracks individual displacement
- **Spring relaxation**: Vertices return to rest position over time
- **Visual feedback**: Organism shapes visibly squish on contact

**Configuration:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `softCollisionStrength` | 0.5 | Push force on collision |
| `deformationStiffness` | 0.15 | How quickly vertices restore |
| `deformationDamping` | 0.92 | Smooths deformation animation |
| `maxDeformation` | 0.35 | Maximum vertex displacement (fraction of size) |

### Spatial Hashing

For efficient proximity queries:

- **Cell size**: ~60 pixels (adaptive)
- **Operations**: Insert, query neighbors, clear
- **Use cases**: Hover detection, collision checks, nearest-organism lookup
- **Performance**: O(k) where k = organisms in neighboring cells

---

## Organelles System

Organisms can contain internal organelles that grant stat modifiers and visual variety.

### Organelle Types

| Type | Weight | Visual | Effect |
|------|--------|--------|--------|
| **Nucleus** | 18% | Large central circle | +12% glow, -15% decay |
| **Mitochondria** | 28% | Oval/bean shape | +12% speed |
| **Vacuole** | 22% | Irregular blob | -3% speed, -25% decay |
| **Chloroplast** | 18% | Stacked discs | +20% glow |
| **Ribosome** | 14% | Small dot cluster | +4% speed |

### Lifecycle

1. **Spawn**: 25% chance per organism at creation (0-3 initial organelles)
2. **Food grant**: 12% chance to gain organelle when eating
3. **Merge transfer**: 60% chance to inherit organelles during merge/fuse
4. **Maximum**: 5 organelles per organism

### Rendering

Organelles are drawn inside the organism body:

- **Position**: Distributed around organism center with rotation
- **Animation**: Gentle pulsing and orbital movement
- **Depth**: Rendered before organism outline for proper layering

### Stat Modifiers

Organelle effects stack additively:

```
effectiveSpeed = baseSpeed × (1 + Σ speedMod)
effectiveDecay = baseDecay × (1 + Σ decayMod)  
glowBonus = Σ glowMod
```

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

All interactions trigger subtle bioluminescence glow (0.15-0.3 intensity).

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

- **Trigger sources**: Eating food (0.12), interactions (0.15-0.3)
- **Rendering**: Radial gradient around organism center, clamped to 40% max intensity
- **Radius**: 1.1-1.18× organism bounding radius (subtle halo)
- **Opacity**: 10% of glow value (very subtle effect)
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

  // Population control
  populationTarget: number;        // Default: 16 — desired organism count
  populationAggressiveness: number; // Default: 0.5 (0-1) — how strongly to push toward target
  populationDensityPerPixel: number; // Default: 90000 — pixels per organism
  populationMinTarget: number;     // Default: 8 — minimum organisms
  populationMaxTarget: number;     // Default: 40 — maximum organisms

  // Organelles
  organelleSpawnChance: number;    // Default: 0.25 — chance to spawn with organelles
  organelleMaxPerOrganism: number; // Default: 5 — max organelles per organism
  organelleFoodGrantChance: number; // Default: 0.12 — chance to gain on eating
  organelleMergeTransferChance: number; // Default: 0.6 — chance to inherit on merge

  // User interaction
  grabSpringStiffness: number;     // Default: 0.12 — grab follow tightness
  grabSpringDamping: number;       // Default: 0.88 — grab velocity damping
  softCollisionStrength: number;   // Default: 0.5 — collision push force
  hoverEaseSpeed: number;          // Default: 0.08 — hover transition speed
  deformationStiffness: number;    // Default: 0.15 — vertex spring restoration
  deformationDamping: number;      // Default: 0.92 — deformation smoothing
  maxDeformation: number;          // Default: 0.35 — max vertex displacement
}
```

### Population Control System

The simulation uses a proportional controller to maintain organism density:

**Parameters:**
- `populationTarget` — The desired number of organisms (default: 16)
- `populationAggressiveness` — How strongly to push toward target (0-1, default: 0.5)
- `populationDensityPerPixel` — Pixels per organism for dynamic scaling (default: 90000)
- `populationMinTarget` — Minimum organisms regardless of screen size (default: 8)
- `populationMaxTarget` — Maximum organisms cap (default: 40)

**Dynamic Population Scaling:**

Population target is calculated based on viewport area:
```
dynamicTarget = round(viewportArea / densityPerPixel)
clampedTarget = clamp(dynamicTarget, minTarget, maxTarget)
```

This ensures consistent visual density across devices:
- Small phone (375×667): ~8 organisms
- Tablet (768×1024): ~8-9 organisms  
- Desktop (1920×1080): ~23 organisms
- Large monitor (2560×1440): ~40 organisms (capped)

**How it works:**

1. **Error calculation**: `error = (target - currentCount) / target`

2. **Birth pressure** (when below target):
   - Accumulates fractionally each frame based on error and aggressiveness
   - When accumulator reaches 1+, spawns organisms (up to 3 per frame)
   - Higher aggressiveness = faster spawning

3. **Death pressure** (when above target):
   - Increases decay rate multiplier for all organisms
   - Uses exponential smoothing to prevent oscillations
   - Higher aggressiveness = faster culling

**Aggressiveness tuning:**
- `0.2` — Gentle, population drifts slowly toward target
- `0.5` — Balanced (default), responsive but stable
- `0.8` — Aggressive, quickly snaps to target

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
- **Resize handling**: Preserves simulation state, scales entity positions proportionally

### Optimization Strategies

1. **Spatial hashing** — O(k) neighbor queries for hover detection and soft body collisions
2. **Particle culling** — Particles removed when life depletes
3. **Chain link cleanup** — Broken links removed each frame
4. **Adaptive config** — Dynamic population scaling based on viewport area
5. **Avoid allocations** — Flocking skips grabbed organisms via index check, not array filter

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
