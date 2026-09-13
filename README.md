# ⚡ LinkPack // Ultra Sonic Edition

> **A zero-backend, friction-obliterating link packager and supersonic multi-tab launcher.**  
> Built for the **Hack Club Stardance // "Frictionless" Challenge**.

---

## 🎯 The Friction It Destroys
Sharing 5-10 related links (dev resources, Figma drafts, documentation, PR reviews) clutters chats and forces recipients to click, tab-back, click, tab-back over and over.

**LinkPack solves this in 1 action:**
1. Bundle infinite links with optional human labels.
2. Generate an **autonomous, hash-encoded URL** (zero database, zero tracking, instant execution).
3. The recipient opens your link and hits **"Launch All in Parallel"** to burst-open everything at once.

---

## 🚀 Key Features

* **⚡ Ultra Sonic UI:** Cyber-tactile dark void aesthetic with glassmorphism (`backdrop-filter`), ambient radial glow meshes, and micro-interactions.
* **📦 100% Stateless & Client-Side:** Serializes the entire payload into `window.location.hash` using safe UTF-8 base64 encoding. It never expires and costs $0.00 to host.
* **🚀 Parallel Execution:** Single-click launcher opens all destinations in parallel tabs (`window.open`).
* **📋 Clipboard Integration:** Automatically copies the generated bundle link to your clipboard upon creation, plus a 1-click "Copy All List" raw export.
* **📱 Ultra Responsive:** Fluid layout built with CSS custom properties, responsive flex engines, and mobile touch targets.

---

## 🛠️ Tech Stack
- **HTML5:** Semantic markup, dynamic DOM insertion.
- **CSS3:** Custom properties, blur glassmorphism, animated ambient lighting, custom scrollbars, keyframe animations.
- **Vanilla JavaScript (ES6+):** UTF-8 base64 URL hash serialization, hashchange routing, Web Clipboard API.

---

## 💻 Quickstart / Running Locally

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (or serve with VS Code Live Server / Python):
   ```bash
   python -m http.server 8000
