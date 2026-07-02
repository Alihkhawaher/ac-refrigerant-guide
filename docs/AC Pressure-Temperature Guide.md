# AC Pressure-Temperature Diagnostic Guide

## How Temperature Tells You What Pressure Should Be

Every refrigerant has a **fixed relationship between temperature and pressure** at its saturation (boiling/condensing) point. This is called the **Pressure-Temperature (P-T) relationship**. By measuring temperatures at various points in the AC system, you can determine what the pressures *should* be — and diagnose problems when they don't match.

---

## 1. The Core Concept: Saturation Temperature

When a refrigerant is **boiling** (evaporating) or **condensing**, its temperature and pressure are locked together. If you know one, you can look up the other on a P-T chart.

- **In the evaporator** (low-pressure side): The refrigerant boils at a temperature determined by the suction pressure.
- **In the condenser** (high-pressure side): The refrigerant condenses at a temperature determined by the discharge pressure.

**Key rule:** If you measure a pressure, the P-T chart tells you the saturation temperature. If you measure a temperature, the P-T chart tells you the saturation pressure.

---

## 2. R-134a Saturation Pressure-Temperature Table (Selected Values)

This table shows the **saturation pressure** for R-134a at various temperatures. This is the pressure at which R-134a boils or condenses at a given temperature.

| Temp (°F) | Temp (°C) | Pressure (psig) |
|-----------|-----------|-----------------|
| -15       | -26.1     | 0.0             |
| -10       | -23.3     | 1.9             |
| -5        | -20.6     | 4.1             |
| 0         | -17.8     | 6.5             |
| 5         | -15.0     | 9.1             |
| 10        | -12.2     | 11.9            |
| 15        | -9.4      | 15.0            |
| 20        | -6.7      | 18.4            |
| 25        | -3.9      | 22.1            |
| 30        | -1.1      | 26.1            |
| 35        | 1.7       | 30.4            |
| 40        | 4.4       | 35.0            |
| 45        | 7.2       | 40.1            |
| 50        | 10.0      | 45.4            |
| 55        | 12.8      | 51.2            |
| 60        | 15.6      | 57.4            |
| 65        | 18.3      | 64.0            |
| 70        | 21.1      | 71.1            |
| 75        | 23.9      | 78.7            |
| 80        | 26.7      | 86.7            |
| 85        | 29.4      | 95.2            |
| 90        | 32.2      | 104.3           |
| 95        | 35.0      | 113.9           |
| 100       | 37.8      | 124.2           |
| 105       | 40.6      | 135.0           |
| 110       | 43.3      | 146.4           |
| 115       | 46.1      | 158.4           |
| 120       | 48.9      | 171.2           |
| 125       | 51.7      | 184.6           |
| 130       | 54.4      | 198.7           |
| 135       | 57.2      | 213.6           |
| 140       | 60.0      | 229.2           |
| 145       | 62.8      | 245.7           |
| 150       | 65.6      | 262.9           |

*Note: All pressures in gauge pressure (psig). Values at -15°F are approximately atmospheric. Data verified against NIST Chemistry WebBook and ASHRAE Fundamentals.*

**How to use this table:** If you measure the **suction pressure** at 35 psig, look it up — the corresponding saturation temperature is approximately **40°F (4.4°C)**. This tells you the refrigerant is boiling at 40°F inside the evaporator.

---

## 3. The Three Key Diagnostic Methods

### Method A: Superheat (for Fixed Orifice / Piston Systems)

**What it tells you:** Whether the evaporator is receiving the right amount of refrigerant.

**How to measure:**
1. Measure the **suction pressure** (low-side gauge) at the evaporator outlet.
2. Use the P-T chart to find the **saturation temperature** for that pressure.
3. Measure the **actual suction line temperature** with a pipe-clamp thermometer at the evaporator outlet.
4. **Superheat = Actual Suction Line Temperature − Saturation Temperature**

