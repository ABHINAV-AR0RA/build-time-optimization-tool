pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Parallel Build and Test') {

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