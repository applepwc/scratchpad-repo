(function () {
    'use strict';

    var textarea     = document.getElementById('scratchpad');
    var saveBtn      = document.getElementById('saveButton');
    var statusEl     = document.getElementById('saveStatus');
    var dirtyDot     = document.getElementById('dirtyDot');
    var wordCountEl  = document.getElementById('wordCount');

    var isSaving     = false;
    var isDirty      = false;
    var debounceTimer;
    var savedContent = textarea.value;

    // ── Helpers ──────────────────────────────────────────────

    function markDirty() {
        isDirty = true;
        dirtyDot.hidden = false;
    }

    function markClean() {
        isDirty = false;
        dirtyDot.hidden = true;
        savedContent = textarea.value;
    }

    function setStatus(state, text) {
        statusEl.className = 'sp-save-status ' + state;
        statusEl.textContent = text;
    }

    function updateWordCount() {
        var text  = textarea.value;
        var chars = text.length;
        var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        wordCountEl.textContent =
            words + ' word' + (words !== 1 ? 's' : '') +
            ' · ' +
            chars + ' char' + (chars !== 1 ? 's' : '');
    }

    // ── Save ─────────────────────────────────────────────────

    function doSave() {
        if (isSaving) return;
        isSaving = true;
        saveBtn.disabled = true;
        setStatus('status-saving', 'Saving…');

        var content   = textarea.value;
        var csrfToken = document.getElementById('csrf_token').value;
        var xhr       = new XMLHttpRequest();
        xhr.open('POST', '/save', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            isSaving = false;
            saveBtn.disabled = false;
            if (xhr.status === 200) {
                markClean();
                setStatus('status-saved', '✓ Saved');
                setTimeout(function () {
                    statusEl.classList.add('status-fade');
                    setTimeout(function () {
                        statusEl.className = 'sp-save-status';
                        statusEl.textContent = '';
                    }, 300);
                }, 2500);
            } else {
                setStatus('status-error', '✗ Save failed — try again');
            }
        };
        xhr.send('content=' + encodeURIComponent(content) + '&csrf_token=' + encodeURIComponent(csrfToken));
    }

    // ── Event listeners ──────────────────────────────────────

    saveBtn.addEventListener('click', doSave);

    textarea.addEventListener('input', function () {
        if (!isDirty && textarea.value !== savedContent) markDirty();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateWordCount, 150);
    });

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            doSave();
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // ── Init ─────────────────────────────────────────────────

    updateWordCount();
}());