**Example:**
- Suction pressure reads **35 psig** → Saturation temp = **40°F** (from PT chart)
- Suction line temperature reads **55°F**
- Superheat = 55°F − 40°F = **15°F**

**What the values mean:**

| Superheat | Indicates |
|-----------|-----------|
| Too Low (below 5°F) | Too much refrigerant (overcharge) — risk of liquid slugging the compressor |
| Normal (8–15°F) | Correct charge for most systems |
| Too High (above 20°F) | Too little refrigerant (undercharge) — system is starving |

*Target superheat varies by manufacturer. Common targets: 8–15°F for automotive R-134a systems.*

---

### Method B: Subcooling (for TXV / Expansion Valve Systems)

**What it tells you:** Whether the condenser is properly converting all vapor to liquid.

**How to measure:**
1. Measure the **liquid line pressure** (high-side gauge) at the condenser outlet.
2. Use the P-T chart to find the **saturation temperature** for that pressure.
3. Measure the **actual liquid line temperature** with a pipe-clamp thermometer at the condenser outlet.
4. **Subcooling = Saturation Temperature − Actual Liquid Line Temperature**

**Example:**
- High-side pressure reads **200 psig** → Saturation temp = **130°F** (from PT chart)
- Liquid line temperature reads **118°F**
- Subcooling = 130°F − 118°F = **12°F**

**What the values mean:**

| Subcooling | Indicates |
|------------|-----------|
| Too Low (below 5°F) | Not enough refrigerant — vapor may be reaching the expansion device |
| Normal (8–15°F) | Correct charge |
| Too High (above 20°F) | Overcharged or restricted condenser airflow |

---

### Method C: Approach Temperature (Quick Check)

**What it tells you:** A quick way to check charge level without full gauge readings.

**How to measure:**
1. Measure the **outdoor ambient temperature** (in the shade, away from the condenser exhaust).
2. Measure the **liquid line temperature** at the condenser outlet.
3. **Approach = Liquid Line Temperature − Outdoor Ambient Temperature**

**Typical approach values:**

| Outdoor Temp | Expected Approach |
|-------------|-------------------|
| 70°F (21°C) | 10–15°F |
| 80°F (27°C) | 15–20°F |
| 90°F (32°C) | 20–25°F |
| 100°F+ (38°C+) | 25–30°F |

*If the approach is significantly higher, the system may be undercharged or have condenser airflow issues. If significantly lower, it may be overcharged.*

---

## 4. R-134a Automotive System Pressure Chart by Ambient Temperature

This is the most practical reference for automotive AC. These are **expected operating pressures** when the system is running properly:

| Ambient Temp (°F) | Low Side (psig) | High Side (psig) |
|-------------------|-----------------|-------------------|
| 65°F (18°C)       | 25–35           | 135–155           |
| 70°F (21°C)       | 30–40           | 145–160           |
| 75°F (24°C)       | 35–45           | 150–170           |
| 80°F (27°C)       | 38–48           | 175–210           |
| 85°F (29°C)       | 38–48           | 225–250           |
| 90°F (32°C)       | 40–50           | 250–270           |
| 95°F (35°C)       | 40–50           | 275–300           |
| 100°F (38°C)      | 42–52           | 300–325           |
| 105°F (41°C)      | 45–55           | 325–350           |
| 110°F (43°C)      | 45–55           | 350–400           |

**Important notes:**
- These assume the system is running with the AC on max, engine at idle, doors/windows open, and fan on high.
- Humidity affects high-side pressure — higher humidity = higher high-side pressure.
- Do not test when ambient temperature is below 60°F (15°C) — the system won't build enough pressure for accurate readings.

---

## 5. Using Line Temperatures to Diagnose Problems

By measuring temperatures at key points and comparing to pressures, you can identify specific faults:

### Suction Line (Large Pipe, Low Side)

