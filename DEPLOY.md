# Portfolio Deployment & Security Guide

This guide walks you through deploying your portfolio to **Cloudflare Pages** with Cloudflare DNS, Web Application Firewall (WAF), HTTPS, privacy-safe analytics, and contact form email delivery.

---

## 1. Domain Status & Options: `dharsh.aportfolio`

### Why `dharsh.aportfolio` Cannot Be Registered
* **`.aportfolio` is not a recognized Top-Level Domain (TLD)** in the official [IANA Root Zone Database](https://www.iana.org/domains/root/db) or ICANN registry.
* Because it does not exist in the global DNS root zone, **no domain registrar in the world** (Cloudflare, Namecheap, GoDaddy, etc.) can register or route it, and web browsers will show an `NXDOMAIN` (non-existent domain) error.

### Recommended Closest Options
1. **100% Free Forever (Instant & Included)**:
   * `dharsh.pages.dev` or `dharshini.pages.dev`
   * Comes free with Cloudflare Pages, zero renewal fees, instant global SSL/TLS, and Cloudflare DDoS protection.
2. **Professional Personal Brand Domains**:
   * **`dharshini.me`** or **`dharsh.me`** — Standard and popular for personal portfolios (~$10–$15/year).
   * **`dharshini.dev`** or **`dharsh.dev`** — Google's developer TLD, enforced HTTPS by default (~$12–$15/year).
   * **`dharshini.in`** or **`dharsh.in`** — Official India domain (~$6–$8/year).
   * **`dharshini.site`** or **`dharsh.site`** — Budget-friendly (~$1–$2 for the first year).
   * **`dharshportfolio.com`** — If you want the exact word "portfolio" in your domain.

---

## 2. Architecture Overview

```
GitHub Repository
       │
       ▼ (Automatic deploy on git push)
Cloudflare Pages (Global CDN, 300+ Edge Data Centers)
       │
       ▼
Cloudflare WAF / Firewall & Bot Fight Mode
       │
       ▼
Custom Domain (or *.pages.dev) [Enforced HTTPS + HSTS]
```

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Push Code to GitHub
1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: IT Portfolio with security headers & contact form"
   ```
2. Create a new repository on your GitHub account (`Dharshini1909`):
   * Go to [github.com/new](https://github.com/new)
   * Repository name: `portfolio` (or `dharsh-portfolio`)
   * Visibility: **Public**
   * Do **not** initialize with README or .gitignore (they already exist locally)
3. Link and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/Dharshini1909/portfolio.git
   git push -u origin main
   ```

---

### Step 2: Deploy to Cloudflare Pages (Free)
1. Sign up or log in at [dash.cloudflare.com](https://dash.cloudflare.com) (100% Free).
2. Go to **Workers & Pages** → click **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub repository (`portfolio`).
4. In the build settings:
   * **Project name**: `dharsh` (or `dharshini`)
   * **Production branch**: `main`
   * **Framework preset**: `None`
   * **Build command**: *(leave empty)*
   * **Build output directory**: `/` (or leave empty)
5. Click **Save and Deploy**.
6. In ~15 seconds, your site will be live at `https://dharsh.pages.dev`!

---

### Step 3: Configure Cloudflare WAF & Security

Once your site is connected to Cloudflare:
1. **Enable Bot Fight Mode**:
   * In Cloudflare Dashboard, go to **Security** → **Bots**.
   * Toggle **Bot Fight Mode** to **ON**. This challenges or blocks automated crawlers, scrapers, and spam bots.
2. **Enable Free Managed WAF Rule**:
   * Go to **Security** → **WAF** → **Custom Rules**.
   * You can add up to 5 free rules (e.g., block requests from known malicious threat scores).
3. **Enforce HTTPS & HSTS**:
   * Go to **SSL/TLS** → **Edge Certificates**.
   * Turn ON **Always Use HTTPS**.
   * Turn ON **Automatic HTTPS Rewrites**.
   * Note: The `_headers` file in your repository already provides high-grade security headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, and `Content-Security-Policy`).

---

### Step 4: Activate Contact Form to `smartdrip19@gmail.com`

Your contact form is already pre-wired for **Web3Forms** (which does not expose any email passwords, SMTP secrets, or private tokens):

1. Go to [web3forms.com](https://web3forms.com).
2. Enter your email: `smartdrip19@gmail.com` and click **Create Access Key**.
3. Check your Gmail inbox and copy the generated access key (looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
4. Open `script.js` at line 245 and replace `YOUR_WEB3FORMS_KEY_HERE` with your key:
   ```javascript
   const WEB3_KEY = 'your-actual-access-key';
   ```
5. Commit and push:
   ```bash
   git add script.js
   git commit -m "Configure contact form access key"
   git push
   ```
Cloudflare Pages will automatically redeploy within seconds, and any message sent through your Contact section will instantly arrive in `smartdrip19@gmail.com` with:
* Visitor Name
* Visitor Email
* Message Content
* Date & Timestamp

---

### Step 5: Privacy-Safe Visitor Information & Alerts

#### Primary Dashboard: Cloudflare Web Analytics (Recommended)
1. In Cloudflare Pages, go to your project → **Analytics** tab.
2. Click **Enable Web Analytics**.
3. **What you get**:
   * Real-time visitor counts and timestamps
   * Page visited & top popular content
   * Country and approximate region
   * Referrer sources (e.g., LinkedIn, GitHub, Google, direct)
   * Device types (desktop, mobile) and browsers
4. **Privacy Guaranteed**:
   * No cookies used.
   * No IP addresses stored.
   * Zero personal or sensitive information tracked.

#### Optional Visitor Email Alert:
Your site includes a session-based visitor alert in `index.html` (lines 1352) that can notify `smartdrip19@gmail.com` when a new session starts.
* **Important Note on Email Alerts**: Web3Forms free tier provides **250 submissions per month**.
* If you enable visitor emails for every session, a high number of visitors can quickly consume the 250 monthly quota, leaving fewer slots for genuine contact inquiries.
* **Best practice**: Use the **Cloudflare Web Analytics** dashboard for tracking visitors (unlimited & zero quota usage), and reserve the Web3Forms quota for incoming messages from your contact form.
