# Immanuel-Laos Church — Website

A fast, free, static church website in Lao. Built with [Astro](https://astro.build).

ເວັບໄຊຄຣິສຕະຈັກພາສາລາວ, ສ້າງດ້ວຍ Astro — ໄວ, ຟຣີ, ແລະ ງ່າຍຕໍ່ການດູແລ.

---

## 🚀 Quick Start (ເລີ່ມຕົ້ນໄວ)

### 1. Install Node.js

Download and install **Node.js v20 or newer** from [nodejs.org](https://nodejs.org).

ດາວໂຫຼດ ແລະ ຕິດຕັ້ງ Node.js ເວີຊັນ 20 ຫຼື ໃໝ່ກວ່າ.

### 2. Install dependencies

Open a terminal in this folder and run:

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Open http://localhost:4321 in your browser. Changes auto-reload.

ເປີດ http://localhost:4321 — ການປ່ຽນແປງຈະສະແດງອັດຕະໂນມັດ.

### 4. Build for production

```bash
npm run build
```

The finished website appears in the `dist/` folder. Upload that to any host.

ເວັບທີ່ສຳເລັດແລ້ວຈະຢູ່ໃນໂຟລເດີ `dist/` — ອັບໂຫຼດໄປຫາໂຮດຕິ້ງໃດກໍ່ໄດ້.

---

## ✏️ How to Edit (ວິທີແກ້ໄຂ)

### Update church details (ຂໍ້ມູນໂບດ)

**Edit one file: `site.config.ts`** — your church name, address, phone, email, pastor, service times, and navigation all live here.

ແກ້ໄຂໄຟລ໌ `site.config.ts` ບ່ອນດຽວ — ຂໍ້ມູນທັງໝົດຂອງໂບດຢູ່ທີ່ນັ້ນ.

### Post news (ລົງຂ່າວສານ)

Create a new `.md` file in `src/content/news/` (copy `welcome.md` as a template):

ສ້າງໄຟລ໌ `.md` ໃໝ່ໃນ `src/content/news/` (ກ໋ອບປີ້ `welcome.md` ເປັນແມ່ແບບ):

```markdown
---
title: "ຫົວຂໍ້ຂ່າວ"
date: 2026-05-01
author: "ທີມງານໂບດ"
excerpt: "ຄຳອະທິບາຍສັ້ນໆ."
---

ເນື້ອໃນຂອງຂ່າວ... ທ່ານສາມາດໃຊ້ **ໂຕໜາ**, *ໂຕຕົວຂວາ*, ແລະ [ລິ້ງ](https://example.com).

## ຫົວຂໍ້ຍ່ອຍ

ເນື້ອໃນຕໍ່ໄປ...
```

Save the file — the new post appears automatically on `/news`.

### Add a sermon (ເພີ່ມຄຳເທດສະໜາ)

Create a `.md` file in `src/content/sermons/`. Include the YouTube video ID if you have one:

```markdown
---
title: "ຄວາມເຊື່ອທີ່ມີຊີວິດ"
date: 2026-04-20
preacher: "ສິດຍາພິບານ"
scripture: "ຮ່ເບຣີ 11:1"
youtubeId: "dQw4w9WgXcQ"   # part of youtube URL after v=
excerpt: "ຄຳອະທິບາຍສັ້ນໆ."
---

ເນື້ອໃນຄຳເທດສະໜາ...
```

### Add an event (ເພີ່ມເຫດການ)

Create a `.md` file in `src/content/events/`:

```markdown
---
title: "ຄ້າຍພັກຂອງໜຸ່ມສາວ"
date: 2026-06-15
location: "ວັດຂຽວ"
excerpt: "ຄຳອະທິບາຍ."
---

ລາຍລະອຽດເພີ່ມເຕີມ...
```

### Add photos to gallery (ເພີ່ມຮູບ)

1. Put image files in `public/images/gallery/`
2. Open `src/pages/gallery.astro` and add entries to the `photos` array:

```ts
const photos = [
  { src: '/images/gallery/worship-1.jpg', alt: 'ການນະມັດສະການ', caption: 'ວັນອາທິດ' },
  { src: '/images/gallery/event-1.jpg',   alt: 'ເຫດການພິເສດ',  caption: 'ເຫດການພິເສດ' },
];
```

### Enable livestream (ເປີດໃຊ້ການຖ່າຍທອດສົດ)

In `site.config.ts`, set `social.livestreamEmbedUrl` to:

- **YouTube Live:** `https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID`
- **Specific video:** `https://www.youtube.com/embed/VIDEO_ID`
- **Facebook Live:** `https://www.facebook.com/plugins/video.php?href=YOUR_VIDEO_URL`

### Enable online giving (ເປີດໃຊ້ການບໍລິຈາກອອນລາຍ)

In `site.config.ts`, set `giving.paymentLinkUrl`. Options:

- **Stripe Payment Link** (recommended) — free to create at [stripe.com/payments/payment-links](https://stripe.com/payments/payment-links)
- **PayPal.me** — e.g. `https://paypal.me/yourchurch`
- **Bank transfer** — fill in the `giving.bankInfo` section instead

### Connect contact form (ເຊື່ອມຕໍ່ຟອມຕິດຕໍ່)

Open `src/pages/contact.astro` and replace `YOUR_FORM_ID` in the form `action=""`:

1. Sign up free at [formspree.io](https://formspree.io)
2. Create a new form → copy the endpoint URL
3. Paste it into `action="https://formspree.io/f/YOUR_FORM_ID"`

---

## 🌐 Deploying for Free (ການອັບເວັບຂຶ້ນອິນເຕີເນັດຟຣີ)

### Cloudflare Pages (recommended)

1. Push this folder to a GitHub repository.
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → **Create project** → connect your repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Click deploy. Your site will be live at `your-project.pages.dev` in ~2 minutes.
5. To use a custom domain (e.g. `immanuel-laos.org`), add it in the Cloudflare Pages settings.

### Netlify (alternative)

1. Push to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → connect repo.
3. Build command: `npm run build` · Publish directory: `dist`.

Both are completely free for a site this size.

ທັງສອງບໍລິການແມ່ນຟຣີທັງໝົດສຳລັບເວັບຂະໜາດນີ້.

---

## 📁 File Structure (ໂຄງສ້າງໄຟລ໌)

```
immanuel-laos-church/
├── site.config.ts              ← EDIT THIS for church info
├── src/
│   ├── pages/                  ← each file = one page on the site
│   │   ├── index.astro         ← homepage
│   │   ├── news/
│   │   ├── sermons/
│   │   ├── events/
│   │   ├── gallery.astro
│   │   ├── livestream.astro
│   │   ├── giving.astro
│   │   └── contact.astro
│   ├── content/                ← ADD posts here as .md files
│   │   ├── news/
│   │   ├── sermons/
│   │   └── events/
│   ├── components/             ← Header & Footer
│   ├── layouts/                ← shared page wrapper
│   └── styles/global.css       ← colors, fonts, buttons
└── public/                     ← images, favicon (copied as-is)
    └── images/
```

---

## 🎨 Customizing the Look (ປ່ຽນຮູບລັກສະນະ)

All colors live at the top of `src/styles/global.css` as CSS variables:

```css
:root {
  --bg:          #FAF6EC;   /* background */
  --ink:         #1F2A33;   /* text */
  --accent:      #A97C3A;   /* gold accent */
  /* ... */
}
```

Change these values and the whole site updates instantly.

---

## ❓ Need Help?

The Astro documentation is excellent: [docs.astro.build](https://docs.astro.build)

Built with ❤️ for Immanuel-Laos Church.
