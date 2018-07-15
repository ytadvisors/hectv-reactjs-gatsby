pipeline {
  agent {
    docker {
      image 'node:6-alpine'
      args '-p 3000:3000'
    }
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Deploy') {
      steps {
        sh 'npm deploy:staging'
      }
    }
    stage('Clean Up') {
      steps {
        echo 'Build Completed'
      }
    }
  }
  environment {
    ACTIVE_ENV = 'staging'
  }
}