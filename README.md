## Build Time Optimization Tool (Jenkins CI)

This project demonstrates **build time optimization** in a Jenkins CI pipeline by comparing:

- **Baseline pipeline**: sequential `Build → Test`
- **Optimized pipeline**: `Build` and `Test` run in **parallel**

It also includes a small **web UI + Node.js backend** that can trigger your Jenkins pipeline and show live build status.

---

## Project structure

```
build-time-optimization-tool/
├─ Jenkinsfile
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  └─ .env              (you create this locally)
├─ frontend/
│  ├─ index.html
│  └─ style.css
├─ sample-app/
│  ├─ index.js
│  └─ package.json
└─ results/             (screenshots + console output)
```

---

## How it works (high level)

### Jenkins pipeline

The `Jenkinsfile` prepares a project in one of three ways:

- **Default** (recommended to start): builds the repo’s `sample-app` folder.
- **GitHub repo**: if `REPO_URL` is provided, Jenkins clones that repository.
- **Uploaded project**: if `LOCAL_PATH` is provided, Jenkins copies it into the workspace (Windows `xcopy`).

Then it installs dependencies and runs build/test (optimized version uses parallel stages).

### Web UI + backend

- `frontend/index.html` calls the backend on port `3000`.
- `backend/server.js` triggers Jenkins using:
  - Jenkins crumb (`/crumbIssuer/api/json`)
  - Job trigger endpoint (`/job/<JOB_NAME>/buildWithParameters`)
  - Basic auth (`JENKINS_USER` + `JENKINS_TOKEN`)

---

## Prerequisites

- **Jenkins** (running locally or remotely)
- **Node.js + npm** (for `backend/` and to build the `sample-app`)
- Jenkins should have:
  - **NodeJS tool** configured (e.g. “Node18”), OR Node installed on the agent
  - Pipeline support (standard Jenkins Pipeline setup)

> Note: The current `Jenkinsfile` uses Windows `bat` commands. Run Jenkins on a **Windows agent** or update the pipeline steps for Linux/macOS.

---

## Jenkins setup (one-time)

### 1) Create the Jenkins job

1. In Jenkins: **New Item → Pipeline**
2. Job name example: `build-time-optimization`
3. Choose **Pipeline script from SCM**
4. SCM: **Git**
5. Repository URL: your GitHub repo URL (this repo)
6. Script Path: `Jenkinsfile`
7. Save

### 2) Confirm parameters exist (optional but recommended)

This project’s `Jenkinsfile` expects parameters:

- `REPO_URL` (string)
- `LOCAL_PATH` (string)

If they are not present in your job UI, Jenkins will still run, but adding them makes it easier to test “Build with Parameters”.

---

## Backend setup (required for the web button)

### 1) Create `backend/.env`

Create a file named `backend/.env` (this file is not committed). Example:

```env
JENKINS_URL=http://localhost:8080
JOB_NAME=build-time-optimization
JENKINS_USER=your-jenkins-username
JENKINS_TOKEN=your-jenkins-api-token
```

### 2) Generate your Jenkins API token

In Jenkins:

- Click your user (top-right) → **Configure**
- Under **API Token**, generate a token
- Put it into `backend/.env` as `JENKINS_TOKEN`

**Important**: If you change your Jenkins username or token, update `backend/.env` accordingly or the build trigger will fail.

### 3) Install and run backend

From the repo root:

```bash
cd backend
npm install
npm start
```

Backend runs at `http://localhost:3000`.

---

## Frontend setup (web UI)

Open `frontend/index.html` in a browser (double-click is fine).

Use one of these:

- **Default**: leave both fields empty → builds `sample-app`
- **GitHub URL**: paste a repo URL → triggers build with `REPO_URL`
- **Upload ZIP**: select a ZIP → triggers build with `LOCAL_PATH` (see note below)

> Upload note: the backend stores uploads locally under `backend/uploads/` and passes the absolute path to Jenkins as `LOCAL_PATH`. This only works if Jenkins can access that path (same machine / shared path).

---

## Troubleshooting

### Button click does nothing

- Ensure `frontend/index.html` is refreshed (hard refresh) and DevTools console is open.
- Ensure backend is running and reachable at `http://localhost:3000`.

### Backend returns 400 / build not triggered

- Verify `backend/.env` values:
  - `JENKINS_URL` is correct
  - `JOB_NAME` matches the exact Jenkins job name
  - `JENKINS_USER` is correct
  - `JENKINS_TOKEN` is a valid **API token** (not your account password)

### Jenkins runs but can’t find `sample-app`

- Ensure the Jenkins job is configured to check out this repository (Pipeline script from SCM).

---

## Results (baseline vs optimized)

| Pipeline version | Execution | Time |
|---|---|---|
| Baseline | Sequential | ~28 sec |
| Optimized | Parallel | ~19 sec |

---

## Author

Abhinav Arora  
DevOps Project – Build Time Optimization Tool

