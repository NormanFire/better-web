module.exports = {
  title: 'Better Cloud',
  // Spring Boot Admin控制台地址
  springBootAdminUrl: 'http://localhost:8401',
  // Swagger UI 地址
  swaggerUrl: 'http://localhost:8301/upms/swagger-ui.html',
  // zipkin 控制台地址
  zipkinUrl: 'http://localhost:8402',
  // kibana 控制台地址
  kibanaUrl: 'http://192.168.33.10:5601',
  // 获取令牌时，请求头信息(Basic Base64.encode(client_id:client_secret))
  authorizationValue: 'Basic YmV0dGVyOjEyMzQ1Ng==',
  // 社交登录后台地址
  socialLoginUrl: 'http://apicloud.febs.cc:8301/auth/social/login'
}
