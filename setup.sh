#!/bin/bash

set -e  # Exit on any error
set -o pipefail

# Define paths
ENV_FILE="apps/connector/.env"
ENV_EXAMPLE_FILE="apps/connector/.env.example"
APP_SERVICE="connector"
MIGRATE_SCRIPT_PATH="dist/migrate.js"

echo "🔧 Setting up your application..."

# Step 1: Copy .env file if missing
if [ ! -f "$ENV_FILE" ]; then
  echo "📄 .env not found. Creating from .env.example..."
  cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
else
  echo "📄 .env already exists. Skipping copy."
fi

# Step 2: Build and run containers
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

# Step 3: Wait for Postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec "$(docker-compose ps -q db)" pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Step 4: Run migration script inside the app container
echo "📦 Running database migrations..."
docker-compose exec $APP_SERVICE node $MIGRATE_SCRIPT_PATH

# Step 5: Show final message
echo "🚀 All set! Your application is running at http://localhost:3000"
