# Hunter Espaniola — Portfolio (mock)

An experimental portfolio site for a Southern Utah videographer. All content is placeholder.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lenis

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Where things live

- `lib/content.ts`: every word of copy, plus the project list, packages, testimonials, and media paths.
- `public/media/`: placeholder stills (stylized desert SVGs). Regenerate with `node scripts/generate-art.mjs`, or drop in real photos and update the paths in `content.ts`.
- `media.heroVideo` / `media.showreelVideo` in `content.ts` point at free stock clips. If a clip fails to load, the poster image is shown with a slow drift instead.
- `components/sections/`: one file per homepage section.
- `components/ui/`: animation building blocks (text reveal, fade-in, parallax, magnetic, counter).
- `components/providers/`: smooth scroll, intro state, and page transitions.
