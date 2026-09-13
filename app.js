// LINKPACK ULTRA SONIC ENGINE
// 100% Client-side URL compressor & launcher

const createView = document.getElementById("create-view");
const packView = document.getElementById("pack-view");
const packForm = document.getElementById("pack-form");
const packTitleInput = document.getElementById("pack-title");
const linkInputsList = document.getElementById("link-inputs-list");
const addLinkBtn = document.getElementById("add-link-btn");
const itemsCounter = document.getElementById("items-counter");

const viewTitle = document.getElementById("view-title");
const viewCount = document.getElementById("view-count");
const viewLinksList = document.getElementById("view-links-list");
const openAllBtn = document.getElementById("open-all-btn");
const copyAllUrlsBtn = document.getElementById("copy-all-urls-btn");
const resetBtn = document.getElementById("reset-btn");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");

let currentPack = null;

// Safe UTF-8 Base64 serialization
function encodePayload(obj) {
  const jsonStr = JSON.stringify(obj);
  return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
}

function decodePayload(hashStr) {
  try {
    const raw = decodeURIComponent(hashStr.replace(/^#/, ''));
    const jsonStr = decodeURIComponent(escape(atob(raw)));
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Payload decoding error:", e);
    return null;
  }
}

// Visual Toast System
let toastTimer;
function triggerToast(message) {
  clearTimeout(toastTimer);
  toastMsg.textContent = message;
  toast.classList.remove("hidden");
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

// Update Manifest Count Badge
function updateItemsCounter() {
  const count = linkInputsList.querySelectorAll(".link-row").length;
  itemsCounter.textContent = `${count} link${count === 1 ? "" : "s"}`;
}

// Add a Dynamic Link Row
function appendLinkRow(url = "", label = "") {
  const row = document.createElement("div");
  row.className = "link-row";
  row.innerHTML = `
    <input type="text" class="link-label-input" placeholder="Label (optional)" value="${label}" />
    <input type="url" class="link-url-input" placeholder="https://example.com" value="${url}" required />
    <button type="button" class="btn-trash" title="Remove Link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  `;

  row.querySelector(".btn-trash").addEventListener("click", () => {
    if (linkInputsList.querySelectorAll(".link-row").length > 1) {
      row.remove();
      updateItemsCounter();
    } else {
      triggerToast("Keep at least 1 destination in the pack.");
    }
  });

  linkInputsList.appendChild(row);
  updateItemsCounter();
}

// Router Logic
function route() {
  const hash = window.location.hash;
  if (hash && hash.length > 2) {
    const payload = decodePayload(hash);
    if (payload && Array.isArray(payload.links) && payload.links.length > 0) {
      renderViewer(payload);
      return;
    }
  }
  renderCreator();
}

function renderCreator() {
  createView.classList.remove("hidden");
  packView.classList.add("hidden");

  if (linkInputsList.children.length === 0) {
    appendLinkRow("https://hackclub.com", "Hack Club HQ");
    appendLinkRow("https://github.com", "GitHub Workspace");
  }
}

function renderViewer(data) {
  currentPack = data;
  createView.classList.add("hidden");
  packView.classList.remove("hidden");

  viewTitle.textContent = data.title || "Curated LinkPack";
  const linkCount = data.links.length;
  viewCount.textContent = `${linkCount} target${linkCount === 1 ? "" : "s"}`;

  viewLinksList.innerHTML = "";
  data.links.forEach((item) => {
    const li = document.createElement("li");
    const domain = safeGetDomain(item.url);
    const label = item.label || domain;

    li.innerHTML = `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="sonic-item">
        <div class="sonic-item-info">
          <span class="item-label">${escapeHtml(label)}</span>
          <span class="item-url">${escapeHtml(item.url)}</span>
        </div>
        <svg class="item-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </a>
    `;
    viewLinksList.appendChild(li);
  });
}

function safeGetDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return url;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Event Listeners
addLinkBtn.addEventListener("click", () => appendLinkRow());

packForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = packTitleInput.value.trim();
  const rows = linkInputsList.querySelectorAll(".link-row");
  const links = [];

  rows.forEach((row) => {
    let url = row.querySelector(".link-url-input").value.trim();
    const label = row.querySelector(".link-label-input").value.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      links.push({ url, label });
    }
  });

  if (links.length === 0) return;

  const payload = { title, links };
  const encodedHash = encodePayload(payload);
  window.location.hash = encodedHash;

  navigator.clipboard.writeText(window.location.href).then(() => {
    triggerToast("⚡ Supersonic Pack Copied to Clipboard!");
  }).catch(() => {
    triggerToast("Pack created! Copy the browser address bar.");
  });

  route();
});

openAllBtn.addEventListener("click", () => {
  if (!currentPack || !currentPack.links) return;
  currentPack.links.forEach((item) => {
    window.open(item.url, "_blank", "noopener,noreferrer");
  });
});

copyAllUrlsBtn.addEventListener("click", () => {
  if (!currentPack || !currentPack.links) return;
  const rawList = currentPack.links.map(l => l.url).join("\n");
  navigator.clipboard.writeText(rawList).then(() => {
    triggerToast("All raw URLs copied to clipboard!");
  });
});

resetBtn.addEventListener("click", () => {
  window.location.hash = "";
  packForm.reset();
  linkInputsList.innerHTML = "";
  route();
});

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);