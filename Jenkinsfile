pipeline {
  agent {
    docker {
      image 'image \'node:7.4\''
    }

  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Deploy to staging') {
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