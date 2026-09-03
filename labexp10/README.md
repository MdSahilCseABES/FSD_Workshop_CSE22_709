# Experiment 10

## Objective

Push the MongoDB + Express project to GitHub. Make sure:

- A proper `README.md` is included
- A `.gitignore` is included
- The folder structure is clean

The project being pushed is the REST API from **labexp9**.

## Technologies Used

- Git
- GitHub
- macOS Terminal

## Files in this folder

| File | What it is |
|------|-----------|
| gitignore-sample.txt | The `.gitignore` content, with a comment on each line |
| git_commands.sh | All the git commands from this experiment, for revision |

`gitignore-sample.txt` is kept with a `.txt` name on purpose. If it were named
`.gitignore` it would become a real ignore file and start hiding files in this
folder instead of just being an example to read.

## Step 1 — Check the folder structure is clean

A clean project has each type of file in its own place and no junk:

```
labexp9/
├── package.json          <- lists the dependencies
├── server.js             <- starts the app
├── models/
│   └── Student.js        <- the data shape
├── routes/
│   └── studentRoutes.js  <- the API routes
├── .gitignore            <- what git should ignore
└── README.md             <- how to run the project
```

What makes it clean:

- No `node_modules/` folder pushed
- No `.env` file pushed
- No leftover files like `test2.js`, `copy of server.js`, `Untitled.js`
- Related files grouped in folders (`models/`, `routes/`)
- A README so anyone can run the project

## Step 2 — Create the .gitignore

Do this **before** the first `git add`. If `node_modules` gets committed once,
removing it later takes extra commands.

Create the file inside the project folder:

```
touch .gitignore
```

Open it in VS Code and paste the contents of `gitignore-sample.txt`. The two
lines that matter most:

```
node_modules/
.env
```

Check that it is actually working:

```
git status
```

`node_modules` must **not** appear in the list. You can confirm it directly:

```
git check-ignore -v node_modules
```

If it prints a line pointing at `.gitignore`, the file is being ignored
correctly. If it prints nothing, the `.gitignore` is not working.

## Step 3 — Write the README.md

Every project README should answer: what is it, what is needed, how do I run it,
and what do I see. See `labexp9/README.md` for the full example.

## Step 4 — Create the repository on GitHub

1. Go to https://github.com and log in
2. Click the **+** in the top right, then **New repository**
3. Repository name: **FSD_Workshop_CSE22_709**
4. Keep it **Public** (or Private if your teacher allows it)
5. **Do not** tick "Add a README file" or "Add .gitignore" — we already made
   ours, and ticking them creates an extra commit on GitHub that makes the
   first push fail with a "rejected" error
6. Click **Create repository**

## Step 5 — Push from the terminal

Run these from the repository folder:

```
git init -b main
```

```
git add .
```

```
git commit -m "Added labexp10"
```

```
git remote add origin https://github.com/<your-username>/FSD_Workshop_CSE22_709.git
```

```
git push origin main
```

Replace `<your-username>` with your real GitHub username.

## Step 6 — For every experiment after this

The repository already exists now, so only three commands are needed:

```
git add .
```

```
git commit -m "Added labexp11"
```

```
git push origin main
```

## Expected Output

**git status** before committing:

```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   .gitignore
	new file:   README.md
	new file:   labexp9/models/Student.js
	new file:   labexp9/package.json
	new file:   labexp9/routes/studentRoutes.js
	new file:   labexp9/server.js
```

Notice `node_modules` is not in the list.

**git commit:**

```
[main (root-commit) a1b2c3d] Added labexp10
 6 files changed, 240 insertions(+)
```

**git push:**

```
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Writing objects: 100% (12/12), 3.21 KiB | 3.21 MiB/s, done.
To https://github.com/<your-username>/FSD_Workshop_CSE22_709.git
 * [new branch]      main -> main
```

## How to Test the Output

Refresh the repository page on GitHub. You should see:

- All the `labexp` folders
- The README displayed automatically below the file list
- **No** `node_modules` folder anywhere
- Your commit message next to each file

Also check the commit history by clicking **commits** at the top of the file
list. Each experiment should be its own commit.

## Common problems and fixes

**Asked for a password and it failed**

GitHub stopped accepting account passwords in the terminal. Use a Personal
Access Token instead: GitHub → Settings → Developer settings → Personal access
tokens → Tokens (classic) → Generate new token → tick **repo** → copy the token
and paste it as the password. Or log in once with the GitHub CLI:

```
gh auth login
```

**`error: remote origin already exists`**

The remote is already set. Check where it points and fix it if wrong:

```
git remote -v
```

```
git remote set-url origin https://github.com/<your-username>/FSD_Workshop_CSE22_709.git
```

**`Updates were rejected because the remote contains work you do not have`**

This happens when you ticked "Add a README" while creating the repo. Pull the
GitHub commit first, then push:

```
git pull origin main --allow-unrelated-histories
```

```
git push origin main
```

**`node_modules` got committed by mistake**

Remove it from git while keeping it on your computer:

```
git rm -r --cached node_modules
```

```
git commit -m "Removed node_modules from git"
```

```
git push origin main
```

**Committed a `.env` file with the database password**

Removing it in a new commit is not enough — it stays in the history. Change the
password on MongoDB Atlas, then add `.env` to `.gitignore` and remove it with
`git rm --cached .env`.

## Important points

- **`git add .`** stages the changes, it does not save them. **`git commit`**
  is what actually saves them. **`git push`** is what sends them to GitHub.
- **`origin`** is just a nickname for the GitHub URL, so you do not have to
  type the full address every time.
- **`main`** is the branch name. Older tutorials say `master`; GitHub renamed
  the default to `main`.
- **Commit messages matter.** "Added labexp10" tells you what changed. "update"
  or "asdf" tells you nothing when you look back later.
- **Why `node_modules` is ignored** — it can hold thousands of files and be
  hundreds of MB. `package.json` already lists every dependency, so `npm
  install` rebuilds the folder exactly. Pushing it wastes space and makes the
  repository slow to clone.
- **Why `.env` is ignored** — it holds passwords and connection strings. A
  public repository means anyone in the world can read them.

## Conclusion

The project is now on GitHub with a proper README, a working `.gitignore`, and
a clean folder structure. Every later experiment is added with the same three
commands: `git add .`, `git commit -m "Added labexpX"`, `git push origin main`.
