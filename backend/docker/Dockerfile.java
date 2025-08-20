FROM openjdk:17-jdk-slim

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
COPY --chown=coderunner:coderunner Execute.java /app/

# Set Java security policy
ENV JAVA_OPTS="-Xmx128m -Xms64m -XX:+UseSerialGC"

CMD ["java", "Execute"]