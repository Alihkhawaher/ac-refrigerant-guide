# Review Report — AC Refrigerant Guide.html & ac_calculator.py

**Date:** 2026-07-02
**Files reviewed:** `AC Refrigerant Guide.html` (2,180 lines), `ac_calculator.py` (581 lines)

---

## 1. Data Verification (What Is CORRECT)

The core thermodynamic data was cross-checked and is accurate:

| Item | Verified |
|---|---|
| PT saturation tables (all 4 refrigerants) | ✅ Data is stored in °F and converted to °C at load time; spot checks against NIST/ASHRAE values match within ~1 psig (R-134a @25°C ≈ 82 psig ✓, R-22 @25°C ≈ 136 psig ✓, R-410A @25°C ≈ 225 psig ✓, R-32 @25°C ≈ 230 psig ✓) |
| Boiling points | ✅ R-134a −26.1°C, R-22 −40.8°C, R-410A −51.4°C, R-32 −51.7°C |
| Critical temps/pressures | ✅ All four match published values (e.g., R-134a 101.1°C / 588.7 psia, R-32 78.1°C / 838.7 psia) |
| Molecular weights, ODP values | ✅ Correct (R-22 ODP 0.055 ✓) |
| R-22 US ban (Jan 2020), R-410A phase-out for new equipment (Jan 2025, replaced by R-454B), R-134a→R-1234yf transition | ✅ Correct |
| R-410A ~50% higher pressure than R-22, negligible glide (<0.3°C), liquid charging for blends | ✅ Correct |
| R-32 A2L classification, GWP ~68% lower than R-410A (675 vs 2088) | ✅ Correct |
| Interpolation logic (JS and Python are identical and correct) | ✅ Verified |
| Capacitor tolerance ±6%, clutch coil 3–5 Ω, contactor coil 5–20 Ω, 500-micron evacuation, nitrogen test pressures | ✅ Reasonable industry values |

---

## 2. WRONG / INCONSISTENT INFORMATION (HTML)

### 2.1 ⚠️ °C vs °F mix-up in superheat/subcooling targets (most important)
The refrigerant data objects correctly state targets in °F with °C equivalents, e.g. `superheatTarget: '5–15°F (3–8°C)'`. But the instructional text contradicts this:

- **"How to Measure Superheat" box:** says *"Target: 5–15°C"* → should be **5–15°F (≈3–8°C)**. 5–15°C superheat (= 9–27°F) is far too wide; the upper end would indicate a badly undercharged system.
- **"How to Measure Subcooling" box:** says *"Target: 5–12°C"* → should be **5–12°F (≈3–7°C)**.
- **R-22 instructions step 5:** *"Target superheat 8–15°C, subcooling 5–12°C"* → data plate says 8–15**°F** (4–8°C) and 5–12**°F** (3–7°C).
- **R-410A instructions step 5:** *"Target subcooling is typically 5–12°C"* → its own data says `subcoolingTarget: '8–14°F (4–8°C)'`.

**Fix:** Standardize on the °F(°C) values already stored in each refrigerant's `superheatTarget`/`subcoolingTarget` and reference those variables in the text instead of hard-coded numbers.

### 2.2 ⚠️ R-134a charging step contradicts its own pressure table
Instructions step 5 says: *"At 25°C ambient, low-side should be roughly 22–28 PSIG… At 35°C+, expect 32–40 PSIG."*
But the same refrigerant's `operatingRanges` (used by the Target Pressures tab and diagram) say **35–45 PSIG at 24°C** and **40–50 PSIG at 35°C**. A user following the instructions would undercharge relative to the app's own tables. One of the two must be corrected (the `operatingRanges` values match the automotive references cited in the Python file).

### 2.3 GWP label says "AR5" but values are AR4
`GWP (AR5)` label with values 1430 / 1810 / 2088 / 675 — these are **AR4** (IPCC 4th report) figures. AR5 values are R-134a 1300, R-22 1760, R-410A 1924, R-32 677. Either change the label to "GWP (AR4)" or update the numbers.

