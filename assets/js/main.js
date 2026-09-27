(function () {
  // ---- Series filters (Work page) ----
  var filterButtons = document.querySelectorAll('[data-filter]');
  var countEl = document.querySelector('[data-count]');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var shown = 0;
      document.querySelectorAll('[data-gallery] .work').forEach(function (w) {
        var match = f === 'all' || w.getAttribute('data-series') === f;
        w.hidden = !match;
        if (match) shown++;
      });
      if (countEl) countEl.textContent = shown;
    });
  });

  // ---- Lightbox ----
  var dlg = document.getElementById('lightbox');
  if (dlg && typeof dlg.showModal === 'function') {
    var email = dlg.getAttribute('data-email');
    var img = document.getElementById('lb-img');
    var title = document.getElementById('lb-title');
    var medium = document.getElementById('lb-medium');
    var dims = document.getElementById('lb-dims');
    var status = document.getElementById('lb-status');
    var enquire = document.getElementById('lb-enquire');
    var current = 0;

    function visible() {
      return Array.prototype.slice.call(
        document.querySelectorAll('[data-gallery] .work:not([hidden]) button.view')
      );
    }

    function show(i) {
      var items = visible();
      if (!items.length) return;
      current = (i + items.length) % items.length;
      var d = items[current].dataset;
      img.src = d.src;
      img.alt = d.title;
      title.textContent = d.title;
      medium.textContent = d.medium;
      medium.hidden = !d.medium;
      dims.textContent = d.dimensions;
      dims.hidden = !d.dimensions;
      var sold = d.status === 'sold';
      status.textContent = sold ? 'Sold' : 'Available · price on request';
      enquire.hidden = sold;
      enquire.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Enquiry: ' + d.title);
    }

    document.querySelectorAll('[data-gallery] button.view').forEach(function (btn) {
      btn.addEventListener('click', function () {
        show(visible().indexOf(btn));
        dlg.showModal();
      });
    });
    document.getElementById('lb-prev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { show(current + 1); });
    document.getElementById('lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // ---- Copy email (Contact page) ----
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });
})();
