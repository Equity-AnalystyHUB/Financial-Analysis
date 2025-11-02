// Data
const scenarioData = {
  base_case: {
    name: 'Base Case',
    color: '#0066CC',
    years: [
      { year: 2026, penetration: 2.0, subscribers: 55, arpu: 270, incremental_revenue: 14.8, incremental_ebitda: 2.7, net_cash_flow: -6.3, payback_months: null, simple_roi: null, irr: null, notes: 'Pilot/limited scale. Integration costs frontloaded' },
      { year: 2027, penetration: 4.0, subscribers: 120, arpu: 270, incremental_revenue: 32.4, incremental_ebitda: 8.8, net_cash_flow: 1.8, payback_months: 18, simple_roi: 0.18, irr: 11, notes: 'Early scaling in 3 regions' },
      { year: 2028, penetration: 6.5, subscribers: 215, arpu: 270, incremental_revenue: 58.1, incremental_ebitda: 17.5, net_cash_flow: 15.7, payback_months: 16, simple_roi: 0.56, irr: 24, notes: 'Vet/retail brings acceleration' },
      { year: 2029, penetration: 8.0, subscribers: 310, arpu: 270, incremental_revenue: 83.7, incremental_ebitda: 28.9, net_cash_flow: 27.1, payback_months: 15, simple_roi: 1.01, irr: 31, notes: 'APAC growth kicks in' },
      { year: 2030, penetration: 10.0, subscribers: 420, arpu: 270, incremental_revenue: 113.4, incremental_ebitda: 41.7, net_cash_flow: 41.3, payback_months: 13, simple_roi: 1.72, irr: 37, notes: 'Full rollout, regular ops' }
    ]
  },
  upside: {
    name: 'Upside',
    color: '#2e7d32',
    years: [
      { year: 2026, penetration: 2.5, subscribers: 68, arpu: 295, incremental_revenue: 20.1, incremental_ebitda: 4.5, net_cash_flow: -3.8, payback_months: null, simple_roi: null, irr: null, notes: 'Higher ARPU + faster take rate' },
      { year: 2027, penetration: 5.5, subscribers: 165, arpu: 295, incremental_revenue: 48.7, incremental_ebitda: 14.6, net_cash_flow: 6.5, payback_months: 13, simple_roi: 0.22, irr: 14, notes: 'Stronger initial results' },
      { year: 2028, penetration: 9.0, subscribers: 290, arpu: 295, incremental_revenue: 85.6, incremental_ebitda: 27.1, net_cash_flow: 27.1, payback_months: 11, simple_roi: 0.78, irr: 28, notes: 'Above-plan lift' },
      { year: 2029, penetration: 11.5, subscribers: 410, arpu: 295, incremental_revenue: 120.9, incremental_ebitda: 41.9, net_cash_flow: 41.9, payback_months: 10, simple_roi: 1.19, irr: 39, notes: 'Vet/DTC + new geos' },
      { year: 2030, penetration: 13.0, subscribers: 510, arpu: 295, incremental_revenue: 150.5, incremental_ebitda: 56.4, net_cash_flow: 56.0, payback_months: 9, simple_roi: 1.60, irr: 42, notes: 'Quantified Pet norm' }
    ]
  },
  downside: {
    name: 'Downside',
    color: '#d84315',
    years: [
      { year: 2026, penetration: 1.5, subscribers: 39, arpu: 220, incremental_revenue: 8.6, incremental_ebitda: 0.2, net_cash_flow: -9.1, payback_months: null, simple_roi: null, irr: null, notes: 'Pilot slower/riskier' },
      { year: 2027, penetration: 2.8, subscribers: 72, arpu: 220, incremental_revenue: 15.8, incremental_ebitda: -1.2, net_cash_flow: -6.0, payback_months: 40, simple_roi: -0.09, irr: null, notes: 'Below plan, payback slips' },
      { year: 2028, penetration: 4.0, subscribers: 115, arpu: 220, incremental_revenue: 25.3, incremental_ebitda: 2.3, net_cash_flow: -1.5, payback_months: 30, simple_roi: 0.11, irr: 7, notes: 'Flat vet, retail lag' },
      { year: 2029, penetration: 5.0, subscribers: 145, arpu: 220, incremental_revenue: 33.1, incremental_ebitda: 5.9, net_cash_flow: 3.7, payback_months: 27, simple_roi: 0.31, irr: 12, notes: 'Some improvement' },
      { year: 2030, penetration: 7.0, subscribers: 206, arpu: 220, incremental_revenue: 45.1, incremental_ebitda: 10.1, net_cash_flow: 8.5, payback_months: 21, simple_roi: 0.48, irr: 16, notes: 'Recovery but behind base' }
    ]
  }
};

