pipeline {
  agent {
    docker {
      image 'node:6.3'
    }
  }
  stages {
    stage('Install') {
      steps {
        sh 'console.log("Start Installation")'
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
  environment {
    ACTIVE_ENV = 'staging'
  }
}