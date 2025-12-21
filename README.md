# DKT Interiors - Headless WordPress + Next.js

A modern, production-ready headless WordPress implementation with Next.js 14 frontend. Features GSAP animations, Lenis smooth scrolling, Framer Motion transitions, and comprehensive SEO optimization.

## 🏗️ Architecture

```
┌─────────────────┐     REST API      ┌─────────────────┐
│   WordPress     │ ◄──────────────► │    Next.js      │
│   (Backend)     │                   │   (Frontend)    │
│   - CMS         │                   │   - SSG/ISR     │
│   - REST API    │                   │   - Animations  │
│   - Media       │                   │   - SEO         │
└─────────────────┘                   └─────────────────┘
```

## ✨ Features

### Frontend (Next.js 14)
- **App Router** - Latest Next.js routing paradigm
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Utility-first styling
- **GSAP** - Scroll-triggered animations
- **Lenis** - Buttery smooth scrolling
- **Framer Motion** - Page transitions
- **ISR** - Incremental Static Regeneration (60s)
- **SEO** - Meta tags, sitemap, JSON-LD
- **Accessibility** - ARIA labels, keyboard navigation
- **Responsive** - Mobile-first design

### Backend (WordPress)
- **Portfolio CPT** - Custom post type with meta fields
- **REST API** - Custom endpoints for all data
- **CORS** - Configured for headless operation
- **Customizer** - Easy content management
- **Image Sizes** - Optimized for web

## 📁 Project Structure

```
dkt-headless-v2/
├── wordpress-theme/
│   └── functions.php          # Complete WP functions
│
└── nextjs-frontend/
    ├── src/
    │   ├── app/               # Next.js App Router
    │   │   ├── layout.tsx     # Root layout
    │   │   ├── page.tsx       # Homepage
    │   │   ├── about/
    │   │   ├── contact/
    │   │   └── portfolio/
    │   │
    │   ├── components/
    │   │   ├── ui/            # Button, Input, etc.
    │   │   ├── layout/        # Header, Footer, PageHero
    │   │   ├── sections/      # Homepage sections
    │   │   └── animations/    # Reveal, Parallax, etc.
    │   │
    │   ├── lib/
    │   │   ├── api.ts         # WordPress API client
    │   │   ├── utils.ts       # Utility functions
    │   │   └── constants.ts   # App constants
    │   │
    │   ├── types/
    │   │   └── index.ts       # TypeScript types
    │   │
    │   └── hooks/
    │       └── index.ts       # Custom React hooks
    │
    ├── public/
    ├── tailwind.config.ts
    ├── next.config.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or later
- WordPress 6.0+ with REST API enabled
- npm or yarn

### 1. WordPress Setup

1. **Replace functions.php:**
   ```bash
   # Copy the new functions.php to your theme
   cp wordpress-theme/functions.php /path/to/your-theme/functions.php
   ```

2. **Configure Permalinks:**
   - Go to Settings → Permalinks
   - Select "Post name" structure
   - Save Changes

3. **Add Allowed Origins (if needed):**
   Edit `functions.php` and add your frontend URL to `$allowed_origins`:
   ```php
   $allowed_origins = array(
       'http://localhost:3000',
       'https://your-frontend-domain.com',
   );
   ```

4. **Configure Customizer:**
   - Go to Appearance → Customize
   - Fill in Contact Information
   - Add Social Media URLs
   - Set Hero Title/Subtitle

5. **Create Portfolio Items:**
   - Go to Portfolio → Add New
   - Fill in project details
   - Upload featured image
   - Add gallery images
   - Check "Featured" for homepage display

### 2. Next.js Setup

1. **Install Dependencies:**
   ```bash
   cd nextjs-frontend
   npm install
   ```

2. **Install Tailwind Typography Plugin:**
   ```bash
   npm install -D @tailwindcss/typography
   ```

3. **Create Environment File:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables:**
   ```env
   WORDPRESS_API_URL=https://your-wordpress-site.com
   NEXT_PUBLIC_SITE_URL=https://your-frontend-url.com
   REVALIDATE_TIME=60
   ```

5. **Add Required Images:**
   Create these in `public/images/`:
   - `og-image.jpg` (1200x630)
   - `about-studio.jpg` (800x1000)
   - `about-founder.jpg` (800x1000)
   - `placeholder.jpg` (400x500)

6. **Run Development Server:**
   ```bash
   npm run dev
   ```

7. **Open Browser:**
   Navigate to `http://localhost:3000`

## 📦 Deployment

### Vercel (Recommended)

1. **Push to Git Repository**

2. **Connect to Vercel:**
   - Sign up at vercel.com
   - Import your repository
   - Set root directory to `nextjs-frontend`

3. **Configure Environment Variables:**
   Add these in Vercel project settings:
   - `WORDPRESS_API_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `REVALIDATE_TIME`

4. **Deploy:**
   Vercel will automatically build and deploy

### Custom Domain
1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## 🔧 API Endpoints

### Custom Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wp-json/dkt/v1/homepage` | GET | All homepage data |
| `/wp-json/dkt/v1/settings` | GET | Site settings |
| `/wp-json/dkt/v1/featured-portfolio` | GET | Featured projects |
| `/wp-json/dkt/v1/portfolio/{id}/related` | GET | Related projects |
| `/wp-json/dkt/v1/services` | GET | Services list |
| `/wp-json/dkt/v1/testimonials` | GET | Testimonials |
| `/wp-json/dkt/v1/contact` | POST | Contact form |
| `/wp-json/dkt/v1/menus/{location}` | GET | Navigation menus |

### Standard WordPress Endpoints

| Endpoint | Description |
|----------|-------------|
| `/wp-json/wp/v2/portfolio` | Portfolio items |
| `/wp-json/wp/v2/portfolio_category` | Categories |

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  gold: {
    DEFAULT: '#d4af37',
    light: '#e6c967',
    dark: '#b8941f',
  },
}
```

### Fonts
Fonts are configured in `src/app/layout.tsx`:
```typescript
const cormorantGaramond = Cormorant_Garamond({...});
const dmSans = DM_Sans({...});
```

### Animation Timing
Edit `src/lib/constants.ts`:
```typescript
export const ANIMATION_CONFIG = {
  duration: { fast: 0.3, normal: 0.6, slow: 1.0 },
  stagger: 0.1,
};
```

## 🐛 Troubleshooting

### CORS Errors
- Verify your frontend URL is in the WordPress `$allowed_origins` array
- Check browser console for specific CORS messages
- Ensure WordPress REST API is accessible

### Images Not Loading
- Verify WordPress URL in `next.config.js` `remotePatterns`
- Check image paths in WordPress uploads
- Ensure image sizes are registered

### Build Errors
- Run `npm run type-check` to find TypeScript errors
- Check for missing dependencies
- Verify environment variables are set

### API 404 Errors
- Check WordPress permalinks are set to "Post name"
- Verify REST API is enabled
- Test API directly: `https://your-wp-site.com/wp-json/dkt/v1/settings`

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start Production
npm start

# Type Check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## 📄 License

MIT License - feel free to use this for your own projects.

---

Built with ❤️ for DKT Interiors
