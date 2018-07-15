pipeline {
    agent { docker { image 'node:6.3' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'npm install'
                sh 'npm run deploy:staging'
            }
        }
        stage('Clean Up') {
            steps {
                echo 'Completed'
            }
        }
    }
}