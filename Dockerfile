# Base on Node.js LTS (slim variant for smaller image)
FROM node:20-slim AS base

# Install dependencies needed for build
FROM base AS deps
WORKDIR /app

# Install build tools for native dependencies and bun for faster installation
RUN apt-get update -y && apt-get install -y openssl libc6 python3 make g++ fuse3 libfuse2 ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN npm install -g bun

# Copy package.json and lock files
COPY package.json bun.lock* package-lock.json* ./
# Install dependencies with cache busting
RUN bun install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and build application
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

# Set Node to production mode
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy build output from builder stage
COPY --from=builder /app/public ./public

# Set the correct permissions
RUN mkdir .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Copy needed configuration files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# Expose the port the app will run on
EXPOSE 3000

# Set the command to run the app
CMD ["node", "server.js"]
