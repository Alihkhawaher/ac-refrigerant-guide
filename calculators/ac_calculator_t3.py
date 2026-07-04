#!/usr/bin/env python3
"""
AC Refrigerant Calculator — T3 Climate Edition (50°C+ / High Humidity)
======================================================================
Uses WAGNER EQUATION (NIST standard) for accurate saturation pressure
calculations across the full temperature range (-50°C to 70°C+).

Sources:
  - NIST Chemistry WebBook (Thermodynamic properties)
  - ASHRAE Standard 34-2019 (Safety classifications)
  - ASHRAE Fundamentals (Saturation properties)
  - IEC 60335-2-40 (T1/T2/T3 climate classification)
  - hvacptcharts.com (Operating pressures)
  - acdirect.com (R-410A operating ranges)
  - NIST pub_id=860880 (R-22 vs R-410A at high ambient, 27.8°C to 54.4°C)
  - DOE/OSTI (T3/Hot/Extreme test conditions)
  - Purdue IRACC (R-32 vs R-410A at elevated temps up to 55°C)

Temperature: °F (source data) → °C (display)
Pressure: PSIG (gauge, 14.696 psi = 1 atm)

Pressure unit reference:
  PSIA = Absolute pressure (0 = perfect vacuum)
  PSIG = Gage pressure (0 = atmospheric, 14.696 psi at sea level)
  PSIG = PSIA − 14.696

Change History:
  2026-07-02  Initial version with Antoine equation coefficients
  2026-07-04  Replaced Antoine equation with Wagner equation (NIST standard)
              - Antoine had 60-420 PSIG error for R-22, R-410A, R-32
              - Wagner achieves <1 PSIG error across full range (-50°C to 70°C)
              - Removed broken Clausius-Clapeyron function (called undefined antoine_pressure_mmhg)
              - Removed ANTOINE_COEFFS, replaced with WAGNER_COEFFS
              - Fixed IEC 60335-2-40 climate classification labels
                (was: T1=Standard, T2=Tropical — corrected to: T2=Temperate, T1=Hot, T3=Very Hot)
              - Added PSIA/PSIG documentation in header
"""

import math

# ============================================================
# WAGNER EQUATION COEFFICIENTS (for saturation pressure)
# ============================================================
# Form: ln(P/Pc) = (Tc/T) * (a1*τ + a2*τ^1.5 + a3*τ^2.5 + a4*τ^5)
# where τ = 1 - T/Tc, T in Kelvin, P in PSIA
# Source: Fitted against verified NIST/ASHRAE PT data (max error <1 PSIG)
# Valid range: -50°C to 70°C (full operating range for all refrigerants)

WAGNER_COEFFS = {
    "R-134a": {
        "Tc_K": 374.25, "Pc_psia": 588.7,
        "a1": -7.612814, "a2": 1.705008, "a3": -2.567787, "a4": -3.191659,
        "T_critical_C": 101.06,
    },
    "R-22": {
        "Tc_K": 369.25, "Pc_psia": 723.7,
        "a1": -7.822968, "a2": 4.298791, "a3": -7.621977, "a4": 17.997288,
        "T_critical_C": 96.15,
    },
    "R-410A": {
        "Tc_K": 344.45, "Pc_psia": 710.9,
        "a1": -7.436140, "a2": 1.494765, "a3": -1.896475, "a4": -3.607729,
        "T_critical_C": 71.34,
    },
    "R-32": {
        "Tc_K": 351.25, "Pc_psia": 838.7,
        "a1": -7.467744, "a2": 1.752880, "a3": -2.052875, "a4": -2.032588,
        "T_critical_C": 78.11,
    },
}


# ============================================================
# SATURATION PRESSURE FORMULAS (Wagner Equation)
# ============================================================

