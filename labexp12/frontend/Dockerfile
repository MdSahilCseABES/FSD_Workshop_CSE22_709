# The frontend Dockerfile has two stages.
#
# Stage 1 runs "npm run build", which turns the React code into plain
# HTML, CSS and JS files. Stage 2 copies only those built files into a
# tiny nginx web server. The final image does not contain Node.js,
# React, or node_modules at all, so it is much smaller.

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# The backend address has to be given at build time, because Vite
# replaces import.meta.env values while building, not while running.
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:alpine

# Copy the built files from stage 1 into the nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
