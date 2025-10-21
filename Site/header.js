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
          <img src="assetsassets/63f2deb8461fa01ba4dc31b5_Frame 2.svg" alt="Virry Health Logo" />
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
// This runs immediately.
const header = document.querySelector('header');
if (header) {
  header.innerHTML = headerHTML;
  header.insertAdjacentHTML('afterend', mobileMenuHTML);
} else {
  console.error('No <header> element found. Could not inject header.js content.');
}

// --- 3. ADD ALL SHARED LOGIC ---
// We wrap this all in DOMContentLoaded to ensure elements exist.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Active Nav Link Logic ---
    try {
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '' || currentPage === null) {
          currentPage = 'index.html'; // Default
        }
        const activeLinks = document.querySelectorAll(`[data-nav-link="${currentPage}"]`);
        activeLinks.forEach(link => {
          if(link) link.classList.add('active');
        });
    } catch (e) {
        console.error("Error setting active nav link:", e);
    }

    // --- Contrast Toggle Logic ---
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

    // --- Language Toggle Logic (NEW) ---
    const langBtn = document.getElementById('lang-toggle');
    
    // Define the translation function globally on the window
    // so other scripts (like footer.js and manual.js) can call it.
    window.setPageLanguage = (lang, rootElement = document) => {
        document.documentElement.lang = lang;
        rootElement.querySelectorAll('[data-en]').forEach(el => {
            const target_text = lang === 'uk' ? el.getAttribute('data-uk') : el.getAttribute('data-en');
            if (target_text != null) { el.innerHTML = target_text; }
        });
        if (langBtn) {
            langBtn.textContent = lang === 'uk' ? 'UKR / EN' : 'EN / УКР';
        }
        localStorage.setItem('lang', lang);
    };
    
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const cur = localStorage.getItem('lang') || 'en';
            const nextLang = cur.startsWith('en') ? 'uk' : 'en';
            
            // Set language for the whole page
            window.setPageLanguage(nextLang, document);
            
            // Fire a custom event that other scripts (like manual.js) can listen for
            const langChangeEvent = new CustomEvent('languageChanged', { detail: { newLang: nextLang } });
            document.dispatchEvent(langChangeEvent);
        });
    }
    
    // Set initial language on load
    const initialLang = localStorage.getItem('lang') || 'en';
    window.setPageLanguage(initialLang, document); 

    // --- Mobile Menu Logic ---
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