# A Dockerfile is a list of steps Docker follows to build an image.
# An image is like a zip file containing Node.js, our code, and the packages.
# A container is a running copy of that image.

# Step 1: start from an image that already has Node.js installed.
# "alpine" is a very small version of Linux, so the image stays small.
FROM node:22-alpine

# Step 2: set the folder inside the container where our code will live.
# Every command after this runs inside /app.
WORKDIR /app

# Step 3: copy only package.json first, then install.
# Docker caches each step. Because the code changes far more often than the
# dependency list, copying package.json separately means "npm install" is
# skipped on rebuilds unless the dependencies actually changed.
COPY package.json ./
RUN npm install

# Step 4: now copy the rest of the source code
COPY . .

# Step 5: tell Docker which port the app uses.
# This is documentation only - it does not actually open the port.
EXPOSE 3000

# Step 6: the command that runs when the container starts
CMD ["node", "server.js"]