def sat_pressure_psig(ref_name, temp_c):
    """
    Calculate saturation pressure (PSIG) for a refrigerant at temp_c.
    Uses Wagner equation: ln(P/Pc) = (Tc/T) * (a1*τ + a2*τ^1.5 + a3*τ^2.5 + a4*τ^5)
    where τ = 1 - T/Tc, T in Kelvin
    Returns PSIG (gauge pressure, 14.696 psi = 1 atm).
    Max error < 1 PSIG vs verified NIST data across full range.
    """
    coeff = WAGNER_COEFFS[ref_name]
    Tc_K = coeff["Tc_K"]
    Pc_psia = coeff["Pc_psia"]
    T_critical_C = coeff["T_critical_C"]

    if temp_c >= T_critical_C:
        return float('inf')

    T_K = temp_c + 273.15
    tau = 1.0 - T_K / Tc_K

    ln_Pr = (Tc_K / T_K) * (
        coeff["a1"] * tau +
        coeff["a2"] * tau ** 1.5 +
        coeff["a3"] * tau ** 2.5 +
        coeff["a4"] * tau ** 5
    )

    p_psia = Pc_psia * math.exp(ln_Pr)
    p_psig = p_psia - 14.696

    return round(p_psig, 1)


# ============================================================
# VERIFIED PT DATA TABLE (from NIST/ASHRAE — used as ground truth)
# ============================================================
# Source: NIST Chemistry WebBook, ASHRAE Fundamentals, manufacturer PT charts
# All values in °F → PSIG

VERIFIED_PT_DATA = {
    "R-134a": [
        (-55, -10.0), (-50, -9.2), (-45, -8.3), (-40, -7.3), (-35, -6.1), (-30, -4.8),
        (-25, -3.4), (-20, -1.8), (-15, 0.0), (-10, 1.9), (-5, 4.1), (0, 6.5),
        (5, 9.1), (10, 11.9), (15, 15.0), (20, 18.4), (25, 22.1), (30, 26.1),
        (35, 30.4), (40, 35.0), (45, 40.1), (50, 45.4), (55, 51.2), (60, 57.4),
        (65, 64.0), (70, 71.1), (75, 78.7), (80, 86.7), (85, 95.2), (90, 104.3),
        (95, 113.9), (100, 124.2), (105, 135.0), (110, 146.4), (115, 158.4),
        (120, 171.2), (125, 184.6), (130, 198.7), (135, 213.6), (140, 229.2),
        (145, 245.7), (150, 262.9)
    ],
    "R-22": [
        (-40, 0.6), (-35, 2.6), (-30, 4.9), (-25, 7.4), (-20, 10.1), (-15, 13.2),
        (-10, 16.4), (-5, 20.0), (0, 23.9), (5, 28.2), (10, 32.7), (15, 37.6),
        (20, 43.0), (25, 48.7), (30, 54.8), (35, 61.5), (40, 68.5), (45, 76.1),
        (50, 83.9), (55, 92.5), (60, 101.4), (65, 111.2), (70, 121.4), (75, 132.1),
        (80, 143.8), (85, 155.5), (90, 168.5), (95, 181.6), (100, 195.7), (105, 210.7),
        (110, 226.2), (115, 242.3), (120, 259.5), (125, 277.0), (130, 295.8),
        (135, 314.9), (140, 335.3), (145, 356.0), (150, 377.9)
    ],
    "R-410A": [
        (-50, 5.0), (-45, 7.7), (-40, 10.8), (-35, 14.1), (-30, 17.8), (-25, 21.9),
        (-20, 26.3), (-15, 31.2), (-10, 36.5), (-5, 42.2), (0, 48.4), (5, 55.2),
        (10, 62.4), (15, 70.3), (20, 78.7), (25, 87.7), (30, 97.4), (35, 107.7),
        (40, 118.8), (45, 130.6), (50, 143.1), (55, 156.5), (60, 170.7), (65, 185.8),
        (70, 201.7), (75, 218.6), (80, 236.5), (85, 255.4), (90, 275.3), (95, 296.4),
        (100, 318.5), (105, 341.9), (110, 366.5), (115, 392.3), (120, 419.5),
        (125, 448.0), (130, 478.0), (135, 509.5), (140, 542.6), (145, 577.4),
        (150, 613.9)
    ],
    "R-32": [
        (-50, 5.2), (-45, 8.0), (-40, 11.0), (-35, 14.4), (-30, 18.2), (-25, 22.3),
        (-20, 26.8), (-15, 31.7), (-10, 37.1), (-5, 42.9), (0, 49.3), (5, 56.1),
        (10, 63.5), (15, 71.4), (20, 80.0), (25, 89.2), (30, 99.1), (35, 109.7),
        (40, 121.0), (45, 133.0), (50, 145.8), (55, 159.5), (60, 174.0), (65, 189.5),
        (70, 205.8), (75, 223.2), (80, 241.5), (85, 260.9), (90, 281.3), (95, 302.9),
        (100, 325.7), (105, 349.6), (110, 374.9), (115, 401.4), (120, 429.3),
        (125, 458.7), (130, 489.5), (135, 521.8), (140, 555.8), (145, 591.4),
        (150, 628.8)
    ],
}

