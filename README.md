# URL Shortener

A Next.js URL shortener application that uses server actions with SQLite database and Prisma ORM for persistence.

## How it works

1. **Main Page (`/`)**: Users enter a URL and get a shortened version (6 characters)
2. **Redirect Page (`/r/[hash]`)**: Users clicking the shortened URL get redirected to the original URL

## Key Features

- ✅ **Very Short URLs**: Generates 6-character hashes (e.g., `/r/aB3xY9`)
- ✅ **SQLite Database**: Simple file-based database with Prisma ORM  
- ✅ **Collision Handling**: Automatic collision detection and resolution
- ✅ **URL Deduplication**: Same URL returns the same shortened version
- ✅ **Server Actions**: Uses React Server Actions (`'use server'`)
- ✅ **Modern UI**: Clean interface with shadcn/ui components
- ✅ **Form Validation**: React Hook Form with Zod validation

## Technology Stack

- Next.js 15 with App Router
- React Server Actions (`'use server'`)
- SQLite database
- Prisma ORM
- shadcn/ui components
- React Hook Form with Zod validation
- Tailwind CSS

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="file:./dev.db"
```

> Note: The `URL_SHORTENER_SECRET` is no longer needed in the simplified version.

## Database Schema

```prisma
model ShortenedUrl {
  id          Int      @id @default(autoincrement())
  hash        String   @unique
  originalUrl String
  createdAt   DateTime @default(now())
}
```

## Algorithm

The application uses a simple and clean approach:

- **Random 6-character hash**: Uses base62 encoding (0-9, A-Z, a-z)
- **Collision detection**: Automatically checks for existing hashes and regenerates if needed
- **URL deduplication**: Returns existing hash if URL was already shortened
- **Database storage**: Uses SQLite with Prisma for persistence

This approach provides very short URLs while ensuring uniqueness and allowing the same URL to always return the same shortened version.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Database Commands

- **View data in Prisma Studio:**
  ```bash
  npx prisma studio
  ```

- **Update database schema:**
  ```bash
  npx prisma db push
  ```

- **Reset database (development only):**
  ```bash
  rm prisma/dev.db
  npx prisma db push
  ```

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
