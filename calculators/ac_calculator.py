#!/usr/bin/env python3
"""
AC Refrigerant Pressure-Temperature Calculator & Validator
==========================================================
This script validates all refrigerant P-T data, computes optimal ranges,
and verifies superheat/subcooling calculations used in the HTML guide.

Refrigerants covered: R-134a, R-22, R-410A, R-32
Temperatures in °F (source data), converted to °C for display.
Operating pressure data sourced from hvacptcharts.com, acdirect.com, Chemours.
"""

# ============================================================
# TEMPERATURE CONVERSION
# ============================================================
def f_to_c(f):
    """Convert Fahrenheit to Celsius."""
    return round((f - 32) * 5 / 9, 1)

def c_to_f(c):
    """Convert Celsius to Fahrenheit."""
    return round(c * 9 / 5 + 32, 1)

# ============================================================
# INTERPOLATION (same logic as the HTML JavaScript)
# ============================================================
def interpolate(pt_data, temp_c):
    """Get saturation pressure (psig) from temperature (°C). pt_data is [[tempC, psig], ...]"""
    if temp_c <= pt_data[0][0]:
        return pt_data[0][1]
    if temp_c >= pt_data[-1][0]:
        return pt_data[-1][1]
    for i in range(len(pt_data) - 1):
        if temp_c >= pt_data[i][0] and temp_c <= pt_data[i + 1][0]:
            t0, t1 = pt_data[i][0], pt_data[i + 1][0]
            p0, p1 = pt_data[i][1], pt_data[i + 1][1]
            return round(p0 + (temp_c - t0) / (t1 - t0) * (p1 - p0), 1)
    return 0

def interpolate_reverse(pt_data, psig):
    """Get saturation temperature (°C) from pressure (psig). pt_data is [[tempC, psig], ...]"""
    if psig <= pt_data[0][1]:
        return pt_data[0][0]
    if psig >= pt_data[-1][1]:
        return pt_data[-1][0]
    for i in range(len(pt_data) - 1):
        if psig >= pt_data[i][1] and psig <= pt_data[i + 1][1]:
            p0, p1 = pt_data[i][1], pt_data[i + 1][1]
            t0, t1 = pt_data[i][0], pt_data[i + 1][0]
            return round(t0 + (psig - p0) / (p1 - p0) * (t1 - t0), 1)
    return 0

