// Core application logic
(function() {
'use strict';

// Global state
var refrigerants = window.REFRIGERANTS;
var currentRef = 'r134a';
var currentLang = 'en';

// Convert PT data from Fahrenheit to Celsius
function fToC(f) { return (f - 32) * 5 / 9; }
for (var _k in refrigerants) {
  refrigerants[_k].pt = refrigerants[_k].pt.map(function(d) { return [Math.round(fToC(d[0]) * 10) / 10, d[1]]; });
}

// Translation helper
function T(val) {
  if (val && typeof val === 'object' && val.en !== undefined) return val[currentLang] || val.en;
  return val;
}

// Interpolation
function interpolate(ptData, tempC) {
  if (tempC <= ptData[0][0]) return ptData[0][1];
  if (tempC >= ptData[ptData.length-1][0]) return ptData[ptData.length-1][1];
  for (var i = 0; i < ptData.length - 1; i++) {
    if (tempC >= ptData[i][0] && tempC <= ptData[i+1][0]) {
      var t0 = ptData[i][0], t1 = ptData[i+1][0], p0 = ptData[i][1], p1 = ptData[i+1][1];
      return p0 + (tempC - t0) / (t1 - t0) * (p1 - p0);
    }
  }
  return 0;
}

function interpolateReverse(ptData, psig) {
  if (psig <= ptData[0][1]) return ptData[0][0];
  if (psig >= ptData[ptData.length-1][1]) return ptData[ptData.length-1][0];
  for (var i = 0; i < ptData.length - 1; i++) {
    if (psig >= ptData[i][1] && psig <= ptData[i+1][1]) {
      var p0 = ptData[i][1], p1 = ptData[i+1][1], t0 = ptData[i][0], t1 = ptData[i+1][0];
      return t0 + (psig - p0) / (p1 - p0) * (t1 - t0);
    }
  }
  return 0;
}

// Low-side pressure caps based on real-world HVAC operating data
// Above these = overcharged or system problem
var LOW_SIDE_CAPS = {'R-22':75, 'R-410A':125, 'R-32':130, 'R-134a':40};

function applyLoSideCap(rg, refName) {
  var loCap = LOW_SIDE_CAPS[refName] || 100;
  if (rg.loMin > loCap) rg.loMin = Math.round(loCap * 0.87);
  if (rg.loMax > loCap) rg.loMax = loCap;
  return rg;
}

// Interpolate operating ranges
function interpRanges(ranges, ambC) {
  var loMin, loMax, hiMin, hiMax;
  if (ambC <= ranges[0][0]) { loMin = ranges[0][2]; loMax = ranges[0][3]; hiMin = ranges[0][4]; hiMax = ranges[0][5]; }
  else if (ambC >= ranges[ranges.length-1][0]) { loMin = ranges[ranges.length-1][2]; loMax = ranges[ranges.length-1][3]; hiMin = ranges[ranges.length-1][4]; hiMax = ranges[ranges.length-1][5]; }
  else {
    for (var i = 0; i < ranges.length - 1; i++) {
      if (ambC >= ranges[i][0] && ambC <= ranges[i+1][0]) {
        var t0 = ranges[i][0], t1 = ranges[i+1][0], ratio = (ambC - t0) / (t1 - t0);
        loMin = Math.round(ranges[i][2] + ratio * (ranges[i+1][2] - ranges[i][2]));
        loMax = Math.round(ranges[i][3] + ratio * (ranges[i+1][3] - ranges[i][3]));
        hiMin = Math.round(ranges[i][4] + ratio * (ranges[i+1][4] - ranges[i][4]));
        hiMax = Math.round(ranges[i][5] + ratio * (ranges[i+1][5] - ranges[i][5]));
        break;
      }
    }
  }
  return {loMin:loMin, loMax:loMax, hiMin:hiMin, hiMax:hiMax};
}

function interpStatic(sp, ambC) {
  var staticMin, staticMax;
  if (ambC <= sp[0][0]) { staticMin = sp[0][2]; staticMax = sp[0][3]; }
  else if (ambC >= sp[sp.length-1][0]) { staticMin = sp[sp.length-1][2]; staticMax = sp[sp.length-1][3]; }
  else {
    for (var i = 0; i < sp.length - 1; i++) {
      if (ambC >= sp[i][0] && ambC <= sp[i+1][0]) {
        var t0 = sp[i][0], t1 = sp[i+1][0], ratio = (ambC - t0) / (t1 - t0);
        staticMin = Math.round(sp[i][2] + ratio * (sp[i+1][2] - sp[i][2]));
        staticMax = Math.round(sp[i][3] + ratio * (sp[i+1][3] - sp[i][3]));
        break;
      }
    }
  }
  return {min:staticMin, max:staticMax};
}

// Info grid label translations
var infoLabels = {
  type: {en:'Type', ar:'النوع'}, safety: {en:'Safety Class', ar:'تصنيف السلامة'},
  gwp: {en:'GWP (AR4)', ar:'GWP (الاحتباس الحراري)'}, odp: {en:'ODP', ar:'ODP (نضوب الأوزون)'},
  boiling: {en:'Boiling Point', ar:'نقطة الغليان'}, critical: {en:'Critical Temp', ar:'الحرارة الحرجة'},
  oil: {en:'Compressor Oil', ar:'زيت الضاغط'}, applications: {en:'Applications', ar:'الاستخدامات'}
};

// Render refrigerant info
function renderRefInfo() {
  var r = refrigerants[currentRef];
  document.getElementById('refTitle').textContent = r.name;
  document.getElementById('infoGrid').innerHTML =
    '<div class="info-item"><div class="label">' + T(infoLabels.type) + '</div><div class="value">' + r.type + '</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.safety) + '</div><div class="value">' + r.safety + '</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.gwp) + '</div><div class="value">' + r.gwp + '</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.odp) + '</div><div class="value">' + r.odp + '</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.boiling) + '</div><div class="value">' + r.boilingC + '°C</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.critical) + '</div><div class="value">' + r.criticalTempC + '°C</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.oil) + '</div><div class="value" style="font-size:0.85em;">' + (T(r.oil) || 'N/A') + '</div></div>' +
    '<div class="info-item"><div class="label">' + T(infoLabels.applications) + '</div><div class="value" style="font-size:0.85em;">' + T(r.applications) + '</div></div>';
  document.getElementById('refDescription').innerHTML = T(r.description);
  document.getElementById('instructionsContent').innerHTML = T(window.INSTRUCTIONS[currentRef]);
  document.getElementById('ptChartRef').textContent = '(' + r.name + ')';
  document.getElementById('diagRef').textContent = r.name;
  renderPTTable(); renderPTChart(); renderDiagram(); renderTargetPressures();
  updateCalcRanges();
  updatePTFromTemp(); updatePTFromPressure(); updateAmbientAdvisor(); updateSuperheat(); updateSubcooling();
  renderIssues(); renderMaintenance();
  document.querySelectorAll('.calc-ref-name2').forEach(function(el) { el.textContent = refrigerants[currentRef].name; });
}

// PT Table
function renderPTTable() {
  var r = refrigerants[currentRef];
  var tbody = document.querySelector('#ptTable tbody');
  var html = '';
  for (var idx = 0; idx < r.pt.length; idx++) {
    var tempC = r.pt[idx][0], psig = r.pt[idx][1];
    var phaseText;
    if (psig < 0) phaseText = currentLang === 'ar' ? 'فراغ' : 'Vacuum';
    else if (psig < 15) phaseText = currentLang === 'ar' ? 'منخفض' : 'Low';
    else if (psig < 100) phaseText = currentLang === 'ar' ? 'متوسط' : 'Medium';
    else phaseText = currentLang === 'ar' ? 'عالي' : 'High';
    var cls = psig < 0 ? ' class="vacuum"' : '';
    html += '<tr' + cls + '><td>' + tempC + '°C</td><td>' + psig.toFixed(1) + ' PSIG</td><td>' + phaseText + '</td></tr>';
  }
  tbody.innerHTML = html;
}

// PT Chart (canvas)
function renderPTChart() {
  var canvas = document.getElementById('ptCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var r = refrigerants[currentRef];
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  var W = rect.width, H = rect.height;
  var padL = 60, padR = 20, padT = 20, padB = 40;
  var plotW = W - padL - padR, plotH = H - padT - padB;
  var temps = r.pt.map(function(d){return d[0]}), pressures = r.pt.map(function(d){return d[1]});
  var tMin = Math.min.apply(null,temps), tMax = Math.max.apply(null,temps);
  var pMin = Math.min(0, Math.min.apply(null,pressures)), pMax = Math.max.apply(null,pressures) * 1.05;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#2a3a4a'; ctx.lineWidth = 1;
  ctx.font = '11px Segoe UI'; ctx.fillStyle = '#8899aa';
  for (var i = 0; i <= 6; i++) {
    var pVal = pMin + (pMax - pMin) * i / 6;
    var y = padT + plotH - (pVal - pMin) / (pMax - pMin) * plotH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText(Math.round(pVal) + '', padL - 8, y + 4);
  }
  for (var i = 0; i <= 8; i++) {
    var tVal = tMin + (tMax - tMin) * i / 8;
    var x = padL + (tVal - tMin) / (tMax - tMin) * plotW;
    ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, H - padB); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillText(Math.round(tVal) + '°C', x, H - padB + 18);
  }
  ctx.fillStyle = '#e0e8f0'; ctx.font = 'bold 12px Segoe UI';
  ctx.save(); ctx.translate(15, H/2); ctx.rotate(-Math.PI/2);
  ctx.textAlign = 'center'; ctx.fillText(currentLang === 'ar' ? 'الضغط (PSIG)' : 'Pressure (PSIG)', 0, 0); ctx.restore();
  ctx.textAlign = 'center'; ctx.fillText(currentLang === 'ar' ? 'الحرارة (°C)' : 'Temperature (°C)', W/2, H - 5);
  ctx.strokeStyle = '#00b4d8'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (var i = 0; i < r.pt.length; i++) {
    var t = r.pt[i][0], p = r.pt[i][1];
    var x = padL + (t - tMin) / (tMax - tMin) * plotW;
    var y = padT + plotH - (p - pMin) / (pMax - pMin) * plotH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.lineTo(padL + plotW, padT + plotH); ctx.lineTo(padL, padT + plotH);
  ctx.closePath(); ctx.fillStyle = 'rgba(0,180,216,0.08)'; ctx.fill();
  ctx.fillStyle = '#0077b6';
  for (var i = 0; i < r.pt.length; i++) {
    var t = r.pt[i][0], p = r.pt[i][1];
    var x = padL + (t - tMin) / (tMax - tMin) * plotW;
    var y = padT + plotH - (p - pMin) / (pMax - pMin) * plotH;
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#00b4d8'; ctx.font = 'bold 13px Segoe UI';
  ctx.textAlign = 'left'; ctx.fillText(r.name + (currentLang === 'ar' ? ' منحنى الضغط-الحرارة' : ' Pressure-Temperature Curve'), padL, padT - 5);
}

// Slider sync helper
function syncPair(sliderId, numId, callback) {
  var slider = document.getElementById(sliderId);
  var num = document.getElementById(numId);
  if (!slider || !num) return;
  slider.addEventListener('input', function() { num.value = this.value; callback(); });
  num.addEventListener('input', function() {
    var v = parseFloat(this.value);
    if (isNaN(v)) return;
    v = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), v));
    slider.value = v; callback();
  });
}

