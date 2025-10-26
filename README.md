# Tixly - Twig Edition

Modern ticket management made simple and efficient. Built with PHP Twig templates and vanilla JavaScript.

## 🚀 Tech Stack

- **Backend**: PHP 8.0+ with Twig 3.0 templating
- **Build Tool**: Vite (for CSS/JS bundling)
- **Styling**: Tailwind CSS
- **JavaScript**: Vanilla ES6+ with modules
- **Form Validation**: Custom validator class

## 🛠️ Setup Instructions

### Prerequisites

- PHP 8.0+ installed
- Composer installed
- Node.js 18+ installed
- pnpm, npm, or yarn package manager
- Backend server running (see `../server/README.md`)

### Installation

1. **Install PHP dependencies:**

```bash
composer install
```

2. **Install Node dependencies:**

```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Environment configuration:**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
API_BASE_URL=http://localhost:4000
TWIG_DEBUG=true
TWIG_CACHE=false
```

4. **Start the backend API server:**

Make sure the backend is running on port 4000:

```bash
cd ../server
pnpm dev
```

5. **Build assets:**

For development (watch mode):

```bash
pnpm dev
```

For production build:

```bash
pnpm build
```

6. **Start PHP development server:**

```bash
php -S localhost:8000 index.php
```

Visit `http://localhost:8000` in your browser.

## 🎯 Key Features

- ✅ User authentication (signup/login/logout)
- ✅ Dashboard with ticket statistics
- ✅ Full CRUD operations for tickets
- ✅ Responsive design with Tailwind CSS
