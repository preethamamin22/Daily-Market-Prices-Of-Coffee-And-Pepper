# Coffee & Pepper Price Tracker (Kodagu & Hassan)

A Next.js application to track and display daily coffee and pepper prices.

## Features

- **Public Dashboard**: View today's prices for Coffee (Arabica/Robusta) and Black Pepper.
- **District Support**: Tracking for Kodagu and Hassan districts.
- **Admin Panel**: Manage prices, users, and trigger manual updates.
- **Automated Sync**: (Planned) Daily scraping from KPA and Spices Board.
- **Responsive Design**: Mobile-first UI with Tailwind CSS.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Prisma (SQLite)
- Lucide React (Icons)
- Radix UI (Headless Components)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Visit**:
   - Public: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/login](http://localhost:3000/login)

## Project Structure

- `src/app/(public)`: Public facing pages (Home, History).
- `src/app/(admin)`: Admin dashboard routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities, constants, and services.
- `src/actions`: Server actions for data mutations.
