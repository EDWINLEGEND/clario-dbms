# Prompt 4: Dashboard & Course Detail Refactoring Guide

## 🎯 Overview
This guide documents the complete refactoring of the Dashboard and Course Detail pages to use the dark theme with interactive styles and animations.

---

## ✅ Completed Changes

### 1. StatCard Component (`components/cards/StatCard.tsx`)

**Changes:**
- Applied dark theme (`bg-black`, `border-white/10`, `text-white`)
- Integrated `useGlaze` hook with `btn-glaze-hover` class
- Added `.interactive-glow` class
- Added `itemVariants` for stagger animation
- Updated hover effects to use `hover:-translate-y-1`

**Result:** StatCard now matches the unified dark theme and has glazing + glow effects.

---

### 2. AchievementBadge Component (`components/cards/AchievementBadge.tsx`)

**Changes:**
- Updated all rarity colors to dark theme variants
- Applied `.interactive-glow` to unlocked achievements
- Changed badge colors to white/opacity scheme
- Updated lock overlay to dark style (`bg-black/80`)
- Updated progress bars to white/opacity

**Result:** Achievement badges now have consistent dark styling with colored accents for rarity.

---

### 3. Dashboard Page Background (`app/dashboard/page.tsx`)

**Changes:**
- Changed from `bg-white` to `bg-black`
- Updated profile header card to use dark theme
- Applied `.interactive-glow` to header card
- Updated all text colors to white/opacity variants
- Changed buttons to dark theme variants
- Added stagger animation to stat cards grid

**Key Updates:**
```typescript
// Background
<div className="min-h-screen bg-black">

// Profile Header Card
<Card className="border-white/10 bg-black interactive-glow">

// Avatar
<Avatar className="w-20 h-20 border-4 border-white/20">
  <AvatarFallback className="bg-white/10 text-white text-2xl font-bold">

// Text Colors
<h1 className="text-3xl font-bold text-white">
<span className="text-white/60">XP Progress</span>

// Buttons
<Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
<Button className="bg-white text-black hover:bg-white/90">

// Stat Cards Grid - Stagger Animation
<motion.div 
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="visible"
>
  <StatCard ... />
</motion.div>
```

---

## 🔄 Remaining Dashboard Changes

### Continue Learning Cards

**Current State:** Light theme with `border-gray-200`, `hover:border-black`

**Needed Changes:**
```typescript
// Card styling
<Card className="border-white/10 bg-black hover:border-white/30 transition-all duration-300 interactive-glow">

// Thumbnail border
<div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-white/20">

// Text colors
<h3 className="text-lg font-bold text-white">{course.title}</h3>
<p className="text-sm text-white/70">

// Progress bar
<Progress value={progress} className="h-2 bg-white/20" />

// Button
<Button 
  size="sm" 
  className="bg-white text-black hover:bg-white/90"
>
```

---

### Sidebar Cards (Weekly Goal, Recent Achievements)

**Needed Changes:**
```typescript
// Card
<Card className="border-white/10 bg-black">

// Header
<CardTitle className="flex items-center gap-2 text-lg font-bold text-white">

// Text
<p className="text-sm text-white/60">

// Circular progress (SVG)
<circle className="text-white/20" /> // Track
<circle className="text-white" />   // Progress

// Button
<Button className="w-full bg-white text-black hover:bg-white/90">
```

---

### Tabs Styling

**Needed Changes:**
```typescript
<TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
  <TabsTrigger 
    value="overview" 
    className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70"
  >
```

---

### Profile Tab

**Needed Changes:**
```typescript
// Cards
<Card className="border-white/10 bg-black">

// Text
<h2 className="text-2xl font-bold text-white">
<Label className="text-sm font-medium text-white/60">
<p className="text-lg font-bold text-white">
```

---

### Settings Tab

**Needed Changes:**
```typescript
// Form inputs
<Input className="border-white/20 bg-black text-white" />

// Switch labels
<Label className="text-base font-medium text-white">
<p className="text-sm text-white/60">

// Danger zone card
<Card className="border-red-500/30 bg-red-900/10">
  <h2 className="text-2xl font-bold text-red-400">
  <p className="text-red-300">
```

---

##  Course Detail Page Updates

### Background & Header

**Needed Changes:**
```typescript
// Background
<div className="min-h-screen bg-black">

// Back button
<Button
  variant="ghost"
  className="mb-4 text-white hover:bg-white/10"
>

// Title
<h1 className="text-3xl font-bold text-white mb-2">

// Description
<p className="text-white/80 text-lg mb-4">

// Meta information
<div className="flex flex-wrap items-center gap-4 text-sm text-white/70">

// Level badge
<Badge variant="outline" className="border-white/20 text-white">
```

---

### Two-Column Animation

