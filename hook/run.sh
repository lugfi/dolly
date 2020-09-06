#!/bin/bash

docker build -f ../Dockerfile.hook . -t hook_listener

docker run -p 3000:3000 -v $(pwd)/..:/app hook_listener
