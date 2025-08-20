FROM ruby:3.2-slim

# Security: Create non-root user
RUN groupadd -r coderunner && useradd -r -g coderunner coderunner

# Install minimal dependencies
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app
RUN chown coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Copy execution script
COPY --chown=coderunner:coderunner execute.rb /app/

# Set Ruby environment variables
ENV RUBY_YJIT_ENABLE=1

CMD ["ruby", "/app/execute.rb"]