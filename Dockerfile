FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=0

WORKDIR /app

# Install dependencies first — this layer is cached unless uv.lock / pyproject.toml change
RUN --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Copy source code (changes here don't bust the dependency cache layer above)
COPY . .

# Install the project itself
RUN uv sync --frozen --no-dev

# Create a non-root user; set up /data volume directory with correct ownership
RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser appuser && \
    mkdir -p /data && \
    touch /data/scratchpad.txt && \
    chown -R appuser:appuser /app /data

USER appuser

EXPOSE 5000

CMD ["uv", "run", "gunicorn", "--workers", "1", "--bind", "0.0.0.0:5000", "app:app"]
