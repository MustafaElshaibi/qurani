import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const AccessibilityEnhancements = () => {
  const lang = useSelector(state => state.lang);

  useEffect(() => {
    // Set document language
    document.documentElement.lang = lang === 'eng' ? 'en' : 'ar';
    
    // Set document direction
    document.documentElement.dir = lang === 'eng' ? 'ltr' : 'rtl';
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = lang === 'eng' ? 'Skip to main content' : 'تخطي إلى المحتوى الرئيسي';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green text-black px-4 py-2 rounded z-50 transition-all duration-200';
    skipLink.style.cssText = `
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    // Show skip link on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.cssText = `
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: auto;
        height: auto;
        overflow: visible;
        z-index: 50;
      `;
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
    });
    
    // Insert skip link as first element
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.main-display');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
      mainContent.setAttribute('aria-label', lang === 'eng' ? 'Main content' : 'المحتوى الرئيسي');
    }
    
    // Enhance focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Add focus visible styles
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible:focus {
        outline: 2px solid #1DB954;
        outline-offset: 2px;
      }
      
      .sr-only {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
      
      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        overflow: visible;
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
  }, [lang]);

  // Announce route changes to screen readers
  useEffect(() => {
    const announceRouteChange = () => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = lang === 'eng' 
        ? `Navigated to ${document.title}` 
        : `تم الانتقال إلى ${document.title}`;
      
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
  }, [lang]);

  return null;
};

export default AccessibilityEnhancements;