### 2.4 Static pressure ranges partially exceed physical saturation pressure
An equalized ("static") system cannot exceed the saturation pressure at ambient temperature. Some upper bounds violate this:
- **R-134a @ 35°C:** table says 115–140 PSIG, but saturation at 35°C is ~114 psig → max ~114, not 140.
- **R-134a @ 18°C:** table max 70 vs saturation ~63 psig.
- **R-22 @ 35°C:** table max 200 vs saturation ~182 psig.

R-410A and R-32 static tables stay below saturation and are fine. Recommend capping every static range at the PT saturation value for that ambient (which the app can compute directly from its own `pt` data).

### 2.5 Discharge line temperature formula overestimates
`dischargeT = condT + 30 + ambC*0.8` — at 35°C ambient on R-410A this yields ~118°C, and at 55°C it exceeds 130°C. Typical compressor discharge line temps are 60–95°C in normal operation, with ~121°C (250°F) being the *damage threshold*. The diagram therefore displays alarming values as "normal." Suggest something like `condT + 25` capped at ~100°C, or a smaller ambient coefficient.

### 2.6 Fixed diagnostic thresholds ignore per-refrigerant targets
`updateSuperheat()` marks 4–15°C as "Normal" and `updateSubcooling()` marks 3–12°C as "Normal" for **all** refrigerants, even though each refrigerant defines different targets (e.g., R-410A subcooling 4–8°C — a reading of 11°C would be flagged "Normal" while the data plate says overcharged). Thresholds should be derived from each refrigerant's stored targets.

### 2.7 Language toggle breaks HTML-containing text (functional bug)
`toggleLang()` uses `el.textContent = el.getAttribute('data-' + currentLang)`. Several `data-en`/`data-ar` attributes contain markup (`<br>`, `<strong>` — e.g., the "How to Measure Superheat/Subcooling" boxes, footer). After toggling language, the raw tags (`<br>`, `<strong>`) are displayed as literal text. Should use `innerHTML` (content is static/trusted) or strip markup from those attributes.

### 2.8 Text errors
- **Line ~1072:** Arabic string contains Hebrew: `'قريب من המלא'` — "המלא" is Hebrew, should be Arabic (e.g. "قريب من الامتلاء").
- **Line ~697 (Arabic step 4):** "اضغط الزناد **لاختام** الإحكام" — should be "لاختراق ختم الإحكام" (to puncture the seal).
- **Line ~801 (Arabic R-410A safety box):** "على الجانب **العادي**" — should be "الجانب **العالي**" (high side).
- **Line ~2049:** Arabic "زعفة/بوصة" — should be "زعنفة/بوصة" (fins/inch).
- English typo in R-22 issues: "hoواء دافئ" mixes scripts (line ~1701 `'هوواء دافئ'` has doubled و).

### 2.9 Minor content issues
- **Pipe sizing inconsistency:** `calcSystem()` gives 3/8" liquid line for 12,001–24,000 BTU, but `calcDevice()` lists 1/4" liquid line for 18,000/24,000 BTU split systems. 3/8" is the common spec for 1.5–2 ton splits; 1/4" is typical only for mini-splits. Align the two calculators.
- **`_applyTxvState` never called from `renderRefInfo`** despite the comment saying it is exposed for that purpose (harmless, state persists, but dead intent).
- **PT lookup advice at high temps:** `updatePTFromTemp()` shows "Expected vent air: X+2 to X+7°C" even when the user enters e.g. 50°C (yields "vent air 52–57°C" — meaningless). Only show vent-air guidance for evaporator-range temps (< ~15°C).
- **Footer claims "Data sourced from NIST thermodynamic library"** while the Python file states hvacptcharts.com / acdirect.com / Chemours. Make attribution consistent.
- Compare tab title says "Indoor assumed at 22-25°C" but a slider lets it range 18–40°C — reword to "default 24°C, adjustable".

---

## 3. ISSUES IN ac_calculator.py

### 3.1 🐛 Format-spec bug in PT table printing (Section 3)
Line 300:
```python
print(f"{t:>10.1}°C {p:>14.1f} PSIG {phase:>10}")
```
`{t:>10.1}` (missing the `f`) formats the float to **1 significant digit** in general format — e.g. `-48.3` prints as `-5e+01`. Should be `{t:>10.1f}`.

