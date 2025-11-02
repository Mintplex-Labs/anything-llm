#!/bin/bash

# Script tự động setup Cloudflare Tunnel cho AnythingLLM
# Sử dụng: ./auto-setup.sh <tunnel-name> <domain>

set -e

TUNNEL_NAME=${1:-"anythingllm-server"}
DOMAIN=${2:-""}

if [ -z "$DOMAIN" ]; then
    echo "Cách sử dụng: $0 <tunnel-name> <domain>"
    echo "Ví dụ: $0 anythingllm-server api.yourdomain.com"
    exit 1
fi

echo "=== Tự động setup Cloudflare Tunnel ==="
echo "Tunnel name: $TUNNEL_NAME"
echo "Domain: $DOMAIN"
echo

# Bước 1: Cài đặt cloudflared
echo "1. Cài đặt cloudflared..."
if ! command -v cloudflared &> /dev/null; then
    sudo dpkg -i ../../cloudflared.deb || sudo apt-get install -f -y
fi

# Bước 2: Đăng nhập (cần thực hiện thủ công)
echo "2. Vui lòng đăng nhập Cloudflare (sẽ mở browser):"
echo "Nhấn Enter để tiếp tục..."
read
cloudflared tunnel login

# Bước 3: Tạo tunnel
echo "3. Tạo tunnel..."
cloudflared tunnel create $TUNNEL_NAME

# Lấy tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')
if [ -z "$TUNNEL_ID" ]; then
    echo "Lỗi: Không thể lấy tunnel ID"
    exit 1
fi

echo "Tunnel ID: $TUNNEL_ID"

# Bước 4: Tạo DNS record
echo "4. Tạo DNS record..."
cloudflared tunnel route dns $TUNNEL_NAME $DOMAIN

# Bước 5: Tạo config file
echo "5. Tạo config file..."
cat > config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $DOMAIN
    service: http://anything-llm:3001
    originRequest:
      httpHostHeader: $DOMAIN
  - service: http_status:404

loglevel: info
retries: 3
EOF

# Bước 6: Copy credentials
echo "6. Copy credentials..."
mkdir -p credentials
cp ~/.cloudflared/$TUNNEL_ID.json credentials/

# Bước 7: Cập nhật quyền
chmod 600 credentials/$TUNNEL_ID.json
chmod 644 config.yml

echo
echo "=== Setup hoàn tất ==="
echo "Tunnel Name: $TUNNEL_NAME"
echo "Tunnel ID: $TUNNEL_ID"
echo "Domain: $DOMAIN"
echo "Config file: config.yml"
echo
echo "Để khởi động:"
echo "1. cd ../  # Về thư mục docker"
echo "2. docker-compose up -d"
echo "3. Kiểm tra: curl https://$DOMAIN"