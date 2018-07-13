pipeline {
  agent any
  stages {
    stage('Build & Deploy') {
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