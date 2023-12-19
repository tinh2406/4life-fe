FROM --platform=amd64 nginx:latest

# Sao chép tài nguyên từ thư mục cục bộ vào container
COPY ./dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf