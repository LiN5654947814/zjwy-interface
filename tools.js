class Tools {
  constructor() {
    console.log('调用了验证')
  }
  // 手机号验证
  phoneTest(str) {
    // 手机号正则表达式
    let phoneTest = /^[1][3,4,5,7,8][0-9]{9}$/
    if (phoneTest.test(str)) {
      return true
    } else {
      return false
    }
  }
  // 身份证号验证
  cardTest(str) {
    // 身份证正则验证
    let cardTest = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/
    if (cardTest.test(str)) {
      return true
    } else {
      return false
    }
  }
  // 邮箱验证
  emailTest(str) {
    let emailTest = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (emailTest.test(str)) {
      return true
    } else {
      return false
    }
  }
  // 密码验证
  passwordTest(str) {
    let passwordTest = /^[^\s]{6}$/
    if (passwordTest.test(str)) {
      return true
    } else {
      return false
    }
  }
}

module.exports = Tools
