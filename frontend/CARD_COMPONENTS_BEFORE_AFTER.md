# Card Components: Before & After Comparison

This document provides a detailed comparison of the three main content card components before and after the Prompt 3 refactoring.

---

## 🎴 CourseCard Component

### ❌ BEFORE
```typescript
export function CourseCard({...}: CourseCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        "border-white/10 bg-black",
        variant === "featured" && "border-2 border-white",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Card content */}
    </Card>
  );
}
```

**Issues:**
- ❌ No Framer Motion animation
- ❌ No `.interactive-glow` class
- ❌ Inconsistent timing (`duration-200` vs standard 300ms)
- ❌ Manual `hover:shadow-lg` (duplicates glow effect)
- ❌ Smaller lift distance (`-translate-y-1` = 4px)

### ✅ AFTER
```typescript
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

export function CourseCard({...}: CourseCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          "border-white/10 bg-black",
          "interactive-glow",
          "hover:-translate-y-2",
          variant === "featured" && "border-2 border-white",
          className
        )}
        onClick={handleCardClick}
      >
        {/* Card content */}
      </Card>
    </motion.div>
  );
}
```

**Improvements:**
- ✅ Smooth spring-based entrance animation
- ✅ `.interactive-glow` for unified hover effect
- ✅ Consistent 300ms timing
- ✅ Removed redundant `hover:shadow-lg`
- ✅ Enhanced lift distance (8px for better visibility)

---

## 📁 ProjectCard Component

### ❌ BEFORE
```typescript
export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 border-white/20 bg-black transition-all duration-300 hover:border-white hover:shadow-lg",
        className
      )}
    >
      {/* Card content */}
    </Card>
  );
}
```

**Issues:**
- ❌ No Framer Motion animation
- ❌ No `.interactive-glow` class
- ❌ Inconsistent border (`border-2` and `border-white/20`)
- ❌ Manual `hover:border-white` and `hover:shadow-lg`
- ❌ No lift animation on hover

### ✅ AFTER
```typescript
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group relative overflow-hidden border-white/10 bg-black transition-all duration-300",
          "interactive-glow hover:-translate-y-2",
          className
        )}
      >
        {/* Card content */}
      </Card>
    </motion.div>
  );
}
```

**Improvements:**
- ✅ Spring-based entrance animation
- ✅ `.interactive-glow` handles hover effects automatically
- ✅ Unified border styling (`border-white/10`)
- ✅ Removed manual hover states
- ✅ Added 8px lift on hover

---

## 🎓 TrackCard Component

### ❌ BEFORE
```typescript
export function TrackCard({
  id,
  title,
  description,
  category,
  difficulty,
  duration,
  progress = 0,
  isEnrolled = false,
  className,
  onEnroll,
  onContinue,
}: TrackCardProps) {
  return (
    <Card className={cn("h-full transition-shadow hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <Badge variant="secondary" className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{category}</Badge>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button
          className="w-full"
          variant={isEnrolled ? "default" : "outline"}
          onClick={() => {
            if (isEnrolled && onContinue) {
              onContinue(id)
            } else if (!isEnrolled && onEnroll) {
              onEnroll(id)
            }
          }}
        >
          {isEnrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Issues:**
- ❌ No Framer Motion animation
- ❌ No `.interactive-glow` class
- ❌ Simple transition-shadow (not unified with other cards)
- ❌ No lift animation on hover
- ❌ Inconsistent layout (text-based, no thumbnail)
- ❌ Different badge color scheme (`difficultyColors` with green/yellow/red)
- ❌ Different structure from CourseCard and ProjectCard
- ❌ No enrollment count or course count display

### ✅ AFTER
```typescript
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

