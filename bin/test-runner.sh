#! /bin/bash

set -e
if grep -qE "(Microsoft|WSL)" /proc/version &> /dev/null; then
  echo "Running Integration Tests (in WSL)"
  export WSL_ENV=true
  # export CHROME_BINARY="/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
  export CHROME_BINARY="$PWD/bin/chrome-win/chrome.exe"
  export CHROME_DATA_DIR="$PWD/tests/puppeteer-chrome-profile"
else
  echo "Running Integration Tests"
fi

node -r dotenv/config tests/app.test.js
