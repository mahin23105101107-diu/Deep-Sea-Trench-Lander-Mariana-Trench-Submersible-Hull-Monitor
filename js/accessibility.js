(function (window) {
  'use strict';
  window.Accessibility = {
    init: function () {
      var contrast = document.getElementById('contrastToggle');
      if (contrast) contrast.addEventListener('click', function () { var on = document.body.classList.toggle('contrast'); contrast.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var scale = 1, plus = document.getElementById('textLarger'), minus = document.getElementById('textSmaller');
      if (plus) plus.addEventListener('click', function () { scale = Math.min(1.35, scale + .1); document.documentElement.style.setProperty('--fs-scale', scale); });
      if (minus) minus.addEventListener('click', function () { scale = Math.max(.85, scale - .1); document.documentElement.style.setProperty('--fs-scale', scale); });
    }
  };
})(window);
