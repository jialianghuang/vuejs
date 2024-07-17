export function compareSize() {
  const { unit, sizeChart, customListForm, logicType } = arguments[0]
  /**
   *  逻辑1: A字裙(A line dress)：
   *    1002420、1006376、1009674、1004424
   *    胸围(Bust) ±0.5In
   *    腰围(Waist) ±0.5In  ;
   *    臀围(Hips) +3In以内，负值可接受
   *    喉到地(Hollow To Hem) +0.5In，-3.5In

   *   逻辑2: 包臀裙(A line dress)：
   *    1005298
   *    胸围(Bust) ±0.5In  
   *    腰围(Waist) ±0.5In
   *    臀围(Hips) +1.5In以内，负值可接受
   *    喉到地(Hollow To Hem) +0.5In，-3.5In
   * 
   */
  const data = sizeChart[unit]
  const bustSize = []
  const waistSize = []
  const hipsSize = []
  const hollowToHemSize = []

  data.forEach((parent) => {
    parent.sizeDetail &&
      parent.sizeDetail.forEach((size) => {
        switch (size.key) {
          case 'bust':
            bustSize.push(parseFloat(size.value))
            break
          case 'waist':
            waistSize.push(parseFloat(size.value))
            break
          case 'hips':
            hipsSize.push(parseFloat(size.value))
            break
          case 'hollow_to_hem':
            hollowToHemSize.push(parseFloat(size.value))
            break
          default:
            break
        }
      })
  })

  let recommendSize = []
  const { bust } = customListForm
  const bustIndex = []
  if (bustSize[0] - bust > 0.5 || bust - bustSize[bustSize.length - 1] > 0.5) return recommendSize
  for (let index = 0; index < bustSize.length; index++) {
    // todo: 方法一
    // if (bust >= bustSize[index] && bust <= bustSize[index + 1]) {
    //   if (bust - bustSize[index] <= 0.5) {
    //     !bustIndex.includes(index) && bustIndex.push(index)
    //   }
    //   if (bustSize[index + 1] - bust <= 0.5) {
    //     bustIndex.push(index + 1)
    //   }
    //   break
    // }
    // todo: 方法二
    if (Math.abs(bust - bustSize[index]) <= 0.5) {
      bustIndex.push(index)
    }
  }
  if (bustIndex.length === 0) return recommendSize
  recommendSize = compareSizes(bustIndex, data, customListForm, logicType)
  return recommendSize.filter((size) => size)
}

/**
 *
 * @param {*} arr **** bust满足的尺码下标
 * @param {*} data *** 尺码总数据
 * @param {*} obj **** 自定义输入尺码
 * @param {*} type *** 逻辑类型
 * @returns [] ******* 尺码数组
 */
export function compareSizes(arr, data, obj, type) {
  const recommendSizeList = []
  for (let index = 0; index < arr.length; index++) {
    const { key: size, sizeDetail } = data[arr[index]]
    recommendSizeList.push(compareSingleSize(size, sizeDetail, obj, type))
  }

  return recommendSizeList
}

/**
 *
 * @param {*} size ********* 圈定尺码
 * @param {*} sizeDetail *** 尺码详情
 * @param {*} obj ********** 自定义输入尺码
 * @param {*} type ********* 逻辑类型
 * @returns **************** 单个尺码
 */
export function compareSingleSize(size, sizeDetail, obj, type) {
  const { waist, hips, hollow_to_hem: hollowToHem } = obj
  let recommendSize = size
  // todo: 第一位是bust 跳过
  for (let index = 1; index < sizeDetail.length; index++) {
    const { key, value } = sizeDetail[index]
    const campareValue = parseFloat(value)
    if (key === 'waist') {
      if (Math.abs(campareValue - waist) <= 0.5) {
        continue
      }
      recommendSize = null
      break
    }
    if (key === 'hips') {
      if (type === 1 && hips <= campareValue + 3) {
        continue
      }
      if (type === 2 && hips <= campareValue + 1.5) {
        continue
      }
      recommendSize = null
      break
    }
    if (key === 'hollow_to_hem') {
      if (hollowToHem <= campareValue + 0.5 && hollowToHem >= campareValue - 3.5) {
        continue
      }
      recommendSize = null
      break
    }
    recommendSize = null
  }
  return recommendSize
}