# ============================================================
# REFRIGERANT DATA (°F → psig, source data)
# ============================================================
REFRIGERANTS_F = {
    "R-134a": {
        "type": "HFC (Pure)",
        "safety": "A1",
        "boiling_f": -14.9,
        "critical_temp_f": 214.0,
        "critical_press_psia": 588.7,
        "pt_f": [
            (-55, -10.0), (-50, -9.2), (-45, -8.3), (-40, -7.3), (-35, -6.1), (-30, -4.8),
            (-25, -3.4), (-20, -1.8), (-15, 0.0), (-10, 1.9), (-5, 4.1), (0, 6.5),
            (5, 9.1), (10, 11.9), (15, 15.0), (20, 18.4), (25, 22.1), (30, 26.1),
            (35, 30.4), (40, 35.0), (45, 40.1), (50, 45.4), (55, 51.2), (60, 57.4),
            (65, 64.0), (70, 71.1), (75, 78.7), (80, 86.7), (85, 95.2), (90, 104.3),
            (95, 113.9), (100, 124.2), (105, 135.0), (110, 146.4), (115, 158.4),
            (120, 171.2), (125, 184.6), (130, 198.7), (135, 213.6), (140, 229.2),
            (145, 245.7), (150, 262.9)
        ],
        "application": "Automotive AC (1994-2020)",
        "oil": "PAG 46 / PAG 100 (Automotive), POE (Stationary)",
        "optimal_low_side_psig": (25, 82),
        "optimal_high_side_psig": (135, 465),
        "superheat_target_f": (5, 15),
        "subcooling_target_f": (5, 12),
    },
    "R-22": {
        "type": "HCFC (Pure)",
        "safety": "A1",
        "boiling_f": -41.5,
        "critical_temp_f": 205.0,
        "critical_press_psia": 723.7,
        "pt_f": [
            (-40, 0.6), (-35, 2.6), (-30, 4.9), (-25, 7.4), (-20, 10.1), (-15, 13.2),
            (-10, 16.4), (-5, 20.0), (0, 23.9), (5, 28.2), (10, 32.7), (15, 37.6),
            (20, 43.0), (25, 48.7), (30, 54.8), (35, 61.5), (40, 68.5), (45, 76.1),
            (50, 83.9), (55, 92.5), (60, 101.4), (65, 111.2), (70, 121.4), (75, 132.1),
            (80, 143.8), (85, 155.5), (90, 168.5), (95, 181.6), (100, 195.7), (105, 210.7),
            (110, 226.2), (115, 242.3), (120, 259.5), (125, 277.0), (130, 295.8),
            (135, 314.9), (140, 335.3), (145, 356.0), (150, 377.9)
        ],
        "application": "Legacy residential AC (banned 2020)",
        "oil": "Mineral Oil (MO) / Alkylbenzene (AB)",
        "optimal_low_side_psig": (58, 105),
        "optimal_high_side_psig": (145, 425),
        "superheat_target_f": (8, 15),
        "subcooling_target_f": (5, 12),
    },
    "R-410A": {
        "type": "HFC Blend (50/50 R-32/R-125)",
        "safety": "A1",
        "boiling_f": -60.6,
        "critical_temp_f": 160.3,
        "critical_press_psia": 710.9,
        "pt_f": [
            (-50, 5.0), (-45, 7.7), (-40, 10.8), (-35, 14.1), (-30, 17.8), (-25, 21.9),
            (-20, 26.3), (-15, 31.2), (-10, 36.5), (-5, 42.2), (0, 48.4), (5, 55.2),
            (10, 62.4), (15, 70.3), (20, 78.7), (25, 87.7), (30, 97.4), (35, 107.7),
            (40, 118.8), (45, 130.6), (50, 143.1), (55, 156.5), (60, 170.7), (65, 185.8),
            (70, 201.7), (75, 218.6), (80, 236.5), (85, 255.4), (90, 275.3), (95, 296.4),
            (100, 318.5), (105, 341.9), (110, 366.5), (115, 392.3), (120, 419.5),
            (125, 448.0), (130, 478.0), (135, 509.5), (140, 542.6), (145, 577.4),
            (150, 613.9)
        ],
        "application": "Residential AC, Heat Pumps",
        "oil": "POE (Polyolester) ISO VG 32 or 46",
        "optimal_low_side_psig": (110, 180),
        "optimal_high_side_psig": (200, 570),
        "superheat_target_f": (8, 15),
        "subcooling_target_f": (8, 14),
    },
    "R-32": {
        "type": "HFC (Pure)",
        "safety": "A2L (mildly flammable)",
        "boiling_f": -61.0,
        "critical_temp_f": 172.6,
        "critical_press_psia": 838.7,
        "pt_f": [
            (-50, 5.2), (-45, 8.0), (-40, 11.0), (-35, 14.4), (-30, 18.2), (-25, 22.3),
            (-20, 26.8), (-15, 31.7), (-10, 37.1), (-5, 42.9), (0, 49.3), (5, 56.1),
            (10, 63.5), (15, 71.4), (20, 80.0), (25, 89.2), (30, 99.1), (35, 109.7),
            (40, 121.0), (45, 133.0), (50, 145.8), (55, 159.5), (60, 174.0), (65, 189.5),
            (70, 205.8), (75, 223.2), (80, 241.5), (85, 260.9), (90, 281.3), (95, 302.9),
            (100, 325.7), (105, 349.6), (110, 374.9), (115, 401.4), (120, 429.3),
            (125, 458.7), (130, 489.5), (135, 521.8), (140, 555.8), (145, 591.4),
            (150, 628.8)
        ],
        "application": "Modern residential AC (A2L flammable)",
        "oil": "POE (Polyolester) ISO VG 32 or 46",
        "optimal_low_side_psig": (115, 185),
        "optimal_high_side_psig": (210, 570),
        "superheat_target_f": (8, 15),
        "subcooling_target_f": (8, 12),
    },
}

