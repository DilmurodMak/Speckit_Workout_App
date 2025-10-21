# Workout Set Static Web App Constitution

## Core Principles

### I. Static-First Architecture
All pages must be pre-rendered at build time or served as static HTML/CSS/JavaScript files. No server-side rendering required unless explicitly specified. Assets must be optimized for fast delivery via CDN.

### II. Mobile-First Responsive Design
All UI components must be designed mobile-first with responsive breakpoints for tablet and desktop. Touch targets must be minimum 44x44px. All interactions must work on touch devices.

### III. Performance Standards
- Page load time: Under 3 seconds on 3G networks
- First Contentful Paint: Under 1.5 seconds
- Images must be optimized and lazy-loaded
- CSS/JS must be minified and bundled

### IV. Accessibility Requirements
- WCAG 2.1 AA compliance minimum
- Semantic HTML5 elements required
- Proper ARIA labels for interactive elements
- Keyboard navigation support for all interactive features
- Color contrast ratio minimum 4.5:1

### V. Browser Compatibility
Support latest 2 versions of Chrome, Firefox, Safari, and Edge. Progressive enhancement approach for older browsers.

## Technical Constraints

### File Structure
```
/
├── index.html          # Main entry point
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── images/             # Image assets
└── assets/             # Other static assets
```

### Technology Stack
- HTML5 for markup
- CSS3 (or preprocessor like Sass/Less)
- Vanilla JavaScript or modern framework (React, Vue, etc.)
- Static site generator optional (11ty, Jekyll, Hugo, etc.)

### Asset Management
- Images: WebP format preferred, PNG/JPG fallbacks
- Fonts: WOFF2 format, subset for performance
- Icons: SVG format preferred

## Development Standards

### Code Quality
- Valid HTML5 markup (W3C validation)
- CSS follows BEM or similar naming convention
- JavaScript: ES6+ with consistent style (ESLint)
- No inline styles or scripts (except critical CSS)

### Version Control
- All code must be in version control (Git)
- Feature branches for new work
- Clear commit messages

### Testing
- Manual cross-browser testing required
- Lighthouse audit score minimum 90 for Performance, Accessibility, Best Practices
- Visual regression testing for UI changes

## Governance

This constitution defines the baseline standards for all static web app features. All specifications, plans, and implementations must comply with these principles.

Violations must be justified and documented. Simpler alternatives should be explored before adding complexity.

**Version**: 1.0.0 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
