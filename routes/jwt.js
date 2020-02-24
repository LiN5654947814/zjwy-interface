const expressJwt = require('express-jwt')
const secret = 'ZjWy'

const jwtAuth = expressJwt({
  secret: secret,
  credentialsRequired: true
}).unless({
  path: ['/login']
})

module.exports = jwtAuth
