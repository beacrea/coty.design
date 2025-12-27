# Coty Design Portfolio Clone

## Overview
A pixel-perfect clone of coty.design portfolio built with Svelte + Vite. This project implements a modern, responsive portfolio with OKLCH color space support, DTCG v2025.10 compliant design tokens, and comprehensive SEO.

## Current State
- Full Svelte + Vite project setup
- OKLCH color system with light/dark themes
- All components implemented: ThemeToggle, Opener, Section, BulletList, ConnectSection, Footer
- Responsive design with sm/md/lg breakpoints
- PWA manifest and SEO meta tags included
- AI agent detection utilities ready

## Recent Changes
- December 27, 2025: Accessibility improvements - focus states, skip link, prefers-reduced-motion, optimized content width (580px/640px), improved caption contrast
- December 27, 2025: Complete portfolio implementation with AI agent detection, DTCG token files, and variable font support

## Project Architecture

### Tech Stack
- **Framework**: Svelte 4 with Vite 5
- **Language**: TypeScript
- **Styling**: CSS with OKLCH color space and CSS custom properties
- **Typography**: Red Hat Mono (Google Fonts)

### File Structure
```
├── src/
│   ├── App.svelte           # Main app component
│   ├── main.ts              # Entry point
│   ├── app.css              # Design tokens and global styles
│   ├── components/          # UI components
│   │   ├── ThemeToggle.svelte
│   │   ├── Opener.svelte
│   │   ├── Section.svelte
│   │   ├── BulletList.svelte
│   │   ├── ConnectSection.svelte
│   │   └── Footer.svelte
│   ├── lib/                 # Utilities
│   │   ├── content.ts       # Site content data
│   │   └── agent-detection.ts  # AI crawler detection with enhanced JSON-LD
│   ├── stores/              # Svelte stores
│   │   └── theme.ts         # Theme state management
│   └── tokens/              # DTCG v2025.10 design tokens
│       ├── colors.tokens.json
│       ├── typography.tokens.json
│       ├── spacing.tokens.json
│       └── components.tokens.json
├── public/
│   ├── manifest.json        # PWA manifest
│   └── favicon.svg
└── index.html               # HTML template with SEO
```

### Design Token System
- Uses OKLCH color space for perceptual uniformity
- Responsive typography scale (Minor Third 1.2)
- Three breakpoints: sm (<640px), md (640-1024px), lg (>1024px)
- Theme colors transition smoothly between light/dark modes

### Key Features
1. **Theme Toggle**: Fixed position, animated sun/moon icons, localStorage persistence
2. **OKLCH Colors**: All colors use oklch() for consistent appearance
3. **Responsive**: Mobile-first with fluid typography
4. **SEO Ready**: Open Graph, Twitter Card, JSON-LD Person schema
5. **PWA**: Web app manifest for installability
6. **AI Detection**: isbot library for crawler detection
7. **Accessibility**: Skip-to-content link, focus-visible states, prefers-reduced-motion support, WCAG contrast ratios

## User Preferences
- Use Svelte (not React)
- OKLCH color space is required
- Follow DTCG v2025.10 specification
- Red Hat Mono typography

## Development
- Run: `npm run dev` (starts on port 5000)
- Build: `npm run build`
