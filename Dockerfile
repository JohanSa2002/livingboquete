FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
ENV HOST=0.0.0.0
ENV PORT=80
# Required at runtime: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_SECRET, ADMIN_PASS
EXPOSE 80
CMD ["node", "dist/server/entry.mjs"]
