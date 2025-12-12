// sidebar.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const navCol = document.querySelector('.app-sidebar .nav-col');
  const navItems = Array.from(document.querySelectorAll('.app-sidebar .nav-item'));
  let edgePill = document.querySelector('.app-sidebar .edge-pill');
  const panelTitle = document.getElementById('panelTitle');

  // create edge-pill if missing
  if (!edgePill) {
    edgePill = document.createElement('div');
    edgePill.className = 'edge-pill d-none d-md-block';
    navCol.appendChild(edgePill);
  }

  // helper to compute position relative to nav-col
  function positionEdgePillFor(item) {
    if (!item || !edgePill) return;
    const navRect = navCol.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const topWithin = itemRect.top - navRect.top;
    edgePill.style.top = `${topWithin}px`;
    edgePill.style.height = `${itemRect.height}px`;
    edgePill.style.opacity = '1';
  }

  // set active item and optionally switch panels
  function setActiveItem(item, { switchPanel = true } = {}) {
    if (!item) return;
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // move the pill (but hide if collapsed)
    if (sidebar.classList.contains('collapsed')) {
      edgePill.style.opacity = '0';
    } else {
      positionEdgePillFor(item);
    }

    // switch main content panels
    if (switchPanel) {
      const tabName = item.dataset.tab;
      if (tabName) {
        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach(p => {
          p.style.display = (p.dataset.panel === tabName) ? '' : 'none';
        });
        if (panelTitle) panelTitle.textContent = (item.innerText || tabName).trim();
        // update URL hash (optional). Uncomment if you want deep-linking:
        // history.replaceState(null, '', `#${tabName}`);
      }
    }
  }

  // initialize with active or first item
  const initial = navItems.find(i => i.classList.contains('active')) || navItems[0];
  // delay to allow fonts/layout to settle
  setTimeout(() => setActiveItem(initial, { switchPanel: true }), 30);

  // attach item click & keyboard handlers
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveItem(item);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // collapse toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');

      // icon rotation (toggle class on icon element)
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.classList.toggle('rotated');

      // hide/show edge pill on collapse/expand
      if (sidebar.classList.contains('collapsed')) {
        edgePill.style.opacity = '0';
      } else {
        // restore pill under the active item after the width transition completes
        const activeNow = document.querySelector('.app-sidebar .nav-item.active') || navItems[0];
        // use a slight timeout to match CSS transition timing
        setTimeout(() => positionEdgePillFor(activeNow), 200);
      }
    });
  }

  // Optional: persist last active tab in localStorage
  const STORAGE_KEY = 'applify_sidebar_active_tab';
  // restore if present
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedItem = navItems.find(i => i.dataset.tab === stored);
    if (storedItem) setActiveItem(storedItem, { switchPanel: true });
  }
  // save on change
  navItems.forEach(i => i.addEventListener('click', () => {
    if (i.dataset.tab) localStorage.setItem(STORAGE_KEY, i.dataset.tab);
  }));

  // responsiveness: reposition pill on window resize (layout changes)
  window.addEventListener('resize', () => {
    const activeNow = document.querySelector('.app-sidebar .nav-item.active') || navItems[0];
    if (!sidebar.classList.contains('collapsed')) positionEdgePillFor(activeNow);
  });
});
