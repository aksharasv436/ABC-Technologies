pipeline {
    agent any

    environment {
        KUBECONFIG = 'C:\\ProgramData\\Jenkins\\.kubeconfig'
        IMAGE_NAME = 'abc-technologies:v1'
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
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
        echo 'Deployment Successful!'

        powershell '''
$client = New-Object System.Net.Sockets.TcpClient("host.docker.internal",2003)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)
$timestamp=[int][double]::Parse((Get-Date -UFormat %s))
$writer.WriteLine("jenkins.build.success 1 $timestamp")
$writer.Flush()
$writer.Close()
$client.Close()
'''
    }

    failure {
        echo 'Deployment Failed!'

        powershell '''
$client = New-Object System.Net.Sockets.TcpClient("host.docker.internal",2003)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)
$timestamp=[int][double]::Parse((Get-Date -UFormat %s))
$writer.WriteLine("jenkins.build.failure 1 $timestamp")
$writer.Flush()
$writer.Close()
$client.Close()
'''
    }
}
stage('Test Failure') {
    steps {
        error 'Intentional failure for testing'
    }
}
}