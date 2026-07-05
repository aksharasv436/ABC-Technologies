def sendMetric(metric, value) {
    def timestamp = (System.currentTimeMillis() / 1000) as long

    bat """
powershell -Command ^
"$client = New-Object System.Net.Sockets.TcpClient('host.docker.internal',2003); ^
\$stream = \$client.GetStream(); ^
\$writer = New-Object System.IO.StreamWriter(\$stream); ^
\$writer.WriteLine('${metric} ${value} ${timestamp}'); ^
\$writer.Flush(); ^
\$writer.Close(); ^
\$client.Close();"
"""
}

pipeline {
    agent any

    environment {
        KUBECONFIG = 'C:\\ProgramData\\Jenkins\\.kubeconfig'
        IMAGE_NAME = "abc-technologies:v1"
    }

    stages {

        stage('Checkout Source') {
            steps {
                script {
                    sendMetric("pipeline.checkout", 1)
                }
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sendMetric("docker.builds", 1)
                }

                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sendMetric("kubernetes.deployments", 1)
                }

                bat 'kubectl apply -f k8s\\deployment.yaml'
                bat 'kubectl apply -f k8s\\service.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }

    post {

        success {
            script {
                sendMetric("jenkins.build.success", 1)
                sendMetric("jenkins.build.total", 1)
            }

            echo 'Deployment Successful!'
        }

        failure {
            script {
                sendMetric("jenkins.build.failure", 1)
                sendMetric("jenkins.build.total", 1)
            }

            echo 'Deployment Failed!'
        }
    }
}