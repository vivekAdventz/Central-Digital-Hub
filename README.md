# Central Dashboard Hub

Central Dashboard Hub is an enterprise-grade analytics portal designed for presenting, managing, and securely sharing Power BI intelligence reports. It provides a highly polished, responsive interface with robust access controls, separate workflows for administrators and regular employees, and strategic features like "Fit to Screen" and Secure URL sharing.

---

## 🌟 Key Features

### Employee Portal (Microsoft Entra ID / Azure AD)
- **Secure Microsoft Login**: Single Sign-On (SSO) using `@azure/msal-react` for corporate employees.
- **Dynamic Dashboard Viewer**: A responsive sidebar navigation tied to embedded Power BI reports.
- **Immersive Viewing**: "Fit to Screen" full-screen mode for distraction-free analytics.
- **Secure Link Sharing**: Generates safe, direct URLs to specific reports.
- **Security Shielding**: Actively blocks internal Power BI navigation frames to keep users contained within the customized portal environment.

### Administrator Console (Local JWT & MongoDB)
- **Isolated Admin Gateway**: Restricted access via `/admin/login` using secure database credentials.
- **Full Report Lifecycle Control**: End-to-end CRUD operations for Power BI dashboards.
- **Instant Toggles**: Active/Inactive switch to hide or show reports instantly without deletion.
- **Access Control Registry**: Manage authorized personnel, review access status, and instantly provision/revoke employee viewing rights.
- **High-End UI/UX**: Built with an industrial, full-width data table design using Tailwind CSS.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (with custom curvy/premium design system components)
- React Router DOM
- `@azure/msal-react` & `@azure/msal-browser` (Microsoft Authentication)
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Schema modeling)
- JWT (JSON Web Tokens) for Admin Authentication
- `express-rate-limit` (for securing endpoints dynamically)

---

## ⚙️ Environment Variables Setup

Before running the project, you must set up your environment variables. 

### Backend (`/backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_strong_secret_key
JWT_EXPIRE=30d
NODE_ENV=development # Set to 'production' to enable rate-limiting

# Initial Admin Credentials (Setup your DB admin user)
ADMIN_EMAIL=admin@zuari.com
ADMIN_PASSWORD=your_secure_password
```

### Frontend (`/frontend/.env`)
Create a `.env` file in the `frontend/` directory for production:
```env
# If hosted on AWS with Nginx proxying /api to the backend, 
# you can leave this blank or omit it. 
# If the API is hosted on a separate domain, specify it here:
VITE_API_BASE_URL=https://api.yourdomain.com
```

Ensure your Microsoft Azure Active Directory App Registration details are properly configured in `frontend/src/config/msalConfig.js`:
- Client ID
- Tenant ID
- Redirect URIs (e.g., `https://yourdomain.com`)

---

## ☁️ AWS Lightsail & Nginx Deployment

This project is optimized for deployment behind an Nginx reverse proxy. 

1. **API Resolution**: The frontend uses a centralized `src/api/api.js` that automatically defaults to `/api` if no `VITE_API_BASE_URL` is provided. 
2. **Nginx Configuration**: Ensure your Nginx config redirects traffic from `/api` to the backend Node.js process (port 5000):
   ```nginx
   location /api/ {
       proxy_pass http://localhost:5000/;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```


1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd Central-Dashboard-Hub
   ```

2. **Install Backend Dependencies & Run:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend server will start on `http://localhost:5000`.*

3. **Install Frontend Dependencies & Run:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend client will start on `http://localhost:5173`.*

---

## 🔒 Security Notes
- **Nuclear Logout**: The frontend employs a strict `localStorage.clear()` accompanied by a hard refresh (`window.location.href = '/'`) during logout to ensure there are no lingering MSAL tokens.
- **Embedded Frame Masking**: To avoid confusing native Power BI tooltips and commands being visible along with the custom UI, the application specifically rewrites Power BI URLs to append `&navContentPaneEnabled=false&filterPaneEnabled=false&commands=false` and physically masks the remaining frame interface via CSS.

---

## 🎨 UI Aesthetics Reference
The application uses the **"Zuari Navy & Amber"** design system. Look for specific Tailwind CSS implementations:
- Core UI structures: `bg-[#F8FAFC]` backgrounds.
- Curvy layout aesthetics: `rounded-2xl` and `rounded-[2.5rem]`.
- Rich glassmorphism: Utilizing `/bg-slate-950/40 backdrop-blur-sm/` inside modals.
- Clean typography layouts heavily emphasizing uppercase tracking (`tracking-widest`).
