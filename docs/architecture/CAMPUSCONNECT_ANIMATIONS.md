# 🎬 CampusConnect Title Animations

## ✅ Current Animation

**Letter-by-letter 3D flip animation** with hover effects:
- Each letter animates in sequence
- 3D flip effect (rotateX)
- Slides up from below
- Hover to scale and change color
- Smooth, professional look

---

## 🎨 Animation Variants

### 1. Current: 3D Flip (Implemented)
```typescript
// Each letter flips in 3D
initial={{ opacity: 0, y: 50, rotateX: -90 }}
animate={{ opacity: 1, y: 0, rotateX: 0 }}
whileHover={{ scale: 1.2, color: '#3b82f6' }}
```

**Effect**: Letters flip in from bottom, hover to enlarge and turn blue

---

### 2. Bounce In
```typescript
// Replace the motion.span animation with:
initial={{ opacity: 0, scale: 0 }}
animate={{ 
  opacity: 1, 
  scale: 1,
}}
transition={{
  duration: 0.5,
  delay: index * 0.05,
  type: "spring",
  stiffness: 260,
  damping: 20
}}
whileHover={{
  scale: 1.3,
  rotate: [0, -10, 10, -10, 0],
  transition: { duration: 0.5 }
}}
```

**Effect**: Letters bounce in with spring physics, wiggle on hover

---

### 3. Wave Effect
```typescript
initial={{ opacity: 0, y: -50 }}
animate={{ 
  opacity: 1, 
  y: [0, -10, 0],
}}
transition={{
  duration: 0.8,
  delay: index * 0.08,
  repeat: Infinity,
  repeatDelay: 3,
  ease: "easeInOut"
}}
whileHover={{
  scale: 1.2,
  y: -20,
  color: '#10b981'
}}
```

**Effect**: Continuous wave motion, letters jump on hover

---

### 4. Glitch Effect
```typescript
initial={{ opacity: 0, x: -100 }}
animate={{ 
  opacity: 1, 
  x: [0, -5, 5, -5, 0],
  skewX: [0, 5, -5, 0]
}}
transition={{
  duration: 0.6,
  delay: index * 0.03,
  ease: "easeOut"
}}
whileHover={{
  scale: 1.1,
  textShadow: "0 0 8px rgb(59, 130, 246)",
  color: '#ef4444'
}}
```

**Effect**: Glitchy entrance, glow on hover

---

### 5. Rainbow Gradient
```typescript
initial={{ opacity: 0, scale: 0, rotate: -180 }}
animate={{ 
  opacity: 1, 
  scale: 1,
  rotate: 0,
  background: [
    'linear-gradient(45deg, #f59e0b, #ef4444)',
    'linear-gradient(45deg, #ef4444, #ec4899)',
    'linear-gradient(45deg, #ec4899, #8b5cf6)',
    'linear-gradient(45deg, #8b5cf6, #3b82f6)',
    'linear-gradient(45deg, #3b82f6, #10b981)',
  ]
}}
transition={{
  duration: 0.8,
  delay: index * 0.05,
  background: {
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }
}}
style={{
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent'
}}
```

**Effect**: Spinning entrance with rainbow gradient animation

---

### 6. Typewriter Effect
```typescript
// Different approach - animate container
<motion.h1
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="text-6xl md:text-7xl font-black mb-4"
>
  {text.split('').map((letter, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.1,
        delay: index * 0.1
      }}
    >
      {letter}
    </motion.span>
  ))}
  <motion.span
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 0.8, repeat: Infinity }}
  >
    |
  </motion.span>
</motion.h1>
```

**Effect**: Types out letter by letter with blinking cursor

---

### 7. Neon Glow
```typescript
initial={{ opacity: 0, scale: 0.5 }}
animate={{ 
  opacity: 1, 
  scale: 1,
  textShadow: [
    "0 0 10px #3b82f6",
    "0 0 20px #3b82f6",
    "0 0 30px #3b82f6",
    "0 0 20px #3b82f6",
    "0 0 10px #3b82f6",
  ]
}}
transition={{
  duration: 0.5,
  delay: index * 0.05,
  textShadow: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}}
whileHover={{
  scale: 1.3,
  textShadow: "0 0 40px #ef4444"
}}
```

