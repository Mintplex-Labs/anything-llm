#!/bin/bash

# Script to install Node.js and Yarn on Ubuntu

set -e

echo "====================================="
echo "Node.js & Yarn Installation Script"
echo "====================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

# Update package list
echo "Updating package list..."
apt-get update

# Install prerequisites
echo "Installing prerequisites..."
apt-get install -y curl

# Define Node.js version (LTS)
NODE_MAJOR=20

# Add NodeSource repository and install Node.js
echo "Adding NodeSource repository for Node.js ${NODE_MAJOR}.x..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -

echo "Installing Node.js..."
apt-get install -y nodejs

# Install Yarn via npm
echo "Installing Yarn via npm..."
npm install -g yarn

# Verify installation
echo ""
echo "====================================="
echo "Installation complete!"
echo "====================================="
node --version
npm --version
yarn --version

echo ""
echo "Node.js, npm, and Yarn have been successfully installed."
