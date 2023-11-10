# 阶段一：构建应用程序
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段二：生产镜像
FROM node:18-slim
RUN apt-get update && \
    apt-get install curl -y --no-install-recommends
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
CMD ["npm", "start"]