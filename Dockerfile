# Stage 1: Build the React app
FROM node:18-alpine as builder
WORKDIR /app

# Add an argument for the API key and create the .env file
ARG VITE_GOOGLE_MAPS_API_KEY
RUN echo "VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}" > .env

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the static files with a web server
FROM nginx:stable-alpine
RUN apk update && apk add gettext
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY start-nginx.sh /
RUN chmod +x /start-nginx.sh
EXPOSE 8080
CMD ["/start-nginx.sh"]
