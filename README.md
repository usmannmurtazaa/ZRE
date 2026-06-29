<p align="center">
  <img src="https://raw.githubusercontent.com/usmanmurtaza/ZRE/main/public/logo.png" alt="Zain Real Estate" width="80" />
</p>

<h1 align="center">Zain Real Estate</h1>
<p align="center">
  <b>Enterprise‑grade real estate website for a Karachi‑based agency with 25+ years of trust</b><br/>
  <i>Karachi's Trusted Real Estate Partner Since 2000</i>
</p>

<p align="center">
  <a href="https://zainrealestate.com" target="_blank">
    <img src="https://img.shields.io/badge/LIVE-Website-%23162660?style=for-the-badge&logo=vercel" alt="Live Website" />
  </a>
  <a href="https://github.com/usmanmurtaza/ZRE/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/usmanmurtaza/ZRE/deploy.yml?style=for-the-badge&logo=github" alt="Build Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-Proprietary-%23C6A972?style=for-the-badge" alt="License" />
  </a>
  <a href="https://netlify.com">
    <img src="https://img.shields.io/badge/Deployed%20on-Netlify-%2300C7B7?style=for-the-badge&logo=netlify" alt="Netlify" />
  </a>
  <a href="https://firebase.google.com">
    <img src="https://img.shields.io/badge/Backend-Firebase-%23FFCA28?style=for-the-badge&logo=firebase" alt="Firebase" />
  </a>
</p>

<br/>

<p align="center">
  <img src="./docs/demo.gif" alt="Zain Real Estate Demo" width="85%" />
</p>

<br/>

## 📖 Table of Contents

- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🗄️ Firebase Setup](#-firebase-setup)
- [🌐 Deployment](#-deployment)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [📄 License & Author](#-license--author)

---

## ✨ Features

| Category            | Details                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Public Pages**    | Home, Properties, Property Detail, Areas, Area Detail, About, Contact, Privacy, Terms   |
| **Search**          | Advanced filtering by type, area, price, size, features – instant results               |
| **User Dashboard**  | Save favorites, track inquiries, manage profile                                         |
| **Agent Dashboard** | Manage leads, properties, view analytics                                                |
| **Admin Panel**     | Full CRUD for properties, leads, users, site settings – role‑based access               |
| **Authentication**  | Email/Password + Google Sign‑In (redirect flow, no pop‑ups)                             |
| **Luxury UI**       | Navy/Gold/Lavender theme, light/dark mode, Framer Motion animations, premium typography |
| **SEO**             | Dynamic meta tags, JSON‑LD structured data, sitemap.xml, robots.txt, canonical URLs     |
| **Responsive**      | Mobile‑first, fully responsive from 320px to 2560px                                     |
| **CI/CD**           | GitHub Actions + Netlify – auto‑deploy on push to `main`                                |

---

## 🧰 Tech Stack

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| **Frontend**   | React 19, TypeScript, Vite                        |
| **Styling**    | Tailwind CSS v4, Shadcn UI (Radix), Framer Motion |
| **State**      | Redux Toolkit, TanStack Query (React Query)       |
| **Forms**      | React Hook Form, Zod                              |
| **Backend**    | Firebase (Auth, Firestore, Storage, Analytics)    |
| **Hosting**    | Netlify (CDN, SSL, CI/CD)                         |
| **Testing**    | Vitest, Cypress, axe‑core                         |
| **Monitoring** | Web Vitals, Sentry (optional)                     |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/usmanmurtaza/ZRE.git
cd ZRE
```


### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file in the root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF
VITE_APP_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
```

The `dist/` folder is ready for deployment.

---

## 🗄️ Firebase Setup

1. **Firestore** – create collections: `users`, `properties`, `leads`, `areas`, `settings`, `testimonials`.
2. **Security Rules** – copy the content of `firestore.rules` into your Firebase console.
3. **Authentication** – enable **Email/Password** and **Google** providers.
4. **Storage** – default rules are sufficient.
5. **Admin user** – after registering, set `role: "admin"` in the `users/{uid}` document.

> 💡 _Composite indexes will be created automatically when you first filter properties – just click the link in the console error._

---

## 🌐 Deployment (Netlify)

1. Connect your Git repository to Netlify.
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. Add all environment variables (same as `.env.local`) in Netlify's dashboard.
5. Deploy – the included `netlify.toml` handles SPA redirects, caching, and security headers.

---

## 📁 Project Structure

```
src/
├── app/            # App entry, routing
├── assets/         # Fonts, images, icons
├── components/     # Atoms, molecules, organisms, templates, pages, UI
├── config/         # Firebase configuration
├── contexts/       # Auth, Theme providers
├── features/       # Domain modules (properties, leads, areas, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utilities, helpers, validators, SEO
├── pages/          # Page components (legacy)
├── services/       # Firebase service layer
├── store/          # Redux slices
├── styles/         # Global CSS, Tailwind config, design tokens
├── types/          # TypeScript interfaces
└── utils/          # Query client, analytics
```

---

## 🧪 Testing

- **Unit / Integration:** `npm run test`
- **End-to-end:** `npm run test:e2e`
- **Accessibility:** integrated with Cypress via `cypress-axe`

---

## 📄 License & Author

This project is proprietary and built exclusively for **Zain Real Estate**.

**Developed by [Usman Murtaza](https://usmanmurtaza.netlify.app/)**  
© 2026 Zain Real Estate. All rights reserved.

---

<br/>
<p align="center">
  <sub>Built with ❤️, TypeScript, and a lot of ☕</sub>
</p>
