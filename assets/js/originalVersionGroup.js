// 注意 ！！version 需大写, 需要缓存的abtest，在nuxt-ssr-cache 的 getWebAkey 里添加
export function getOriginalVersionGroup(context) {
  const originVersion = {
    // 活动abtest 全站使用
    activityAbtest: {
      list: [
        { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [29]
    },
    // 17436 sod 图片ab版本标记 列表、详情、quickshop弹框使用
    sodGalleryVersion: {
      list: [
        { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [26]
    },
    // AZWEB-18392 详情页颜色排序优化 详情、quickshop弹框使用
    // 20781： 详情页颜色排序顺序调整为按列表页色系从浅到深排  详情、quickshop弹框使用
    productColorSort: {
      list: [
        { version: 'A', flowRate: 1 }
        // { version: 'B', flowRate: 1 }
      ],
      randomNumber: [28]
    },
    /* 同一个实验组end */
    // 详情使用
    bestSellerAbtest: {
      list: [
        { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [9]
    },
    // 详情try before you buy位置
    tryBeforeAbtest: {
      list: [
        { version: 'A', flowRate: 3 }
        // { version: 'B', flowRate: 1 }
      ],
      randomNumber: [2]
    },
    // 16873 分国家支付方式排序调整
    checkoutPayAbtest: {
      list: [
        { version: 'A', flowRate: 1 }
        // { version: 'B', flowRate: 1 }
      ],
      randomNumber: [4]
    },
    // #20485: 订单完成页新增banner入口abtest
    // #21071: 下掉b版本
    checkoutSuccessBannerAbtest: {
      list: [
        // { version: 'A', flowRate: 1 }
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [9]
    },
    // 暂定b版本没有商品
    indexAbtest: {
      list: [
        // { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [22]
    },
    // 列表页 with code 样式调整abtest
    listWithCodeAbtest: {
      list: [
        // { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [28]
    },
    cartTyingAbtest: {
      list: [
        { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [1]
    },
    // 新客弹框内容显示abtest
    newUserCouponCodeAbtest: {
      list: [
        { version: 'A', flowRate: 1 },
        { version: 'B', flowRate: 1 }
      ],
      randomNumber: [7]
    }
  }

  return originVersion
}
