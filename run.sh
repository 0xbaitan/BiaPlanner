#!/bin/bash

export DOCKER_BUILDKIT=1

command=$1

shift 2

case "$command" in
    
    "docker-build:base")
        docker build -f Dockerfile.base -t biaplanner/base:1.0.0 . --target base
    ;;
    
    "docker-build:builder")
        docker build -f Dockerfile.base -t biaplanner/builder:1.0.0 . --target builder
    ;;
    
    "docker-build:app")
        docker build -f ./packages/app/Dockerfile -t biaplanner/app:1.0.0 . --target app
    ;;
    # "install")
    #     npm install
    # ;;
    
    # "install:rosid")
    #     npm install "$@"
    # ;;
    
    # "install:app")
    #     npm install "$@" --workspace="app"
    # ;;
    
    # "install:server")
    #     npm install "$@" --workspace="server"
    # ;;
    
    # "install:shared")
    #     npm install "$@" --workspace="shared"
    # ;;
    
    # "start")
    #     docker-compose up
    # ;;
    
    # "lint-format")
    #     ./run.sh format
    #     ./run.sh lint
    # ;;
    
    # "lint")
    #     npm --prefix ./app run lint
    #     npm --prefix ./server run lint
    #     npm --prefix ./shared run lint
    # ;;
    
    # "format")
    #     npm --prefix ./app run format
    #     npm --prefix ./server run format
    #     npm --prefix ./shared run format
    # ;;
    
    # "build:shared")
    #     npm --prefix ./shared run build
    #     docker build -t rosid/shared:1.0 ./shared
    # ;;
    
    # "build:dependencies")
    #     docker build -f ./Dockerfile.base -t rosid/dependencies:1.0 .
    # ;;
    
    # "build:rosid")
    #     docker-compose build
    # ;;
    
    # "build:all")
    #     # ./run.sh build:shared
    #     ./run.sh build:dependencies
    #     ./run.sh build:rosid
    # ;;
    
    # "end")
    #     docker-compose down
    # ;;
    
    *)
        echo "No valid option was chosen. Please select a valid choice from start, build, end"
    ;;
esac