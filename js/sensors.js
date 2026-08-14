(function (window) {
  'use strict';
  window.HullSensors = {
    update: function (depth, maxDepth) {
      var frac = depth / maxDepth;
      document.querySelectorAll('.sensor-card').forEach(function (card) {
        var reading = card.querySelector('[data-reading]');
        var meter = card.querySelector('[data-meter]');
        var chip = card.querySelector('[data-chip]');
        if (!reading || !meter || !chip) return;
        var kind = card.getAttribute('data-sensor');
        var val, pct, unit;
        if (kind === 'bow' || kind === 'stern' || kind === 'dome') {
          val = (0.02 + frac * (kind === 'dome' ? 0.7 : 0.55) + Math.random() * 0.02).toFixed(2);
          pct = Math.min(100, frac * 70 + parseFloat(val) * 8);
          unit = 'mm/mm microstrain';
        } else if (kind === 'acoustic') {
          val = Math.round(4 + frac * 46 + Math.random() * 4);
          pct = Math.min(100, frac * 80 + val * 0.3);
          unit = 'events / min';
        } else if (kind === 'lidar') {
          val = frac > 0.9 ? Math.round(Math.random() * 2) : 0;
          pct = Math.min(100, frac * 20);
          unit = 'deviations flagged';
        } else {
          val = (3.2 + frac * 9 + Math.random() * 0.5).toFixed(1);
          pct = Math.min(100, frac * 60);
          unit = '°C differential';
        }
        reading.innerHTML = val + '<span class="u">' + unit + '</span>';
        meter.style.width = pct + '%';
        var status = pct > 82 ? 'critical' : pct > 55 ? 'watch' : 'nominal';
        chip.className = 'status-chip ' + status;
        chip.textContent = status === 'critical' ? 'Critical' : status === 'watch' ? 'Watch' : 'Nominal';
        meter.style.background = status === 'critical' ? 'var(--red)' : status === 'watch' ? 'var(--amber)' : 'var(--teal)';
      });
    }
  };
})(window);
