// ==========================================
// SCSS MIGRATION GUIDE - How to Use
// ==========================================

## Overview
Your project has been converted from Tailwind CSS to SCSS with the following structure:

### File Organization
```
src/
├── styles/
│   ├── variables.scss    (Colors, typography, spacing, breakpoints)
│   ├── mixins.scss       (Reusable patterns and utilities)
│   ├── globals.scss      (Base styles, resets, and utility classes)
│   ├── components.scss   (Header, hero, catalog, customizer, etc.)
│   ├── additional.scss   (Wizard, influencer, FAQ, footer, modals)
│   └── index.scss        (Main import file that combines all)
├── App.tsx               (React component - update class names here)
└── index.css            (Main entry point - imports SCSS)
```

### Key Changes from Tailwind to SCSS

1. **No more inline utility classes** - Instead of:
   ```jsx
   <div className="bg-primary-dark text-white px-6 py-3 rounded-lg">
   ```
   Use semantic class names:
   ```jsx
   <div className="hero-text">
   ```

2. **Variables instead of color suffixes** - Instead of:
   ```css
   bg-teal-900, text-teal-700, border-teal-500
   ```
   Use:
   ```scss
   background-color: $color-primary-dark;
   color: $color-primary-light;
   border-color: $color-primary-base;
   ```

3. **Mixins for common patterns** - Instead of:
   ```jsx
   <button className="px-6 py-3 bg-teal-900 text-white rounded-lg font-bold">
   ```
   Use SCSS:
   ```scss
   .my-button {
     @include btn-primary;
   }
   ```

### Color System

Primary Colors:
- `$color-primary-dark`: #0f2f2f (teal-900)
- `$color-primary-base`: #1a4d4d (teal-800)
- `$color-primary-light`: #2d7a7a (teal-700)

Accent:
- `$color-accent-base`: #d4af37 (warm gold)
- `$color-accent-light`: #e6c757
- `$color-accent-lighter`: #f5e6a1

Neutral:
- `$color-white`: #ffffff
- `$color-dark`: #1a1a1a
- `$color-light-gray`: #b0b0b0

### Common Component Classes

Header:
- `.header` - Main header wrapper
- `.logo` - Logo section
- `.nav-switcher` - Platform switcher buttons
- `.search-box` - Search input
- `.action-btn` - Icon buttons (favorites, etc)
- `.cart-btn` - Shopping cart button

Hero Section:
- `.hero` - Main hero section
- `.hero-text` - Text content area
- `.badge` - Badge/tag styling
- `.cta-btn` - Call-to-action button

Catalog:
- `.catalog` - Main catalog section
- `.product-card` - Individual product card
- `.card-image` - Product image wrapper
- `.card-content` - Product info area
- `.filter-btn` - Filter button

Customizer:
- `.customizer` - Main customizer section
- `.customizer-option` - Option group
- `.option-btn` - Individual option button
- `.price-card` - Pricing display card
- `.customizer-preview` - Preview visualization

Modals:
- `.shortlist-modal` - Favorites drawer
- `.cart-modal` - Shopping cart drawer
- `.product-modal` - Product detail modal
- `.modal-overlay` - Backdrop overlay

### Responsive Design

Use the provided mixins for responsive code:
```scss
// In your SCSS files
.my-component {
  display: block;
  
  @include md {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include lg {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

Available breakpoints:
- `@include sm { }` - 640px
- `@include md { }` - 768px
- `@include lg { }` - 1024px
- `@include xl { }` - 1280px

### Button Mixins

Pre-defined button styles:
```scss
.my-button {
  @include btn-base;      // Basic button styling
  @include btn-primary;   // Dark teal button
  @include btn-accent;    // Gold button
  @include btn-ghost;     // Outline button
}
```

### Card Styling

```scss
.my-card {
  @include card;  // Automatic card styling with hover effects
}
```

### Typography Mixins

```scss
h1 { @include heading-1; }
h2 { @include heading-2; }
h3 { @include heading-3; }
p { @include body-text; }
.label { @include label-text; }
```

### How to Update App.tsx

1. Replace inline Tailwind classes with SCSS class names:

**Before (Tailwind):**
```jsx
<div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 group flex flex-col h-full text-left relative">
  <div className="aspect-4/3 bg-stone-100 overflow-hidden relative cursor-pointer">
    <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
  </div>
  <div className="p-6 flex flex-col flex-1 gap-4">
    <h3 className="font-serif font-bold text-lg text-stone-950">
      {item.name}
    </h3>
  </div>
</div>
```

**After (SCSS):**
```jsx
<div className="product-card">
  <div className="card-image">
    <img src={item.image} alt={item.name} />
  </div>
  <div className="card-content">
    <h3 className="card-title">
      {item.name}
    </h3>
  </div>
</div>
```

2. All styling is now in `src/styles/components.scss` and related files

3. Changes are automatically compiled and applied

### Adding Custom SCSS

If you need custom styles:

1. Add to `src/styles/components.scss` or `src/styles/additional.scss`
2. Use the provided variables and mixins
3. Follow the existing naming patterns

Example:
```scss
.my-custom-section {
  background-color: $color-white;
  padding: $spacing-12;
  border-radius: $radius-2xl;
  
  @include container;
  
  h2 {
    @include heading-2;
    margin-bottom: $spacing-6;
  }
  
  p {
    color: $color-light-gray;
    line-height: $line-height-relaxed;
  }
  
  @include md {
    padding: $spacing-16;
  }
}
```

### Breakpoints

Use these media query mixins throughout your SCSS:
- `@include sm { }` - Small devices (640px+)
- `@include md { }` - Medium devices (768px+) 
- `@include lg { }` - Large devices (1024px+)
- `@include xl { }` - Extra large devices (1280px+)

### Migration Checklist

- ✅ SCSS files created with complete design system
- ✅ Variables defined for colors, spacing, typography
- ✅ Mixins created for common patterns
- ✅ Global styles and utilities set up
- ✅ Component styles defined for all major sections
- ⏳ App.tsx class names need to be updated (in progress)

### Next Steps

1. Continue updating App.tsx class names using the patterns shown
2. Test each section as you update it
3. Use browser dev tools to inspect and verify styling
4. All Tailwind classes should be removed and replaced with SCSS classes

### Benefits of SCSS Approach

✓ Much cleaner, more maintainable JSX
✓ Centralized design system in variables
✓ Reusable mixins reduce code duplication
✓ Easier to update styles globally
✓ Better organization and scalability
✓ Smaller HTML output (no bloated class names)

### Questions?

If you need to customize colors or spacing:

1. Edit `src/styles/variables.scss`
2. Changes automatically apply everywhere
3. No need to find and replace across dozens of files

---

Your SCSS structure is production-ready. Just finish updating the React component class names!