# ============================================================
# INTERPOLATION FUNCTIONS
# ============================================================

def f_to_c(f):
    return round((f - 32) * 5 / 9, 1)

def c_to_f(c):
    return round(c * 9 / 5 + 32, 1)

def build_c_table(pt_f_data):
    """Convert °F PT data to °C table."""
    return [(f_to_c(f), p) for f, p in pt_f_data]

def interpolate_table(pt_c, temp_c):
    """Linear interpolation in °C table. Returns PSIG."""
    if temp_c <= pt_c[0][0]:
        return pt_c[0][1]
    if temp_c >= pt_c[-1][0]:
        return pt_c[-1][1]
    for i in range(len(pt_c) - 1):
        if temp_c >= pt_c[i][0] and temp_c <= pt_c[i + 1][0]:
            t0, t1 = pt_c[i][0], pt_c[i + 1][0]
            p0, p1 = pt_c[i][1], pt_c[i + 1][1]
            return round(p0 + (temp_c - t0) / (t1 - t0) * (p1 - p0), 1)
    return 0

def interpolate_reverse_table(pt_c, psig):
    """Reverse interpolation: PSIG → °C."""
    if psig <= pt_c[0][1]:
        return pt_c[0][0]
    if psig >= pt_c[-1][1]:
        return pt_c[-1][0]
    for i in range(len(pt_c) - 1):
        if psig >= pt_c[i][1] and psig <= pt_c[i + 1][1]:
            p0, p1 = pt_c[i][1], pt_c[i + 1][1]
            t0, t1 = pt_c[i][0], pt_c[i + 1][0]
            return round(t0 + (psig - p0) / (p1 - p0) * (t1 - t0), 1)
    return 0

# ============================================================
# OPERATING PRESSURE RANGES (from research — includes T3 data)
# ============================================================
# Format: [ambient_C, ambient_F, low_min, low_max, high_min, high_max]
# Sources: hvacptcharts.com, acdirect.com, NIST, DOE/OSTI T3 test data
# High-side values derived from PT chart saturation pressure at condenser temp
# (ambient + 12-15°C approach for residential, +15-20°C for automotive)
OPERATING_RANGES = {
    "R-134a": {
        "type": "Automotive",
        "ranges": [
            (18, 65, 25, 35, 135, 160), (21, 70, 27, 37, 150, 175),
            (24, 75, 29, 39, 160, 190), (27, 80, 30, 40, 175, 210),
            (29, 85, 32, 42, 185, 225), (32, 90, 33, 43, 200, 240),
            (35, 95, 34, 44, 215, 255), (38, 100, 35, 45, 230, 270),
            (43, 110, 36, 46, 250, 290), (48, 118, 37, 47, 265, 310),
            (52, 126, 38, 48, 280, 325), (55, 131, 40, 50, 290, 340),
        ],
    },
    "R-22": {
        "type": "Residential",
        "ranges": [
            (18, 65, 58, 68, 145, 175), (21, 70, 60, 70, 170, 200),
            (24, 75, 62, 72, 200, 240), (27, 80, 65, 75, 230, 270),
            (29, 85, 65, 78, 250, 290), (32, 90, 68, 80, 275, 320),
            (35, 95, 70, 82, 290, 340), (38, 100, 72, 85, 310, 360),
            (43, 110, 75, 90, 340, 390), (48, 118, 78, 92, 365, 410),
            (52, 126, 80, 95, 375, 425), (55, 131, 82, 98, 390, 440),
        ],
    },
    "R-410A": {
        "type": "Residential",
        "ranges": [
            (18, 65, 110, 125, 200, 240), (21, 70, 112, 128, 235, 265),
            (24, 75, 115, 130, 260, 305), (27, 80, 115, 132, 290, 335),
            (29, 85, 118, 135, 310, 360), (32, 90, 118, 135, 340, 395),
            (35, 95, 120, 138, 370, 435), (38, 100, 120, 138, 400, 465),
            (41, 105, 122, 140, 425, 490), (43, 110, 122, 142, 445, 510),
            (46, 115, 125, 145, 470, 535), (48, 118, 125, 145, 490, 555),
            (52, 126, 125, 148, 520, 575), (55, 131, 128, 150, 540, 585),
        ],
    },
    "R-32": {
        "type": "Residential",
        "ranges": [
            (18, 65, 115, 130, 210, 255), (21, 70, 118, 132, 245, 285),
            (24, 75, 118, 135, 270, 315), (27, 80, 120, 135, 300, 350),
            (29, 85, 120, 138, 320, 375), (32, 90, 122, 140, 350, 405),
            (35, 95, 122, 140, 380, 445), (38, 100, 125, 142, 410, 475),
            (41, 105, 125, 143, 435, 500), (43, 110, 125, 145, 455, 520),
            (46, 115, 128, 148, 475, 540), (48, 118, 128, 148, 495, 560),
            (52, 126, 128, 150, 525, 585), (55, 131, 130, 155, 550, 595),
        ],
    },
}

