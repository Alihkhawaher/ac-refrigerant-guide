# AC Refrigerant Guide & Calculator

A comprehensive, offline-capable Progressive Web App (PWA) for automotive and residential AC refrigerant pressures, diagnostics, and troubleshooting. Designed for **T3 climate conditions** common in the Middle East and Gulf region (ambient temperatures up to 55°C / 131°F).

🌐 **Live Site:** [https://alihkhawaher.github.io/ac-refrigerant-guide/](https://alihkhawaher.github.io/ac-refrigerant-guide/)

## Features

- **Welcome Dashboard** — Quick Pressure Reference for all 4 refrigerants at a glance, with interactive ambient temperature slider
- **Vehicle AC Lookup** — Search 3,378+ vehicles by make/model/year to find refrigerant type, quantity, and compressor oil (powered by sql.js)
- **Interactive PT Charts** — Pressure-temperature curves for all 4 refrigerants (Chart.js)
- **Diagnostic Calculators** — Superheat, subcooling, ambient advisor
- **System Diagram** — Interactive P&ID with zoom, pan, drag, and component details
- **Troubleshooting Guide** — Per-refrigerant issues with symptoms, causes, and fixes
- **Oil Diagnostics** — Color and smell-based compressor oil assessment
- **System Sizing Calculator** — Room size to BTU/h with component specs
- **29 Common Knowledge Q&A** — Searchable diagnostic reference (including PSIG vs PSIA fundamentals)
- **Bilingual** — Full English and Arabic interface (toggle with 🌐 button)
- **Offline Support** — Works completely offline after first visit (PWA)
- **Installable** — Add to home screen on Android, iOS, and Desktop

## Tech Stack

- **UI Framework:** Tailwind CSS + DaisyUI (dark theme)
- **Charts:** Chart.js
- **Vehicle Database:** sql.js (SQLite compiled to WebAssembly, runs in browser)
- **Architecture:** Modular JavaScript (5 modules)
- **Hosting:** GitHub Pages with GitHub Actions deployment

## Refrigerants Covered

| Refrigerant | Type | Application |
|---|---|---|
| R-134a | HFC (Pure) | Automotive AC |
| R-22 | HCFC (Pure) | Legacy residential AC (banned 2020) |
| R-410A | HFC Blend | Residential AC, Heat Pumps |
| R-32 | HFC (Pure) | Modern residential AC (A2L flammable) |

## Project Structure

```
/
├── index.html              # Main HTML (Tailwind + DaisyUI sidebar layout)
├── vehicle_ac_data.db      # SQLite database (3,378 vehicles)
├── build_vehicle_db.py     # Python script to rebuild vehicle DB from source
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (offline caching)
├── js/
│   ├── data.js             # Refrigerant properties & PT charts
│   ├── instructions.js     # Per-refrigerant instructions (EN/AR)
│   ├── issues.js           # Troubleshooting & oil diagnostics
│   ├── knowledge.js        # 29 Q&A items (EN/AR)
│   ├── devices.js          # Component lookup tables
│   ├── calculators.js      # Shared utilities & slider calculators
│   ├── charts.js           # Chart.js PT & comparison charts
│   ├── diagram.js          # SVG system diagram with interactions
│   ├── vehicle-lookup.js   # sql.js vehicle database queries
│   └── app.js              # Main orchestrator (nav, state, rendering)
├── icons/
│   ├── icon-192.png        # PWA icon (192x192)
│   └── icon-512.png        # PWA icon (512x512)
├── backup/                 # Original v1 files (for reference)
├── v2/                     # Development copy of v2
├── calculators/
│   ├── ac_calculator.py    # Python validation script
│   └── ac_calculator_t3.py # T3 calculator (Wagner equation)
└── docs/                   # Reference documentation
```

## Usage

**Online:** Visit [https://alihkhawaher.github.io/ac-refrigerant-guide/](https://alihkhawaher.github.io/ac-refrigerant-guide/)

**Offline (Install as App):**
1. Open the site in Chrome/Edge
2. Click the "Install" banner that appears, or use the browser menu (⋮ → Install app)
3. On iOS Safari: tap Share → Add to Home Screen

**Local Development:**
```bash
# Serve locally (needed for sql.js .db file fetching)
python -m http.server 8080

# Rebuild vehicle database from source HTML
python build_vehicle_db.py
```

## Vehicle Database

The vehicle AC refrigerant database is sourced from [database26.com](https://database26.com/refrigerant-capacity-chart-r134a-r1234yf/) and contains **3,378 entries** across **69 makes** including Volkswagen, Audi, Mercedes-Benz, Ford, Toyota, Honda, BMW, and more.

**Data fields:** Make, Model, Year Range, Refrigerant Type (R134a/R1234yf), Quantity (grams), Oil Code, Oil Type, Oil Quantity (ml)

**Rebuilding the database:**
1. Save the source HTML page as `docs/database35.com.html`
2. Run `python build_vehicle_db.py`
3. Copy `vehicle_ac_data.db` to the repo root

## Important Notes

- **T3 climate focus** — Operating pressure ranges reflect extreme ambient conditions (up to 55°C / 131°F) typical of Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Oman
- **Both fixed orifice and TXV/EEV** — Toggle the TXV checkbox in the calculators tab
- **Pressure data sourced from NIST** — PT charts verified against NIST/ASHRAE; T3 calculator uses Wagner equation (max error <1 PSIG)
- **All pressure values in PSIG** (gage pressure) — see Common Knowledge for PSIG vs PSIA explanation
- **Vehicle data is read-only** — sql.js queries the .db file client-side; no server-side code

## Review Status

This project has undergone a comprehensive cross-file review (2026-07-04):
- **PT data** — Verified against NIST/ASHRAE (all interpolation tests pass)
- **T3 calculator** — Uses Wagner equation fitted to verified data (<1 PSIG error)
- **Operating ranges** — Synced between calculators and web app
- **Instructions** — Pressure values verified against hvacptcharts.com and acdirect.com

See `docs/Calculator Review.md` and `docs/Cross-File Review - Discrepancies & Errors.md` for detailed findings.

**Community review still welcome.** If you have HVAC expertise, please verify the operating pressure ranges for T3 climate conditions and report any inaccuracies via GitHub Issues.

## License

This project is provided as-is for educational and reference purposes. Always verify against manufacturer specifications and local regulations before servicing AC systems.