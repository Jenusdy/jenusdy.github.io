# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Gatsby site
RUN npm run build

# Expose port 9000 (Gatsby serve default)
EXPOSE 9000

# Start the application
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "9000"]
