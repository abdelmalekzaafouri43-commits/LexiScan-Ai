# LexiScan AI - AI English Worksheet Generator & Layout Scanner

An intelligent full-stack educational tool designed for English teachers and educators to automatically scan physical worksheet layouts, structure exercises with interactive drag-and-drop customization, attach vector illustrations, link interactive digital QR exercises, and export high-resolution A4 print-ready PDFs.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **npm** or **pnpm** / **yarn**
- **Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd lexiscan-ai
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### 4. Run Development Server
Start the full-stack Vite + Express server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Production Build & Deployment

### Standard Node.js Build
```bash
# 1. Build the frontend client & server bundle
npm run build

# 2. Start the production server
npm run start
```

### Static HTML & GitHub Pages Build (Pure HTML/JS/CSS)
If you want to host this purely as static HTML files on GitHub Pages, Netlify, or open it directly:
```bash
# Compile directly to portable static HTML in dist/
npm run build:html
```
The resulting `dist/` directory contains standard `index.html`, Javascript, and CSS with portable relative paths ready to be pushed to your `gh-pages` branch or any static website host!

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

---

## 📱 Mobile & Phone Deployment

### Option 1: Progressive Web App (PWA)
1. Deploy the app to your hosting service (Google Cloud Run, Vercel, Render, Railway, or VPS).
2. Open your deployed domain in mobile Chrome (Android) or Safari (iOS).
3. Select **Add to Home Screen** / **Install App** for a full native-feeling mobile experience with camera integration.

### Option 2: Wrap with Capacitor (Android APK / iOS App)
If you want to package this as an Android `.apk` or Xcode project:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init LexiScanAI com.lexiscan.app --web-dir dist
npm run build
npx cap add android
npx cap open android
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Drag & Drop (`@hello-pangea/dnd`), Canvas rendering (`html2canvas`, `jspdf`)
- **Backend**: Node.js, Express, tsx, esbuild
- **AI Intelligence**: Google Gemini API (`@google/genai`) with automatic model cascade fallback
- **Visuals & QR**: Vector SVG Synthesizer, Dynamic QR Code generator with integrated audio/quiz endpoints

---

## 📄 License
MIT License. Created with Google AI Studio.
