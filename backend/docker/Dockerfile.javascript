FROM node:20-alpine

# Security: Create non-root user
RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

# Install system dependencies
RUN apk add --no-cache ca-certificates

# Install popular npm packages globally so user code can require() them
RUN npm install -g --silent \
    lodash \
    axios \
    moment \
    dayjs \
    uuid \
    chalk \
    express \
    dotenv \
    ramda \
    underscore \
    rxjs \
    zod \
    yup \
    date-fns \
    mathjs

# Set up working directory
WORKDIR /app
RUN chown coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Copy execution script
COPY --chown=coderunner:coderunner execute.js /app/

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=128"
ENV NODE_PATH="/usr/local/lib/node_modules"

CMD ["node", "/app/execute.js"]