// PT from Temperature
function updatePTFromTemp() {
  var r = refrigerants[currentRef];
  var tempC = parseFloat(document.getElementById('ptTempInput').value);
  if (isNaN(tempC)) return;
  var psig = interpolate(r.pt, tempC);
  document.getElementById('ptRPressure').textContent = psig.toFixed(1);
  var info = document.getElementById('ptPressureInfo');
  var title = currentLang === 'ar' ? '🌡️ ماذا يعني هذا' : '🌡️ What This Means';
  var expectedVent = currentLang === 'ar' ? '• <strong>هواء الفتحة المتوقع:</strong>' : '• <strong>Expected vent air:</strong>';
  var belowFreezing = currentLang === 'ar' ? '• ❄️ تحت التجمد — المبخر سيتجمد' : '• ❄️ Below freezing — evaporator will frost';
  var ideal = currentLang === 'ar' ? '• ✅ نطاق المبخر المثالي' : '• ✅ Ideal evaporator range';
  var warmer = currentLang === 'ar' ? '• ⚠️ أدفأ من المثالي' : '• ⚠️ Warmer than ideal';
  var tooWarm = currentLang === 'ar' ? '• 🔴 أدفأ من اللازم' : '• 🔴 Too warm';
  info.innerHTML = '<div class="action-box info"><div class="atitle">' + title + '</div>' +
    r.name + (currentLang === 'ar' ? ' يغلي عند <strong>' : ' boils at <strong>') + tempC.toFixed(1) + '°C</strong>' + (currentLang === 'ar' ? ' عندما يكون الضغط ' : ' when the pressure is ') + psig.toFixed(1) + ' PSIG.<br>' +
    expectedVent + ' ' + (tempC+2).toFixed(0) + '–' + (tempC+7).toFixed(0) + '°C<br>' +
    (tempC < 0 ? belowFreezing : tempC <= 7 ? ideal : tempC <= 15 ? warmer : tooWarm) + '</div>';
}

// PT from Pressure
function updatePTFromPressure() {
  var r = refrigerants[currentRef];
  var psig = parseFloat(document.getElementById('ptPressInput').value);
  if (isNaN(psig)) return;
  var tempC = interpolateReverse(r.pt, psig);
  document.getElementById('ptRTemp2').textContent = tempC.toFixed(1);
  var info = document.getElementById('ptTempInfo');
  var title = currentLang === 'ar' ? '🌡️ ماذا يعني هذا' : '🌡️ What This Means';
  var condOrBoil = psig > 100 ? (currentLang === 'ar' ? 'يتكاثف' : 'condenses') : (currentLang === 'ar' ? 'يغلي' : 'boils');
  info.innerHTML = '<div class="action-box info"><div class="atitle">' + title + '</div>' +
    (currentLang === 'ar' ? 'عند <strong>' : 'At <strong>') + psig + ' PSIG</strong>, ' + r.name + ' ' + condOrBoil + (currentLang === 'ar' ? ' عند <strong>' : ' at <strong>') + tempC.toFixed(1) + '°C</strong>.</div>';
}

// Superheat calculator
function updateSuperheat() {
  var r = refrigerants[currentRef];
  var pressure = parseFloat(document.getElementById('shPressure').value);
  var actualTemp = parseFloat(document.getElementById('shActualTemp').value);
  if (isNaN(pressure) || isNaN(actualTemp)) return;
  var satTemp = interpolateReverse(r.pt, pressure);
  var sh = actualTemp - satTemp;
  document.getElementById('shValue').textContent = sh.toFixed(1);
  document.getElementById('shSatTemp').textContent = satTemp.toFixed(1);
  document.getElementById('shActTemp').textContent = actualTemp.toFixed(1);
  var diag = document.getElementById('shDiag');
  diag.className = 'diag';
  if (sh < 0) { diag.classList.add('danger'); diag.innerHTML = currentLang === 'ar' ? '⚠️ <strong>خطر — سوبريتي سالب</strong> — شحن زائد، سائل يصل للضاغط.' : '⚠️ <strong>DANGER — Negative Superheat</strong> — Overcharged, liquid reaching compressor.'; }
  else if (sh < 4) { diag.classList.add('warn'); diag.innerHTML = currentLang === 'ar' ? '⚠️ <strong>سوبريتي منخفض</strong> — قريب من המלא، خطر الفيضان.' : '⚠️ <strong>Low Superheat</strong> — Near full, risk of flooding.'; }
  else if (sh <= 15) { diag.classList.add('ok'); diag.innerHTML = currentLang === 'ar' ? '✅ <strong>سوبريتي طبيعي</strong> — النظام يعمل بشكل جيد.' : '✅ <strong>Normal Superheat</strong> — System operating well.'; }
  else if (sh <= 25) { diag.classList.add('warn'); diag.innerHTML = currentLang === 'ar' ? '⚠️ <strong>سوبريتي مرتفع</strong> — شحن ناقص، تبريد ضعيف.' : '⚠️ <strong>High Superheat</strong> — Undercharged, weak cooling.'; }
  else { diag.classList.add('danger'); diag.innerHTML = currentLang === 'ar' ? '🔴 <strong>سوبريتي مرتفع جداً</strong> — شحن ناقص بشكل حاد.' : '🔴 <strong>Very High Superheat</strong> — Severely undercharged.'; }
}

// Subcooling calculator
function updateSubcooling() {
  var r = refrigerants[currentRef];
  var pressure = parseFloat(document.getElementById('scPressure').value);
  var actualTemp = parseFloat(document.getElementById('scActualTemp').value);
  if (isNaN(pressure) || isNaN(actualTemp)) return;
  var satTemp = interpolateReverse(r.pt, pressure);
  var sc = satTemp - actualTemp;
  document.getElementById('scValue').textContent = sc.toFixed(1);
  document.getElementById('scSatTemp').textContent = satTemp.toFixed(1);
  document.getElementById('scActTemp').textContent = actualTemp.toFixed(1);
  var diag = document.getElementById('scDiag');
  diag.className = 'diag';
  if (sc < 0) { diag.classList.add('danger'); diag.innerHTML = currentLang === 'ar' ? '⚠️ <strong>خطر — تبريد تحت تشبع سالب</strong> — شحن ناقص، غاز مبرّد في خط السائل.' : '⚠️ <strong>DANGER — Negative Subcooling</strong> — Undercharged, flash gas in liquid line.'; }
  else if (sc < 3) { diag.classList.add('warn'); diag.innerHTML = currentLang === 'ar' ? '⚠️ <strong>تبريد تحت تشبع منخفض</strong> — سائل غير كافٍ، شحن ناقص.' : '⚠️ <strong>Low Subcooling</strong> — Not enough liquid, undercharged.'; }
  else if (sc <= 12) { diag.classList.add('ok'); diag.innerHTML = currentLang === 'ar' ? '✅ <strong>تبريد تحت تشبع طبيعي</strong> — شحن صحيح.' : '✅ <strong>Normal Subcooling</strong> — Properly charged.'; }
  else if (sc <= 20) { diag.classList.add('warn'); diag.innerHTML = currentLang === 'ar' ? '⚠️ <strong>تبريد تحت تشبع مرتفع</strong> — شحن زائد أو انسداد.' : '⚠️ <strong>High Subcooling</strong> — Overcharged or restricted.'; }
  else { diag.classList.add('danger'); diag.innerHTML = currentLang === 'ar' ? '🔴 <strong>تبريد تحت تشبع مرتفع جداً</strong> — شحن زائد بشكل كبير.' : '🔴 <strong>Very High Subcooling</strong> — Significantly overcharged.'; }
}