# ============================================================
# CONVERT ALL DATA TO °C
# ============================================================
def build_c_data(ref_data):
    """Convert °F PT data to °C and compute derived values."""
    pt_c = [(f_to_c(f), p) for f, p in ref_data["pt_f"]]
    return {
        "name": ref_data.get("name", ""),
        "type": ref_data["type"],
        "safety": ref_data["safety"],
        "boiling_c": f_to_c(ref_data["boiling_f"]),
        "critical_temp_c": f_to_c(ref_data["critical_temp_f"]),
        "critical_press_psia": ref_data["critical_press_psia"],
        "application": ref_data["application"],
        "pt_c": pt_c,
        "optimal_low_side_psig": ref_data["optimal_low_side_psig"],
        "optimal_high_side_psig": ref_data["optimal_high_side_psig"],
        # Superheat/subcooling targets are TEMPERATURE DIFFERENCES, not absolute temps
        # 5°F diff = 2.8°C diff, 15°F diff = 8.3°C diff
        "superheat_target_c_real": (round(ref_data["superheat_target_f"][0] * 5/9, 1), round(ref_data["superheat_target_f"][1] * 5/9, 1)),
        "subcooling_target_c_real": (round(ref_data["subcooling_target_f"][0] * 5/9, 1), round(ref_data["subcooling_target_f"][1] * 5/9, 1)),
    }

# ============================================================
# VALIDATION & TESTING
# ============================================================
def validate_interpolation(name, ref_c_data):
    """Validate that interpolation works correctly for known data points."""
    pt = ref_c_data["pt_c"]
    errors = []
    
    # Test forward interpolation (temp → pressure)
    for i, (t, p) in enumerate(pt):
        calc_p = interpolate(pt, t)
        if abs(calc_p - p) > 0.2:
            errors.append(f"  FAIL: {name} at {t}°C: expected {p} psig, got {calc_p} psig")
    
    # Test reverse interpolation (pressure → temp)
    for i, (t, p) in enumerate(pt):
        calc_t = interpolate_reverse(pt, p)
        if abs(calc_t - t) > 0.5:
            errors.append(f"  FAIL: {name} at {p} psig: expected {t}°C, got {calc_t}°C")
    
    return errors

def validate_known_points(name, ref_data):
    """Validate against known reference values."""
    pt_c = build_c_data(ref_data)["pt_c"]
    results = []
    
    # Known reference points (from NIST/ASHRAE/manufacturer data)
    known = {
        "R-134a": [
            (-17.8, 6.5),   # 0°F → -17.8°C, 6.5 psig (National Refrigerants)
            (21.1, 71.1),   # 70°F → 21.1°C, 71.1 psig (Carrier PT chart)
            (37.8, 124.2),  # 100°F → 37.8°C, 124 psig (Carrier)
        ],
        "R-22": [
            (4.4, 68.5),    # 40°F → 4.4°C, 68.5 psig
            (21.1, 121.4),  # 70°F → 21.1°C, 121.4 psig
            (-17.8, 23.9),  # 0°F → -17.8°C, 23.9 psig
        ],
        "R-410A": [
            (-17.8, 48.4),  # 0°F → -17.8°C, 48.4 psig
            (21.1, 201.7),  # 70°F → 21.1°C, 201.7 psig
            (37.8, 318.5),  # 100°F → 37.8°C, 318.5 psig (hvacptcharts.com)
        ],
        "R-32": [
            (-17.8, 49.3),  # 0°F → -17.8°C, 49.3 psig (Chemours/Opteon)
            (-40.0, 11.0),  # -40°F → -40°C, 11.0 psig (Chemours)
            (-34.4, 18.2),  # -30°F → -34.4°C, 18.2 psig (Chemours)
        ],
    }
    
    if name in known:
        for temp_c, expected_psig in known[name]:
            calc_p = interpolate(pt_c, temp_c)
            diff = abs(calc_p - expected_psig)
            status = "✅" if diff < 2.0 else "⚠️" if diff < 5.0 else "❌"
            results.append(f"  {status} {name} at {temp_c}°C: expected ~{expected_psig} psig, got {calc_p} psig (diff: {diff:.1f})")
    
    return results

