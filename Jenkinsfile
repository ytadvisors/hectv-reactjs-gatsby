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
    stage('S3 sync dynamic content') {
      steps {
        sh 'npm run sync-dynamic:staging'
      }
    }
    stage('S3 sync static content') {
      steps {
        sh 'npm run sync-static:staging'
      }
    }
  }
}