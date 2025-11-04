# Use Node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install redis-cli
RUN apk add --no-cache redis

# Copy package files and install dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest-10 --activate

# Install dependencies (with pnpm support)
# We need dev dependencies to run the build!
RUN pnpm install

# Copy the rest of the project (source code, tsconfig, etc.)
COPY . .

# Build the app (compiles to 'dist' folder)
# This MUST be configured to place your main.js, ORM config, 
# and compiled migration files (e.g., dist/migrations/*.js) inside 'dist'.
RUN pnpm run build

# --- CRITICAL FIX: Running Migrations ---
# 
# 1. Update your 'CMD' to run the migration script first.
# 2. Ensure your build script compiles an entry point for migrations (e.g., 'migrate.js').
# 3. For a quick fix, let's assume you have a script in package.json to run migrations:
#
#    Example: "migrate:up": "mikro-orm migration:up"
#
# You MUST run this using 'pnpm exec' or 'npx' before starting the app.

# Expose port
EXPOSE 3000

# Run the app
# The command must: 
# 1. Execute the migration CLI tool (using pnpm exec or npx).
# 2. Start the main compiled application entry point.

# CMD ["sh", "-c", "pnpm exec mikro-orm migration:up && node dist/src/main.js"]
CMD ["node", "dist/src/main.js"]
# NOTE: The exact path 'dist/main.js' should match your NestJS build output.
#       Remove 'dist/src/' if your build output is flat in 'dist'.