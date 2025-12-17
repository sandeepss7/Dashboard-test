
/*************************************************
 * SIDEBAR + EDGE PILL + TABS (SINGLE SOURCE)
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const navCol = document.querySelector('.app-sidebar .nav-col');
  const navItems = Array.from(document.querySelectorAll('.app-sidebar .nav-item'));
  const panelTitle = document.getElementById('panelTitle');

  let edgePill = document.querySelector('.app-sidebar .edge-pill');

  // Create edge pill if missing
  if (!edgePill && navCol) {
    edgePill = document.createElement('div');
    edgePill.className = 'edge-pill d-none d-md-block';
    navCol.appendChild(edgePill);
  }

  function positionEdgePillFor(item) {
    if (!item || !edgePill) return;
    const navRect = navCol.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    edgePill.style.top = `${itemRect.top - navRect.top}px`;
    edgePill.style.height = `${itemRect.height}px`;
    edgePill.style.opacity = '1';
  }

  function setActiveItem(item, { switchPanel = true } = {}) {
    if (!item) return;

    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (sidebar.classList.contains('collapsed')) {
      edgePill.style.opacity = '0';
    } else {
      positionEdgePillFor(item);
    }

    if (switchPanel) {
      const tabName = item.dataset.tab;
      if (tabName) {
        document.querySelectorAll('.tab-panel').forEach(p => {
          p.style.display = p.dataset.panel === tabName ? '' : 'none';
        });
        if (panelTitle) {
          panelTitle.textContent = (item.innerText || tabName).trim();
        }
        localStorage.setItem('applify_sidebar_active_tab', tabName);
      }
    }
  }

  // Restore last tab
  const stored = localStorage.getItem('applify_sidebar_active_tab');
  const initial =
    navItems.find(i => i.dataset.tab === stored) ||
    navItems.find(i => i.classList.contains('active')) ||
    navItems[0];

  setTimeout(() => setActiveItem(initial), 30);

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      setActiveItem(item);
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveItem(item);
      }
    });
  });

  toggleBtn?.addEventListener('click', () => {

  // 📱 MOBILE & TABLET
  if (window.innerWidth <= 880) {
    // close profile first
    profilePanel?.classList.remove('open');

    sidebar.classList.toggle('mobile-open');
    return;
  }

  // 🖥️ DESKTOP
  closeProfileIfOpen();

  sidebar.classList.toggle('collapsed');

  const icon = toggleBtn.querySelector('i');
  icon && icon.classList.toggle('rotated');

  if (sidebar.classList.contains('collapsed')) {
    edgePill && (edgePill.style.opacity = '0');
  } else {
    const activeNow =
      document.querySelector('.app-sidebar .nav-item.active');
    activeNow && setTimeout(() => positionEdgePillFor(activeNow), 200);
  }
});


  

  window.addEventListener('resize', () => {
    const activeNow =
      document.querySelector('.app-sidebar .nav-item.active') || navItems[0];
    if (!sidebar.classList.contains('collapsed')) {
      positionEdgePillFor(activeNow);
    }
  });

  /* in mobile sidebar */
mobileSidebarToggle?.addEventListener('click', () => {

  // close profile if open
  profilePanel?.classList.remove('open');

  const isOpen = sidebar.classList.toggle('mobile-open');

  // 🔥 toggle button state
  mobileSidebarToggle.classList.toggle('sidebar-open', isOpen);
});



navItems.forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 880) {
      sidebar.classList.remove('mobile-open');
    }
  });
});


window.addEventListener('resize', () => {
  if (window.innerWidth > 880) {
    sidebar.classList.remove('mobile-open');
  }
});


  /*  */
  /*************************************************
   * PROFILE PANEL (UNCHANGED)
   *************************************************/
  const profilePanel = document.getElementById('profilePanel');
  const profileToggle = document.getElementById('profileToggle');
  const floatingProfileBtn = document.getElementById('floatingProfileBtn');
  const mainArea = document.getElementById('mainArea');

  function toggleProfilePanel() {
    profilePanel.classList.toggle('open');
    if (window.innerWidth > 768) {
      mainArea.classList.toggle('with-profile');
    }
  }

  profileToggle?.addEventListener('click', toggleProfilePanel);
  floatingProfileBtn?.addEventListener('click', toggleProfilePanel);

});

function closeSidebarIfOpen() {
  if (sidebar && sidebar.classList.contains('collapsed') === false) {
    sidebar.classList.add('collapsed');
    edgePill && (edgePill.style.opacity = '0');
  }
}

function closeProfileIfOpen() {
  if (profilePanel && profilePanel.classList.contains('open')) {
    profilePanel.classList.remove('open');
    mainArea.classList.remove('with-profile');
  }
}

function toggleProfilePanel() {
  // 🔴 close sidebar first
  closeSidebarIfOpen();

  profilePanel.classList.toggle('open');

  if (window.innerWidth > 880) {
    mainArea.classList.toggle('with-profile');
  }
}



/*************************************************
 * DASHBOARD CHARTS (100% ORIGINAL CONFIG)
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {

  const weeklyChart = new Chart(
    document.getElementById('weeklyChart').getContext('2d'),
    {
      type: 'bar',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [
          { label:'Rejected', data:[20,20,20,20,20,20,20], backgroundColor:'#f56565', barThickness:25 },
          { label:'Shortlisted', data:[45,40,48,43,45,50,48], backgroundColor:'#ecc94b', barThickness:25 },
          { label:'Applications', data:[20,17,22,15,30,28,24], backgroundColor:'#805ad5', barThickness:25 }
        ]
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        plugins:{ legend:{ display:false }},
        scales:{
          x:{ stacked:true, grid:{ display:false }},
          y:{ stacked:true, beginAtZero:true, max:100 }
        }
      }
    }
  );

 // Timeline Chart Data (Applications Received Time)
        const timelineData = {
            labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
            datasets: [{
                label: 'Applications',
                data: [50, 68, 72, 95, 65, 85, 90],
                borderColor: '#f56565',
                backgroundColor: 'rgba(245, 101, 101, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#f56565',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#f56565',
                borderWidth: 2.5
            }]
        };

        const timelineConfig = {
            type: 'line',
            data: timelineData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% applications';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a0aec0',
                            font: {
                                size: 13,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            color: '#a0aec0',
                            font: {
                                size: 12
                            },
                            stepSize: 25
                        },
                        grid: {
                            color: '#e2e8f0',
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };

        const timelineCtx = document.getElementById('timelineChart').getContext('2d');
        const timelineChart = new Chart(timelineCtx, timelineConfig);
  new Chart(
    document.getElementById('genderChart').getContext('2d'),
    {
      type:'doughnut',
      data:{
        labels:['Male','Female'],
        datasets:[{
          data:[35,65],
          backgroundColor:['#805ad5','#f56565'],
          borderWidth:0,
          cutout:'75%'
        }]
      },
      options:{ plugins:{ legend:{ display:false }}}
    }
  );

  // Animate Progress Bars
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelectorAll('.stat-bar').forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
            }, 300);
        });

});


/*************************************************
 * FIRST CIRCLE CARD ANIMATION (FULL VERSION)
 *************************************************/
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
        rotation: -90,   
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
