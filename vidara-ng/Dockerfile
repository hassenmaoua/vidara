# Multi-stage build
FROM node:20 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build --configuration=production

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist/vidara-ng/browser /usr/share/nginx/html

# Copy nginx configuration (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
