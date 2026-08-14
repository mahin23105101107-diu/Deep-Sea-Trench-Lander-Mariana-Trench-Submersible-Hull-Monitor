(function (window) {
  'use strict';
  window.Sonar = {
    init: function (elapsedGetter) {
      var scope = document.getElementById('sonarScope');
      var contacts = document.getElementById('sonarContacts');
      var log = document.getElementById('contactLog');
      if (!scope || !contacts || !log) return;
      var count = 0;
      var names = ['Bioluminescent organism', 'Sediment plume', 'Rock outcrop', 'Unidentified drifting object', 'Amphipod cluster'];
      function ping() {
        var el = document.createElement('div'); el.className = 'ping';
        var a = Math.random() * Math.PI * 2, r = 20 + Math.random() * 70;
        el.style.left = (50 + Math.cos(a) * r * .42) + '%'; el.style.top = (50 + Math.sin(a) * r * .42) + '%'; scope.appendChild(el);
        count++; contacts.textContent = count;
        var li = document.createElement('li');
        var h = Math.floor(elapsedGetter() / 3600), m = Math.floor((elapsedGetter() % 3600) / 60), s = Math.floor(elapsedGetter() % 60);
        function p(n) { return n < 10 ? '0' + n : '' + n; }
        li.innerHTML = '<span class="t">' + p(h) + ':' + p(m) + ':' + p(s) + '</span> Contact: ' + names[Math.floor(Math.random() * names.length)] + ' detected.';
        log.insertBefore(li, log.firstChild); while (log.children.length > 6) log.removeChild(log.lastChild);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
      }
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(ping, 2600);
    }
  };
})(window);