export function TrackCard({
  id,
  title,
  description,
  category,
  difficulty,
  duration,
  thumbnail = "/test.jpg",
  courseCount = 0,
  enrollmentCount = 0,
  progress = 0,
  isEnrolled = false,
  className,
  onEnroll,
  onContinue,
}: TrackCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          "border-white/10 bg-black",
          "interactive-glow hover:-translate-y-2",
          className
        )}
        onClick={handleAction}
      >
        {/* Track thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white text-black border-0">
              <Clock className="w-3 h-3 mr-1" />
              {duration}
            </Badge>
          </div>
          
          {/* Difficulty badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="border-white/20 text-white bg-black">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>

          {/* Enrollment badge */}
          {isEnrolled && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-lg line-clamp-2 text-white group-hover:text-white/80 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-white/80">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Category badge */}
          <Badge variant="outline" className="mb-3 border-white/20 text-white bg-black">
            {category}
          </Badge>
          
          {/* Track metadata */}
          <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{courseCount} courses</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{enrollmentCount.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          {isEnrolled && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Track Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </Progress>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          {/* Progress indicator */}
          {isEnrolled && progress > 0 && (
            <div className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="w-4 h-4" />
              <span>{progress}% complete</span>
            </div>
          )}
          
          {/* CTA Button */}
          <Button
            variant={isEnrolled ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all duration-200",
              isEnrolled 
                ? "bg-white text-black hover:bg-white/90" 
                : "border-white/20 text-white bg-black hover:bg-white hover:text-black"
            )}
          >
            {isEnrolled ? "Continue Learning" : "Start Track"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
```

**Improvements:**
- ✅ Complete redesign to match CourseCard and ProjectCard
- ✅ Spring-based entrance animation
- ✅ `.interactive-glow` for unified hover effect
- ✅ Added thumbnail support with aspect-video ratio
- ✅ Unified badge styling (black background, white borders)
- ✅ Added enrollment count and course count display
- ✅ Image zoom on hover (`group-hover:scale-105`)
- ✅ 8px lift animation
- ✅ Consistent layout structure across all card types
- ✅ Enhanced metadata with icons

---

## 📄 Parent Page Animation Pattern

### ❌ BEFORE (Individual Animations)
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredCourses.map((course, index) => (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <CourseCard course={course} />
    </motion.div>
  ))}
</div>
```

**Issues:**
- ❌ Animation logic duplicated in parent
- ❌ Less performant (multiple motion.div instances)
- ❌ Harder to maintain consistency

### ✅ AFTER (Container + Item Pattern)
```typescript
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
  initial="hidden"
  animate="visible"
>
  {filteredCourses.map((course) => (
    <CourseCard key={course.id} course={course} />
  ))}
</motion.div>
```

**Improvements:**
- ✅ Animation orchestrated by parent container
- ✅ Child components handle their own variants
- ✅ More performant (single motion.div)
- ✅ Easier to maintain
- ✅ Better separation of concerns

---

## 🎨 Unified Styling Comparison

| Property | Before | After |
|----------|--------|-------|
| **Border** | Mixed (`border-2`, `border-white/20`) | Unified (`border-white/10`) |
| **Hover Effect** | Manual (`hover:shadow-lg`) | Automatic (`.interactive-glow`) |
| **Lift Animation** | None or 4px | 8px (`hover:-translate-y-2`) |
| **Transition Duration** | Mixed (200ms, 300ms) | Unified (300ms) |
| **Badge Colors** | Mixed (green/yellow/red) | Unified (white on black) |
| **Entrance Animation** | None | Spring physics |
| **Stagger Delay** | Manual `index * 0.1` | Automatic (`staggerChildren`) |

---

## ✅ Visual Consistency Achieved

All three card components now share:

1. **Same animation behavior** - Spring-based entrance with stagger
2. **Same hover effects** - Glow + lift
3. **Same border styling** - `border-white/10`
4. **Same badge styling** - White borders on black background
5. **Same transition timing** - 300ms
6. **Same layout structure** - Thumbnail → Header → Content → Footer
7. **Same interaction pattern** - Click entire card or button

This creates a **cohesive, professional user experience** across all content grids in the application.

