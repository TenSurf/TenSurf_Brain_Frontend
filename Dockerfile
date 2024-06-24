FROM node:18-alpine as builder
WORKDIR /temp
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /temp/next.config.mjs ./
COPY --from=builder /temp/public ./public
COPY --from=builder /temp/node_modules ./node_modules
COPY --from=builder /temp/.next ./.next
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