// Ambient advisor
function updateAmbientAdvisor() {
  var r = refrigerants[currentRef];
  var ambC = parseFloat(document.getElementById('ambTempInput').value);
  if (isNaN(ambC)) return;
  var rg = interpRanges(r.operatingRanges, ambC);
  var sp = interpStatic(r.staticPressure, ambC);
  // Cap low-side to reflect real HVAC behavior: suction pressure is determined by
  // indoor coil temperature (thermostat-controlled), NOT outdoor ambient.
  // Real-world max suction (at 5-7°C coil): R-22: 75, R-410A: 125, R-32: 130, R-134a: 40
  // Above these = overcharged or system problem.
  applyLoSideCap(rg, r.name);
  var loMid = (rg.loMin + rg.loMax) / 2, satTemp = interpolateReverse(r.pt, loMid);
  var hiMid = (rg.hiMin + rg.hiMax) / 2, condSatTemp = interpolateReverse(r.pt, hiMid);
  var heatLevel, heatColor, heatIcon;
  if (ambC < 24) { heatLevel = currentLang === 'ar' ? 'بارد' : 'Cool'; heatColor = 'var(--ok)'; heatIcon = '❄️'; }
  else if (ambC < 32) { heatLevel = currentLang === 'ar' ? 'معتدل' : 'Mild'; heatColor = 'var(--ok)'; heatIcon = '🌤️'; }
  else if (ambC < 40) { heatLevel = currentLang === 'ar' ? 'دافئ' : 'Warm'; heatColor = 'var(--warn)'; heatIcon = '☀️'; }
  else if (ambC < 48) { heatLevel = currentLang === 'ar' ? 'حار' : 'Hot'; heatColor = 'var(--warn)'; heatIcon = '🔥'; }
  else { heatLevel = currentLang === 'ar' ? 'شديد (T3)' : 'Extreme (T3)'; heatColor = 'var(--danger)'; heatIcon = '🌡️'; }
  var ambF = (ambC * 9/5 + 32).toFixed(0);
  var isAr = currentLang === 'ar';
  document.getElementById('ambInfoGrid').innerHTML =
    '<div class="info-item" style="border-left-color:' + heatColor + '"><div class="label">' + (isAr?'المحيط':'Ambient') + '</div><div class="value">' + heatIcon + ' ' + ambC + '°C / ' + ambF + '°F</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr?'مستوى الحرارة':'Heat Level') + '</div><div class="value" style="color:' + heatColor + '">' + heatLevel + '</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr?'هواء الفتحة المتوقع':'Expected Vent Air') + '</div><div class="value">' + (satTemp+2).toFixed(0) + '–' + (satTemp+7).toFixed(0) + '°C</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr?'خط الشفط المتوقع':'Expected Suction Line') + '</div><div class="value">' + (satTemp+5).toFixed(0) + '–' + (satTemp+12).toFixed(0) + '°C</div></div>';
  var pressHtml = '<h3 style="margin-top:15px;">' + (isAr?'📊 الضغوط الموصى بها عند ' + ambC + '°C':'📊 Recommended Pressures at ' + ambC + '°C') + '</h3><div class="info-grid">';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'المنخفض (الشفط)':'Low Side (Suction)') + '</div><div class="value">' + rg.loMin + '–' + rg.loMax + ' PSIG</div></div>';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'العالي (التفريغ)':'High Side (Discharge)') + '</div><div class="value">' + rg.hiMin + '–' + rg.hiMax + ' PSIG</div></div>';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'ثابت (النظام مغلق)':'Static (System Off)') + '</div><div class="value">' + sp.min + '–' + sp.max + ' PSIG</div></div>';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'ملف المبخر':'Evaporator Coil') + '</div><div class="value">~' + satTemp.toFixed(0) + '°C</div></div>';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'حرارة تشبع المكثف':'Condenser Sat Temp') + '</div><div class="value">~' + condSatTemp.toFixed(0) + '°C</div></div>';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'هدف السوبريتي':'Superheat Target') + '</div><div class="value">' + (r.superheatTarget || '3–8°C') + '</div></div>';
  pressHtml += '<div class="info-item"><div class="label">' + (isAr?'هدف التبريد تحت التشبع':'Subcooling Target') + '</div><div class="value">' + (r.subcoolingTarget || '3–7°C') + '</div></div>';
  pressHtml += '</div>';
  document.getElementById('ambPressures').innerHTML = pressHtml;
  // Tips
  var tips = '<div class="action-box info" style="margin-top:15px;"><div class="atitle">' + (isAr ? '🔧 توصيات لـ ' + ambC + '°C محيط' : '🔧 Recommendations for ' + ambC + '°C Ambient') + '</div>';
  if (r.name === 'R-134a') {
    tips += isAr ? '<strong>🚗 ملاحظة نظام السيارة:</strong> ضغط الشفط في السيارات يُنظّم بواسطة صمام التمديد (TXV) أو أنبوب الفتحة الثابتة، لذا يبقى نسبياً ثابتاً (25-55 PSIG) بغض النظر عن حرارة المحيط. الجانب العالي هو الذي يتغير بشكل كبير مع الحرارة.<br><br>' : '<strong>🚗 Automotive Note:</strong> In cars, the suction pressure is regulated by the TXV or orifice tube, so it stays relatively stable (25-55 PSIG) regardless of ambient temp. The high side is what changes significantly with heat.<br><br>';
  }
  if (ambC < 24) {
    tips += isAr ? '<strong>نصائح الطقس البارد:</strong><br>• الضغوط في نهاية النطاق السفلى — طبيعي<br>• المبخر قد يتجمد إذا كان تدفق الهواء منخفضاً<br>• أفضل وقت للتشخيص الدقيق والشحن' : '<strong>Cool Weather Tips:</strong><br>• Pressures at lower end of range — normal<br>• Evaporator may frost if airflow is low<br>• Best time for accurate diagnostics and charging';
  } else if (ambC < 32) {
    tips += isAr ? '<strong>نصائح الطقس المعتدل:</strong><br>• ظروف اختبار مثالية — الضغوط في منتصف النطاق<br>• أفضل وقت لفحص الشحن<br>• هواء الفتحة يجب أن يكون بارداً بشكل ملحوظ' : '<strong>Mild Weather Tips:</strong><br>• Ideal testing conditions — pressures in mid-range<br>• Best time to check charge<br>• Vent air should be noticeably cold';
  } else if (ambC < 40) {
    tips += isAr ? '<strong>نصائح الطقس الدافئ:</strong><br>• الضغوط في النطاق العلوي المتوسط<br>• تأكد من تدفق هواء المكثف<br>• افحص مروحة المكثف ونظّف ألواح المكثف' : '<strong>Warm Weather Tips:</strong><br>• Pressures in upper-mid range<br>• Ensure condenser airflow is good<br>• Check condenser fan and clean condenser fins';
  } else if (ambC < 48) {
    tips += isAr ? '<strong>نصائح الطقس الحار:</strong><br>• الضغوط قريبة من النطاق العالي<br>• لا تشحن تحت أشعة الشمس المباشرة' : '<strong>Hot Weather Tips:</strong><br>• Pressures near high end — expected<br>• Do not charge in direct sunlight';
  } else {
    tips += isAr ? '<strong>🔥 حرارة شيدة (مناخ T3):</strong><br>• الضغوط العالية طبيعية في هذا المحيط<br>• لا تضف مبرد ظناً أن الضغط العالي = شحن زائد<br>• اركض في الظل عند الإمكان' : '<strong>🔥 Extreme Heat (T3 Climate):</strong><br>• High pressures are NORMAL at this ambient<br>• Do NOT add refrigerant thinking high pressure = overcharge<br>• Park in shade when possible';
  }
  tips += '</div>';
  if (ambC >= 50) {
    tips += '<div class="warn-box" style="margin-top:10px;"><div class="title">' + (isAr ? '🌡️ مناخ T3' : '🌡️ T3 Climate') + '</div>';
    tips += '<p style="font-size:0.88em;">' + (isAr ? 'تأكد أن مانوميتراتك وخراطيمك مُصنّفة لهذه الضغوط.' : 'Ensure your gauges and hoses are rated for these pressures.') + '</p></div>';
  }
  document.getElementById('ambTips').innerHTML = tips;
}

// Update calc ranges when switching refrigerants
function updateCalcRanges() {
  var r = refrigerants[currentRef];
  var tMin = r.pt[0][0], tMax = r.pt[r.pt.length-1][0];
  var pMin = Math.min(0, Math.floor(r.pt[0][1])), pMax = Math.ceil(r.pt[r.pt.length-1][1]);
  function setRange(sId, nId, min, max) {
    var s = document.getElementById(sId), n = document.getElementById(nId);
    if (s) { s.min = min; s.max = max; }
    if (n) { n.min = min; n.max = max; }
  }
  setRange('ptSliderTemp', 'ptTempInput', tMin, tMax);
  setRange('ptSliderPress', 'ptPressInput', pMin, pMax);
  setRange('shSliderPressure', 'shPressure', 5, Math.min(300, pMax));
  setRange('scSliderPressure', 'scPressure', 50, Math.min(600, pMax));
  document.querySelectorAll('.calc-ref-name').forEach(function(el) { el.textContent = r.name; });
}

// Initialize calculators
function initCalculators() {
  syncPair('ptSliderTemp', 'ptTempInput', updatePTFromTemp);
  syncPair('ptSliderPress', 'ptPressInput', updatePTFromPressure);
  syncPair('ambSliderTemp', 'ambTempInput', updateAmbientAdvisor);
  syncPair('shSliderPressure', 'shPressure', updateSuperheat);
  syncPair('shSliderTemp', 'shActualTemp', updateSuperheat);
  syncPair('scSliderPressure', 'scPressure', updateSubcooling);
  syncPair('scSliderTemp', 'scActualTemp', updateSubcooling);
}

// Target pressures
function renderTargetPressures() {
  var r = refrigerants[currentRef];
  var isAr = currentLang === 'ar';
  document.getElementById('targetRef').textContent = '(' + r.name + ')';
  var html = '<h3>' + (isAr ? '📊 ضغوط التشغيل المتوقعة' : '📊 Expected Operating Pressures') + '</h3>';
  html += '<p style="color:var(--text-dim);font-size:0.85em;margin-bottom:10px;">' + (isAr ? 'نطاقات تقريبية. المكيف على أقصى تبريد.' : 'Approximate ranges. AC on Max.') + '</p>';
  if (r.operatingRanges) {
    html += '<div class="pt-table-wrap"><table class="pt-table"><thead><tr><th>' + (isAr ? 'حرارة المحيط' : 'Ambient') + '</th><th>' + (isAr ? 'الجانب المنخفض' : 'Low Side') + '</th><th>' + (isAr ? 'الجانب العالي' : 'High Side') + '</th></tr></thead><tbody>';
    for (var i = 0; i < r.operatingRanges.length; i++) {
      var d = r.operatingRanges[i];
      var t3mark = d[0] >= 48 ? ' 🔥' : '';
      html += '<tr><td>' + d[0] + '°C / ' + d[1] + '°F' + t3mark + '</td><td>' + d[2] + '–' + d[3] + '</td><td>' + d[4] + '–' + d[5] + '</td></tr>';
    }
    html += '</tbody></table></div>';
  }
  html += '<h3 style="margin-top:25px;">' + (isAr ? '🎯 أهداف طريقة الشحن' : '🎯 Charge Method Targets') + '</h3><div class="info-grid">';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'السوبريتي' : 'Superheat') + '</div><div class="value">' + (r.superheatTarget||'5–15°C') + '</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'التبريد تحت التشبع' : 'Subcooling') + '</div><div class="value">' + (r.subcoolingTarget||'5–12°C') + '</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'زيت الضاغط' : 'Compressor Oil') + '</div><div class="value" style="font-size:0.85em;">' + T(r.oil||'N/A') + '</div></div>';
  html += '</div>';
  if (r.staticPressure) {
    html += '<h3 style="margin-top:25px;">' + (isAr ? '🔋 الضغط الثابت' : '🔋 Static Pressure (System Off)') + '</h3>';
    html += '<div class="pt-table-wrap"><table class="pt-table"><thead><tr><th>' + (isAr ? 'المحيط' : 'Ambient') + '</th><th>' + (isAr ? 'الضغط' : 'Pressure') + '</th></tr></thead><tbody>';
    for (var i = 0; i < r.staticPressure.length; i++) {
      var d = r.staticPressure[i];
      html += '<tr><td>' + d[0] + '°C / ' + d[1] + '°F</td><td>' + d[2] + '–' + d[3] + '</td></tr>';
    }
    html += '</tbody></table></div>';
  }
  html += '<h3 style="margin-top:25px;">' + (isAr ? '🔍 تفسير الضغوط' : '🔍 Pressure Interpretation') + '</h3>';
  html += '<div class="pt-table-wrap"><table class="pt-table"><thead><tr><th>' + (isAr ? 'منخفض' : 'Low') + '</th><th>' + (isAr ? 'عالي' : 'High') + '</th><th>' + (isAr ? 'المشكلة' : 'Problem') + '</th></tr></thead><tbody>';
  html += '<tr><td style="color:var(--ok)">' + (isAr ? 'طبيعي' : 'Normal') + '</td><td style="color:var(--ok)">' + (isAr ? 'طبيعي' : 'Normal') + '</td><td style="color:var(--ok)">✅ ' + (isAr ? 'جيد' : 'OK') + '</td></tr>';
  html += '<tr><td style="color:var(--warn)">' + (isAr ? 'منخفض' : 'Low') + '</td><td style="color:var(--warn)">' + (isAr ? 'منخفض' : 'Low') + '</td><td>' + (isAr ? 'شحن منخفض' : 'Low charge') + '</td></tr>';
  html += '<tr><td style="color:var(--warn)">' + (isAr ? 'منخفض' : 'Low') + '</td><td style="color:var(--danger)">' + (isAr ? 'عالي' : 'High') + '</td><td>' + (isAr ? 'انسداد' : 'Restriction') + '</td></tr>';
  html += '<tr><td style="color:var(--danger)">' + (isAr ? 'عالي' : 'High') + '</td><td style="color:var(--warn)">' + (isAr ? 'منخفض' : 'Low') + '</td><td>' + (isAr ? 'عطل ضاغط' : 'Compressor failure') + '</td></tr>';
  html += '<tr><td style="color:var(--danger)">' + (isAr ? 'عالي' : 'High') + '</td><td style="color:var(--danger)">' + (isAr ? 'عالي' : 'High') + '</td><td>' + (isAr ? 'شحن زائد' : 'Overcharged') + '</td></tr>';
  html += '</tbody></table></div>';
  document.getElementById('targetContent').innerHTML = html;
}

