// app.js — Main orchestrator (sidebar nav, language, refrigerant switching, render all sections)
(function() {
'use strict';

// ===== GLOBAL STATE =====
var refrigerants = window.REFRIGERANTS;
var currentRef = 'r134a';
var currentLang = 'en';
// Expose getters so other modules read live values (not stale closures)
window.getCurrentRef = function() { return currentRef; };
window.getCurrentLang = function() { return currentLang; };
window.getRefrigerants = function() { return refrigerants; };

// Convert PT data from Fahrenheit to Celsius
var Calc = window.Calculators;
for (var _k in refrigerants) {
  refrigerants[_k].pt = refrigerants[_k].pt.map(function(d) { return [Math.round(Calc.fToC(d[0]) * 10) / 10, d[1]]; });
}

// Translation helper
function T(val) {
  if (val && typeof val === 'object' && val.en !== undefined) return val[currentLang] || val.en;
  return val;
}

// Info grid label translations
var infoLabels = {
  type: {en:'Type', ar:'النوع'}, safety: {en:'Safety Class', ar:'تصنيف السلامة'},
  gwp: {en:'GWP (AR4)', ar:'GWP (الاحتباس الحراري)'}, odp: {en:'ODP', ar:'ODP (نضوب الأوزون)'},
  boiling: {en:'Boiling Point', ar:'نقطة الغليان'}, critical: {en:'Critical Temp', ar:'الحرارة الحرجة'},
  oil: {en:'Compressor Oil', ar:'زيت الضاغط'}, applications: {en:'Applications', ar:'الاستخدامات'}
};

// ===== SIDEBAR NAVIGATION =====
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('[data-page]').forEach(function(el) { el.classList.add('hidden'); el.classList.remove('active'); });
  // Show target page
  var target = document.querySelector('[data-page="' + page + '"]');
  if (target) { target.classList.remove('hidden'); target.classList.add('active'); }
  // Update sidebar active state
  document.querySelectorAll('#sidebarMenu a[data-nav]').forEach(function(a) { a.classList.remove('active-item'); });
  var sidebarLink = document.querySelector('#sidebarMenu a[data-nav="' + page + '"]');
  if (sidebarLink) sidebarLink.classList.add('active-item');
  // Close mobile sidebar
  var toggle = document.getElementById('sidebar-toggle');
  if (toggle) toggle.checked = false;
  // Trigger page-specific renders
  onPageVisible(page);
  // Scroll to top
  window.scrollTo(0, 0);
}

function onPageVisible(page) {
  if (page === 'home') updateHomePressureTable();
  if (page === 'ptchart') { Charts.renderPTChart(refrigerants, currentRef); Charts.renderPTTable(refrigerants, currentRef, currentLang); }
  if (page === 'compare') Charts.renderCompareChart(refrigerants, currentLang);
  if (page === 'diagram') Diagram.renderDiagram(refrigerants, currentRef, currentLang);
}

// ===== HOME QUICK PRESSURE TABLE =====
function updateHomePressureTable() {
  var ambC = parseFloat(document.getElementById('homeAmbInput').value) || 35;
  var tbody = document.getElementById('homePressureBody');
  if (!tbody) return;
  var keys = ['r134a', 'r22', 'r410a', 'r32'];
  var html = '';
  keys.forEach(function(key) {
    var r = refrigerants[key];
    var rg = Calc.interpRanges(r.operatingRanges, ambC);
    Calc.applyLoSideCap(rg, r.name);
    var sp = Calc.interpStatic(r.staticPressure, ambC);
    var isActive = key === currentRef ? ' class="active"' : '';
    html += '<tr' + isActive + '><td class="font-semibold">' + r.name + '</td>' +
      '<td class="text-success font-semibold">' + rg.loMin + '–' + rg.loMax + '</td>' +
      '<td class="text-error font-semibold">' + rg.hiMin + '–' + rg.hiMax + '</td>' +
      '<td>' + sp.min + '–' + sp.max + '</td></tr>';
  });
  tbody.innerHTML = html;
}

// ===== RENDER FUNCTIONS =====

function renderRefInfo() {
  var r = refrigerants[currentRef];
  document.getElementById('refTitle').textContent = r.name;
  document.getElementById('infoGrid').innerHTML =
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.type) + '</div><div class="font-bold">' + r.type + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.safety) + '</div><div class="font-bold">' + r.safety + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.gwp) + '</div><div class="font-bold">' + r.gwp + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.odp) + '</div><div class="font-bold">' + r.odp + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.boiling) + '</div><div class="font-bold">' + r.boilingC + '°C</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.critical) + '</div><div class="font-bold">' + r.criticalTempC + '°C</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.oil) + '</div><div class="font-bold text-sm">' + (T(r.oil) || 'N/A') + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + T(infoLabels.applications) + '</div><div class="font-bold text-sm">' + T(r.applications) + '</div></div>';
  document.getElementById('refDescription').innerHTML = T(r.description);
  document.getElementById('instructionsContent').innerHTML = T(window.INSTRUCTIONS[currentRef]);
  document.getElementById('ptChartRef').textContent = '(' + r.name + ')';
  document.getElementById('diagRef').textContent = r.name;
  document.getElementById('targetRef').textContent = '(' + r.name + ')';
  document.getElementById('issuesRef').textContent = '(' + r.name + ')';
  Charts.renderPTTable(refrigerants, currentRef, currentLang);
  Calc.updateCalcRanges(refrigerants, currentRef);
  Calc.updatePTFromTemp(refrigerants, currentRef, currentLang, T);
  Calc.updatePTFromPressure(refrigerants, currentRef, currentLang);
  Calc.updateAmbientAdvisor(refrigerants, currentRef, currentLang, T);
  Calc.updateSuperheat(refrigerants, currentRef, currentLang);
  Calc.updateSubcooling(refrigerants, currentRef, currentLang);
  renderTargetPressures();
  renderIssues();
  renderMaintenance();
}

