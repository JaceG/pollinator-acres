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

### Form Submission

The signup form requires a backend API endpoint. Set `VITE_FORM_API_URL` in your `.env.local` file.

**Recommended services:**
- [Formspree](https://formspree.io) - Easiest setup, free tier available
- [EmailJS](https://www.emailjs.com) - Send emails from JavaScript
- Custom backend (Node.js, Python, etc.)

### Instagram Feed

To show live Instagram posts:

1. Set up Instagram Basic Display API
2. Get your access token and user ID
3. Add to `.env.local`:
   ```
   VITE_INSTAGRAM_ACCESS_TOKEN=your_token
   VITE_INSTAGRAM_USER_ID=your_user_id
   ```

See [Instagram API docs](https://developers.facebook.com/docs/instagram-basic-display-api/) for setup instructions.

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
- Instagram: [@pollinatoracres](https://instagram.com/pollinatoracres)
- Facebook: [Pollinator Acres](https://facebook.com/pollinatoracres)

---

Built with ❤️ for butterflies, bees & you.
