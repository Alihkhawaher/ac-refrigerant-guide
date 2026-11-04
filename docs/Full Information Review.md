# Full Information Review — AC Refrigerant Guide PWA

**Date:** 2026-09-05
**Scope:** Factual accuracy audit of all technical information in the app (data, instructions, troubleshooting, knowledge Q&A, calculators, vehicle database, bilingual content) — extending the 2026-07-04 review, which covered PT data and calculators only.
**Method:** Direct file review, live execution of the Python calculators, SQL sampling of the vehicle DB, cross-check against published PT charts (CoolProp-based sources, A-Gas/InspectAPedia), and consistency checks between EN/AR content.

---

## Executive Summary

**Overall verdict: The technical information is accurate and internally consistent.** All four refrigerants' PT charts match published reference data (R-32 verified point-for-point against CoolProp-cross-checked sources). Operating ranges, charging instructions, troubleshooting logic, and Q&A answers are consistent with standard HVAC practice. No dangerous or misleading errors were found in the safety-critical content.

**9 new issues were found** — none safety-critical, but several worth fixing:

| # | Severity | Issue | Location |
|---|---|---|---|
| 1 | ⚠️ Medium | Self-test fixtures produce false "ERR" output (up to 11.6 PSIG diff shown), contradicting the "<1 PSIG max error" claim | `calculators/ac_calculator_t3.py` |
| 2 | ⚠️ Medium | "New Holland" / "John Deere" split into makes "New" and "John"; one vehicle shows 2 g charge | `vehicle_ac_data.db` / `build_vehicle_db.py` |
| 3 | ⚠️ Medium | Hebrew word "המלא" embedded in an Arabic warning message | `js/calculators.js` L134 |
| 4 | ⚠️ Medium | R-454B listed as an R-22 *retrofit* option — it is an R-410A replacement for new equipment, not a practical R-22 retrofit | `js/instructions.js` (R-22 section) |
| 5 | ⚠️ Low-Med | "R-410A ~50% higher pressure than R-22" understates: actual is ~60–75% at common temperatures | `js/data.js`, `js/instructions.js` |
| 6 | ⚠️ Low | Superheat/subcooling verdict thresholds are fixed in JS, ignoring per-refrigerant targets defined in data.js | `js/calculators.js` |
| 7 | ⚠️ Low | Arabic mistranslation: "coil frosting" → "تجفيف الملف" (drying the coil) | `js/issues.js` (R-410A low charge) |
| 8 | ℹ️ Info | README says refrigerant types are "R134a/R1234yf" but DB also contains 4× R-12 and 7× R-744 entries | `README.md` |
| 9 | ✅ Resolved | High-ambient (T3) operating ranges verified consistent with NIST/DOE/Purdue official research | `docs/Calculator Review.md` §4 |

---

## 1. Refrigerant Properties & PT Data (`js/data.js`) — ✅ VERIFIED

| Property | R-134a | R-22 | R-410A | R-32 | Verdict |
|---|---|---|---|---|---|
| Boiling point (°C) | −26.1 | −40.8 | −51.4 | −51.7 | ✅ All correct |
| Critical temp (°C) | 101.1 | 96.1 | 71.3 | 78.1 | ✅ All correct |
| Critical press (psia) | 588.7 | 723.7 | 710.9 | 838.7 | ✅ All correct |
| GWP (AR4) | 1430 | 1810 | 2088 | 675 | ✅ Correct (ASHRAE 34 uses AR4 values) |
| ODP | 0 | 0.055 | 0 | 0 | ✅ Correct |
| Safety class | A1 | A1 | A1 | A2L | ✅ Correct |
| Oil | PAG (auto) / POE | MO / AB | POE | POE | ✅ Correct |

**PT charts** — spot-checked against published charts:

| Point | App value | Reference | Verdict |
|---|---|---|---|
| R-134a 40°F | 35.0 | 35.0 (Carrier/National) | ✅ |
| R-134a 130°F | 198.7 | ~198.5 | ✅ |
| R-22 40°F | 68.5 | 68.5 | ✅ |
| R-22 70°F | 121.4 | 121.4–121.5 | ✅ |
| R-410A 40°F | 118.8 | 118.7–118.8 | ✅ |
| R-410A 100°F | 318.5 | 317.9–318.6 | ✅ |
| R-32 40°F | 121.0 | 121.0 (CoolProp-verified source) | ✅ |
| R-32 100°F | 325.7 | 325.7 | ✅ |

