# Hướng dẫn Setup Cloudflare Tunnel cho AnythingLLM

## Tổng quan
Thay thế ngrok bằng Cloudflare Tunnel để expose AnythingLLM server (cổng 3001) ra Internet một cách an toàn và miễn phí.

## Yêu cầu trước khi bắt đầu
1. Tài khoản Cloudflare (miễn phí)
2. Domain được quản lý bởi Cloudflare
3. Docker và Docker Compose đã cài đặt

## Các bước thực hiện

### Bước 1: Cài đặt cloudflared trên host
```bash
# Từ thư mục docker/cloudflared
sudo dpkg -i ../../cloudflared.deb
```

### Bước 2: Đăng nhập Cloudflare
```bash
cloudflared tunnel login
```
- Lệnh này sẽ mở browser để đăng nhập
- Chọn domain bạn muốn sử dụng

### Bước 3: Tạo tunnel
```bash
cloudflared tunnel create anythingllm-server
```
- Ghi nhớ Tunnel ID được tạo ra

### Bước 4: Tạo DNS record
```bash
# Ví dụ: tạo subdomain api.yourdomain.com
cloudflared tunnel route dns anythingllm-server api.yourdomain.com
```

### Bước 5: Cấu hình tunnel
1. Copy file template config:
```bash
cp config.yml.template config.yml
```

2. Chỉnh sửa `config.yml`:
```yaml
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: /etc/cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: api.yourdomain.com
    service: http://anything-llm:3001
  - service: http_status:404
```

3. Copy file credentials:
```bash
# File credentials thường ở ~/.cloudflared/
mkdir -p credentials
cp ~/.cloudflared/YOUR_TUNNEL_ID.json credentials/
```

### Bước 6: Chạy với Docker Compose
```bash
# Từ thư mục docker/
docker-compose up -d
```

## Kiểm tra
1. Tunnel status: `docker logs cloudflared-anythingllm`
2. Truy cập: `https://api.yourdomain.com`

## So sánh với ngrok

| Tính năng | ngrok | Cloudflare Tunnel |
|-----------|--------|-------------------|
| Giá | Miễn phí có giới hạn | Miễn phí không giới hạn |
| Custom domain | Trả phí | Miễn phí |
| SSL | Tự động | Tự động |
| Tốc độ | Trung bình | Nhanh (CDN) |
| Bảo mật | Cơ bản | Cao (Access policies) |
| Uptime | 8h/session | 24/7 |

## Troubleshooting

### Lỗi thường gặp:
1. **Tunnel không connect**: Kiểm tra credentials file và tunnel ID
2. **502 Bad Gateway**: Kiểm tra service backend (anything-llm:3001)
3. **DNS không resolve**: Đợi vài phút để DNS propagate

### Logs hữu ích:
```bash
# Container logs
docker logs cloudflared-anythingllm

# AnythingLLM logs
docker logs anythingllm
```

## Advanced Configuration

### Thêm Access Policies (bảo mật):
```yaml
ingress:
  - hostname: api.yourdomain.com
    service: http://anything-llm:3001
    originRequest:
      httpHostHeader: api.yourdomain.com
      access:
        required: true
        policies:
          - allow:
              email: ["your-email@domain.com"]
```

### Health checks:
```yaml
ingress:
  - hostname: api.yourdomain.com
    service: http://anything-llm:3001
    originRequest:
      httpHostHeader: api.yourdomain.com
      connectTimeout: 30s
      tlsTimeout: 10s
```