def compute_superheat(ref_name, suction_psig, line_temp_c):
    """Compute superheat for a given refrigerant, pressure, and line temp."""
    ref = REFRIGERANTS_F[ref_name]
    pt_c = [(f_to_c(f), p) for f, p in ref["pt_f"]]
    sat_temp = interpolate_reverse(pt_c, suction_psig)
    superheat = line_temp_c - sat_temp
    return sat_temp, superheat

def compute_subcooling(ref_name, liquid_psig, line_temp_c):
    """Compute subcooling for a given refrigerant, pressure, and line temp."""
    ref = REFRIGERANTS_F[ref_name]
    pt_c = [(f_to_c(f), p) for f, p in ref["pt_f"]]
    sat_temp = interpolate_reverse(pt_c, liquid_psig)
    subcooling = sat_temp - line_temp_c
    return sat_temp, subcooling

# ============================================================
# MAIN: VALIDATE & PRINT REPORT
# ============================================================
def main():
    print("=" * 80)
    print("AC REFRIGERANT CALCULATOR — VALIDATION & REFERENCE REPORT")
    print("=" * 80)
    
    # Build °C data for all refrigerants
    all_c_data = {}
    for name, ref in REFRIGERANTS_F.items():
        ref["name"] = name
        all_c_data[name] = build_c_data(ref)
    
    # ---- SECTION 1: P-T Data Validation ----
    print("\n" + "=" * 80)
    print("1. INTERPOLATION VALIDATION")
    print("=" * 80)
    for name, cdata in all_c_data.items():
        errors = validate_interpolation(name, cdata)
        if errors:
            print(f"\n{name}: ERRORS FOUND:")
            for e in errors:
                print(e)
        else:
            print(f"\n{name}: ✅ All interpolation tests passed")
    
    # ---- SECTION 2: Known Reference Points ----
    print("\n" + "=" * 80)
    print("2. KNOWN REFERENCE POINT VALIDATION")
    print("=" * 80)
    for name, ref in REFRIGERANTS_F.items():
        ref["name"] = name
        results = validate_known_points(name, ref)
        print(f"\n{name}:")
        for r in results:
            print(r)
    
    # ---- SECTION 3: P-T Table (°C) for Each Refrigerant ----
    print("\n" + "=" * 80)
    print("3. PRESSURE-TEMPERATURE TABLES (°C → PSIG)")
    print("=" * 80)
    for name, cdata in all_c_data.items():
        print(f"\n--- {name} ({cdata['type']}) ---")
        print(f"Boiling Point: {cdata['boiling_c']}°C | Critical: {cdata['critical_temp_c']}°C / {cdata['critical_press_psia']} psia")
        print(f"{'Temp (°C)':>12} {'Pressure (PSIG)':>16} {'Phase':>10}")
        print("-" * 42)
        for t, p in cdata["pt_c"]:
            phase = "Vacuum" if p < 0 else ("Low" if p < 15 else ("Medium" if p < 100 else "High"))
            print(f"{t:>10.1f}°C {p:>14.1f} PSIG {phase:>10}")
    
    # ---- SECTION 4: Optimal Slider Ranges ----
    print("\n" + "=" * 80)
    print("4. OPTIMAL SLIDER RANGES & TARGETS")
    print("=" * 80)
    for name, cdata in all_c_data.items():
        ref = REFRIGERANTS_F[name]
        lo_min, lo_max = cdata["optimal_low_side_psig"]
        hi_min, hi_max = cdata["optimal_high_side_psig"]
        sh_min, sh_max = cdata["superheat_target_c_real"]
        sc_min, sc_max = cdata["subcooling_target_c_real"]
        
        # Convert optimal pressures to temps
        pt_c = cdata["pt_c"]
        lo_temp_min = interpolate_reverse(pt_c, lo_min)
        lo_temp_max = interpolate_reverse(pt_c, lo_max)
        hi_temp_min = interpolate_reverse(pt_c, hi_min)
        hi_temp_max = interpolate_reverse(pt_c, hi_max)
        
        print(f"\n--- {name} ({cdata['application']}) ---")
        print(f"  Safety Class: {cdata['safety']}")
        print(f"  Boiling Point: {cdata['boiling_c']}°C")
        print(f"  ")
        print(f"  LOW SIDE (Suction):")
        print(f"    Full-Range Pressure: {lo_min}–{lo_max} PSIG (across all ambients)")
        print(f"    Corresponding Saturation Temp: {lo_temp_min:.1f}–{lo_temp_max:.1f}°C")
        print(f"    Evaporator Coil Temp: ~{lo_temp_min:.0f}–{lo_temp_max:.0f}°C")
        print(f"    Expected Vent Air: ~{lo_temp_min+2:.0f}–{lo_temp_max+7:.0f}°C")
        print(f"  ")
        print(f"  HIGH SIDE (Discharge):")
        print(f"    Full-Range Pressure: {hi_min}–{hi_max} PSIG (across all ambients)")
        print(f"    Corresponding Saturation Temp: {hi_temp_min:.1f}–{hi_temp_max:.1f}°C")
        print(f"    Condenser Temp: ~{hi_temp_min:.0f}–{hi_temp_max:.0f}°C")
        print(f"  ")
        print(f"  SUPERHEAT (Fixed Orifice Systems):")
        print(f"    Target: {sh_min}–{sh_max}°C ({ref['superheat_target_f'][0]}–{ref['superheat_target_f'][1]}°F)")
        print(f"    Too Low (<{sh_min}°C): Overcharged, risk of liquid slugging compressor")
        print(f"    Normal ({sh_min}–{sh_max}°C): System properly charged")
        print(f"    Too High (>{sh_max}°C): Undercharged, weak cooling, compressor may overheat")
        print(f"  ")
        print(f"  SUBCOOLING (TXV/EEV Systems):")
        print(f"    Target: {sc_min}–{sc_max}°C ({ref['subcooling_target_f'][0]}–{ref['subcooling_target_f'][1]}°F)")
        print(f"    Too Low (<{sc_min}°C): Undercharged, flash gas in liquid line")
        print(f"    Normal ({sc_min}–{sc_max}°C): System properly charged")
        print(f"    Too High (>{sc_max}°C): Overcharged or restriction in liquid line")
    
    # ---- SECTION 5: Superheat/Subcooling Test Cases ----
    print("\n" + "=" * 80)
    print("5. SUPERHEAT/SUBCOOLING TEST CASES")
    print("=" * 80)
    
    test_cases = [
        # (ref_name, test_type, pressure_psig, line_temp_c, expected_result)
        # R-134a targets: SH 5-15°F = 2.8-8.3°C, SC 5-12°F = 2.8-6.7°C
        ("R-134a", "superheat", 35, 10, "Normal"),       # Sat ~4.4°C, SH = 5.6°C → Normal (within 2.8-8.3)
        ("R-134a", "superheat", 35, 6, "Low"),            # Sat ~4.4°C, SH = 1.6°C → Low (< 2.8)
        ("R-134a", "superheat", 35, 25, "Very High"),     # Sat ~4.4°C, SH = 20.6°C → Very High
        ("R-134a", "subcooling", 200, 43, "High"),        # Sat ~54.6°C, SC = 11.6°C → High (> 6.7)
        ("R-134a", "subcooling", 200, 54, "Low"),         # Sat ~54.6°C, SC = 0.6°C → Low (< 2.8)
        # R-22 targets: SH 8-15°F = 4.4-8.3°C, SC 5-12°F = 2.8-6.7°C
        ("R-22", "superheat", 60, 8, "Normal"),           # Sat ~1°C, SH = 7°C → Normal (within 4.4-8.3)
        ("R-22", "superheat", 60, 2, "Low"),              # Sat ~1°C, SH = 1°C → Low (< 4.4)
        ("R-22", "superheat", 60, 25, "Very High"),       # Sat ~1°C, SH = 24°C → Very High
        # R-410A targets: SH 8-15°F = 4.4-8.3°C, SC 8-14°F = 4.4-7.8°C
        ("R-410A", "superheat", 120, 15, "High"),         # Sat ~3°C, SH = 12°C → High (> 8.3)
        ("R-410A", "subcooling", 350, 33, "High"),        # Sat ~41.5°C, SC = 8.5°C → High (> 7.8)
        # R-32 targets: SH 8-15°F = 4.4-8.3°C, SC 8-12°F = 4.4-6.7°C
        ("R-32", "superheat", 125, 15, "High"),           # Sat ~5°C, SH = 10°C → High (> 8.3)
        ("R-32", "subcooling", 350, 33, "High"),          # Sat ~40.6°C, SC = 7.6°C → High (> 6.7)
    ]
    
    for ref_name, test_type, pressure, line_temp, expected in test_cases:
        ref = REFRIGERANTS_F[ref_name]
        if test_type == "superheat":
            sat, value = compute_superheat(ref_name, pressure, line_temp)
            sh_lo, sh_hi = ref["superheat_target_f"]
            sh_lo_c, sh_hi_c = round(sh_lo * 5/9, 1), round(sh_hi * 5/9, 1)
            if value < 0:
                status = "DANGER"
            elif value < sh_lo_c:
                status = "Low"
            elif value <= sh_hi_c:
                status = "Normal"
            elif value <= sh_hi_c + 8:
                status = "High"
            else:
                status = "Very High"
        else:
            sat, value = compute_subcooling(ref_name, pressure, line_temp)
            sc_lo, sc_hi = ref["subcooling_target_f"]
            sc_lo_c, sc_hi_c = round(sc_lo * 5/9, 1), round(sc_hi * 5/9, 1)
            if value < 0:
                status = "DANGER"
            elif value < sc_lo_c:
                status = "Low"
            elif value <= sc_hi_c:
                status = "Normal"
            elif value <= sc_hi_c + 6:
                status = "High"
            else:
                status = "Very High"
        
        match = "✅" if status == expected else f"❌ (expected {expected})"
        print(f"  {ref_name} {test_type}: P={pressure}psig, T_line={line_temp}°C → "
              f"Sat={sat:.1f}°C, {test_type.title()}={value:.1f}°C → {status} {match}")
    
    # ---- SECTION 6: Operating Pressure Reference (CORRECTED from research) ----
    print("\n" + "=" * 80)
    print("6. OPERATING PRESSURE REFERENCE (by ambient temperature)")
    print("   Sources: hvacptcharts.com, acdirect.com, Chemours/Opteon")
    print("=" * 80)
    
    # CORRECTED operating data based on deep research
    # R-134a: Automotive AC (data is correct for automotive at idle)
    # R-22: Residential AC - raised low-side values
    # R-410A: Residential AC - major correction on low-side values
    # R-32: Residential AC - raised low-side values
    operating_data = {
        "R-134a (Automotive)": [
            (18, 65, "25–35", "135–155"), (21, 70, "30–40", "145–160"),
            (24, 75, "35–45", "150–170"), (27, 80, "38–48", "175–210"),
            (29, 85, "38–48", "225–250"), (32, 90, "40–50", "250–270"),
            (35, 95, "40–50", "275–300"), (38, 100, "42–52", "300–325"),
            (43, 110, "45–55", "350–400"),
            (48, 118, "45–55", "370–420"), (52, 126, "48–58", "390–445"),
            (55, 131, "48–58", "410–465"),
        ],
        "R-22 (Residential — Fixed Orifice/Capillary Tube)": [
            (18, 65, "55–65", "145–175"), (21, 70, "57–67", "170–200"),
            (24, 75, "58–70", "200–240"), (27, 80, "62–75", "230–270"),
            (29, 85, "65–78", "250–290"), (32, 90, "68–82", "275–320"),
            (35, 95, "70–85", "290–340"), (38, 100, "73–88", "320–370"),
            (43, 110, "78–95", "340–390"),
            (48, 118, "82–100", "360–410"), (52, 126, "85–102", "380–425"),
            (55, 131, "88–105", "400–445"),
        ],
        "R-410A (Residential)": [
            (18, 65, "110–130", "200–240"), (21, 70, "115–135", "235–260"),
            (24, 75, "118–138", "250–305"), (27, 80, "120–140", "280–330"),
            (29, 85, "120–140", "300–355"), (32, 90, "125–145", "330–380"),
            (35, 95, "125–145", "350–430"), (38, 100, "130–150", "380–450"),
            (43, 110, "135–160", "420–500"),
            (48, 118, "140–165", "450–530"), (52, 126, "145–170", "480–555"),
            (55, 131, "150–175", "500–570"),
        ],
        "R-32 (Residential)": [
            (18, 65, "115–135", "210–250"), (21, 70, "120–140", "240–280"),
            (24, 75, "122–142", "260–310"), (27, 80, "125–145", "290–340"),
            (29, 85, "125–145", "310–365"), (32, 90, "128–150", "340–395"),
            (35, 95, "130–155", "360–430"), (38, 100, "135–160", "390–460"),
            (43, 110, "140–165", "430–500"),
            (48, 118, "145–170", "460–530"), (52, 126, "150–175", "490–555"),
            (55, 131, "155–180", "510–575"),
        ],
    }
    
    for name, data in operating_data.items():
        print(f"\n--- {name} ---")
        print(f"  {'Ambient':>12} {'Low Side (PSIG)':>18} {'High Side (PSIG)':>18}  Notes")
        print(f"  {'-'*65}")
        for c, f, lo, hi in data:
            notes = ""
            if c >= 48:
                notes = "🔥 T3 climate"
            elif c >= 43:
                notes = "Hot"
            print(f"  {c:>3}°C / {f:>3}°F     {lo:>15}     {hi:>15}  {notes}")
    
    # ---- SECTION 7: Static Pressure Reference ----
    print("\n" + "=" * 80)
    print("7. STATIC PRESSURE REFERENCE (System Off)")
    print("=" * 80)
    
    static_data = {
        "R-134a": [
            (18, 65, 50, 70), (21, 70, 60, 80), (24, 75, 70, 90),
            (27, 80, 80, 100), (29, 85, 90, 110), (32, 90, 100, 125),
            (35, 95, 115, 140), (38, 100, 130, 155), (43, 110, 160, 190),
            (48, 118, 175, 205), (52, 126, 195, 225), (55, 131, 210, 240),
        ],
        "R-22": [
            (18, 65, 80, 100), (21, 70, 95, 115), (24, 75, 110, 135),
            (27, 80, 120, 150), (29, 85, 135, 165), (32, 90, 150, 180),
            (35, 95, 165, 200), (38, 100, 180, 220), (43, 110, 215, 260),
            (48, 118, 235, 280), (52, 126, 260, 305), (55, 131, 280, 325),
        ],
        "R-410A": [
            (18, 65, 130, 155), (21, 70, 145, 175), (24, 75, 165, 195),
            (27, 80, 180, 215), (29, 85, 195, 235), (32, 90, 215, 260),
            (35, 95, 240, 290), (38, 100, 265, 320), (43, 110, 320, 385),
            (48, 118, 345, 415), (52, 126, 380, 450), (55, 131, 400, 470),
        ],
        "R-32": [
            (18, 65, 135, 160), (21, 70, 150, 180), (24, 75, 170, 200),
            (27, 80, 185, 220), (29, 85, 200, 240), (32, 90, 220, 265),
            (35, 95, 245, 295), (38, 100, 270, 325), (43, 110, 330, 395),
            (48, 118, 355, 425), (52, 126, 390, 460), (55, 131, 410, 480),
        ],
    }
    
    for name, data in static_data.items():
        print(f"\n--- {name} ---")
        print(f"  {'Ambient':>12} {'Static Pressure (PSIG)':>24}")
        print(f"  {'-'*38}")
        for c, f, lo, hi in data:
            print(f"  {c}°C / {f}°F     {lo}–{hi}")
    
    # ---- SECTION 8: Cross-Check Against Research Sources ----
    print("\n" + "=" * 80)
    print("8. CROSS-CHECK AGAINST RESEARCH SOURCES")
    print("   (Verifying operating ranges match hvacptcharts.com / acdirect.com)")
    print("=" * 80)
    
    # R-410A validation against research
    print("\n--- R-410A Operating Pressure Validation ---")
    r410a_research = [
        (21, 70, (110, 135), (235, 260), "acdirect.com"),
        (24, 75, (115, 135), (250, 305), "hvacptcharts.com"),
        (29, 85, (118, 140), (300, 355), "hvacptcharts.com"),
        (35, 95, (125, 145), (350, 430), "hvacptcharts.com"),
        (41, 105, (130, 155), (400, 490), "hvacptcharts.com"),
    ]
    
    r410a_op = operating_data["R-410A (Residential)"]
    for amb_c, amb_f, (lo_r_min, lo_r_max), (hi_r_min, hi_r_max), source in r410a_research:
        # Find matching or closest entry in our data
        best = None
        for c, f, lo_str, hi_str in r410a_op:
            if c == amb_c or (best is None and abs(c - amb_c) < 3):
                lo_parts = lo_str.split("–")
                hi_parts = hi_str.split("–")
                lo_min, lo_max = int(lo_parts[0]), int(lo_parts[1])
                hi_min, hi_max = int(hi_parts[0]), int(hi_parts[1])
                best = (c, lo_min, lo_max, hi_min, hi_max)
        
        if best:
            c, lo_min, lo_max, hi_min, hi_max = best
            lo_ok = "✅" if lo_min >= lo_r_min - 5 and lo_max <= lo_r_max + 5 else "❌"
            hi_ok = "✅" if hi_min >= hi_r_min - 10 and hi_max <= hi_r_max + 10 else "❌"
            print(f"  {amb_c}°C ({amb_f}°F) [{source}]:")
            print(f"    Low:  research {lo_r_min}-{lo_r_max}, guide {lo_min}-{lo_max} {lo_ok}")
            print(f"    High: research {hi_r_min}-{hi_r_max}, guide {hi_min}-{hi_max} {hi_ok}")
    
    # R-32 validation
    print("\n--- R-32 Operating Pressure Validation ---")
    r32_research = [
        (29, 85, (110, 130), (280, 320), "unitskit.com"),
        (35, 95, (120, 155), (330, 450), "unitskit.com / thefurnaceoutlet"),
        (41, 105, (130, 160), (380, 440), "unitskit.com"),
    ]
    
    r32_op = operating_data["R-32 (Residential)"]
    for amb_c, amb_f, (lo_r_min, lo_r_max), (hi_r_min, hi_r_max), source in r32_research:
        best = None
        for c, f, lo_str, hi_str in r32_op:
            if c == amb_c or (best is None and abs(c - amb_c) < 3):
                lo_parts = lo_str.split("–")
                hi_parts = hi_str.split("–")
                lo_min, lo_max = int(lo_parts[0]), int(lo_parts[1])
                hi_min, hi_max = int(hi_parts[0]), int(hi_parts[1])
                best = (c, lo_min, lo_max, hi_min, hi_max)
        
        if best:
            c, lo_min, lo_max, hi_min, hi_max = best
            lo_ok = "✅" if lo_min >= lo_r_min - 5 and lo_max <= lo_r_max + 5 else "❌"
            hi_ok = "✅" if hi_min >= hi_r_min - 10 and hi_max <= hi_r_max + 10 else "❌"
            print(f"  {amb_c}°C ({amb_f}°F) [{source}]:")
            print(f"    Low:  research {lo_r_min}-{lo_r_max}, guide {lo_min}-{lo_max} {lo_ok}")
            print(f"    High: research {hi_r_min}-{hi_r_max}, guide {hi_min}-{hi_max} {hi_ok}")
    
    # ---- SECTION 9: Summary ----
    print("\n" + "=" * 80)
    print("9. SUMMARY — QUICK REFERENCE")
    print("=" * 80)
    print(f"\n{'Refrigerant':<12} {'Boiling':>8} {'Low Side':>14} {'High Side':>14} {'Superheat':>14} {'Subcooling':>14}")
    print(f"{'':12} {'(°C)':>8} {'(PSIG)':>14} {'(PSIG)':>14} {'Target °C':>14} {'Target °C':>14}")
    print("-" * 80)
    for name, cdata in all_c_data.items():
        lo = cdata["optimal_low_side_psig"]
        hi = cdata["optimal_high_side_psig"]
        sh = cdata["superheat_target_c_real"]
        sc = cdata["subcooling_target_c_real"]
        print(f"{name:<12} {cdata['boiling_c']:>8.1f} {lo[0]}–{lo[1]:<8} {hi[0]}–{hi[1]:<8} {sh[0]}–{sh[1]:<8} {sc[0]}–{sc[1]:<8}")
    
    print("\n" + "=" * 80)
    print("VALIDATION COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()