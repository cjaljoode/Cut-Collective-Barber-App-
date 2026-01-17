# The Cut Collective

A full-stack Barber Management & Community Platform built with Next.js, Tailwind CSS, Shadcn UI, Supabase, and Framer Motion.

## Features

### For Clients
- **Shop Discovery**: Find local barbershops with filters and search
- **Booking System**: Interactive calendar for appointment booking
- **Barber Portfolios**: View barber work galleries and reviews
- **Community Feed**: Social feed for sharing haircuts and techniques

### For Barbers
- **Professional Portfolio**: Showcase your work with a gallery
- **Schedule Management**: View and manage daily appointments
- **Work Gallery**: Upload and manage your haircut photos
- **Earnings Tracker**: Monitor your income and performance

### For Shop Owners
- **Analytics Dashboard**: Revenue trends and peak hour heatmaps
- **Employee Management**: Manage barbers and their availability
- **Commission Settings**: Configure employee commission rates
- **Promotion Tools**: Shop-wide marketing and promotions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database & Auth**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Barbra shop app"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Role-based dashboard
│   ├── discover/          # Shop discovery page
│   ├── portfolio/         # Barber portfolio page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── navigation/        # Sidebar and bottom nav
│   ├── providers/         # Context providers
│   └── ui/                # Shadcn UI components
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client setup
│   └── utils.ts          # Helper functions
└── public/                # Static assets
```

## Design System

- **Theme**: Dark mode by default with gold/amber accents
- **Colors**: Premium dark palette with primary gold (#F59E0B)
- **Typography**: Inter font family
- **Layout**: Responsive sidebar (desktop) and bottom nav (mobile)

## User Roles

The platform supports three user roles:
- **Client**: Book appointments and discover shops
- **Barber**: Manage portfolio and schedule
- **Owner**: Manage shop and employees

## Next Steps

- [ ] Set up Supabase database schema
- [ ] Implement authentication flow
- [ ] Build booking system with calendar
- [ ] Create community feed with masonry layout
- [ ] Add real-time availability checks
- [ ] Implement owner analytics dashboard

## License

MIT

