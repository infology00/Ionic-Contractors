/* =============================================================================
   Ionic Contractors — form validation, routing and lead tagging
   -----------------------------------------------------------------------------
   Every form on the site is marked up with:

     <form data-ionic-form data-lead-type="co|teaming|subcontractor|capability|contact">

   Validation is accessible: errors are announced through a live region, the
   invalid control gets aria-invalid + aria-describedby, and focus moves to the
   first failing field.

   ROUTING (see config.js):
     window.IONIC_FORM_ENDPOINT  — POST target (CRM / form service webhook).
     If it is empty, the form falls back to composing an email to
     service@ionic.contractors so the site is never a dead end before the
     back end is wired up in the dev working session.
   ============================================================================= */
(function () {
  'use strict';

  var LEAD_EMAIL = 'service@ionic.contractors';

  var LEAD_LABELS = {
    co: 'Contracting Officer inquiry',
    teaming: 'Teaming / prime partner inquiry',
    subcontractor: 'Subcontractor registration',
    capability: 'Capability statement request',
    contact: 'General contact'
  };

  /* --------------------------------------------------------------------- */
  /* Validation helpers                                                    */
  /* --------------------------------------------------------------------- */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+()\-.\s\d]{7,}$/;
  var MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB per file
  var ALLOWED_UPLOADS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

  function labelFor(field) {
    var group = field.closest('.field');
    var label = group ? group.querySelector('label, .label') : null;
    var text = label ? label.textContent : field.name;
    return text.replace(/\*/g, '').replace(/\(required\)/gi, '').replace(/\s+/g, ' ').trim();
  }

  function errorNode(field) {
    var group = field.closest('.field');
    if (!group) return null;
    var node = group.querySelector('.field-error');
    if (!node) {
      node = document.createElement('p');
      node.className = 'field-error';
      node.id = (field.id || field.name) + '-error';
      group.appendChild(node);
    }
    return node;
  }

  function showError(field, message) {
    var node = errorNode(field);
    if (node) {
      node.textContent = message;
      node.classList.add('is-visible');
      field.setAttribute('aria-describedby',
        [field.getAttribute('data-hint-id'), node.id].filter(Boolean).join(' '));
    }
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    var node = errorNode(field);
    if (node) {
      node.textContent = '';
      node.classList.remove('is-visible');
    }
    field.removeAttribute('aria-invalid');
    var hint = field.getAttribute('data-hint-id');
    if (hint) field.setAttribute('aria-describedby', hint);
    else field.removeAttribute('aria-describedby');
  }

  function validateField(field) {
    var value = (field.value || '').trim();
    var name = labelFor(field);

    if (field.hasAttribute('required')) {
      if (field.type === 'checkbox' && !field.checked) {
        showError(field, name + ' is required.');
        return false;
      }
      if (field.type !== 'checkbox' && value === '') {
        showError(field, name + ' is required.');
        return false;
      }
    }

    if (value !== '' && field.type === 'email' && !EMAIL_RE.test(value)) {
      showError(field, 'Enter a valid email address, for example name@agency.gov.');
      return false;
    }

    if (value !== '' && field.type === 'tel' && !PHONE_RE.test(value)) {
      showError(field, 'Enter a valid phone number, for example 252-546-7181.');
      return false;
    }

    if (field.type === 'file' && field.files && field.files.length) {
      for (var i = 0; i < field.files.length; i++) {
        var file = field.files[i];
        var ext = file.name.split('.').pop().toLowerCase();
        if (ALLOWED_UPLOADS.indexOf(ext) === -1) {
          showError(field, 'Accepted file types: ' + ALLOWED_UPLOADS.join(', ').toUpperCase() + '.');
          return false;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          showError(field, 'Each file must be 10 MB or smaller.');
          return false;
        }
      }
    }

    clearError(field);
    return true;
  }

  /* --------------------------------------------------------------------- */
  /* Status region                                                         */
  /* --------------------------------------------------------------------- */

  function statusRegion(form) {
    var region = form.querySelector('.form-status');
    if (!region) {
      region = document.createElement('div');
      region.className = 'form-status';
      form.insertBefore(region, form.firstChild);
    }
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    return region;
  }

  function announce(form, variant, heading, body) {
    var region = statusRegion(form);
    region.innerHTML = '';
    var box = document.createElement('div');
    box.className = 'alert alert--' + variant;
    box.setAttribute('tabindex', '-1');
    var h = document.createElement('h3');
    h.textContent = heading;
    box.appendChild(h);
    if (body) {
      var p = document.createElement('p');
      p.innerHTML = body;
      box.appendChild(p);
    }
    region.appendChild(box);
    return box;
  }

  /* --------------------------------------------------------------------- */
  /* Submission payload                                                    */
  /* --------------------------------------------------------------------- */

  function readableEntries(form) {
    var rows = [];
    var seen = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit' || el.classList.contains('hp-input')) return;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;

      var key = labelFor(el) || el.name;
      var value;
      if (el.type === 'file') {
        value = el.files && el.files.length
          ? Array.prototype.map.call(el.files, function (f) { return f.name; }).join(', ')
          : '(none)';
      } else if (el.type === 'checkbox') {
        value = el.parentNode && el.parentNode.textContent
          ? el.parentNode.textContent.trim()
          : 'Yes';
        key = (el.closest('fieldset') && el.closest('fieldset').querySelector('legend'))
          ? el.closest('fieldset').querySelector('legend').textContent.trim()
          : key;
      } else {
        value = (el.value || '').trim();
      }
      if (!value) return;

      if (seen[key] !== undefined) rows[seen[key]][1] += ', ' + value;
      else { seen[key] = rows.length; rows.push([key, value]); }
    });
    return rows;
  }

  function mailtoFallback(form, leadType) {
    var subject = '[' + (LEAD_LABELS[leadType] || 'Website inquiry') + '] ionic.contractors';
    var lines = readableEntries(form).map(function (row) { return row[0] + ': ' + row[1]; });
    lines.push('');
    lines.push('Lead type: ' + leadType);
    lines.push('Submitted from: ' + window.location.href);
    var body = lines.join('\n');
    return 'mailto:' + LEAD_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  /* --------------------------------------------------------------------- */
  /* Success handling                                                      */
  /* --------------------------------------------------------------------- */

  function onSuccess(form, leadType) {
    window.ionicTrack('generate_lead', {
      lead_type: leadType,
      form_id: form.id || '',
      form_name: form.getAttribute('data-form-name') || '',
      page_path: window.location.pathname
    });

    var heading = form.getAttribute('data-success-heading') || 'Thank you — your message is on its way.';
    var message = form.getAttribute('data-success-message') ||
      'We respond to agency and teaming inquiries promptly — usually the same business day. ' +
      'If you need us sooner, call <a href="tel:+12525467181">252-546-7181</a>.';

    var fields = form.querySelector('.form-fields');
    if (fields) fields.hidden = true;
    var actions = form.querySelector('.form-actions');
    if (actions) actions.hidden = true;

    var box = announce(form, 'success', heading, message);

    // Gated capability statement: reveal the download once the form is complete.
    var download = form.getAttribute('data-download-url');
    if (download) {
      var wrap = document.createElement('p');
      var link = document.createElement('a');
      link.className = 'btn btn--primary';
      link.href = download;
      link.setAttribute('download', '');
      link.textContent = 'Download the Capability Statement (PDF)';
      link.addEventListener('click', function () {
        window.ionicTrack('file_download', { file_name: download, lead_type: leadType });
      });
      wrap.appendChild(link);
      box.appendChild(wrap);
    }

    box.focus();
  }

  /* --------------------------------------------------------------------- */
  /* Wire up                                                               */
  /* --------------------------------------------------------------------- */

  Array.prototype.forEach.call(document.querySelectorAll('[data-ionic-form]'), function (form) {
    var leadType = form.getAttribute('data-lead-type') || 'contact';

    // Re-validate on blur once a field has been touched.
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit') return;
      el.addEventListener('blur', function () {
        if (el.getAttribute('aria-invalid') === 'true' || (el.value || '').trim() !== '') {
          validateField(el);
        }
      });
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validateField(el);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Silent spam trap.
      var hp = form.querySelector('.hp-input');
      if (hp && hp.value !== '') {
        onSuccess(form, leadType);
        return;
      }

      var invalid = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'submit' || el.classList.contains('hp-input')) return;
        if (!validateField(el)) invalid.push(el);
      });

      if (invalid.length) {
        var list = invalid.map(function (el) { return '<li>' + labelFor(el) + '</li>'; }).join('');
        announce(form, 'error',
          invalid.length === 1 ? 'One field needs your attention' : invalid.length + ' fields need your attention',
          '<ul>' + list + '</ul>').focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var endpoint = window.IONIC_FORM_ENDPOINT || form.getAttribute('action') || '';

      if (!endpoint) {
        // No back end configured yet — hand the submission to the user's mail client.
        var href = mailtoFallback(form, leadType);
        announce(form, 'notice', 'Almost done — finish in your email client',
          'Your email application is opening with this inquiry addressed to ' +
          '<a href="mailto:' + LEAD_EMAIL + '">' + LEAD_EMAIL + '</a>. ' +
          'Send it and we will respond promptly. If nothing opened, ' +
          '<a href="' + href + '">use this link</a> or email us directly.' +
          (form.querySelector('input[type="file"]')
            ? ' Please attach your documents to that email — file uploads are delivered by attachment until the intake portal is live.'
            : '')
        ).focus();
        window.location.href = href;
        window.ionicTrack('generate_lead', { lead_type: leadType, delivery: 'mailto' });
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-label', submitBtn.textContent);
        submitBtn.textContent = 'Sending…';
      }

      var data = new FormData(form);
      data.append('lead_type', leadType);
      data.append('lead_label', LEAD_LABELS[leadType] || 'Website inquiry');
      data.append('source_page', window.location.href);

      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          onSuccess(form, leadType);
        })
        .catch(function () {
          announce(form, 'error', 'We could not send that from your browser',
            'Please email <a href="mailto:' + LEAD_EMAIL + '">' + LEAD_EMAIL + '</a> or call ' +
            '<a href="tel:+12525467181">252-546-7181</a> and we will pick it up right away.').focus();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.getAttribute('data-label') || 'Submit';
          }
        });
    });
  });
})();
