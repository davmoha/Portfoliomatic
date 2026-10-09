# Mo-Blind Portfoliomatic & Veteran Career Transition Suite
### Production Deployment, Configuration, and Troubleshooting Guide

---

## 1. System Overview & Architecture

**Mo-Blind Portfoliomatic** is a full-stack career transition platform built specifically for military veterans and technical professionals. It integrates three core engines into a unified command hub:

1. **GitHub Pages Portfolio Generator & 1-Click Deployer**: Creates high-converting, ATS-linked personal portfolio websites with hex color customization, specular card shaders, monogram generator, and automated GitHub repository deployment.
2. **ATS Resume Architect & Career Translation Engine**: Ingests past resumes, NCOERs, and evaluations, demilitarizes military terminology into corporate civilian language, calculates ATS keyword match scores against target job descriptions, and writes quantified ROI bullets and executive cover letters.
3. **Hiring Manager Persona Mock Interviewer**: A multi-turn AI rehearsal simulation that adopts the persona of the actual interviewer and company, conducts interactive interviews with real-time "Coach's Critiques," and generates an Interview Readiness Report.

### Technical Stack
* **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, JSZip.
* **Backend**: Node.js, Express, Google Gen AI SDK (`@google/genai`).
* **AI Model**: `gemini-3.8-flash` (server-side proxy, zero client-side key exposure).
* **Build Tooling**: Vite with full-stack middleware bridge (`tsx server.ts`).

---

## 2. Environment Variables & Security Setup

### How the Gemini API Key is Secured
The application uses a **Server-Side Proxy Architecture**. The Gemini API key is **never exposed to the client browser**.
* Client components make requests to `/api/resume/transform` and `/api/interview/chat`.
* The Node.js Express server (`server.ts`) reads `process.env.GEMINI_API_KEY` internally to call the Gemini API.
* All AI outputs are validated, parsed, and sanitized before returning JSON to the browser.

### Configuration (`.env`)
Create a `.env` file in the project root based on `.env.example`:

```bash
# ===================================================================
# 1. AI CONFIGURATION (MANDATORY FOR RESUME & INTERVIEW ENGINES)
# ===================================================================
# Obtain your API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIzaSyYourActualKeyHere..."

# ===================================================================
# 2. SERVER & DOMAIN CONFIGURATION
# ===================================================================
PORT=3000
NODE_ENV=production

# The public canonical URL where your platform is hosted
# Example: https://portfoliomatic.mo-blind.com or https://your-domain.com
APP_URL="https://your-domain.com"

# ===================================================================
# 3. GITHUB OAUTH APP (OPTIONAL - PAT FALLBACK IS ALWAYS ACTIVE)
# ===================================================================
# If left blank, users deploy instantly using a GitHub Personal Access Token (PAT).
# To enable 1-click GitHub OAuth popups, register an OAuth App in GitHub Developer Settings:
# Authorization callback URL: https://your-domain.com/auth/callback
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

---

## 3. Installation & Local Development

### Prerequisites
* **Node.js**: v20.x or v22.x LTS installed.
* **npm**: v10.x or higher.

### Step-by-Step Setup:
```bash
# 1. Clone repository
git clone https://github.com/your-username/portfoliomatic.git
cd portfoliomatic

# 2. Install all dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env and enter your GEMINI_API_KEY

# 4. Start the full-stack development server
npm run dev
# The platform will be live at http://localhost:3000
```

---

## 4. Production Deployment to a VPS (Hostinger, Ubuntu, AWS, DigitalOcean)

Follow these steps to deploy on an Ubuntu Linux VPS with PM2 and Nginx reverse proxy:

### Step 1: Install System Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw

# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

### Step 2: Clone and Build Application
```bash
# Navigate to web root
cd /var/www
sudo git clone https://github.com/your-username/portfoliomatic.git
cd portfoliomatic

# Set permissions
sudo chown -R $USER:$USER /var/www/portfoliomatic

# Install production dependencies and compile frontend
npm install
npm run build
```

### Step 3: Configure Environment Variables
```bash
nano .env
# Paste your production values:
# GEMINI_API_KEY="AIzaSy..."
# APP_URL="https://yourdomain.com"
# PORT=3000
# NODE_ENV=production
```

### Step 4: Run Application with PM2
```bash
# Start server process with tsx
pm2 start server.ts --name "portfoliomatic" --interpreter ./node_modules/.bin/tsx --time

