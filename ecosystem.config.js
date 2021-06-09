'use strict';

module.exports = {
    apps: [
        {
            name: "wafy", // pm2로 실행한 프로세스 목록에서 이 애플리케이션의 이름으로 지정될 문자열
            script: "/home/ubuntu/wafy-server/dist/index.js", // pm2로 실행될 파일 경로
            watch: true, // 파일이 변경되면 자동으로 재실행 (true || false)
            env: {
                "env": "development" // 개발환경시 적용될 설정 지정
            },
            env_production: {
                "env": "production", // 배포환경시 적용될 설정 지정,
                "NODE_ENV": "production",


                "PORT": 8081,
                "HOST": "localhost",


                "JET_LOGGER_MODE": "FILE",
                "JET_LOGGER_FILEPATH": "jet-logger.log",
                "JET_LOGGER_TIMESTAMP": "TRUE",
                "JET_LOGGER_FORMAT": "LINE",

                "COOKIE_DOMAIN": "localhost",
                "COOKIE_PATH": "/",
                "SECURE_COOKIE": "false",
                "JWT_SECRET": "xxxxxxxxxxxxxx",
                "COOKIE_SECRET": "xxxxxxxxxxxxxx",
                "COOKIE_EXP": 259200000,


                "HOST_EMAIL": "wo7864@gmail.com",
                "HOST_EMAIL_PW": "3kat59!@",

            }
        }
    ]
}
