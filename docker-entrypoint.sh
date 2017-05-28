#!/bin/bash

set -e

cd app

case "$1" in
    bash)
        bash
    ;;
    build)
        npm install && npm run build
    ;;
    *)
        npm install && npm run start
    ;;
esac
