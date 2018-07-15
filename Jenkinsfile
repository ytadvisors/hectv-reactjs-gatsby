pipeline {
  agent {
    node {
      label 'build_machine_node'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build:staging 2>&1'
      }
    }
    stage('Deploy') {
      steps {
        sh 'npm run deploy:staging'
      }
    }
  }
}