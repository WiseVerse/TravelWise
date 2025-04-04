# 1. Build-Stage: Next.js-Anwendung bauen
FROM node:latest AS builder
WORKDIR /app

# 2. Paketdateien kopieren & Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 3. Den gesamten Code kopieren
COPY . .

# 4. Next.js-Anwendung bauen
RUN npm run build

# 5. Production-Stage: Kleinere, optimierte Runtime
FROM node:latest AS runner
WORKDIR /app

# 6. Nur das Nötigste kopieren (kein Entwicklungs-Code)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# 7. Standardport setzen
EXPOSE 3000

# 8. Startbefehl für die Anwendung
CMD ["npm", "start"]
