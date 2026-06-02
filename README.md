# FinAudit CRM — Finance & Compliance Dashboard

A full-stack CRM application for financial client management, invoice tracking, risk scoring, and compliance auditing. Built with React 19, Express, and MongoDB.

## Features

- **User Authentication** — Register, login, JWT-based sessions with role-based access control (Admin, Manager, Viewer)
- **Global Dashboard** — Revenue overview, client status distribution, monthly revenue line charts via Recharts
- **Client Management** — Full CRUD for clients with status classification (Solvable, Fidèle, Insolvable)
- **Invoice Management** — Create, edit, and track invoices per client (amount HT, TVA, total TTC, payment status, due dates)
- **Client Detail Pages** — Per-client view with financial overview, payment history, general info, notes, documents, and activity timeline
- **Risk & Anomaly Detection** — Audit engine that flags TVA mismatches (Article 117 CGI) and cash-payment violations (Article 193 CGI)
- **Smart Filters** — Sidebar navigation filtered by Solvable, Fidèle, Insolvable, and Risk clients
- **PDF Report Generation** — Export dashboard reports to PDF via jspdf
- **Profile Settings** — Edit profile (name, email, company, avatar) and change password
- **Notification Bell** — In-app due-date reminders
- **Print-Ready Layouts** — A4 landscape print styles for physical reports

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 19, Vite 8, React Router 7              |
| Styling     | Tailwind CSS v4                               |
| Icons       | lucide-react (via @animateicons/react)        |
| Charts      | Recharts                                      |
| UI          | Headless UI                                   |
| PDF         | jspdf, jspdf-autotable, html2canvas           |
| Backend     | Express 4, Node.js                            |
| Database    | MongoDB via Mongoose ODM                      |
| Auth        | JWT (jsonwebtoken), bcrypt                    |
| Email       | Nodemailer (Gmail SMTP)                       |

## Project Structure

```
├── .env                          # Vite env vars
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite config (API proxy to :5000)
├── index.html                    # HTML entry point
├── src/
│   ├── main.jsx                  # App entry (BrowserRouter, Providers)
│   ├── App.jsx                   # Main app (sidebar, routing, state)
│   ├── index.css                 # Tailwind + print styles
│   ├── api/                      # HTTP client (http.js, auth.js, clients.js)
│   ├── components/               # UI components
│   │   ├── client-details/       # Client detail page sub-components
│   │   ├── AuthPage.jsx          # Login / Register
│   │   ├── Dashboard.jsx         # Global dashboard
│   │   ├── FilteredClientList.jsx
│   │   ├── ClientManagementView.jsx
│   │   ├── InvoiceModal.jsx / InvoiceCreator.jsx
│   │   ├── AuditDrawer.jsx
│   │   ├── SettingsView.jsx / SettingsDropdown.jsx
│   │   ├── NotificationBell.jsx
│   │   └── ...
│   ├── context/                  # React Context (UserContext, ClientsContext)
│   ├── hooks/
│   └── utils/                    # permissions.js, clientId.js
├── server/
│   ├── server.js                 # Express entry point
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Mongoose schemas (User, Client)
│   ├── controllers/              # Route handlers (auth, client, groq)
│   ├── routes/                   # Express routes (auth, client)
│   ├── middleware/               # JWT auth, error handler
│   └── utils/                    # emailService.js, asyncHandler.js
└── dist/                         # Production build output
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- A Gmail account with an app password (for email verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd CRM-Finance-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure environment variables**

   **Frontend** (`.env`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

   **Backend** (`server/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/finaudit_crm
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:5173
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

5. **Start MongoDB** (local or Docker):
   ```bash
   mongod
   ```

6. **Run the backend**
   ```bash
   cd server
   npm run dev
   ```

7. **Run the frontend** (in a separate terminal)
   ```bash
   npm run dev
   ```

8. Open `http://localhost:5173` in your browser.

## Available Scripts

### Frontend

| Script      | Description                     |
|-------------|---------------------------------|
| `npm run dev` | Start Vite dev server          |
| `npm run build` | Build for production         |
| `npm run lint` | Run ESLint                    |
| `npm run preview` | Preview production build    |

### Backend

| Script             | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start with nodemon (watch)     |
| `npm start`        | Start server (production)      |

## Environment Variables

### Frontend (`/ .env`)

| Variable            | Required | Default                    | Description          |
|---------------------|----------|----------------------------|----------------------|
| `VITE_API_BASE_URL` | No       | `http://localhost:5000`     | Backend API URL      |

### Backend (`server/.env`)

| Variable             | Required | Description                      |
|----------------------|----------|----------------------------------|
| `NODE_ENV`           | Yes      | Environment mode (`development`) |
| `PORT`               | No       | Server port (default: 5000)      |
| `MONGODB_URI`        | Yes      | MongoDB connection string        |
| `JWT_SECRET`         | Yes      | Secret key for signing JWT tokens|
| `FRONTEND_URL`       | Yes      | CORS allowed origin              |
| `GMAIL_EMAIL`        | Yes      | Gmail address for sending email  |
| `GMAIL_APP_PASSWORD` | Yes      | Gmail app-specific password      |
| `GROQ_API_KEY`       | No       | Groq AI API key (optional)       |
| `GROQ_API_URL`       | No       | Groq API endpoint                |
| `GROQ_MODEL`         | No       | Groq model name                  |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` — Create a new account
- `POST /login` — Log in and receive a JWT
- `GET /me` — Get current user profile
- `PUT /profile` — Update profile
- `PATCH /password` — Change password

### Clients (`/api/clients`) — JWT required
- `GET /` — List all clients for the authenticated user
- `POST /` — Create a new client
- `GET /:id` — Get a client by ID
- `PUT /:id` — Update a client
- `DELETE /:id` — Delete a client
- `POST /:id/invoices` — Add an invoice to a client
- `PATCH /:id/invoices/:invoiceId` — Update an invoice
- `POST /:id/notes` — Add a note
- `POST /:id/documents` — Add a document
- `PUT /:id/notes/:noteId` — Update a note
- `DELETE /:id/notes/:noteId` — Delete a note
- `PUT /:id/activities/:activityId` — Update an activity
- `DELETE /:id/activities/:activityId` — Delete an activity

## Deployment

### Vercel

The project includes `vercel.json` for Vercel deployment. The API is exported from `server/server.js` as a serverless function.

### Production Build

```bash
npm run build          # Build frontend
cd server && npm start # Start backend
```

## License

MIT
