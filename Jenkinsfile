pipeline {
  agent any
  stages {
    stage('Build & Deploy') {
      steps {
        sh 'yarn deploy:staging'
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