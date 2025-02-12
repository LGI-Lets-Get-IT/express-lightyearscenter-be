def previousSuccessBuild = currentBuild.previousSuccessfulBuild.id as Integer

pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        DOCKERHUB_REPO = 'mrizalrizky/lumecoffee-backend-jenkins'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
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
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKERHUB_REPO}:${BUILD_NUMBER} -f Dockerfile ."
                }
            }
        }
        stage('Publish Docker Image to DockerHub') {
            steps {
                script {
                    sh "echo Previous Build Number: $previousSuccessBuild"
                    sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"

                    sh "docker push ${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                }
            }
        }
        stage('Run Container') {
            steps {
                script {
                    sh "docker container rm -f lumecoffee_pos_jenkins-dev || true" 
                    sh "docker run -d --name lumecoffee_pos_jenkins-dev -p 3345:3345 ${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                    
                }
            }
        }
    }

    post {
        success {
            sh "docker image rm ${DOCKERHUB_REPO}:$previousSuccessBuild || true"
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed. Check logs.'
        }
    }
}