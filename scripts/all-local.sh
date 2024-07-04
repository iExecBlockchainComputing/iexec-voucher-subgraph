#!/bin/sh
cd "$(dirname "$0")" || exit
npm run clean
npm run codegen
npm run build
docker-compose up -d
sleep 10
npm run create
npm run deploy
