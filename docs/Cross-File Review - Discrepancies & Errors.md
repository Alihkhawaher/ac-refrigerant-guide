# Cross-File Review — Discrepancies & Errors

**Date:** 2026-07-04
**Reviewed Files:**
- `js/data.js` — Refrigerant core data (PT charts, operating ranges, components)
- `docs/AC Common Knowledge.txt` — Diagnostic & troubleshooting reference
- `docs/AC Pressure-Temperature Guide.md` — P-T diagnostic guide
- `docs/charge car AC.md` — Car AC charging guide (R-134a)
- `docs/Qwen Chat - e8eb99cf.md` — AI chat log with pressure data & site review
- `docs/Review Report.md` — Review report of AC Refrigerant Guide.html & ac_calculator.py
- `docs/SOURCES.md` — Data sources & research documentation
- `docs/from videos/من_افضل_في_التبريد_غاز_22_او_410-hCjjIQ7GOEU.srt` — Subtitle: Which refrigerant cools better (R-22 vs R-410A)
- `docs/from videos/طريقة شحن غازات التبريد....R22 - R32 - R410a - R407C xlnHj6GJghY.txt` — Transcript: How to charge refrigerants R22, R32, R410A, R407C
- `docs/from videos/تعلم كيفية تعبئة جهاز التكييف بالغاز R22 (تكملة) k2H3JYN4PFY.txt` — Transcript: How to charge AC with R22 (part 2)

---

## 🔴 CRITICAL ERRORS

### 1. Qwen Chat — R-134a Low-Temperature Pressure Values are WRONG

**File:** `docs/Qwen Chat - e8eb99cf.md` (lines 66-76)

The Qwen Chat claims the site's R-134a PT data has errors and provides "corrected" values, but **the Qwen Chat's corrections are actually incorrect**:

| Temp | Qwen Chat Claims | data.js (Actual) | Verified (NIST) |
|------|-------------------|-------------------|-----------------|
| -40°C | **14.8 PSIG** ❌ | -7.3 PSIG ✅ | ~-7.2 PSIG ✅ |
| -30°C | **9.9 PSIG** ❌ | -4.8 PSIG ✅ | ~-2.4 PSIG ✅ |
| -10°C | **15.0 PSIG** ❌ | 1.9 PSIG ✅ (at -10°F = -23°C) | ~14.4 PSIG (at -10°C) |

**Explanation:** R-134a's boiling point is -26.1°C. Below this temperature, the saturation pressure is below atmospheric (negative psig). The Qwen Chat incorrectly claims positive psig values for sub-boiling temperatures. The `data.js` PT chart is correct.

---

### 2. Qwen Chat — R-32 Pressure at 50°C is WRONG

**File:** `docs/Qwen Chat - e8eb99cf.md` (line 134)

| | Qwen Chat Claims | Actual (data.js) | Error |
|---|---|---|---|
| R-32 @ 50°C | **~325.7 PSIG** | **~441 PSIG** | **115 PSIG too low** |

**Impact:** This is a dangerous error. If a technician uses 325 PSIG as the expected high-side pressure for R-32 at 50°C ambient, they would severely undercharge the system (actual expected pressure is ~441 PSIG).

---

### 3. Qwen Chat — Standing Pressure Values Confuse psia with psig

**File:** `docs/Qwen Chat - e8eb99cf.md` (lines 17-20)

The Qwen Chat's standing pressure values at 50°C appear to be **psia (absolute pressure)**, not **psig (gage pressure)**. Standard gauge readings should be psig:

| Refrigerant | Qwen Chat (likely psia) | Correct psig (from data.js) | Difference |
|-------------|------------------------|---------------------------|------------|
| R-22 | 297 PSI | ~267 PSIG | +30 PSI |
| R-32 | 445 PSI | ~441 PSIG | +4 PSI |
| R-410A | 450 PSI | ~431 PSIG | +19 PSI |
| R-134a | 190 PSI | ~177 PSIG | +13 PSI |

