# --- Build Stage ---
    FROM node:22-alpine AS builder
    WORKDIR /app
    
    # 1. FIX: Copy your Mac's native working pnpm binary directly into the system path
    COPY pnpm-local-bin /usr/local/bin/pnpm
    RUN chmod +x /usr/local/bin/pnpm
    
    # 2. Copy your monorepo workspace configurations and root lockfile
    COPY pnpm-lock.yaml package.json ./
    COPY pnpm-workspace.yaml* tsconfig*.json turbo.json* ./
    
    # 3. Copy your backend service server files
    COPY apps/server ./apps/server
    
    # 4. Install your project dependencies using your exact locked versions
    RUN pnpm install --frozen-lockfile
    
    # 5. Build your server app
    RUN pnpm --filter=server run build
    
    # --- Production Runner Stage ---
    FROM node:22-alpine AS runner
    WORKDIR /app
    
    # Copy the compiled JS files and fully resolved node_modules from builder
    COPY --from=builder /app/apps/server/dist ./dist
    COPY --from=builder /app/apps/server/package.json ./package.json
    COPY --from=builder /app/node_modules ./node_modules
    
    EXPOSE 5000
    
    # Execute native node directly (Zero network dependencies)
    CMD ["node", "dist/server.js"]
    