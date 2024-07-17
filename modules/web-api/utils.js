const request = require('request')

/**
 * 处理返回体
 *  跨域
 *  返回数据
 * @param {*} context
 * @param {*} data
 * @param {*} origin
 */
const sendDataToClient = (context, data, origin) => {
  // // 打开后 当前域名无法访问
  // if (!origin) {
  //   context.res.end()
  //   return
  // }
  if (
    origin &&
    (origin.includes('http://localhost') || ((origin.includes('azazie.com') || origin.includes('gaoyaya.com')) && origin.includes('lego')))
  ) {
    context.res.setHeader('Access-Control-Allow-Origin', origin)
  }
  // context.res.setHeader('Access-Control-Allow-Origin', 'localhost:3002')
  context.res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  context.res.setHeader('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type')
  context.res.setHeader('Content-Type', 'application/json;charset=utf-8')
  context.res.setHeader('Access-Control-Allow-Credentials', true)
  context.res.setHeader('Access-Control-Max-Age', 300)
  // context.res.setHeader('Access-Control-Expose-Headers', 'x-app')
  const allowHeaders = context.res.getHeader('access-control-request-headers')
  if (allowHeaders) {
    context.res.setHeader('Access-Control-Allow-Headers', allowHeaders)
  }
  clearWebOptions(context)
  context.res.write(JSON.stringify(data))
  context.res.end()
}

const clearWebOptions = (context) => {
  if (context.webApiOptions) {
    context.webApiOptions.apiStore = null
    context.webApiOptions.redisCache = null
    context.webApiOptions.axCache = null
  }
  context.webApiOptions = null
}

/**
 * 通用错误返回
 * @param {*} context
 * @param {*} origin
 * @returns
 */
const sendCommonErrorToClient = (context, origin) => {
  return sendDataToClient(
    context,
    {
      msg: 'someting error'
    },
    origin
  )
}

/**
 * 请求
 * @param {*} options
 * @param {*} storeKey
 * @param {*} date
 * @returns
 */
const requestWebApi = (options, storeKey, date) => {
  // console.log('执行请求', storeKey)
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      try {
        if (error) {
          reject(error)
        }
        // console.log(res)
        resolve(JSON.parse(body))
        // const data = JSON.parse(body)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = {
  sendDataToClient,
  clearWebOptions,
  sendCommonErrorToClient,
  requestWebApi
}
