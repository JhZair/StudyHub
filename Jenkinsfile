pipeline {
  agent any
  triggers { pollSCM('H/2 * * * *') }
  environment { CI = 'true' }
  stages {
    stage('Construccion automatica') {
      steps {
        sh 'npm ci'
        sh 'cd backend && npm ci'
        sh 'npm run lint'
        sh 'npm run build'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
    stage('Analisis estatico (SonarQube)') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'cd backend && npm run coverage'
          sh 'sonar-scanner -Dsonar.host.url=$SONAR_HOST -Dsonar.token=$SONAR_TOKEN'
        }
      }
    }
    stage('Pruebas unitarias (Jest + Vitest)') {
      steps {
        sh 'cd backend && npm test'
        sh 'npx vitest run'
      }
    }
    stage('Pruebas funcionales (Selenium)') { steps { echo 'Pendiente: requiere el entorno Docker levantado' } }
    stage('Pruebas de API (Postman/Newman)') { steps { echo 'Pendiente' } }
    stage('Pruebas de rendimiento (JMeter)') { steps { echo 'Pendiente' } }
    stage('Pruebas de seguridad (OWASP ZAP)') { steps { echo 'Pendiente' } }
    stage('Gestion de issues') { steps { echo 'Commits vinculados a issues con Fix #N en GitHub Projects' } }
    stage('Despliegue (Docker)') {
      steps {
        script {
          if (fileExists('docker-compose.yml')) {
            sh 'docker compose up -d --build'
          } else {
            echo 'Pendiente: docker-compose.yml aun no existe'
          }
        }
      }
    }
  }
}
