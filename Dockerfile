# Etapa 1: Instalación de dependencias
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 2: Construcción (Build) de Next.js para producción
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Construimos la aplicación optimizada
RUN npm run build

# Etapa 3: Imagen final para producción (Runner)
FROM node:18-alpine AS runner
WORKDIR /app

# Configuramos el entorno de producción
ENV NODE_ENV production

# Creamos un usuario no-root por seguridad (Buenas prácticas AWS)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos solo lo necesario desde la etapa builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Comando para iniciar el servidor Next.js standalone
CMD ["node", "server.js"]