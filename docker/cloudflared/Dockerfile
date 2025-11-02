FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Tải và cài đặt cloudflared trực tiếp
RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb && \
    dpkg -i /tmp/cloudflared.deb || apt-get install -f -y && \
    rm -f /tmp/cloudflared.deb

# Create directory for config
RUN mkdir -p /etc/cloudflared

# Set working directory
WORKDIR /etc/cloudflared

# Default command
CMD ["cloudflared", "tunnel", "run"]