**Effect**: Neon sign with pulsing glow

---

### 8. Elastic Bounce
```typescript
initial={{ opacity: 0, y: -100 }}
animate={{ 
  opacity: 1, 
  y: 0,
}}
transition={{
  duration: 0.8,
  delay: index * 0.05,
  type: "spring",
  stiffness: 300,
  damping: 10
}}
whileHover={{
  y: [-5, -15, -5],
  transition: {
    duration: 0.3,
    repeat: 2
  }
}}
```

**Effect**: Drops from top with elastic bounce, bounces on hover

---

## 🎯 How to Change Animation

### Step 1: Open Landing.tsx
```bash
src/pages/Landing.tsx
```

### Step 2: Find the CampusConnect section
Look for:
```typescript
{'CampusConnect'.split('').map((letter, index) => (
  <motion.span
```

### Step 3: Replace the animation properties
Copy one of the variants above and replace:
- `initial`
- `animate`
- `transition`
- `whileHover`

### Step 4: Save and see the magic! ✨

---

## 🎨 Combining Effects

You can combine multiple effects:

```typescript
<motion.span
  // Entrance animation
  initial={{ opacity: 0, scale: 0, rotate: -180 }}
  animate={{ opacity: 1, scale: 1, rotate: 0 }}
  
  // Continuous animation
  animate={{
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      delay: index * 0.1
    }
  }}
  
  // Hover animation
  whileHover={{
    scale: 1.3,
    rotate: 360,
    color: '#ef4444',
    transition: { duration: 0.5 }
  }}
  
  // Tap animation
  whileTap={{
    scale: 0.9
  }}
>
  {letter}
</motion.span>
```

---

## 🌈 Color Animations

### Rainbow Text
```typescript
animate={{
  color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']
}}
transition={{
  duration: 3,
  repeat: Infinity,
  ease: "linear"
}}
```

### Gradient Background
```typescript
style={{
  background: 'linear-gradient(45deg, #f59e0b, #ef4444, #ec4899)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  backgroundSize: '200% 200%'
}}
animate={{
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
}}
transition={{
  duration: 3,
  repeat: Infinity,
  ease: "linear"
}}
```

---

## 🎭 Advanced Effects

### Matrix Rain
```typescript
initial={{ opacity: 0, y: -100 }}
animate={{ 
  opacity: [0, 1, 1, 0],
  y: [0, 100],
}}
transition={{
  duration: 2,
  delay: index * 0.1,
  repeat: Infinity,
  repeatDelay: 1
}}
```

### Particle Explosion
```typescript
whileHover={{
  scale: [1, 1.5, 1],
  rotate: [0, 360],
  opacity: [1, 0.5, 1],
  transition: {
    duration: 0.6,
    times: [0, 0.5, 1]
  }
}}
```

---

## 💡 Pro Tips

### 1. Performance
- Keep animations under 1 second for entrance
- Use `will-change: transform` for smooth animations
- Avoid animating too many properties at once

### 2. Timing
- Stagger delays: `index * 0.05` (50ms between letters)
- Faster: `index * 0.03` (30ms)
- Slower: `index * 0.1` (100ms)

### 3. Easing
- `ease: "easeOut"` - Smooth deceleration
- `ease: "easeInOut"` - Smooth both ends
- `ease: [0.6, 0.01, 0.05, 0.95]` - Custom cubic bezier

### 4. Spring Physics
```typescript
type: "spring",
stiffness: 260,  // Higher = faster
damping: 20      // Higher = less bounce
```

---

## 🎬 Current Implementation

The current animation features:
- ✅ 3D flip entrance (rotateX)
- ✅ Staggered timing (50ms delay per letter)
- ✅ Hover scale (1.2x)
- ✅ Hover color change (blue)
- ✅ Smooth cubic bezier easing
- ✅ Dark mode support

**It looks professional and modern!** 🚀

---

## 🔄 Quick Swap

Want to try a different animation? Just replace the `motion.span` section with any variant above!

**Current code location:**
`src/pages/Landing.tsx` - Line ~150

**Enjoy experimenting with animations!** ✨
