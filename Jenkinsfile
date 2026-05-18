pipeline {
    agent any

    tools {
        sonarQube 'sonar-scanner'
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                credentialsId: 'github-cred',
                url: 'https://github.com/Mukesh-Kanna-M/sonar-harbor.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('SonarQube') {

                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=sonar-harbor \
                    -Dsonar.projectName=sonar-harbor \
                    -Dsonar.sources=. \
                    -Dsonar.sourceEncoding=UTF-8
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t sonar-harbor .'
            }
        }
    }
}
