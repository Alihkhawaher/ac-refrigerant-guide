// vehicle-lookup.js — sql.js based vehicle AC refrigerant database
(function() {
'use strict';

var db = null;
var searchTimeout = null;

function initVehicleLookup() {
  var loadingEl = document.getElementById('vehicleLoading');
  var emptyEl = document.getElementById('vehicleEmpty');
  var tableEl = document.getElementById('vehicleTable');

  if (loadingEl) loadingEl.classList.remove('hidden');
  if (emptyEl) emptyEl.classList.add('hidden');

  // Initialize sql.js
  if (typeof initSqlJs === 'undefined') {
    console.warn('[VehicleLookup] sql.js not loaded, skipping database init');
    if (loadingEl) loadingEl.classList.add('hidden');
    if (emptyEl) { emptyEl.classList.remove('hidden'); emptyEl.innerHTML = '<p class="text-warning">Vehicle database unavailable (sql.js not loaded).</p>'; }
    return;
  }

  initSqlJs({
    locateFile: function(file) { return 'https://sql.js.org/dist/' + file; }
  }).then(function(SQL) {
    // Fetch the .db file
    return fetch('vehicle_ac_data.db')
      .then(function(res) {
        if (!res.ok) throw new Error('DB file not found');
        return res.arrayBuffer();
      })
      .then(function(buffer) {
        db = new SQL.Database(new Uint8Array(buffer));
        console.log('[VehicleLookup] Database loaded successfully');
        populateMakes();
        setupEventListeners();
        if (loadingEl) loadingEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.remove('hidden');
      });
  }).catch(function(err) {
    console.warn('[VehicleLookup] Failed to load database:', err.message);
    if (loadingEl) loadingEl.classList.add('hidden');
    if (emptyEl) {
      emptyEl.classList.remove('hidden');
      emptyEl.innerHTML = '<p class="text-warning">Vehicle database not available. Run <code>build_vehicle_db.py</code> to generate it.</p>';
    }
  });
}

function populateMakes() {
  if (!db) return;
  var result = db.exec("SELECT DISTINCT make FROM vehicles ORDER BY make");
  var select = document.getElementById('vMake');
  if (!select || !result.length) return;
  select.innerHTML = '<option value="">All Makes</option>';
  result[0].values.forEach(function(row) {
    var opt = document.createElement('option');
    opt.value = row[0];
    opt.textContent = row[0];
    select.appendChild(opt);
  });
}

function populateModels(make) {
  if (!db) return;
  var select = document.getElementById('vModel');
  if (!select) return;
  if (!make) {
    select.innerHTML = '<option value="">Select Make first</option>';
    select.disabled = true;
    return;
  }
  var stmt = db.prepare("SELECT DISTINCT model FROM vehicles WHERE make = ? ORDER BY model");
  stmt.bind([make]);
  select.innerHTML = '<option value="">All Models</option>';
  while (stmt.step()) {
    var opt = document.createElement('option');
    opt.value = stmt.get()[0];
    opt.textContent = stmt.get()[0];
    select.appendChild(opt);
  }
  stmt.free();
  select.disabled = false;
}

function populateYears(make, model) {
  if (!db) return;
  var select = document.getElementById('vYear');
  if (!select) return;
  if (!model) {
    select.innerHTML = '<option value="">Select Model first</option>';
    select.disabled = true;
    return;
  }
  var sql = "SELECT DISTINCT year_range FROM vehicles WHERE make = ? AND model = ? ORDER BY year_range";
  var stmt = db.prepare(sql);
  stmt.bind([make, model]);
  select.innerHTML = '<option value="">All Years</option>';
  while (stmt.step()) {
    var opt = document.createElement('option');
    opt.value = stmt.get()[0];
    opt.textContent = stmt.get()[0];
    select.appendChild(opt);
  }
  stmt.free();
  select.disabled = false;
}

function queryVehicles(make, model, year) {
  if (!db) return [];
  var conditions = [];
  var params = [];
  if (make) { conditions.push("make = ?"); params.push(make); }
  if (model) { conditions.push("model = ?"); params.push(model); }
  if (year) { conditions.push("year_range = ?"); params.push(year); }
  var sql = "SELECT make, model, year_range, refrigerant_type, refrigerant_qty_g, oil_type FROM vehicles";
  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY make, model, year_range LIMIT 100";
  var stmt = db.prepare(sql);
  stmt.bind(params);
  var results = [];
  while (stmt.step()) {
    var row = stmt.get();
    results.push({
      make: row[0], model: row[1], year: row[2],
      refrigerant: row[3], qty: row[4], oil: row[5]
    });
  }
  stmt.free();
  return results;
}

function searchVehicles(term) {
  if (!db || !term) return [];
  var like = '%' + term + '%';
  var stmt = db.prepare("SELECT make, model, year_range, refrigerant_type, refrigerant_qty_g, oil_type FROM vehicles WHERE make LIKE ? OR model LIKE ? ORDER BY make, model LIMIT 50");
  stmt.bind([like, like]);
  var results = [];
  while (stmt.step()) {
    var row = stmt.get();
    results.push({
      make: row[0], model: row[1], year: row[2],
      refrigerant: row[3], qty: row[4], oil: row[5]
    });
  }
  stmt.free();
  return results;
}

function displayResults(results) {
  var resultEl = document.getElementById('vehicleResult');
  var tableEl = document.getElementById('vehicleTable');
  var emptyEl = document.getElementById('vehicleEmpty');
  var tbody = document.querySelector('#vTableEl tbody');

  if (!results || results.length === 0) {
    if (resultEl) resultEl.classList.add('hidden');
    if (tableEl) tableEl.classList.add('hidden');
    if (emptyEl) { emptyEl.classList.remove('hidden'); emptyEl.innerHTML = '<p>No vehicles found.</p>'; }
    return;
  }

  // Show single result as a card
  if (results.length === 1) {
    var v = results[0];
    if (resultEl) {
      resultEl.classList.remove('hidden');
      resultEl.innerHTML = '<div class="card bg-base-200 shadow-lg"><div class="card-body">' +
        '<h3 class="card-title text-primary">🚗 ' + v.make + ' ' + v.model + ' ' + v.year + '</h3>' +
        '<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">' +
        '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">Refrigerant Type</div><div class="font-bold text-lg">' + v.refrigerant + '</div></div>' +
        '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">Quantity</div><div class="font-bold text-lg">' + v.qty + ' g <span class="text-xs opacity-50">(' + (v.qty / 28.35).toFixed(1) + ' oz)</span></div></div>' +
        '<div class="bg-base-300 rounded-lg p-3 border-l-4 border-primary"><div class="text-xs opacity-50 uppercase">Compressor Oil</div><div class="font-bold text-lg">' + (v.oil || 'N/A') + '</div></div>' +
        '</div></div></div>';
    }
    if (tableEl) tableEl.classList.add('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    return;
  }

  // Show multiple results as a table
  if (resultEl) resultEl.classList.add('hidden');
  if (tableEl) tableEl.classList.remove('hidden');
  if (emptyEl) emptyEl.classList.add('hidden');

  var html = '';
  results.forEach(function(v) {
    html += '<tr class="hover cursor-pointer" onclick="window.VehicleLookup.selectResult(\'' +
      v.make.replace(/'/g,"\\'") + '\',\'' + v.model.replace(/'/g,"\\'") + '\',\'' + v.year.replace(/'/g,"\\'") + '\')">' +
      '<td>' + v.make + '</td><td>' + v.model + '</td><td>' + v.year + '</td>' +
      '<td><span class="badge badge-sm badge-primary">' + v.refrigerant + '</span></td>' +
      '<td>' + v.qty + 'g</td><td class="text-xs">' + (v.oil || 'N/A') + '</td></tr>';
  });
  if (tbody) tbody.innerHTML = html;
}

function selectResult(make, model, year) {
  var results = queryVehicles(make, model, year);
  displayResults(results);
}

function setupEventListeners() {
  var makeEl = document.getElementById('vMake');
  var modelEl = document.getElementById('vModel');
  var yearEl = document.getElementById('vYear');
  var searchEl = document.getElementById('vSearch');

  if (makeEl) {
    makeEl.addEventListener('change', function() {
      populateModels(this.value);
      document.getElementById('vYear').innerHTML = '<option value="">Select Model first</option>';
      document.getElementById('vYear').disabled = true;
      if (this.value) {
        var results = queryVehicles(this.value, null, null);
        displayResults(results);
      }
    });
  }

  if (modelEl) {
    modelEl.addEventListener('change', function() {
      var make = makeEl ? makeEl.value : '';
      populateYears(make, this.value);
      if (this.value) {
        var results = queryVehicles(make, this.value, null);
        displayResults(results);
      }
    });
  }

  if (yearEl) {
    yearEl.addEventListener('change', function() {
      var make = makeEl ? makeEl.value : '';
      var model = modelEl ? modelEl.value : '';
      var results = queryVehicles(make, model, this.value);
      displayResults(results);
    });
  }

  if (searchEl) {
    searchEl.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      var term = this.value;
      searchTimeout = setTimeout(function() {
        if (term.length < 2) {
          document.getElementById('vehicleResult').classList.add('hidden');
          document.getElementById('vehicleTable').classList.add('hidden');
          document.getElementById('vehicleEmpty').classList.remove('hidden');
          return;
        }
        var results = searchVehicles(term);
        displayResults(results);
      }, 300);
    });
  }
}

window.VehicleLookup = {
  init: initVehicleLookup,
  selectResult: selectResult
};

})();