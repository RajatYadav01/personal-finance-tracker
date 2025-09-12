# Stage 1: Use the official Node.js LTS image
FROM node:23.11.0-alpine3.21 AS build

# Set working directory
WORKDIR /app/personal-finance-tracker-frontend

# Accept build arg and expose to Vite
ARG VITE_BACKEND_API_URL
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY .env* ./
COPY index.html ./
COPY src ./src
COPY public ./public
COPY eslint.config.js ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY vitest.config.ts ./
COPY vitest.setup.ts ./

# Build the app for production
RUN npm run build

# Stage 2: Serve the app using a web server like Nginx
FROM nginx:alpine

# Copy the build output to Nginx's public folder
COPY --from=build /app/personal-finance-tracker-frontend/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]