function renderTargetPressures() {
  var r = refrigerants[currentRef];
  var isAr = currentLang === 'ar';
  var html = '<h3 class="text-lg font-semibold mb-2">' + (isAr ? '📊 ضغوط التشغيل المتوقعة' : '📊 Expected Operating Pressures') + '</h3>';
  html += '<p class="text-sm opacity-60 mb-3">' + (isAr ? 'نطاقات تقريبية. المكيف على أقصى تبريد.' : 'Approximate ranges. AC on Max.') + '</p>';
  if (r.operatingRanges) {
    html += '<div class="overflow-x-auto"><table class="table table-sm table-zebra"><thead><tr><th>' + (isAr ? 'حرارة المحيط' : 'Ambient') + '</th><th>' + (isAr ? 'الجانب المنخفض' : 'Low Side') + '</th><th>' + (isAr ? 'الجانب العالي' : 'High Side') + '</th></tr></thead><tbody>';
    for (var i = 0; i < r.operatingRanges.length; i++) {
      var d = r.operatingRanges[i];
      html += '<tr><td>' + d[0] + '°C / ' + d[1] + '°F' + (d[0] >= 48 ? ' 🔥' : '') + '</td><td>' + d[2] + '–' + d[3] + '</td><td>' + d[4] + '–' + d[5] + '</td></tr>';
    }
    html += '</tbody></table></div>';
  }
  html += '<h3 class="text-lg font-semibold mt-6 mb-2">' + (isAr ? '🎯 أهداف طريقة الشحن' : '🎯 Charge Method Targets') + '</h3>';
  html += '<div class="grid grid-cols-2 md:grid-cols-3 gap-3">';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'السوبريتي' : 'Superheat') + '</div><div class="font-bold">' + (r.superheatTarget||'5–15°C') + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'التبريد تحت التشبع' : 'Subcooling') + '</div><div class="font-bold">' + (r.subcoolingTarget||'5–12°C') + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'زيت الضاغط' : 'Compressor Oil') + '</div><div class="font-bold text-sm">' + T(r.oil||'N/A') + '</div></div>';
  html += '</div>';
  html += '<h3 class="text-lg font-semibold mt-6 mb-2">' + (isAr ? '🔍 تفسير الضغوط' : '🔍 Pressure Interpretation') + '</h3>';
  html += '<div class="overflow-x-auto"><table class="table table-sm table-zebra"><thead><tr><th>' + (isAr ? 'منخفض' : 'Low') + '</th><th>' + (isAr ? 'عالي' : 'High') + '</th><th>' + (isAr ? 'المشكلة' : 'Problem') + '</th></tr></thead><tbody>';
  html += '<tr><td class="text-success">' + (isAr ? 'طبيعي' : 'Normal') + '</td><td class="text-success">' + (isAr ? 'طبيعي' : 'Normal') + '</td><td class="text-success">✅ ' + (isAr ? 'جيد' : 'OK') + '</td></tr>';
  html += '<tr><td class="text-warning">' + (isAr ? 'منخفض' : 'Low') + '</td><td class="text-warning">' + (isAr ? 'منخفض' : 'Low') + '</td><td>' + (isAr ? 'شحن منخفض' : 'Low charge') + '</td></tr>';
  html += '<tr><td class="text-warning">' + (isAr ? 'منخفض' : 'Low') + '</td><td class="text-error">' + (isAr ? 'عالي' : 'High') + '</td><td>' + (isAr ? 'انسداد' : 'Restriction') + '</td></tr>';
  html += '<tr><td class="text-error">' + (isAr ? 'عالي' : 'High') + '</td><td class="text-warning">' + (isAr ? 'منخفض' : 'Low') + '</td><td>' + (isAr ? 'عطل ضاغط' : 'Compressor failure') + '</td></tr>';
  html += '<tr><td class="text-error">' + (isAr ? 'عالي' : 'High') + '</td><td class="text-error">' + (isAr ? 'عالي' : 'High') + '</td><td>' + (isAr ? 'شحن زائد' : 'Overcharged') + '</td></tr>';
  html += '</tbody></table></div>';
  document.getElementById('targetContent').innerHTML = html;
}

