#!/usr/bin/env bash
set -euo pipefail

# Basic smoke tests for PHP API endpoints
API_URL=${API_URL:-http://localhost}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@example.com}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}

echo "Testing login..."
LOGIN_RES=$(curl -s -X POST "$API_URL/api/auth/login" -H 'Content-Type: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
echo "Login response: $LOGIN_RES"

TOKEN=$(echo "$LOGIN_RES" | jq -r '.token // empty')
if [ -z "$TOKEN" ]; then
  echo "Login failed or token not returned. Skipping remaining tests."
  exit 1
fi

echo "Testing /api/auth/me"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/auth/me" | jq

echo "Testing /api/pages/home"
curl -s "$API_URL/api/pages/home" | jq

echo "Creating test contact as admin"
curl -s -X POST "$API_URL/api/contacts" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"subject":1, "message": "Test message via script", "sender": "Test", "sender_email": "test@example.com"}' | jq

echo "Done."
