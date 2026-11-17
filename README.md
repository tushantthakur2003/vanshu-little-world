# 🎀 Vanshu's Little World ♡
### Private Content Management Studio & Romantic Interactive Scrapbook

A handcrafted, cute Sanrio-inspired interactive digital scrapbook website created for **Vanshika Handoo (Vanshu)**, featuring a full private Content Management Studio (CMS) to manage messages, photos, reasons, anniversary dates, and romantic surprises without writing code.

---

## 🌟 Key Features

- **🌸 Public Romantic Scrapbook (For Vanshu):**
  - Cute Sanrio kawaii aesthetic with baby pink, lavender, soft peach, and cream.
  - Handcrafted vector characters: Chubby penguins, hugging penguins, baby bunnies, and bouncy gift boxes.
  - Interactive cards: Love Letter 💌, Virtual Hugs 🐧, 10 Reasons I Love You 🎀, Open When Sad 🐰, Polaroid Gallery 📸, and Animated Surprise Gift 🎁.
  - Special anniversary countdown timer (days, hours, minutes, seconds).
  - Secret final surprise unlocked only after exploring all 6 cards.
  - Romantic background music player (synthesized music box lullaby or custom song).
  - Completely clean: **never displays any admin buttons, gear icons, or editor controls**.

- **🔐 Private Content Studio (`/admin`):**
  - Accessible only via `/admin` with secure authentication.
  - **Draft vs. Published System**: Edit peacefully in draft mode without altering the live website.
  - **1-Click Live Publishing**: Push approved updates directly to the live website.
  - **Automatic History & 1-Click Backup Restore**: Revert to your previous published state anytime.
  - **Live Draft Preview**: Test your changes in phone or desktop view before publishing.
  - **Persistent Cloud Photo Storage**: Supabase Storage / IndexedDB with automatic mobile image compression.

---

## 🚀 How to Access & Log In to the Studio

1. **Start the application locally:**
   ```powershell
   cd f:\vanshu-little-world
   npm run dev
   ```
2. **Open the Content Studio in your browser:**
   👉 **`http://localhost:3000/admin`**
3. **Log in:**
   - **Initial Master Password:** `vanshu2024`
   - *(If Supabase is connected, you can also log in with your admin email and password).*
4. You are now inside **Vanshu's Little World – Content Studio**!

---

## 🧭 Content Studio Guide (10 Sections)

### 1. General Settings
- Edit Girlfriend's full name (*Vanshika Handoo*), nickname (*Vanshu*), website title (*Vanshu's Little World ♡*), and subtitle.

### 2. Welcome Screen
- Edit the main greeting (*Hey, Vanshu! ♡*), subtitle, supporting text, and the animated button text (*Open your little world ♡*).

### 3. Love Letters (Card 1)
- Customize the envelope wax seal label (*For My Vanshu*), card heading, and write full multi-paragraph romantic letters.

### 4. Message Cards
- **When You Miss Me (Card 2):** Edit the virtual hug note and button label (*Send me another hug ♡*).
- **Open When You're Sad (Card 4):** Edit the comforting letter and breathing circle reminder.

### 5. Reasons I Love You (Card 3)
- Click **"➕ Add New Reason"** to add as many reasons as you like.
- Edit existing reasons or click the trash icon to remove any reason.
- Use the **Up/Down arrows** to easily rearrange their order. Each reason appears as an interactive clickable heart on the website!

### 6. Photo Gallery 📸 (Card 5)
- **Upload Multiple Photos at Once:** Click **"Upload Photos (Multi)"** and select your pictures. The system automatically compresses and optimizes them for lightning-fast mobile loading on phones.
- **Polaroid Details:** Set memory titles, dates (e.g. *The Day We Met*), and sweet captions.
- **Featured Photo:** Click **"Make Featured Photo"** to highlight your favorite picture on the cover!
- **Rearrange Order:** Use the **Up/Down arrows** to arrange the order of your memories.

### 7. Anniversary & Milestone Dates
- **Main Anniversary:** Enter your anniversary date (`YYYY-MM-DD`), which automatically updates the live countdown clock on the public website.
- **Milestones:** Click **"➕ Add Special Date"** to add dates like *The Day We First Met*, *Our Very First Date*, birthdays, and special trips.

### 8. Surprise Gift (Card 6)
- Edit the gift card title, open button text (*Open your gift ♡*), and the surprise message revealed when the box lid animates open.

### 9. Secret Final Surprise
- Edit the final romantic letter revealed after Vanshu unlocks all 6 scrapbook memories.
- The 6-card unlocking requirement is safely preserved so she experiences the full romantic journey!

### 10. Music Settings
- Upload your own MP3 audio file or paste a music link.
- Adjust the default soft volume slider.
- Click **"Preview Uploaded Music"** to listen right inside the studio before publishing.

---

## 💾 Saving, Previewing & Publishing

The studio has a safe two-stage workflow:

1. **Save Changes (Draft):**
   - Click **"Save Changes"** at the top right.
   - Your edits are saved as a draft. The live website remains untouched, allowing you to edit across multiple sessions.
2. **Preview Before Publishing:**
   - Click **"Preview"** in the top bar.
   - A modal opens showing the website with your current draft content applied. You can switch between **Phone** and **Desktop** views to verify everything!
3. **Publish Changes (Make Live):**
   - Click **"Publish Changes"**.
   - Your draft content is promoted to the live website.
   - The previous published version is automatically saved as a backup!
4. **Restore Backup (If needed):**
   - If you ever want to undo a publish, click **"Restore Backup"** in the top bar to instantly revert to the previous version.

---

## ☁️ Connecting Supabase (For Cloud Database & Photo CDN)

The website works seamlessly in **Local Mode** right out of the box using persistent browser storage. If you want updates and photo uploads to synchronize across devices without redeploying:

1. Create a free account at [supabase.com](https://supabase.com) and create a project.
2. In Supabase, go to the **SQL Editor**, open the file [`src/supabase_schema.sql`](file:///f:/vanshu-little-world/src/supabase_schema.sql), copy its contents, and click **Run**.
   *(This creates the database table, RLS security policies, and the `photos` and `music` cloud storage buckets).*
3. Go to **Project Settings > API** in Supabase and copy your `Project URL` and `anon public key`.
4. In `f:\vanshu-little-world`, create a file named `.env` and add:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
5. Restart your dev server (`npm run dev`). Your Content Studio will now say **"Supabase Cloud Connected"**!

---

## 🌐 Deploying & Sending to Vanshu

To get a public HTTPS link (e.g. `https://vanshu-little-world.vercel.app`) to send to Vanshu on WhatsApp:

### Option A: Vercel (Recommended & Free)
```powershell
cd f:\vanshu-little-world
npx vercel
```
Vercel automatically detects the Vite configuration and deploys your website in seconds!

### Option B: Netlify (Drag-and-Drop)
1. Run `npm run build` in `f:\vanshu-little-world`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the `dist` folder onto the Netlify page. Your site is live!

---

## 📱 Mobile Compatibility & Security
- **Strictly Private:** Public visitors opening `https://your-site.vercel.app/` see only the romantic scrapbook. Accessing `/admin` requires your password.
- **Zero Plaintext Secrets:** Uses Web Crypto SHA-256 password hashing.
- **Mobile Responsive:** Works smoothly on Windows, Mac, iPhone (Safari), and Android (Chrome).

---

Handcrafted with endless love for Vanshika Handoo (Vanshu) ♡