| Suction Line Feel | Possible Cause |
|-------------------|----------------|
| Cold and sweating (40–50°F) | Normal operation |
| Frosting or icing (below 32°F) | Low airflow over evaporator, stuck expansion valve, or overcharge |
| Warm (above 60°F) | Low refrigerant charge, compressor issue, or restriction |
| Ambient temperature | Compressor not running or system completely empty |

### Liquid Line (Small Pipe, High Side)

| Liquid Line Feel | Possible Cause |
|------------------|----------------|
| Warm but not scalding (100–120°F) | Normal operation |
| Very hot (above 150°F) | Overcharged, condenser fan problem, or restricted condenser |
| Cool or ambient temp | Compressor not compressing, very low charge |
| Hot at compressor outlet, cool after restriction | Blockage between those points |

### Discharge Line (Compressor Outlet)

| Discharge Line Temp | Possible Cause |
|---------------------|----------------|
| 150–220°F | Normal range |
| Above 250°F | Low charge, restriction, or condenser fan failure — dangerously high |
| Below 130°F | Compressor not working properly |

---

## 6. Quick Reference: Pressure Interpretation Chart

| Low Side | High Side | Likely Problem |
|----------|-----------|----------------|
| **Normal** | **Normal** | System working properly |
| **Low** | **Low** | Low refrigerant charge — add refrigerant |
| **Low** | **High** | Restriction (expansion valve or orifice tube blocked) |
| **High** | **Low** | Compressor failure (not compressing) |
| **High** | **High** | Overcharged — remove refrigerant |
| **Normal** | **Low** | Compressor wearing out (weak compression) |
| **High** | **Normal** | Evaporator airflow issue (dirty filter, bad blower) |

---

## 7. Static Pressure (Engine Off)

When the AC system is **not running**, the pressure equalizes between high and low sides. This **static pressure** depends entirely on the ambient temperature and tells you if there's refrigerant in the system:

| Ambient Temp (°F) | Expected Static Pressure (psig) |
|-------------------|---------------------------------|
| 65°F              | 50–70                           |
| 70°F              | 60–80                           |
| 75°F              | 70–90                           |
| 80°F              | 80–100                          |
| 85°F              | 90–110                          |
| 90°F              | 100–125                         |
| 95°F              | 115–140                         |
| 100°F             | 130–155                         |
| 110°F             | 160–190                         |

**Rule:** If static pressure is below **25 psi**, the system is too low for the compressor clutch to engage (low-pressure safety switch will prevent it). If static pressure reads **0 psi**, the system is completely empty.

---

## 8. R-1234yf Quick Comparison (Newer Vehicles)

For vehicles using R-1234yf (most 2015+ vehicles), pressures are slightly different:

| Ambient Temp (°F) | Low Side (psig) | High Side (psig) |
|-------------------|-----------------|-------------------|
| 70°F              | 33–43           | 145–159           |
| 80°F              | 43–48           | 173–205           |
| 90°F              | 49–58           | 243–261           |
| 95°F              | 53–58           | 266–289           |

*Note: R-1234yf and R-134a fittings are different sizes to prevent cross-contamination.*

---

## Summary: How Temperature Tells You Pressure

1. **Measure the pressure** → Look up the P-T chart → Get the **saturation temperature** (what temperature the refrigerant is boiling/condensing at)
2. **Measure the actual line temperature** → Compare to the saturation temperature
3. **The difference** tells you:
   - On the **suction side**: How much **superheat** (indicates charge level for fixed orifice systems)
   - On the **liquid side**: How much **subcooling** (indicates charge level for TXV systems)
4. **Ambient temperature** → Look up the expected pressure ranges → Compare to actual gauge readings to diagnose problems

The P-T chart is the bridge between temperature and pressure. Every AC technician's most important reference tool.

---

*Sources: Honeywell Genetron, Arkema Forane, A/C Pro, Parker Hannifin, Ferguson HVAC, Nissens, Freon (Chemours)*