// Compare charts — two separate charts: suction (flat) + discharge (rises with heat)
function renderCompareChart() {
  renderCompareSide('compareLoCanvas', 'low', currentLang === 'ar' ? 'ضغط الشفط (PSIG)' : 'Suction Pressure (PSIG)');
  renderCompareSide('compareHiCanvas', 'high', currentLang === 'ar' ? 'ضغط التفريغ (PSIG)' : 'Discharge Pressure (PSIG)');
}

function renderCompareSide(canvasId, side, yLabel) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  var W = rect.width, H = rect.height;
  var padL = 70, padR = 20, padT = 30, padB = 50;
  var plotW = W - padL - padR, plotH = H - padT - padB;
  var tMin = 18, tMax = 55;
  var colors = ['#00b4d8','#f4a261','#2a9d8f','#e63946'];
  var keys = ['r134a','r22','r410a','r32'];
  var labels = ['R-134a','R-22','R-410A','R-32'];
  // Collect data points with low-side cap applied
  var allPts = keys.map(function(key) {
    var r = refrigerants[key];
    return r.operatingRanges.map(function(d) {
      var rg = {loMin: d[2], loMax: d[3], hiMin: d[4], hiMax: d[5]};
      applyLoSideCap(rg, r.name);
      if (side === 'low') return {x: d[0], yMin: rg.loMin, yMax: rg.loMax};
      return {x: d[0], yMin: rg.hiMin, yMax: rg.hiMax};
    });
  });
  // Compute Y range
  var allY = [];
  allPts.forEach(function(pts) { pts.forEach(function(p) { allY.push(p.yMin); allY.push(p.yMax); }); });
  var yMin = Math.min.apply(null, allY), yMax = Math.max.apply(null, allY);
  var yPad = (yMax - yMin) * 0.1;
  var pMin = Math.max(0, Math.floor((yMin - yPad) / 10) * 10);
  var pMax = Math.ceil((yMax + yPad) / 10) * 10;
  // Draw
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#2a3a4a'; ctx.lineWidth = 1;
  ctx.font = '11px Segoe UI'; ctx.fillStyle = '#8899aa';
  for (var i = 0; i <= 5; i++) {
    var pVal = pMin + (pMax - pMin) * i / 5;
    var y = padT + plotH - (pVal - pMin) / (pMax - pMin) * plotH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText(Math.round(pVal) + '', padL - 8, y + 4);
  }
  for (var t = tMin; t <= tMax; t += 5) {
    var x = padL + (t - tMin) / (tMax - tMin) * plotW;
    ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, H - padB); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillText(t + '°C', x, H - padB + 18);
  }
  ctx.fillStyle = '#e0e8f0'; ctx.font = 'bold 12px Segoe UI';
  ctx.save(); ctx.translate(16, H/2); ctx.rotate(-Math.PI/2);
  ctx.textAlign = 'center'; ctx.fillText(yLabel, 0, 0); ctx.restore();
  ctx.textAlign = 'center'; ctx.fillText(currentLang === 'ar' ? 'حرارة الخارج (°C)' : 'Outdoor Temp (°C)', W/2, H - 5);
  for (var di = 0; di < keys.length; di++) {
    var pts = allPts[di]; var color = colors[di];
    // Fill band
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = 0.12; ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var x = padL + (pts[i].x - tMin) / (tMax - tMin) * plotW;
      var y = padT + plotH - (pts[i].yMax - pMin) / (pMax - pMin) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (var i = pts.length - 1; i >= 0; i--) {
      var x = padL + (pts[i].x - tMin) / (tMax - tMin) * plotW;
      var y = padT + plotH - (pts[i].yMin - pMin) / (pMax - pMin) * plotH;
      ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    ctx.globalAlpha = 1;
    // Center line
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var x = padL + (pts[i].x - tMin) / (tMax - tMin) * plotW;
      var yMid = padT + plotH - ((pts[i].yMin + pts[i].yMax) / 2 - pMin) / (pMax - pMin) * plotH;
      if (i === 0) ctx.moveTo(x, yMid); else ctx.lineTo(x, yMid);
    }
    ctx.stroke();
  }
  // Legend
  var legY = padT + 5;
  for (var i = 0; i < labels.length; i++) {
    var lx = padL + 10 + i * 110;
    ctx.fillStyle = colors[i]; ctx.font = 'bold 12px Segoe UI'; ctx.textAlign = 'left';
    ctx.fillRect(lx, legY, 20, 3);
    ctx.fillText(labels[i], lx + 25, legY + 5);
  }
}

// Issues rendering
function renderIssues() {
  var r = refrigerants[currentRef];
  var isAr = currentLang === 'ar';
  document.getElementById('issuesRef').textContent = '(' + r.name + ')';
  var oilDiag = window.OIL_DIAGNOSTICS;
  var html = '<h3>' + (isAr ? '🫒 تشخيص الزيت' : '🫒 Oil Diagnostics') + '</h3>';
  html += '<p style="color:var(--text-dim);font-size:0.85em;margin-bottom:10px;">' + (isAr ? 'افحص لون زيت الضاغط ورائحته لتشخيص حالة النظام.' : 'Check compressor oil color and smell to diagnose system health.') + '</p>';
  html += '<div class="pt-table-wrap"><table class="pt-table"><thead><tr><th>' + (isAr ? 'اللون' : 'Color') + '</th><th>' + (isAr ? 'الحالة' : 'Status') + '</th><th>' + (isAr ? 'المعنى' : 'Meaning') + '</th><th>' + (isAr ? 'الإجراء' : 'Action') + '</th></tr></thead><tbody>';
  for (var i = 0; i < oilDiag.colors.length; i++) {
    var c = oilDiag.colors[i];
    html += '<tr><td><span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:' + c.bg + ';vertical-align:middle;margin-right:6px;border:1px solid #444;"></span>' + T(c.color) + '</td><td>' + T(c.status) + '</td><td>' + T(c.desc) + '</td><td>' + T(c.action) + '</td></tr>';
  }
  html += '</tbody></table></div>';
  // Issues per refrigerant
  var data = window.ISSUES_DATA[currentRef];
  if (data) {
    html += '<hr class="calc-divider"><h3>' + (isAr ? '🔌 مشاكل الشحن' : '🔌 Charging Issues') + '</h3>';
    for (var i = 0; i < data.charging.length; i++) {
      var issue = data.charging[i];
      html += '<div class="warn-box"><div class="title">' + T(issue.title) + '</div>';
      html += '<p style="font-size:0.85em;"><strong>' + (isAr ? 'الأعراض:' : 'Symptoms:') + '</strong> ' + T(issue.sym) + '<br>';
      html += '<strong>' + (isAr ? 'السبب:' : 'Cause:') + '</strong> ' + T(issue.cause) + '<br>';
      html += '<strong>' + (isAr ? 'الإصلاح:' : 'Fix:') + '</strong> ' + T(issue.fix) + '</p></div>';
    }
    html += '<h3 style="margin-top:20px;">' + (isAr ? '📊 مشاكل الضغط' : '📊 Pressure Issues') + '</h3>';
    for (var i = 0; i < data.pressure.length; i++) {
      var issue = data.pressure[i];
      html += '<div class="warn-box"><div class="title">' + T(issue.title) + '</div>';
      html += '<p style="font-size:0.85em;"><strong>' + (isAr ? 'الأعراض:' : 'Symptoms:') + '</strong> ' + T(issue.sym) + '<br>';
      html += '<strong>' + (isAr ? 'السبب:' : 'Cause:') + '</strong> ' + T(issue.cause) + '<br>';
      html += '<strong>' + (isAr ? 'الإصلاح:' : 'Fix:') + '</strong> ' + T(issue.fix) + '</p></div>';
    }
    html += '<h3 style="margin-top:20px;">' + (isAr ? '⚡ مشاكل كهربائية' : '⚡ Electrical Issues') + '</h3>';
    for (var i = 0; i < data.electrical.length; i++) {
      var issue = data.electrical[i];
      html += '<div class="warn-box danger"><div class="title">' + T(issue.title) + '</div>';
      html += '<p style="font-size:0.85em;"><strong>' + (isAr ? 'الأعراض:' : 'Symptoms:') + '</strong> ' + T(issue.sym) + '<br>';
      html += '<strong>' + (isAr ? 'السبب:' : 'Cause:') + '</strong> ' + T(issue.cause) + '<br>';
      html += '<strong>' + (isAr ? 'الإصلاح:' : 'Fix:') + '</strong> ' + T(issue.fix) + '</p></div>';
    }
  }
  document.getElementById('issuesContent').innerHTML = html;
}

