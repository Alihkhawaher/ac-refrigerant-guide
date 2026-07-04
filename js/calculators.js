// calculators.js — Shared utilities and all slider-based calculators
(function() {
'use strict';

// ===== SHARED UTILITIES =====
function fToC(f) { return (f - 32) * 5 / 9; }

function interpolate(ptData, tempC) {
  if (tempC <= ptData[0][0]) return ptData[0][1];
  if (tempC >= ptData[ptData.length-1][0]) return ptData[ptData.length-1][1];
  for (var i = 0; i < ptData.length - 1; i++) {
    if (tempC >= ptData[i][0] && tempC <= ptData[i+1][0]) {
      return ptData[i][1] + (tempC - ptData[i][0]) / (ptData[i+1][0] - ptData[i][0]) * (ptData[i+1][1] - ptData[i][1]);
    }
  }
  return 0;
}

function interpolateReverse(ptData, psig) {
  if (psig <= ptData[0][1]) return ptData[0][0];
  if (psig >= ptData[ptData.length-1][1]) return ptData[ptData.length-1][0];
  for (var i = 0; i < ptData.length - 1; i++) {
    if (psig >= ptData[i][1] && psig <= ptData[i+1][1]) {
      return ptData[i][0] + (psig - ptData[i][1]) / (ptData[i+1][1] - ptData[i][1]) * (ptData[i+1][0] - ptData[i][0]);
    }
  }
  return 0;
}

var LOW_SIDE_CAPS = {'R-22':75, 'R-410A':125, 'R-32':130, 'R-134a':40};

function applyLoSideCap(rg, refName) {
  var loCap = LOW_SIDE_CAPS[refName] || 100;
  if (rg.loMin > loCap) rg.loMin = Math.round(loCap * 0.87);
  if (rg.loMax > loCap) rg.loMax = loCap;
  return rg;
}

function interpRanges(ranges, ambC) {
  var loMin, loMax, hiMin, hiMax;
  if (ambC <= ranges[0][0]) { loMin = ranges[0][2]; loMax = ranges[0][3]; hiMin = ranges[0][4]; hiMax = ranges[0][5]; }
  else if (ambC >= ranges[ranges.length-1][0]) { loMin = ranges[ranges.length-1][2]; loMax = ranges[ranges.length-1][3]; hiMin = ranges[ranges.length-1][4]; hiMax = ranges[ranges.length-1][5]; }
  else {
    for (var i = 0; i < ranges.length - 1; i++) {
      if (ambC >= ranges[i][0] && ambC <= ranges[i+1][0]) {
        var ratio = (ambC - ranges[i][0]) / (ranges[i+1][0] - ranges[i][0]);
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
        var ratio = (ambC - sp[i][0]) / (sp[i+1][0] - sp[i][0]);
        staticMin = Math.round(sp[i][2] + ratio * (sp[i+1][2] - sp[i][2]));
        staticMax = Math.round(sp[i][3] + ratio * (sp[i+1][3] - sp[i][3]));
        break;
      }
    }
  }
  return {min:staticMin, max:staticMax};
}

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

// ===== CALCULATOR UPDATE FUNCTIONS =====

function updatePTFromTemp(refrigerants, currentRef, currentLang, T) {
  var r = refrigerants[currentRef];
  var tempC = parseFloat(document.getElementById('ptTempInput').value);
  if (isNaN(tempC)) return;
  var psig = interpolate(r.pt, tempC);
  document.getElementById('ptRPressure').textContent = psig.toFixed(1);
  var info = document.getElementById('ptPressureInfo');
  var isAr = currentLang === 'ar';
  info.innerHTML = '<div class="alert alert-success py-2 mt-1"><span class="text-sm">' +
    r.name + (isAr ? ' يغلي عند <strong>' : ' boils at <strong>') + tempC.toFixed(1) + '°C</strong>' +
    (isAr ? ' عندما يكون الضغط ' : ' when the pressure is ') + psig.toFixed(1) + ' PSIG.<br>' +
    (isAr ? '• <strong>هواء الفتحة المتوقع:</strong>' : '• <strong>Expected vent air:</strong>') + ' ' + (tempC+2).toFixed(0) + '–' + (tempC+7).toFixed(0) + '°C<br>' +
    (tempC < 0 ? (isAr ? '• ❄️ تحت التجمد — المبخر سيتجمد' : '• ❄️ Below freezing — evaporator will frost') :
     tempC <= 7 ? (isAr ? '• ✅ نطاق المبخر المثالي' : '• ✅ Ideal evaporator range') :
     tempC <= 15 ? (isAr ? '• ⚠️ أدفأ من المثالي' : '• ⚠️ Warmer than ideal') :
     (isAr ? '• 🔴 أدفأ من اللازم' : '• 🔴 Too warm')) + '</span></div>';
}

function updatePTFromPressure(refrigerants, currentRef, currentLang) {
  var r = refrigerants[currentRef];
  var psig = parseFloat(document.getElementById('ptPressInput').value);
  if (isNaN(psig)) return;
  var tempC = interpolateReverse(r.pt, psig);
  document.getElementById('ptRTemp2').textContent = tempC.toFixed(1);
  var isAr = currentLang === 'ar';
  var condOrBoil = psig > 100 ? (isAr ? 'يتكاثف' : 'condenses') : (isAr ? 'يغلي' : 'boils');
  document.getElementById('ptTempInfo').innerHTML = '<div class="alert alert-info py-2 mt-1"><span class="text-sm">' +
    (isAr ? 'عند <strong>' : 'At <strong>') + psig + ' PSIG</strong>, ' + r.name + ' ' + condOrBoil +
    (isAr ? ' عند <strong>' : ' at <strong>') + tempC.toFixed(1) + '°C</strong>.</span></div>';
}

function updateSuperheat(refrigerants, currentRef, currentLang) {
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
  var isAr = currentLang === 'ar';
  if (sh < 0) diag.innerHTML = '<div class="alert alert-error py-2 mt-2"><span class="text-sm">' + (isAr ? '⚠️ <strong>خطر — سوبريتي سالب</strong> — شحن زائد، سائل يصل للضاغط.' : '⚠️ <strong>DANGER — Negative Superheat</strong> — Overcharged, liquid reaching compressor.') + '</span></div>';
  else if (sh < 4) diag.innerHTML = '<div class="alert alert-warning py-2 mt-2"><span class="text-sm">' + (isAr ? '⚠️ <strong>سوبريتي منخفض</strong> — قريب من המלא، خطر الفيضان.' : '⚠️ <strong>Low Superheat</strong> — Near full, risk of flooding.') + '</span></div>';
  else if (sh <= 15) diag.innerHTML = '<div class="alert alert-success py-2 mt-2"><span class="text-sm">' + (isAr ? '✅ <strong>سوبريتي طبيعي</strong> — النظام يعمل بشكل جيد.' : '✅ <strong>Normal Superheat</strong> — System operating well.') + '</span></div>';
  else if (sh <= 25) diag.innerHTML = '<div class="alert alert-warning py-2 mt-2"><span class="text-sm">' + (isAr ? '⚠️ <strong>سوبريتي مرتفع</strong> — شحن ناقص، تبريد ضعيف.' : '⚠️ <strong>High Superheat</strong> — Undercharged, weak cooling.') + '</span></div>';
  else diag.innerHTML = '<div class="alert alert-error py-2 mt-2"><span class="text-sm">' + (isAr ? '🔴 <strong>سوبريتي مرتفع جداً</strong> — شحن ناقص بشكل حاد.' : '🔴 <strong>Very High Superheat</strong> — Severely undercharged.') + '</span></div>';
}

function updateSubcooling(refrigerants, currentRef, currentLang) {
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
  var isAr = currentLang === 'ar';
  if (sc < 0) diag.innerHTML = '<div class="alert alert-error py-2 mt-2"><span class="text-sm">' + (isAr ? '⚠️ <strong>خطر — تبريد تحت تشبع سالب</strong> — شحن ناقص، غاز مبرّد في خط السائل.' : '⚠️ <strong>DANGER — Negative Subcooling</strong> — Undercharged, flash gas in liquid line.') + '</span></div>';
  else if (sc < 3) diag.innerHTML = '<div class="alert alert-warning py-2 mt-2"><span class="text-sm">' + (isAr ? '⚠️ <strong>تبريد تحت تشبع منخفض</strong> — سائل غير كافٍ، شحن ناقص.' : '⚠️ <strong>Low Subcooling</strong> — Not enough liquid, undercharged.') + '</span></div>';
  else if (sc <= 12) diag.innerHTML = '<div class="alert alert-success py-2 mt-2"><span class="text-sm">' + (isAr ? '✅ <strong>تبريد تحت تشبع طبيعي</strong> — شحن صحيح.' : '✅ <strong>Normal Subcooling</strong> — Properly charged.') + '</span></div>';
  else if (sc <= 20) diag.innerHTML = '<div class="alert alert-warning py-2 mt-2"><span class="text-sm">' + (isAr ? '⚠️ <strong>تبريد تحت تشبع مرتفع</strong> — شحن زائد أو انسداد.' : '⚠️ <strong>High Subcooling</strong> — Overcharged or restricted.') + '</span></div>';
  else diag.innerHTML = '<div class="alert alert-error py-2 mt-2"><span class="text-sm">' + (isAr ? '🔴 <strong>تبريد تحت تشبع مرتفع جداً</strong> — شحن زائد بشكل كبير.' : '🔴 <strong>Very High Subcooling</strong> — Significantly overcharged.') + '</span></div>';
}

function updateAmbientAdvisor(refrigerants, currentRef, currentLang, T) {
  var r = refrigerants[currentRef];
  var ambC = parseFloat(document.getElementById('ambTempInput').value);
  if (isNaN(ambC)) return;
  var rg = interpRanges(r.operatingRanges, ambC);
  var sp = interpStatic(r.staticPressure, ambC);
  applyLoSideCap(rg, r.name);
  var loMid = (rg.loMin + rg.loMax) / 2, satTemp = interpolateReverse(r.pt, loMid);
  var hiMid = (rg.hiMin + rg.hiMax) / 2, condSatTemp = interpolateReverse(r.pt, hiMid);
  var heatLevel, heatColor, heatIcon;
  var isAr = currentLang === 'ar';
  if (ambC < 24) { heatLevel = isAr ? 'بارد' : 'Cool'; heatColor = 'oklch(var(--su))'; heatIcon = '❄️'; }
  else if (ambC < 32) { heatLevel = isAr ? 'معتدل' : 'Mild'; heatColor = 'oklch(var(--su))'; heatIcon = '🌤️'; }
  else if (ambC < 40) { heatLevel = isAr ? 'دافئ' : 'Warm'; heatColor = 'oklch(var(--wa))'; heatIcon = '☀️'; }
  else if (ambC < 48) { heatLevel = isAr ? 'حار' : 'Hot'; heatColor = 'oklch(var(--wa))'; heatIcon = '🔥'; }
  else { heatLevel = isAr ? 'شديد (T3)' : 'Extreme (T3)'; heatColor = 'oklch(var(--er))'; heatIcon = '🌡️'; }
  var ambF = (ambC * 9/5 + 32).toFixed(0);
  document.getElementById('ambInfoGrid').innerHTML =
    '<div class="bg-base-300 rounded-lg p-3 border-l-4" style="border-left-color:' + heatColor + '"><div class="text-xs opacity-50 uppercase">' + (isAr?'المحيط':'Ambient') + '</div><div class="font-bold">' + heatIcon + ' ' + ambC + '°C / ' + ambF + '°F</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'مستوى الحرارة':'Heat Level') + '</div><div class="font-bold" style="color:' + heatColor + '">' + heatLevel + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'هواء الفتحة المتوقع':'Expected Vent Air') + '</div><div class="font-bold">' + (satTemp+2).toFixed(0) + '–' + (satTemp+7).toFixed(0) + '°C</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'خط الشفط المتوقع':'Expected Suction Line') + '</div><div class="font-bold">' + (satTemp+5).toFixed(0) + '–' + (satTemp+12).toFixed(0) + '°C</div></div>';
  var pressHtml = '<h3 class="text-lg font-semibold mt-4 mb-2">' + (isAr ? '📊 الضغوط الموصى بها عند ' + ambC + '°C' : '📊 Recommended Pressures at ' + ambC + '°C') + '</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-3">';
  pressHtml += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'المنخفض':'Low Side') + '</div><div class="font-bold">' + rg.loMin + '–' + rg.loMax + ' PSIG</div></div>';
  pressHtml += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'العالي':'High Side') + '</div><div class="font-bold">' + rg.hiMin + '–' + rg.hiMax + ' PSIG</div></div>';
  pressHtml += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'ثابت':'Static (Off)') + '</div><div class="font-bold">' + sp.min + '–' + sp.max + ' PSIG</div></div>';
  pressHtml += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">' + (isAr?'ملف المبخر':'Evaporator Coil') + '</div><div class="font-bold">~' + satTemp.toFixed(0) + '°C</div></div>';
  pressHtml += '</div>';
  document.getElementById('ambPressures').innerHTML = pressHtml;
  var tips = '<div class="alert alert-info mt-4"><div><span class="text-sm font-bold">' + (isAr ? '🔧 توصيات لـ ' + ambC + '°C محيط' : '🔧 Recommendations for ' + ambC + '°C Ambient') + '</span><br><span class="text-sm">';
  if (r.name === 'R-134a') tips += isAr ? '<strong>🚗 ملاحظة نظام السيارة:</strong> ضغط الشفط في السيارات يُنظّم بواسطة TXV أو أنبوب الفتحة الثابتة (25-55 PSIG). الجانب العالي هو الذي يتغير.<br><br>' : '<strong>🚗 Automotive Note:</strong> In cars, suction pressure is regulated by TXV or orifice tube (25-55 PSIG). The high side changes with heat.<br><br>';
  if (ambC < 24) tips += isAr ? '<strong>نصائح الطقس البارد:</strong> الضغوط في نهاية النطاق السفلى — طبيعي. المبخر قد يتجمد إذا كان تدفق الهواء منخفضاً.' : '<strong>Cool Weather Tips:</strong> Pressures at lower end — normal. Evaporator may frost if airflow is low.';
  else if (ambC < 32) tips += isAr ? '<strong>نصائح الطقس المعتدل:</strong> ظروف اختبار مثالية. هواء الفتحة يجب أن يكون بارداً.' : '<strong>Mild Weather:</strong> Ideal testing conditions. Vent air should be noticeably cold.';
  else if (ambC < 40) tips += isAr ? '<strong>نصائح الطقس الدافئ:</strong> تأكد من تدفق هواء المكثف ونظّف ألواحه.' : '<strong>Warm Weather:</strong> Ensure condenser airflow is good. Clean condenser fins.';
  else if (ambC < 48) tips += isAr ? '<strong>نصائح الطقس الحار:</strong> لا تشحن تحت أشعة الشمس المباشرة.' : '<strong>Hot Weather:</strong> Do not charge in direct sunlight.';
  else tips += isAr ? '<strong>🔥 حرارة شيدة:</strong> الضغوط العالية طبيعية. لا تضف مبرد ظناً أن الضغط العالي = شحن زائد.' : '<strong>🔥 Extreme Heat:</strong> High pressures are NORMAL. Do NOT add refrigerant thinking high pressure = overcharge.';
  tips += '</span></div></div>';
  document.getElementById('ambTips').innerHTML = tips;
}

