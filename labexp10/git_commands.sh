# All the git commands used in this experiment, kept in one place
# for revision. Do not run this file directly - run the commands
# one by one so you can read the output of each step.

# ---------- ONE TIME SETUP ----------

# Tell git who you are (only needed once per computer)
git config --global user.name "MD Sahil"
git config --global user.email "md.25b01010870@abes.ac.in"

# ---------- STARTING A NEW REPOSITORY ----------

# Turn the current folder into a git repository
git init -b main

# Check which files git can see
git status

# ---------- THE NORMAL WORKFLOW ----------

# Stage all changed files
git add .

# Save the staged files as a commit with a message
git commit -m "Added labexp10"

# Connect the local folder to the GitHub repository (only once)
git remote add origin https://github.com/<your-username>/FSD_Workshop_CSE22_709.git

# Send the commits to GitHub
git push origin main

# ---------- USEFUL CHECKING COMMANDS ----------

# See the list of commits
git log --oneline

# See which remote is connected
git remote -v

# Confirm node_modules is being ignored
git check-ignore -v node_modules

# See what changed since the last commit
git diff
