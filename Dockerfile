FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Start the application (assuming preview command serves the built app)
CMD ["npm", "run", "preview"]