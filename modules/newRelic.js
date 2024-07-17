// 添加newrelice性能 监听
module.exports = function() {
  this.nuxt.hook('listen', () => {
    require('newrelic')
  })
}