function renderIssues() {
  var r = refrigerants[currentRef];
  var isAr = currentLang === 'ar';
  var oilDiag = window.OIL_DIAGNOSTICS;
  var html = '<h3 class="text-lg font-semibold mb-2">' + (isAr ? '🫒 تشخيص الزيت' : '🫒 Oil Diagnostics') + '</h3>';
  html += '<div class="overflow-x-auto"><table class="table table-sm table-zebra"><thead><tr><th>' + (isAr ? 'اللون' : 'Color') + '</th><th>' + (isAr ? 'الحالة' : 'Status') + '</th><th>' + (isAr ? 'المعنى' : 'Meaning') + '</th><th>' + (isAr ? 'الإجراء' : 'Action') + '</th></tr></thead><tbody>';
  for (var i = 0; i < oilDiag.colors.length; i++) {
    var c = oilDiag.colors[i];
    html += '<tr><td><span class="inline-block w-4 h-4 rounded mr-1 align-middle" style="background:' + c.bg + ';border:1px solid #444;"></span>' + T(c.color) + '</td><td>' + T(c.status) + '</td><td>' + T(c.desc) + '</td><td>' + T(c.action) + '</td></tr>';
  }
  html += '</tbody></table></div>';
  var data = window.ISSUES_DATA[currentRef];
  if (data) {
    html += '<div class="divider"></div><h3 class="text-lg font-semibold mb-2">' + (isAr ? '🔌 مشاكل الشحن' : '🔌 Charging Issues') + '</h3>';
    data.charging.forEach(function(issue) {
      html += '<div class="alert alert-warning mb-2"><div><span class="font-bold">' + T(issue.title) + '</span><br><span class="text-sm"><strong>' + (isAr ? 'الأعراض:' : 'Symptoms:') + '</strong> ' + T(issue.sym) + '<br><strong>' + (isAr ? 'السبب:' : 'Cause:') + '</strong> ' + T(issue.cause) + '<br><strong>' + (isAr ? 'الإصلاح:' : 'Fix:') + '</strong> ' + T(issue.fix) + '</span></div></div>';
    });
    html += '<h3 class="text-lg font-semibold mt-4 mb-2">' + (isAr ? '📊 مشاكل الضغط' : '📊 Pressure Issues') + '</h3>';
    data.pressure.forEach(function(issue) {
      html += '<div class="alert alert-warning mb-2"><div><span class="font-bold">' + T(issue.title) + '</span><br><span class="text-sm"><strong>' + (isAr ? 'الأعراض:' : 'Symptoms:') + '</strong> ' + T(issue.sym) + '<br><strong>' + (isAr ? 'السبب:' : 'Cause:') + '</strong> ' + T(issue.cause) + '<br><strong>' + (isAr ? 'الإصلاح:' : 'Fix:') + '</strong> ' + T(issue.fix) + '</span></div></div>';
    });
    html += '<h3 class="text-lg font-semibold mt-4 mb-2">' + (isAr ? '⚡ مشاكل كهربائية' : '⚡ Electrical Issues') + '</h3>';
    data.electrical.forEach(function(issue) {
      html += '<div class="alert alert-error mb-2"><div><span class="font-bold">' + T(issue.title) + '</span><br><span class="text-sm"><strong>' + (isAr ? 'الأعراض:' : 'Symptoms:') + '</strong> ' + T(issue.sym) + '<br><strong>' + (isAr ? 'السبب:' : 'Cause:') + '</strong> ' + T(issue.cause) + '<br><strong>' + (isAr ? 'الإصلاح:' : 'Fix:') + '</strong> ' + T(issue.fix) + '</span></div></div>';
    });
  }
  document.getElementById('issuesContent').innerHTML = html;
}

