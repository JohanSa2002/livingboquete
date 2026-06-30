FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
RUN npx tsx scripts/seed.ts

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/data ./data
ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80
CMD ["node", "dist/server/entry.mjs"]
