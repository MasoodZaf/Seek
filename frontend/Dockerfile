# Multi-stage build for optimized frontend deployment
# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Fix react-scripts ajv bug caused by missing root workspace lockfile
RUN npm install ajv@^6.12.6 ajv-keywords@^3.5.2 --legacy-peer-deps

# Copy source code
COPY . .

# Build the application (PUBLIC_URL=/ ensures relative asset paths regardless of env files)
RUN PUBLIC_URL=/ npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