The full R-32 table matches a CoolProp-cross-checked published chart **point-for-point** (all 41 values). R-134a/R-22/R-410A tables match standard published values within rounding.

## 2. Calculators — ✅ SYNCED, one test-fixture bug

- `ac_calculator.py`, `ac_calculator_t3.py`, and `js/calculators.js` all use **identical PT tables and operating ranges** (JS reads them directly from `data.js`). No sync drift.
- **Wagner equation verified by execution:** error vs the verified table is 0.0–0.9 PSIG at all °F grid points — the "<1 PSIG" claim holds.
- **Issue #1 (new):** the self-test fixtures in `ac_calculator_t3.py` (`test_points`, lines 371–376) pair 0 °C and 50 °C with the pressure of 30 °F and 120 °F table rows instead of the true interpolated values (27.8 and 176.5 PSIG for R-134a). Result: the printed self-test shows "~OK"/"ERR" with diffs up to 11.6 PSIG, visibly contradicting the header's "<1 PSIG max error" claim. **The equation is correct; the test fixtures are wrong.** Fix: use interpolated expected values, or test at exact °F-grid temperatures.
- Minor divergence (intentional-looking): the T3 script's `OPERATING_RANGES` has 14 rows for R-410A/R-32 (extra 41 °C and 46 °C points) vs 12 in the app tables. Not a conflict — the extra points interpolate smoothly between the shared values.
- JS superheat/subcooling formulas are correct (`SH = line_temp − sat_temp(pressure)`, `SC = sat_temp(pressure) − line_temp`).
- **Issue #6:** JS verdict thresholds are universal (SH: low <4, normal ≤15, high ≤25 °C; SC: low <3, normal ≤12 °C) while `data.js` defines per-refrigerant targets (e.g., R-134a SH target 3–8 °C — a 12 °C reading would show "Normal" in the calculator but is above the stated target). Recommend refrigerant-aware thresholds.

## 3. Instructions (`js/instructions.js`) — ✅ VERIFIED with 2 flags

- All quoted pressures match the operating tables exactly:
  - R-134a: 29–39 @25 °C, 34–44 @35 °C, 37–47 @45 °C ✅
  - R-22: ~65/~230 @25 °C ✅
  - R-410A: 115–130/260–305 @25 °C, 125–145/490–555 @48 °C ✅
  - R-32: 118–135/270–315 @25 °C, 122–140/380–445 @35 °C ✅
- R-22 ban date (Jan 1, 2020, US) ✅ · R-410A glide <0.3 °C ✅ · charge-as-liquid for blends ✅ · A2L handling for R-32 (ventilation, A2L-rated detectors, charge limits, Class B extinguisher) ✅
- **Issue #4 (confirmed against official Chemours documentation):** "consider retrofitting to R-407C, R-438A (MO99), **or R-454B**" — R-407C and MO99 are legitimate R-22 retrofit refrigerants. R-454B is **not** an R-22 retrofit: the official Chemours/Opteon XL41 Product Information Bulletin (opteon.com, C-11001) states R-454B is a refrigerant "to replace R-410A in **new equipment designs**" and lists it as a "**Direct replacement (new equipment only)** for all equipment types designed for R-410A" — it is never listed for R-22 conversion. Recommend removing R-454B from that list.
- **Issue #5:** "R-410A operates at approximately 50% higher pressure than R-22" — at common saturation temperatures the increase is 62–73% (40 °F: +73%; 70 °F: +66%; 130 °F: +62%). Industry sources typically say "60–70% higher". Recommend "~60–70%".
- Also applies to `data.js` R-410A description ("~50% higher").
- Minor: "Jan 2025 phase-out, replaced by R-454B" omits that R-32 is also a compliant replacement (the T3 script itself says "New equipment uses R-32 … or R-454B"). Consider "replaced by R-454B or R-32".

## 4. Troubleshooting & Oil Diagnostics (`js/issues.js`) — ✅ VERIFIED