// State
let currentScenario = 'base_case';
let charts = {};

// Initialize
function init() {
  setupTabs();
  setupComparisonToggle();
  renderDashboard(currentScenario);
  renderComparison();
}

// Setup Tabs
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const scenario = tab.dataset.scenario;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentScenario = scenario;
      renderDashboard(scenario);
    });
  });
}

// Setup Comparison Toggle
function setupComparisonToggle() {
  const toggleBtn = document.getElementById('toggleComparison');
  const dashboardView = document.getElementById('dashboardView');
  const comparisonView = document.getElementById('comparisonView');
  
  toggleBtn.addEventListener('click', () => {
    const isComparison = comparisonView.classList.contains('hidden');
    if (isComparison) {
      dashboardView.classList.add('hidden');
      comparisonView.classList.remove('hidden');
      toggleBtn.textContent = 'View Dashboard';
    } else {
      dashboardView.classList.remove('hidden');
      comparisonView.classList.add('hidden');
      toggleBtn.textContent = 'View Comparison';
    }
  });
}

// Render Dashboard
function renderDashboard(scenario) {
  const data = scenarioData[scenario];
  renderKPICards(data);
  renderCharts(data);
  renderReturns(data);
  renderNotes(data);
}

// Render KPI Cards
function renderKPICards(data) {
  const grid = document.getElementById('kpiGrid');
  grid.innerHTML = '';
  
  data.years.forEach((year, index) => {
    const card = document.createElement('div');
    card.className = 'kpi-card' + (index === data.years.length - 1 ? ' highlight' : '');
    card.innerHTML = `
      <div class="kpi-year">${year.year}</div>
      <div class="kpi-metrics">
        <div class="kpi-metric">
          <span class="kpi-metric-label">Penetration</span>
          <span class="kpi-metric-value">${year.penetration}%</span>
        </div>
        <div class="kpi-metric">
          <span class="kpi-metric-label">Subscribers</span>
          <span class="kpi-metric-value">${year.subscribers}K</span>
        </div>
        <div class="kpi-metric">
          <span class="kpi-metric-label">ARPU</span>
          <span class="kpi-metric-value">$${year.arpu}</span>
        </div>
        <div class="kpi-metric">
          <span class="kpi-metric-label">Revenue</span>
          <span class="kpi-metric-value">$${year.incremental_revenue}M</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Charts
function renderCharts(data) {
  // Destroy existing charts
  Object.values(charts).forEach(chart => chart.destroy());
  charts = {};
  
  const years = data.years.map(y => y.year);
  const color = data.color;
  
  // Revenue & EBITDA Chart
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  charts.revenue = new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Incremental Revenue ($M)',
          data: data.years.map(y => y.incremental_revenue),
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Incremental EBITDA ($M)',
          data: data.years.map(y => y.incremental_ebitda),
          borderColor: '#FFC185',
          backgroundColor: '#FFC18520',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value + 'M';
            }
          }
        }
      }
    }
  });
  
  // Cash Flow Chart
  const cashFlowCtx = document.getElementById('cashFlowChart').getContext('2d');
  charts.cashFlow = new Chart(cashFlowCtx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Net Cash Flow ($M)',
          data: data.years.map(y => y.net_cash_flow),
          backgroundColor: data.years.map(y => y.net_cash_flow >= 0 ? color + '80' : '#d8431580'),
          borderColor: data.years.map(y => y.net_cash_flow >= 0 ? color : '#d84315'),
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y + 'M';
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return '$' + value + 'M';
            }
          }
        }
      }
    }
  });
  
  // Subscriber Chart
  const subscriberCtx = document.getElementById('subscriberChart').getContext('2d');
  charts.subscriber = new Chart(subscriberCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Subscribers (000s)',
          data: data.years.map(y => y.subscribers),
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Penetration (%)',
          data: data.years.map(y => y.penetration),
          borderColor: '#5D878F',
          backgroundColor: '#5D878F20',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Subscribers (000s)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Penetration (%)'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
  
  // ROI Chart
  const roiCtx = document.getElementById('roiChart').getContext('2d');
  const paybackData = data.years.map(y => y.payback_months).filter(v => v !== null);
  const roiData = data.years.map(y => y.simple_roi !== null ? y.simple_roi * 100 : null);
  
  charts.roi = new Chart(roiCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Payback Period (months)',
          data: data.years.map(y => y.payback_months),
          borderColor: '#B4413C',
          backgroundColor: '#B4413C20',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y',
          spanGaps: true
        },
        {
          label: 'Simple ROI (%)',
          data: roiData,
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y1',
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              if (context.dataset.label.includes('Payback')) {
                return context.parsed.y ? context.dataset.label + ': ' + context.parsed.y + ' mo' : 'N/A';
              } else {
                return context.parsed.y !== null ? context.dataset.label + ': ' + context.parsed.y.toFixed(0) + '%' : 'N/A';
              }
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Payback (months)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'ROI (%)'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

// Render Returns
function renderReturns(data) {
  const grid = document.getElementById('returnsGrid');
  grid.innerHTML = '';
  
  data.years.forEach((year, index) => {
    if (year.irr !== null) {
      const card = document.createElement('div');
      card.className = 'returns-card';
      card.innerHTML = `
        <div class="returns-year">${year.year}</div>
        <div class="returns-metric">
          <span class="returns-metric-label">IRR</span>
          <span class="returns-metric-value">${year.irr}%</span>
        </div>
        <div class="returns-metric">
          <span class="returns-metric-label">Simple ROI</span>
          <span class="returns-metric-value">${year.simple_roi !== null ? year.simple_roi.toFixed(2) + 'x' : 'N/A'}</span>
        </div>
        <div class="returns-metric">
          <span class="returns-metric-label">Payback</span>
          <span class="returns-metric-value">${year.payback_months !== null ? year.payback_months + ' mo' : 'N/A'}</span>
        </div>
      `;
      grid.appendChild(card);
    }
  });
}

// Render Notes
function renderNotes(data) {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';
  
  data.years.forEach(year => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <div class="note-year">${year.year}</div>
      <div class="note-text">${year.notes}</div>
    `;
    container.appendChild(card);
  });
}

