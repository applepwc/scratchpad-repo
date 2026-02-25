(function () {
    'use strict';

    var AUTOSAVE_DELAY = 2000;   // ms of inactivity before autosave triggers

    // ── DOM refs ─────────────────────────────────────────────

    var card        = document.querySelector('.sp-app');
    var toolbar     = document.querySelector('.sp-toolbar');
    var textarea    = document.getElementById('scratchpad');
    var maxBtn      = document.getElementById('maximizeButton');
    var statusEl    = document.getElementById('saveStatus');
    var dirtyDot    = document.getElementById('dirtyDot');
    var wordCountEl = document.getElementById('wordCount');

    // ── State ────────────────────────────────────────────────

    var isSaving     = false;
    var isDirty      = false;
    var isMaximized  = false;
    var savedGeom    = {};
    var autosaveTimer;
    var wordCountTimer;
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

    function clearStatus() {
        statusEl.className = 'sp-save-status status-fade';
        setTimeout(function () {
            statusEl.className = 'sp-save-status';
            statusEl.textContent = '';
        }, 300);
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
        if (isSaving || !isDirty) return;
        isSaving = true;
        setStatus('status-saving', 'Saving…');

        var content   = textarea.value;
        var csrfToken = document.getElementById('csrf_token').value;
        var xhr       = new XMLHttpRequest();
        xhr.open('POST', '/save', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            isSaving = false;
            if (xhr.status === 200) {
                markClean();
                setStatus('status-saved', '✓ Autosaved');
                setTimeout(clearStatus, 2500);
            } else {
                setStatus('status-error', '✗ Save failed — will retry on next change');
            }
        };
        xhr.send('content=' + encodeURIComponent(content) + '&csrf_token=' + encodeURIComponent(csrfToken));
    }

    // ── Input handler — word count (150 ms) + autosave (2 s) ─

    textarea.addEventListener('input', function () {
        if (!isDirty && textarea.value !== savedContent) markDirty();

        // word count: fast debounce
        clearTimeout(wordCountTimer);
        wordCountTimer = setTimeout(updateWordCount, 150);

        // autosave: longer debounce, reset on every keystroke
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(doSave, AUTOSAVE_DELAY);
    });

    // ── Ctrl/Cmd+S — immediate save ──────────────────────────

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            clearTimeout(autosaveTimer);   // cancel pending autosave
            doSave();
        }
    });

    // ── Leave-page guard ─────────────────────────────────────

    window.addEventListener('beforeunload', function (e) {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // ── Window: maximize / restore ───────────────────────────

    function toggleMaximize() {
        if (!isMaximized) {
            savedGeom = {
                left:   card.style.left,
                top:    card.style.top,
                width:  card.style.width,
                height: card.style.height
            };
            card.style.left         = '0px';
            card.style.top          = '0px';
            card.style.width        = window.innerWidth  + 'px';
            card.style.height       = window.innerHeight + 'px';
            card.style.borderRadius = '0';
            maxBtn.querySelector('i').className = 'fas fa-window-restore';
            maxBtn.title = 'Restore';
            isMaximized  = true;
        } else {
            card.style.left         = savedGeom.left;
            card.style.top          = savedGeom.top;
            card.style.width        = savedGeom.width;
            card.style.height       = savedGeom.height;
            card.style.borderRadius = '';
            maxBtn.querySelector('i').className = 'fas fa-window-maximize';
            maxBtn.title = 'Maximize';
            isMaximized  = false;
        }
    }

    // ── Window: initial centered position ────────────────────

    (function initCard() {
        var w = Math.min(900, window.innerWidth  * 0.92);
        var h = Math.min(620, window.innerHeight * 0.84);
        card.style.width  = w + 'px';
        card.style.height = h + 'px';
        card.style.left   = Math.max(0, Math.round((window.innerWidth  - w) / 2)) + 'px';
        card.style.top    = Math.max(0, Math.round((window.innerHeight - h) / 2)) + 'px';
    }());

    // ── Window: drag & resize via interact.js ────────────────

    interact(card)
        .draggable({
            allowFrom:  '.sp-toolbar',
            ignoreFrom: 'button',
            listeners: {
                move: function (event) {
                    if (isMaximized) return;
                    card.style.left = (parseFloat(card.style.left) || 0) + event.dx + 'px';
                    card.style.top  = (parseFloat(card.style.top)  || 0) + event.dy + 'px';
                }
            },
            modifiers: [
                interact.modifiers.restrictRect({ restriction: 'body', endOnly: true })
            ]
        })
        .resizable({
            edges:  { top: true, left: true, bottom: true, right: true },
            margin: 8,
            listeners: {
                move: function (event) {
                    if (isMaximized) return;
                    card.style.width  = event.rect.width  + 'px';
                    card.style.height = event.rect.height + 'px';
                    card.style.left   = (parseFloat(card.style.left) || 0) + event.deltaRect.left + 'px';
                    card.style.top    = (parseFloat(card.style.top)  || 0) + event.deltaRect.top  + 'px';
                }
            },
            modifiers: [
                interact.modifiers.restrictSize({ min: { width: 400, height: 260 } })
            ]
        });

    maxBtn.addEventListener('click', toggleMaximize);

    toolbar.addEventListener('dblclick', function (e) {
        if (e.target.closest('button')) return;
        toggleMaximize();
    });

    // ── Init ─────────────────────────────────────────────────

    updateWordCount();
}());
