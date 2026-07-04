// diagram.js — SVG system diagram with zoom/pan/drag interactions
(function() {
'use strict';

var _diagScale = 1, _diagPanX = 0, _diagPanY = 0;
var _diagCompData = {};
var _diagEventsAttached = false;
var _compDragKey = null, _compDragOffX = 0, _compDragOffY = 0;
var _compPosMap = {EVAPORATOR:'evap',EVAPFAN:'evapFan',COMPRESSOR:'comp',CONDENSER:'cond',CONDFAN:'condFan',TXV:'txv'};
var _pos = {evap:{x:50,y:90},evapFan:{x:80,y:25},comp:{x:440,y:80},cond:{x:440,y:310},condFan:{x:500,y:245},txv:{x:130,y:370}};

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

function renderDiagram(refrigerants, currentRef, currentLang) {
  var Calc = window.Calculators;
  var r = refrigerants[currentRef];
  var isAr = currentLang === 'ar';
  var ambC = parseFloat(document.getElementById('diagAmbInput').value) || 35;
  var rg = Calc.interpRanges(r.operatingRanges, ambC);
  Calc.applyLoSideCap(rg, r.name);
  var loMid = (rg.loMin+rg.loMax)/2, hiMid = (rg.hiMin+rg.hiMax)/2;
  var evapT = Math.round(Calc.interpolateReverse(r.pt, loMid));
  var condT = Math.round(Calc.interpolateReverse(r.pt, hiMid));

  document.getElementById('diagInfoGrid').innerHTML =
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr?'المحيط':'Ambient') + '</div><div class="font-bold">' + ambC + '°C</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-accent"><div class="text-xs opacity-50">' + (isAr?'منخفض':'Low Side') + '</div><div class="font-bold">' + rg.loMin + '-' + rg.loMax + ' PSIG</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-error"><div class="text-xs opacity-50">' + (isAr?'عالي':'High Side') + '</div><div class="font-bold">' + rg.hiMin + '-' + rg.hiMax + ' PSIG</div></div>' +
    '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50">' + (isAr?'المبرد':'Refrigerant') + '</div><div class="font-bold">' + r.name + '</div></div>';

  var compData = {
    EVAPORATOR: {title:isAr?'مبخر':'Evaporator',lines:isAr?[r.name+' يتبخر ماصاً للحرارة. الضغط: '+rg.loMin+'-'+rg.loMax+' PSIG','هدف السوبريتي: '+r.superheatTarget]:['Low-pressure '+r.name+' evaporates, absorbing heat.','Pressure: '+rg.loMin+'-'+rg.loMax+' PSIG','Superheat target: '+r.superheatTarget]},
    COMPRESSOR: {title:isAr?'ضاغط':'Compressor',lines:isAr?['بخار منخفض الضغط يُضغط إلى عالي الضغط والحرارة.','شفط: '+rg.loMin+'-'+rg.loMax+' | تفريغ: '+rg.hiMin+'-'+rg.hiMax+' PSIG']:['Low-pressure vapor compressed to high-pressure, high-temp.','Suction: '+rg.loMin+'-'+rg.loMax+' | Discharge: '+rg.hiMin+'-'+rg.hiMax+' PSIG']},
    CONDENSER: {title:isAr?'مكثف':'Condenser',lines:isAr?[r.name+' يتكاثف إلى سائل طارداً الحرارة.','الضغط: '+rg.hiMin+'-'+rg.hiMax+' PSIG','هدف التبريد تحت التشبع: '+r.subcoolingTarget]:[r.name+' vapor condenses into liquid, releasing heat.','Pressure: '+rg.hiMin+'-'+rg.hiMax+' PSIG','Subcooling target: '+r.subcoolingTarget]},
    TXV: {title:isAr?'صمام تمديد':'TXV / Expansion Valve',lines:isAr?['سائل عالي الضغط يمر عبر الفتحة منخفضاً الضغط.','الانخفاض: '+rg.hiMin+'-'+rg.hiMax+' > '+rg.loMin+'-'+rg.loMax+' PSIG']:['High-pressure liquid passes through orifice, dropping pressure.','Drop: '+rg.hiMin+'-'+rg.hiMax+' > '+rg.loMin+'-'+rg.loMax+' PSIG']},
    EVAPFAN: {title:isAr?'مروحة مبخر':'Evaporator Fan',lines:isAr?['يدفع الهواء عبر ملف المبخر البارد']:['Forces air across cold evaporator coil']},
    CONDFAN: {title:isAr?'مروحة مكثف':'Condenser Fan',lines:isAr?['تسحب الهواء الخارجي عبر ملف المكثف الساخن']:['Pulls outdoor air across hot condenser coil']}
  };
  _diagCompData = compData;

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
  var dischargeT = Math.round(Calc.interpolateReverse(r.pt, hiMid));

  function box(x,y,w,h,fill,stroke,id) { return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" ry="8" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2" class="diag-comp" data-comp="'+id+'" style="cursor:move;"/>'; }
  function fan(x,y,w,h,fill,stroke,id) {
    var cx=x+w/2, cy=y+18, rad=14;
    var s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" ry="8" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2" class="diag-comp" data-comp="'+id+'" style="cursor:move;"/>';
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+rad+'" fill="none" stroke="'+stroke+'" stroke-width="1.5" pointer-events="none"/>';
    s+='<g class="fan-blades" style="transform-origin:'+cx+'px '+cy+'px;" pointer-events="none">';
    for(var i=0;i<5;i++) s+='<ellipse cx="'+cx+'" cy="'+(cy-7)+'" rx="3.5" ry="7" fill="'+stroke+'" opacity="0.6" transform="rotate('+(i*72)+' '+cx+' '+cy+')" pointer-events="none"/>';
    s+='</g><circle cx="'+cx+'" cy="'+cy+'" r="2.5" fill="'+stroke+'" pointer-events="none"/>';
    return s;
  }
  function coil(x,y,w,h,color,id) {
    var s=box(x,y,w,h,'#0d2137',color,id);
    s+='<g class="coil-pattern" pointer-events="none">';
    var cy=y+h/2+8, amp=10, segs=8, segW=(w-20)/segs;
    var path='M'+(x+10)+' '+cy;
    for(var i=0;i<segs;i++){var px=x+10+segW*(i+1);path+=' L'+(px-segW/2)+' '+(cy-amp)+' L'+px+' '+cy;}
    s+='<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="1.5" opacity="0.4" pointer-events="none"/></g>';
    return s;
  }
  function compressor(x,y,w,h,fill,stroke,id) {
    var cx=x+w/2, cy=y+h/2-5;
    var s=box(x,y,w,h,fill,stroke,id);
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="22" fill="none" stroke="'+stroke+'" stroke-width="1.5" opacity="0.5" pointer-events="none"/>';
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="14" fill="none" stroke="'+stroke+'" stroke-width="1" opacity="0.3" pointer-events="none"/>';
    s+='<path d="M'+(cx-8)+' '+(cy-8)+' L'+(cx+8)+' '+cy+' L'+(cx-8)+' '+(cy+8)+' Z" fill="'+stroke+'" opacity="0.3" pointer-events="none"/>';
    return s;
  }
  function txt(x,y,t,sz,c) { return '<text x="'+x+'" y="'+y+'" fill="'+(c||'#e0e8f0')+'" font-size="'+(sz||11)+'" font-weight="bold" text-anchor="middle" pointer-events="none">'+t+'</text>'; }
  function linelbl(x,y,lbl,sub,c) { return '<g><rect x="'+(x-55)+'" y="'+(y-12)+'" width="110" height="28" rx="4" fill="#0a1520" stroke="#2a3a4a" stroke-width="1" opacity="0.95"/><text x="'+x+'" y="'+(y+1)+'" fill="'+c+'" font-size="8" font-weight="bold" text-anchor="middle">'+lbl+'</text><text x="'+x+'" y="'+(y+11)+'" fill="'+c+'" font-size="7" text-anchor="middle" opacity="0.7">'+sub+'</text></g>'; }

  var svg='<svg id="diagramSVG" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#0a1520;border-radius:8px;">';
  svg+='<defs><marker id="arrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#00b4d8"/></marker><marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#e63946"/></marker><marker id="arrowO" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#f4a261"/></marker><marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#2a9d8f"/></marker></defs>';
  // Background panels
  svg+='<rect x="10" y="10" width="'+(wallX-15)+'" height="420" rx="10" fill="#071520" stroke="#1a3050"/>';
  svg+='<rect x="'+wallX+'" y="10" width="'+wallW+'" height="420" fill="#2a3a4a"/>';
  svg+='<text x="'+(wallX+wallW/2)+'" y="220" fill="#6a7a8a" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(-90,'+(wallX+wallW/2)+',220)">'+(isAr?'الجدار':'WALL')+'</text>';
  svg+='<rect x="'+(wallX+wallW+5)+'" y="10" width="'+(W-wallX-wallW-15)+'" height="420" rx="10" fill="#151008" stroke="#3a3020"/>';
  svg+='<text x="'+((wallX-15)/2+10)+'" y="30" fill="#1a4060" font-size="13" font-weight="bold" text-anchor="middle">'+(isAr?'الوحدة الداخلية':'INDOOR')+'</text>';
  svg+='<text x="'+((wallX+wallW+5+W)/2)+'" y="30" fill="#6a5030" font-size="13" font-weight="bold" text-anchor="middle">'+(isAr?'الوحدة الخارجية':'OUTDOOR')+'</text>';
  // Pipes
  svg+='<path d="M'+sX1+' '+sY1+' L'+(wallX+wallW+10)+' '+sY1+' L'+(wallX+wallW+10)+' '+sY2+' L'+sX2+' '+sY2+'" fill="none" stroke="#00b4d8" stroke-width="3" marker-end="url(#arrowB)"/>';
  svg+='<path d="M'+dX1+' '+dY1+' L'+dX1+' '+(dY1+30)+' L'+dX2+' '+(dY1+30)+' L'+dX2+' '+dY2+'" fill="none" stroke="#e63946" stroke-width="3" marker-end="url(#arrowR)"/>';
  svg+='<path d="M'+lX1+' '+lY1+' L'+(lX1-30)+' '+lY1+' L'+(lX1-30)+' '+lY2+' L'+lX2+' '+lY2+'" fill="none" stroke="#f4a261" stroke-width="3" stroke-dasharray="8,4" marker-end="url(#arrowO)"/>';
  svg+='<path d="M'+tX1+' '+tY1+' L'+(tX1-30)+' '+tY1+' L'+(tX1-30)+' '+(tY2+15)+' L'+tX2+' '+(tY2+15)+' L'+tX2+' '+tY2+'" fill="none" stroke="#2a9d8f" stroke-width="3" stroke-dasharray="8,4" marker-end="url(#arrowG)"/>';
  // Animated flow
  svg+='<path class="pipe-flow" d="M'+sX1+' '+sY1+' L'+(wallX+wallW+10)+' '+sY1+' L'+(wallX+wallW+10)+' '+sY2+' L'+sX2+' '+sY2+'" fill="none" stroke="#00b4d8" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  svg+='<path class="pipe-flow" d="M'+dX1+' '+dY1+' L'+dX1+' '+(dY1+30)+' L'+dX2+' '+(dY1+30)+' L'+dX2+' '+dY2+'" fill="none" stroke="#e63946" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  svg+='<path class="pipe-flow" d="M'+lX1+' '+lY1+' L'+(lX1-30)+' '+lY1+' L'+(lX1-30)+' '+lY2+' L'+lX2+' '+lY2+'" fill="none" stroke="#f4a261" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  svg+='<path class="pipe-flow" d="M'+tX1+' '+tY1+' L'+(tX1-30)+' '+tY1+' L'+(tX1-30)+' '+(tY2+15)+' L'+tX2+' '+(tY2+15)+' L'+tX2+' '+tY2+'" fill="none" stroke="#2a9d8f" stroke-width="2" stroke-dasharray="6,18" opacity="0.7" pointer-events="none"/>';
  // Airflow arrows
  svg+='<g pointer-events="none" opacity="0.5"><path d="M'+(evap.x-25)+' '+(evap.y+30)+' L'+(evap.x-5)+' '+(evap.y+30)+'" stroke="#e63946" stroke-width="1.5" marker-end="url(#arrowR)"/><text x="'+(evap.x-28)+'" y="'+(evap.y+25)+'" fill="#e63946" font-size="6" text-anchor="end">'+(isAr?'دافئ':'Warm')+'</text></g>';
  svg+='<g pointer-events="none" opacity="0.5"><path d="M'+(evap.x+evap.w+5)+' '+(evap.y+30)+' L'+(evap.x+evap.w+25)+' '+(evap.y+30)+'" stroke="#00b4d8" stroke-width="1.5" marker-end="url(#arrowB)"/><text x="'+(evap.x+evap.w+28)+'" y="'+(evap.y+25)+'" fill="#00b4d8" font-size="6">'+(isAr?'بارد':'Cold')+'</text></g>';
  svg+='<g pointer-events="none" opacity="0.5"><path d="M'+(cond.x+cond.w+5)+' '+(cond.y+30)+' L'+(cond.x+cond.w+25)+' '+(cond.y+30)+'" stroke="#e63946" stroke-width="1.5" marker-end="url(#arrowR)"/><text x="'+(cond.x+cond.w+28)+'" y="'+(cond.y+25)+'" fill="#e63946" font-size="6">'+(isAr?'حار':'Hot')+'</text></g>';
  // Components
  svg+=fan(evapFan.x,evapFan.y,evapFan.w,evapFan.h,'#0a1a2a','#4488aa','EVAPFAN');
  svg+=coil(evap.x,evap.y,evap.w,evap.h,'#00b4d8','EVAPORATOR');
  svg+=compressor(comp.x,comp.y,comp.w,comp.h,'#2a1a1a','#e63946','COMPRESSOR');
  svg+=coil(cond.x,cond.y,cond.w,cond.h,'#f4a261','CONDENSER');
  svg+=fan(condFan.x,condFan.y,condFan.w,condFan.h,'#2a1a0a','#aa6633','CONDFAN');
  svg+=box(txv.x,txv.y,txv.w,txv.h,'#1a2a1a','#2a9d8f','TXV');
  // Labels
  svg+=txt(evapFan.x+evapFan.w/2,evapFan.y+42,isAr?'مروحة مبخر':'EVAP FAN',8,'#4488aa');
  svg+=txt(evap.x+evap.w/2,evap.y+30,isAr?'مبخر':'EVAPORATOR',13,'#00b4d8');
  svg+=txt(evap.x+evap.w/2,evap.y+52,isAr?'ملف داخلي':'Indoor Coil',10,'#8899aa');
  svg+=txt(evap.x+evap.w/2,evap.y+72,'~'+evapT+'\u00B0C',10,'#00b4d8');
  svg+=txt(evap.x+evap.w/2,evap.y+88,rg.loMin+'-'+rg.loMax+' PSIG',9,'#00b4d8');
  svg+=txt(comp.x+comp.w/2,comp.y+25,isAr?'ضاغط':'COMPRESSOR',12,'#e63946');
  svg+=txt(comp.x+comp.w/2,comp.y+44,isAr?'سكرول':'Scroll',9,'#8899aa');
  svg+=txt(comp.x+comp.w/2,comp.y+60,'~'+dischargeT+'\u00B0C',8,'#e63946');
  svg+=txt(cond.x+cond.w/2,cond.y+30,isAr?'مكثف':'CONDENSER',13,'#f4a261');
  svg+=txt(cond.x+cond.w/2,cond.y+52,isAr?'ملف خارجي':'Outdoor Coil',10,'#8899aa');
  svg+=txt(cond.x+cond.w/2,cond.y+72,'~'+condT+'\u00B0C',10,'#f4a261');
  svg+=txt(cond.x+cond.w/2,cond.y+88,rg.hiMin+'-'+rg.hiMax+' PSIG',9,'#f4a261');
  svg+=txt(txv.x+txv.w/2,txv.y+20,'TXV',12,'#2a9d8f');
  svg+=txt(txv.x+txv.w/2,txv.y+36,isAr?'تمديد':'Metering',8,'#8899aa');
  svg+=txt(condFan.x+condFan.w/2,condFan.y+42,isAr?'مروحة مكثف':'COND FAN',8,'#aa6633');
  // Pipe labels
  svg+=linelbl(sMidX,sY1-35,isAr?'خط الشفط':'Suction Line',isAr?'(بخار)':'(Vapor)','#00b4d8');
  svg+=linelbl(dX2+50,(dY1+dY2)/2,isAr?'خط التفريغ':'Discharge Line',isAr?'(بخار ساخن)':'(Hot Vapor)','#e63946');
  svg+=linelbl(((lX1-30)+lX2)/2,lY1+25,isAr?'خط السائل':'Liquid Line',isAr?'(مبرد تحت التشبع)':'(Subcooled)','#f4a261');
  svg+=linelbl(tX1-30,(tY1+tY2)/2,isAr?'بعد TXV':'After TXV',isAr?'(خليط ضغط منخفض)':'(Low P Mix)','#2a9d8f');
  // State annotations
  svg+='<text x="'+(sX1+13)+'" y="'+(sY1+6)+'" fill="#5599bb" font-size="7">'+(isAr?'بخار مُسخّن':'Superheated Vapor')+'</text>';
  svg+='<text x="'+(dX1+13)+'" y="'+(dY1+56)+'" fill="#bb5555" font-size="7">'+(isAr?'بخار ساخن':'Hot Superheated Vapor')+'</text>';
  svg+='<text x="'+(lX1+13)+'" y="'+(lY1+4)+'" fill="#bb8833" font-size="7">'+(isAr?'سائل مُبرد':'Subcooled Liquid')+'</text>';
  svg+='<text x="'+(tX2+13)+'" y="'+(tY2+41)+'" fill="#448877" font-size="7">'+(isAr?'خليط رطب':'Wet Mixture')+'</text>';
  // Cycle footer
  svg+='<text x="'+(W/2)+'" y="'+(bgH+8)+'" fill="#556677" font-size="10" text-anchor="middle">'+(isAr?'الدورة: مبخر > ضاغط > مكثف > TXV > مبخر':'Cycle: Evaporator > Compressor > Condenser > TXV > Evaporator')+'</text>';
  // Legend
  var legY=bgH+20;
  svg+='<rect x="20" y="'+legY+'" width="'+(W-40)+'" height="30" rx="5" fill="#0d1a2a" stroke="#2a3a4a" opacity="0.95"/>';
  svg+='<circle cx="35" cy="'+(legY+15)+'" r="5" fill="#2a9d8f" stroke="#fff" stroke-width="1.5"/>';
  svg+='<text x="45" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'1: مدخل مبخر':'1: Evap Inlet')+'</text>';
  svg+='<circle cx="210" cy="'+(legY+15)+'" r="5" fill="#00b4d8" stroke="#fff" stroke-width="1.5"/>';
  svg+='<text x="220" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'2: خروج مبخر':'2: Evap Outlet')+'</text>';
  svg+='<circle cx="390" cy="'+(legY+15)+'" r="5" fill="#e63946" stroke="#fff" stroke-width="1.5"/>';
  svg+='<text x="400" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'3: خروج ضاغط':'3: Comp Outlet')+'</text>';
  svg+='<circle cx="550" cy="'+(legY+15)+'" r="5" fill="#f4a261" stroke="#fff" stroke-width="1.5"/>';
  svg+='<text x="560" y="'+(legY+19)+'" fill="#aabbcc" font-size="8" font-weight="bold">'+(isAr?'4: خروج مكثف':'4: Cond Outlet')+'</text>';
  svg+='</svg>';

  document.getElementById('jointDiagram').innerHTML = svg;
  applyDiagramTransform();

  // Interactions
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
          if (curSvg) { var r2 = curSvg.getBoundingClientRect(); _compDragOffX = (e.clientX-r2.left)/r2.width*W - _pos[posKey].x; _compDragOffY = (e.clientY-r2.top)/r2.height*H - _pos[posKey].y; }
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
        var r2 = curSvg.getBoundingClientRect();
        _pos[_compDragKey].x = Math.max(0, Math.min(W-80, (e.clientX-r2.left)/r2.width*W - _compDragOffX));
        _pos[_compDragKey].y = Math.max(0, Math.min(H-50, (e.clientY-r2.top)/r2.height*H - _compDragOffY));
        renderDiagram(window.getRefrigerants(), window.getCurrentRef(), window.getCurrentLang());
      } else if (_isPanning) { _diagPanX = e.clientX - _panStartX; _diagPanY = e.clientY - _panStartY; applyDiagramTransform(); }
    });
    document.addEventListener('mouseup', function() { if (_compDragKey) { _compDragKey = null; renderDiagram(window.getRefrigerants(), window.getCurrentRef(), window.getCurrentLang()); } _isPanning = false; container.style.cursor = 'grab'; });
    container.addEventListener('click', function(e) {
      if (_compDragKey) return;
      var t = e.target, key = null;
      while (t && t !== container) { if (t.getAttribute && t.getAttribute('data-comp')) { key = t.getAttribute('data-comp'); break; } t = t.parentElement; }
      if (key && _diagCompData[key]) {
        var d = _diagCompData[key];
        var detail = document.getElementById('diagDetail');
        detail.classList.remove('hidden');
        detail.innerHTML = '<strong class="text-primary">' + d.title + '</strong><br>' + d.lines.join('<br>');
      }
    });
  }
}

window.Diagram = {
  renderDiagram: renderDiagram,
  diagZoom: diagZoom,
  diagReset: diagReset
};

})();