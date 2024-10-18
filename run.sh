#!/bin/bash

export DOCKER_BUILDKIT=1

command=$1

shift 2

case "$command" in
    
    "docker-build:dev")
        docker-compose -f docker-compose.dev.yaml build
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
        pnpm --filter server run start
    ;;
    
    *)
        echo "No valid option was chosen. Please select a valid choice from start, build, end"
    ;;
esac