# ===== Build stage =====
FROM node:20-alpine AS build
WORKDIR /app
ENV CI=true

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Serve with Nginx =====
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Add custom nginx config for SPA + /api proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static files
COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
