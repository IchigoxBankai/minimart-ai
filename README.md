# 🛒 MiniMart AI — The AI-Powered Retail Store Management OS

[![Deploy to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](https://github.com)
[![React 19](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

**MiniMart AI** is an intelligent, digital store manager and retail operating system designed for local retail businesses, supermarkets, and convenience stores. It combines sales, inventory, batch expiry tracking, and customer retention with an intelligent AI Store Manager co-pilot.

---

## ✨ Key Capabilities & Features

### 🧠 1. Dedicated AI Store Manager Co-Pilot
* **Analytical Reasoning Engine**: Analyzes inventory velocity, stockouts, top margin contributors, and customer behavior.
* **Proactive Action Proposals**: Generates restock POs and promotional bundles with 1-click execution confirmation.
* **🎙️ Voice Speech-to-Text (`webkitSpeechRecognition`)**: Hands-free voice commands while working behind the counter.

### 💳 2. POS Checkout & Real-time Retail Tools
* **📷 Barcode & QR Camera Scanner**: Live video stream scanner with instant Web Audio API synthetic beeping.
* **🧾 58mm / 80mm Thermal Receipt Printer**: Pixel-perfect printable receipts with instant WhatsApp sharing.
* **🎁 Customer Loyalty Rewards System**: Automatic points calculation (1 pt per ₹20 spent) with 1-click cart redemption and Bronze/Silver/Gold/Platinum tier progression.

### 🏬 3. Multi-Store Chain Management
* **Live Branch Switcher**: Switch between *Indiranagar Flagship*, *Koramangala 4th Block*, and *Whitefield Express*.
* **Custom Branch Registry**: Configure new physical locations and outlet codes in Settings.

### 🔒 4. Cashier / Kiosk Lock Mode
* **PIN-Protected Lock Screen**: Restrict cashiers to the checkout terminal while hiding sensitive profit margins, cost prices, and business analytics.
* **Tactile 4-Digit Keypad**: Quick unlock with owner master PIN (`1234` default).

### 💵 5. Cash Register Drawer & Day-End Z-Report
* **Expected Cash Balance Tracker**: Opening float + cash sales − petty cash payouts.
* **Shift Reconciliation & Z-Report**: Reconcile counted physical cash with printable day-end slips for accountants.

### ⏳ 6. Expiry & Freshness Batch Tracker
* **Batch Countdown Tracker**: Monitors perishable items (Dairy, Bakery, Beverages) expiring within 1–7 days.
* **1-Click Clearance Promo**: Automatically applies a 30% markdown discount on expiring batches to minimize spoilage.

### 🚚 7. Supplier PO Hub & Business Reports
* **Vendor Directory**: Track supplier lead times, payment terms, and phone contacts.
* **Instant PO Generator**: Auto-computes reorder quantities and costs with PDF download.
* **Automated PDF/CSV Business Reports**: Export daily, weekly, and monthly performance reports powered by `jsPDF` and `jsPDF-autotable`.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide React
* **Charts & Analytics**: Recharts
* **Document & Receipt Generation**: jsPDF, jsPDF-autotable, Canvas-Confetti
* **Audio & Hardware**: Web Audio API (synthetic retail scanner beeps), HTML5 MediaDevices (Camera Scanner), Web Speech API
* **State & Persistence**: Reactive LocalStorage Engine + Firestore-ready schema

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/minimart-ai.git

# 2. Enter project folder
cd minimart-ai

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `minimart-ai`).
2. Run the following commands in your project folder:

```bash
git init
git add .
git commit -m "feat: MiniMart AI Retail Operating System"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/minimart-ai.git
git push -u origin main
```

3. On your GitHub repository page:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, select **GitHub Actions**
   - The automated workflow `.github/workflows/deploy.yml` will automatically build and publish your site!

---

## 👤 Store Profile

* **Default Owner**: Nihar Puthran
* **Store Name**: DailyBasket Supermart
* **Email**: `nihar@dailybasket.store`
* **Demo PIN**: `1234`
