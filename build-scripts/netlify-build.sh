#!/bin/bash
set -e

# Install Rush
npm install --global @microsoft/rush

# Bootstrap project
rush install

# Build it
node build-scripts build