- All pressure-pattern diagnoses (low-low = undercharge, low suction + high head = restriction, high suction + low head = compressor valves, equalized = valve failure) match standard practice.
- Component specs verified: clutch coil 3–5 Ω ✅, clutch air gap 0.3–0.6 mm ✅, capacitor ±6% ✅.
- Compressor type ranges (Scroll 1.5–30 T, Rotary 0.5–4 T, Screw 20–1000+ T, Centrifugal 100–10000+ T) ✅.
- Amperage table (9k–60k BTU) plausible and internally consistent with `devices.js` ✅.
- Oil color/smell interpretations match industry guidance (green slime is debatable — commonly attributed to leak-seal additives in automotive contexts — but the copper-contamination explanation given is a recognized HVAC interpretation; not an error).
- **Issue #7:** R-410A "Low Charge" symptom AR text: "تجفيف الملف" = "drying the coil" — should be "تجمد/تكوّن صقيع على الملف" (coil frosting).

## 5. Knowledge Q&A (`js/knowledge.js`) — ✅ VERIFIED

- All 29 answers fact-checked. Highlights:
  - PSIG/PSIA example: R-22 @50 °C = 267 PSIG → 281.7 PSIA. **Verified correct** (122 °F interpolation of the app's own chart gives ~265–267 PSIG) ✅
  - Evacuation to 500 microns ✅, POE moisture absorption guidance ✅, TXV bulb test procedure ✅, contactor coil 5–20 Ω ✅, nitrogen test pressures per refrigerant ✅
- Cosmetic: answer #2 Arabic ends with a stray `</p>` instead of `</div>` (mismatched tag).
- Terminology note: "suction" is translated as "مصعد" (literally "elevator/ascending") throughout the Arabic UI. Understandable in context but non-standard; "خط الشفط / الضغط المنخفض" would be more correct. Cosmetic only.

## 6. Component Tables (`js/devices.js`) — ✅ VERIFIED

- R-32 charge ≈ 70% of R-410A for every size ✅ (correct — R-32 systems take less charge by mass).
- Wire gauge / breaker sizing (6 AWG ↔ 50 A, 8 AWG ↔ 40–45 A, etc.) ✅.
- Pipe sizing by capacity, RLA/LRA ranges plausible ✅.
- Values are appropriately generic (approximation tables), consistent with the app's educational purpose.

## 7. Vehicle Database — ✅ SUBSTANTIALLY SOUND, parser artifacts found

- **3,378 rows, 69 distinct makes** — counts match README ✅.
- Distribution: 2,763 R-134a, 604 R-1234yf, 4 R-12, 7 R-744. No nulls or zeros in charge quantities.
- 15-row sample across Toyota/Ford/BMW/Mercedes/Hyundai: all values plausible against known specs (e.g., Corolla 2008 = 440 g, Hilux = 550 g, E36 = 825 g) ✅.
- The 14 rows outside 100–2000 g are agricultural tractors (John Deere, Case IH, New Holland: 2,040–2,450 g) — plausible for tractor AC ✅.
- **Issue #2 (parser bugs):**
  - "New Holland" is stored as make = `New`, model = `Holland …` (multiple rows).
  - "John Deere" is stored as make = `John`, model = `Deere …` (multiple rows).
  - → The "69 makes" figure is inflated; actual distinct manufacturers ≈ 67. Searching by "New" or "John" also breaks UX.
  - One parse artifact: Iveco Eurocargo (1991–2001) refrigerant quantity = **2 g** (almost certainly 2,000 g truncated).
  - Cosmetic: malformed year ranges like "7.2004 -" (Toyota Landcruiser).
- Recommend: fix `build_vehicle_db.py` make-model splitting, correct the Iveco row, then rebuild.

## 8. Bilingual Consistency (EN/AR) — ✅ VALUES MATCH

- All numeric values (pressures, temperatures, dates, specs) are **identical** between English and Arabic across `data.js`, `instructions.js`, `issues.js`, `knowledge.js` — no silent value divergence. ✅
- Issues are wording-only: #3 (Hebrew fragment in `calculators.js` AR text), #7 (frosting mistranslation), "مصعد" terminology, mismatched HTML tag in Q&A #2.

## 9. Docs & Legacy Copies

- `v2/` and `backup/`: `data.js` and `manifest.json` are **byte-identical** to root — no stale/divergent data. No action needed (could still be pruned for repo hygiene).
- `SOURCES.md`: well-structured sourcing (Carrier, National Refrigerants, Chemours, Honeywell, hvacptcharts.com, acdirect.com; last verified 2026-07-02) ✅.
- **Previously-unresolved item now verified against official sources** (Issue #9): the R-410A/R-32 operating ranges above 41 °C ambient (flagged in `Calculator Review.md` §4 as needing more sources) were cross-checked against NIST/DOE/ORNL/Purdue research:

  - **NIST (Domanski & Payne 2002, NIST pub 860880 / OSTI 808637):** R-410A vs R-22 split systems tested from 27.8 °C to 68.3 °C ambient. Key figures: R-410A capacity −22% and EER −42% at 51.7 °C (vs 35 °C rating point); R-410A capacity 9% below R-22 and COP ~15% lower at 54.4 °C; a typical unitary R-410A system crosses into **transcritical operation at ~57.2 °C ambient** (critical pressure 691.8 psia).
  - **Consistency check vs app values:** the app's maximum quoted R-410A high-side range (540–585 PSIG at 55 °C) equals ~60–62 °C condensing — below the ~696 PSIG critical-equivalent gauge pressure and consistent with NIST's ~57 °C crossover finding. The app never implies normal operation above the critical point. ✅
  - **COP degradation estimate:** the app's linear model (−2.25%/°C above 35 °C → −37.6% at 51.7 °C) is slightly optimistic vs NIST's measured −42% EER for R-410A at 51.7 °C, but within the range reported across studies (−24% to −42% depending on unit). Acceptable as an estimate; a footnote would improve it.
  - **R-32 at high ambient:** Purdue high-ambient research (Barve & Cremaschi 2012, referenced in IRACC literature) confirms R-32 outperforms R-410A at 46.1 °C with significantly higher discharge temperature — exactly matching the app's claims ("R-32 has better COP at high ambient", "discharge temp runs higher — compressor thermal management critical"). ✅

  **Verdict:** the T3 narrative and derived high-ambient ranges are **consistent with official NIST/DOE/Purdue research**. The specific PSIG figures remain interpolated estimates (no official source publishes a single fixed PSIG range — condensing pressure depends on condenser sizing), but they are physics-consistent and safely below critical limits. The `Calculator Review.md` cross-check "failures" reflect divergence between third-party web estimates, not errors against official data.

---

## Recommended Fixes (priority order)

1. **`ac_calculator_t3.py`** — correct the 6 self-test fixtures at 0 °C / 50 °C to true interpolated expected values so the self-test output matches the "<1 PSIG" claim.
2. **`build_vehicle_db.py`** — fix make/model splitting (New Holland, John Deere); correct the Iveco Eurocargo 2 g row; rebuild DB; update README's "69 makes" if the count changes; mention R-12/R-744 entries in README.
3. **`js/calculators.js` L134** — replace "قريب من המלא" with proper Arabic ("قريب من التشبع/الامتلاء").
4. **`js/instructions.js`** (R-22) — remove R-454B from the retrofit list.
5. **`js/data.js` + `js/instructions.js`** — change "~50% higher" to "~60–70% higher".
6. **`js/calculators.js`** — make superheat/subcooling verdict thresholds use the per-refrigerant targets from `data.js`.
7. **`js/issues.js`** — fix "تجفيف الملف" → "تكوّن صقيع على الملف".
8. Cosmetic: fix `</p>` tag in knowledge.js #2 AR; consider standard Arabic term for "suction"; consider mentioning R-32 alongside R-454B in the phase-out note.

## Confidence Statement

- PT charts, refrigerant properties, calculator math: **high confidence** (verified against multiple independent published sources + live execution).
- Operating ranges: **medium-high confidence** for ≤41 °C (multiple sources agree); **medium-high** for >41 °C T3 values after verification against NIST pub 860880, OSTI 808637 (Domanski & Payne 2002), ORNL/ARTI 21CR 605-50015, and Purdue high-ambient studies — the values and T3 narrative are consistent with all official sources (specific PSIG figures remain condenser-design-dependent estimates).
- Vehicle DB: **sampled** (15 rows deep-checked + statistical outlier scan); not exhaustively verified against manufacturer data for all 3,378 entries.
- Q&A/troubleshooting guidance: **high confidence** (consistent with standard HVAC practice and the reference texts in `docs/`).