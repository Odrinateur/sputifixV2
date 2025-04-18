# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configuration nginx pour le routing React
RUN echo '                                               \
server {                                                \
    listen 80;                                          \
    location / {                                        \
        root /usr/share/nginx/html;                     \
        index index.html;                               \
        try_files $uri $uri/ /index.html;              \
    }                                                   \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
