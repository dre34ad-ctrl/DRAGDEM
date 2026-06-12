#!/bin/bash
cd /home/team/shared/repo
echo "=== Installing dependencies ==="
npm install --no-audit --no-fund 2>&1 | tail -5
echo "=== node_modules exists? ==="
ls -d node_modules 2>&1
echo "=== Checking next ==="
npm ls next 2>/dev/null | head -3
echo "=== Running build ==="
npx next build 2>&1 | tail -30