// Maintenance rendering
function renderMaintenance() {
  var isAr = currentLang === 'ar';
  var html = '<h3>' + (isAr ? '🧽 تنظيف الوحدة الداخلية' : '🧽 Indoor Unit (Evaporator) Cleaning') + '</h3>' +
    '<div class="instructions">' +
    '<div class="step"><strong>' + (isAr ? 'أوقف الكهرباء' : 'Turn off power') + '</strong> ' + (isAr ? 'من القاطع.' : 'at the breaker.') + '</div>' +
    '<div class="step"><strong>' + (isAr ? 'أزل فلتر الهواء' : 'Remove the air filter.') + '</strong> ' + (isAr ? 'اغسله أو استبدله.' : 'Wash or replace it.') + '</div>' +
    '<div class="step"><strong>' + (isAr ? 'نظّف ملفات المبخر' : 'Clean the evaporator coils.') + '</strong> ' + (isAr ? 'استخدم بخاخ تنظيف ملفات بدون شطف.' : 'Use a no-rinse coil cleaner spray.') + '</div>' +
    '<div class="step"><strong>' + (isAr ? 'نظّف مجرى التكثيف' : 'Clean the condensate drain.') + '</strong> ' + (isAr ? 'اسكب كوب مبيّض مخفف أو خل.' : 'Pour diluted bleach or vinegar.') + '</div>' +
    '<div class="step"><strong>' + (isAr ? 'أعد التجميع واختبر' : 'Reassemble and test.') + '</strong></div>' +
    '</div>' +
    '<h3 style="margin-top:25px;">' + (isAr ? '🏭 تنظيف الوحدة الخارجية' : '🏭 Outdoor Unit (Condenser) Cleaning') + '</h3>' +
    '<div class="instructions">' +
    '<div class="step"><strong>' + (isAr ? 'أوقف الكهرباء' : 'Turn off power') + '</strong></div>' +
    '<div class="step"><strong>' + (isAr ? 'أزل الأتربة' : 'Clear debris.') + '</strong> ' + (isAr ? 'أزل الأوراق ضمن 60 سم.' : 'Remove leaves within 2 feet.') + '</div>' +
    '<div class="step"><strong>' + (isAr ? 'نظّف ألواح المكثف' : 'Clean the condenser fins.') + '</strong> ' + (isAr ? 'استخدم خرطوم حديقة فقط.' : 'Use garden hose only.') + '</div>' +
    '<div class="step"><strong>' + (isAr ? 'افحص محرك المروحة' : 'Check the fan motor.') + '</strong></div>' +
    '<div class="step"><strong>' + (isAr ? 'أعد الكهرباء واختبر' : 'Restore power and test.') + '</strong></div>' +
    '</div>';
  document.getElementById('maintenanceContent').innerHTML = html;
}

// System calculator
function calcSystem() {
  var isAr = currentLang === 'ar';
  var length = parseFloat(document.getElementById('sysLength').value);
  var width = parseFloat(document.getElementById('sysWidth').value);
  var height = parseFloat(document.getElementById('sysHeight').value);
  var climate = parseInt(document.getElementById('sysClimate').value);
  var insulation = document.getElementById('sysInsulation').value;
  var windows = document.getElementById('sysWindows').value;
  if (isNaN(length) || isNaN(width) || isNaN(height)) return;
  var area = length * width, volume = area * height;
  var btuPerSqm = climate === 1 ? 450 : climate === 2 ? 600 : climate === 3 ? 800 : 1000;
  if (insulation === 'poor') btuPerSqm *= 1.3;
  else if (insulation === 'good') btuPerSqm *= 0.85;
  if (windows === 'many') btuPerSqm *= 1.2;
  else if (windows === 'few') btuPerSqm *= 0.9;
  var totalBTU = Math.round(area * btuPerSqm);
  var tons = (totalBTU / 12000).toFixed(2);
  var r = refrigerants[currentRef];
  var ambC = climate === 1 ? 24 : climate === 2 ? 30 : climate === 3 ? 38 : 48;
  var rg = interpRanges(r.operatingRanges, ambC);
  applyLoSideCap(rg, r.name);
  var suctionPipe, liquidPipe;
  if (totalBTU <= 12000) { suctionPipe = '3/8"'; liquidPipe = '1/4"'; }
  else if (totalBTU <= 24000) { suctionPipe = '1/2"'; liquidPipe = '3/8"'; }
  else if (totalBTU <= 36000) { suctionPipe = '5/8"'; liquidPipe = '3/8"'; }
  else if (totalBTU <= 48000) { suctionPipe = '3/4"'; liquidPipe = '1/2"'; }
  else { suctionPipe = '7/8"'; liquidPipe = '1/2"'; }
  var rla, lra;
  if (totalBTU <= 12000) { rla = '5–8A'; lra = '25–35A'; }
  else if (totalBTU <= 24000) { rla = '8–14A'; lra = '40–60A'; }
  else if (totalBTU <= 36000) { rla = '14–20A'; lra = '60–80A'; }
  else if (totalBTU <= 48000) { rla = '18–26A'; lra = '75–100A'; }
  else { rla = '24–35A'; lra = '90–130A'; }
  var box = document.getElementById('sysResult');
  box.classList.add('show');
  box.innerHTML = '<div class="label">' + (isAr ? 'قدرة التبريد المطلوبة' : 'Required Cooling Capacity') + '</div>' +
    '<div class="big-num">' + totalBTU.toLocaleString() + ' <span class="unit">BTU/h</span></div>' +
    '<div style="color:var(--text-dim);font-size:0.9em;margin-top:5px;">≈ ' + tons + ' ' + (isAr ? 'طن' : 'Tons') + ' | ' + area.toFixed(0) + ' m² | ' + volume.toFixed(0) + ' m³</div>' +
    '<div style="margin-top:15px;"><h3>🔧 ' + r.name + ' ' + (isAr ? 'مواصفات النظام' : 'System Specifications') + '</h3></div>' +
    '<div class="info-grid" style="margin-top:10px;">' +
    '<div class="info-item"><div class="label">' + (isAr ? 'الجانب المنخفض' : 'Low Side') + '</div><div class="value">' + rg.loMin + '–' + rg.loMax + ' PSIG</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr ? 'الجانب العالي' : 'High Side') + '</div><div class="value">' + rg.hiMin + '–' + rg.hiMax + ' PSIG</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr ? 'أنبوب الشفط' : 'Suction Pipe') + '</div><div class="value">' + suctionPipe + '</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr ? 'أنبوب السائل' : 'Liquid Pipe') + '</div><div class="value">' + liquidPipe + '</div></div>' +
    '<div class="info-item"><div class="label">RLA</div><div class="value">' + rla + '</div></div>' +
    '<div class="info-item"><div class="label">LRA</div><div class="value">' + lra + '</div></div>' +
    '</div>';
}

// Device calculator
function calcDevice() {
  var isAr = currentLang === 'ar';
  var btu = parseInt(document.getElementById('sysBTUSelect').value);
  var sysType = document.getElementById('sysType').value;
  var r = refrigerants[currentRef];
  var tons = (btu / 12000);
  var d = window.DEVICE_DATA[btu] || window.DEVICE_DATA[18000];
  var sp = sysType === 'minisplit' ? d.minisplit : {suct: d.suctPipe, liq: d.liqPipe};
  var chargeKey = r.name === 'R-410A' ? 'chargeR410A' : r.name === 'R-32' ? 'chargeR32' : 'chargeR134a';
  var charge = d[chargeKey] || d.chargeR410A;
  var rg = interpRanges(r.operatingRanges, 35);
  applyLoSideCap(rg, r.name);
  var sysLabel = sysType === 'minisplit' ? 'Mini-Split' : sysType === 'package' ? 'Packaged Unit' : 'Split System';
  var html = '<h3>' + (isAr ? '📋 مواصفات المكوّنات — ' : '📋 Component Spec — ') + btu.toLocaleString() + ' BTU/h (' + tons.toFixed(1) + ' ' + (isAr ? 'طن' : 'Ton') + ') ' + sysLabel + '</h3>';
  html += '<h4 style="color:var(--accent);margin:15px 0 8px;">' + (isAr ? '🔧 الضاغط' : '🔧 Compressor') + '</h4>';
  html += '<div class="info-grid">';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'النوع' : 'Type') + '</div><div class="value">' + d.comp + '</div></div>';
  html += '<div class="info-item"><div class="label">RLA</div><div class="value">' + d.rla + ' A</div></div>';
  html += '<div class="info-item"><div class="label">LRA</div><div class="value">' + d.lra + ' A</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'الوزن' : 'Weight') + '</div><div class="value">' + d.weight + ' kg</div></div>';
  html += '</div>';
  html += '<h4 style="color:var(--accent);margin:15px 0 8px;">' + (isAr ? '🔌 كهربائي' : '🔌 Electrical') + '</h4>';
  html += '<div class="info-grid">';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'الجهد' : 'Voltage') + '</div><div class="value">' + d.voltage + '</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'الأسلاك' : 'Wire') + '</div><div class="value">' + d.wire + '</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'القاطع' : 'Breaker') + '</div><div class="value">' + d.breaker + ' A</div></div>';
  html += '</div>';
  html += '<h4 style="color:var(--accent);margin:15px 0 8px;">' + (isAr ? '🔗 أنابيب' : '🔗 Piping') + '</h4>';
  html += '<div class="info-grid">';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'شفط' : 'Suction') + '</div><div class="value">' + sp.suct + '</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'سائل' : 'Liquid') + '</div><div class="value">' + sp.liq + '</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'الشحن' : 'Charge') + '</div><div class="value">' + charge + ' lbs</div></div>';
  html += '</div>';
  html += '<h4 style="color:var(--accent);margin:15px 0 8px;">' + (isAr ? '🌡️ ضغوط التشغيل (35°C)' : '🌡️ Operating Pressures (35°C)') + '</h4>';
  html += '<div class="info-grid">';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'منخفض' : 'Low Side') + '</div><div class="value">' + rg.loMin + '–' + rg.loMax + ' PSIG</div></div>';
  html += '<div class="info-item"><div class="label">' + (isAr ? 'عالي' : 'High Side') + '</div><div class="value">' + rg.hiMin + '–' + rg.hiMax + ' PSIG</div></div>';
  html += '</div>';
  document.getElementById('deviceResult').innerHTML = html;
  document.getElementById('sysResult').classList.remove('show');
}

