const baseAb = new Array(32).fill(0).join('')

/**
 * 获取用户ab数据
 * @param {*} versionGroup
 * @param {*} abtest
 * @returns
 */
const getVersionInfo = (versionGroup, abtest = baseAb) => {
  const versionInfo = {}
  for (const key in versionGroup) {
    const versionList = versionGroup[key].list && versionGroup[key].list.length ? versionGroup[key].list : [{ version: 'A', flowRate: 1 }]
    const abIndex = versionGroup[key].randomNumber && versionGroup[key].randomNumber.length ? versionGroup[key].randomNumber : [31]
    const module = []
    versionList.map((element) => {
      module.push(element.flowRate)
    })
    const configs = {
      module, // 模块比例
      abIndex // 使用abtest的index值
    }
    const index = getVersion(abtest, configs)
    versionInfo[key] = index && versionList[index] ? versionList[index].version : versionList[0].version
  }

  return versionInfo
}

const getVersion = (abtest, configs) => {
  if (configs.module.length <= 1) {
    return 0
  }
  // 获取使用的abtest值
  const hex = configs.abIndex.map((abIndex) => abtest[abIndex]).join('')
  // 获取模块比例进制
  const radix = configs.module.reduce((count, item) => count + item, 0)
  // 获取最后一位 => 转化为10进制
  const num = parseInt(hex, 16) % radix
  let count = -1
  for (let i = 0; i < configs.module.length; i++) {
    count += configs.module[i]
    if (count >= num) {
      // 获取对应模块index
      return i
    }
  }
}

/**
 * 判断version配置是否变更
 * @param {*} v1
 * @param {*} v2
 * @param {*} ab
 * @returns
 */
const configHasChange = (v1, v2) => {
  const data1 = geiVersionList(v1)
  const data2 = geiVersionList(v2)
  if (JSON.stringify(data1) !== JSON.stringify(data2)) {
    // 数据变动 需要清除历史缓存
    return true
  } else {
    return false
  }
}

const geiVersionList = (versionGroup = {}) => {
  const res = {}
  for (const k in versionGroup) {
    if (versionGroup[k] && versionGroup[k].list) {
      res[k] = versionGroup[k].list.map((item) => item.version)
    }
  }
  return res
}

module.exports = {
  getVersionInfo,
  configHasChange
}
