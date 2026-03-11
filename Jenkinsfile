pipeline {

    agent any

    parameters {

        string(name: 'REPO_URL', defaultValue: '', description: 'GitHub repository URL')

        string(name: 'LOCAL_PATH', defaultValue: '', description: 'Uploaded project path')

    }

    stages {

        stage('Prepare Project') {

            steps {

                script {

                    if (params.REPO_URL?.trim()) {

                        echo "Cloning GitHub repository"

                        git params.REPO_URL

                    }

                    else if (params.LOCAL_PATH?.trim()) {

                        echo "Using uploaded project"

                        dir('project') {

                            bat "xcopy /E /I ${params.LOCAL_PATH} ."

                        }

                    }

                    else {

                        echo "Using default sample-app"

                        dir('sample-app') {

                            bat 'echo Sample app selected'

                        }

                    }

                }

            }

        }


        stage('Install Dependencies') {

            steps {

                dir('sample-app') {

                    bat '''

                    if not exist node_modules (

                        npm install

                    ) else (

                        echo Using cached dependencies

                    )

                    '''

                }

            }

        }


        stage('Build & Test Parallel') {

            parallel {

                stage('Build') {

                    steps {

                        dir('sample-app') {

                            bat 'npm run build'

                        }

                    }

                }

                stage('Test') {

                    steps {

                        dir('sample-app') {

                            bat 'npm test'

                        }

                    }

                }

            }

        }

    }

}