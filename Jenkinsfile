pipeline {
    agent any

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
                    /var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar-scanner/bin/sonar-scanner \
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

On Mon, 18 May, 2026, 5:31 pm Mukesh Kanna M, <mukeshkannamv@gmail.com> wrote:
sonar.projectKey=sonar-harbor
sonar.projectName=sonar-harbor
sonar.sources=.
sonar.sourceEncoding=UTF-8

On Mon, 18 May, 2026, 5:28 pm Mukesh Kanna M, <mukeshkannamv@gmail.com> wrote:
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
