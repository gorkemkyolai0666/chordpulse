#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4029/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== ChordPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@istanbulenstrumanatolyesi.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/instruments" -H "Authorization: Bearer $TOKEN")
assert_status "List Instruments" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/handoffs" -H "Authorization: Bearer $TOKEN")
assert_status "List Handoffs" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/benches" -H "Authorization: Bearer $TOKEN")
assert_status "List Benches" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/parts" -H "Authorization: Bearer $TOKEN")
assert_status "List Parts" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/firm" -H "Authorization: Bearer $TOKEN")
assert_status "Firm Profile" 200 "$HTTP_CODE"

CREATE_ORDER=$(curl -s -w "\n%{http_code}" "$API_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"orderNumber":"CP-9999","clientName":"Test Müşteri","orderType":"retail","instrumentCount":2}')
HTTP_CODE=$(echo "$CREATE_ORDER" | tail -1)
assert_status "Create Order" 201 "$HTTP_CODE"

ORDER_ID=$(echo "$CREATE_ORDER" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$ORDER_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/orders/$ORDER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"ready"}')
  assert_status "Update Order" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/orders/$ORDER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Order" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