// Diagram rendering
var _diagScale = 1, _diagPanX = 0, _diagPanY = 0;
var _diagCompData = {};
var _diagEventsAttached = false;
var _compDragKey = null, _compDragOffX = 0, _compDragOffY = 0;
var _compPosMap = {EVAPORATOR:'evap',EVAPFAN:'evapFan',COMPRESSOR:'comp',CONDENSER:'cond',CONDFAN:'condFan',TXV:'txv'};
window._diagPos = {evap:{x:50,y:90},evapFan:{x:80,y:25},comp:{x:440,y:80},cond:{x:440,y:310},condFan:{x:500,y:245},txv:{x:130,y:370}};

function applyDiagramTransform() {
  var svg = document.getElementById('diagramSVG');
  if (!svg) return;
  svg.style.transform = 'translate(' + _diagPanX + 'px,' + _diagPanY + 'px) scale(' + _diagScale + ')';
  svg.style.transformOrigin = '0 0';
  var lbl = document.getElementById('diagZoomLevel');
  if (lbl) lbl.textContent = Math.round(_diagScale * 100) + '%';
}
function diagZoom(factor) { _diagScale *= factor; _diagScale = Math.max(0.4, Math.min(3.5, _diagScale)); applyDiagramTransform(); }
function diagReset() { _diagScale = 1; _diagPanX = 0; _diagPanY = 0; applyDiagramTransform(); }
// Expose functions needed by HTML onclick attributes
window.diagZoom = diagZoom;
window.diagReset = diagReset;
window.calcSystem = calcSystem;
window.calcDevice = calcDevice;
window.toggleLang = toggleLang;
window.filterQA = filterQA;