# ============================================================
# T3 CLIMATE ANALYSIS ENGINE
# ============================================================

def interpolate_operating(operating_ranges, amb_c):
    """Interpolate operating pressure ranges for a given ambient temperature."""
    ranges = operating_ranges
    if amb_c <= ranges[0][0]:
        return ranges[0][2], ranges[0][3], ranges[0][4], ranges[0][5]
    if amb_c >= ranges[-1][0]:
        return ranges[-1][2], ranges[-1][3], ranges[-1][4], ranges[-1][5]
    for i in range(len(ranges) - 1):
        if amb_c >= ranges[i][0] and amb_c <= ranges[i+1][0]:
            t0, t1 = ranges[i][0], ranges[i+1][0]
            ratio = (amb_c - t0) / (t1 - t0)
            lo_min = round(ranges[i][2] + ratio * (ranges[i+1][2] - ranges[i][2]))
            lo_max = round(ranges[i][3] + ratio * (ranges[i+1][3] - ranges[i][3]))
            hi_min = round(ranges[i][4] + ratio * (ranges[i+1][4] - ranges[i][4]))
            hi_max = round(ranges[i][5] + ratio * (ranges[i+1][5] - ranges[i][5]))
            return lo_min, lo_max, hi_min, hi_max
    return ranges[-1][2], ranges[-1][3], ranges[-1][4], ranges[-1][5]


def analyze_t3_climate(ref_name, amb_c, indoor_c=27.0):
    """
    Comprehensive T3 climate analysis for a given refrigerant and ambient temperature.
    Returns a dictionary with all analysis results.
    """
    pt_c = build_c_table(VERIFIED_PT_DATA[ref_name])
    coeff = WAGNER_COEFFS[ref_name]
    
    # 1. Saturation pressure at ambient (for static pressure reference)
    sat_p_amb = interpolate_table(pt_c, amb_c)
    
    # 2. Operating pressures
    op_data = OPERATING_RANGES[ref_name]["ranges"]
    lo_min, lo_max, hi_min, hi_max = interpolate_operating(op_data, amb_c)
    
    # 3. Evaporator and condenser saturation temperatures
    lo_mid = (lo_min + lo_max) / 2
    hi_mid = (hi_min + hi_max) / 2
    evap_temp = interpolate_reverse_table(pt_c, lo_mid)
    cond_temp = interpolate_reverse_table(pt_c, hi_mid)
    
    # 4. Rule of thumb: condenser sat temp ≈ 11°C (20°F) above ambient
    cond_approach = cond_temp - amb_c
    
    # 5. Discharge temperature estimate
    # Based on Purdue research: discharge = cond_temp + 30 + 0.8*amb
    discharge_temp = cond_temp + 30 + round(amb_c * 0.8)
    
    # 6. COP degradation estimate
    # From REHVA/DOE research: COP drops ~45% from 35°C to 55°C
    # Linear approximation: COP_factor = 1.0 - 0.0225 * (amb_c - 35)
    if amb_c > 35:
        cop_factor = max(0.5, 1.0 - 0.0225 * (amb_c - 35))
    else:
        cop_factor = min(1.2, 1.0 + 0.01 * (35 - amb_c))
    
    # 7. Expected vent temperature
    vent_low = round(evap_temp + 2)
    vent_high = round(evap_temp + 7)
    
    # 8. IEC 60335-2-40 Climate classification
    # T2: max 35°C (temperate), T1: max 43°C (hot), T3: max 52°C (extreme heat)
    if amb_c <= 35:
        climate = "T2 (Temperate)"
    elif amb_c <= 43:
        climate = "T1 (Hot)"
    elif amb_c <= 52:
        climate = "T3 (Very Hot)"
    else:
        climate = "Beyond T3 (Extreme)"
    
    # 9. Humidity effect estimate
    humidity_note = "High humidity increases high-side pressure by 5-10%"
    
    # 10. Equipment safety check
    T_crit = coeff["T_critical_C"]
    safety_margin = T_crit - cond_temp
    
    return {
        "refrigerant": ref_name,
        "ambient_c": amb_c,
        "ambient_f": round(amb_c * 9/5 + 32),
        "indoor_c": indoor_c,
        "climate_class": climate,
        "sat_pressure_at_amb": sat_p_amb,
        "low_side_range": (lo_min, lo_max),
        "high_side_range": (hi_min, hi_max),
        "evaporator_temp": round(evap_temp, 1),
        "condenser_temp": round(cond_temp, 1),
        "condenser_approach": round(cond_approach, 1),
        "discharge_temp_est": discharge_temp,
        "cop_degradation": round((1 - cop_factor) * 100, 1),
        "vent_temp_range": (vent_low, vent_high),
        "critical_temp": T_crit,
        "critical_safety_margin": round(safety_margin, 1),
        "humidity_note": humidity_note,
    }


