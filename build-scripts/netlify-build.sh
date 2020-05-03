#!/bin/bash
set -e

# Install Yarn
curl -o- -L https://yarnpkg.com/install.sh | bash

# Install Lerna
npm i -g lerna

# Make Yarn available
export PATH=~/.yarn/bin:"$PATH"

# Bootstrap project
lerna bootstrap
lerna run prepare

# Build it
node build-scripts build
