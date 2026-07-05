def sendMetric(metric, value) {
    powershell """
\$client = New-Object System.Net.Sockets.TcpClient("host.docker.internal",2003)
\$stream = \$client.GetStream()
\$writer = New-Object System.IO.StreamWriter(\$stream)
\$timestamp=[int][double]::Parse((Get-Date -UFormat %s))
\$writer.WriteLine("${metric} ${value} \$timestamp")
\$writer.Flush()
\$writer.Close()
\$client.Close()
"""
}

pipeline {
    agent any

    environment {
        KUBECONFIG = 'C:\\ProgramData\\Jenkins\\.kubeconfig'
        IMAGE_NAME = 'abc-technologies:v1'
    }

    stages {

        stage('Checkout Source') {
            steps {
                script {
                    sendMetric("pipeline.checkout",1)
                }

                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {

                script {
                    sendMetric("docker.builds",1)
                }

                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {

                script {
                    sendMetric("kubernetes.deployments",1)
                }

                bat 'kubectl apply -f k8s\\deployment.yaml'
                bat 'kubectl apply -f k8s\\service.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {

                bat 'kubectl get pods'
                bat 'kubectl get services'

                script {
                    sendMetric("kubernetes.verification",1)
                }
            }
        }

    }

    post {

        success {

            script {
                sendMetric("jenkins.build.success",1)
                sendMetric("jenkins.build.total",1)
            }

            echo 'Deployment Successful!'
        }

        failure {

            script {
                sendMetric("jenkins.build.failure",1)
                sendMetric("jenkins.build.total",1)
            }

            echo 'Deployment Failed!'
        }
    }
}