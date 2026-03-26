FROM openjdk:17-jdk-slim

# Security: Create non-root user
RUN groupadd -r coderunner && useradd -r -g coderunner coderunner

# Install minimal dependencies
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy and compile the execution runner (as root so javac can write .class)
COPY Execute.java /app/
RUN cd /app && javac Execute.java && chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

ENV JAVA_OPTS="-Xmx128m -Xms64m -XX:+UseSerialGC"

CMD ["java", "-cp", "/app", "Execute"]
