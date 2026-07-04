// Refrigerant core data - PT charts, operating ranges, components
// PT data: [temperature_F, pressure_PSIG] - converted to Celsius at runtime
window.REFRIGERANTS = {
  r134a: {
    name: "R-134a", type: "HFC (Pure)", safety: "A1 (Non-flammable, low toxicity)",
    gwp: 1430, odp: 0, boilingC: -26.1, criticalTempC: 101.1, criticalPressPsia: 588.7, molWeight: 102.03,
    applications: {en:"Automotive AC, Medium-temp refrigeration, Chillers",ar:"مكيف السيارات، تبريد متوسط الحرارة، مبردات"},
    oil: {en:"PAG 46 / PAG 100 (Automotive), POE (Stationary)",ar:"PAG 46 / PAG 100 (سيارات)، POE (ثابتة)"},
description: {en:"<p>R-134a (1,1,1,2-Tetrafluoroethane) is a pure HFC refrigerant widely used in automotive air conditioning and medium-temperature refrigeration. It has been the standard automotive refrigerant since approximately 1994, now gradually being phased out in favor of R-1234yf in new vehicles. Existing systems continue to use R-134a.</p>",ar:"<p>R-134a (1,1,1,2-رباعي فلورو الإيثان) هو مبرد HFC نقي مستخدم على نطاق وسع في تكييف السيارات والتبريد متوسط الحرارة. كان المبرد القياسي للسيارات منذ حوالي 1994، ويتم الآن استبداله تدريجياً بـ R-1234yf في المركبات الجديدة. الأنظمة الحالية تستمر في استخدام R-134a.</p>"},
    pt: [[-55,-10.0],[-50,-9.2],[-45,-8.3],[-40,-7.3],[-35,-6.1],[-30,-4.8],[-25,-3.4],[-20,-1.8],[-15,0.0],[-10,1.9],[-5,4.1],[0,6.5],[5,9.1],[10,11.9],[15,15.0],[20,18.4],[25,22.1],[30,26.1],[35,30.4],[40,35.0],[45,40.1],[50,45.4],[55,51.2],[60,57.4],[65,64.0],[70,71.1],[75,78.7],[80,86.7],[85,95.2],[90,104.3],[95,113.9],[100,124.2],[105,135.0],[110,146.4],[115,158.4],[120,171.2],[125,184.6],[130,198.7],[135,213.6],[140,229.2],[145,245.7],[150,262.9]],
    operating: [[20,22,120],[25,25,140],[30,28,160],[35,32,180],[40,36,200],[45,40,220]],
    operatingRanges: [
      [18,65,25,35,135,160],[21,70,27,37,150,175],[24,75,29,39,160,190],[27,80,30,40,175,210],[29,85,32,42,185,225],[32,90,33,43,200,240],[35,95,34,44,215,255],[38,100,35,45,230,270],[43,110,36,46,250,290],
      [48,118,37,47,265,310],[52,126,38,48,280,325],[55,131,40,50,290,340]
    ],
    staticPressure: [
      [18,65,50,70],[21,70,60,80],[24,75,70,90],[27,80,80,100],[29,85,90,110],[32,90,100,125],[35,95,115,140],[38,100,130,155],[43,110,160,190],
      [48,118,175,205],[52,126,195,225],[55,131,210,240]
    ],
    superheatTarget: '5–15°F (3–8°C)', subcoolingTarget: '5–12°F (3–7°C)',
    components: {
      lowPressureCutout: {psig: 25, label:{en:'Low Pressure Cut-Out Switch',ar:'مفتاح قطع الضغط المنخفض'}, desc:{en:'Prevents compressor from running when charge is too low (< 25 PSIG)',ar:'يمنع تشغيل الضاغط عندما يكون الشحن منخفضاً جداً (< 25 PSIG)'}},
      highPressureCutout: {psig: 450, label:{en:'High Pressure Cut-Out Switch',ar:'مفتاح قطع الضغط العالي'}, desc:{en:'Trips at ~450 PSIG to protect compressor from overpressure',ar:'يقطع عند ~450 PSIG لحماية الضاغط من الضغط الزائد'}},
      safetyValve: {psig: 550, label:{en:'Safety Relief Valve',ar:'صمام الأمان المُفرّغ'}, desc:{en:'Opens at ~550 PSIG to release pressure — system needs service if this activates',ar:'يفتح عند ~550 PSIG لتفريغ الضغط — النظام يحتاج صيانة إذا تفعّل'}},
      compressorMax: {psig: 500, label:{en:'Compressor Max Working Pressure',ar:'أقصى ضغط عمل للضاغط'}, desc:{en:'Sustained pressure above this damages compressor seals and valves',ar:'الضغط المستمر فوق هذا يضر أختام وصمامات الضاغط'}},
      lowPressureSuctionMin: {psig: 20, label:{en:'Minimum Safe Suction',ar:'أدنى شفط آمن'}, desc:{en:'Below 20 PSIG, oil return to compressor is compromised',ar:'تحت 20 PSIG، عودة الزيت للضاغط تتأثر'}}
    }
  },
  r22: {
    name: "R-22", type: "HCFC (Pure)", safety: "A1 (Non-flammable, low toxicity)",
    gwp: 1810, odp: 0.055, boilingC: -40.8, criticalTempC: 96.1, criticalPressPsia: 723.7, molWeight: 86.47,
    applications: {en:"Legacy AC systems, Legacy refrigeration",ar:"أنظمة تكييف قديمة، تبريد قديم"},
    oil: {en:"Mineral Oil (MO) / Alkylbenzene (AB)",ar:"زيت معدني (MO) / ألكيل بنزين (AB)"},
    description: {en:"<p>R-22 (Chlorodifluoromethane / Freon) is a legacy HCFC refrigerant. <strong>Production and import have been banned in the US since 2020.</strong> Service of existing systems uses reclaimed/recycled R-22 only. If you have an R-22 system, consider retrofitting to a modern alternative.</p>",ar:"<p>R-22 (كلورودي فلوروميثان / فريون) هو مبرد HCFC قديم. <strong>تم حظر الإنتاج والاستيراد في أمريكا منذ 2020.</strong> صيانة الأنظمة الحالية تستخدم R-22 مسترداً/مُعاد تدويره فقط. إذا كان لديك نظام R-22، فكّر في التحويل إلى بديل حديث.</p>"},
    pt: [[-40,0.6],[-35,2.6],[-30,4.9],[-25,7.4],[-20,10.1],[-15,13.2],[-10,16.4],[-5,20.0],[0,23.9],[5,28.2],[10,32.7],[15,37.6],[20,43.0],[25,48.7],[30,54.8],[35,61.5],[40,68.5],[45,76.1],[50,83.9],[55,92.5],[60,101.4],[65,111.2],[70,121.4],[75,132.1],[80,143.8],[85,155.5],[90,168.5],[95,181.6],[100,195.7],[105,210.7],[110,226.2],[115,242.3],[120,259.5],[125,277.0],[130,295.8],[135,314.9],[140,335.3],[145,356.0],[150,377.9]],
    operating: [[20,61,187],[25,64,228],[30,72,276],[35,78,315],[40,87,358],[45,91,395],[50,95,432],[55,99,469]],
    operatingRanges: [
      [18,65,58,68,145,175],[21,70,60,70,170,200],[24,75,62,72,200,240],[27,80,65,75,230,270],[29,85,65,78,250,290],[32,90,68,80,275,320],[35,95,70,82,290,340],[38,100,72,85,310,360],[43,110,75,90,340,390],
      [48,118,78,92,365,410],[52,126,80,95,375,425],[55,131,82,98,390,440]
    ],
    staticPressure: [
      [18,65,80,100],[21,70,95,115],[24,75,110,135],[27,80,120,150],[29,85,135,165],[32,90,150,180],[35,95,165,200],[38,100,180,220],[43,110,215,260],
      [48,118,235,280],[52,126,260,305],[55,131,280,325]
    ],
    superheatTarget: '8–15°F (4–8°C)', subcoolingTarget: '5–12°F (3–7°C)',
    components: {
      lowPressureCutout: {psig: 20, label:{en:'Low Pressure Cut-Out',ar:'مفتاح قطع الضغط المنخفض'}, desc:{en:'Prevents compressor below 20 PSIG',ar:'يمنع تشغيل الضاغط تحت 20 PSIG'}},
      highPressureCutout: {psig: 430, label:{en:'High Pressure Cut-Out',ar:'مفتاح قطع الضغط العالي'}, desc:{en:'Trips at ~430 PSIG',ar:'يقطع عند ~430 PSIG'}},
      safetyValve: {psig: 600, label:{en:'Safety Relief Valve',ar:'صمام الأمان'}, desc:{en:'Opens at ~600 PSIG',ar:'يفتح عند ~600 PSIG'}},
      compressorMax: {psig: 400, label:{en:'Compressor Max',ar:'أقصى ضغط ضاغط'}, desc:{en:'Max working pressure',ar:'أقصى ضغط عمل'}},
      suctionMin: {psig: 15, label:{en:'Min Safe Suction',ar:'أدنى شفط آمن'}, desc:{en:'Below 15 PSIG oil return fails',ar:'تحت 15 PSIG عودة الزيت تتأثر'}}
    }
  },
  r410a: {
    name: "R-410A", type: "HFC Blend (R-32/R-125, 50/50)", safety: "A1 (Non-flammable, low toxicity)",
    gwp: 2088, odp: 0, boilingC: -51.4, criticalTempC: 71.3, criticalPressPsia: 710.9, molWeight: 72.59,
    applications: {en:"Residential AC, Heat pumps, Commercial AC",ar:"تكييف منزلي، مضخات حرارة، تكييف تجاري"},
    oil: {en:"POE (Polyolester) ISO VG 32 or 46",ar:"POE (بولي إيستر) ISO VG 32 أو 46"},
    description: {en:"<p>R-410A is a near-azeotropic HFC blend (50% R-32, 50% R-125) that has been the dominant residential AC refrigerant. It operates at significantly higher pressures than R-22 (~50% higher). Being phased out for new equipment since January 2025 (replaced by R-454B), but existing systems continue to be serviced with R-410A.</p>",ar:"<p>R-410A هو مزيج HFC شبه أزيوتروبي (50% R-32، 50% R-125) كان المبرد السائد للتكييف المنزلي. يعمل بضغوط أعلى بكثير من R-22 (~50% أعلى). يتم استبداله تدريجياً للمعدات الجديدة منذ يناير 2025 (بديله R-454B)، لكن الأنظمة الحالية تستمر في الصيانة بـ R-410A.</p>"},
    pt: [[-50,5.0],[-45,7.7],[-40,10.8],[-35,14.1],[-30,17.8],[-25,21.9],[-20,26.3],[-15,31.2],[-10,36.5],[-5,42.2],[0,48.4],[5,55.2],[10,62.4],[15,70.3],[20,78.7],[25,87.7],[30,97.4],[35,107.7],[40,118.8],[45,130.6],[50,143.1],[55,156.5],[60,170.7],[65,185.8],[70,201.7],[75,218.6],[80,236.5],[85,255.4],[90,275.3],[95,296.4],[100,318.5],[105,341.9],[110,366.5],[115,392.3],[120,419.5],[125,448.0],[130,478.0],[135,509.5],[140,542.6],[145,577.4],[150,613.9]],
    operating: [[20,78,220],[25,87,250],[30,97,285],[35,107,320],[40,118,355],[45,130,390]],
    operatingRanges: [
      [18,65,110,125,200,240],[21,70,112,128,235,265],[24,75,115,130,260,305],[27,80,115,132,290,335],[29,85,118,135,310,360],[32,90,118,135,340,395],[35,95,120,138,370,435],[38,100,120,138,400,465],[43,110,122,142,445,510],
      [48,118,125,145,490,555],[52,126,125,148,520,575],[55,131,128,150,540,585]
    ],
    staticPressure: [
      [18,65,130,155],[21,70,145,175],[24,75,165,195],[27,80,180,215],[29,85,195,235],[32,90,215,260],[35,95,240,290],[38,100,265,320],[43,110,330,385],
      [48,118,430,455],[52,126,445,470],[55,131,475,500]
    ],
    superheatTarget: '8–15°F (4–8°C)', subcoolingTarget: '8–14°F (4–8°C)',
    components: {
      lowPressureCutout: {psig: 50, label:{en:'Low Pressure Cut-Out Switch',ar:'مفتاح قطع الضغط المنخفض'}, desc:{en:'Prevents compressor when charge is too low (< 50 PSIG)',ar:'يمنع تشغيل الضاغط عندما يكون الشحن منخفضاً جداً (< 50 PSIG)'}},
      highPressureCutout: {psig: 650, label:{en:'High Pressure Cut-Out Switch',ar:'مفتاح قطع الضغط العالي'}, desc:{en:'Trips at ~650 PSIG to protect compressor',ar:'يقطع عند ~650 PSIG لحماية الضاغط'}},
      safetyValve: {psig: 750, label:{en:'Safety Relief Valve',ar:'صمام الأمان المُفرّغ'}, desc:{en:'Opens at ~750 PSIG — system needs service if activated',ar:'يفتح عند ~750 PSIG — النظام يحتاج صيانة إذا تفعّل'}},
      compressorMax: {psig: 600, label:{en:'Compressor Max Working Pressure',ar:'أقصى ضغط عمل للضاغط'}, desc:{en:'Sustained pressure above this damages compressor',ar:'الضغط المستمر فوق هذا يضر الضاغط'}},
      lowPressureSuctionMin: {psig: 40, label:{en:'Minimum Safe Suction',ar:'أدنى شفط آمن'}, desc:{en:'Below 40 PSIG, oil return is compromised',ar:'تحت 40 PSIG، عودة الزيت تتأثر'}}
    }
  },
  r32: {
    name: "R-32", type: "HFC (Pure)", safety: "A2L (Mildly flammable, low toxicity)",
    gwp: 675, odp: 0, boilingC: -51.7, criticalTempC: 78.1, criticalPressPsia: 838.7, molWeight: 52.02,
    applications: {en:"Residential AC, Heat pumps, Component of R-410A",ar:"تكييف منزلي، مضخات حرارة، مكوّن R-410A"},
    oil: {en:"POE (Polyolester) ISO VG 32 or 46",ar:"POE (بولي إيستر) ISO VG 32 أو 46"},
    description: {en:"<p>R-32 (Difluoromethane) is a pure HFC refrigerant with a GWP of just 675 — nearly 68% lower than R-410A. It is increasingly used as a standalone refrigerant in modern AC systems. <strong>Safety classification A2L means it is mildly flammable</strong> and requires special handling procedures.</p>",ar:"<p>R-32 (دي فلورو الميثان) هو مبرد HFC نقي بـ GWP فقط 675 — أقل بحوالي 68% من R-410A. يُستخدم بشكل متزايد كمبرد مستقل في أنظمة التكييف الحديثة. <strong>تصنيف السلامة A2L يعني أنه قابل للاشتعال بشكل خفيف</strong> ويحتاج إجراءات تعامل خاصة.</p>"},
    pt: [[-50,5.2],[-45,8.0],[-40,11.0],[-35,14.4],[-30,18.2],[-25,22.3],[-20,26.8],[-15,31.7],[-10,37.1],[-5,42.9],[0,49.3],[5,56.1],[10,63.5],[15,71.4],[20,80.0],[25,89.2],[30,99.1],[35,109.7],[40,121.0],[45,133.0],[50,145.8],[55,159.5],[60,174.0],[65,189.5],[70,205.8],[75,223.2],[80,241.5],[85,260.9],[90,281.3],[95,302.9],[100,325.7],[105,349.6],[110,374.9],[115,401.4],[120,429.3],[125,458.7],[130,489.5],[135,521.8],[140,555.8],[145,591.4],[150,628.8]],
    operating: [[20,80,230],[25,89,260],[30,99,295],[35,109,330],[40,121,365],[45,133,400]],
    operatingRanges: [
      [18,65,115,130,210,255],[21,70,118,132,245,285],[24,75,118,135,270,315],[27,80,120,135,300,350],[29,85,120,138,320,375],[32,90,122,140,350,405],[35,95,122,140,380,445],[38,100,125,142,410,475],[43,110,125,145,455,520],
      [48,118,128,148,495,560],[52,126,128,150,525,585],[55,131,130,155,550,595]
    ],
    staticPressure: [
      [18,65,135,160],[21,70,150,180],[24,75,170,200],[27,80,185,220],[29,85,200,240],[32,90,220,265],[35,95,245,295],[38,100,270,325],[43,110,340,395],
      [48,118,415,435],[52,126,455,480],[55,131,485,510]
    ],
    superheatTarget: '8–15°F (4–8°C)', subcoolingTarget: '8–12°F (4–7°C)',
    components: {
      lowPressureCutout: {psig: 50, label:{en:'Low Pressure Cut-Out Switch',ar:'مفتاح قطع الضغط المنخفض'}, desc:{en:'Prevents compressor when charge is too low (< 50 PSIG)',ar:'يمنع تشغيل الضاغط عندما يكون الشحن منخفضاً جداً (< 50 PSIG)'}},
      highPressureCutout: {psig: 650, label:{en:'High Pressure Cut-Out Switch',ar:'مفتاح قطع الضغط العالي'}, desc:{en:'Trips at ~650 PSIG to protect compressor',ar:'يقطع عند ~650 PSIG لحماية الضاغط'}},
      safetyValve: {psig: 750, label:{en:'Safety Relief Valve',ar:'صمام الأمان المُفرّغ'}, desc:{en:'Opens at ~750 PSIG — system needs service if activated',ar:'يفتح عند ~750 PSIG — النظام يحتاج صيانة إذا تفعّل'}},
      compressorMax: {psig: 600, label:{en:'Compressor Max Working Pressure',ar:'أقصى ضغط عمل للضاغط'}, desc:{en:'Sustained pressure above this damages compressor',ar:'الضغط المستمر فوق هذا يضر الضاغط'}},
      lowPressureSuctionMin: {psig: 40, label:{en:'Minimum Safe Suction',ar:'أدنى شفط آمن'}, desc:{en:'Below 40 PSIG, oil return is compromised',ar:'تحت 40 PSIG، عودة الزيت تتأثر'}}
    }
  }
};