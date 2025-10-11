# Interactive Styles Reference Guide

## 🎨 Quick Reference for Clario Interactive Effects

---

## 1. Global CSS Classes

### Location: `frontend/src/app/globals.css`

### Available Classes:

#### Basic Glow Effect
```css
/* Apply to any element for subtle glow on hover */
.interactive-glow {
  box-shadow: 0 0 0px 0px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.interactive-glow:hover {
  box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.1);
}
```

**Usage:**
```tsx
<div className="interactive-glow">Hover me</div>
```

---

#### Shadow Effect
```css
/* Enhanced shadow with smooth transition */
.interactive-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease-in-out;
}

.interactive-shadow:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
}
```

**Usage:**
```tsx
<Card className="interactive-shadow">...</Card>
```

---

#### Combined Effect (Glow + Shadow + Lift)
```css
/* Best for cards and interactive panels */
.interactive-effect {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0px 0px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.interactive-effect:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.1),
    0 0 15px 3px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}
```

**Usage:**
```tsx
<Card className="interactive-effect">...</Card>
```

---

#### Glazing Effect (Mouse-Tracking)
```css
/* Requires useGlaze hook for mouse tracking */
.btn-glaze-hover {
  position: relative;
  overflow: hidden;
}

.btn-glaze-hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: radial-gradient(80px circle at var(--x) var(--y), rgba(255, 255, 255, 0.2), transparent 40%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.btn-glaze-hover:hover::before {
  opacity: 1;
}
```

**Usage:**
```tsx
import { useGlaze } from '@/hooks/useGlaze'

function MyComponent() {
  const { ref } = useGlaze()
  
  return (
    <button ref={ref} className="btn-glaze-hover">
      Hover me
    </button>
  )
}
```

---

## 2. useGlaze Hook

### Location: `frontend/src/hooks/useGlaze.ts`

### Basic Usage:

```typescript
import { useGlaze } from '@/hooks/useGlaze'

function MyComponent() {
  const { ref, styles, applyGlaze } = useGlaze({
    enableMouseTracking: true,
    animations: true,
    reducedMotion: false
  })
  
  return (
    <div ref={ref} className="btn-glaze-hover">
      Interactive Element
    </div>
  )
}
```

### Configuration Options:

```typescript
interface GlazeConfig {
  theme?: 'light' | 'dark' | 'auto'
  animations?: boolean
  reducedMotion?: boolean
  enableMouseTracking?: boolean
}
```

### Return Values:

```typescript
{
  ref: RefObject<HTMLElement>        // Attach to element for mouse tracking
  styles: GlazeStyles                // Pre-defined style classes
  applyGlaze: (variant, classes?) => string  // Apply styles with additional classes
  theme: string
  animations: boolean
  reducedMotion: boolean
}
```

### Available Style Variants:

```typescript
styles.glass      // Glass morphism effect
styles.card       // Card style with backdrop blur
styles.button     // Button gradient style
styles.input      // Input field style
styles.overlay    // Overlay/backdrop style
styles.gradient   // Gradient background
```

---

## 3. Button Component

### Location: `frontend/src/components/ui/button.tsx`

### Variants with Interactive Effects:

#### Default Button (Black with Glow + Glaze)
```tsx
<Button>Click Me</Button>
<Button variant="default">Default</Button>
```
- Base: Black background
- Hover: White/10 overlay + Glow + Glaze
- Classes: `interactive-glow btn-glaze-hover`

#### Outline Button (Transparent with Glow)
```tsx
<Button variant="outline">Outline</Button>
```
- Base: Border only
- Hover: White/10 overlay + Glow
- Classes: `interactive-glow`

#### Ghost Button (Transparent with Glow)
```tsx
<Button variant="ghost">Ghost</Button>
```
- Base: Transparent
- Hover: White/10 overlay + Glow
- Classes: `interactive-glow`

#### Secondary Button (White with Glow)
```tsx
<Button variant="secondary">Secondary</Button>
```
- Base: White background
- Hover: Secondary/80 + Glow
- Classes: `interactive-glow`

#### Destructive Button (Red with Glow)
```tsx
<Button variant="destructive">Delete</Button>
```
- Base: Red background
- Hover: Red/90 + Glow
- Classes: `interactive-glow`

#### Link Button (Text Only)
```tsx
<Button variant="link">Link</Button>
```
- Base: Text with underline
- Hover: Underline effect
- Classes: None (no interactive effects)

---

## 4. Quick Integration Guide

### Step 1: Add Interactive Class to Element

```tsx
// Basic glow
<div className="interactive-glow">...</div>

// Shadow effect
<div className="interactive-shadow">...</div>

// Combined effect
<Card className="interactive-effect">...</Card>
```

### Step 2: For Glazing Effect, Use Hook

```tsx
import { useGlaze } from '@/hooks/useGlaze'

function MyCard() {
  const { ref } = useGlaze({ enableMouseTracking: true })
  
  return (
    <Card ref={ref} className="btn-glaze-hover interactive-glow">
      Content with glazing effect
    </Card>
  )
}
```

