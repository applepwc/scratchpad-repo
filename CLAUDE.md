# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Application

```bash
pip install -r requirements.txt
python app.py
```

The app runs on `http://127.0.0.1:5000/` in debug mode.

## Architecture

This is a minimal Flask web scratchpad. The entire backend is in `app.py` (two routes). Content is persisted to `scratchpad.txt` in the repo root via plain file I/O — there is no database.

**Request flow:**
1. `GET /` — reads `scratchpad.txt` and renders `templates/index.html` with the content injected via Jinja2
2. `POST /save` — writes `request.form['content']` back to `scratchpad.txt`

**Frontend** (`static/script.js`, `static/styles.css`, `templates/index.html`): vanilla JS with an `XMLHttpRequest` POST to `/save` on button click. Bootstrap 4.5.2 and Font Awesome 5.15.3 are loaded from CDN.

There are no tests, no linter configuration, and no build step.
