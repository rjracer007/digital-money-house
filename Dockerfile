# Usamos Node como base
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Next.js
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]