### 3.2 Same fixed diagnostic thresholds as HTML
`main()` Section 5 classifies superheat with <4 / ≤15 / ≤25°C and subcooling with <3 / ≤12 / ≤20°C for all refrigerants — same issue as §2.6; contradicts the per-refrigerant `superheat_target_f` / `subcooling_target_f` it defines a few lines earlier.

### 3.3 "Optimal" pressure ranges are misleadingly broad
E.g. R-134a `optimal_low_side_psig: (25, 82)` — 82 psig suction corresponds to a 25°C evaporator (no cooling at all). These appear to be "possible envelope across all ambients," not "optimal." Rename or narrow them, since Section 4 prints them labeled "Optimal Pressure."

### 3.4 Minor
- `import json` is unused.
- `validate_known_points()` returns a list named `errors` that also contains ✅ pass lines — misleading name (cosmetic).
- The cross-check matcher (`if c == amb_c or (best is None and abs(c - amb_c) < 3)`) silently picks the *first* entry within 3°C, then keeps overwriting only on exact matches — works for current data but fragile.
- Comment on line 9 says "Temperatures in °F (source data)" — correct, and confirms the HTML's `pt` arrays are °F-sourced. Good that the HTML converts them, but the HTML has **no comment** documenting this; a future editor could easily add a "°C" row and corrupt the table. Add a comment above the `pt:` arrays in the HTML.

### 3.5 Consistency between Python and HTML
- `operating_data` and `static_data` in the Python file match the HTML `operatingRanges`/`staticPressure` arrays exactly ✅.
- Python superheat/subcooling targets (converted °F→°C as *differences*, correctly using ×5/9 without the −32 offset ✅) match the HTML data-plate strings ✅ — reinforcing that the hard-coded "5–15°C" text in the HTML boxes (§2.1) is the error.

---

## 4. RECOMMENDED IMPROVEMENTS (Both Files)

1. **Single source of truth:** The refrigerant data exists twice (JS object + Python dict). Consider generating one from the other (e.g., Python exports JSON consumed by the HTML) to prevent drift.
2. **Fix the °C/°F target texts** (§2.1) — this is the only error likely to cause a real-world mischarge.
3. **Reconcile R-134a charging instructions with `operatingRanges`** (§2.2).
4. **Clamp static-pressure tables to saturation pressure** (§2.4) — the app can compute this from its own PT data instead of hard-coded ranges.
5. **Derive diagnostic thresholds from per-refrigerant targets** instead of global constants (§2.6, §3.2).
6. **Switch `toggleLang` to `innerHTML`** for `data-en`/`data-ar` elements (§2.7).
7. **Fix `{t:>10.1}` → `{t:>10.1f}`** in the Python script (§3.1).
8. **Add a source comment above the HTML `pt:` arrays** noting the first column is °F and converted at load time.
9. Correct the Arabic/Hebrew text errors (§2.8) and GWP label (§2.3).
10. Align pipe-size tables between the two calculators (§2.9).

---

## 5. Severity Summary

| # | Issue | Severity | File |
|---|---|---|---|
| 2.1 | Superheat/subcooling targets shown in °C instead of °F | **High** (can cause mischarging) | HTML |
| 2.2 | R-134a instructions contradict own pressure tables | **High** | HTML |
| 2.7 | Language toggle displays raw HTML tags | Medium (functional bug) | HTML |
| 2.4 | Static pressures exceed saturation pressure | Medium | HTML + PY |
| 2.5 | Discharge temp formula overestimates | Medium | HTML |
| 2.6/3.2 | Fixed diagnostic thresholds ignore refrigerant targets | Medium | HTML + PY |
| 3.1 | `{t:>10.1}` format bug breaks PT table output | Medium | PY |
| 2.3 | GWP labeled AR5 but values are AR4 | Low | HTML |
| 2.8 | Text/translation typos (incl. Hebrew word in Arabic) | Low | HTML |
| 2.9/3.3/3.4 | Minor inconsistencies & dead code | Low | Both |