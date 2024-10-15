@Library('global-jenkins-library@2.8.0') _

node('docker') {
    buildInfo = getBuildInfo()
    buildSimpleDocker_v2(
        buildInfo: buildInfo,
        dockerfileDir: './docker',
        buildContext: '.',
        imageprivacy: 'private',
        dockerImageRepositoryName : 'voucher-subgraph'
    )
}
