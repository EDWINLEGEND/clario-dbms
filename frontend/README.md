# CLARIO - Learning & Work Marketplace Platform

A modern, responsive learning platform built with Next.js, Hero UI, and Tailwind CSS. CLARIO provides a comprehensive solution for online learning with courses, tracks, projects, and community features.

## 🚀 Features

### Core Functionality
- **Course Catalog**: Browse and filter courses by category, level, duration, and rating
- **Learning Tracks**: Structured learning paths with multiple courses
- **Hands-on Projects**: Real-world projects to build portfolio
- **User Dashboard**: Track progress, streaks, and achievements
- **Authentication**: Login/register with social auth and passwordless options
- **Responsive Design**: Mobile-first approach with bottom navigation

### UI/UX Features
- **Dark/Light Theme**: System detection with manual toggle
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Animations**: Subtle transitions with Framer Motion
- **Typography**: Manrope for headings, Fira Sans for body text
- **Design System**: Consistent components and design tokens

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: Hero UI
- **Styling**: Tailwind CSS
- **Fonts**: Next.js Google Fonts (Manrope, Fira Sans)
- **Theme**: next-themes
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── learn/             # Course catalog
│   │   ├── tracks/            # Learning tracks
│   │   ├── projects/          # Project showcase
│   │   ├── dashboard/         # User dashboard
│   │   ├── globals.css        # Global styles and design tokens
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Theme and UI providers
│   ├── components/            # Reusable components
│   │   ├── atoms/             # Basic components (buttons, badges, etc.)
│   │   ├── molecules/         # Composite components (cards, nav, etc.)
│   │   ├── organisms/         # Complex components (forms, sections)
│   │   └── layouts/           # Layout components
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
└── package.json              # Dependencies and scripts
```

## 🎯 Key Pages

### 1. Home (`/`)
- Hero section with value proposition
- Benefits and features overview
- Featured courses grid
- How it works section
- Call-to-action sections

### 2. Authentication (`/auth`)
- Tabbed login/register interface
- Social authentication (Google, GitHub)
- Passwordless magic link option
- Form validation and loading states

### 3. Learn (`/learn`)
- Searchable course catalog
- Advanced filtering (category, level, duration, rating, price)
- Grid/list view toggle
- Pagination and sorting

### 4. Tracks (`/tracks`)
- Learning track showcase
- Featured track highlight
- Filter by category and level
- Track cards with progress indicators

### 5. Projects (`/projects`)
- Project-based learning catalog
- Filter by difficulty and technology
- Detailed project requirements
- Portfolio building focus

### 6. Dashboard (`/dashboard`)
- Learning progress overview
- Statistics and achievements
- Continue learning section
- Activity timeline
- Goal tracking

## 🎨 Design System

### Colors
- **Primary**: Indigo/Blue palette (50-900)
- **Secondary**: Teal palette (50-900)
- **Surface**: Background and card colors
- **Muted**: Secondary text and borders
- **Text**: Primary text colors

### Typography
- **Headings**: Manrope (700 weight)
- **Body**: Fira Sans (300-700 weights)
- **Scale**: h1-h3, body, caption sizes

### Components

#### Atoms
- `CustomButton` - Enhanced button with icons and loading states
- `CustomBadge` - Flexible badge component with variants
- `CustomAvatar` - Avatar with fallback initials and status
- `ThemeToggle` - Dark/light/system theme switcher
- `ProgressBar` - Linear and circular progress indicators

#### Molecules
- `Header` - Desktop navigation with search and user menu
- `BottomNav` - Mobile navigation with theme toggle
- `CourseCard` - Course display with progress and stats
- Various specialized cards for tracks and projects

#### Layouts
- `MainLayout` - Base layout with header/nav
- `AuthLayout` - Centered layout for auth pages
- `DashboardLayout` - Layout for authenticated pages
- `ContentLayout` - Layout with optional sidebar

## 🎨 Theming

### Theme Configuration
The app uses `next-themes` for theme management with automatic system detection, manual toggle, and localStorage persistence. Supports light, dark, and system modes.

### Customizing Themes

1. **Update CSS variables** in `globals.css`
2. **Modify Tailwind config** in `tailwind.config.ts`
3. **Update Hero UI theme** for component styling

## 📱 Responsive Design

### Navigation Strategy
- **Mobile**: Bottom navigation bar (sticky)
- **Desktop**: Top header with full navigation
- **Adaptive**: Components adjust based on screen size

### Grid Layouts
- **Cards**: 1 (mobile) → 2 (tablet) → 3 (desktop) → 4 (large)
- **Sidebars**: Collapse to drawers on mobile
- **Tables**: Transform to cards on small screens

## ♿ Accessibility

### WCAG AA Compliance
- **Color Contrast**: 4.5:1 minimum ratio
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Readers**: Proper ARIA labels and roles
- **Semantic HTML**: Proper heading hierarchy

## 🚀 Deployment

### Build Process
```bash
npm run build
npm run start
```

### Deployment Platforms
- **Vercel**: Optimal for Next.js (recommended)
- **Netlify**: Good alternative with edge functions
- **AWS/GCP/Azure**: For custom infrastructure

---

**Built with ❤️ for the learning community**
