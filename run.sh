#!/bin/bash

export DOCKER_BUILDKIT=1

command=$1



case "$command" in
    
    "bundle:generate")
        pnpm --filter server generate module features/$2
        pnpm --filter server generate service features/$2
        pnpm --filter server generate controller features/$2
    ;;
    
    "migration:generate")
        shift 1
        source .env.dev
        pnpm --filter server run migration:generate $@
    ;;
    
    "clean:all")
        rm -rf node_modules pnpm-lock.yaml packages/app/node_modules packages/server/node_modules packages/shared/node_modules packages/app/build packages/server/dist packages/shared/build
    ;;
    
    "install")
        pnpm recursive install
    ;;
    
    "docker-build:dev")
        docker-compose -f docker-compose.dev.yaml build
    ;;
    
    "docker-build-no-cache:dev")
        docker-compose -f docker-compose.dev.yaml build --no-cache
    ;;
    
    "docker-build:prod")
        docker-compose -f docker-compose.yaml build
    ;;
    
    "build:shared")
        pnpm --filter shared run build
    ;;
    
    "build-watch:shared")
        pnpm --filter shared run build:watch
    ;;
    
    "docker-start:dev")
        nohup ./run.sh build-watch:shared > /dev/null 2>&1 &
        docker-compose -f docker-compose.dev.yaml up
    ;;
    
    "docker-start:prod")
        docker-compose -f docker-compose.yaml up
    ;;
    
    "docker-end:dev")
        docker-compose -f docker-compose.dev.yaml down
    ;;
    
    "docker-end:prod")
        docker-compose -f docker-compose.yaml down
    ;;
    
    "start-service:app")
        nohup ./run.sh build-watch:shared > /dev/null 2>&1 &
        pnpm --filter app run start
    ;;
    
    "start-service:server")
        nohup ./run.sh build-watch:shared > /dev/null 2>&1 &
        pnpm --filter server run start:dev
    ;;
    
    *)
        echo "No valid option was chosen. Please select a valid choice from start, build, end"
    ;;
esac