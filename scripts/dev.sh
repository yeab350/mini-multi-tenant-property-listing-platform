#!/usr/bin/env bash
set -euo pipefail

# Starts backend + frontend dev servers.
# Usage: ./scripts/dev.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

( cd "$ROOT_DIR/backend" && npm run start:dev ) &
( cd "$ROOT_DIR/frontend" && npm run dev ) &

wait
