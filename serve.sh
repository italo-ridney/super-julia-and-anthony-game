#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Super Julia & Anthony — http://localhost:8080"
echo "Pare com Ctrl+C"
exec python3 -m http.server 8080
