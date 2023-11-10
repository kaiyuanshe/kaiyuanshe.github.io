# Stage 1: Building the application
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm rm yarn -g
RUN npm i pnpm -g 
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Production docker images
FROM node:18-slim
RUN apt-get update && \
    apt-get install curl -y --no-install-recommends
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
CMD ["npm", "start"]