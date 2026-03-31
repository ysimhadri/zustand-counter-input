#!/bin/zsh

cd "$(dirname "$0")"

# Show current changes
echo "\n📋 Changed files:"
git status --short

# Check if there's anything to commit
if [ -z "$(git status --porcelain)" ]; then
  echo "\n✅ Nothing to commit, working tree clean."
  exit 0
fi

# Prompt for commit message
echo "\n💬 Commit message (leave blank to cancel): "
read msg

if [ -z "$msg" ]; then
  echo "❌ Commit cancelled."
  exit 1
fi

git add .
git commit -m "$msg"

echo "\n✅ Committed: $msg"
