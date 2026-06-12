#!/bin/bash
cd /home/team/shared/repo
git add -A
git status --short
git commit -m "fix: i18n fallback in request.ts + middleware export fix + getTranslations in page"

# Try to push
git push origin main 2>&1
echo "EXIT CODE: $?"