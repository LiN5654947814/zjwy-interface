const expressJwt = require('express-jwt')
const secret = 'ZjWy'
// 验证
const jwtAuth = expressJwt({
  secret: secret,
  credentialsRequired: true
}).unless({
  // 登录页无需验证
  path: ['/login']
})

module.exports = jwtAuth
