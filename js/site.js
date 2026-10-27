(() => {
  const init = () => {
    const notebook = document.querySelector('[data-hero-notebook]');
    const source = notebook?.querySelector('.notebook-static');
    const status = notebook?.querySelector('[data-notebook-status]');
    if (!notebook || !source || !status) return;

    const intro = notebook.closest('.hero-section');
    if (intro && 'IntersectionObserver' in window) {
      let introVisible = false;
      const updateAvailability = () => {
        intro.classList.toggle('is-intro-visible', introVisible && !document.hidden);
      };
      const availabilityObserver = new IntersectionObserver(([entry]) => {
        introVisible = entry.isIntersecting;
        updateAvailability();
      });
      availabilityObserver.observe(intro);
      document.addEventListener('visibilitychange', updateAvailability);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

    let timer = 0;
    let started = false;
    let finished = false;
    let inView = false;
    let visibleCharacters = 0;
    let typedLayer = null;
    let fragments = [];
    let observer;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      typedLayer?.remove();
      notebook.classList.remove('is-running');
      notebook.classList.add('is-complete');
      delete notebook.dataset.phase;
      status.textContent = 'Ready';
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onMotionChange);
    };

    const onVisibilityChange = () => {
      if (document.hidden && started) finish();
      else if (!document.hidden && inView && !started) start();
    };
    const onMotionChange = (event) => {
      if (event.matches) finish();
    };

    const start = () => {
      if (started || finished || document.hidden) return;
      started = true;
      typedLayer = source.cloneNode(true);
      typedLayer.className = 'notebook-typing';
      typedLayer.setAttribute('aria-hidden', 'true');
      const walker = document.createTreeWalker(typedLayer, NodeFilter.SHOW_TEXT);
      let node;
      let total = 0;
      while ((node = walker.nextNode())) {
        const text = node.data;
        fragments.push({ node, text, start: total });
        total += text.length;
        node.data = '';
      }
      source.parentElement.append(typedLayer);
      notebook.classList.add('is-running');
      notebook.dataset.phase = 'gather';
      status.textContent = 'Gathering…';

      const tick = () => {
        if (finished) return;
        visibleCharacters = Math.min(total, visibleCharacters + 2);
        fragments.forEach(({ node: textNode, text, start }) => {
          const next = text.slice(0, Math.max(0, visibleCharacters - start));
          if (textNode.data !== next) textNode.data = next;
        });
        const fraction = visibleCharacters / total;
        const phase = fraction < 0.4 ? 'gather' : fraction < 0.8 ? 'explore' : 'explain';
        if (notebook.dataset.phase !== phase) {
          notebook.dataset.phase = phase;
          status.textContent = phase === 'explore' ? 'Exploring…' : 'Explaining…';
        }
        if (visibleCharacters >= total) finish();
        else timer = window.setTimeout(tick, 45);
      };
      timer = window.setTimeout(tick, 180);
    };

    observer = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      if (inView) start();
      else if (started) finish();
    }, { threshold: 0.15 });
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionChange);
    observer.observe(notebook);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
