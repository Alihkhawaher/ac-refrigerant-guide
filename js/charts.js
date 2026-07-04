// charts.js — Chart.js based charts (PT Chart + Compare Charts)
(function() {
'use strict';

var ptChartInstance = null;
var compareLoChartInstance = null;
var compareHiChartInstance = null;

function renderPTChart(refrigerants, currentRef) {
  var r = refrigerants[currentRef];
  var canvas = document.getElementById('ptCanvas');
  if (!canvas) return;

  if (ptChartInstance) ptChartInstance.destroy();

  var labels = r.pt.map(function(d) { return d[0].toFixed(0); });
  var data = r.pt.map(function(d) { return d[1]; });

  ptChartInstance = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: r.name,
        data: data,
        borderColor: '#00b4d8',
        backgroundColor: 'rgba(0,180,216,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#00b4d8',
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e0e8f0', font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: function(ctx) { return ctx.parsed.y.toFixed(1) + ' PSIG at ' + ctx.parsed.x + '°C'; }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Temperature (°C)', color: '#8899aa' },
          ticks: { color: '#8899aa', maxTicksLimit: 15 },
          grid: { color: 'rgba(42,58,74,0.5)' }
        },
        y: {
          title: { display: true, text: 'Pressure (PSIG)', color: '#8899aa' },
          ticks: { color: '#8899aa' },
          grid: { color: 'rgba(42,58,74,0.5)' }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

function renderCompareChart(refrigerants, currentLang) {
  renderCompareSide(refrigerants, currentLang, 'compareLoCanvas', 'low');
  renderCompareSide(refrigerants, currentLang, 'compareHiCanvas', 'high');
}

function renderCompareSide(refrigerants, currentLang, canvasId, side) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;

  var existing = side === 'low' ? compareLoChartInstance : compareHiChartInstance;
  if (existing) existing.destroy();

  var Calc = window.Calculators;
  var colors = ['#00b4d8','#f4a261','#2a9d8f','#e63946'];
  var keys = ['r134a','r22','r410a','r32'];
  var labels = ['R-134a','R-22','R-410A','R-32'];
  var isAr = currentLang === 'ar';

  var datasets = keys.map(function(key, idx) {
    var r = refrigerants[key];
    var pts = r.operatingRanges.map(function(d) {
      var rg = {loMin: d[2], loMax: d[3], hiMin: d[4], hiMax: d[5]};
      Calc.applyLoSideCap(rg, r.name);
      var val = side === 'low' ? (rg.loMin + rg.loMax) / 2 : (rg.hiMin + rg.hiMax) / 2;
      return val;
    });
    return {
      label: labels[idx],
      data: pts,
      borderColor: colors[idx],
      backgroundColor: colors[idx] + '20',
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: colors[idx],
      borderWidth: 2.5
    };
  });

  var ambientLabels = refrigerants[keys[0]].operatingRanges.map(function(d) { return d[0] + '°C'; });
  var yLabel = side === 'low'
    ? (isAr ? 'ضغط الشفط (PSIG)' : 'Suction Pressure (PSIG)')
    : (isAr ? 'ضغط التفريغ (PSIG)' : 'Discharge Pressure (PSIG)');

  var instance = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: ambientLabels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e0e8f0', font: { size: 11 } } }
      },
      scales: {
        x: {
          title: { display: true, text: isAr ? 'حرارة الخارج (°C)' : 'Outdoor Temp (°C)', color: '#8899aa' },
          ticks: { color: '#8899aa' },
          grid: { color: 'rgba(42,58,74,0.5)' }
        },
        y: {
          title: { display: true, text: yLabel, color: '#8899aa' },
          ticks: { color: '#8899aa' },
          grid: { color: 'rgba(42,58,74,0.5)' }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });

  if (side === 'low') compareLoChartInstance = instance;
  else compareHiChartInstance = instance;
}

function renderPTTable(refrigerants, currentRef, currentLang) {
  var r = refrigerants[currentRef];
  var tbody = document.querySelector('#ptTable tbody');
  if (!tbody) return;
  var isAr = currentLang === 'ar';
  var html = '';
  for (var i = 0; i < r.pt.length; i++) {
    var tempC = r.pt[i][0], psig = r.pt[i][1];
    var phaseText;
    if (psig < 0) phaseText = isAr ? 'فراغ' : 'Vacuum';
    else if (psig < 15) phaseText = isAr ? 'منخفض' : 'Low';
    else if (psig < 100) phaseText = isAr ? 'متوسط' : 'Medium';
    else phaseText = isAr ? 'عالي' : 'High';
    html += '<tr' + (psig < 0 ? ' class="opacity-50"' : '') + '><td>' + tempC + '°C</td><td>' + psig.toFixed(1) + ' PSIG</td><td>' + phaseText + '</td></tr>';
  }
  tbody.innerHTML = html;
}

window.Charts = {
  renderPTChart: renderPTChart,
  renderPTTable: renderPTTable,
  renderCompareChart: renderCompareChart
};

})();