// header.js

// --- 1. DEFINE HTML CONTENT ---
const headerHTML = `
  <div class="wrap topbar" role="navigation" aria-label="Top bar">
    <a href="index.html" class="brand" aria-label="Homepage">
      <img src="assets/BRAVEMIND-Logo.png" alt="BRAVEMIND Ukraine logo" />
      <div>
        <strong>BRAVEMIND Ukraine</strong>
        <div style="font-size:.925rem;color:var(--muted)">USC Institute for Creative Technologies &amp; Partners</div>
      </div>
    </a>
    <nav>
        <a href="index.html" data-nav-link="index.html">Home</a>
        <a href="about.html" data-nav-link="about.html">About</a>
        <a href="how-it-works.html" data-nav-link="how-it-works.html">How It Works</a>
        <a href="adaptations.html" data-nav-link="adaptations.html">Adaptations</a>
        <a href="news.html" data-nav-link="news.html">News</a>
    </nav>
    <div class="controls">
      <button class="btn" type="button" id="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <button class="btn" type="button" id="lang-toggle" aria-pressed="false" aria-label="Toggle language">EN / УКР</button>
      <button class="btn" type="button" id="contrast-toggle" aria-pressed="false" aria-label="Toggle dark mode">Dark</button>
    </div>
  </div>
  <div class="partner-bar-container">
      <div class="wrap partner-bar">
        <span class="partner-label" data-en="In partnership with:" data-uk="У партнерстві з:">In partnership with:</span>
        <div class="header-partner-logos">
          <img src="assets/USC.png" alt="USC Logo" />
          <img src="assets/InternationalInstituteforPostgraduateEducation.png" alt="International Institute of Postgraduate Education Logo" />
          <img src="assets/63f2deb8461fa01ba4dc31b5_Frame 2.svg" alt="Virry Health Logo" />
          <img src="assets/Regent.png" alt="Regent Logo" />
        </div>
      </div>
    </div>
`;

const mobileMenuHTML = `
  <div id="mobile-menu" class="mobile-nav">
      <button class="btn" id="close-menu-btn" aria-label="Close menu">&times;</button>
      <a href="index.html" data-nav-link="index.html">Home</a>
      <a href="about.html" data-nav-link="about.html">About</a>
      <a href="how-it-works.html" data-nav-link="how-it-works.html">How It Works</a>
      <a href="adaptations.html" data-nav-link="adaptations.html">Adaptations</a>
      <a href="news.html" data-nav-link="news.html">News</a>
  </div>
`;

// --- 2. INJECT HTML ---
const header = document.querySelector('header');
if (header) {
  header.innerHTML = headerHTML;
  header.insertAdjacentHTML('afterend', mobileMenuHTML);
} else {
  console.error('No <header> element found. Could not inject header.js content.');
}

// --- 3. ADD SHARED LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
  // Active nav
  try {
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'index.html';
    document.querySelectorAll(`[data-nav-link="${currentPage}"]`).forEach(link => link.classList.add('active'));
  } catch (e) { console.error("Error setting active nav link:", e); }

  // Contrast toggle
  const contrastBtn = document.getElementById('contrast-toggle');
  if (contrastBtn) {
    const isDark = () => document.body.classList.contains('dark');
    const setTheme = mode => {
      document.body.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('theme', mode);
      contrastBtn.textContent = mode === 'dark' ? 'Light' : 'Dark';
      contrastBtn.setAttribute('aria-pressed', String(mode === 'dark'));
    };
    const storedTheme = localStorage.getItem('theme') || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(storedTheme);
    contrastBtn.addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
  }

  // --- Language toggle + safe translator ---
  const langBtn = document.getElementById('lang-toggle');

  // Preserve .output values while translating a node
  function translateElementPreservingOutputs(el, targetHTML) {
    if (!el) return;
    const existing = {};
    el.querySelectorAll('.output[data-input-id]').forEach(sp => {
      const id = sp.getAttribute('data-input-id');
      if (!id) return;
      existing[id] = {
        text: sp.textContent,
        isPlaceholder: sp.classList.contains('placeholder') || /^\(.*\)$/.test((sp.textContent || '').trim())
      };
    });
    el.innerHTML = targetHTML;
    el.querySelectorAll('.output[data-input-id]').forEach(sp => {
      const id = sp.getAttribute('data-input-id');
      const keep = id ? existing[id] : null;
      if (keep && keep.text && !keep.isPlaceholder) {
        sp.textContent = keep.text;
        sp.classList.remove('placeholder');
      } else {
        const txt = (sp.textContent || '').trim();
        sp.classList.toggle('placeholder', /^\(.*\)$/.test(txt));
      }
    });
  }

  // Update placeholders for inputs/textareas if they define data-*-placeholder
  function translatePlaceholders(root) {
    root.querySelectorAll('input[data-en-placeholder], textarea[data-en-placeholder]').forEach(el => {
      const lang = document.documentElement.lang || 'en';
      const key = lang === 'uk' ? 'data-uk-placeholder' : 'data-en-placeholder';
      const ph = el.getAttribute(key);
      if (ph != null) el.setAttribute('placeholder', ph);
    });
    // Option captions can be translated using data-en / data-uk on <option>
    root.querySelectorAll('option[data-en]').forEach(opt => {
      const lang = document.documentElement.lang || 'en';
      opt.textContent = lang === 'uk' ? (opt.getAttribute('data-uk') ?? opt.textContent) : (opt.getAttribute('data-en') ?? opt.textContent);
    });
  }

  // Global translator
  window.setPageLanguage = (lang, rootElement = document) => {
    document.documentElement.lang = lang;

    const manualContent = document.getElementById('manual-content');
    const nodes = rootElement.querySelectorAll('[data-en]');

    nodes.forEach(el => {
      // If we're translating the whole document, skip anything inside #manual-content
      if (rootElement === document && manualContent && manualContent.contains(el)) return;

      const targetText = lang === 'uk' ? el.getAttribute('data-uk') : el.getAttribute('data-en');
      if (targetText == null) return;

      const hasOutputsNow =
        el.querySelector('.output') ||
        /class\s*=\s*["'][^"']*output[^"']*["']/.test(targetText);

      if (hasOutputsNow) translateElementPreservingOutputs(el, targetText);
      else el.innerHTML = targetText;
    });

    // Translate placeholders & option captions inside this root
    translatePlaceholders(rootElement);

    if (langBtn) langBtn.textContent = lang === 'uk' ? 'UKR / EN' : 'EN / УКР';
    localStorage.setItem('lang', lang);
  };

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const cur = localStorage.getItem('lang') || 'en';
      const nextLang = cur.startsWith('en') ? 'uk' : 'en';

      // Translate everything EXCEPT #manual-content; manual page will do its own region
      window.setPageLanguage(nextLang, document);

      // Notify listeners
      const ev = new CustomEvent('languageChanged', { detail: { newLang: nextLang } });
      document.dispatchEvent(ev);
    });
  }

  // Initial language
  const initialLang = localStorage.getItem('lang') || 'en';
  window.setPageLanguage(initialLang, document);

  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    });
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  }
});