function renderMaintenance() {
  var isAr = currentLang === 'ar';
  var html = '<h3 class="text-lg font-semibold mb-2">' + (isAr ? '🧽 تنظيف الوحدة الداخلية' : '🧽 Indoor Unit (Evaporator) Cleaning') + '</h3>' +
    '<ul class="steps steps-vertical">' +
    '<li class="step step-primary">' + (isAr ? 'أوقف الكهرباء من القاطع' : 'Turn off power at the breaker') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'أزل فلتر الهواء واغسله أو استبدله' : 'Remove air filter — wash or replace') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'نظّف ملفات المبخر بخاخ بدون شطف' : 'Clean evaporator coils with no-rinse spray') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'نظّف مجرى التكثيف بالمبيّض أو الخل' : 'Clean condensate drain with bleach or vinegar') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'أعد التجميع واختبر' : 'Reassemble and test') + '</li>' +
    '</ul>' +
    '<h3 class="text-lg font-semibold mt-6 mb-2">' + (isAr ? '🏭 تنظيف الوحدة الخارجية' : '🏭 Outdoor Unit (Condenser) Cleaning') + '</h3>' +
    '<ul class="steps steps-vertical">' +
    '<li class="step step-primary">' + (isAr ? 'أوقف الكهرباء' : 'Turn off power') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'أزل الأتربة ضمن 60 سم' : 'Clear debris within 2 feet') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'نظّف ألواح المكثف بخرطوم حديقة' : 'Clean condenser fins with garden hose') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'افحص محرك المروحة' : 'Check the fan motor') + '</li>' +
    '<li class="step step-primary">' + (isAr ? 'أعد الكهرباء واختبر' : 'Restore power and test') + '</li>' +
    '</ul>';
  document.getElementById('maintenanceContent').innerHTML = html;
}

function renderCommonKnowledge() {
  var container = document.getElementById('commonKnowledgeContent');
  if (!container) return;
  var search = (document.getElementById('qaSearch').value || '').toLowerCase();
  var lang = currentLang;
  var html = '';
  var cats = {};
  window.COMMON_KNOWLEDGE.forEach(function(item) {
    var catName = item.cat[lang];
    if (!cats[catName]) cats[catName] = [];
    if (search && item.q[lang].toLowerCase().indexOf(search) === -1 && item.a[lang].toLowerCase().indexOf(search) === -1) return;
    cats[catName].push(item);
  });
  for (var catName in cats) {
    if (cats[catName].length === 0) continue;
    html += '<h3 class="text-lg font-semibold text-primary mt-4 mb-2">' + catName + '</h3>';
    cats[catName].forEach(function(item) {
      html += '<div class="collapse collapse-arrow bg-base-200 mb-2"><input type="checkbox"><div class="collapse-title font-semibold text-sm">' + item.q[lang] + '</div><div class="collapse-content text-sm">' + item.a[lang] + '</div></div>';
    });
  }
  if (!html) html = '<p class="text-center opacity-50 py-8">' + (lang === 'ar' ? 'لا توجد نتائج' : 'No results found') + '</p>';
  container.innerHTML = html;
}

