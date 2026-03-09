# Build Time Optimization Tool using Jenkins CI

## Project Overview
This project demonstrates how build times in a Continuous Integration (CI) pipeline can be optimized using Jenkins.

The project compares a baseline sequential pipeline with an optimized pipeline where independent tasks run in parallel, reducing overall build time.

The pipeline builds and tests a sample Node.js application located in the `sample-app` folder.

---

## Tools & Technologies

- Jenkins
- GitHub
- Node.js
- npm
- Visual Studio Code

---

## Project Structure
build-time-optimization-tool
│
├ Jenkinsfile
├ README.md
│
├ sample-app
│ ├ index.js
│ └ package.json
│
├ results
│ ├ baseline.png
│ ├ baseline-stageview.png
│ ├ baseline-timing.png
│ ├ optimized.png
│ ├ optimized-stageview.png
│ ├ optimized-timing.png
│
├ slides
│ └ presentation.pptx
│
└ demo
└ demo-video.mp4

---

## CI Pipeline Workflow

The Jenkins pipeline performs the following tasks:

1. Checkout source code from GitHub
2. Install required tools (Node.js)
3. Run build stage
4. Run test stage

Two versions of the pipeline were implemented:

### Baseline Pipeline (Sequential)

Build and Test stages run one after another.

```
Build → Test
```

Total execution time ≈ **28 seconds**

---

### Optimized Pipeline (Parallel)

Build and Test stages run simultaneously using Jenkins parallel stages.

```
Build
   ↘
    Parallel Execution
   ↗
Test
```

Total execution time ≈ **19 seconds**

---

## Results

| Pipeline Version | Execution Type | Time |
|---|---|---|
Baseline Pipeline | Sequential | 28 sec |
Optimized Pipeline | Parallel | 19 sec |

### Improvement

```
Build time reduced by ~32%
```

---

## How to Run the Project

1. Install Jenkins
2. Clone the repository

```
git clone https://github.com/ABHINAV-AR0RA/build-time-optimization-tool.git
```

3. Create a new Pipeline Job in Jenkins
4. Connect the repository
5. Run the pipeline

---

## Key Learning Outcomes

- Understanding CI/CD pipelines
- Implementing Jenkins pipelines
- Sequential vs Parallel execution
- Performance optimization in build systems

---

## Author

Abhinav Arora  
DevOps Project – Build Time Optimization Tool
