# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Angelo Cortez built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build (static export)
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Architecture

- **Static Export**: Configured for static site generation (`output: 'export'` in next.config.ts). No server-side features available.
- **App Router**: Uses Next.js App Router with components in `app/components/`
- **Single Page**: Main page (`app/page.tsx`) composes section components (Header, About, Projects, Experience, Contact)
- **Styling**: Tailwind CSS with custom CSS variables for theming (background/foreground colors)

## Key Files

- `app/page.tsx` - Main page composing all sections
- `app/layout.tsx` - Root layout with Geist fonts and metadata
- `app/components/` - Section components for the portfolio
- `next.config.ts` - Static export configuration with unoptimized images
