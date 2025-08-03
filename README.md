This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). This starter use react 19, tailwind v3 and typescript.

## On This Page

- [Getting Started](#getting-started)
  - [Setup](#setup)
  - [.env](#env)
  - [Database and ORM](#database-and-orm)
- [Learn More](#learn-more)
- [Deploy On Vercel](#deploy-on-vercel)

## Getting Started

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel. It's also use [`lucide-react`](https://lucide.dev/icons) for icon.

### Setup

First, install dependencies:

```bash
pnpm install
```

Then, start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### .env

Make sure the environment variables are added properly.

```env
NODE_ENV=development
AUTH_SECRET=
BASE_URL=

EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASS=

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

DATABASE_URL=
```

### Database and ORM

We use [`prisma`](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project) for ORM. If you are running the database on a local device make sure to add the following code into the `schema.prisma`:

```txt
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
}
```

Then, migrate/generate the prisma client first:

```bash
pnpm exec prisma migrate dev

# or migrate manually

pnpm exec prisma generate
pnpm exec prisma db push
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js docs](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Shadcn/ui](https://ui.shadcn.com) - A set of beautifully-designed, accessible components and a code distribution platform.
- [Next-Auth](https://authjs.dev/) - Authentication for the Web.
  Free and open source.
- [Tailwind.css](https://tailwindcss.com/) - A utility-first CSS framework.
- [Prisma ORM](https://www.prisma.io/orm) - Next-generation Node.js and TypeScript ORM.
- [Tanstack Query](https://tanstack.com/query/latest) - Powerful asynchronous state management for TS/JS, React, Solid, Vue, Svelte and Angular.
- [Lucide Icon](https://lucide.dev/icons/) - Beautiful &
  consistent icons, made by the community.
- [Zod](https://zod.dev/) - TypeScript-first schema validation with static type inference.
- [Nodemailer](https://nodemailer.com/) - Nodemailer is a module for Node.js applications that allows easy email sending.
- [Bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme) - Compatible to the C++ bcrypt binding on Node.js and also working in the browser.
- [Typescript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
