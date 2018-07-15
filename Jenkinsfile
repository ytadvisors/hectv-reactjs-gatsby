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
        sh 'npm run deploy:staging'
      }
    }
  }
}