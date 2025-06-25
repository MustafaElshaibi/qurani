import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const AccessibilityEnhancements = () => {
  const lang = useSelector(state => state.lang);
  const isArabic = lang !== 'eng';

  useEffect(() => {
    // Set document language and direction
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = isArabic ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content';
    skipLink.className = 'sr-only skip-link';
    skipLink.style.cssText = `
      position: absolute;
      inset-inline-start: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
      background: #22c55e;
      color: #222;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      z-index: 50;
      transition: all 0.2s;
      font-weight: 500;
      text-decoration: none;
    `;

    // Show skip link on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.cssText = `
        position: absolute;
        top: 1rem;
        inset-inline-start: 1rem;
        width: auto;
        height: auto;
        overflow: visible;
        background: #22c55e;
        color: #222;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        z-index: 50;
        transition: all 0.2s;
        font-weight: 500;
        text-decoration: none;
      `;
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.cssText = `
        position: absolute;
        inset-inline-start: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        background: #22c55e;
        color: #222;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        z-index: 50;
        transition: all 0.2s;
        font-weight: 500;
        text-decoration: none;
      `;
    });

    // Insert skip link as first element
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('.main-display');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
      mainContent.setAttribute('aria-label', isArabic ? 'المحتوى الرئيسي' : 'Main content');
    }

    // Add focus visible styles and prevent horizontal scroll globally
    const style = document.createElement('style');
    style.textContent = `
      .skip-link:focus {
        outline: 2px solid #1DB954;
        outline-offset: 2px;
      }
      .sr-only {
        position: absolute !important;
        inset-inline-start: -10000px !important;
        top: auto !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
      }
      html, body, #root {
        overflow-x: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [isArabic]);

  // Announce route changes to screen readers
  useEffect(() => {
    const announceRouteChange = () => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = isArabic
        ? `تم الانتقال إلى ${document.title}`
        : `Navigated to ${document.title}`;

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Listen for route changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === document.head) {
          const titleElement = document.querySelector('title');
          if (titleElement && mutation.addedNodes.length > 0) {
            announceRouteChange();
          }
        }
      });
    });

    observer.observe(document.head, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isArabic]);

  return null;
};

export default AccessibilityEnhancements;

