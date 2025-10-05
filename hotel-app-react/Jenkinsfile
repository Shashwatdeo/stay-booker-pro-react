pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repository...'
                // Clone the repository using the scm (source code management)
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    bat 'docker build -t hotel-booking-app:latest .'
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    // Run Docker container
                    bat 'docker run -d -p 3000:3000 hotel-booking-app:latest'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat '''
                        echo %DOCKER_PASS% | docker login --username %DOCKER_USER% --password-stdin
                        docker tag hotel-booking-app:latest %DOCKER_USER%/hotel-booking-app:latest
                        docker push %DOCKER_USER%/hotel-booking-app:latest
                    '''
                }
            }
        }

        stage('Done') {
            steps {
                echo 'Build and Run complete!'
            }
        }
    }
}
