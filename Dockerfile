# Use official Node.js LTS runtime as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
# PORT is injected by the deployment platform (Render, Cloud Run, etc.)

# Run as non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start the application
CMD ["node", "server.js"]
