/*
  自定义   dev  (备注：在nuxt.config.js 中，手动改，需要重启项目)
  测试1~9  dev-1 ~ dev-9
  p1~4     dev-p1 ~ dev-p6
  线上     dev-x   (这里使用dev-x而不使用dev-prod 是因为：避免网站其他地方处理environment的时候使用includes('prod')来判断是否是生产环境从而导致一些问题)
*/
export const devServers = {
  env: `dev-x`
}