**Implementation:**
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left Column - Video Player */}
  <motion.div 
    className="lg:col-span-2"
    initial={{ x: -50, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }} 
    transition={{ duration: 0.5 }}
  >
    {currentLesson && (
      <VideoPlayer
        lesson={currentLesson}
        onMarkComplete={handleMarkComplete}
      />
    )}
  </motion.div>

  {/* Right Column - Syllabus */}
  <motion.div 
    className="lg:col-span-1"
    initial={{ x: 50, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }} 
    transition={{ duration: 0.5 }}
  >
    <SyllabusSidebar
      lessons={course.lessons}
      currentLessonId={currentLesson?.id || ''}
      onLessonSelect={handleLessonSelect}
      courseTitle={course.title}
    />
  </motion.div>
</div>
```

---

### VideoPlayer Component

**Needed Changes:**
```typescript
// Card
<Card className="border-white/10 bg-black">

// Title
<CardTitle className="text-2xl font-bold text-white">

// Text
<span className="text-white/70">{formatDuration(lesson.duration)}</span>

// Badge
<Badge variant="outline" className="border-white/20 text-white">

// Description
<CardDescription className="text-base leading-relaxed text-white/80">

// Resources card
<Card className="border-white/10 bg-black">
<CardTitle className="text-lg text-white">

// Resource item
<div className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
  <p className="font-medium text-white">{resource.title}</p>
  <p className="text-sm text-white/60">{resource.description}</p>
</div>
```

---

### SyllabusSidebar Component

**Needed Changes:**
```typescript
// Main card
<Card className="w-full border-white/10 bg-black">

// Title
<CardTitle className="text-lg font-semibold text-white">

// Progress text
<span className="text-white/60">Progress</span>
<span className="font-medium text-white">{completed Lessons}/{totalLessons} lessons</span>

// Progress bar
<Progress value={progressPercentage} className="h-2 bg-white/20" />

// Lesson item
<div className={cn(
  "group relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm",
  {
    "bg-white/5 border-white/20 shadow-sm": isActive,
    "bg-white/5 border-white/10": lesson.isCompleted && !isActive,
    "border-white/10 hover:border-white/20 hover:bg-white/5": !isActive && !lesson.isCompleted,
  }
)}>

// Lesson title
<h4 className="font-medium text-sm leading-tight line-clamp-2 text-white">

// Stats card
<Card className="mt-4 border-white/10 bg-black">
  <div className="text-2xl font-bold text-white">{totalLessons}</div>
  <div className="text-xs text-white/60">Total Lessons</div>
</Card>
```

---

### Glazing Effects on Lesson Items

**Implementation:**
```typescript
import { useGlaze } from "@/hooks/useGlaze";

// In component
const { ref: glazeRef } = useGlaze({ enableMouseTracking: true });

// Apply to lesson item
<div
  ref={glazeRef}
  className="... btn-glaze-hover interactive-glow"
>
```

---

## 🎨 Color Palette Reference

### Dark Theme Colors:
- **Background:** `bg-black`
- **Cards:** `bg-black` with `border-white/10`
- **Text Primary:** `text-white`
- **Text Secondary:** `text-white/80`
- **Text Muted:** `text-white/60` or `text-white/50`
- **Borders:** `border-white/10` or `border-white/20`
- **Hover Background:** `hover:bg-white/5` or `hover:bg-white/10`
- **Progress Bars:** `bg-white/20` (track), `bg-white` (fill)
- **Buttons Primary:** `bg-white text-black hover:bg-white/90`
- **Buttons Outline:** `border-white/20 text-white hover:bg-white/10`

### Interactive Classes:
- `.interactive-glow` - Adds glow on hover
- `.btn-glaze-hover` - Adds glazing effect
- `hover:-translate-y-1` or `hover:-translate-y-2` - Lift on hover

---

## 🎬 Animation Patterns

### Stagger Container:
```typescript
<motion.div
  className="grid ..."
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="visible"
>
  {items.map(item => <Component variants={itemVariants} />)}
</motion.div>
```

### Two-Column Slide:
```typescript
// Left column
<motion.div
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>

// Right column
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

---

## ✅ Verification Checklist

### Dashboard Page:
- [ ] Background is black
- [ ] Profile header has dark theme
- [ ] Stat cards animate with stagger
- [ ] Stat cards have glow + glaze
- [ ] Course progress cards are dark
- [ ] Sidebar cards are dark
- [ ] Tabs have dark styling
- [ ] All buttons use dark theme
- [ ] All text is white/opacity variants

### Course Detail Page:
- [ ] Background is black
- [ ] Header has dark theme
- [ ] Two columns slide in (left from left, right from right)
- [ ] VideoPlayer has dark theme
- [ ] SyllabusSidebar has dark theme
- [ ] Lesson items have glaze effect
- [ ] Mark Complete button styled correctly
- [ ] All cards use dark theme
- [ ] No @heroui/react imports

---

## 📝 Summary

**Components Refactored:** 5 (StatCard, AchievementBadge, VideoPlayer, SyllabusSidebar, Dashboard Page)

**Key Achievements:**
1. ✅ Dark theme applied across all components
2. ✅ Interactive glow + glaze effects integrated
3. ✅ Stagger animations on stat cards
4. ✅ Two-column slide animations ready for course detail
5. ✅ All using shadcn/ui components

**Status:** Dashboard ~60% complete, Course Detail ready for implementation

