(() => {
  const init = () => {
    const root = document.documentElement;
    const header = document.getElementById('top');
    const nav = header?.querySelector('nav');
    const row = nav?.firstElementChild;
    const toggle = header?.querySelector('.mobile-nav-toggle');
    const menu = header?.querySelector('.mobile-nav');

    if (!header || !nav || !row || !toggle || !menu || header.dataset.navigationReady) return;

    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'))
      .filter((link) => link.hash !== '#top');
    const sections = Array.from(new Set(navLinks.map((link) => link.hash.slice(1))))
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const desktop = window.matchMedia('(min-width: 48rem)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const progress = document.createElement('div');
    progress.className = 'nav-progress';
    progress.setAttribute('aria-hidden', 'true');

    let headerHeight = 92;
    let pageHeight = 0;
    let maxScroll = 0;
    let sectionPositions = [];
    let activeId = null;
    let lastProgress = '';
    let wasScrolled = false;
    let updateFrame = 0;
    let metricsFrame = 0;

    const setMenuOpen = (open) => {
      menu.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('is-menu-open', open);
    };

    const setActive = (id) => {
      if (id === activeId) return;
      activeId = id;
      navLinks.forEach((link) => {
        if (link.hash.slice(1) === id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const updateScrollState = () => {
      updateFrame = 0;
      const y = Math.max(0, window.scrollY);
      const value = (maxScroll > 0 ? Math.min(1, y / maxScroll) : 0).toFixed(4);
      if (value !== lastProgress) {
        progress.style.transform = `scaleX(${value})`;
        lastProgress = value;
      }

      const scrolled = y > 8;
      if (scrolled !== wasScrolled) {
        header.classList.toggle('is-scrolled', scrolled);
        wasScrolled = scrolled;
      }

      const marker = y + headerHeight + 24;
      let id = null;
      for (const section of sectionPositions) {
        if (section.top > marker) break;
        id = section.id;
      }
      if (sectionPositions.length && y + window.innerHeight >= pageHeight - 2) {
        id = sectionPositions[sectionPositions.length - 1].id;
      }
      setActive(id);
    };

    const scheduleScrollUpdate = () => {
      if (!updateFrame) updateFrame = window.requestAnimationFrame(updateScrollState);
    };

    const refreshMetrics = () => {
      metricsFrame = 0;
      const style = window.getComputedStyle(nav);
      const height = Math.ceil(row.getBoundingClientRect().height
        + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
      if (height > 0 && height !== headerHeight) {
        headerHeight = height;
        root.style.setProperty('--site-header-height', `${height}px`);
      }
      pageHeight = Math.max(root.scrollHeight, document.body.scrollHeight, root.clientHeight);
      maxScroll = Math.max(0, pageHeight - window.innerHeight);
      sectionPositions = sections.map((section) => ({
        id: section.id,
        top: section.getBoundingClientRect().top + window.scrollY,
      })).sort((a, b) => a.top - b.top);
      scheduleScrollUpdate();
    };

    const scheduleMetricsRefresh = () => {
      if (!metricsFrame) metricsFrame = window.requestAnimationFrame(refreshMetrics);
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
        setMenuOpen(false);
      }
    });
    header.addEventListener('focusout', (event) => {
      // WebKit can briefly blur to the document during a pointer activation.
      // Only close for a confirmed focus move outside the header, so the menu
      // remains available until the link receives its click and native action.
      if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) {
        setMenuOpen(false);
      }
    });
    const onDesktopChange = (event) => {
      if (event.matches) setMenuOpen(false);
      scheduleMetricsRefresh();
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktopChange);
    else desktop.addListener(onDesktopChange);

    // A fixed element cannot act as a document-top scroll target on its own.
    document.querySelectorAll('a[href="#top"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0
          || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        setMenuOpen(false);
        if (window.location.hash !== '#top') window.history.pushState(null, '', '#top');
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
    });
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#top') {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
      scheduleScrollUpdate();
    });

    // Expose the compact menu only once its interactions are installed.
    setMenuOpen(false);
    toggle.hidden = false;
    header.append(progress);
    root.classList.add('nav-ready');
    header.dataset.navigationReady = 'true';
    refreshMetrics();

    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', scheduleMetricsRefresh, { passive: true });
    window.addEventListener('load', scheduleMetricsRefresh, { once: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(scheduleMetricsRefresh);
      observer.observe(row);
      observer.observe(document.body);
    }
    document.fonts?.ready.then(scheduleMetricsRefresh);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
