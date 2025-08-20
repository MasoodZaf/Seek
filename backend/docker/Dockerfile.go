FROM golang:1.21-alpine

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
COPY --chown=coderunner:coderunner execute.go /app/

# Set Go environment variables
ENV CGO_ENABLED=0
ENV GOOS=linux

CMD ["go", "run", "/app/execute.go"]