This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Architecture

### Layout

```
app/
  layout.tsx              Root layout: fonts, <html>/<body>, global shell
  globals.css             Global styles and shared component classes
  page.tsx                "/" route
  lib/
    routes.ts             Route registry (single source of truth for paths)
  <segment>/
    page.tsx              Route UI for "/<segment>"
```

### Conventions

- **Server Components by default.** Only add `"use client"` to a file that genuinely needs state, refs, or browser events. Keep client components as small and as deep in the tree as possible.
- **Route folder names use `snake_case`** and match the URL segment exactly (e.g. `app/activities_selection` → `/activities_selection`).
- **Never hard-code a path string.** Every route path lives in `app/lib/routes.ts` and is referenced through `AppRoutes`.
- **Each page exports `metadata`** so the title and description are owned by the route rather than the root layout.
- **Shared visual styles live in `globals.css`** as reusable classes (`offer-page`, `offer-panel`, `offer-button`, ...). Reuse them instead of duplicating one-off styles.

### Adding a route

1. **Register the path** in [app/lib/routes.ts](app/lib/routes.ts):

   ```ts
   export const AppRoutes = {
     home: "/",
     activitiesSelection: "/activities_selection",
     myNewRoute: "/my_new_route", // add here
   } as const;
   ```

2. **Create the page** at `app/my_new_route/page.tsx`:

   ```tsx
   import type { Metadata } from "next";

   export const metadata: Metadata = {
     title: "My New Route",
     description: "What this page is for.",
   };

   export default function MyNewRoutePage() {
     return (
       <main className="offer-page">
         <div className="offer-panel">{/* ... */}</div>
       </main>
     );
   }
   ```

   Name the component `<Segment>Page` in PascalCase.

3. **Link to it** using the registry, never a literal string:

   ```tsx
   import Link from "next/link";
   import { AppRoutes } from "@/app/lib/routes";

   <Link href={AppRoutes.myNewRoute}>Continue</Link>;
   ```

   Prefer `<Link>` so Next.js prefetches the route. When the trigger must be a `<button>` (as with the Yes button on `/`), use `useRouter()` from `next/navigation` and call `router.prefetch(...)` on hover to keep the same behaviour.

4. **Optional route files**, colocated in the same folder when needed: `loading.tsx` (streaming fallback), `error.tsx` (client error boundary), `layout.tsx` (shared UI for nested routes).

5. **Verify** with `npm run lint` and `npm run build`; the new path should appear in the build's route table.

