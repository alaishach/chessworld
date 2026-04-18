#!/usr/bin/env bash

PORT=8000

kill_port() {
  if command -v lsof &>/dev/null; then
    lsof -ti tcp:$PORT | xargs kill -9 2>/dev/null || true
  elif command -v netstat &>/dev/null; then
    # Windows Git Bash / MINGW
    PID=$(netstat -ano 2>/dev/null | grep ":$PORT " | grep LISTENING | awk '{print $5}' | head -1)
    if [ -n "$PID" ]; then
      taskkill //F //PID "$PID" 2>/dev/null || true
    fi
  fi
}

cleanup() {
  echo ""
  echo "  Shutting down..."
  if [ -n "$ASTRO_PID" ] && kill -0 "$ASTRO_PID" 2>/dev/null; then
    kill "$ASTRO_PID" 2>/dev/null
    wait "$ASTRO_PID" 2>/dev/null
  fi
  kill_port
  echo "  Done. Port $PORT is free."
  exit 0
}

trap cleanup INT TERM HUP EXIT

echo ""
echo "  CHESSWORLD.GAMES — local dev server"
echo "  ──────────────────────────────────"

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo "0")
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "  ✗ Node.js 20+ is required (found: $(node --version 2>/dev/null || echo 'not installed'))"
  echo "    Install it from https://nodejs.org or via nvm:"
  echo "    nvm install 20 && nvm use 20"
  exit 1
fi
echo "  ✓ Node $(node --version)"

kill_port

if [ ! -d "node_modules" ]; then
  echo "  ↓ node_modules not found — running npm install..."
  npm install
fi
echo "  ✓ Dependencies ready"

echo ""
echo "  Starting on http://localhost:$PORT"
echo "  Press Ctrl+C or close this window to stop."
echo ""

npx astro dev --port $PORT &
ASTRO_PID=$!
wait $ASTRO_PID