// Render Comparison
function renderComparison() {
  const table = document.getElementById('comparisonTable');
  
  const headers = ['Metric', 'Base Case', 'Upside', 'Downside'];
  const metrics = [
    { label: '2026 Penetration', key: 'penetration', year: 0, suffix: '%' },
    { label: '2030 Penetration', key: 'penetration', year: 4, suffix: '%' },
    { label: '2026 Subscribers', key: 'subscribers', year: 0, suffix: 'K' },
    { label: '2030 Subscribers', key: 'subscribers', year: 4, suffix: 'K' },
    { label: '2030 Revenue', key: 'incremental_revenue', year: 4, prefix: '$', suffix: 'M' },
    { label: '2030 EBITDA', key: 'incremental_ebitda', year: 4, prefix: '$', suffix: 'M' },
    { label: '2030 Cash Flow', key: 'net_cash_flow', year: 4, prefix: '$', suffix: 'M' },
    { label: '2030 IRR', key: 'irr', year: 4, suffix: '%' },
    { label: '2030 Simple ROI', key: 'simple_roi', year: 4, suffix: 'x' }
  ];
  
  let html = '<thead><tr>';
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  metrics.forEach(metric => {
    html += '<tr>';
    html += `<td><strong>${metric.label}</strong></td>`;
    
    ['base_case', 'upside', 'downside'].forEach(scenario => {
      const data = scenarioData[scenario].years[metric.year];
      let value = data[metric.key];
      
      if (value === null) {
        html += '<td>N/A</td>';
      } else {
        if (metric.key === 'simple_roi') {
          value = value.toFixed(2);
        }
        const scenarioClass = scenario === 'base_case' ? 'base' : scenario;
        html += `<td class="scenario-${scenarioClass}">${metric.prefix || ''}${value}${metric.suffix || ''}</td>`;
      }
    });
    
    html += '</tr>';
  });
  
  html += '</tbody>';
  table.innerHTML = html;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);