**Impact:** A technician using these values would overcharge systems by 13-30 PSI, potentially causing high-pressure cutout trips or compressor damage.

---

### 4. Video Transcript — R-407C Composition is WRONG

**File:** `docs/from videos/طريقة شحن غازات التبريد....R22 - R32 - R410a - R407C xlnHj6GJghY.txt` (timestamp 01:01)

The speaker states:
> "غاز 407 عباره عن خليط مكونين ايضا اللي هو غاز 410 وغاز 1 4"
> (R-407C is a mixture of two components: R-410A and R-134a)

**This is incorrect on TWO counts:**
1. R-407C has **THREE** components, not two: R-32 (23%), R-125 (25%), R-134a (52%)
2. R-407C is **NOT** made by mixing R-410A with R-134a — the component ratios don't match mathematically:
   - If you mix R-410A (50% R-32, 50% R-125) with R-134a, you'd need X/Y = 0.852 for R-32 fraction but X/Y = 1.0 for R-125 fraction — these are contradictory, so the blend is impossible.

---

## 🟡 CONTRADICTIONS Between Files

### 5. Qwen Chat vs Review Report — R-134a PT Data Accuracy

| Source | Claim |
|--------|-------|
| **Qwen Chat** (lines 61-76) | Claims the site's R-134a PT chart has errors in vacuum range and provides "corrections" |
| **Review Report** (line 6) | States PT data is "verified against NIST/ASHRAE values match within ~1 psig ✅" |
| **data.js** (actual values) | The values are correct when properly understood (temperatures stored in °F, converted to °C at runtime) |

**Verdict:** The Review Report is correct. The Qwen Chat's analysis is wrong — its "corrected" values for low-temperature R-134a are themselves incorrect (see Error #1 above).

---

## 🟢 MINOR ISSUES

### 6. charge car AC.md — R-134a Usage Period

**File:** `docs/charge car AC.md` (line 3)

States: *"vehicles manufactured roughly between 1994 and 2020"*

**Issue:** Slightly misleading. R-134a is still widely used in vehicles manufactured after 2020. The transition to R-1234yf is gradual and market-dependent. Many 2021-2026 vehicles still use R-134a, especially outside North America and Europe.

---

### 7. Video Transcript — Subjective Claim About Cooling Performance

**File:** `docs/from videos/من_افضل_في_التبريد_غاز_22_او_410-hCjjIQ7GOEU.srt`

The speaker states R-410A has better cooling than R-22. While R-410A does operate at higher pressures and has a lower boiling point (-51.4°C vs -40.8°C), "better cooling" depends on system design, not just the refrigerant. This is a personal opinion, not a technical fact.

---

## ✅ What IS Correct (Verified)

| Item | Status |
|------|--------|
| `data.js` PT charts for all 4 refrigerants (R-134a, R-22, R-410A, R-32) | ✅ Verified against NIST/ASHRAE |
| `data.js` boiling points (R-134a −26.1°C, R-22 −40.8°C, R-410A −51.4°C, R-32 −51.7°C) | ✅ Correct |
| `data.js` critical temperatures and pressures | ✅ Correct |
| `data.js` molecular weights, ODP, GWP values | ✅ Correct |
| `Review Report` verification data — matches `data.js` when interpolating correctly | ✅ Consistent |
| `data.js` R-410A composition (50% R-32, 50% R-125) | ✅ Correct |
| Video transcript: R-410A = R-32 + R-125 (50/50) | ✅ Correct |
| Video transcript: R-32 and R-22 are single-component refrigerants | ✅ Correct |
| Video transcript: Blends (R-410A, R-407C) must be charged as liquid (cylinder inverted) | ✅ Correct |
| Video transcript: Pure refrigerants (R-22, R-32) charged as gas (cylinder upright) | ✅ Correct |
| Video transcript: Rotary compressors can accept liquid refrigerant | ✅ Correct |
| `AC Common Knowledge.txt` diagnostic procedures | ✅ Technically sound |