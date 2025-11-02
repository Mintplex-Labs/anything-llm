#!/bin/bash

# Cloudflare Tunnel Setup Script cho AnythingLLM
# Chạy script này để setup tunnel cho cổng 3001

echo "=== Cloudflare Tunnel Setup cho AnythingLLM ==="

# Kiểm tra cloudflared đã được cài đặt chưa
if ! command -v cloudflared &> /dev/null; then
    echo "Đang cài đặt cloudflared..."
    sudo dpkg -i ../cloudflared.deb || sudo apt-get install -f -y
fi

echo "1. Đăng nhập Cloudflare (sẽ mở browser):"
cloudflared tunnel login

echo "2. Tạo tunnel mới:"
read -p "Nhập tên tunnel (ví dụ: anythingllm-server): " TUNNEL_NAME
cloudflared tunnel create $TUNNEL_NAME

echo "3. Tạo file config tunnel..."
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')

cat > config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /root/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: your-domain.com
    service: http://anything-llm:3001
  - service: http_status:404
EOF

echo "4. Tạo DNS record:"
read -p "Nhập subdomain (ví dụ: api): " SUBDOMAIN
read -p "Nhập domain (ví dụ: yourdomain.com): " DOMAIN
cloudflared tunnel route dns $TUNNEL_NAME $SUBDOMAIN.$DOMAIN

echo "=== Setup hoàn tất ==="
echo "Tunnel ID: $TUNNEL_ID"
echo "Config file: config.yml"
echo "Cập nhật docker-compose.yml để sử dụng tunnel này."