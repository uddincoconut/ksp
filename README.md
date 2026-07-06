# KSP Dashboard

Managing loan, payment, and other transactions for neighborhood community.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router, TypeScript)
- **UI**: [DaisyUI 5](https://daisyui.com) + [Tailwind CSS 4](https://tailwindcss.com)
- **Database**: PostgreSQL via [Prisma 6](https://www.prisma.io)
- **Auth**: [Better Auth](https://www.better-auth.com) (email + password)

## Getting Started

### 1. Clone & install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Same app base URL |

### 3. Set up the database

```bash
npm run prisma:migrate   # Run migrations
```

### 4. Create the first admin user

```bash
npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();
p.user.create({ data: { name: 'Admin', email: 'admin@example.com', emailVerified: true,
  accounts: { create: { accountId: '1', providerId: 'credential', password: bcrypt.hashSync('password', 10) } }
}}).then(() => console.log('Done')).finally(() => p.\$disconnect());
"
```

Or use the better-auth sign-up API: `POST /api/auth/sign-up/email`

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to the login page.

## Pages

| Route | Description |
|---|---|
| `/login` | Authentication page |
| `/` | Home – shows member count card |
| `/members` | Member list + Add Member modal |
