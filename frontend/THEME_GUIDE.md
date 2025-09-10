# CLARIO Theme System & Component Library Guide

## 🎨 Enhanced Theme System

### Overview
CLARIO now features a comprehensive theme system with smooth transitions, consistent design tokens, and WCAG AA accessibility compliance.

### Design Tokens

#### Color Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-950: #172554;

/* Secondary Colors */
--secondary-50: #f0fdfa;
--secondary-500: #14b8a6;
--secondary-950: #042f2e;

/* Neutral Colors */
--neutral-50: #f8fafc;
--neutral-500: #64748b;
--neutral-950: #020617;
```

#### Semantic Colors
```css
/* Light Theme */
--background: #ffffff;
--foreground: #0f172a;
--surface: var(--neutral-50);
--border: var(--neutral-200);

/* Dark Theme */
--background: #020617;
--foreground: #f8fafc;
--surface: var(--neutral-900);
--border: var(--neutral-800);
```

#### Typography Scale
```css
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;
```

#### Spacing Scale
```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 3rem;
```

#### Border Radius
```css
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
```

#### Shadows
```css
/* Light Theme */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Dark Theme */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4);
```

### Theme Transitions

All theme changes include smooth transitions:
```css
* {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Theme Provider Configuration
```tsx
<NextThemesProvider
  defaultTheme="system"
  attribute="class"
  enableSystem
  enableColorScheme
  storageKey="clario-theme"
>
  <HeroUIProvider>
    {children}
  </HeroUIProvider>
</NextThemesProvider>
```

## 🧩 Component Library

### PageContainer

Standardized container with consistent spacing and theme-aware styling.

#### Basic Usage
```tsx
import { PageContainer } from '@/components/atoms/PageContainer';

<PageContainer maxWidth="2xl" padding="lg">
  {children}
</PageContainer>
```

#### Specialized Containers
```tsx
// Dashboard layout
<DashboardContainer>
  {children}
</DashboardContainer>

// Content pages
<ContentContainer>
  {children}
</ContentContainer>

// Forms and modals
<FormContainer>
  {children}
</FormContainer>

// Modal content
<ModalContainer>
  {children}
</ModalContainer>
```

#### Props
- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
- `padding`: "none" | "sm" | "md" | "lg" | "xl"
- `enableMotion`: boolean (default: true)
- `motionProps`: Custom Framer Motion properties

### SearchBar

Theme-adaptive search component with suggestions and keyboard shortcuts.

#### Basic Usage
```tsx
import { SearchBar } from '@/components/atoms/SearchBar';

<SearchBar
  placeholder="Search courses..."
  value={searchValue}
  onChange={setSearchValue}
  onSearch={handleSearch}
  suggestions={suggestions}
  showShortcut={true}
/>
```

#### Specialized Search Bars
```tsx
// Header search
<HeaderSearchBar placeholder="Search..." />

// Page search
<PageSearchBar placeholder="Search content..." />

// Compact search
<CompactSearchBar placeholder="Search" />
```

#### Props
- `placeholder`: string
- `value`: string
- `onChange`: (value: string) => void
- `onSearch`: (value: string) => void
- `suggestions`: string[]
- `showShortcut`: boolean
- `size`: "sm" | "md" | "lg"
- `variant`: "flat" | "bordered" | "faded" | "underlined"

### Tabs

Theme-responsive tabs with animated indicators and multiple variants.

#### Basic Usage
```tsx
import { Tabs } from '@/components/atoms/Tabs';

const tabItems = [
  {
    id: 'overview',
    label: 'Overview',
    content: <OverviewContent />,
    icon: <Home className="h-4 w-4" />
  },
  {
    id: 'settings',
    label: 'Settings',
    content: <SettingsContent />,
    icon: <Settings className="h-4 w-4" />,
    badge: 2
  }
];

<Tabs
  items={tabItems}
  variant="line"
  size="md"
  animated={true}
/>
```

#### Specialized Tabs
```tsx
// Card-style tabs
<CardTabs items={tabItems} />

// Minimal tabs
<MinimalTabs items={tabItems} />

// Vertical tabs
<VerticalTabs items={tabItems} />

// Full-width tabs
<FullWidthTabs items={tabItems} />
```

#### Props
- `items`: TabItem[]
- `variant`: "line" | "solid" | "bordered" | "light"
- `size`: "sm" | "md" | "lg"
- `orientation`: "horizontal" | "vertical"
- `fullWidth`: boolean
- `animated`: boolean

### Modal

Accessible modal with multiple variants and smooth animations.

#### Basic Usage
```tsx
import { Modal } from '@/components/atoms/Modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="md"
  motionPreset="scale"
>
  <div className="p-6">
    Modal content goes here
  </div>
</Modal>
```

#### Specialized Modals
```tsx
// Confirmation modal
<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  variant="danger"
/>

// Form modal
<FormModal
  isOpen={isOpen}
  onClose={onClose}
  title="Create New Item"
  onSubmit={handleSubmit}
  isLoading={isLoading}
>
  <FormContent />
</FormModal>

// Drawer modal
<DrawerModal
  isOpen={isOpen}
  onClose={onClose}
  title="Side Panel"
  placement="right"
>
  <DrawerContent />
</DrawerModal>
```

#### Props
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
- `placement`: "center" | "top" | "bottom"
- `backdrop`: "transparent" | "blur" | "opaque"
- `motionPreset`: "scale" | "slide-up" | "slide-down" | "fade" | "flip"

### ProfileMenu

Comprehensive profile menu with theme toggle and customizable items.

#### Basic Usage
```tsx
import { ProfileMenu } from '@/components/atoms/ProfileMenu';

const user = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatar.jpg",
  role: "admin",
  verified: true
};

<ProfileMenu
  user={user}
  onProfileClick={handleProfile}
  onSettingsClick={handleSettings}
  onLogout={handleLogout}
  showThemeToggle={true}
/>
```

#### Specialized Profile Menus
```tsx
// Compact mobile version
<CompactProfileMenu user={user} />

// Desktop version with full features
<DesktopProfileMenu user={user} />
```

#### Props
- `user`: User object with name, email, avatar, role, verified
- `onProfileClick`: () => void
- `onSettingsClick`: () => void
- `onLogout`: () => void
- `placement`: "bottom-start" | "bottom-end" | "top-start" | "top-end"
- `showThemeToggle`: boolean
- `customMenuItems`: Custom menu items array

### ThemeToggle

Enhanced theme toggle with smooth animations and visual feedback.

#### Basic Usage
```tsx
import { ThemeToggle } from '@/components/atoms/ThemeToggle';

<ThemeToggle
  size="md"
  variant="flat"
  showLabel={false}
/>
```

#### Props
- `size`: "sm" | "md" | "lg"
- `variant`: "light" | "solid" | "bordered" | "flat"
- `showLabel`: boolean
- `className`: string

## 🎯 Best Practices

### Theme Usage
1. Always use CSS custom properties for colors
2. Leverage semantic color tokens (--surface, --border, etc.)
3. Test both light and dark themes
4. Ensure proper contrast ratios (WCAG AA)

### Component Usage
1. Use specialized component variants when available
2. Leverage motion props for custom animations
3. Follow consistent spacing patterns
4. Implement proper accessibility attributes

### Performance
1. Components use Framer Motion for smooth animations
2. Theme transitions are optimized with CSS custom properties
3. Components are tree-shakeable and optimized for bundle size

## 🔧 Customization

### Extending Design Tokens
Add custom tokens to `globals.css`:
```css
:root {
  --custom-color: #your-color;
  --custom-spacing: 1.25rem;
}
```

### Custom Component Variants
Extend existing components:
```tsx
export function CustomSearchBar(props: SearchBarProps) {
  return (
    <SearchBar
      variant="bordered"
      className="custom-search-styles"
      {...props}
    />
  );
}
```

### Theme Customization
Modify theme provider settings:
```tsx
<NextThemesProvider
  themes={['light', 'dark', 'custom']}
  defaultTheme="custom"
>
  {children}
</NextThemesProvider>
```

## 🧪 Testing

### Cross-Device Testing
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablet (iPad, Android tablets)

### Theme Testing
- ✅ Light theme functionality
- ✅ Dark theme functionality
- ✅ System theme detection
- ✅ Theme persistence
- ✅ Smooth transitions

### Accessibility Testing
- ✅ WCAG AA color contrast compliance
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus management

### Performance Testing
- ✅ Theme switching performance
- ✅ Animation performance (60fps)
- ✅ Bundle size optimization
- ✅ Runtime performance

## 📚 Resources

- [Hero UI Documentation](https://heroui.com/docs)
- [Framer Motion Documentation](https://framer.com/motion)
- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*This guide covers the enhanced CLARIO theme system and component library. For additional support or questions, please refer to the development team.*