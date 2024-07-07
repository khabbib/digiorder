#!/bin/bash

mkdir -p secret_key
NEW_SECRET_KEY=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
echo "$NEW_SECRET_KEY" > secret_key/jwt_secret_key.txt
echo "New JWT Secret Key generated and saved to secret_key/jwt_secret_key.txt"