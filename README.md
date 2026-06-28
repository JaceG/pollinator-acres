# Pollinator Acres

A beautiful, modern website for Pollinator Acres - a small farm near Delaware, Ohio offering fresh-cut flowers, pastured eggs, and farm experiences.

## Features

- 🌻 Product showcase (flowers, eggs, farm visits)
- 📧 Email/SMS signup with flexible notification preferences  
- 📸 Instagram feed integration
- ♿ Fully accessible (WCAG 2.1 AA compliant)
- 📱 Responsive design for all devices
- ⚡ Optimized performance with Vite

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, MUI Icons
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/pollinator-acres.git
cd pollinator-acres
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys (see `.env.example` for details).

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run build
npm run preview
```

## Configuration

### Signup (Supabase + Brevo)

Website signups post to `/api/signup`, which:
1. Saves the subscriber to **Supabase** (database for the future mobile app)
2. Syncs the contact to **Brevo** (where non-technical operators manage the list and send blasts)

Required environment variables (see `.env.example`):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BREVO_API_KEY=your_brevo_api_key
BREVO_LIST_ID=2
```

**Setup steps:** See **[docs/signup-list-setup.md](docs/signup-list-setup.md)** for a full beginner-friendly walkthrough.

Quick version:
1. Create a Supabase project and run `supabase/migrations/001_subscribers.sql`
2. Create a Brevo list and add a `PREFERENCES` contact attribute
3. Set env vars locally and on Render
4. Import existing contacts: `npm run import-subscribers -- contacts.csv`

For local dev, `npm run dev` proxies `/api/signup` through the same server modules as production.

### Instagram Feed

Live posts are fetched from the Instagram Graph API via `/api/instagram`. Add these to `.env`:

```
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
```

Setup guide: [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/)

For production, run `npm run build && npm start` so the Node server can proxy Instagram requests.

### Render deployment

`render.yaml` defines:
- **pollinator-acres** — web service (`npm run build` + `npm start`)
- **instagram-token-refresh** — cron job on the 1st of each month (6:00 UTC) to refresh the long-lived token

After the first Blueprint deploy, set these in the Render dashboard:
1. `RENDER_API_KEY` — from Account Settings → API Keys
2. `RENDER_SERVICE_ID` — web service ID (`srv_...`)
3. `RENDER_CRON_SERVICE_ID` — cron service ID (`srv_...`)

The cron job refreshes the token and updates both services via the Render API, then triggers a web redeploy.

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in site settings

### Other Platforms

This is a standard Vite React app and can be deployed to any static hosting:
- GitHub Pages
- Cloudflare Pages  
- AWS S3 + CloudFront
- Firebase Hosting

## Project Structure

```
pollinator-acres/
├── src/
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── figma/       # Figma-exported components
│   │   └── App.tsx          # Main app component
│   ├── imports/             # Image assets
│   ├── styles/              # CSS files
│   └── main.tsx             # App entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## Performance

- Images are optimized and lazy-loaded
- Code splitting for faster initial load
- Prefetch for smooth navigation
- Lighthouse score: 95+ on all metrics

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Respects `prefers-reduced-motion`
- WCAG 2.1 AA compliant

## License

© 2026 Pollinator Acres. All rights reserved.

## Contact

- Email: [contact via website]
- Instagram: [@pollinatoracres](https://www.instagram.com/pollinatoracres/)
- Facebook: [Pollinator Acres](https://www.facebook.com/people/Pollinator-Acres/100090811465945/)

---

Built with ❤️ for butterflies, bees & you.
