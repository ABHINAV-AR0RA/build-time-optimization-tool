const express = require("express")
const axios = require("axios")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

// Accept uploaded ZIPs (used by /build/upload)
const upload = multer({ dest: "uploads/" })

// Jenkins connection details from .env
const JENKINS_URL = process.env.JENKINS_URL
const JENKINS_USER = process.env.JENKINS_USER
const JENKINS_TOKEN = process.env.JENKINS_TOKEN
const JOB_NAME = process.env.JOB_NAME

// Common helper to trigger the Jenkins job
async function triggerJenkinsBuild({ repoUrl, localPath } = {}) {
  // STEP 1: Get Jenkins crumb
  const crumb = await axios.get(
    `${JENKINS_URL}/crumbIssuer/api/json`,
    {
      auth: {
        username: JENKINS_USER,
        password: JENKINS_TOKEN,
      },
    }
  )

  // STEP 2: Trigger build via the Jenkins API-friendly endpoint
  // POST/GET  /job/<JOB_NAME>/buildWithParameters?REPO_URL=...&LOCAL_PATH=...
  const triggerUrl = `${JENKINS_URL}/job/${JOB_NAME}/buildWithParameters`
  const params = {}
  if (repoUrl) params.REPO_URL = repoUrl
  if (localPath) params.LOCAL_PATH = localPath

  console.log("Triggering Jenkins job:", { url: triggerUrl, params })

  const resp = await axios.post(
    triggerUrl,
    null,
    {
      auth: {
        username: JENKINS_USER,
        password: JENKINS_TOKEN,
      },
      headers: {
        [crumb.data.crumbRequestField]: crumb.data.crumb,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params,
      maxRedirects: 0, // Jenkins often responds with 201/302; we only care that it accepted
      validateStatus: status => status >= 200 && status < 400,
    }
  )

  console.log("Jenkins trigger response:", {
    status: resp.status,
    location: resp.headers?.location,
  })
}

// Default: no repo URL and no file selected → use sample-app in Jenkinsfile
app.post("/build/default", async (req, res) => {
  try {
    await triggerJenkinsBuild()
    res.json({ message: "Build triggered successfully (default/sample-app)" })
  } catch (err) {
    console.error("Jenkins build error (/build/default):", err.response?.data || err.message)
    res.status(400).send("Build failed")
  }
})

// Repo URL provided → still trigger same Jenkins job; Jenkinsfile decides how to use REPO_URL
app.post("/build/github", async (req, res) => {
  try {
    const { repo } = req.body || {}
    console.log("Received GitHub repo for build:", repo)

    await triggerJenkinsBuild({ repoUrl: repo })
    res.json({ message: "GitHub build triggered successfully" })
  } catch (err) {
    console.error("Jenkins build error (/build/github):", err.response?.data || err.message)
    res.status(400).send("GitHub build failed")
  }
})

// ZIP uploaded → accept the file and pass its absolute path to Jenkins as LOCAL_PATH
app.post("/build/upload", upload.single("project"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded")
    }

    const absolutePath = path.resolve(__dirname, "..", req.file.path)
    console.log("Received uploaded project file:", req.file.originalname, "at", absolutePath)

    await triggerJenkinsBuild({ localPath: absolutePath })
    res.json({ message: "Upload build triggered successfully" })
  } catch (err) {
    console.error("Jenkins build error (/build/upload):", err.response?.data || err.message)
    res.status(400).send("Upload build failed")
  }
})

// Poll last build status from Jenkins
app.get("/status", async (req, res) => {
  try {
    const response = await axios.get(
      `${JENKINS_URL}/job/${JOB_NAME}/lastBuild/api/json`,
      {
        auth: {
          username: JENKINS_USER,
          password: JENKINS_TOKEN,
        },
      }
    )

    res.json({
      status: response.data.result,
      building: response.data.building,
      duration: response.data.duration,
    })
  } catch (err) {
    console.error("Status error:", err.response?.data || err.message)
    res.status(400).send("Status error")
  }
})

app.listen(3000, () => {
  console.log("Backend running on port 3000")
})