function renderDiagram() {
  var r = refrigerants[currentRef];
  var isAr = currentLang === 'ar';
  var ambC = parseFloat(document.getElementById('diagAmbInput').value) || 35;
  var rg = interpRanges(r.operatingRanges, ambC);
  applyLoSideCap(rg, r.name);
  var loMid = (rg.loMin+rg.loMax)/2, hiMid = (rg.hiMin+rg.hiMax)/2;
  var evapT = Math.round(interpolateReverse(r.pt, loMid));
  var condT = Math.round(interpolateReverse(r.pt, hiMid));
  document.getElementById('diagInfoGrid').innerHTML =
    '<div class="info-item"><div class="label">' + (isAr?'المحيط':'Ambient') + '</div><div class="value">' + ambC + '°C</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr?'منخفض':'Low Side') + '</div><div class="value">' + rg.loMin + '-' + rg.loMax + ' PSIG</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr?'عالي':'High Side') + '</div><div class="value">' + rg.hiMin + '-' + rg.hiMax + ' PSIG</div></div>' +
    '<div class="info-item"><div class="label">' + (isAr?'المبرد':'Refrigerant') + '</div><div class="value">' + r.name + '</div></div>';
  var compData = {
    EVAPORATOR: {title:isAr?'مبخر (ملف داخلي)':'Evaporator (Indoor Coil)',lines:isAr?[r.name+' منخفض الضغط يتبخر، ماصاً للحرارة من الهواء الداخلي.','الضغط: '+rg.loMin+'-'+rg.loMax+' PSIG | الحرارة: ~'+evapT+'°C','هدف السوبريتي: '+r.superheatTarget,'الهواء يدخل دافئاً ويخرج بارداً (2-7°C تحت حرارة الغرفة)']:['Low-pressure '+r.name+' evaporates, absorbing heat from indoor air.','Pressure: '+rg.loMin+'-'+rg.loMax+' PSIG | Temp: ~'+evapT+'°C','Superheat target: '+r.superheatTarget,'Air enters warm, exits cold (2-7°C below room temp)']},
    COMPRESSOR: {title:isAr?'ضاغط':'Compressor',lines:isAr?['بخار منخفض الضغط يُضغط إلى بخار عالي الضغط والحرارة.','شفط: '+rg.loMin+'-'+rg.loMax+' PSIG | تفريغ: '+rg.hiMin+'-'+rg.hiMax+' PSIG','نوع الزيت: '+T(r.oil),'الأكثر شيوعاً: سكرول للسكني']:['Low-pressure vapor compressed to high-pressure, high-temperature vapor.','Suction: '+rg.loMin+'-'+rg.loMax+' PSIG | Discharge: '+rg.hiMin+'-'+rg.hiMax+' PSIG','Oil type: '+T(r.oil),'Most common: Scroll type for residential']},
    CONDENSER: {title:isAr?'مكثف (ملف خارجي)':'Condenser (Outdoor Coil)',lines:isAr?[r.name+' عالي الضغط يتكاثف إلى سائل، طارداً الحرارة.','الضغط: '+rg.hiMin+'-'+rg.hiMax+' PSIG | الحرارة: ~'+condT+'°C','هدف التبريد تحت التشبع: '+r.subcoolingTarget,'المحيط: '+ambC+'°C']:['High-pressure '+r.name+' vapor condenses into liquid, releasing heat.','Pressure: '+rg.hiMin+'-'+rg.hiMax+' PSIG | Temp: ~'+condT+'°C','Subcooling target: '+r.subcoolingTarget,'Ambient: '+ambC+'°C']},
    TXV: {title:isAr?'صمام تمديد (TXV/EEV)':'Expansion Valve (TXV/EEV)',lines:isAr?['سائل عالي الضغط يمر عبر الفتحة، منخفضاً الضغط بشكل كبير.','انخفاض الضغط: '+rg.hiMin+'-'+rg.hiMax+' > '+rg.loMin+'-'+rg.loMax+' PSIG','يتحكم في السوبريتي لحماية الضاغط من دخول السائل']:['High-pressure liquid passes through orifice, dropping pressure dramatically.','Pressure drop: '+rg.hiMin+'-'+rg.hiMax+' > '+rg.loMin+'-'+rg.loMax+' PSIG','Controls superheat to protect compressor from liquid slugging']},
    EVAPFAN: {title:isAr?'مروحة مبخر':'Evaporator Fan',lines:isAr?['يدفع الهواء عبر ملف المبخر البارد']:['Forces air across cold evaporator coil']},
    CONDFAN: {title:isAr?'مروحة المكثف':'Condenser Fan',lines:isAr?['تسحب الهواء الخارجي عبر ملف المكثف الساخن لإزالة الحرارة.','عطل المروحة = تراكم ضغط عالي سريع وقطع الضاغط']:['Pulls outdoor air across hot condenser coil to remove heat.','Fan failure = rapid high-pressure buildup and compressor trip']}
  };
  _diagCompData = compData;
  var _pos = window._diagPos;
  var W = 720, H = 570;
  var evap = {x:_pos.evap.x,y:_pos.evap.y,w:180,h:110};
  var evapFan = {x:_pos.evapFan.x,y:_pos.evapFan.y,w:80,h:55};
  var comp = {x:_pos.comp.x,y:_pos.comp.y,w:140,h:90};
  var cond = {x:_pos.cond.x,y:_pos.cond.y,w:180,h:110};
  var condFan = {x:_pos.condFan.x,y:_pos.condFan.y,w:80,h:55};
  var txv = {x:_pos.txv.x,y:_pos.txv.y,w:80,h:50};
  var wallX = 340, wallW = 16;
  var sX1 = evap.x+evap.w, sY1 = evap.y+evap.h/2;
  var sX2 = comp.x, sY2 = comp.y+comp.h/2;
  var dX1 = comp.x+comp.w/2, dY1 = comp.y+comp.h;
  var dX2 = cond.x+cond.w/2, dY2 = cond.y;
  var lX1 = cond.x, lY1 = cond.y+cond.h/2;
  var lX2 = txv.x+txv.w, lY2 = txv.y+txv.h/2;
  var tX1 = txv.x, tY1 = txv.y+txv.h/2;
  var tX2 = evap.x+evap.w/2, tY2 = evap.y+evap.h;
  var bgH = 420;
  var sMidX = (sX1+sX2)/2;
  function box(x,y,w,h,fill,stroke,id) { return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" ry="8" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2" class="diag-comp" data-comp="'+id+'" style="cursor:move;"/>'; }
  function fan(x,y,w,h,fill,stroke,id) {
    var cx = x+w/2, cy = y+18, r = 14;
    var s = '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" ry="8" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2" class="diag-comp" data-comp="'+id+'" style="cursor:move;"/>';
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+stroke+'" stroke-width="1.5" pointer-events="none"/>';
    s += '<g class="fan-blades" style="transform-origin: '+cx+'px '+cy+'px;" pointer-events="none">';
    for (var i=0; i<5; i++) { s += '<ellipse cx="'+cx+'" cy="'+(cy-7)+'" rx="3.5" ry="7" fill="'+stroke+'" opacity="0.6" transform="rotate('+(i*72)+' '+cx+' '+cy+')" pointer-events="none"/>'; }
    s += '</g>';
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="2.5" fill="'+stroke+'" pointer-events="none"/>';
    return s;
  }
  function coil(x,y,w,h,color,id) {
    var s = box(x,y,w,h,'#0d2137',color,id);
    s += '<g class="coil-pattern" pointer-events="none">';
    var cy = y+h/2+8, amp = 10, segs = 8, segW = (w-20)/segs;
    var path = 'M'+(x+10)+' '+cy;
    for (var i=0; i<segs; i++) { var px = x+10+segW*(i+1); path += ' L'+(px-segW/2)+' '+(cy-amp)+' L'+px+' '+cy; }
    s += '<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="1.5" opacity="0.4" pointer-events="none"/>';
    s += '</g>';
    return s;
  }
  function compressor(x,y,w,h,fill,stroke,id) {
    var cx = x+w/2, cy = y+h/2-5;
    var s = box(x,y,w,h,fill,stroke,id);
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="22" fill="none" stroke="'+stroke+'" stroke-width="1.5" opacity="0.5" pointer-events="none"/>';
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="14" fill="none" stroke="'+stroke+'" stroke-width="1" opacity="0.3" pointer-events="none"/>';
    s += '<path d="M'+(cx-8)+' '+(cy-8)+' L'+(cx+8)+' '+cy+' L'+(cx-8)+' '+(cy+8)+' Z" fill="'+stroke+'" opacity="0.3" pointer-events="none"/>';
    return s;
  }
  function txt(x,y,t,s,c) { return '<text x="'+x+'" y="'+y+'" fill="'+(c||'#e0e8f0')+'" font-size="'+(s||11)+'" font-weight="bold" text-anchor="middle" pointer-events="none">'+t+'</text>'; }
  function linelbl(x,y,lbl,sub,c) { return '<g><rect x="'+(x-55)+'" y="'+(y-12)+'" width="110" height="28" rx="4" fill="#0a1520" stroke="#2a3a4a" stroke-width="1" opacity="0.95"/><text x="'+x+'" y="'+(y+1)+'" fill="'+c+'" font-size="8" font-weight="bold" text-anchor="middle">'+lbl+'</text><text x="'+x+'" y="'+(y+11)+'" fill="'+c+'" font-size="7" text-anchor="middle" opacity="0.7">'+sub+'</text></g>'; }
  var svg = '<svg id="diagramSVG" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#0a1520;border-radius:8px;">';
  svg += '<defs><marker id="arrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#00b4d8"/></marker><marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#e63946"/></marker><marker id="arrowO" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#f4a261"/></marker><marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#2a9d8f"/></marker></defs>';
  svg += '<rect x="10" y="10" width="'+(wallX-15)+'" height="420" rx="10" fill="#071520" stroke="#1a3050"/>';
  svg += '<rect x="'+wallX+'" y="10" width="'+wallW+'" height="420" fill="#2a3a4a"/>';
  svg += '<text x="'+(wallX+wallW/2)+'" y="220" fill="#6a7a8a" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(-90,'+(wallX+wallW/2)+',220)">'+(isAr?'الجدار':'WALL')+'</text>';
  svg += '<rect x="'+(wallX+wallW+5)+'" y="10" width="'+(W-wallX-wallW-15)+'" height="420" rx="10" fill="#151008" stroke="#3a3020"/>';
  svg += '<text x="'+((wallX-15)/2+10)+'" y="30" fill="#1a4060" font-size="13" font-weight="bold" text-anchor="middle">'+(isAr?'الوحدة الداخلية':'INDOOR')+'</text>';
  svg += '<text x="'+((wallX+wallW+5+W)/2)+'" y="30" fill="#6a5030" font-size="13" font-weight="bold" text-anchor="middle">'+(isAr?'الوحدة الخارجية':'OUTDOOR')+'</text>';
  svg += '<path d="M'+sX1+' '+sY1+' L'+(wallX+wallW+10)+' '+sY1+' L'+(wallX+wallW+10)+' '+sY2+' L'+sX2+' '+sY2+'" fill="none" stroke="#00b4d8" stroke-width="3" marker-end="url(#arrowB)"/>';
  svg += '<path d="M'+dX1+' '+dY1+' L'+dX1+' '+(dY1+30)+' L'+dX2+' '+(dY1+30)+' L'+dX2+' '+dY2+'" fill="none" stroke="#e63946" stroke-width="3" marker-end="url(#arrowR)"/>';
  svg += '<path d="M'+lX1+' '+lY1+' L'+(lX1-30)+' '+lY1+' L'+(lX1-30)+' '+lY2+' L'+lX2+' '+lY2+'" fill="none" stroke="#f4a261" stroke-width="3" stroke-dasharray="8,4" marker-end="url(#arrowO)"/>';
  svg += '<path d="M'+tX1+' '+tY1+' L'+(tX1-30)+' '+tY1+' L'+(tX1-30)+' '+(tY2+15)+' L'+tX2+' '+(tY2+15)+' L'+tX2+' '+tY2+'" fill="none" stroke="#2a9d8f" stroke-width="3" stroke-dasharray="8,4" marker-end="url(#arrowG)"/>';
  // Animated flow overlays on pipes
  svg += '<path class="pipe-flow" d="M'+sX1+' '+sY1+' L'+(wallX+wallW+10)+' '+sY1+' L'+(wallX+wallW+10)+' '+sY2+' L'+sX2+' '+sY2+'" fill="none" stroke="#00b4d8" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  svg += '<path class="pipe-flow" d="M'+dX1+' '+dY1+' L'+dX1+' '+(dY1+30)+' L'+dX2+' '+(dY1+30)+' L'+dX2+' '+dY2+'" fill="none" stroke="#e63946" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  svg += '<path class="pipe-flow" d="M'+lX1+' '+lY1+' L'+(lX1-30)+' '+lY1+' L'+(lX1-30)+' '+lY2+' L'+lX2+' '+lY2+'" fill="none" stroke="#f4a261" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  svg += '<path class="pipe-flow" d="M'+tX1+' '+tY1+' L'+(tX1-30)+' '+tY1+' L'+(tX1-30)+' '+(tY2+15)+' L'+tX2+' '+(tY2+15)+' L'+tX2+' '+tY2+'" fill="none" stroke="#2a9d8f" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  // Airflow arrows — indoor (warm air in, cold air out)
  svg += '<g pointer-events="none" opacity="0.5"><path d="M'+(evap.x-25)+' '+(evap.y+30)+' L'+(evap.x-5)+' '+(evap.y+30)+'" stroke="#e63946" stroke-width="1.5" marker-end="url(#arrowR)"/><text x="'+(evap.x-28)+'" y="'+(evap.y+25)+'" fill="#e63946" font-size="6" text-anchor="end">'+(isAr?'دافئ':'Warm')+'</text></g>';
  svg += '<g pointer-events="none" opacity="0.5"><path d="M'+(evap.x+evap.w+5)+' '+(evap.y+30)+' L'+(evap.x+evap.w+25)+' '+(evap.y+30)+'" stroke="#00b4d8" stroke-width="1.5" marker-end="url(#arrowB)"/><text x="'+(evap.x+evap.w+28)+'" y="'+(evap.y+25)+'" fill="#00b4d8" font-size="6">'+(isAr?'بارد':'Cold')+'</text></g>';
  // Airflow arrows — outdoor (hot air out)
  svg += '<g pointer-events="none" opacity="0.5"><path d="M'+(cond.x+cond.w+5)+' '+(cond.y+30)+' L'+(cond.x+cond.w+25)+' '+(cond.y+30)+'" stroke="#e63946" stroke-width="1.5" marker-end="url(#arrowR)"/><text x="'+(cond.x+cond.w+28)+'" y="'+(cond.y+25)+'" fill="#e63946" font-size="6">'+(isAr?'حار':'Hot')+'</text></g>';
  svg += fan(evapFan.x,evapFan.y,evapFan.w,evapFan.h,'#0a1a2a','#4488aa','EVAPFAN');
  svg += coil(evap.x,evap.y,evap.w,evap.h,'#00b4d8','EVAPORATOR');
  svg += compressor(comp.x,comp.y,comp.w,comp.h,'#2a1a1a','#e63946','COMPRESSOR');
  svg += coil(cond.x,cond.y,cond.w,cond.h,'#f4a261','CONDENSER');
  svg += fan(condFan.x,condFan.y,condFan.w,condFan.h,'#2a1a0a','#aa6633','CONDFAN');
  svg += box(txv.x,txv.y,txv.w,txv.h,'#1a2a1a','#2a9d8f','TXV');
  var dischargeT = Math.round(interpolateReverse(r.pt, hiMid));
  svg += txt(evapFan.x+evapFan.w/2,evapFan.y+42,isAr?'مروحة مبخر':'EVAP FAN',8,'#4488aa');
  svg += txt(evapFan.x+evapFan.w/2,evapFan.y+52,isAr?'ناشر':'Blower',8,'#8899aa');
  svg += txt(evap.x+evap.w/2,evap.y+30,isAr?'مبخر':'EVAPORATOR',13,'#00b4d8');
  svg += txt(evap.x+evap.w/2,evap.y+52,isAr?'ملف داخلي':'Indoor Coil',10,'#8899aa');
  svg += txt(evap.x+evap.w/2,evap.y+72,'~'+evapT+'\u00B0C',10,'#00b4d8');
  svg += txt(evap.x+evap.w/2,evap.y+88,rg.loMin+'-'+rg.loMax+' PSIG',9,'#00b4d8');
  svg += txt(comp.x+comp.w/2,comp.y+25,isAr?'ضاغط':'COMPRESSOR',12,'#e63946');
  svg += txt(comp.x+comp.w/2,comp.y+44,isAr?'سكرول':'Scroll',9,'#8899aa');
  svg += txt(comp.x+comp.w/2,comp.y+60,'~'+dischargeT+'\u00B0C',8,'#e63946');
  svg += txt(comp.x+comp.w/2,comp.y+76,rg.loMin+'-'+rg.hiMax+' PSIG',7,'#8899aa');
  svg += txt(cond.x+cond.w/2,cond.y+30,isAr?'مكثف':'CONDENSER',13,'#f4a261');
  svg += txt(cond.x+cond.w/2,cond.y+52,isAr?'ملف خارجي':'Outdoor Coil',10,'#8899aa');
  svg += txt(cond.x+cond.w/2,cond.y+72,'~'+condT+'\u00B0C',10,'#f4a261');
  svg += txt(cond.x+cond.w/2,cond.y+88,rg.hiMin+'-'+rg.hiMax+' PSIG',9,'#f4a261');
  svg += txt(txv.x+txv.w/2,txv.y+20,'TXV',12,'#2a9d8f');
  svg += txt(txv.x+txv.w/2,txv.y+36,isAr?'تمديد':'Metering',8,'#8899aa');
  svg += txt(condFan.x+condFan.w/2,condFan.y+42,isAr?'مروحة مكثف':'COND FAN',8,'#aa6633');
  svg += txt(condFan.x+condFan.w/2,condFan.y+52,isAr?'مروحة':'Propeller',8,'#8899aa');
  // Pipe line labels
  svg += linelbl(sMidX,sY1-35,isAr?'خط الشفط':'Suction Line',isAr?'(بخار)':'(Vapor)','#00b4d8');
  svg += linelbl(dX2+50,(dY1+dY2)/2,isAr?'خط التفريغ':'Discharge Line',isAr?'(بخار ساخن)':'(Hot Vapor)','#e63946');
  svg += linelbl(((lX1-30)+lX2)/2,lY1+25,isAr?'خط السائل':'Liquid Line',isAr?'(مبرد تحت التشبع)':'(Subcooled)','#f4a261');
  svg += linelbl(tX1-30,(tY1+tY2)/2,isAr?'بعد TXV':'After TXV',isAr?'(خليط ضغط منخفض)':'(Low P Mix)','#2a9d8f');
  // State annotations along pipes
  svg += '<text x="'+(sX1+13)+'" y="'+(sY1+6)+'" fill="#5599bb" font-size="7">'+(isAr?'بخار مُسخّن':'Superheated Vapor')+'</text>';
  svg += '<text x="'+(dX1+13)+'" y="'+(dY1+56)+'" fill="#bb5555" font-size="7">'+(isAr?'بخار ساخن مُسخّن':'Hot Superheated Vapor')+'</text>';
  svg += '<text x="'+(lX1+13)+'" y="'+(lY1+4)+'" fill="#bb8833" font-size="7">'+(isAr?'سائل مُبرد تحت التشبع':'Subcooled Liquid')+'</text>';
  svg += '<text x="'+(tX2+13)+'" y="'+(tY2+41)+'" fill="#448877" font-size="7">'+(isAr?'خليط رطب':'Wet Mixture')+'</text>';
  // Cycle footer
  svg += '<text x="'+(W/2)+'" y="'+(bgH+8)+'" fill="#556677" font-size="10" text-anchor="middle">'+(isAr?'الدورة: مبخر > ضاغط > مكثف > TXV > مبخر':'Cycle: Evaporator > Compressor > Condenser > TXV > Evaporator')+'</text>';
  // Legend bar
  var legY = bgH + 20;
  svg += '<rect x="20" y="'+legY+'" width="'+(W-40)+'" height="30" rx="5" fill="#0d1a2a" stroke="#2a3a4a" opacity="0.95"/>';
  svg += '<circle cx="35" cy="'+(legY+15)+'" r="5" fill="#2a9d8f" stroke="#fff" stroke-width="1.5"/>';
  svg += '<text x="45" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'1: مدخل مبخر (ضغط منخفض، خليط رطب)':'1: Evap Inlet (Low P, Wet Mix)')+'</text>';
  svg += '<text x="200" y="'+(legY+19)+'" fill="#556677" font-size="7">|</text>';
  svg += '<circle cx="210" cy="'+(legY+15)+'" r="5" fill="#00b4d8" stroke="#fff" stroke-width="1.5"/>';
  svg += '<text x="220" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'2: خروج مبخر (مُسخّن)':'2: Evap Outlet (Superheated)')+'</text>';
  svg += '<text x="380" y="'+(legY+19)+'" fill="#556677" font-size="7">|</text>';
  svg += '<circle cx="390" cy="'+(legY+15)+'" r="5" fill="#e63946" stroke="#fff" stroke-width="1.5"/>';
  svg += '<text x="400" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'3: خروج ضاغط (بخار ساخن)':'3: Comp Outlet (Hot Vapor)')+'</text>';
  svg += '<text x="540" y="'+(legY+19)+'" fill="#556677" font-size="7">|</text>';
  svg += '<circle cx="550" cy="'+(legY+15)+'" r="5" fill="#f4a261" stroke="#fff" stroke-width="1.5"/>';
  svg += '<text x="560" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'4: خروج مكثف (مُبرد تحت التشبع)':'4: Cond Outlet (Subcooled)')+'</text>';
  svg += '<text x="'+(W-30)+'" y="'+(legY+40)+'" fill="#667788" font-size="7" text-anchor="end">'+(isAr?'مرر للتكبير | اسحب الخلفية للتحريك':'Scroll to zoom | Drag bg to pan')+'</text>';
  svg += '</svg>';
  document.getElementById('jointDiagram').innerHTML = svg;
  applyDiagramTransform();
  // Diagram interactions
  var container = document.getElementById('jointDiagram');
  if (!_diagEventsAttached) {
    _diagEventsAttached = true;
    var _isPanning = false, _panStartX = 0, _panStartY = 0;
    container.addEventListener('wheel', function(e) { e.preventDefault(); _diagScale += e.deltaY > 0 ? -0.05 : 0.05; _diagScale = Math.max(0.4, Math.min(3.5, _diagScale)); applyDiagramTransform(); }, {passive: false});
    container.addEventListener('mousedown', function(e) {
      var t = e.target, compEl = null;
      while (t && t !== container) { if (t.getAttribute && t.getAttribute('data-comp')) { compEl = t; break; } t = t.parentElement; }
      if (compEl) {
        var posKey = _compPosMap[compEl.getAttribute('data-comp')];
        if (posKey) {
          e.preventDefault(); e.stopPropagation(); _compDragKey = posKey;
          var curSvg = document.getElementById('diagramSVG');
          if (curSvg) { var r = curSvg.getBoundingClientRect(); _compDragOffX = (e.clientX-r.left)/r.width*W - window._diagPos[posKey].x; _compDragOffY = (e.clientY-r.top)/r.height*H - window._diagPos[posKey].y; }
          container.style.cursor = 'grabbing'; return;
        }
      }
      _isPanning = true; _panStartX = e.clientX - _diagPanX; _panStartY = e.clientY - _diagPanY;
      container.style.cursor = 'grabbing'; e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
      if (_compDragKey) {
        var curSvg = document.getElementById('diagramSVG');
        if (!curSvg) return;
        var r = curSvg.getBoundingClientRect();
        window._diagPos[_compDragKey].x = Math.max(0, Math.min(W-80, (e.clientX-r.left)/r.width*W - _compDragOffX));
        window._diagPos[_compDragKey].y = Math.max(0, Math.min(H-50, (e.clientY-r.top)/r.height*H - _compDragOffY));
        renderDiagram();
      } else if (_isPanning) { _diagPanX = e.clientX - _panStartX; _diagPanY = e.clientY - _panStartY; applyDiagramTransform(); }
    });
    document.addEventListener('mouseup', function() { if (_compDragKey) { _compDragKey = null; renderDiagram(); } _isPanning = false; container.style.cursor = 'grab'; });
    container.addEventListener('click', function(e) {
      if (_compDragKey) return;
      var t = e.target, key = null;
      while (t && t !== container) { if (t.getAttribute && t.getAttribute('data-comp')) { key = t.getAttribute('data-comp'); break; } t = t.parentElement; }
      if (key && _diagCompData[key]) { var d = _diagCompData[key]; var detail = document.getElementById('diagDetail'); detail.style.display = 'block'; detail.innerHTML = '<strong>' + d.title + '</strong><br>' + d.lines.join('<br>'); }
    });
  }
}

