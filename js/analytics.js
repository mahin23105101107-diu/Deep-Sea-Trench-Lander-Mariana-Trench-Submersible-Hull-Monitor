(function (window) {
  'use strict';
  var pressureHistory = [];
  var stressHistory = [];
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function draw(canvas, data, maxY, label) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.clientWidth || 500, h = 240, dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = css('--line-strong'); ctx.lineWidth = 1;
    for (var i = 0; i < 5; i++) { var y = 20 + i * (h - 45) / 4; ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(w - 12, y); ctx.stroke(); }
    ctx.fillStyle = css('--steel-mute'); ctx.font = '10px JetBrains Mono, monospace';
    for (var j = 0; j < 5; j++) { ctx.fillText(Math.round(maxY - (maxY * j / 4)), 6, 23 + j * (h - 45) / 4); }
    if (data.length < 2) return;
    var maxX = Math.max(1, data.length - 1), color = css('--teal') || '#00e6c1';
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
    data.forEach(function (v, i) { var x = 42 + (i / maxX) * (w - 54), y = 20 + (1 - Math.min(v, maxY) / maxY) * (h - 45); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke(); ctx.fillStyle = color; ctx.fillText(label, w - 125, 18);
  }
  window.Analytics = {
    update: function (depth, maxDepth) {
      pressureHistory.push(1 + depth / 10);
      stressHistory.push(Math.min(100, depth / maxDepth * 92));
      if (pressureHistory.length > 80) { pressureHistory.shift(); stressHistory.shift(); }
      draw(document.getElementById('pressureChart'), pressureHistory, 1100, 'bar');
      draw(document.getElementById('stressChart'), stressHistory, 100, '%');
    },
    redraw: function () {
      draw(document.getElementById('pressureChart'), pressureHistory, 1100, 'bar');
      draw(document.getElementById('stressChart'), stressHistory, 100, '%');
    },
    reset: function () { pressureHistory = []; stressHistory = []; }
  };
})(window);
