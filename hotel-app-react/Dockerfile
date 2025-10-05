# Use Node.js base image
FROM node:20.16.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application with increased memory allocation
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Expose the necessary port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
