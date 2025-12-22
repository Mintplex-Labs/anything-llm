#!/bin/bash

# Script to install Node.js on Ubuntu
# This installs the LTS version using NodeSource repository

set -e  # Exit on any error

echo "====================================="
echo "Node.js Installation Script for Ubuntu"
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

# Download and run NodeSource setup script
echo "Adding NodeSource repository for Node.js ${NODE_MAJOR}.x..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -

# Install Node.js
echo "Installing Node.js..."
apt-get install -y nodejs

# Verify installation
echo ""
echo "====================================="
echo "Installation complete!"
echo "====================================="
node --version
npm --version

echo ""
echo "Node.js and npm have been successfully installed."
