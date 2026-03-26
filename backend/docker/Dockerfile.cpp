FROM gcc:latest

# Security: Create non-root user
RUN groupadd -r coderunner && useradd -r -g coderunner coderunner

# Install python3 (used by the execution wrapper) and boost libraries
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    python3 \
    libboost-all-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app
RUN chown coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Copy execution wrapper
COPY --chown=coderunner:coderunner execute.cpp /app/

CMD ["python3", "/app/execute.cpp"]
