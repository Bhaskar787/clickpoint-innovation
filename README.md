# Clickpoint Innovation — Marketing Site

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn-style UI
primitives (Radix), Framer Motion, and GSAP (with ScrollTrigger).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's inside

- `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — App Router entry points
- `components/navbar.tsx` — sticky nav with animated Radix dropdown menus
  (Services / Industries / Company) + mobile accordion menu
- `components/hero.tsx` — GSAP-animated gradient orb, staggered Framer
  Motion entrance, auto-scrolling logo marquee
- `components/stats-section.tsx` — GSAP ScrollTrigger count-up stats
- `components/services.tsx` — hover-animated service cards
- `components/timeline.tsx` — **horizontal, scroll-snap timeline** (shadcn
  card conventions) with a Framer Motion scroll-progress rail and
  prev/next controls
- `components/cta-section.tsx`, `components/footer.tsx`
- `components/ui/` — `button.tsx`, `navigation-menu.tsx` (shadcn-style
  primitives built on Radix + CVA)

## Color palette (pulled from the reference screenshot)

| Token       | Hex       | Use                          |
|-------------|-----------|-------------------------------|
| `violet-600`| `#5340D6` | Primary brand / CTAs          |
| `violet-500`| `#6552EA` | Gradients, accents            |
| `ember-500` | `#F9611F` | Secondary accent, highlights  |
| `ink`       | `#15132B` | Body text / dark surfaces     |
| `cloud`     | `#FAF9FF` | Page background                |

Edit these in `tailwind.config.ts` under `theme.extend.colors`.

## Fonts

To keep this buildable offline, `app/layout.tsx` currently ships with a
system-font stack (defined via CSS variables in `globals.css`). For the
exact editorial look this design was planned around, swap in Google Fonts
once you have network access:

```tsx
// app/layout.tsx
import { Sora, Manrope } from "next/font/google";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500","600","700","800"] });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400","500","600","700"] });

// then on <html className={`${display.variable} ${body.variable}`}>
```

## Notes on the timeline component

`components/timeline.tsx` is the horizontal, shadcn-styled timeline you
asked for: snap-scrolling cards, a Framer Motion progress rail synced to
scroll position, and left/right controls that disable at the ends. Add or
edit milestones in the `milestones` array at the top of the file.

## Next steps you may want

- Wire the "Let's Talk" / "Start a Project" buttons to a real contact form
- Replace placeholder client logos/case studies with real ones
- Add real routes for Services/Industries/Company dropdown links
