#!/usr/bin/env python3
"""
build_vehicle_db.py — Parse database26.com refrigerant data into SQLite
Run: python build_vehicle_db.py
Input: ../docs/database35.com.html
Output: vehicle_ac_data.db
"""
import sqlite3
import os
import re
from html.parser import HTMLParser

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(SCRIPT_DIR, '..', 'docs', 'database35.com.html')
DB_PATH = os.path.join(SCRIPT_DIR, 'vehicle_ac_data.db')


class TableParser(HTMLParser):
    """Parse Ninja Tables HTML to extract vehicle rows."""
    def __init__(self):
        super().__init__()
        self.in_tbody = False
        self.in_tr = False
        self.in_td = False
        self.current_row = []
        self.current_cell = ''
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag == 'tbody':
            self.in_tbody = True
        elif tag == 'tr' and self.in_tbody:
            self.in_tr = True
            self.current_row = []
        elif tag == 'td' and self.in_tr:
            self.in_td = True
            self.current_cell = ''

    def handle_endtag(self, tag):
        if tag == 'tbody':
            self.in_tbody = False
        elif tag == 'tr' and self.in_tr:
            self.in_tr = False
            if len(self.current_row) >= 7:
                self.rows.append(self.current_row[:7])
        elif tag == 'td' and self.in_td:
            self.in_td = False
            self.current_row.append(self.current_cell.strip())

    def handle_data(self, data):
        if self.in_td:
            self.current_cell += data


def split_make_model(vehicle_model):
    """Split 'Volkswagen Amarok' into ('Volkswagen', 'Amarok').
    Handles cases like 'Audi TT (8N) with 20 mm condenser' -> ('Audi', 'TT (8N) with 20 mm condenser')
    """
    # Known multi-word makes
    multi_word_makes = [
        'Alfa Romeo', 'Aston Martin', 'Land Rover', 'Mercedes-Benz',
        'Rolls Royce', 'DS Automobiles'
    ]
    for make in multi_word_makes:
        if vehicle_model.startswith(make):
            return make, vehicle_model[len(make):].strip()

    # Default: first word is make
    parts = vehicle_model.split(' ', 1)
    if len(parts) == 2:
        return parts[0], parts[1]
    return parts[0], ''


def parse_qty(qty_str):
    """Parse quantity string like '525' or '700 - 750' into average grams."""
    qty_str = qty_str.strip().replace(',', '.')
    # Handle ranges like "700 - 750"
    match = re.match(r'([\d.]+)\s*[-–]\s*([\d.]+)', qty_str)
    if match:
        return round((float(match.group(1)) + float(match.group(2))) / 2)
    # Handle single values
    match = re.match(r'([\d.]+)', qty_str)
    if match:
        return round(float(match.group(1)))
    return 0


def main():
    if not os.path.exists(HTML_PATH):
        print(f"ERROR: HTML file not found: {HTML_PATH}")
        print("Please save the database26.com page as docs/database35.com.html")
        return

    print(f"Parsing: {HTML_PATH}")
    with open(HTML_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    parser = TableParser()
    parser.feed(html)
    print(f"Found {len(parser.rows)} vehicle rows")

    if len(parser.rows) == 0:
        print("ERROR: No data rows found. Check the HTML file structure.")
        return

    # Create database
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    conn.execute('''CREATE TABLE vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year_range TEXT,
        refrigerant_type TEXT,
        refrigerant_qty_g INTEGER,
        oil_code TEXT,
        oil_type TEXT,
        oil_qty_ml INTEGER
    )''')
    conn.execute('CREATE INDEX idx_make ON vehicles(make)')
    conn.execute('CREATE INDEX idx_model ON vehicles(model)')

    inserted = 0
    skipped = 0
    for row in parser.rows:
        vehicle_model = row[0]
        year_range = row[1]
        refrigerant_type = row[2]
        refrigerant_qty_str = row[3]
        oil_code = row[4]
        oil_type = row[5]
        oil_qty_str = row[6]

        make, model = split_make_model(vehicle_model)
        if not make or not model:
            skipped += 1
            continue

        ref_qty = parse_qty(refrigerant_qty_str)
        oil_qty = parse_qty(oil_qty_str)

        if ref_qty == 0:
            skipped += 1
            continue

        conn.execute(
            'INSERT INTO vehicles (make, model, year_range, refrigerant_type, refrigerant_qty_g, oil_code, oil_type, oil_qty_ml) VALUES (?,?,?,?,?,?,?,?)',
            (make, model, year_range, refrigerant_type, ref_qty, oil_code, oil_type, oil_qty)
        )
        inserted += 1

    conn.commit()

    # Print summary
    cursor = conn.execute('SELECT COUNT(*) FROM vehicles')
    total = cursor.fetchone()[0]
    cursor = conn.execute('SELECT COUNT(DISTINCT make) FROM vehicles')
    makes = cursor.fetchone()[0]
    cursor = conn.execute('SELECT make, COUNT(*) as cnt FROM vehicles GROUP BY make ORDER BY cnt DESC LIMIT 10')
    top_makes = cursor.fetchall()

    conn.close()

    print(f"\nDatabase created: {DB_PATH}")
    print(f"  Total vehicles: {total}")
    print(f"  Unique makes: {makes}")
    print(f"  Inserted: {inserted}, Skipped: {skipped}")
    print(f"\nTop 10 makes:")
    for make, count in top_makes:
        print(f"  {make}: {count} entries")


if __name__ == '__main__':
    main()