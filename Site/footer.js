// footer.js
document.addEventListener('DOMContentLoaded', () => {
  const footerHTML = `
    <div class="footer-grid">
        <div>
            <p>&copy; 2025 BRAVEMIND Ukraine Project</p>
            <p>USC Institute for Creative Technologies & Partners</p>
            <div class="footer-links">
                <a href="manual.html" data-en="User Manual (Authorized Access)" data-uk="Посібник користувача (авторизований доступ)">User Manual (Authorized Access)</a>
            </div>
        </div>
        <div class="footer-contact">
            <h3 data-en="Contact & Links" data-uk="Контакти та посилання">Contact & Links</h3>
            <div class="footer-links">
                <a href="https://www.youtube.com/@SkipRizzoClinicalVR" target="_blank" rel="noopener" data-en="Dr. Skip Rizzo's Clinical VR Channel" data-uk="Канал клінічної ВР доктора Скіпа Ріццо">Dr. Skip Rizzo's Clinical VR Channel</a>
                <a href="https://www.virryhealth.com/" target="_blank" rel="noopener">Virry Health</a>
                <a href="https://americanprogram.net/" target="_blank" rel="noopener" data-en="Int'l Institute for Postgraduate Ed." data-uk="Міжнародний інститут післядипломної освіти">Int'l Institute for Postgraduate Ed.</a>
            </div>
        </div>
    </div>
  `;
  
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = footerHTML;
    
    // Re-apply language settings *using the new global function from header.js*
    if (window.setPageLanguage) {
      const currentLang = localStorage.getItem('lang') || 'en';
      window.setPageLanguage(currentLang, footer);
    }
  }
});