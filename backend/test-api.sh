#!/bin/bash

echo "========================================="
echo "    ТЕСТИРОВАНИЕ API СЕРВЕРА FAMILYHUB"
echo "========================================="
echo ""

# 1. Health Check
echo "=== 1. Health Check ==="
curl -s http://localhost:5000/api/health | jq
echo ""

# 2. Все задачи
echo "=== 2. Все задачи ==="
curl -s http://localhost:5000/api/tasks | jq '.[] | {id, title, status}'
echo ""

# 3. Все расходы
echo "=== 3. Все расходы ==="
curl -s http://localhost:5000/api/costs | jq '.[] | {id, amount, note}'
echo ""

# 4. Категории
echo "=== 4. Категории ==="
curl -s http://localhost:5000/api/categories | jq
echo ""

# 5. Пользователи
echo "=== 5. Пользователи ==="
curl -s http://localhost:5000/api/users | jq
echo ""

echo "========================================="
echo "    ТЕСТИРОВАНИЕ ЗАВЕРШЕНО"
echo "========================================="