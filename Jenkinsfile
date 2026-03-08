pipeline {
    agent any

    tools {
        nodejs "Node18"
    }

    stages {

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

    }
}