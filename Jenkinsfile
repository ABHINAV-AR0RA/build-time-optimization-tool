pipeline {
    agent any

    tools {
        nodejs "Node18"
    }

    stages {

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