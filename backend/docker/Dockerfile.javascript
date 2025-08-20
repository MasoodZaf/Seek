FROM node:20-alpine

# Security: Create non-root user
RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

# Install minimal dependencies
RUN apk add --no-cache ca-certificates

# Set up working directory
WORKDIR /app
RUN chown coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Copy execution script
COPY --chown=coderunner:coderunner execute.js /app/

# Set Node.js environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=64"

CMD ["node", "/app/execute.js"]