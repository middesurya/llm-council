#!/bin/bash

echo "========================================"
echo "Testing Healthcare Knowledge Base"
echo "========================================"

echo ""
echo "Test 1: Chest pain query (healthcare domain)"
curl -s -X POST http://localhost:3001/api/council/query/stream \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Patient has chest pain and shortness of breath, what could this be?",
    "domain": "healthcare"
  }' &
CURL_PID=$!

echo "Waiting for response..."
sleep 5

kill $CURL_PID 2>/dev/null

echo ""
echo "========================================"
echo "Testing Finance Knowledge Base"
echo "========================================"

echo ""
echo "Test 2: Revenue recognition query (finance domain)"
curl -s -X POST http://localhost:3001/api/council/query/stream \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I recognize revenue under ASC 606?",
    "domain": "finance"
  }' &
CURL_PID2=$!

echo "Waiting for response..."
sleep 5

kill $CURL_PID2 2>/dev/null

echo ""
echo "========================================"
echo "✅ API test initiated"
echo "Check the server logs and browser for results"
echo "========================================"
