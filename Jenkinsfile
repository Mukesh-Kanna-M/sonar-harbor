pipeline {
    agent any

    environment {
        // Harbor Registry
        HARBOR_URL        = '192.168.31.111'
        HARBOR_PROJECT    = 'library'
        APP_NAME          = 'sonar-harbour'
        IMAGE_NAME        = "${HARBOR_URL}/${HARBOR_PROJECT}/${APP_NAME}"
        IMAGE_TAG         = "${BUILD_NUMBER}"
        IMAGE_VERSIONED   = "${IMAGE_NAME}:${IMAGE_TAG}"
        IMAGE_LATEST      = "${IMAGE_NAME}:latest"

        // SonarQube
        SONAR_PROJECT_KEY = 'sonar-harbour'
        SONAR_HOST_URL    = 'http://192.168.31.111:9000'

        // GitHub
        GITHUB_REPO_URL   = 'https://github.com/Mukesh-Kanna-M/sonar-harbor.git'
        GITHUB_BRANCH     = 'main'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Pulling code from GitHub...'
                git(
                    url: "${GITHUB_REPO_URL}",
                    branch: "${GITHUB_BRANCH}",
                    credentialsId: 'github-cred'
                )
                sh 'git log --oneline -5'
                echo "✅ Checkout done. Workspace: ${WORKSPACE}"
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_TOKEN = credentials('sonarqube-token')
            }
            steps {
                echo '🔍 Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh """
                        npx sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.sources=src \
                          -Dsonar.exclusions='node_modules/**,test/**' \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN}
                    """
                }
                echo '✅ SonarQube analysis done!'
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    echo '🚦 Checking Quality Gate...'
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate abortPipeline: true
                        if (qg.status == 'OK') {
                            echo '✅ Quality Gate PASSED!'
                        } else {
                            error "❌ Quality Gate FAILED: ${qg.status}"
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo "🐳 Building Docker image: ${IMAGE_VERSIONED}"
                    sh """
                        docker build \
                          -t ${IMAGE_VERSIONED} \
                          -t ${IMAGE_LATEST} \
                          --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
                          .
                    """
                    sh "docker images | grep ${APP_NAME}"
                    echo "✅ Docker image built successfully!"
                }
            }
        }

        stage('Image Push') {
            steps {
                script {
                    echo "📤 Pushing image to Harbor: ${HARBOR_URL}"
                    withCredentials([usernamePassword(
                        credentialsId: 'harbor-credentials',
                        usernameVariable: 'HARBOR_USER',
                        passwordVariable: 'HARBOR_PASS'
                    )]) {
                        sh """
                            echo "${HARBOR_PASS}" | docker login \
                              ${HARBOR_URL} \
                              -u ${HARBOR_USER} \
                              --password-stdin
                        """
                        sh "docker push ${IMAGE_VERSIONED}"
                        echo "✅ Pushed: ${IMAGE_VERSIONED}"

                        sh "docker push ${IMAGE_LATEST}"
                        echo "✅ Pushed: ${IMAGE_LATEST}"

                        sh "docker logout ${HARBOR_URL}"
                    }
                    echo "🎉 All images pushed to Harbor!"
                }
            }
        }

    }

    post {
        success {
            echo """
            ✅ PIPELINE SUCCEEDED
            Build  : #${BUILD_NUMBER}
            Image  : ${IMAGE_VERSIONED}
            Branch : ${GITHUB_BRANCH}
            """
        }
        failure {
            echo """
            ❌ PIPELINE FAILED
            Build  : #${BUILD_NUMBER}
            Check the red stage!
            """
        }
        always {
            echo '🧹 Cleaning up...'
            sh "docker rmi ${IMAGE_VERSIONED} || true"
            sh "docker rmi ${IMAGE_LATEST} || true"
            sh "docker image prune -f || true"
            cleanWs()
        }
    }

}
