#!/bin/bash

export DOCKER_BUILDKIT=1

command=$1

shift 2

case "$command" in
    
    "build:dev")
        docker-compose -f docker-compose.dev.yaml build
    ;;
    
    "build:prod")
        docker-compose -f docker-compose.yaml build
    ;;
    
    "start:dev")
        docker-compose -f docker-compose.dev.yaml up
    ;;
    
    "start:prod")
        docker-compose -f docker-compose.yaml up
    ;;
    
    "end:dev")
        docker-compose -f docker-compose.dev.yaml down
    ;;
    
    "end:prod")
        docker-compose -f docker-compose.yaml down
    ;;
    
    *)
        echo "No valid option was chosen. Please select a valid choice from start, build, end"
    ;;
esac