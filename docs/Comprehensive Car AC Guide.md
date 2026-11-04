# Comprehensive Automotive Air Conditioning Guide

## A Complete Technical Reference for Car AC Systems — Pressure, Parts, Compressors, Diagnostics, and Troubleshooting

---

> **Document Version:** 1.0
> **Last Updated:** July 2026
> **Purpose:** Professional-grade reference covering all aspects of automotive air conditioning systems, including pressure specifications, component descriptions, compressor types, dual-evaporator systems, refrigerant and oil specifications, and comprehensive troubleshooting procedures.

---

## Table of Contents

1. [How Automotive AC Works](#1-how-automotive-ac-works)
2. [System Types and Configurations](#2-system-types-and-configurations)
3. [AC System Components — Complete Guide](#3-ac-system-components--complete-guide)
4. [Refrigerant Specifications](#4-refrigerant-specifications)
5. [Compressor Oil Specifications](#5-compressor-oil-specifications)
6. [Pressure Charts — R-134a and R-1234yf](#6-pressure-charts--r-134a-and-r-1234yf)
7. [Static Pressure Reference](#7-static-pressure-reference)
8. [Pressure-Temperature Relationship (P-T Charts)](#8-pressure-temperature-relationship-p-t-charts)
9. [Compressor Types and Diagnostics](#9-compressor-types-and-diagnostics)
10. [Dual-Evaporator / Rear Cooler Systems](#10-dual-evaporator--rear-cooler-systems)
11. [Diagnostic Methods — Superheat and Subcooling](#11-diagnostic-methods--superheat-and-subcooling)
12. [Pressure Interpretation and Troubleshooting](#12-pressure-interpretation-and-troubleshooting)
13. [Common Symptoms and Solutions](#13-common-symptoms-and-solutions)
14. [Service Procedures](#14-service-procedures)
15. [Safety and Environmental Regulations](#15-safety-and-environmental-regulations)
16. [Sources and References](#16-sources-and-references)

---

## 1. How Automotive AC Works

### The Basic Principle

Automotive air conditioning does **not** create cold air. It removes heat from the cabin air and rejects that heat outside the vehicle. The system works by exploiting the scientific principle that when a liquid evaporates into a gas, it absorbs heat; when a gas is compressed back into a liquid, it releases heat.

*Source: AutoZone — "How Your Car's AC Works" (autozone.com/diy/climate-control/how-does-car-ac-work)*

### The Refrigerant Cycle

The system moves refrigerant through a continuous loop, changing it between liquid and gas states:

1. **Compression** — The compressor pressurizes low-pressure refrigerant gas into high-pressure, high-temperature gas
2. **Condensation** — The hot, high-pressure gas flows to the condenser, where outside air cools it and it becomes a liquid
3. **Expansion** — The liquid passes through the expansion valve or orifice tube, where pressure drops dramatically and the liquid becomes an extremely cold mist
4. **Evaporation** — The cold refrigerant enters the evaporator, absorbs heat from cabin air, and evaporates back into a gas
5. **Return** — The low-pressure gas returns to the compressor, and the cycle repeats

*Source: RY A/C Compressors — "Complete Guide to Car AC System Components" (rycompressors.com); AutoZone*

### The Key Insight

A/C diagnosis is measurement-driven. The system can only do a few things: compress, condense, expand, evaporate, and move air. A proper inspection verifies each stage and confirms whether the issue is a mass/pressure problem, an airflow/heat rejection problem, a restriction problem, or a control problem.

*Source: Motronix — "Automotive Climate Control Systems (A/C Logic & Failures)" (motronix.net/expertise/ac-systems)*

---

## 2. System Types and Configurations

There are **three types** of automotive AC systems. While they differ in design, the concept remains similar:

### Type 1: Orifice Tube and Accumulator System

- Uses an **orifice tube** (fixed metering device) before the evaporator
- Uses an **accumulator** (with desiccant) before the compressor on the low-pressure side
- The orifice tube is a fixed restriction that meters refrigerant flow
- Common in GM, Ford, and Chrysler vehicles

### Type 2: Expansion Valve (TXV) and Receiver-Drier System

- Uses a **thermal expansion valve (TXV)** before the evaporator
- Uses a **receiver-drier** (with desiccant) between the condenser and expansion valve on the high-pressure side
- The TXV is a variable metering device that responds to temperature
- Common in Toyota, Honda, Nissan, and European vehicles

### Type 3: Combination System (Dual/Rear AC)

- Found in **SUVs, vans, and trucks** with rear air conditioning
- May use a combination of orifice tube and expansion valve
- Features additional evaporator, expansion valve, and sometimes a solenoid valve for the rear circuit
- Examples: Toyota Sequoia, Land Cruiser, Chevy Tahoe/Suburban, Ford Expedition

> **Important Rule:** A vehicle uses **either** an orifice tube **or** a thermal expansion valve — not both. Similarly, it uses **either** an accumulator **or** a receiver-drier — not both. However, dual-AC vehicles may use a combination with additional components for the rear circuit.

*Source: AutoZone — "How Your Car's AC Works"; CarParts.com — "Automotive Air Conditioning Systems"*

---

## 3. AC System Components — Complete Guide

### 3.1 Compressor

The compressor is the most critical and most expensive component. It is a pump driven by the engine's serpentine belt that pressurizes refrigerant gas and circulates it through the entire system.

**Function:** Takes in low-pressure refrigerant gas from the evaporator, compresses it into high-pressure, high-temperature gas, and pushes it to the condenser.

**Types:**
- **Piston (reciprocating)** — uses pistons driven by a swash plate; most common
- **Scroll** — uses two spiral-shaped scrolls; quieter, smoother
- **Rotary vane** — uses a spinning rotor with sliding vanes; compact

**Sub-types by control:**
- **Fixed displacement** — always moves the same amount of refrigerant per revolution; controlled by an electromagnetic clutch that cycles on/off
- **Variable displacement** — adjusts piston stroke length via swash plate angle; runs continuously without cycling

*Sources: RY A/C Compressors; Rick's Free Auto Repair Advice — "The 3 Types of Automotive AC Compressors" (ricksfreeautorepairadvice.com); CarParts.com — "Bad A/C Compressor: Symptoms, Diagnosis, Replacement Cost" (carparts.com)*

### 3.2 Condenser

The condenser looks like a small radiator and is mounted in front of the vehicle's cooling radiator, behind the grille.

**Function:** Cools the hot, high-pressure gas from the compressor. As outside air passes over the condenser fins, heat transfers from the refrigerant to the air, causing the refrigerant to condense into a high-pressure liquid.

**Types:**
- **Serpentine style** — single tube that snakes back and forth; can be flushed
- **Parallel flow / micro-channel** — multiple parallel tubes; more efficient; cannot be flushed, must be replaced if contaminated

**Common problems:**
- Road debris damage (punctures thin tubing)
- Internal clogging (debris from compressor failure)
- Corrosion (salt, road chemicals, age)
- Bent fins (reduces airflow)

*Sources: RY A/C Compressors; AutoZone; Denso A/C Components Catalog*

### 3.3 Evaporator

The evaporator is located inside the dashboard, behind the glove box area.

**Function:** This is where actual cooling happens. The cold, low-pressure refrigerant mist enters the evaporator, absorbs heat from the cabin air blown across it by the blower motor, and evaporates back into a gas. The evaporator also dehumidifies the air — moisture condenses on the cold evaporator fins and drains out through a condensate drain.

**Common problems:**
- Internal leaks (corrosion, fatigue)
- External clogging (dirt, debris from missing cabin filter)
- Mold/mildew growth (moisture + organic material)

*Sources: RY A/C Compressors; CarParts.com; AutoZone*

### 3.4 Thermal Expansion Valve (TXV)

Located between the condenser and evaporator (on the high-pressure to low-pressure transition).

**Function:** A variable metering device that controls the flow of liquid refrigerant into the evaporator. It has a sensing bulb attached to the suction line that measures temperature and adjusts the valve opening accordingly.

**How it works:**
- When the evaporator is warm (high cooling demand), the sensing bulb signals the valve to open wider
- When the evaporator is cold (low cooling demand), the sensing bulb signals the valve to close down
- This maintains proper superheat at the evaporator outlet

**Common problems:**
- Stuck closed → no refrigerant flow, no cooling, very low suction pressure
- Stuck open → too much refrigerant flow, frost on suction line, high suction pressure
- Sensing bulb loose or uninsulated → incorrect readings, erratic operation

**Used with:** Receiver-drier (on the high-pressure side)

*Sources: AutoZone; Denso Technical Documentation; CarParts.com*

### 3.5 Orifice Tube

Located in the liquid line between the condenser and evaporator.

**Function:** A fixed-restriction device with a precisely sized hole that meters refrigerant flow. It creates a pressure drop that converts high-pressure liquid refrigerant into a low-pressure mist before it enters the evaporator.

**Characteristics:**
- No moving parts — simple and reliable
- Cannot adjust to varying conditions (unlike TXV)
- System relies on compressor cycling (fixed displacement) or accumulator to manage refrigerant flow
- Failure mode: clogging from debris or contamination

**Used with:** Accumulator (on the low-pressure side)

*Sources: AutoZone; CarParts.com*

### 3.6 Receiver-Drier

**Location:** High-pressure side, between the condenser and expansion valve.

**Function:** Stores excess liquid refrigerant and removes moisture and contaminants from the refrigerant using a desiccant (drying agent). Some have a sight glass on top to observe refrigerant condition.

**When used:** In systems with a thermal expansion valve (TXV).

*Sources: AutoZone; Denso A/C Components Catalog; CarParts.com*

### 3.7 Accumulator

**Location:** Low-pressure side, between the evaporator and compressor.

**Function:** Stores excess refrigerant and removes moisture via a desiccant bag. Also serves as a liquid separator — prevents liquid refrigerant from reaching the compressor (which can only handle gas).

**When used:** In systems with an orifice tube.

*Sources: AutoZone; CarParts.com; RY A/C Compressors*

### 3.8 Compressor Clutch

**Function:** An electromagnetic clutch mounted on the compressor pulley. When the AC is turned on, voltage is applied to the clutch coil, creating a magnetic field that pulls the clutch plate against the pulley, engaging the compressor shaft.

**Common problems:**
- Clutch coil failure (open or shorted winding)
- Worn clutch plate (excessive air gap)
- Bearing failure

> **Note:** Variable displacement compressors often do **not** have a traditional clutch. The pulley spins continuously, and a torque-limiting decoupler provides a fail-safe if the compressor seizes.

*Sources: Rick's Free Auto Repair Advice; CarParts.com*

### 3.9 Other Components

| Component | Function |
|---|---|
| **Pressure switches/sensors** | High/low pressure safety cutoffs; prevent compressor damage |
| **Evaporator temperature sensor** | Prevents evaporator freezing; controls compressor cycling or displacement |
| **Cabin air filter** | Filters air before it reaches the evaporator |
| **Condenser fan** | Pulls air through condenser for heat rejection |
| **Blower motor** | Pushes cabin air across evaporator |
| **O-rings and seals** | Prevent refrigerant leaks at connections |
| **Schrader valves** | Service ports for charging and diagnostics |
| **Solenoid valve** | Controls refrigerant flow in dual-zone/dual-evaporator systems |
| **Inline filter** | Removes debris before refrigerant reaches the expansion device |

*Sources: AutoZone; Denso A/C Components Catalog; Nissens*

---

## 4. Refrigerant Specifications

### R-12 (Historical — Discontinued)

- **Chemical name:** Dichlorodifluoromethane (CFC-12)
- **Used in:** Vehicles manufactured before 1994
- **Status:** Banned under the Montreal Protocol due to ozone depletion
- **Oil type:** Mineral oil
- **Note:** If a system originally used R-12, it can be retrofitted to R-134a

*Source: CarParts.com — "Automotive Air Conditioning Systems"*

### R-134a (Standard — 1994 to ~2020)

- **Chemical name:** 1,1,1,2-Tetrafluoroethane (HFC-134a)
- **Used in:** Most vehicles from 1994 to approximately 2020
- **Global Warming Potential (GWP):** 1,430
- **Oil type:** PAG oil (Polyalkylene Glycol) — viscosity specified by compressor manufacturer
- **Charge amounts:** Vary by vehicle; typically 16–32 oz for single-AC systems, up to 48–64 oz for dual-AC systems. Always refer to the under-hood specification sticker.

*Sources: A/C Pro (acprocold.com); AutoZone; CarParts.com*

### R-1234yf (Current Standard — 2015+)

- **Chemical name:** 2,3,3,3-Tetrafluoropropene (HFO-1234yf)
- **Used in:** Most new vehicles from approximately 2015 onward (mandated in EU from 2017)
- **Global Warming Potential (GWP):** 4 (vs. 1,430 for R-134a)
- **Oil type:** PAG YF (specific formulation for R-1234yf)
- **Key difference:** Service fittings are **different sizes** than R-134a to prevent cross-contamination. You **cannot** mix R-1234yf and R-134a.

*Sources: A/C Pro; MAHLE Aftermarket; Motronix*

### R-152a (Alternative — Limited Use)

- **Chemical name:** 1,1-Difluoroethane
- **GWP:** 124
- **Status:** Used as a component in some blends; not widely adopted as a primary automotive refrigerant
- **Note:** Sometimes discussed as a potential future alternative

*Source: MAHLE Aftermarket — "Automotive Climate Control" PDF*

---

## 5. Compressor Oil Specifications

### Why Oil Matters

The oil travels with the refrigerant through the system. It lubricates the compressor, carries heat, and protects internal components. If the oil level is too low, the compressor fails from lack of lubrication. If too high, cooling efficiency is reduced. The wrong oil type can cause electrical or mechanical damage.

> **Critical:** Most automotive AC systems hold only **4–8 fluid ounces** (120–240 mL) of oil. Overfilling can cause catastrophic pressure problems.

*Sources: Rick's Free Auto Repair Advice; A/C Pro; Denso*

### PAG Oil (Polyalkylene Glycol)

The standard oil for R-134a and R-1234yf systems. It is a synthetic oil available in different viscosities:

| Viscosity Grade | Typical Application |
|---|---|
| **PAG 46** | Lower viscosity; used in many Denso, some GM, some Asian compressors |
| **PAG 100** | Medium viscosity; used in many compressors across makes |
| **PAG 150** | Higher viscosity; used in some Harrison/GM, some Ford compressors |
| **PAG YF** | Specific formulation for R-1234yf systems |

> **Important:** The PAG viscosity required is determined by the **compressor manufacturer**, not the vehicle manufacturer. Denso makes compressors for many different vehicle brands, so different cars may use the same PAG specification. Always check the vehicle's service manual or the compressor specification.

*Source: A/C Pro — "What is PAG and Ester Oil?" (acprocold.com)*

### Ester Oil

- A synthetic lubricant used primarily in systems retrofitted from R-12 to R-134a
- Comes in only one viscosity (no viscosity numbers like PAG)
- Chemical properties do not change when in contact with trace R-12 contaminants
- Not commonly used in vehicles newer than 1995 (with some European exceptions)

*Source: A/C Pro — "What is PAG and Ester Oil?"*

### Mineral Oil

- Used in original R-12 systems
- Not compatible with R-134a or R-1234yf
- If retrofitting from R-12, mineral oil should be drained and replaced with PAG or ester oil

*Source: CarParts.com; AutoZone*

### Oil Specification Summary by Refrigerant

| Refrigerant | Oil Type | Notes |
|---|---|---|
| R-12 | Mineral Oil | Original specification |
| R-134a | PAG 46, 100, or 150 | Viscosity depends on compressor manufacturer |
| R-1234yf | PAG YF | Specific formulation; do not substitute |
| Retrofitted R-12 → R-134a | Ester Oil | Compatible with residual R-12 |

*Sources: A/C Pro; Denso; MAHLE Aftermarket*

---

## 6. Pressure Charts — R-134a and R-1234yf

### How to Use These Charts

These charts show the **expected operating pressures** when the system is running properly. To use them:

1. Start the engine and let it reach operating temperature (coolant 80–90°C / 180–200°F)
2. Set AC to maximum cold, fan on high, recirculation mode
3. Open windows or doors (to prevent cabin from reaching target temperature and cycling compressor)
4. Connect manifold gauge set to both low-side and high-side service ports
5. Let the system run for 3–5 minutes until pressures stabilize
6. Read both gauges and compare to the chart for the current ambient temperature

> **Note:** These values assume the engine is at idle (~700–800 RPM). At higher RPM, high-side pressure may be slightly higher.

*Sources: A/C Pro — "Automotive Refrigerant Pressure Charts" (acprocold.com/system-pressure-chart/); Nissens — "AC System Diagnostics — R134A Operating Pressures" (techtips.ie)*

### R-134a Operating Pressure Chart

| Ambient Temperature | Low Side (psig) | High Side (psig) |
|---|---|---|
| 65°F (18°C) | 25–35 | 135–155 |
| 70°F (21°C) | 35–40 | 145–160 |
| 75°F (24°C) | 35–45 | 150–170 |
| 80°F (27°C) | 40–50 | 175–210 |
| 85°F (29°C) | 45–55 | 225–250 |
| 90°F (32°C) | 45–55 | 250–270 |
| 95°F (35°C) | 50–55 | 275–300 |
| 100°F (38°C) | 50–60 | 300–325 |
| 105°F (41°C) | 55–65 | 325–350 |
| 110°F (43°C) | 60–70 | 350–400 |

*Source: A/C Pro (acprocold.com/system-pressure-chart/); Nissens AC Technical Bulletin*

### R-1234yf Operating Pressure Chart

| Ambient Temperature | Low Side (psig) | High Side (psig) |
|---|---|---|
| 65°F (18°C) | 28–38 | 135–154 |
| 70°F (21°C) | 33–43 | 145–159 |
| 75°F (24°C) | 38–48 | 149–168 |
| 80°F (27°C) | 43–48 | 173–205 |
| 85°F (29°C) | 49–58 | 220–243 |
| 90°F (32°C) | 49–58 | 243–261 |
| 95°F (35°C) | 53–58 | 266–289 |

*Source: A/C Pro (acprocold.com/system-pressure-chart/)*

### Important Testing Conditions

- **Do not test** when ambient temperature is below 60°F (15°C) — the system won't build enough pressure for accurate readings
- **Humidity** affects high-side pressure — higher humidity = higher high-side reading
- **Condenser fan** must be operational — non-functioning fans will falsely raise pressure readings
- **Engine idle speed** affects readings — use consistent RPM for comparison

*Source: Nissens — AC System Diagnostics Technical Bulletin*

---

## 7. Static Pressure Reference

When the AC system is **not running** (engine off), the pressure equalizes between high and low sides. This **static pressure** depends entirely on the ambient temperature and tells you if there's refrigerant in the system.

| Ambient Temperature | Expected Static Pressure (psig) |
|---|---|
| 65°F (18°C) | 50–70 |
| 70°F (21°C) | 60–80 |
| 75°F (24°C) | 70–90 |
| 80°F (27°C) | 80–100 |
| 85°F (29°C) | 90–110 |
| 90°F (32°C) | 100–125 |
| 95°F (35°C) | 115–140 |
| 100°F (38°C) | 130–155 |
| 110°F (43°C) | 160–190 |

**Key rules:**
- If static pressure is **below 25 psi**, the system is too low for the compressor clutch to engage (the low-pressure safety switch will prevent it)
- If static pressure reads **0 psi**, the system is completely empty
- Static pressure on the low side and high side should be **nearly equal** when the engine is off

*Source: Nissens — AC System Diagnostics Technical Bulletin*

---

## 8. Pressure-Temperature Relationship (P-T Charts)

Every refrigerant has a **fixed relationship between temperature and pressure** at its saturation (boiling/condensing) point. This is the Pressure-Temperature (P-T) relationship.

### R-134a Saturation Pressure-Temperature Table

| Temp (°F) | Temp (°C) | Pressure (psig) |
|---|---|---|
| -15 | -26.1 | 0.0 |
| -10 | -23.3 | 1.9 |
| -5 | -20.6 | 4.1 |
| 0 | -17.8 | 6.5 |
| 5 | -15.0 | 9.1 |
| 10 | -12.2 | 11.9 |
| 15 | -9.4 | 15.0 |
| 20 | -6.7 | 18.4 |
| 25 | -3.9 | 22.1 |
| 30 | -1.1 | 26.1 |
| 35 | 1.7 | 30.4 |
| 40 | 4.4 | 35.0 |
| 45 | 7.2 | 40.1 |
| 50 | 10.0 | 45.4 |
| 55 | 12.8 | 51.2 |
| 60 | 15.6 | 57.4 |
| 65 | 18.3 | 64.0 |
| 70 | 21.1 | 71.1 |
| 75 | 23.9 | 78.7 |
| 80 | 26.7 | 86.7 |
| 85 | 29.4 | 95.2 |
| 90 | 32.2 | 104.3 |
| 95 | 35.0 | 113.9 |
| 100 | 37.8 | 124.2 |
| 105 | 40.6 | 135.0 |
| 110 | 43.3 | 146.4 |
| 115 | 46.1 | 158.4 |
| 120 | 48.9 | 171.2 |
| 125 | 51.7 | 184.6 |
| 130 | 54.4 | 198.7 |
| 135 | 57.2 | 213.6 |
| 140 | 60.0 | 229.2 |
| 145 | 62.8 | 245.7 |
| 150 | 65.6 | 262.9 |

*Note: All pressures in gauge pressure (psig). Data verified against NIST Chemistry WebBook and ASHRAE Fundamentals. Source: FJC Inc. — "AC Pressure/Temperature Chart" (fjcinc.com)*

### How to Use This Table

If you measure the **suction pressure** at 35 psig, look it up — the corresponding saturation temperature is approximately **40°F (4.4°C)**. This tells you the refrigerant is boiling at 40°F inside the evaporator. Compare this to the actual suction line temperature to calculate superheat.

---

## 9. Compressor Types and Diagnostics

### 9.1 Fixed Displacement Piston Compressor

**How it works:**
- Contains pistons driven by a swash plate connected to the compressor shaft
- The swash plate angle is fixed — the compressor always moves the same amount of refrigerant per revolution
- An electromagnetic clutch cycles the compressor on and off to control cooling

**Diagnosis:**
- Easy to diagnose — check if the clutch engages when AC is turned on
- If clutch doesn't engage → check: power supply, relay, pressure switches, clutch coil resistance
- If clutch engages but no cooling → check refrigerant charge, compressor output

*Sources: Rick's Free Auto Repair Advice; CarParts.com*

### 9.2 Variable Displacement Piston Compressor

**How it works:**
- Still uses pistons and a swash plate, but the swash plate angle can change
- A control valve (Electronic Control Valve — ECV) adjusts the swash plate angle using crankcase pressure
- The ECV is a pulse-width-modulated (PWM) solenoid controlled by the HVAC module/ECU
- The compressor runs **continuously** — no on/off cycling
- Output adjusts from approximately 0% to 100% based on cooling demand

**Two sub-types:**
1. **Direct-drive (clutchless):** The pulley spins all the time. No traditional clutch. A torque-limiting decoupler (plastic shear pin or rubber clutch plate) provides a fail-safe if the compressor seizes.
2. **Clutched variable displacement:** Has a traditional electromagnetic clutch but still uses internal output control via the swash plate.

**Critical diagnostic note:**
> The phrase "the clutch isn't engaging" is the wrong diagnosis for a clutchless variable displacement compressor. If the pulley spins but there's no cooling, the problem is usually the control valve or its input signals — not mechanical failure.

**Common failure — Control Valve:**
- Symptoms: weak cooling at idle, cooling improves at highway speed, low pressure differential on gauges
- The control valve isn't adjusting the swash plate correctly
- In many cases, replacing **just the valve** (not the entire compressor) restores function
- Typical solenoid resistance: approximately **3.6 Ω** for 12V systems

**Diagnostic steps for variable displacement compressors:**
1. Check refrigerant charge first (sufficient pressure to run the system)
2. Verify the PWM command signal from the HVAC module (duty cycle should vary; ~10% near shutoff, increasing with demand)
3. Check control solenoid resistance
4. Verify sensor inputs: high/low pressure sensors, evaporator temperature sensor, cabin temperature sensors, sunload sensor
5. Use a scan tool to monitor compressor duty cycle and sensor data
6. Use a lab scope to track the PWM signal at the solenoid

> **Warning:** On direct-drive systems, if refrigerant leaks out, the compressor continues to spin with no refrigerant to carry oil. This leads to **catastrophic compressor failure**. Locating and repairing leaks promptly is especially critical on clutchless systems.

*Sources: Rick's Free Auto Repair Advice — "How To Diagnose a Variable Displacement AC Compressor" (ricksfreeautorepairadvice.com); Nissens — "AC Compressor Troubleshooting" Technical Bulletin (mechanexpert.com); MOTOR Magazine — "Diagnosing Variable Displacement Compressors" (motor.com); Fender Bender — "The Variables of Variable Displacement A/C Compressors" (fenderbender.com)*

### 9.3 Scroll Compressor

**How it works:**
- Uses two spiral-shaped scrolls — one fixed, one orbiting
- As the moving scroll rotates, it traps refrigerant and gradually compresses it toward the center
- Smoother, quieter operation with fewer moving parts than piston designs

**Found in:** Certain Honda, Ford, and Toyota applications

**Diagnosis:**
- Behaves similarly to piston compressors in terms of pressure diagnostics
- Internal wear patterns may differ — scroll tips can wear, reducing compression efficiency
- Less common failure mode than piston compressors

*Source: Rick's Free Auto Repair Advice — "The 3 Types of Automotive AC Compressors"*

### 9.4 Rotary Vane Compressor

**How it works:**
- Uses a spinning rotor with sliding vanes inside a chamber
- As the rotor turns, vanes extend outward and trap refrigerant, compressing it as it moves through the housing
- Compact and smooth-running

**Found in:** Some Mazda applications and a few other vehicles; less common today

*Source: Rick's Free Auto Repair Advice — "The 3 Types of Automotive AC Compressors"*

### 9.5 Compressor Failure Symptoms Summary

| Symptom | Likely Cause | Action |
|---|---|---|
| Both pressures equalized while running | Compressor valve failure (not compressing) | Replace compressor |
| Pressures equalize within seconds after shutoff | Internal reed valves worn/broken | Replace compressor |
| Low high-side + high low-side | Weak compressor | Check amperage, pressure equalization time |
| Compressor won't start (clutch type) | Power, relay, pressure switch, clutch coil | Systematic electrical diagnosis |
| Loud knocking/banging | Internal mechanical failure | Replace compressor |
| Oil color: dark brown/black | Internal burnout contamination | Full system flush + compressor + filter drier |
| Cooling improves at highway speed | Variable displacement control valve issue | Test and replace control valve |
| Belt squeal or breakage | Seized compressor bearings | Replace compressor |
| Rattling noise when AC engaged | Beginning of internal failure | Diagnose before catastrophic failure |
| Refrigerant leak at compressor | Shaft seal or O-ring failure | Replace seal or O-rings |

*Sources: CarParts.com; Rick's Free Auto Repair Advice; Nissens*

---

## 10. Dual-Evaporator / Rear Cooler Systems

### Where They're Found

Dual AC systems (front + rear evaporators) are common in:
- **SUVs:** Toyota Sequoia, Land Cruiser, Chevy Tahoe, GMC Yukon, Ford Expedition
- **Vans:** Toyota Sienna, Honda Odyssey, Chrysler Pacifica
- **Trucks:** Crew cab trucks with rear passenger cooling

### System Architecture

A dual AC system has:
- **One compressor** feeding both front and rear circuits
- **Two evaporators** (front dashboard + rear ceiling/floor unit)
- **Two expansion valves** (or one expansion valve + one orifice tube, depending on design)
- **Solenoid valves** to control refrigerant flow to each circuit independently

### How the Solenoid Valves Work

- **Front AC only ON:** Front solenoid valve opens, rear solenoid valve closes. Refrigerant flows only through the front circuit.
- **Rear AC only ON:** Some systems open only the rear solenoid; others open both.
- **Both ON:** Both solenoid valves open; refrigerant flows through both front and rear circuits.

*Source: Your Online Mechanic — "Automotive Air Condition System Dual A/C (Rear Cooler) Control" (youronlinemechanic.com)*

### Common Dual-System Problems

| Problem | Possible Cause | Solution |
|---|---|---|
| Front works, rear blows warm | Rear expansion valve stuck/faulty | Replace rear expansion valve |
| Front works, rear blows warm | Rear solenoid valve failure | Test and replace solenoid |
| Front works, rear blows warm | Loose thermosensitive tube on rear TXV | Secure tube to suction line per manufacturer spec |
| Rear works, front blows warm | Front expansion valve issue | Diagnose and replace front TXV |
| Rear works, front blows warm | Low refrigerant (front evaporator is often further from compressor) | Check charge, repair leaks |
| Poor cooling after condenser replacement | **Two orifice tubes in system** | Remove the orifice tube at the condenser outlet — dual systems only use OT at the "Y" split |
| Neither cools well | Compressor, charge, or condenser issue | Full system diagnosis |

### Critical Dual-System Note: The Two Orifice Tubes Problem

> **This is a very common mistake.** When replacing the condenser on a dual-orifice-tube system, many aftermarket condensers come with an orifice tube pre-installed at the outlet. However, in a dual system, the orifice tube belongs at the "Y" pipe where the liquid line splits to front and rear — **not** at the condenser outlet. Installing both (one at condenser + one at the "Y") creates a double restriction that severely reduces cooling performance. **Always check and remove the extra orifice tube from the new condenser.**

*Source: Auto AC Forum — "1999 Chevy Tahoe will not cool properly" (autoacforum.com); GM technician advice*

### Dual-System Charge Amounts

Dual AC systems require **more refrigerant** than single-AC systems. Always check the under-hood specification sticker — it takes precedence over any other source.

| Vehicle | Single AC Charge | Dual AC Charge |
|---|---|---|
| 1999 Chevy Tahoe | 44 oz (1,300 mL) | 64 oz (1,893 mL) |
| Toyota Land Cruiser 80 | Refer to sticker | Refer to sticker (typically higher) |

> **Warning:** Many online databases and parts stores list incorrect charge amounts. The **under-hood sticker** is the authoritative source. A 1999 Yukon calls for 44 oz, but many sources incorrectly list 64 oz (which is the Suburban/Tahoe dual-AC specification).

*Source: Auto AC Forum — 1999 Chevy Tahoe diagnostic thread; GM technician expertise*

### Toyota Land Cruiser 80 — Rear Cooler Service Details

The Toyota Land Cruiser 80 Series (HDJ/FJ/HZJ-80) has a complete rear cooling unit with its own:
- Rear cooler evaporator
- Rear cooler expansion valve
- Rear cooler amplifier and servomotor
- Magnetic solenoid valve
- Rear blower motor and fan
- Thermistor for temperature sensing

**Rear cooler expansion valve torque specifications:**
- Expansion valve to evaporator inlet: **225 kg-cm (16 ft-lb, 22 Nm)**
- Suction tube to evaporator outlet: **330 kg-cm (24 ft-lb, 32 Nm)**
- Liquid tube connections: **140 kg-cm (10 ft-lb, 14 Nm)**

**Diagnostic hint:** If the low-pressure reading is normal and cool air is only failing to come out of the rear cooler, check for a malfunction of the rear expansion valve.

*Source: Toyota Land Cruiser 80 Series Chassis — Air Conditioning System Repair Manual*

---

## 11. Diagnostic Methods — Superheat and Subcooling

### Method 1: Superheat (for Fixed Orifice / Piston Systems)

**What it tells you:** Whether the evaporator is receiving the right amount of refrigerant.

**How to measure:**
1. Measure the **suction pressure** (low-side gauge) at the evaporator outlet
2. Use the P-T chart to find the **saturation temperature** for that pressure
3. Measure the **actual suction line temperature** with a pipe-clamp thermometer at the evaporator outlet
4. **Superheat = Actual Suction Line Temperature − Saturation Temperature**

**Example:**
- Suction pressure: 35 psig → Saturation temp: 40°F
- Suction line temperature: 55°F
- Superheat: 55°F − 40°F = **15°F**

| Superheat Value | Indicates |
|---|---|
| Below 5°F | Too much refrigerant (overcharge) — risk of liquid slugging the compressor |
| 8–15°F | Normal charge for most automotive R-134a systems |
| Above 20°F | Too little refrigerant (undercharge) — system is starving |

*Source: Existing project documentation — "AC Pressure-Temperature Guide.md"*

### Method 2: Subcooling (for TXV / Expansion Valve Systems)

**What it tells you:** Whether the condenser is properly converting all vapor to liquid.

**How to measure:**
1. Measure the **liquid line pressure** (high-side gauge) at the condenser outlet
2. Use the P-T chart to find the **saturation temperature** for that pressure
3. Measure the **actual liquid line temperature** with a pipe-clamp thermometer at the condenser outlet
4. **Subcooling = Saturation Temperature − Actual Liquid Line Temperature**

**Example:**
- High-side pressure: 200 psig → Saturation temp: 130°F
- Liquid line temperature: 118°F
- Subcooling: 130°F − 118°F = **12°F**

| Subcooling Value | Indicates |
|---|---|
| Below 5°F | Not enough refrigerant — vapor may be reaching the expansion device |
| 8–15°F | Normal charge |
| Above 20°F | Overcharged or restricted condenser airflow |

*Source: Existing project documentation — "AC Pressure-Temperature Guide.md"*

### Method 3: Approach Temperature (Quick Check)

**What it tells you:** A quick way to check charge level without full gauge readings.

**How to measure:**
1. Measure the **outdoor ambient temperature** (in the shade, away from condenser exhaust)
2. Measure the **liquid line temperature** at the condenser outlet
3. **Approach = Liquid Line Temperature − Outdoor Ambient Temperature**

| Outdoor Temp | Expected Approach |
|---|---|
| 70°F (21°C) | 10–15°F |
| 80°F (27°C) | 15–20°F |
| 90°F (32°C) | 20–25°F |
| 100°F+ (38°C+) | 25–30°F |

*Source: Existing project documentation — "AC Pressure-Temperature Guide.md"*

---

## 12. Pressure Interpretation and Troubleshooting

### Pressure Reading Interpretation Chart

| Low Side | High Side | Likely Problem | Action |
|---|---|---|---|
| Normal | Normal | ✅ System working properly | No action needed |
| Low | Low | Low refrigerant charge | Check for leaks, repair, evacuate, recharge |
| Low | High | Restriction (expansion valve or orifice tube blocked) | Check/replace expansion device, check filter drier |
| High | Low | Compressor failure (not compressing) | Replace compressor |
| High | High | Overcharged | Slowly remove refrigerant (venting is illegal) |
| Normal | Low | Compressor wearing out (weak compression) | Test amperage, pressure equalization |
| High | Normal | Evaporator airflow issue | Check cabin filter, blower motor, evaporator coil |

*Sources: A/C Pro; Nissens; Existing project documentation*

### Line Temperature Diagnostics

#### Suction Line (Large Pipe, Low Side)

| Suction Line Condition | Possible Cause |
|---|---|
| Cold and sweating (40–50°F / 4–10°C) | Normal operation |
| Frosting or icing (below 32°F / 0°C) | Low airflow over evaporator, stuck expansion valve, or overcharge |
| Warm (above 60°F / 15°C) | Low refrigerant charge, compressor issue, or restriction |
| Ambient temperature | Compressor not running or system completely empty |

#### Liquid Line (Small Pipe, High Side)

| Liquid Line Condition | Possible Cause |
|---|---|
| Warm but not scalding (100–120°F / 38–49°C) | Normal operation |
| Very hot (above 150°F / 65°C) | Overcharged, condenser fan problem, or restricted condenser |
| Cool or ambient temperature | Compressor not compressing, very low charge |
| Hot at compressor outlet, cool after restriction | Blockage between those points |

#### Discharge Line (Compressor Outlet)

| Discharge Line Condition | Possible Cause |
|---|---|
| 150–220°F (65–104°C) | Normal range |
| Above 250°F (121°C) | Low charge, restriction, or condenser fan failure — dangerously high |
| Below 130°F (54°C) | Compressor not working properly |

*Source: Existing project documentation — "AC Pressure-Temperature Guide.md"*

---

## 13. Common Symptoms and Solutions

### 13.1 AC Blows Warm Air

**Most common causes (in order of frequency):**
1. Low refrigerant charge (leak)
2. Dirty condenser coil
3. Failed compressor
4. Clogged filter drier
5. Failed expansion valve
6. Dirty evaporator coil

**Diagnosis flow:**
1. Check basics: thermostat setting, fan speed, recirculation mode, vent positions
2. Check outdoor unit: compressor running? condenser fan spinning? condenser clean?
3. Connect gauges and compare to pressure chart
4. Check expansion device
5. Check airflow: cabin filter, evaporator condition, blower motor

*Source: Existing project documentation — "AC Common Knowledge.txt"*

### 13.2 Compressor Short Cycles (On and Off)

**Causes:**
1. Low refrigerant — low-pressure safety switch opens
2. High pressure safety tripping — dirty condenser, fan failure, overcharge
3. Faulty pressure switch
4. Compressor thermal overload
5. Electrical issues — loose wire, bad relay, failing contactor

*Source: Existing project documentation — "AC Common Knowledge.txt"*

### 13.3 Evaporator Coil Freezing

**Causes:**
1. Low refrigerant charge (most common)
2. Dirty cabin air filter
3. Dirty evaporator coil
4. Blower motor not running or running slow
5. Expansion valve stuck open
6. Orifice tube partially clogged

**Important:** After fixing, the ice must fully melt before restarting. Turn AC to fan-only mode or wait 2–4 hours.

*Source: Existing project documentation — "AC Common Knowledge.txt"*

### 13.4 AC Trips the Breaker / Blows Fuse

**Causes:**
1. Compressor drawing excessive amperage (failing, locked rotor, shorted windings)
2. Short circuit in wiring
3. Faulty run capacitor (if applicable)
4. Ground fault (compressor windings shorted to ground)
5. Dirty condenser causing high head pressure

*Source: Existing project documentation — "AC Common Knowledge.txt"*

### 13.5 Excessive Vibration

**Causes:**
1. Loose mounting bolts
2. Unbalanced fan blade
3. Liquid slugging (liquid refrigerant entering compressor)
4. Compressor internal damage
5. Resonance (vibration frequency matching mounting surface)
6. Pipe vibration (refrigerant pipes touching structure)

*Source: Existing project documentation — "AC Common Knowledge.txt"*

### 13.6 Moldy/Musty Smell

**Causes:**
- Mold or mildew on evaporator coil, condensate drain pan, or ductwork

**Fix:**
1. Replace cabin air filter
2. Clean evaporator with no-rinse foaming coil cleaner
3. Flush condensate drain with diluted bleach or vinegar
4. Apply antimicrobial treatment
5. Run fan in AUTO mode (not ON — ON keeps the coil wet)

*Source: Existing project documentation — "AC Common Knowledge.txt"*

---

## 14. Service Procedures

### 14.1 Charging a Car AC System with R-134a

**Tools needed:**
- R-134a refrigerant can with pressure gauge and trigger valve
- Safety glasses and gloves (refrigerant can cause frostbite)
- Thermometer for vent temperature measurement

**Step-by-step:**

1. **Locate the low-pressure service port** — on the larger diameter tube, capped in blue or black, marked "L"
   > **CRITICAL:** Only connect to the low-pressure port. The fittings are different sizes to prevent mixing. Connecting to the high-pressure side while running can cause the can to explode.

2. **Connect the gauge and refrigerant can** — screw charging hose onto can, connect quick-disconnect to low-pressure port. Do not puncture the can yet.

3. **Start the vehicle and AC** — engine idling, AC to maximum cold, fan on highest, recirculation mode on, doors/windows open.

4. **Puncture the can and monitor pressure** — add refrigerant in short bursts (5–10 seconds). Keep the can upright (adding gas, not liquid — liquid can slug the compressor).

5. **Check the pressure chart** — compare gauge reading to the chart for current ambient temperature. Add until gauge enters the optimal range.

6. **Check vent temperatures** — properly charged system should blow 35–45°F (2–7°C) at center vents.

7. **Disconnect and finish** — do not overcharge. Close valve on kit, pull quick-disconnect off port, replace dust cap.

> **Overcharging warning:** An overcharged system has excessively high pressures, poor cooling, and can destroy the compressor. Slightly undercharged is always better than overcharged.

*Source: Existing project documentation — "docs/charge car AC.md"*

### 14.2 Using Manifold Gauge Set

**Connections:**
- **Blue hose** → Low-pressure service port (larger pipe)
- **Red hose** → High-pressure service port (smaller pipe)
- **Yellow hose** → Vacuum pump (for evacuation) or refrigerant source (for charging)

**Procedure:**
1. Connect hoses with engine off
2. Read static pressure (should be nearly equal on both sides)
3. Start engine, turn AC to max
4. Read operating pressures after 3–5 minutes
5. Compare to pressure chart for current ambient temperature

*Sources: Nissens; A/C Pro*

### 14.3 Evacuation (Pulling Vacuum)

**Purpose:** Remove air and moisture from the system before charging.

**Procedure:**
1. Recover all remaining refrigerant (do not vent)
2. Connect vacuum pump to both high and low side through manifold gauge
3. Evacuate to **500 microns** or lower (use a micron gauge, not just the manifold gauge)
4. Hold vacuum for 15–30 minutes to verify no leaks
5. If moisture is severe, perform **triple evacuation:**
   - Pressurize with nitrogen to 50 psig
   - Hold 5 minutes
   - Evacuate to 500 microns
   - Repeat 3 times

*Sources: Existing project documentation — "AC Common Knowledge.txt"; Nissens*

### 14.4 Nitrogen Pressure Testing

**Purpose:** Test the system for leaks before charging with refrigerant.

**Test pressures:**
| System Type | Nitrogen Test Pressure |
|---|---|
| R-134a systems | 150–200 psig |
| R-22 systems | 200–250 psig |
| R-410A systems | 400–600 psig |

**Procedure:**
1. Connect nitrogen cylinder with regulator
2. Pressurize the system
3. Apply soap bubbles to all joints, connections, and suspected areas
4. Monitor gauge — pressure drop indicates a leak
5. Hold for 15–30 minutes minimum

> Always use dry, oil-free nitrogen (industrial grade). Never use compressed shop air (contains moisture and oil).

*Source: Existing project documentation — "AC Common Knowledge.txt"*

---

## 15. Safety and Environmental Regulations

### Refrigerant Handling

- **Venting refrigerant is illegal** in the USA under EPA Section 608 and in many other jurisdictions worldwide
- R-134a and R-1234yf must be recovered using proper recovery equipment
- Technicians must be certified to purchase and handle refrigerant
- Contaminated refrigerant should be sent for reclamation, not reused

### Personal Safety

- Refrigerant is extremely cold and can cause frostbite on contact
- Always wear safety glasses and gloves
- Work in well-ventilated areas
- Never heat a refrigerant can (explosion risk)
- Never connect a DIY recharge kit to the high-pressure side

### System Safety

- Never overcharge — excess refrigerant raises pressures dangerously
- Never use compressed shop air to pressurize an AC system (moisture and oil contamination)
- Always use the correct refrigerant type for the vehicle
- Always use the correct oil type and quantity for the compressor

*Sources: A/C Pro; EPA regulations; Existing project documentation*

---

## 16. Sources and References

This guide was compiled from the following verified sources:

### Primary Sources

| Source | URL | Content |
|---|---|---|
| A/C Pro | acprocold.com/system-pressure-chart/ | R-134a and R-1234yf pressure charts, PAG oil guide |
| Nissens A/S | techtips.ie/Nissens/ | AC system diagnostics, R-134a operating pressures |
| Nissens Compressor TB | mechanexpert.com | AC compressor troubleshooting (ECV compressors) |
| Rick's Free Auto Repair Advice | ricksfreeautorepairadvice.com | Compressor types, variable displacement diagnosis |
| CarParts.com | carparts.com/blog/ | AC systems overview, compressor symptoms |
| AutoZone | autozone.com/diy/climate-control/ | How car AC works, system types, components |
| RY A/C Compressors | rycompressors.com | Complete component guide |
| Motronix | motronix.net/expertise/ac-systems/ | AC logic, control systems, failure analysis |
| Denso A/C Catalog | images.carid.com/denso/ | Components catalog, part lookup by vehicle |
| MAHLE Aftermarket | mahle-aftermarket.com | Automotive climate control technical knowledge |
| FJC Inc. | fjcinc.com | Pressure/temperature chart for automotive refrigerants |
| MOTOR Magazine | motor.com | Variable displacement compressor diagnosis |
| Fender Bender | fenderbender.com | Variable displacement A/C compressor diagnostics |

### Vehicle-Specific Sources

| Source | Content |
|---|---|
| Toyota Land Cruiser 80 Chassis Manual | Rear cooler service, disassembly/assembly, torque specs |
| NHTSA TSB IK1900228 | 2010+ Vehicle AC diagnostics, pressure test charts, rear AC diagnostics |
| NHTSA TSB 11027860 | AC system not cooling — HVAC leakage (evaporator, TXV, EXV) |
| Denso Tech Talk | Dual AC expansion valve troubleshooting (Toyota Sienna, Sequoia) |
| Auto AC Forum (autoacforum.com) | GM dual-system orifice tube troubleshooting, charge amounts |
| Your Online Mechanic | Dual AC rear cooler control theory and operation |

### Project Documentation

| File | Content |
|---|---|
| docs/AC Pressure-Temperature Guide.md | R-134a P-T table, superheat/subcooling, operating pressures, static pressure, R-1234yf comparison |
| docs/AC Common Knowledge.txt | 28 troubleshooting sections covering all major AC failure modes |
| docs/charge car AC.md | Step-by-step DIY R-134a charging procedure |

### Standards and Databases

| Source | Content |
|---|---|
| NIST Chemistry WebBook | Refrigerant thermodynamic properties |
| ASHRAE Fundamentals | Pressure-temperature relationships |
| EPA Section 608 | Refrigerant handling regulations |
| Montreal Protocol | Ozone-depleting substance regulations |

---

## Appendix A: Glossary of Terms

| Term | Definition |
|---|---|
| **Accumulator** | Low-pressure side component that stores refrigerant and removes moisture; used with orifice tube systems |
| **Compressor** | Belt-driven pump that pressurizes refrigerant gas |
| **Condenser** | Heat exchanger that releases heat from refrigerant to outside air |
| **Desiccant** | Drying agent inside the accumulator or receiver-drier that absorbs moisture |
| **ECV** | Electronic Control Valve — solenoid that adjusts variable displacement compressor output |
| **Evaporator** | Heat exchanger that absorbs heat from cabin air |
| **Expansion Valve (TXV)** | Variable metering device that controls refrigerant flow into the evaporator |
| **GWP** | Global Warming Potential — measure of a substance's contribution to global warming |
| **Orifice Tube** | Fixed metering device that creates a pressure drop before the evaporator |
| **PAG Oil** | Polyalkylene Glycol — synthetic compressor oil for R-134a and R-1234yf systems |
| **PWM** | Pulse Width Modulation — signal type used to control variable displacement compressors |
| **R-12** | Dichlorodifluoromethane — discontinued CFC refrigerant (pre-1994) |
| **R-134a** | 1,1,1,2-Tetrafluoroethane — standard HFC refrigerant (1994–2020) |
| **R-1234yf** | 2,3,3,3-Tetrafluoropropene — current HFO refrigerant (2015+) |
| **Receiver-Drier** | High-pressure side component that stores refrigerant and removes moisture; used with TXV systems |
| **Service Port** | Connection point for gauges and charging equipment |
| **Static Pressure** | System pressure when the compressor is not running (engine off) |
| **Subcooling** | The difference between saturation temperature and actual liquid line temperature |
| **Superheat** | The difference between actual suction line temperature and saturation temperature |
| **Swash Plate** | Angled plate inside piston compressors that converts rotary motion to reciprocating piston motion |

---

## Appendix B: Quick Reference Card

### Normal Operating Pressures (R-134a, 80°F ambient, engine at idle)

| Measurement | Expected Value |
|---|---|
| Low side pressure | 35–50 psig |
| High side pressure | 175–210 psig |
| Vent temperature | 35–45°F (2–7°C) |
| Suction line temperature | 40–55°F (4–13°C) |
| Liquid line temperature | 100–120°F (38–49°C) |
| Discharge line temperature | 150–220°F (65–104°C) |
| Superheat (fixed orifice) | 8–15°F |
| Subcooling (TXV systems) | 8–15°F |

### Normal Operating Pressures (R-1234yf, 80°F ambient, engine at idle)

| Measurement | Expected Value |
|---|---|
| Low side pressure | 36–48 psig |
| High side pressure | 173–205 psig |

---

*End of Guide*