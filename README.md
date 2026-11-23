# CampusGigs — Skills for Hire (Campus Edition)

> **Design Thinking Course Project**: P25 "Skills for Hire, Campus Edition" (Student Freelancing and Micro-Gigs)  
> **Architecture**: 100% Client-Side Front-End Prototype. **Zero Backend, Zero External Database**. All data is safely stored in browser `localStorage`.

---

## 🚀 Quick Start (Run Locally)

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start local development server**:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173` (or the port Vite prints in your terminal).

---

## 📦 Production Build

```bash
npm run build
npm run preview
```
The output files will be compiled into the `dist/` directory, ready for immediate static hosting.

---

## 🌐 Deploy to Vercel or Netlify (Under 2 Minutes)

Because CampusGigs has **no backend or database**, you can deploy it directly as a pure static web app:

### Deploying to Netlify
1. Drag and drop the `dist/` folder directly to [Netlify Drop](https://app.netlify.com/drop).
2. Or connect your GitHub repo:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`

### Deploying to Vercel
1. Run `npx vercel` in the project root, or import the GitHub repository in your Vercel Dashboard.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 💡 Important Prototype Notes for Course Evaluators

1. **Browser-Isolated Persistence**:
   - Every browser session maintains its own sandbox via `localStorage`. Changes made on one device stay on that device unless transferred via the **Admin JSON Export/Import** tool.
2. **One-Click Demo Access**:
   - Click **Log In** to test as **Student Freelancer** (`Rohan Verma`) or **Campus Club Lead** (`Robotics & AI Society`).
3. **Bilateral Agreement Card & Testing Role Switcher**:
   - On any Agreement Card (`/agreements/:id`), use the top toolbar `[ Switch Role (Prototype Only) ]` to toggle between the client and freelancer views on the same machine to demonstrate the end-to-end handshake.
4. **Research Integrity Guardrails**:
   - All starter records are flagged with a visible **Sample** badge.
   - Go to `/admin` (Passcode: `CAMPUS25`) and click **Clear Sample Data** to remove all demo items, leaving only your real test records.
5. **Field Testing Matrix**:
   - Use the floating **Give Feedback** button on any page to record usability issues.
   - Go to `/admin` to inspect the live **Feedback Capture Matrix** and click **Export Matrix to CSV** for direct inclusion in course submissions.