// ===== LANGUAGE TOGGLE =====
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langBtn').textContent = currentLang === 'ar' ? '🌐 English' : '🌐 عربي';
  document.querySelectorAll('[data-en][data-ar]').forEach(function(el) {
    var val = el.getAttribute('data-' + currentLang);
    if (val.indexOf('<') !== -1) el.innerHTML = val;
    else el.textContent = val;
  });
  var ckTitle = document.getElementById('ckTitle');
  if (ckTitle) ckTitle.textContent = currentLang === 'ar' ? '📖 معلومات عامة — تشخيص المكيفات' : '📖 Common Knowledge — AC Diagnostics';
  var s = document.getElementById('qaSearch');
  if (s) s.placeholder = currentLang === 'ar' ? '🔍 ابحث عن سؤال...' : '🔍 Search questions...';
  renderCommonKnowledge();
  renderRefInfo();
}

// ===== EVENT LISTENERS =====
// Sidebar navigation
document.querySelectorAll('#sidebarMenu a[data-nav]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo(this.getAttribute('data-nav'));
  });
});

// Refrigerant selector
document.querySelectorAll('#refSelector button[data-ref]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#refSelector button').forEach(function(b) { b.classList.remove('btn-active'); });
    btn.classList.add('btn-active');
    currentRef = btn.dataset.ref;
    renderRefInfo();
    // Re-render visible chart/diagram pages
    var activePage = document.querySelector('[data-page]:not(.hidden)');
    if (activePage) onPageVisible(activePage.getAttribute('data-page'));
  });
});

// TXV toggle
(function() {
  var txvToggle = document.getElementById('txvToggle');
  function applyTxvState() {
    if (!txvToggle) return;
    var on = txvToggle.checked;
    var msg = document.getElementById('txvOffMsg');
    var desc = document.getElementById('scDesc');
    var content = document.getElementById('scContent');
    if (msg) msg.classList.toggle('hidden', on);
    if (desc) desc.classList.toggle('hidden', !on);
    if (content) content.classList.toggle('hidden', !on);
  }
  if (txvToggle) txvToggle.addEventListener('change', applyTxvState);
  applyTxvState();
})();

// Diagram slider
Calc.syncPair('diagAmbSlider', 'diagAmbInput', function() {
  var activePage = document.querySelector('[data-page]:not(.hidden)');
  if (activePage && activePage.getAttribute('data-page') === 'diagram') {
    Diagram.renderDiagram(refrigerants, currentRef, currentLang);
  }
});

// Window resize — re-render charts
window.addEventListener('resize', function() {
  var activePage = document.querySelector('[data-page]:not(.hidden)');
  if (!activePage) return;
  var page = activePage.getAttribute('data-page');
  if (page === 'ptchart') Charts.renderPTChart(refrigerants, currentRef);
  if (page === 'compare') Charts.renderCompareChart(refrigerants, currentLang);
});

// Expose functions for HTML onclick
window.toggleLang = toggleLang;
window.navigateTo = navigateTo;
window.calcSystem = function() { Calc.calcSystem(refrigerants, currentRef, currentLang); };
window.calcDevice = function() { Calc.calcDevice(refrigerants, currentRef, currentLang, window.DEVICE_DATA); };
window.diagZoom = Diagram.diagZoom;
window.diagReset = Diagram.diagReset;
window.filterQA = renderCommonKnowledge;

// Home page ambient slider
Calc.syncPair('homeAmbSlider', 'homeAmbInput', updateHomePressureTable);

// Update home table when refrigerant changes
var origRenderRefInfo = renderRefInfo;
renderRefInfo = function() { origRenderRefInfo(); updateHomePressureTable(); };

// ===== INITIALIZE =====
renderRefInfo();
Calc.initCalculators(refrigerants, currentRef, currentLang, T);
renderCommonKnowledge();
VehicleLookup.init();

})();