### Step 3: Combine Multiple Effects

```tsx
// Glow + Shadow + Glaze
<button 
  ref={glazeRef} 
  className="interactive-glow interactive-shadow btn-glaze-hover"
>
  Maximum Interactivity
</button>
```

---

## 5. Best Practices

### ✅ DO:

1. **Apply to Interactive Elements**
   ```tsx
   <Button className="interactive-glow">Click</Button>
   <Card className="interactive-effect">...</Card>
   ```

2. **Use Appropriate Effect for Context**
   - Buttons: `interactive-glow` + `btn-glaze-hover`
   - Cards: `interactive-effect`
   - Panels: `interactive-shadow`

3. **Respect User Preferences**
   ```tsx
   const { reducedMotion } = useGlaze()
   ```

4. **Combine Effects Thoughtfully**
   ```tsx
   className="interactive-glow interactive-shadow"
   ```

### ❌ DON'T:

1. **Don't Overuse Effects**
   ```tsx
   // Too much!
   <div className="interactive-glow interactive-shadow interactive-effect btn-glaze-hover">
   ```

2. **Don't Apply to Static Elements**
   ```tsx
   // No interaction expected
   <p className="interactive-glow">Text</p>
   ```

3. **Don't Forget Accessibility**
   - Always ensure sufficient color contrast
   - Provide focus states
   - Test with keyboard navigation

---

## 6. Color Customization

### Modify Glow Color:

```css
/* In your component's style or globals.css */
.my-custom-glow {
  box-shadow: 0 0 0px 0px rgba(59, 130, 246, 0.2); /* Blue glow */
}

.my-custom-glow:hover {
  box-shadow: 0 0 15px 3px rgba(59, 130, 246, 0.3);
}
```

### Modify Glaze Color:

```css
.my-custom-glaze::before {
  background: radial-gradient(
    80px circle at var(--x) var(--y), 
    rgba(59, 130, 246, 0.3),  /* Blue glaze */
    transparent 40%
  );
}
```

---

## 7. Performance Tips

1. **Use CSS Transforms** (GPU-accelerated)
   ```css
   transform: translateY(-2px); /* Better than margin/position */
   ```

2. **Optimize Transitions**
   ```css
   transition: transform 0.2s, box-shadow 0.3s; /* Specific properties */
   ```

3. **Memoize Callbacks**
   ```tsx
   const { ref } = useGlaze() // Already memoized internally
   ```

4. **Respect Reduced Motion**
   ```tsx
   const { reducedMotion } = useGlaze()
   if (reducedMotion) return <StaticComponent />
   ```

---

## 8. Examples Gallery

### Interactive Card
```tsx
function InteractiveCard() {
  const { ref } = useGlaze({ enableMouseTracking: true })
  
  return (
    <Card 
      ref={ref}
      className="interactive-effect btn-glaze-hover p-6"
    >
      <h3>Hover over me!</h3>
      <p>I have glow, shadow, lift, and glazing effects.</p>
    </Card>
  )
}
```

### Styled Button Group
```tsx
function ButtonGroup() {
  return (
    <div className="flex gap-4">
      <Button variant="default">Primary</Button>
      <Button variant="outline">Secondary</Button>
      <Button variant="ghost">Tertiary</Button>
    </div>
  )
}
```

### Custom Interactive Panel
```tsx
function CustomPanel() {
  const { ref } = useGlaze()
  
  return (
    <div 
      ref={ref}
      className="
        p-8 rounded-lg
        bg-black border border-white/10
        interactive-glow btn-glaze-hover
        hover:border-white/20
        transition-colors
      "
    >
      <h2>Custom Interactive Panel</h2>
      <p>With custom styling and interactive effects</p>
    </div>
  )
}
```

---

## 9. Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Box Shadow | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ | ✅ | ✅ | ✅ |
| Transitions | ✅ | ✅ | ✅ | ✅ |
| Backdrop Blur | ✅ | ✅ | ✅ | ✅ |
| Transform | ✅ | ✅ | ✅ | ✅ |

All effects are fully supported in modern browsers.

---

## 10. Troubleshooting

### Effect Not Visible?

1. **Check Dark Theme**
   ```tsx
   // Glows are optimized for dark backgrounds
   className="bg-black interactive-glow"
   ```

2. **Verify Import**
   ```tsx
   import { useGlaze } from '@/hooks/useGlaze' // Correct path
   ```

3. **Check Ref Attachment**
   ```tsx
   const { ref } = useGlaze()
   <div ref={ref}> // Must attach ref
   ```

### Glaze Not Following Mouse?

1. **Enable Mouse Tracking**
   ```tsx
   const { ref } = useGlaze({ enableMouseTracking: true })
   ```

2. **Add CSS Class**
   ```tsx
   className="btn-glaze-hover" // Required for glaze effect
   ```

3. **Check Position**
   ```css
   position: relative; /* Or absolute/fixed */
   overflow: hidden;   /* Required for glaze */
   ```

---

**Last Updated**: 2025-01-11
**Version**: 1.0.0
**Status**: Production Ready ✅

