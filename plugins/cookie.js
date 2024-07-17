import Vue from 'vue'
import { cookieInterceptor } from '@/assets/js/webCookiesMap'
function Cookie() {}
// module.exports = Cookie

/**
 *
 * @param {*} NameOfCookie
 * @param {*} value
 * @param {*} expiredays
 * @param {*} domain
 * @param {*} bol 新增拦截标记，如果存在表示重置删除cookie
 * @returns
 */
Cookie.prototype.setCookie = function(NameOfCookie, value, expiredays, domain, bol) {
  // cookie设置拦截器，当用户拒绝且这个cookie在黑名单中就不能再次设置
  const isIn = cookieInterceptor(Vue.prototype, NameOfCookie)
  if (isIn && !bol) return
  if (expiredays === null || expiredays === undefined || expiredays === '' || isNaN(expiredays)) {
    expiredays = 365
  }
  const ExpireDate = new Date()
  ExpireDate.setTime(ExpireDate.getTime() + expiredays * 24 * 3600 * 1000)
  const _domain = domain ? ';domain=' + domain : ''
  document.cookie =
    NameOfCookie + '=' + escape(value) + _domain + (expiredays == null ? '' : ';path=/; expires=' + ExpireDate.toGMTString())
}

Cookie.prototype.getCookie = function(NameOfCookie) {
  if (document.cookie.length > 0) {
    const cookieArr = document.cookie.split(';')
    const cookieObj = {}
    cookieArr.forEach((cookie) => {
      const tempCookieArr = cookie.trim().split('=')
      cookieObj[tempCookieArr[0]] = tempCookieArr[1] || null
    })
    return (cookieObj[NameOfCookie] && unescape(cookieObj[NameOfCookie])) || null
  }
  return null
}

Cookie.prototype.removeCookie = function(sKey, sDomain) {
  if (!sKey || !this.getCookie(sKey)) {
    return false
  }
  this.setCookie(sKey, '', -1, sDomain)
  return true
}

Vue.prototype.$cookie = new Cookie()
