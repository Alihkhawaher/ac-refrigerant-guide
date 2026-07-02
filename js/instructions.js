// Per-refrigerant instructions (EN/AR HTML)
window.INSTRUCTIONS = {
  r134a: {
    en: `
      <div class="warn-box danger"><div class="title">⚠️ Safety First</div><p>Wear safety glasses and gloves. R-134a can cause frostbite. Never connect to the high-pressure port with a DIY can — the can can explode.</p></div>
      <div class="instructions">
        <div class="step"><strong>Locate the Low-Pressure Service Port.</strong> Open the hood. The low-pressure port is on the larger diameter aluminum tube, usually capped in <strong>blue or black</strong> and marked with an <strong>"L"</strong>. The high-pressure port is on the smaller tube, capped in red/black, marked <strong>"H"</strong>. Only connect to the low-pressure port.</div>
        <div class="step"><strong>Connect the gauge and refrigerant.</strong> Screw the charging hose onto the R-134a can. Connect the quick-disconnect fitting to the low-pressure port. Do not puncture the can yet.</div>
        <div class="step"><strong>Start the vehicle and AC.</strong> Start the engine, let it idle. Set AC to Maximum Cold, blower to Highest speed, turn on Recirculation mode. Open car doors/windows for ventilation.</div>
        <div class="step"><strong>Puncture the can and monitor pressure.</strong> Squeeze the trigger to puncture the seal. Add refrigerant in short bursts (5–10 seconds), releasing between bursts to let pressure stabilize. Keep the can <strong>upright</strong> to add gas, not liquid.</div>
        <div class="step"><strong>Check the pressure chart.</strong> Use the PT chart on this page. At 25°C ambient, low-side should be roughly 35–45 PSIG. At 35°C+, expect 40–50 PSIG. Add until the gauge enters the optimal range.</div>
        <div class="step"><strong>Check vent temperature.</strong> Place a thermometer in the center vent. A properly charged system should blow 2°C–7°C. Listen for short-cycling (compressor clicking on/off rapidly) — this indicates low charge, overcharge, or a failing pressure switch.</div>
        <div class="step"><strong>Disconnect and finish.</strong> Stop when pressure is correct. Close the valve to trap remaining refrigerant. Quickly disconnect from the low-pressure port. Replace the dust cap. <strong>Do not overcharge</strong> — it's better to be slightly undercharged.</div>
      </div>
      <div class="warn-box"><div class="title">🔧 Troubleshooting</div>
      <p style="font-size:0.88em;"><strong>Compressor won't engage:</strong> If pressure is below ~20 PSIG, the low-pressure safety switch prevents compressor startup. Add a small amount to raise pressure above the switch threshold.<br>
      <strong>System leaking:</strong> If the system was empty or needs frequent recharging, there's a leak. R-134a kits may include UV dye or chemical sealant.<br>
      <strong>Environmental warning:</strong> Venting R-134a is illegal in many jurisdictions. Only add what the system needs.</p></div>`,
    ar: `
      <div class="warn-box danger"><div class="title">⚠️ السلامة أولاً</div><p>ارتدِ نظارات وقفازات السلامة. R-134a يمكن أن يسبب تجمداً. لا توصّل أبداً بمنفذ الضغط العالي مع عبوة DIY — العبوة قد تنفجر.</p></div>
      <div class="instructions">
        <div class="step"><strong>حدد منفذ الخدمة منخفض الضغط.</strong> افتح غطاء المحرك. منفذ الضغط المنخفض على الأنبوب الألومنيومي ذي القطر الأكبر، عادة مغطى بـ<strong>أزرق أو أسود</strong> ومُعلّم بحرف <strong>"L"</strong>. منفذ الضغط العالي على الأنبوب الأصغر، مغطى بأحمر/أسود، مُعلّم <strong>"H"</strong>. وصّل فقط بمنفذ الضغط المنخفض.</div>
        <div class="step"><strong>وصّل المانومتر والمبرد.</strong> اربط خرطوم الشحن على عبوة R-134a. وصّل وصلة الفصل السريع بمنفذ الضغط المنخفض. لا تخترق العبوة بعد.</div>
        <div class="step"><strong>شغّل السيارة والمكيف.</strong> أشغّل المحرك واتركه يدور على الخامل. اضبط المكيف على أقصى تبريد، المروحة على أعلى سرعة، شغّل وضع إعادة التدوير. افتح أبواب/نوافذ السيارة للتهوية.</div>
        <div class="step"><strong>اخترق العبوة وراقب الضغط.</strong> اضغط الزناد لاختام الإحكام. أضف المبرد على دفعات قصيرة (5-10 ثوانٍ)، مع التوقف بين الدفعات لاستقرار الضغط. ابقِ العبوة <strong>عمودية</strong> لإضافة غاز وليس سائل.</div>
        <div class="step"><strong>افحص مخطط الضغط.</strong> استخدم مخطط PT في هذه الصفحة. عند 25°C محيط، الجانب المنخفض يكون تقريباً 35-45 PSIG. عند 35°C+، توقع 40-50 PSIG. أضف حتى يدخل المانومتر النطاق الأمثل.</div>
        <div class="step"><strong>افحص حرارة الفتحة.</strong> ضع ترمومتر في فتحة التهوية المركزية. نظام مشحون جيداً يجب أن يهب 2°C-7°C. استمع للتشغيل المتكرر (الضاغط ينقر يعمل/يتوقف بسرعة) — يشير لشحن منخفض أو زائد أو مفتاح ضغط خربان.</div>
        <div class="step"><strong>افصل وأنهِ.</strong> توقف عندما يكون الضغط صحيحاً. أغلق الصمام لحبس المبرد المتبقي. افصل بسرعة من منفذ الضغط المنخفض. أعد غطاء الغبار. <strong>لا تفرط في الشحن</strong> — الأفضل أن يكون أقل قليلاً.</div>
      </div>
      <div class="warn-box"><div class="title">🔧 استكشاف الأخطاء</div>
      <p style="font-size:0.88em;"><strong>الضاغط لا يعمل:</strong> إذا كان الضغط أقل من ~20 PSIG، مفتاح الأمان منخفض الضغط يمنع تشغيل الضاغط. أضف كمية صغيرة لرفع الضغط فوق حد المفتاح.<br>
      <strong>النظام يتسرب:</strong> إذا كان النظام فارغاً أو يحتاج شحن متكرر، هناك تسريب. قد تتضمن عبوات R-134a صبغة UV أو مانع تسرب كيميائي.<br>
      <strong>تحذير بيئي:</strong> تفريغ R-134a غير قانوني في كثير من المناطق. أضف فقط ما يحتاجه النظام.</p></div>`
  },
  r22: {
    en: `
      <div class="warn-box danger"><div class="title">⚠️ R-22 is Banned for New Production</div><p>Since January 1, 2020, R-22 production and import are prohibited in the US. Only reclaimed/recycled R-22 may be used for service.</p></div>
      <div class="warn-box danger"><div class="title">⚠️ Safety First</div><p>Wear safety glasses and gloves. R-22 operates at high pressures. Never mix R-22 with R-410A.</p></div>
      <div class="instructions">
        <div class="step"><strong>Verify the system uses R-22.</strong> Check the unit's nameplate. R-22 systems have different service port fittings than R-410A.</div>
        <div class="step"><strong>Connect manifold gauge set.</strong> Connect the blue (low-side) hose to the suction service port and the red (high-side) hose to the liquid service port.</div>
        <div class="step"><strong>Start the system.</strong> Let it run for at least 10–15 minutes to stabilize. Record both suction and discharge pressures.</div>
        <div class="step"><strong>Compare to PT chart.</strong> At 25°C ambient, typical suction pressure is ~65 PSIG and discharge is ~230 PSIG.</div>
        <div class="step"><strong>Calculate superheat or subcooling.</strong> Use the Calculators tab. Target superheat 8–15°F (4–8°C), subcooling 5–12°F (3–7°C).</div>
        <div class="step"><strong>Add refrigerant if needed.</strong> Connect the refrigerant cylinder to the center hose. Add slowly in short bursts.</div>
        <div class="step"><strong>Verify and disconnect.</strong> Confirm within manufacturer specs. Close valves, disconnect gauges. <strong>Do not vent R-22.</strong></div>
      </div>
      <div class="warn-box"><div class="title">🔧 Retrofit Note</div><p style="font-size:0.88em;">If your R-22 system needs major repair, consider retrofitting to R-407C, R-438A (MO99), or R-454B.</p></div>`,
    ar: `
      <div class="warn-box danger"><div class="title">⚠️ R-22 محظور الإنتاج الجديد</div><p>منذ 1 يناير 2020، تم حظر إنتاج واستيراد R-22 في أمريكا. فقط R-22 المسترد/المُعاد تدويره يُستخدم للصيانة.</p></div>
      <div class="warn-box danger"><div class="title">⚠️ السلامة أولاً</div><p>ارتدِ نظارات وقفازات السلامة. R-22 يعمل بضغوط عالية. لا تخلط R-22 مع R-410A أبداً.</p></div>
      <div class="instructions">
        <div class="step"><strong>تأكد أن النظام يستخدم R-22.</strong> افحص لوحة الوحدة. أنظمة R-22 لها وصلات خدمة مختلفة عن R-410A.</div>
        <div class="step"><strong>وصّل مجموعة مانومتر.</strong> وصّل الخرطوم الأزرق (الجانب المنخفض) بمنفذ خدمة الشفط والخرطوم الأحمر (الجانب العالي) بمنفذ خدمة السائل.</div>
        <div class="step"><strong>شغّل النظام.</strong> اتركه يعمل 10-15 دقيقة على الأقل للاستقرار. سجّل ضغوط الشفط والتفريغ.</div>
        <div class="step"><strong>قارن مع مخطط PT.</strong> عند 25°C محيط، ضغط الشفط النموذجي ~65 PSIG والتفريغ ~230 PSIG.</div>
        <div class="step"><strong>احسب السوبريتي أو التبريد تحت التشبع.</strong> استخدم تبويب الحاسبات. هدف السوبريتي 8-15°F (4-8°C)، التبريد تحت التشبع 5-12°F (3-7°C).</div>
        <div class="step"><strong>أضف مبرد إذا لزم.</strong> وصّل أسطوانة المبرد بالخرطوم الأوسط. أضف ببطء على دفعات قصيرة.</div>
        <div class="step"><strong>تأكد وافصل.</strong> تأكد من المطابقة لمواصفات الشركة. أغلق الصمامات، افصل المانوميتر. <strong>لا تفرّغ R-22.</strong></div>
      </div>
      <div class="warn-box"><div class="title">🔧 ملاحظة التحويل</div><p style="font-size:0.88em;">إذا كان نظام R-22 يحتاج إصلاح كبير، فكّر في التحويل إلى R-407C أو R-438A (MO99) أو R-454B.</p></div>`
  },
  r410a: {
    en: `
      <div class="warn-box danger"><div class="title">⚠️ HIGH PRESSURE SYSTEM</div><p>R-410A operates at approximately 50% higher pressure than R-22. Only use equipment rated for R-410A (typically 800 PSIG working pressure).</p></div>
      <div class="warn-box danger"><div class="title">⚠️ Safety First</div><p>Wear safety glasses and gloves. R-410A pressures can exceed 400 PSIG on the high side during normal operation.</p></div>
      <div class="instructions">
        <div class="step"><strong>Verify the system uses R-410A.</strong> Check the nameplate. R-410A systems use different service port fittings (larger, 1/2" Acme).</div>
        <div class="step"><strong>Use R-410A-rated manifold gauges.</strong> Connect the blue hose to the suction port and red hose to the liquid port. Ensure hoses rated for 800+ PSIG.</div>
        <div class="step"><strong>Start the system.</strong> Let it run 10–15 minutes to stabilize. Record suction and discharge pressures.</div>
        <div class="step"><strong>Compare to PT chart.</strong> At 25°C ambient, typical suction is ~87 PSIG and discharge is ~250 PSIG. At 35°C, suction ~107 PSIG, discharge ~320 PSIG.</div>
        <div class="step"><strong>Calculate subcooling (TXV systems).</strong> Target subcooling is typically 8–14°F (4–8°C) per manufacturer data plate.</div>
        <div class="step"><strong>Charge as liquid.</strong> R-410A is a blend. Invert the cylinder to charge as liquid. Use a scale to weigh in the charge.</div>
        <div class="step"><strong>Verify and disconnect.</strong> Confirm subcooling/superheat within specs. <strong>Do not vent R-410A.</strong></div>
      </div>
      <div class="warn-box"><div class="title">🔧 Important Notes</div><p style="font-size:0.88em;"><strong>Glide:</strong> R-410A has negligible temperature glide (<0.3°C).<br><strong>Phase-out:</strong> Being phased out for new equipment (replaced by R-454B since Jan 2025).<br><strong>Do NOT mix with R-22.</strong></p></div>`,
    ar: `
      <div class="warn-box danger"><div class="title">⚠️ نظام ضغط عالي</div><p>R-410A يعمل بضغط أعلى بحوالي 50% من R-22. استخدم فقط معدات مُصنّفة لـ R-410A (عادة 800 PSIG ضغط عمل).</p></div>
      <div class="warn-box danger"><div class="title">⚠️ السلامة أولاً</div><p>ارتدِ نظارات وقفازات السلامة. ضغوط R-410A يمكن أن تتجاوز 400 PSIG على الجانب العادي أثناء التشغيل العادي.</p></div>
      <div class="instructions">
        <div class="step"><strong>تأكد أن النظام يستخدم R-410A.</strong> افحص اللوحة. أنظمة R-410A تستخدم وصلات خدمة مختلفة (أكبر، 1/2 إنش أكمي).</div>
        <div class="step"><strong>استخدم مانومتر مُصنّف لـ R-410A.</strong> وصّل الخرطوم الأزرق بمنفذ الشفط والأحمر بمنفذ السائل. تأكد أن الخراطيم مُصنّفة لـ 800+ PSIG.</div>
        <div class="step"><strong>شغّل النظام.</strong> اتركه يعمل 10-15 دقيقة للاستقرار. سجّل ضغوط الشفط والتفريغ.</div>
        <div class="step"><strong>قارن مع مخطط PT.</strong> عند 25°C محيط، الشفط النموذجي ~87 PSIG والتفريغ ~250 PSIG. عند 35°C، شفط ~107 PSIG، تفريغ ~320 PSIG.</div>
        <div class="step"><strong>احسب التبريد تحت التشبع (أنظمة TXV).</strong> هدف التبريد تحت التشبع عادة 8-14°F (4-8°C) حسب لوحة بيانات الشركة.</div>
        <div class="step"><strong>اشحن كسائل.</strong> R-410A مزيج. اقلب الأسطوانة للشحن كسائل. استخدم ميزان لوزن الشحن.</div>
        <div class="step"><strong>تأكد وافصل.</strong> تأكد أن التبريد تحت التشبع/السوبريتي ضمن المواصفات. <strong>لا تفرّغ R-410A.</strong></div>
      </div>
      <div class="warn-box"><div class="title">🔧 ملاحظات مهمة</div><p style="font-size:0.88em;"><strong>الانزياح:</strong> R-410A لديه انزياح حراري ضئيل (<0.3°C).<br><strong>التوقف التدريجي:</strong> يتم استبداله للمعدات الجديدة (بديله R-454B منذ يناير 2025).<br><strong>لا تخلط مع R-22.</strong></p></div>`
  },
  r32: {
    en: `
      <div class="warn-box danger"><div class="title">⚠️ R-32 IS FLAMMABLE (A2L)</div><p>R-32 is classified <strong>A2L (mildly flammable)</strong>. <strong>Do NOT use near open flames, sparks, or ignition sources.</strong></p></div>
      <div class="warn-box danger"><div class="title">⚠️ Safety First</div><p>Wear safety glasses and gloves. Ensure adequate ventilation. Keep ignition sources away. Have a fire extinguisher (Class B) nearby.</p></div>
      <div class="instructions">
        <div class="step"><strong>Verify the system is designed for R-32.</strong> Check the nameplate. Never put R-32 in a system not designed for it.</div>
        <div class="step"><strong>Use R-32-rated equipment.</strong> Manifold gauges, hoses, and recovery equipment must be rated for R-32 pressures and A2L compatibility.</div>
        <div class="step"><strong>Check for leaks before charging.</strong> Use an electronic leak detector rated for A2L refrigerants.</div>
        <div class="step"><strong>Start the system.</strong> Let it run 10–15 minutes to stabilize. Record suction and discharge pressures.</div>
        <div class="step"><strong>Compare to PT chart.</strong> At 25°C ambient, typical suction is ~89 PSIG and discharge is ~260 PSIG.</div>
        <div class="step"><strong>Charge carefully.</strong> R-32 is a pure refrigerant, so it can be charged as vapor or liquid. Weigh in the charge.</div>
        <div class="step"><strong>Verify and disconnect.</strong> Confirm subcooling/superheat within specs. Check for leaks again. <strong>Do not vent R-32.</strong></div>
      </div>
      <div class="warn-box"><div class="title">🔧 A2L Safety Notes</div><p style="font-size:0.88em;"><strong>Charge limits:</strong> R-32 systems have maximum charge limits based on room volume.<br><strong>Leak detection:</strong> Use electronic detectors rated for A2L.<br><strong>Storage:</strong> Store in well-ventilated area away from heat and ignition sources.</p></div>`,
    ar: `
      <div class="warn-box danger"><div class="title">⚠️ R-32 قابل للاشتعال (A2L)</div><p>R-32 مُصنّف <strong>A2L (قابل للاشتعال بشكل خفيف)</strong>. <strong>لا تستخدمه بالقرب من ألسنة اللهب أو الشرر أو مصادر الاشتعال.</strong></p></div>
      <div class="warn-box danger"><div class="title">⚠️ السلامة أولاً</div><p>ارتدِ نظارات وقفازات السلامة. تأكد من التهوية الكافية. أبعد مصادر الاشتعال. احتفظ بطفاية حريق (فئة B) بالجوار.</p></div>
      <div class="instructions">
        <div class="step"><strong>تأكد أن النظام مصمم لـ R-32.</strong> افحص اللوحة. لا تضع R-32 أبداً في نظام غير مصمم له.</div>
        <div class="step"><strong>استخدم معدات مُصنّفة لـ R-32.</strong> المانوميتر والخراطيم ومعدات الاسترداد يجب أن تكون مُصنّفة لضغوط R-32 وتوافق A2L.</div>
        <div class="step"><strong>افحص التسريبات قبل الشحن.</strong> استخدم كاشف تسريب إلكتروني مُصنّف لمبردات A2L.</div>
        <div class="step"><strong>شغّل النظام.</strong> اتركه يعمل 10-15 دقيقة للاستقرار. سجّل ضغوط الشفط والتفريغ.</div>
        <div class="step"><strong>قارن مع مخطط PT.</strong> عند 25°C محيط، الشفط النموذجي ~89 PSIG والتفريغ ~260 PSIG.</div>
        <div class="step"><strong>اشحن بحذر.</strong> R-32 مبرد نقي، يمكن شحنه كبخار أو سائل. ازن الشحن.</div>
        <div class="step"><strong>تأكد وافصل.</strong> تأكد أن التبريد تحت التشبع/السوبريتي ضمن المواصفات. افحص التسريبات مرة أخرى. <strong>لا تفرّغ R-32.</strong></div>
      </div>
      <div class="warn-box"><div class="title">🔧 ملاحظات سلامة A2L</div><p style="font-size:0.88em;"><strong>حدود الشحن:</strong> أنظمة R-32 لها حدود شحن قصوى بناءً على حجم الغرفة.<br><strong>كشف التسريبات:</strong> استخدم كواشف إلكترونية مُصنّفة لـ A2L.<br><strong>التخزين:</strong> خزّن في منطقة جيدة التهوية بعيداً عن الحرارة ومصادر الاشتعال.</p></div>`
  }
};