function updateCalcRanges(refrigerants, currentRef) {
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
  document.querySelectorAll('.calc-ref-name2').forEach(function(el) { el.textContent = r.name; });
}

function initCalculators(refrigerants, currentRef, currentLang, T) {
  // Use window getters to read live state (not stale closures)
  function wrap(fn) {
    return function() { fn(window.getRefrigerants(), window.getCurrentRef(), window.getCurrentLang(), T); };
  }
  syncPair('ptSliderTemp', 'ptTempInput', wrap(updatePTFromTemp));
  syncPair('ptSliderPress', 'ptPressInput', wrap(updatePTFromPressure));
  syncPair('ambSliderTemp', 'ambTempInput', wrap(updateAmbientAdvisor));
  syncPair('shSliderPressure', 'shPressure', wrap(updateSuperheat));
  syncPair('shSliderTemp', 'shActualTemp', wrap(updateSuperheat));
  syncPair('scSliderPressure', 'scPressure', wrap(updateSubcooling));
  syncPair('scSliderTemp', 'scActualTemp', wrap(updateSubcooling));
}

// ===== SYSTEM CALCULATOR =====
function calcSystem(refrigerants, currentRef, currentLang) {
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
  box.classList.remove('hidden');
  box.innerHTML = '<div class="text-xs opacity-50">' + (isAr ? 'قدرة التبريد المطلوبة' : 'Required Cooling Capacity') + '</div>' +
    '<div class="text-3xl font-bold text-primary">' + totalBTU.toLocaleString() + ' <span class="text-sm font-normal opacity-60">BTU/h</span></div>' +
    '<div class="text-sm opacity-60 mt-1">≈ ' + tons + ' ' + (isAr ? 'طن' : 'Tons') + ' | ' + area.toFixed(0) + ' m² | ' + volume.toFixed(0) + ' m³</div>' +
    '<h3 class="text-lg font-semibold mt-4 mb-2">🔧 ' + r.name + ' ' + (isAr ? 'مواصفات النظام' : 'System Specifications') + '</h3>' +
    '<div class="grid grid-cols-2 md:grid-cols-3 gap-3">' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'المنخفض' : 'Low Side') + '</div><div class="font-bold">' + rg.loMin + '–' + rg.loMax + ' PSIG</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'العالي' : 'High Side') + '</div><div class="font-bold">' + rg.hiMin + '–' + rg.hiMax + ' PSIG</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'أنبوب الشفط' : 'Suction Pipe') + '</div><div class="font-bold">' + suctionPipe + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'أنبوب السائل' : 'Liquid Pipe') + '</div><div class="font-bold">' + liquidPipe + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">RLA</div><div class="font-bold">' + rla + '</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">LRA</div><div class="font-bold">' + lra + '</div></div>' +
    '</div>';
}

