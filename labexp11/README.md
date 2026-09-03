# Experiment 11 (Value Added)

## Objective

Dockerize the Node.js + MongoDB app:

- Write a Dockerfile
- Build and run the Docker image locally

## Technologies Used

- Docker Desktop
- Docker Compose
- Node.js, Express, MongoDB (the same REST API as labexp9)

## Folder Structure

```
labexp11/
├── Dockerfile             <- steps to build the app image
├── .dockerignore          <- files not to copy into the image
├── docker-compose.yml     <- runs the app + MongoDB together
├── package.json
├── server.js
├── models/
│   └── Student.js
├── routes/
│   └── studentRoutes.js
└── README.md
```

## Step 0 — Install Docker

Download **Docker Desktop for Mac** from https://www.docker.com/products/docker-desktop
and install it. Pick the **Apple Silicon** version for M1/M2/M3 Macs or the
**Intel** version for older Macs.

Open Docker Desktop and wait for the whale icon in the menu bar to stop
animating. Docker only works while Docker Desktop is running.

Check it works:

```
docker --version
```

```
docker compose version
```

## Method 1 — Docker Compose (recommended)

This starts the app **and** MongoDB together with one command.

Build and start:

```
docker compose up --build
```

Stop it (in the same terminal):

Press **Ctrl + C**

Stop and remove the containers:

```
docker compose down
```

Stop and also delete the database data:

```
docker compose down -v
```

## Method 2 — Docker build and run by hand

This shows what compose is doing for us. MongoDB has to be started separately.

Build the image (the `.` at the end means "use the Dockerfile in this folder"):

```
docker build -t student-api .
```

See the image you just built:

```
docker images
```

Create a network so the two containers can talk to each other:

```
docker network create student-net
```

Start MongoDB:

```
docker run -d --name mongo-db --network student-net mongo:7
```

Start the app:

```
docker run -d --name student-api -p 3000:3000 --network student-net -e MONGO_URL=mongodb://mongo-db:27017/studentDB student-api
```

Check both containers are running:

```
docker ps
```

## How to Test the Output

The app runs inside a container, but port 3000 is mapped to your Mac, so you
test it exactly like a normal local server.

Open **http://localhost:3000** in the browser:

```json
{
  "message": "Student REST API running inside Docker",
  "database": "mongodb://mongo:27017/studentDB"
}
```

Add a student:

```
curl -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"name":"Sahil","age":21,"course":"CSE"}'
```

```json
{ "_id": "65c9f1a2b3c4d5e6f7a8b9c0", "name": "Sahil", "age": 21, "course": "CSE", "__v": 0 }
```

Get all students:

```
curl http://localhost:3000/students
```

**Test that the data survives a restart.** This proves the volume works:

```
docker compose restart
```

```
curl http://localhost:3000/students
```

Sahil is still there. Now delete the volume and the data is gone:

```
docker compose down -v
```

```
docker compose up
```

```
curl http://localhost:3000/students
```

Returns `[]`.

## Expected Output

**`docker compose up --build`** ends with something like:

```
 => [app 5/5] COPY . .
 => exporting to image
[+] Running 3/3
 ✔ Network labexp11_default   Created
 ✔ Container mongo-db         Created
 ✔ Container student-api      Created
Attaching to mongo-db, student-api
mongo-db     | {"t":{"$date":"..."},"s":"I","c":"NETWORK","msg":"Waiting for connections","attr":{"port":27017}}
student-api  | Connected to MongoDB at mongodb://mongo:27017/studentDB
student-api  | Server running on port 3000
```

**`docker ps`:**

```
CONTAINER ID   IMAGE            COMMAND                  STATUS         PORTS                      NAMES
a1b2c3d4e5f6   labexp11-app     "node server.js"         Up 2 minutes   0.0.0.0:3000->3000/tcp     student-api
f6e5d4c3b2a1   mongo:7          "docker-entrypoint.s…"   Up 2 minutes   0.0.0.0:27017->27017/tcp   mongo-db
```

## Useful Docker commands

| Command | What it does |
|---------|--------------|
| `docker images` | List images you have built or downloaded |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers, including stopped ones |
| `docker logs student-api` | Show that container's terminal output |
| `docker logs -f student-api` | Follow the logs live |
| `docker exec -it student-api sh` | Open a shell inside the container |
| `docker stop student-api` | Stop a container |
| `docker rm student-api` | Delete a stopped container |
| `docker rmi student-api` | Delete an image |
| `docker compose logs app` | Logs of just the app service |

To look inside the database from your Mac:

```
docker exec -it mongo-db mongosh studentDB
```

Then type `db.students.find()`.

## Important points

- **Image vs container** — an image is the built package (like a class), a
  container is a running copy of it (like an object). One image can run as many
  containers.
- **Why `127.0.0.1` does not work inside Docker.** This is the mistake almost
  everyone makes first. Inside a container `127.0.0.1` means *that container*,
  so the app looks for MongoDB inside itself and gets `ECONNREFUSED`. In compose
  we use `mongodb://mongo:27017` because Docker turns each service name into a
  hostname.
- **`app.listen(port, "0.0.0.0")`** — by default the app would only accept
  connections from inside its own container, so `localhost:3000` on your Mac
  would not reach it. `0.0.0.0` means "accept from anywhere".
- **`-p 3000:3000`** — the left number is the port on your Mac, the right is the
  port inside the container. `-p 8080:3000` would let you open
  `localhost:8080` instead.
- **Why COPY package.json comes before COPY . .** — Docker caches each step. If
  the code is copied first, then any tiny code edit invalidates the cache and
  `npm install` runs again on every build. Copying `package.json` first means
  the install step is reused unless the dependencies actually changed.
- **`.dockerignore`** — keeps `node_modules` out of the image. This matters more
  than it looks: packages installed on macOS can contain Mac-specific binaries
  that do not run on the Linux inside the container.
- **Volumes** — containers forget everything when deleted. `mongo-data:/data/db`
  stores the database files outside the container so the data survives.
- **`depends_on`** — makes Docker start mongo before app. It waits for the
  container to start, not for MongoDB to be fully ready, which is why
  `server.js` still handles a failed connection.
- **`alpine`** — a tiny Linux base. `node:22-alpine` is around 130 MB against
  around 1 GB for the full `node:22`.

## Troubleshooting

**`Cannot connect to the Docker daemon`** — Docker Desktop is not running. Open
it and wait for the whale icon to settle.

**`port is already allocated`** — something else is on port 3000. Find it:

```
lsof -i :3000
```

Either stop that process, or change the mapping to `"3001:3000"` in
`docker-compose.yml`.

**App container keeps restarting** — read the logs:

```
docker compose logs app
```

## Conclusion

The app and the database both run in containers, so the whole project starts
with one command on any computer that has Docker. Nobody needs to install
Node.js or MongoDB by hand, which removes the "it works on my laptop" problem.
