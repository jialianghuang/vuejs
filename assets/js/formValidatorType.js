// 表单验证
export default {
  email(lange) {
    return [
      { type: 'string', required: true, message: lange.required },
      {
        validator: (rule, value, options) => {
          if (/^\w[\w.+-]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(value)) {
            // 第一步校验通过正则校验（和上一版的区别在于@后面的从\w修改为了a-zA-Z0-9,因为_是不被允许的） 不过正则直接return false
            const splitArray = value.split('@')
            const localPart = splitArray[0]
            const domain = splitArray[1]
            return !(
              (
                value.includes('..') || // 排除整个邮箱里的..
                localPart.charAt(localPart.length - 1) == '.' || // 排除Local-part以.结束 ，以.开头在正则里过滤掉
                domain.charAt(domain.length - 1) == '.' || // 排除domain以.结束 以.开头也在正则里过滤
                domain.charAt(domain.length - 1) == '-' || // 排除domain以-结束
                domain.charAt(0) == '-'
              ) // 排除domain以-开头
            )
          } else {
            return false
          }
        },
        message: lange.validator
      }
    ]
  },
  password(lange) {
    return [{ type: 'string', required: true, message: lange.required }]
  },
  name(lange) {
    return [{ type: 'string', required: true, message: lange.required }]
  },
  questTitle(lange) {
    return [{ type: 'string', required: true, message: lange.required }]
  },
  questComment(lange) {
    return [{ type: 'string', required: true, message: lange.required }]
  },
  genCode(lange) {
    return [{ type: 'string', required: true, message: lange.required }]
  },
  // address
  first_name(lange) {
    return [
      { type: 'string', required: true, message: lange.required },
      { min: 2, message: lange.min }
    ]
  },
  orderSn(lange) {
    return [
      { type: 'string', required: true, message: lange.required },
      {
        validator: (rule, value, options) => {
          return /^(ZZ)/.test(value.trim()) && value.trim().length >= 3
        },
        message: lange.validator
      }
    ]
  },
  sameData(lange) {
    return [
      {
        type: 'array',
        validator: (rule, value, options) => {
          if (!value || !value.length || value.length < 2) return false
          return value[1] === value[0]
        },
        message: lange.validator
      }
    ]
  }
}
