# Use the official Node.js 20 LTS Alpine image for a smaller footprint
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Set environment to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only production dependencies)
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
