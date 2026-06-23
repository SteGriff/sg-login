FROM node:24-slim AS base

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Build in a throwaway, to reduce size of final image
FROM base AS build

# Install node modules
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

# Copy application code
COPY . ./

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
VOLUME /app/.data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "start" ]
