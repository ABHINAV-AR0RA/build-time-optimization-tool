pipeline {
    agent any

    tools {
        nodejs "Node18"
    }

    stages {

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