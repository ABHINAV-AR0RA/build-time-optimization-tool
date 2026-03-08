pipeline {
    agent any

    stages {

        stage('Build and Test Parallel') {

            parallel {

                stage('Build') {
                    steps {
                        sh 'npm run build'
                    }
                }

                stage('Test') {
                    steps {
                        sh 'npm test'
                    }
                }

            }

        }

    }
}