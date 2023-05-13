#!/bin/bash

docker compose down

rm -rf dist
npm run build
docker build -t afworkspace:1.0 .
