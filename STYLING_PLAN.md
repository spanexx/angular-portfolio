# Professional Portfolio Styling Plan

## Theme Overview: "Modern Professional"

A clean, professional, and sophisticated theme that balances modern design trends with classic professional aesthetics.

## Color Palette

### Primary Colors

- **Primary Blue**: `#2563eb` (Modern professional blue)
- **Primary Dark**: `#1e40af` (Darker shade for depth)
- **Primary Light**: `#93c5fd` (Light accent)

### Secondary Colors

- **Charcoal**: `#374151` (Professional dark gray)
- **Slate**: `#64748b` (Medium gray for text)
- **Light Gray**: `#f8fafc` (Background light)

### Accent Colors

- **Success Green**: `#10b981` (For achievements, skills)
- **Warning Amber**: `#f59e0b` (For highlights, CTAs)
- **Error Red**: `#ef4444` (For alerts, important items)

### Neutral Colors

- **White**: `#ffffff`
- **Off-White**: `#f9fafb`
- **Border**: `#e5e7eb`
- **Text Primary**: `#111827`
- **Text Secondary**: `#6b7280`

## Typography

### Font Stack

- **Primary**: 'Inter', 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif
- **Headings**: 'Inter', system-ui, sans-serif
- **Code**: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Font Sizes (rem scale)

- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

## Spacing System

### Base unit: 0.25rem (4px)

- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

## Layout Structure

### Grid System

- **Sidebar**: 280px fixed width on desktop, full width on mobile
- **Content**: Flexible, with max-width constraints
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Component Layout

- **Profile Section**: Centered layout with circular photo
- **Navigation**: Vertical list with hover states
- **Content Cards**: Consistent padding and shadows
- **Timeline**: Left-aligned with connecting lines

## Component Styles

### Cards

- Background: White
- Border: 1px solid #e5e7eb
- Border Radius: 0.5rem (8px)
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Hover Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

### Buttons

- Primary: Blue background, white text
- Secondary: White background, blue border
- Hover: Slight scale and shadow effects
- Border Radius: 0.375rem (6px)

### Navigation

- Active state: Blue background with white text
- Hover: Light blue background
- Icons: Consistent sizing (1.25rem)

### Forms (if applicable)

- Input borders: #d1d5db
- Focus: Blue border (#2563eb)
- Border radius: 0.375rem

## Animation & Transitions

### Standard Transitions

- Duration: 150ms (fast), 300ms (standard), 500ms (slow)
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Hover Effects

- Scale: 1.02 for cards
- Opacity: 0.8 for images
- Transform: translateY(-1px) for buttons

### Page Transitions

- Fade in/out: 300ms
- Slide transitions for mobile navigation

## Responsive Design

### Mobile (< 768px)

- Sidebar collapses to horizontal navigation
- Single column layout
- Larger touch targets (44px minimum)
- Simplified typography hierarchy

### Tablet (768px - 1024px)

- Two-column layout where appropriate
- Adjusted sidebar width
- Medium spacing values

### Desktop (> 1024px)

- Full layout with sidebar
- Maximum content width: 1200px
- Rich interactions and animations

## Accessibility

### Focus States

- Visible focus rings using `focus-visible`
- High contrast ratios (4.5:1 minimum)
- Skip links for keyboard navigation

### Color Contrast

- Text on backgrounds meets WCAG AA standards
- Interactive elements have clear states

### Motion

- Respect `prefers-reduced-motion`
- Optional animation controls

## Implementation Strategy

### Phase 1: Foundation

1. Update SCSS variables with new color palette
2. Create typography mixins and utility classes
3. Establish spacing and layout utilities

### Phase 2: Component Styling

1. Style sidebar and profile section
2. Update navigation components
3. Style main content areas

### Phase 3: Advanced Features

1. Add hover states and animations
2. Implement responsive design
3. Add dark mode support (future)

### Phase 4: Polish & Optimization

1. Fine-tune spacing and alignments
2. Optimize for performance
3. Test across devices and browsers

## File Organization

```src/styles/
├── abstracts/
│   ├── _variables.scss      # Color palette, typography, spacing
│   ├── _mixins.scss        # Reusable style mixins
│   └── _functions.scss     # SCSS utility functions
├── base/
│   ├── _reset.scss         # CSS reset/normalize
│   ├── _typography.scss    # Font imports and base styles
│   └── _base.scss          # Base element styles
├── components/
│   ├── _buttons.scss       # Button variants
│   ├── _cards.scss         # Card components
│   ├── _forms.scss         # Form elements
│   └── _navigation.scss    # Navigation styles
├── layout/
│   ├── _grid.scss          # Grid system
│   ├── _sidebar.scss       # Sidebar layout
│   └── _header.scss        # Header layout
├── pages/
│   ├── _portfolio.scss     # Portfolio-specific styles
│   ├── _profile.scss       # Profile page styles
│   └── _experience.scss    # Experience/timeline styles
├── utilities/
│   ├── _spacing.scss       # Margin/padding utilities
│   ├── _text.scss          # Text utilities
│   └── _display.scss       # Display/visibility utilities
└── main.scss               # Main import file
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Goals

- First Contentful Paint < 1.5s
- Cumulative Layout Shift < 0.1
- CSS bundle < 100KB (gzipped)