// Common Knowledge rendering
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
    html += '<div class="qa-category">' + catName + '</div>';
    cats[catName].forEach(function(item) {
      html += '<details class="qa-card"><summary>' + item.q[lang] + '</summary><div class="qa-body">' + item.a[lang] + '</div></details>';
    });
  }
  if (!html) html = '<p style="color:var(--text-dim);text-align:center;padding:40px;">' + (lang === 'ar' ? 'لا توجد نتائج' : 'No results found') + '</p>';
  container.innerHTML = html;
}
function filterQA() { renderCommonKnowledge(); }

// Language toggle
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelector('.lang-toggle').textContent = currentLang === 'ar' ? '🌐 English' : '🌐 العربية';
  document.querySelectorAll('[data-en][data-ar]').forEach(function(el) {
    var val = el.getAttribute('data-' + currentLang);
    if (val.indexOf('<') !== -1) el.innerHTML = val;
    else el.textContent = val;
  });
  var tabNames = {en:{overview:'ℹ️ Overview',instructions:'📋 Instructions',ptchart:'📊 PT Chart',calculators:'🔧 Calculators',target:'🎯 Target Pressures',compare:'📊 Compare',diagram:'📐 System Diagram',issues:'⚠️ Issues',systemcalc:'🔧 System Calc',maintenance:'🧹 Maintenance',commonknowledge:'📖 Common Knowledge'},ar:{overview:'ℹ️ نظرة عامة',instructions:'📋 التعليمات',ptchart:'📊 مخطط الضغط-الحرارة',calculators:'🔧 الحاسبات',target:'🎯 الضغوط المستهدفة',compare:'📊 مقارنة',diagram:'📐 مخطط النظام',issues:'⚠️ المشاكل',systemcalc:'🔧 حاسبة النظام',maintenance:'🧹 الصيانة',commonknowledge:'📖 معلومات عامة'}};
  var t = tabNames[currentLang];
  document.querySelectorAll('.tab-btn').forEach(function(btn) { var key = btn.dataset.tab; if (t[key]) btn.textContent = t[key]; });
  var s = document.getElementById('qaSearch');
  if (s) s.placeholder = currentLang === 'ar' ? '🔍 ابحث عن سؤال...' : '🔍 Search questions...';
  var ckTitle = document.getElementById('ckTitle');
  if (ckTitle) ckTitle.textContent = currentLang === 'ar' ? '📖 معلومات عامة — تشخيص المكيفات' : '📖 Common Knowledge — AC Diagnostics';
  renderCommonKnowledge();
  renderRefInfo();
}

// TXV toggle
(function() {
  var txvToggle = document.getElementById('txvToggle');
  var txvOffMsg = document.getElementById('txvOffMsg');
  var scDesc = document.getElementById('scDesc');
  var scContent = document.getElementById('scContent');
  function applyTxvState() {
    if (!txvToggle) return;
    var on = txvToggle.checked;
    if (txvOffMsg) txvOffMsg.style.display = on ? 'none' : 'block';
    if (scDesc) scDesc.style.display = on ? 'block' : 'none';
    if (scContent) scContent.style.display = on ? 'block' : 'none';
  }
  if (txvToggle) txvToggle.addEventListener('change', applyTxvState);
  applyTxvState();
})();

// Event listeners
document.querySelectorAll('.ref-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.ref-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentRef = btn.dataset.ref;
    renderRefInfo();
  });
});

document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'ptchart') renderPTChart();
    if (btn.dataset.tab === 'compare') renderCompareChart();
    if (btn.dataset.tab === 'diagram') renderDiagram();
  });
});

window.addEventListener('resize', function() {
  if (document.getElementById('tab-ptchart').classList.contains('active')) renderPTChart();
  if (document.getElementById('tab-compare').classList.contains('active')) renderCompareChart();
  if (document.getElementById('tab-diagram').classList.contains('active')) renderDiagram();
});

syncPair('diagAmbSlider','diagAmbInput',function(){
  if (document.getElementById('tab-diagram').classList.contains('active')) renderDiagram();
});

// PWA Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(reg) {
    console.log('[PWA] Service Worker registered, scope:', reg.scope);
  }).catch(function(err) {
    console.error('[PWA] Service Worker registration failed:', err);
  });
}

// Initialize
renderRefInfo();
initCalculators();
renderCommonKnowledge();

})();