# Design Guidelines: WhatToBuild College Edition

## Design Approach

**Selected Framework**: Productivity-Focused Design System inspired by Linear's clean aesthetics + Notion's educational warmth

**Justification**: As a student productivity platform with heavy data visualization (dashboards, progress tracking, metrics), we prioritize clarity, efficiency, and motivational design over decorative elements. The interface must feel professional yet approachable for college students.

---

## Core Design Elements

### A. Color Palette

**Primary Colors**
- **Dark Mode** (Default):
  - Background Base: `222 15% 11%` (deep charcoal)
  - Surface: `222 15% 15%` (elevated cards)
  - Surface Hover: `222 15% 18%`
  - Primary Accent: `262 83% 58%` (vibrant purple - motivational, tech-forward)
  - Primary Hover: `262 83% 65%`

- **Light Mode**:
  - Background Base: `0 0% 98%` (soft white)
  - Surface: `0 0% 100%` (pure white cards)
  - Surface Hover: `220 14% 96%`
  - Primary Accent: `262 80% 50%` (deeper purple)
  - Primary Hover: `262 80% 55%`

**Semantic Colors**
- Success (completed): `142 76% 36%` / `142 71% 45%` (light)
- Warning (in-progress): `38 92% 50%` / `38 92% 60%` (light)
- Info (recommended): `217 91% 60%` / `217 91% 70%` (light)
- Error: `0 84% 60%` / `0 84% 70%` (light)

**Text Colors**
- Primary text: `0 0% 95%` (dark) / `222 15% 15%` (light)
- Secondary text: `0 0% 70%` (dark) / `222 10% 45%` (light)
- Tertiary text: `0 0% 50%` (dark) / `222 8% 60%` (light)

### B. Typography

**Font Families**
- Primary (UI/Body): 'Inter', system-ui, sans-serif
- Monospace (code/data): 'JetBrains Mono', 'Fira Code', monospace

**Type Scale**
- Display (Hero): 56px / 3.5rem, font-weight 700, line-height 1.1
- H1: 40px / 2.5rem, font-weight 700, line-height 1.2
- H2: 32px / 2rem, font-weight 600, line-height 1.3
- H3: 24px / 1.5rem, font-weight 600, line-height 1.4
- H4: 20px / 1.25rem, font-weight 600, line-height 1.4
- Body Large: 18px / 1.125rem, font-weight 400, line-height 1.6
- Body: 16px / 1rem, font-weight 400, line-height 1.5
- Body Small: 14px / 0.875rem, font-weight 400, line-height 1.5
- Caption: 12px / 0.75rem, font-weight 500, line-height 1.4

### C. Layout System

**Spacing Primitives**: Use Tailwind units: `2, 3, 4, 6, 8, 12, 16, 20, 24` for consistent rhythm

**Responsive Breakpoints**
- Mobile: Base (< 640px)
- Tablet: md (≥ 768px)
- Desktop: lg (≥ 1024px)
- Wide: xl (≥ 1280px)

**Container Strategy**
- Max-width: `max-w-7xl` (1280px) for main content
- Page padding: `px-4 md:px-6 lg:px-8`
- Section spacing: `py-12 md:py-16 lg:py-20`

**Grid Systems**
- Dashboard cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Project listings: `grid-cols-1 lg:grid-cols-2 gap-4`
- Metric stats: `grid-cols-2 md:grid-cols-4 gap-4`

### D. Component Library

**Navigation**
- Top navbar: Fixed, backdrop-blur, height `h-16`, with logo left + nav links center + user menu right
- Sidebar (dashboard): `w-64`, collapsible on mobile, icon + label navigation items

**Cards**
- Project Card: Rounded `rounded-xl`, padding `p-6`, border `border border-white/10` (dark) or `border-gray-200` (light), shadow on hover
- Metric Card: Compact `p-4`, large number display, subtitle, trend indicator
- Progress Card: Includes progress bar, step indicators, completion percentage

**Forms & Inputs**
- Input fields: `h-12`, rounded `rounded-lg`, dark background with light border, focus ring with primary color
- Buttons Primary: `h-12 px-6`, primary color background, rounded `rounded-lg`, font-weight 600
- Buttons Secondary: Outlined with `border-2`, transparent background, primary border color
- Select dropdowns: Match input styling with chevron icon

**Data Display**
- Tables: Minimal borders, row hover states, sticky headers for long lists
- Progress bars: Height `h-2`, rounded `rounded-full`, animated width transitions
- Badges: Small `px-3 py-1`, rounded `rounded-full`, color-coded by status
- Skill tags: Pill-shaped, soft backgrounds, interactive on hover

**Feedback Elements**
- Loading states: Skeleton screens with pulse animation
- Empty states: Centered icon + message + CTA button
- Success toasts: Top-right, auto-dismiss, slide-in animation

### E. Page-Specific Layouts

**Landing/Home Page**
- Hero: Full-width with gradient overlay (purple to dark), height `min-h-[600px]`, centered CTA, background pattern of tech icons
- Features section: 3-column grid showcasing AI recommendations, progress tracking, comparison tools
- CTA section: Contrasting background, bold headline, prominent sign-up button

**Dashboard**
- Header: Welcome message, quick stats row (4 metrics)
- Main grid: Recent projects (left 2/3) + activity feed (right 1/3)
- Charts: Line chart for learning streak, bar chart for skills acquired

**Recommend Page**
- Two-column layout: Skills input form (left) + live preview (right)
- Project cards display with match percentage, difficulty badges, skill tags
- Filter sidebar for difficulty, technology stack

**Progress Page**
- Timeline view: Vertical stepper showing project milestones
- Each step: Checkbox, description, completion date, expandable notes
- Summary card at top: Overall progress percentage, estimated completion

**Compare Page**
- Split-screen layout: Student 1 (left) vs Student 2 (right)
- Synchronized scrolling for side-by-side comparison
- Metrics overlay: Shared skills (Venn diagram style), unique achievements

**Analyze Page**
- Repository input: GitHub URL field with paste button
- Analysis results: Tabbed interface (Skills, Complexity, Recommendations)
- Visualization: Tag cloud for technologies, difficulty radar chart

### F. Images & Visual Assets

**Hero Image**: Yes - abstract/geometric illustration representing AI + education (circuit board pattern merging with graduation cap motif), positioned as background with gradient overlay

**Additional Images**:
- Feature section illustrations: Custom icons or simple line illustrations for each feature (robot for AI, checklist for progress, scale for comparison)
- Empty states: Friendly illustrations when no data exists
- Student avatars: Placeholder avatars with initials or uploaded photos

**Icon Strategy**: Use Heroicons (outline style for navigation, solid for actions), CDN link

---

## Key Design Principles

1. **Clarity First**: Every element serves a purpose - no decorative clutter
2. **Data Visibility**: Important metrics always visible, charts use clear labels
3. **Motivational Design**: Success states are celebrated, progress is gamified with streaks and achievements
4. **Responsive Intelligence**: Mobile gets simplified views, desktop gets full dashboards
5. **Performance**: Minimal animations, instant feedback on interactions, optimistic UI updates