function calcDevice(refrigerants, currentRef, currentLang, DEVICE_DATA) {
  var isAr = currentLang === 'ar';
  var btu = parseInt(document.getElementById('sysBTUSelect').value);
  var sysType = document.getElementById('sysType').value;
  var r = refrigerants[currentRef];
  var tons = (btu / 12000);
  var d = DEVICE_DATA[btu] || DEVICE_DATA[18000];
  var sp = sysType === 'minisplit' ? d.minisplit : {suct: d.suctPipe, liq: d.liqPipe};
  var chargeKey = r.name === 'R-410A' ? 'chargeR410A' : r.name === 'R-32' ? 'chargeR32' : 'chargeR134a';
  var charge = d[chargeKey] || d.chargeR410A;
  var rg = interpRanges(r.operatingRanges, 35);
  applyLoSideCap(rg, r.name);
  var sysLabel = sysType === 'minisplit' ? 'Mini-Split' : sysType === 'package' ? 'Packaged Unit' : 'Split System';
  var html = '<h3 class="text-lg font-semibold mb-2">📋 ' + (isAr ? 'مواصفات المكوّنات — ' : 'Component Spec — ') + btu.toLocaleString() + ' BTU/h (' + tons.toFixed(1) + ' ' + (isAr ? 'طن' : 'Ton') + ') ' + sysLabel + '</h3>';
  html += '<h4 class="text-accent font-semibold mt-3 mb-2">' + (isAr ? '🔧 الضاغط' : '🔧 Compressor') + '</h4>';
  html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'النوع' : 'Type') + '</div><div class="font-bold">' + d.comp + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">RLA</div><div class="font-bold">' + d.rla + ' A</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">LRA</div><div class="font-bold">' + d.lra + ' A</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'الوزن' : 'Weight') + '</div><div class="font-bold">' + d.weight + ' kg</div></div>';
  html += '</div>';
  html += '<h4 class="text-accent font-semibold mt-3 mb-2">' + (isAr ? '🔌 كهربائي' : '🔌 Electrical') + '</h4>';
  html += '<div class="grid grid-cols-2 md:grid-cols-3 gap-3">';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'الجهد' : 'Voltage') + '</div><div class="font-bold">' + d.voltage + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'الأسلاك' : 'Wire') + '</div><div class="font-bold">' + d.wire + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'القاطع' : 'Breaker') + '</div><div class="font-bold">' + d.breaker + ' A</div></div>';
  html += '</div>';
  html += '<h4 class="text-accent font-semibold mt-3 mb-2">' + (isAr ? '🔗 أنابيب' : '🔗 Piping') + '</h4>';
  html += '<div class="grid grid-cols-2 md:grid-cols-3 gap-3">';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'شفط' : 'Suction') + '</div><div class="font-bold">' + sp.suct + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'سائل' : 'Liquid') + '</div><div class="font-bold">' + sp.liq + '</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'الشحن' : 'Charge') + '</div><div class="font-bold">' + charge + ' lbs</div></div>';
  html += '</div>';
  html += '<h4 class="text-accent font-semibold mt-3 mb-2">' + (isAr ? '🌡️ ضغوط التشغيل (35°C)' : '🌡️ Operating Pressures (35°C)') + '</h4>';
  html += '<div class="grid grid-cols-2 gap-3">';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'منخفض' : 'Low Side') + '</div><div class="font-bold">' + rg.loMin + '–' + rg.loMax + ' PSIG</div></div>';
  html += '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr ? 'عالي' : 'High Side') + '</div><div class="font-bold">' + rg.hiMin + '–' + rg.hiMax + ' PSIG</div></div>';
  html += '</div>';
  document.getElementById('deviceResult').innerHTML = html;
  document.getElementById('sysResult').classList.add('hidden');
}

// ===== EXPOSE ON WINDOW =====
window.Calculators = {
  fToC: fToC,
  interpolate: interpolate,
  interpolateReverse: interpolateReverse,
  applyLoSideCap: applyLoSideCap,
  interpRanges: interpRanges,
  interpStatic: interpStatic,
  syncPair: syncPair,
  initCalculators: initCalculators,
  updateCalcRanges: updateCalcRanges,
  updatePTFromTemp: updatePTFromTemp,
  updatePTFromPressure: updatePTFromPressure,
  updateSuperheat: updateSuperheat,
  updateSubcooling: updateSubcooling,
  updateAmbientAdvisor: updateAmbientAdvisor,
  calcSystem: calcSystem,
  calcDevice: calcDevice
};

})();