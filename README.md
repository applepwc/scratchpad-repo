# Scratchpad Web Application

A simple web application that provides a scratchpad for users to edit and save content, built with Python/Flask on the backend and HTML/JavaScript on the frontend.

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/applepwc/scratchpad-repo.git
    cd scratchpad-repo
    ```

2. Install dependencies with [uv](https://docs.astral.sh/uv/):
    ```bash
    uv sync
    ```

3. Set the `SECRET_KEY` environment variable (required for CSRF protection):
    ```bash
    export SECRET_KEY='your-secret-key-here'
    ```
    If omitted, a random key is generated at startup — this means CSRF tokens are invalidated on every restart. Always set a fixed key in any persistent or production deployment.

4. Run the application:
    ```bash
    uv run flask run --debug
    ```

5. Open `http://127.0.0.1:5000/` in your browser.

## Docker

```bash
# Build and start
docker compose build
docker compose up

# Open http://localhost:5000
```

`scratchpad.txt` is persisted in a named Docker volume (`scratchpad_data`) so data
survives container restarts.  Set a proper `SECRET_KEY` in `docker-compose.yml`
before deploying.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Recommended | Secret key for CSRF token signing. Use a long random string. |
| `FLASK_DEBUG` | No | Set to `true` to enable debug mode. Never use in production. |

## How It Works

- Content is auto-saved to `scratchpad.txt` in the project root on each Save click (or Ctrl/Cmd+S).
- The save operation is atomic: content is written to a `.tmp` file first, then swapped in via `os.replace()` to prevent data corruption on crash.
- Requests to `/save` are CSRF-protected via Flask-WTF.
- Upload size is limited to 1 MB.

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) package manager
