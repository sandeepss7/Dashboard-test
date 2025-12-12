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


// profile-panel.js
document.addEventListener('DOMContentLoaded', () => {
  const profilePanel = document.getElementById('profilePanel');
  const profileToggle = document.getElementById('profileToggle');
  const ICON = profileToggle?.querySelector('i');
  const STORAGE_KEY = 'profile_panel_collapsed';

  // restore state
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    profilePanel.classList.add('collapsed');
    if (ICON) ICON.classList.add('rotated');
    profileToggle.setAttribute('aria-pressed', 'true');
  } else {
    profileToggle.setAttribute('aria-pressed', 'false');
  }

  // toggle handler
  profileToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    const isCollapsed = profilePanel.classList.toggle('collapsed');

    // rotate icon
    if (ICON) ICON.classList.toggle('rotated', isCollapsed);
    profileToggle.setAttribute('aria-pressed', String(isCollapsed));

    // persist
    localStorage.setItem(STORAGE_KEY, isCollapsed ? '1' : '0');
  });
});
/* ---------------- */



/* ---first circle animation */
window.addEventListener('load', () => {

  // Helper: smooth tween for numbers (easeInOutCubic)
  function tweenNumber(from, to, duration, onTick, onComplete){
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
      const val = from + (to - from) * eased;
      onTick(val);
      if (t < 1) requestAnimationFrame(frame);
      else if (onComplete) onComplete();
    }
    requestAnimationFrame(frame);
  }

  // Chart factory
  function createDoughnut(canvas, colorStops, initialPercent) {
    const ctx = canvas.getContext('2d');
    // create gradient for the active slice
    const grad = ctx.createLinearGradient(0, 0, canvas.width || 96, 0);
    grad.addColorStop(0, colorStops[0]);
    grad.addColorStop(1, colorStops[1]);

    const data = {
      datasets: [{
        data: [initialPercent, 100 - initialPercent],
        backgroundColor: [grad, '#eef0f6'],
        borderWidth: 0,
        hoverOffset: 0
      }]
    };

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        cutout: '76%',
        rotation: -90,      // make 0% start at top (keeps look like SVG)
        circumference: 360,
        animation: {
          duration: 1100,
          easing: 'cubicBezier(.22,.9,.18,1)'
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }
        }
      }
    });

    return { chart, grad };
  }

  // Set up cards (with colors and initial values)
  const cardsCfg = [
    { canvasId: 'chart1', colorStops: ['#6f3cf1', '#8c61ff'], pLabel: 'pLabel1', pSmall: 'pSmall1', initial: parseInt(document.getElementById('card-1').dataset.initial || 74) },
    { canvasId: 'chart2', colorStops: ['#17c3a2', '#3ae6c8'], pLabel: 'pLabel2', pSmall: 'pSmall2', initial: parseInt(document.getElementById('card-2').dataset.initial || 58) },
    { canvasId: 'chart3', colorStops: ['#ff8a65', '#ff6b6b'], pLabel: 'pLabel3', pSmall: 'pSmall3', initial: parseInt(document.getElementById('card-3').dataset.initial || 45) }
  ];

  const instances = cardsCfg.map(cfg => {
    const canvas = document.getElementById(cfg.canvasId);
    // set explicit pixel size for consistent gradients
    canvas.width = 96; canvas.height = 96;
    const { chart } = createDoughnut(canvas, cfg.colorStops, cfg.initial);
    return {
      chart,
      cfg
    };
  });

  // update helper: smoothly update chart and center labels
  function updateCard(instance, newPercent) {
    newPercent = Math.max(0, Math.min(100, Math.round(newPercent)));
    const ds = instance.chart.data.datasets[0];
    const from = ds.data[0];
    ds.data[0] = newPercent;
    ds.data[1] = 100 - newPercent;
    // perform chart update with duration matching tween
    instance.chart.update({ duration: 1100, easing: 'cubicBezier(.22,.9,.18,1)' });

    // update numeric badges smoothly
    const labelEl = document.getElementById(instance.cfg.pLabel);
    const smallEl = document.getElementById(instance.cfg.pSmall);
    const startVal = parseInt((labelEl && labelEl.textContent || '0').replace('+','')) || 0;
    tweenNumber(startVal, newPercent, 1100, val => {
      const disp = `${Math.round(val) >= 0 ? '+' : ''}${Math.round(val)}%`;
      if (labelEl) labelEl.textContent = disp;
      if (smallEl) smallEl.textContent = disp;
    });
  }

  // initial staggered reveal
  instances.forEach((inst, i) => {
    setTimeout(() => {
      // initial already set in chart creation; ensure label matches
      const init = cardsCfg[i].initial;
      const labelEl = document.getElementById(cardsCfg[i].pLabel);
      const smallEl = document.getElementById(cardsCfg[i].pSmall);
      if (labelEl) labelEl.textContent = `+${init}%`;
      if (smallEl) smallEl.textContent = `+${init}%`;
    }, 120 + i * 120);
  });

  // Periodic updates (simulated). Replace simulation with fetch() for real data.
  setInterval(() => {
    // tune ranges per card or replace with server values
    updateCard(instances[0], Math.round(50 + Math.random() * 50)); // card1: 50..100
    updateCard(instances[1], Math.round(30 + Math.random() * 55)); // card2: 30..85
    updateCard(instances[2], Math.round(20 + Math.random() * 60)); // card3: 20..80
  }, 3500);

}); // load
/* ----------- */


/* charts */

