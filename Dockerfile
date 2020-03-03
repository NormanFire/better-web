FROM nginx:1.14.2
MAINTAINER lius 1213380440@qq.com

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /etc/nginx/html
