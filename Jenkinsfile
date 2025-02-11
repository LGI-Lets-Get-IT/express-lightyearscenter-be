pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                git branch: 'development', credentialsId: 'jenkins', url: 'https://github.com/LGI-Lets-Get-IT/natapos-be-express'
            }
        }
        stage('Install node dependencies') {
            steps {
                sh 'npm install'
            }
        }

    }

    post {
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed. Check logs.'
        }
    }
}