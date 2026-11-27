# Git Bash Commands — Room Booking Application

Replace `YOUR_USERNAME` with your GitHub username. First create an **empty** GitHub repository named `Room-Booking-Application` (do not add a README or .gitignore on GitHub).

## 1. Open Git Bash in the extracted project folder
```bash
cd /c/Users/YOUR_NAME/Downloads/Room-Booking-Application
```

## 2. Initialize Git and push main
```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: Room Booking Application"
git remote add origin https://github.com/YOUR_USERNAME/Room-Booking-Application.git
git push -u origin main
```

## 3. Create and push develop
```bash
git switch -c develop
git push -u origin develop
```

## 4. Create feature branch and add a feature commit
```bash
git switch -c feature/room-booking
```
Make a small feature change in `script.js` (for example, change a room description), save it, then:
```bash
git add script.js
git commit -m "Add room booking feature"
git push -u origin feature/room-booking
```

## 5. Merge feature into develop
```bash
git switch develop
git merge --no-ff feature/room-booking -m "Merge room booking feature"
git push origin develop
```

## 6. Create a deliberate merge conflict in README.md

First edit `README.md` while on `develop`. Add or replace the final line with:
`Project status: maintained on the develop branch.`
Then commit:
```bash
git add README.md
git commit -m "Update project status on develop"
```

Now create a second branch from the current develop state:
```bash
git switch -c feature/readme-update
```
Edit the **same line** in `README.md` to:
`Project status: feature branch documentation update.`
Then commit:
```bash
git add README.md
git commit -m "Update project status on feature branch"
```

## 7. Merge the second branch and resolve the conflict
```bash
git switch develop
git merge feature/readme-update
```
Git should report a conflict in `README.md`. Open the file in VS Code or a text editor. It will contain conflict markers similar to:
```text
<<<<<<< HEAD
Project status: maintained on the develop branch.
=======
Project status: feature branch documentation update.
>>>>>>> feature/readme-update
```
Resolve it by replacing the entire conflict block with one final line, for example:
`Project status: room booking feature integrated; merge conflict resolved.`
Save the file, then finish the merge:
```bash
git add README.md
git commit -m "Resolve README merge conflict"
git push origin develop
```

## 8. Merge develop into main
```bash
git switch main
git pull origin main
git merge --no-ff develop -m "Merge develop into main"
git push origin main
```

## 9. Verify branches, commits, and merge graph
```bash
git branch
git branch -a
git status
git log --oneline --graph --decorate --all
git remote -v
```

Expected local branches:
- `main`
- `develop`
- `feature/room-booking`
- `feature/readme-update`

Expected final status: `working tree clean`.

## Useful recovery commands
```bash
# If a merge is in progress and you want to cancel it:
git merge --abort

# See which files have conflicts:
git status

# Push all local branches (optional):
git push --all origin
```

## Important
- Do not run `git merge` while you are still on the feature branch when the target is `develop`; switch to `develop` first.
- The conflict is intentional and is resolved by editing the conflict markers out of README.md.
- `feature/readme-update` is an extra branch created only to demonstrate the conflict. You can keep it on GitHub as evidence of the workflow.
