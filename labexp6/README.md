# Experiment 6

## Objective

Create a simple Express.js server that:

- Serves an HTML file using the `fs` module
- Has routes `/`, `/about` and `/contact`
- Each route serves a **separate** HTML file

## Technologies Used

- Node.js
- Express.js
- Built-in `fs` and `path` modules
- HTML and a little CSS

## Folder Structure

```
labexp6/
├── package.json
├── server.js
├── public/
│   ├── home.html
│   ├── about.html
│   ├── contact.html
│   └── 404.html
└── README.md
```

## Routes

| Route | File sent | Status |
|-------|-----------|--------|
| `/` | public/home.html | 200 |
| `/about` | public/about.html | 200 |
| `/contact` | public/contact.html | 200 |
| anything else | public/404.html | 404 |

## How to Run

Install Express first (needs internet, only once):

```
npm install
```

Then start the server:

```
npm start
```

Terminal shows:

```
Server running at http://localhost:3000
```

## How to Test the Output

Open **http://localhost:3000** in the browser. You will see the Home page with
three links at the top. Click **About** and **Contact** — each one loads a
different HTML file, and the URL in the address bar changes.

Then type a wrong route like **http://localhost:3000/xyz** and the 404 page
appears.

To check the status codes from the terminal:

```
curl -o /dev/null -w "/        %{http_code}\n" http://localhost:3000/
curl -o /dev/null -w "/about   %{http_code}\n" http://localhost:3000/about
curl -o /dev/null -w "/contact %{http_code}\n" http://localhost:3000/contact
curl -o /dev/null -w "/xyz     %{http_code}\n" http://localhost:3000/xyz
```

Expected:

```
/        200
/about   200
/contact 200
/xyz     404
```

## Expected Output

- **`/`** — a white card with the heading **Home Page**, the nav links, and a
  line saying the page was read using the fs module.
- **`/about`** — heading **About Page** with the name, roll number and branch
  in a list.
- **`/contact`** — heading **Contact Page** with a small table of college
  details.
- **`/xyz`** — heading **404 - Page Not Found** with a link back to home.

## Important points

- **`app.get(route, callback)`** — Express matches the method and the URL for
  us. Compare this with experiment 5, where we had to check `request.method`
  and split the URL by hand.
- **`__dirname`** — the folder that `server.js` lives in. Without it, `fs`
  looks for the file relative to wherever you ran the `node` command, which
  breaks if you start the server from a different folder.
- **`path.join(__dirname, "public", fileName)`** — joins the parts with the
  correct separator. Safer than writing `__dirname + "/public/" + fileName`.
- **One helper function** — `sendHtmlFile()` is written once and reused by all
  four routes, instead of repeating the same `fs.readFile` block four times.
- **`app.use()` at the bottom** — Express checks routes from top to bottom, so a
  `app.use()` placed last catches everything that did not match. That is why it
  works as the 404 handler. If it were placed at the top, every page would show
  404.
- **Status 404, not 200** — the 404 page is still a real HTML page, but the
  status code must say the route was not found. Sending 200 here would tell the
  browser everything was fine.
- Express also has a shorter method `res.sendFile(filePath)` that does the read
  for us. This experiment uses `fs` because the question asks for it.

## Conclusion

Express makes routing much shorter and cleaner than the plain `http` module.
Combined with `fs`, each route can read its own HTML file from the disk and
send it to the browser as a separate page.