# ============================================================
# MAIN REPORT
# ============================================================

def main():
    print("=" * 80)
    print("  AC REFRIGERANT CALCULATOR — T3 CLIMATE EDITION (50C+ / High Humidity)")
    print("  Formula: Wagner Equation (NIST standard, max error <1 PSIG)")
    print("  Data: NIST, ASHRAE, IEC 60335-2-40, hvacptcharts.com, DOE/OSTI T3 data")
    print("=" * 80)
    
    # ---- SECTION 1: Formula Verification ----
    print("\n" + "-" * 80)
    print("1. FORMULA VERIFICATION — Wagner Equation vs NIST Data")
    print("-" * 80)
    
    test_points = {
        "R-134a": [(-17.8, 6.5), (0, 26.1), (21.1, 71.1), (37.8, 124.2), (50, 171.2), (65.6, 262.9)],
        "R-22": [(-17.8, 23.9), (0, 54.8), (21.1, 121.4), (37.8, 195.7), (50, 259.5), (65.6, 377.9)],
        "R-410A": [(-17.8, 48.4), (0, 97.4), (21.1, 201.7), (37.8, 318.5), (50, 419.5), (65.6, 613.9)],
        "R-32": [(-17.8, 49.3), (0, 99.1), (21.1, 205.8), (37.8, 325.7), (50, 429.3), (65.6, 628.8)],
    }
    
    for ref, points in test_points.items():
        print(f"\n  {ref}:")
        for temp_c, expected_psig in points:
            calc_p = sat_pressure_psig(ref, temp_c)
            diff = abs(calc_p - expected_psig)
            status = "OK" if diff < 1.0 else "~OK" if diff < 5.0 else "ERR"
            print(f"    {temp_c:>6.1f} C: NIST={expected_psig:>7.1f}  Wagner={calc_p:>8.1f}  diff={diff:>5.2f}  {status}")
    
    # ---- SECTION 2: T3 Climate Analysis (50C) ----
    print("\n" + "-" * 80)
    print("2. T3 CLIMATE ANALYSIS AT 50C AMBIENT (High Humidity Region)")
    print("-" * 80)
    
    for ref in ["R-22", "R-410A", "R-32"]:
        result = analyze_t3_climate(ref, 50.0)
        print(f"\n  +-- {ref} at 50C ({result['ambient_f']}F) ---")
        print(f"  | Climate:     {result['climate_class']}")
        print(f"  | Low Side:    {result['low_side_range'][0]}-{result['low_side_range'][1]} PSIG")
        print(f"  | High Side:   {result['high_side_range'][0]}-{result['high_side_range'][1]} PSIG")
        print(f"  | Evaporator:  ~{result['evaporator_temp']}C")
        print(f"  | Condenser:   ~{result['condenser_temp']}C  ({result['condenser_approach']}C above ambient)")
        print(f"  | Discharge:   ~{result['discharge_temp_est']}C estimated")
        print(f"  | Vent Air:    ~{result['vent_temp_range'][0]}-{result['vent_temp_range'][1]}C expected")
        print(f"  | COP Loss:    ~{result['cop_degradation']}% vs 35C baseline")
        print(f"  | Critical T:  {result['critical_temp']}C (safety margin: {result['critical_safety_margin']}C)")
        print(f"  | {result['humidity_note']}")
        print(f"  +--")
    
    # ---- SECTION 3: Full Range Analysis (18C to 55C) ----
    print("\n" + "-" * 80)
    print("3. COMPLETE OPERATING PRESSURE TABLE (18C to 55C)")
    print("-" * 80)
    
    test_ambients = [18, 21, 24, 27, 29, 32, 35, 38, 41, 43, 46, 48, 52, 55]
    
    for ref in ["R-134a", "R-22", "R-410A", "R-32"]:
        op_type = OPERATING_RANGES[ref]["type"]
        print(f"\n  -- {ref} ({op_type}) --")
        print(f"  {'Ambient':>10} {'Low Side':>15} {'High Side':>15} {'EvapC':>8} {'CondC':>8} {'COP':>6} {'Notes'}")
        print(f"  {'-'*10} {'-'*15} {'-'*15} {'-'*8} {'-'*8} {'-'*6} {'-'*10}")
        
        for amb in test_ambients:
            result = analyze_t3_climate(ref, amb)
            lo = f"{result['low_side_range'][0]}-{result['low_side_range'][1]}"
            hi = f"{result['high_side_range'][0]}-{result['high_side_range'][1]}"
            evap = f"~{result['evaporator_temp']}"
            cond = f"~{result['condenser_temp']}"
            cop = f"-{result['cop_degradation']:.0f}%"
            notes = ""
            if amb >= 48:
                notes = "T3"
            elif amb >= 43:
                notes = "Hot"
            elif amb >= 35:
                notes = "Warm"
            print(f"  {amb:>5}C / {result['ambient_f']:>3}F {lo:>15} {hi:>15} {evap:>8} {cond:>8} {cop:>6} {notes}")
    
    # ---- SECTION 4: Equipment Requirements for T3 ----
    print("\n" + "-" * 80)
    print("4. EQUIPMENT REQUIREMENTS FOR T3 CLIMATE (50C+)")
    print("-" * 80)
    
    print("""
  IEC 60335-2-40 Climate Classifications:
  +----------+------------+---------------------------------------------+
  | Class    | Max Ambient| Examples                                     |
  +----------+------------+---------------------------------------------+
  | T2       | 35C        | Cool/temperate climate zones                 |
  | T1       | 43C        | Hot climate (most Middle East normal summer) |
  | T3       | 52C        | Extreme heat (Saudi Arabia, Gulf states)     |
  +----------+------------+---------------------------------------------+

  T3-Specific Equipment Requirements:
  - Compressor: Rated for continuous operation at 52C+ ambient
  - Condenser: Oversized (20-30% more surface area than T1)
  - Fan motor: Higher HP for increased airflow at high ambient
  - Refrigerant lines: Must handle 500+ PSIG (R-410A) or 575+ PSIG (R-32)
  - Electrical: All components rated for sustained high-ambient operation
  - Expansion valve: Properly sized for high-ambient pressure differential
  """)
    
    # ---- SECTION 5: Superheat/Subcooling Targets ----
    print("-" * 80)
    print("5. SUPERHEAT/SUBCOOLING TARGETS (adjusted for T3)")
    print("-" * 80)
    
    print("""
  +--------------+--------------------+---------------------+
  | Refrigerant  | Superheat Target   | Subcooling Target   |
  +--------------+--------------------+---------------------+
  | R-134a       | 5-15F (3-8C)       | 5-12F (3-7C)        |
  | R-22         | 8-15F (4-8C)       | 5-12F (3-7C)        |
  | R-410A       | 8-15F (4-8C)       | 8-14F (4-8C)        |
  | R-32         | 8-15F (4-8C)       | 8-12F (4-7C)        |
  +--------------+--------------------+---------------------+

  T3 Adjustment Notes:
  - Superheat: Standard targets remain valid at high ambient
  - Subcooling: May be 1-2F lower at extreme temps (less condenser capacity)
  - Do NOT overcharge to compensate for high ambient - causes high head pressure
  - At 50C+, a slightly undercharged system is safer than overcharged
  - Always charge by WEIGHT, never by pressure alone in extreme heat
  """)
    
    # ---- SECTION 6: Comparison Table ----
    print("-" * 80)
    print("6. REFRIGERANT COMPARISON FOR T3 CLIMATE")
    print("-" * 80)
    
    print(f"\n  {'Property':<30} {'R-22':<15} {'R-410A':<15} {'R-32':<15}")
    print(f"  {'-'*30} {'-'*15} {'-'*15} {'-'*15}")
    
    row_data = {}
    for ref in ["R-22", "R-410A", "R-32"]:
        row_data[ref] = analyze_t3_climate(ref, 50.0)
    
    print(f"  {'Safety Class':<30} {'A1':<15} {'A1':<15} {'A2L':<15}")
    print(f"  {'GWP':<30} {'1810':<15} {'2088':<15} {'675':<15}")
    print(f"  {'Boiling Point':<30} {'-40.8C':<15} {'-51.4C':<15} {'-51.7C':<15}")
    
    r22 = row_data["R-22"]
    r410 = row_data["R-410A"]
    r32 = row_data["R-32"]
    
    print(f"  {'High Side at 50C':<30} {str(r22['high_side_range'][0])+'-'+str(r22['high_side_range'][1]):<15} {str(r410['high_side_range'][0])+'-'+str(r410['high_side_range'][1]):<15} {str(r32['high_side_range'][0])+'-'+str(r32['high_side_range'][1]):<15}")
    print(f"  {'Condenser Temp at 50C':<30} {'~'+str(r22['condenser_temp'])+'C':<15} {'~'+str(r410['condenser_temp'])+'C':<15} {'~'+str(r32['condenser_temp'])+'C':<15}")
    print(f"  {'Safety Margin to Critical':<30} {str(r22['critical_safety_margin'])+'C':<15} {str(r410['critical_safety_margin'])+'C':<15} {str(r32['critical_safety_margin'])+'C':<15}")
    print(f"  {'COP Degradation vs 35C':<30} {'~'+str(r22['cop_degradation'])+'%':<15} {'~'+str(r410['cop_degradation'])+'%':<15} {'~'+str(r32['cop_degradation'])+'%':<15}")
    
    print(f"\n  Key Findings from Research:")
    print(f"  - R-32 offers ~6.5% more capacity than R-410A at 50C (Purdue IRACC)")
    print(f"  - R-32 has better COP than R-410A at high ambient (especially >46C)")
    print(f"  - R-32 discharge temp runs higher - compressor thermal management critical")
    print(f"  - R-410A systems being phased out (EPA AIM Act, Jan 2025)")
    print(f"  - New equipment uses R-32 (Daikin, Mitsubishi, LG) or R-454B")
    
    # ---- SECTION 7: Static Pressure at Extreme Heat ----
    print("\n" + "-" * 80)
    print("7. STATIC PRESSURE AT EXTREME TEMPERATURES (System Off)")
    print("-" * 80)
    
    print(f"\n  {'Ambient':>12} {'R-22':>15} {'R-410A':>15} {'R-32':>15}")
    print(f"  {'-'*12} {'-'*15} {'-'*15} {'-'*15}")
    
    for amb in [18, 24, 29, 35, 41, 43, 48, 52, 55]:
        r22_p = sat_pressure_psig("R-22", amb)
        r410_p = sat_pressure_psig("R-410A", amb)
        r32_p = sat_pressure_psig("R-32", amb)
        print(f"  {amb:>5}C / {round(amb*9/5+32):>3}F  {r22_p:>7.1f} PSIG  {r410_p:>7.1f} PSIG  {r32_p:>7.1f} PSIG")
    
    print("\n  Note: Static pressure = saturation pressure at ambient temp (system off, equalized)")
    print("  Below 25 PSIG static = low pressure switch prevents compressor start")
    
    print("\n" + "=" * 80)
    print("  T3 CLIMATE ANALYSIS COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    main()