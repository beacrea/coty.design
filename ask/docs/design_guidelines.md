# Design Guidelines: ask.coty.design

## Design Approach
**Selected System**: Material Design + Linear inspiration for mobile-first chat utility
**Rationale**: This is a utility-focused Q&A application where efficiency, mobile optimization, and clarity are paramount. Material Design provides excellent mobile patterns with strong touch feedback, while Linear's minimal chat aesthetic keeps focus on conversation flow.

## Core Design Principles
1. **Mobile-First Clarity**: Every element optimized for thumb interaction on small screens
2. **Conversation Focus**: Minimize chrome, maximize message readability
3. **Streaming Feedback**: Clear visual indicators for real-time response rendering
4. **Professional Utility**: Clean, functional aesthetic that builds trust

---

## Typography System

### Font Family
- **Primary**: Inter (via Google Fonts CDN) - excellent readability at mobile sizes
- **Mono** (for code snippets if needed): JetBrains Mono

### Type Scale
- **Message Text**: text-base (16px) - primary chat content
- **User Input**: text-base (16px) - input field
- **Timestamps/Meta**: text-xs (12px) - subtle secondary info
- **Empty State**: text-lg (18px) - initial prompt/instructions
- **Button Text**: text-sm (14px) - action labels

### Weights
- Regular (400): body text, messages
- Medium (500): user messages, input labels
- Semibold (600): buttons, headers

---

## Layout System

### Spacing Primitives
**Core units**: 2, 4, 8, 12, 16 (Tailwind scale)
- Component padding: `p-4`
- Message spacing: `space-y-4`
- Section gaps: `gap-8`
- Touch target minimum: `h-12` (48px)
- Screen padding: `px-4`

### Container Structure
```
Mobile (default): max-w-full, px-4
Tablet (md:): max-w-2xl mx-auto
Desktop (lg:): max-w-3xl mx-auto
```

### Viewport Strategy
- **Full-height chat**: Use `h-screen` with proper safe-area-inset handling for iOS
- **Message area**: flex-grow container with overflow-y-auto
- **Fixed input**: Sticky bottom with proper keyboard handling

---

## Component Library

### 1. Chat Container
- Full viewport height with fixed input at bottom
- Message area: scrollable with padding for iOS safe areas
- Background: clean, minimal surface
- Top padding for status bar (iOS PWA): `pt-safe`

### 2. Message Bubbles

**User Messages**:
- Alignment: right-aligned (ml-auto)
- Max-width: `max-w-[85%]`
- Padding: `px-4 py-3`
- Border radius: `rounded-2xl rounded-tr-sm` (speech bubble effect)
- Typography: text-base, medium weight

**Assistant Messages**:
- Alignment: left-aligned
- Max-width: `max-w-[85%]`
- Padding: `px-4 py-3`
- Border radius: `rounded-2xl rounded-tl-sm`
- Typography: text-base, regular weight

**Streaming Indicator**:
- Pulsing dot animation within message bubble
- Small text: "Typing..." with subtle opacity animation

### 3. Input Area

**Layout**:
- Fixed bottom position with `pb-safe` for iOS
- Container padding: `p-4`
- Backdrop blur on iOS for elevated feel: `backdrop-blur-lg`

**Input Field**:
- Height: `h-12` minimum (large tap target)
- Padding: `px-4`
- Border radius: `rounded-full`
- Typography: text-base
- Placeholder: "Ask about Coty..."

**Send Button**:
- Size: `w-12 h-12` (circular, large tap target)
- Icon: Send arrow (Heroicons)
- Position: absolute right within input container OR adjacent button
- Border radius: `rounded-full`
- Active state: scale transform on tap

### 4. Action Buttons

**Clear Conversation**:
- Size: `h-10` with `px-4`
- Border radius: `rounded-full`
- Typography: text-sm, medium weight
- Icon: X or trash (Heroicons)
- Position: Top-right of chat header

**Copy Message**:
- Size: `h-8` with `px-3` (smaller, inline action)
- Border radius: `rounded-lg`
- Icon: clipboard (Heroicons)
- Appears on message hover (desktop) or long-press menu (mobile)

### 5. Empty State

**Layout**:
- Centered vertically and horizontally in message area
- Max-width: `max-w-md`
- Text alignment: center

**Content**:
- Primary text: "Ask me anything about Coty Beasley"
- Secondary text: "I can help with questions about experience, skills, projects, and background."
- Typography: text-lg for primary, text-sm for secondary
- Spacing: `space-y-2`

**Suggested Questions** (3-4 chips):
- Layout: flex-wrap with `gap-2`
- Chip size: `h-10` with `px-4`
- Border radius: `rounded-full`
- Typography: text-sm
- Tap to populate input field

### 6. Error States

**Connection Error**:
- Small banner at top: `h-8`
- Typography: text-xs
- Icon: warning triangle
- Auto-dismiss after 5s

**Message Failed**:
- Inline within message bubble
- Retry button: small, text-only link
- Typography: text-xs

---

## PWA-Specific Considerations

### Safe Areas (iOS)
- Use `env(safe-area-inset-top)` for header
- Use `env(safe-area-inset-bottom)` for input area
- Padding: `pt-safe`, `pb-safe` utilities

### Splash Screen
- Centered icon (512x512)
- App name below: "ask.coty"
- Clean, minimal background

### Standalone Mode
- Remove any browser chrome references
- Full-height layout assumes no URL bar

---

## Interaction Patterns

### Streaming Responses
- Messages appear with fade-in animation
- Text renders character-by-character OR word-by-word (smoother)
- Cursor/dot indicator during streaming
- Auto-scroll to bottom as content arrives

### Touch Feedback
- All buttons: scale down slightly on active state (`active:scale-95`)
- Ripple effect on message bubbles (optional, Material Design)
- Input focus: subtle scale-up or border highlight

### Keyboard Behavior
- Input auto-focus on mount (mobile friendly)
- Send on Enter (desktop), manual send on mobile
- Input resizes up to 3 lines for longer messages

---

## Responsive Breakpoints

### Mobile (default, < 768px)
- Single column, full-width messages
- Large tap targets (min 48px)
- Bottom-fixed input with safe-area padding

### Tablet (md: 768px+)
- Centered container: `max-w-2xl`
- Slightly wider message max-width: `max-w-[75%]`
- Enhanced hover states for buttons

### Desktop (lg: 1024px+)
- Max container: `max-w-3xl`
- Hover actions on messages (copy, etc.)
- Keyboard shortcuts visible/enabled

---

## Performance & Polish

### Loading States
- Initial app load: Simple spinner with "Loading..." text
- Message sending: Send button disabled with subtle loading indicator
- Streaming: Real-time text rendering without layout shift

### Animations
**Minimal, purposeful only**:
- Message fade-in: 150ms ease-out
- Button press: 100ms scale transform
- Streaming cursor: 1s pulse animation
- NO scroll animations, parallax, or decorative motion

### Accessibility
- ARIA labels on all buttons
- Focus indicators on interactive elements
- Screen reader announcements for new messages
- Semantic HTML: `<main>`, `<button>`, `<input>`

---

## Icon Library
**Heroicons** (via CDN):
- Send: paper-airplane
- Clear: x-mark
- Copy: clipboard-document
- Error: exclamation-triangle
- Info: information-circle

---

## Images
**None required** - This is a text-based chat interface. The design relies on typography, spacing, and clean component design rather than imagery.