# Configure PM2 to restart automatically on server reboot
pm2 startup
pm2 save
```

### Automatic Updates: Push to Deploy via GitHub Actions
We have included a pre-configured GitHub Actions workflow in `.github/workflows/vps-deploy.yml`. Once set up, whenever you push code to GitHub `main`, your VPS will automatically pull, compile, and reload PM2 without you touching the server.

To activate automatic push-to-deploy:
1. Open your repository on GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret** and add:
   * `VPS_HOST`: Your VPS IP address (e.g. `123.45.67.89`)
   * `VPS_USERNAME`: Your SSH username (e.g. `root` or `ubuntu`)
   * `VPS_SSH_KEY`: Your private SSH key (or `VPS_PASSWORD`)
   * `VPS_APP_PATH`: `/var/www/portfoliomatic` (optional, defaults to `/var/www/portfoliomatic`)
3. Every time you run `git push origin main`, GitHub will securely SSH into your VPS and deploy the update!

### Manual 1-Command Fast Update (`deploy.sh`)
If you prefer triggering updates from your terminal without full automation, run the included `deploy.sh` script on your VPS:
```bash
cd /var/www/portfoliomatic
./deploy.sh
```
This single command automatically pulls new commits, updates dependencies, recompiles the production frontend, and reloads PM2 with zero downtime.

### Step 5: Configure Nginx Reverse Proxy with SSL
Create `/etc/nginx/sites-available/portfoliomatic`:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and install free SSL certificate with Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/portfoliomatic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install Certbot for Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 5. Payment & Monetization Architecture: PayPal vs. Stripe

### Current Active Setup: Direct PayPal Checkout
The suite is currently connected to your verified Mo-Blind PayPal payment link:
* **Checkout Link**: `https://www.paypal.com/ncp/payment/4SBJE4CC562B4`
* **Features**: Accepts Visa, MasterCard, Amex, Discover, PayPal balance, and Venmo without requiring any server-side database or webhook maintenance.
* **Discount Code**: Users entering `VETLAUNCH` in the unlock modal receive an instant 50% discount ($14.50 single tool / $24.50 3-in-1 campaign pass).
* **Admin Overrides**: Codes `MOBLINDPRO`, `FREEDOM`, `CAREER2026`, and `HERO100` provide instant full unlocks for team members and VIP testers.

### Should You Implement Stripe?
* **For Launch Day**: **No.** Keep PayPal for your initial launch. It requires zero server maintenance, eliminates webhook failure risks, and lets you start collecting revenue immediately.
* **When to Add Stripe**: Once you surpass your first 15–20 paying candidates, you can add Stripe Checkout to offer Apple Pay / Google Pay and automatic webhook-driven license key emails.

---

## 6. Comprehensive Troubleshooting Guide

### Issue 1: "AI Resume Transformation failed: API key not valid" or 500 error
* **Cause**: `GEMINI_API_KEY` is missing or invalid in your `.env` file.
* **Fix**:
  1. Verify the key at [Google AI Studio](https://aistudio.google.com/app/apikey).
  2. Ensure `.env` is located in the root directory where `server.ts` is running.
  3. Restart PM2: `pm2 restart portfoliomatic --update-env`.

### Issue 2: "GitHub Authentication Error: redirect_uri is not associated with this application"
* **Cause**: The GitHub OAuth App registered in GitHub Developer Settings has a callback URL that does not match your active domain.
* **Fix**:
  1. Open GitHub Developer Settings -> OAuth Apps -> Your App.
  2. Set **Authorization callback URL** to match your exact domain: `https://yourdomain.com/auth/callback`.
  3. *Alternative*: Users can switch to the **Personal Access Token (PAT)** option in the modal, which bypasses OAuth entirely with zero domain restrictions.

### Issue 3: Nginx returns "413 Request Entity Too Large" during resume upload
* **Cause**: Nginx default client upload limit is 1MB.
* **Fix**: Add `client_max_body_size 50M;` inside your Nginx `server { ... }` block and reload Nginx:
  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

### Issue 4: Dev server or PM2 shows "Port 3000 already in use"
* **Fix**: Identify the process holding port 3000 and terminate it:
  ```bash
  sudo lsof -i :3000
  # Kill process by PID:
  sudo kill -9 <PID>
  # Restart service:
  pm2 restart portfoliomatic
  ```

### Issue 5: GitHub Pages deployment succeeds, but website shows 404
* **Cause**: GitHub Pages takes between 60 to 180 seconds to build the Jekyll-free static assets on GitHub's edge network for newly created repositories.
* **Fix**: Wait 2 minutes and check `https://<username>.github.io`. The deployer automatically commits `.nojekyll` to prevent Jekyll build failures.

---

## 7. Verified Release Checklist Before Launch

- [x] Gemini AI Server Proxy operational (`/api/resume/transform`, `/api/interview/chat`).
- [x] Graphical Brand Logo (`logo.png`) upload and preview functioning.
- [x] 1-Click GitHub Pages deployer tested with both OAuth and PAT fallback.
- [x] ZIP package generator verified with `index.html`, `profile.jpg`, `resume.pdf`, `logo.png`, `README.md`, and `.nojekyll`.
- [x] Zero-database portable project save/load (`.json`) verified.
- [x] PayPal checkout links verified.
- [x] Military 50% discount code `VETLAUNCH` active.
- [x] 1-on-1 Executive Strategy Cadillac Tier linked to David's direct profile.
- [x] Mobile and tablet responsive viewports tested.
