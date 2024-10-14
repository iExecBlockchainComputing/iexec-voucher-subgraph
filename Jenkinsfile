node('docker') {

def DOCKER_IMAGE_NAME
def DOCKER_IMAGE
    
    
    stage('Clean Workspace'){
        cleanWs()
    }

    stage('Checkout scm') {
        checkout scm
    }

    stage('Build image') {

        // Get the last commit hash 
        SHORT_COMMIT_HASH = sh(
            script: 'git rev-parse --short HEAD',
            returnStdout: true
        ).trim()
        TIMESTAMP = sh(
            script: 'date "+%s"',
            returnStdout: true
        ).trim()
        DOCKER_IMAGE_NAME = "iexechub/iexec-voucher-subgraph:${SHORT_COMMIT_HASH}"

        DOCKER_IMAGE = docker.build(DOCKER_IMAGE_NAME, " \
            -f docker/Dockerfile \
            . \
        ")
    }

    stage("Push image to Dockerhub") {
        docker.withRegistry('', 'dockerio') {
            DOCKER_IMAGE.push()
        }
        sh "docker image rm ${DOCKER_IMAGE_NAME}"
    }
}
