const express = require("express")
const axios = require("axios")
const multer = require("multer")
const unzipper = require("unzipper")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({ dest: "uploads/" })

const JENKINS_URL = "http://localhost:8080"
const JOB = "build-time-optimization"

const USER = "admin"
const TOKEN = "TOKEN"


// DEFAULT BUILD (sample-app)

app.post("/build/default", async (req, res) => {

  await axios.post(
    `${JENKINS_URL}/job/${JOB}/build`,
    {},
    { auth: { username: USER, password: TOKEN } }
  )

  res.json({ message: "Default sample-app build started" })

})


// GITHUB BUILD

app.post("/build/github", async (req, res) => {

  const repo = req.body.repo

  await axios.post(
    `${JENKINS_URL}/job/${JOB}/buildWithParameters`,
    {},
    {
      params: { REPO_URL: repo },
      auth: { username: USER, password: TOKEN }
    }
  )

  res.json({ message: "GitHub build triggered" })

})


// ZIP PROJECT BUILD

app.post("/build/upload", upload.single("project"), async (req, res) => {

  const zip = req.file.path
  const extractPath = path.join(__dirname, "uploads", req.file.filename)

  fs.createReadStream(zip)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on("close", async () => {

      await axios.post(
        `${JENKINS_URL}/job/${JOB}/buildWithParameters`,
        {},
        {
          params: { LOCAL_PATH: extractPath },
          auth: { username: USER, password: TOKEN }
        }
      )

      res.json({ message: "Uploaded project build triggered" })

    })

})


// BUILD STATUS

app.get("/status", async (req, res) => {

  const response = await axios.get(
    `${JENKINS_URL}/job/${JOB}/lastBuild/api/json`,
    { auth: { username: USER, password: TOKEN } }
  )

  res.json({
    status: response.data.result,
    building: response.data.building,
    duration: response.data.duration
  })

})


app.listen(3000, () =>
  console.log("Backend running on port 3000")
)