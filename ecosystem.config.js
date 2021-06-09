'use strict';

module.exports = {
    apps: [
        {
            name: "wafy", // pm2로 실행한 프로세스 목록에서 이 애플리케이션의 이름으로 지정될 문자열
            script: "./dist", // pm2로 실행될 파일 경로
            watch: true, // 파일이 변경되면 자동으로 재실행 (true || false)
            node_args:["-r module-alias/register", "--env=production"],
            env: {
                "env": "development" // 개발환경시 적용될 설정 지정
            },
            env_production: {
                "env": "production", // 배포환경시 적용될 설정 지정,
                "NODE_ENV": "production",


            }
        }
    ]
}
