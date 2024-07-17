<template>
  <div class="shop-the-look">
    <div class="shop-the-look-main">
      <div class="shop-the-look-imgs-box">
        <shop-the-look-imgs :products="products" :loading.sync="loading" @handleClickImg="handleClickImg"></shop-the-look-imgs>
      </div>
      <div class="shop-the-look-goods">
        <div v-show="!showList">
          <div class="title">
            <span>{{ nl('page_common_look') }}</span>
          </div>
          <div class="shop-the-look-goods-main">
            <template v-for="(item, index) in products">
              <shop-the-look-goods-item
                v-if="(item.goodsInfo && item.goodsInfo.showGoodsInfo) || !item.goodsInfo"
                :key="index"
                :item="item"
                @clickChange="handleChange"
                @clickDelete="handleDelete"
                @changeColorSize="handleUpdateColorSize"
              ></shop-the-look-goods-item>
            </template>
            <div class="total-box">
              <div class="price-box">
                <span class="total">{{ nl('page_cart_total') }}</span>
                <span class="price">{{ totalPrice }}</span>
              </div>
              <div v-if="totalBundleDiscountAmount" class="total-no-deal-price">
                <span>{{ nl('page_cart_you_saved') }}</span>
                {{ currencySymbol }}{{ totalBundleDiscountAmount }}
              </div>
            </div>
            <div class="btn-box">
              <az-button
                v-track.view.click="{ common: getBiParams('shopthelook', 'cancel') }"
                @click="clickCancel"
                class="btn btn-hollow cancel"
                >{{ nl('page_common_cancel') }}</az-button
              >
              <az-button
                v-track.view.click="{ common: getBiParams('shopthelook', 'addtobag') }"
                :disabeld="disabeld"
                :class="{ disabled: disabeld }"
                @click="clickAddToBag"
                class="btn btn-theme"
                >{{ nl('page_cart_add_to_bag') }}</az-button
              >
            </div>
          </div>
        </div>
        <shop-the-look-details-list
          :visible.sync="showList"
          :type="changeCatId"
          :title="changeCatName"
          :list="detailsList"
          :filters="detailsFilters"
          :loadFinished="pageInfo.page >= pageInfo.totalPage"
          @onConfirm="handleConfirmColorSize"
          @onColorChange="handleColorChange"
          @loadMore="handleLoadMore"
          @itemChange="handleItemChange"
          @clickNone="clickNone"
        ></shop-the-look-details-list>
      </div>
    </div>
    <quick-shop-dialog
      ref="quickShopDialog"
      @onConfirm="handleColorSizeConfirm"
      :scene="quickShopScene"
      :quickShopLoading.sync="loading"
      from-dialog="shopTheLook"
    ></quick-shop-dialog>
    <az-loading v-if="loading"></az-loading>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import ShopTheLookGoodsItem from '@/components/shopTheLook/ShopTheLookGoodsItem'
import ShopTheLookDetailsList from '@/components/shopTheLook/ShopTheLookDetailsList'
import ShopTheLookImgs from '@/components/shopTheLook/ShopTheLookImgs'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import AzLoading from '@/components/az-ui/AzLoading'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

/**
 * shop the look工具页
 */
export default {
  components: {
    AzButton,
    ShopTheLookGoodsItem,
    ShopTheLookDetailsList,
    ShopTheLookImgs,
    QuickShopDialog,
    AzLoading
  },
  data() {
    return {
      changeCatId: '', // 当前点击change的搭配类型
      changeCatName: '', // 当前点击change的搭配类型名称
      showList: false, // 是否展示商品列表
      detailsList: [], // 搭配商品具体列表
      detailsFilters: {}, // 筛选项
      quickShopScene: '', // 快速加购弹框出现的场景类型：shopLookUpdate, shopLookConfirm，主要用于区分场景和打点
      pageInfo: {
        page: 1,
        limit: 30,
        totalPage: 2
      },
      loading: false,
      isAddToBag: false, // 是否加购操作
      currentColor: {} // 当前筛选选中颜色
    }
  },
  computed: {
    ...mapState('product', ['fromShowroom', 'fromDetailsEntry', 'fromInstagram', 'fromWhatAreU', 'recommendFlag']),
    // 按钮是否禁用，只要有搭配商品，就可用
    disabeld() {
      let res = true
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].goodsInfo && this.products[i].goodsInfo.showGoodsInfo) {
          res = false
          break
        }
      }
      return res
    },
    // 所有价格
    totalPrice() {
      let res = 0
      this.products.forEach((ele) => {
        if (ele.goodsInfo && ele.goodsInfo.baseInfo && ele.goodsInfo.showGoodsInfo) {
          // 优惠之后的价格
          if (ele.goodsInfo.baseInfo.showBundlePrice && ele.goodsInfo.baseInfo.bundleAmount) {
            res += ele.goodsInfo.baseInfo.bundleAmount
          } else {
            res += ele.goodsInfo.baseInfo.shopPrice
          }
        }
      })
      return this.currencySymbol + res
    },
    // save的价格
    totalBundleDiscountAmount() {
      let res = 0
      this.products.forEach((ele) => {
        if (ele.goodsInfo && ele.goodsInfo.baseInfo && ele.goodsInfo.showGoodsInfo && ele.goodsInfo.baseInfo.bundleDiscountAmount) {
          res += ele.goodsInfo.baseInfo.bundleDiscountAmount
        }
      })
      return res
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const source = context.route.query.source
      // shop the look工具页初始化页面数据获取接口
      const [res, colorHexRes] = await Promise.all([
        context.$axios.$post(
          `/1.0/product/shop-look/group?goods_id=${context.query.goods_id}&color=${context.query.color}&dress_type=${context.query.dress_type}&source=${source}`
        ),
        context.$axios.$get('/1.0/common/color-hex')
      ])

      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'shop-the-look')

      const products = []
      if (res.data.product) {
        for (const key in res.data.product) {
          if (Object.hasOwnProperty.call(res.data.product, key)) {
            const ele = res.data.product[key]
            if (ele.baseInfo) {
              products.push({
                catId: ele.catId,
                catName: ele.baseInfo.catName,
                color: ele.baseInfo.color,
                goodsId: ele.baseInfo.goodsId,
                goodsInfo: ele,
                selectedColor: ele.styleInfo ? ele.styleInfo.color[ele.baseInfo.color] : {},
                selectedSize: {},
                error: '',
                showGoodsInfo: ele.showGoodsInfo
              })
            } else {
              products.push({
                catId: ele.catId,
                catName: ele.catName
              })
            }
          }
        }
      }

      // color-hex 数据处理
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }
      return {
        ...commonAsyncData,
        products, // 所有搭配商品数据
        originProducts: JSON.parse(JSON.stringify(products)), // 保存一个副本数据，因为切换分类商品需要回显图片，取消选中商品还要展示原始数据
        totalAmountDisplay: res.data.totalAmountDisplay || '',
        source
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    },
    // 处理确认颜色和尺码后的操作，更新搭配商品对应颜色和尺码展示
    handleColorSizeConfirm(e) {
      for (let i = 0; i < this.products.length; i++) {
        const ele = this.products[i]
        if (ele.catId === e.baseInfo.catId) {
          ele.goodsInfo.baseInfo = e.baseInfo
          ele.goodsInfo.imageInfo = e.imageInfo
          ele.goodsInfo.styleInfo = e.styleInfo
          ele.selectedColor = e.selectedColor
          ele.selectedSize = e.selectedSize
          ele.goodsId = e.baseInfo.goodsId
          ele.error = '' // 清空对应报错信息
          this.showList = false // 隐藏列表，展示搭配页
          this.originProducts[i] = JSON.parse(
            JSON.stringify({
              ...ele
            })
          )
          break
        }
      }

      // 当quickshop确认之后，如果是执行的加购操作，继续判断是否还有需要确认尺码的搭配商品，继续自动弹出quickshop
      if (this.isAddToBag) {
        this.checkError(this.isAddToBag)
      }
    },
    // 点击取消，返回上一页
    clickCancel() {
      document.referrer ? window.history.back() : (window.location.href = '/')
    },
    // 搭配商品修改查询对应商品列表接口
    getShopLookContent(e) {
      this.loading = true
      const params = {
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        color: e.color,
        dress_type: e.dressType,
        cat_id: e.catId,
        cat_name: e.catName
      }
      // `/1.0/product/shop-look/content?page=${this.pageInfo.page}&limit=${this.pageInfo.limit}&color=${e.color}&dress_type=${e.dressType}&cat_id=${e.catId}&cat_name=${e.catName}`
      this.$axios
        .$post(`/1.0/product/shop-look/content`, params)
        .then((res) => {
          this.loading = false
          if (res && res.code === 0) {
            if (res.data.prodList) {
              res.data.prodList.forEach((ele) => {
                this.detailsList.push(ele)
              })
            }
            this.detailsFilters = res.data.filters
            this.pageInfo = res.data.pageInfo
            this.showList = true
          } else {
            alert(res.msg)
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    // 加载查询更多
    handleLoadMore() {
      this.pageInfo.page++
      this.handleColorChange()
    },
    // 点击列表商品，左侧回显对应图片
    handleItemChange(e) {
      if (e) {
        for (let i = 0; i < this.products.length; i++) {
          const ele = this.products[i]
          if (ele.catId === e.catId) {
            if (e.imageInfo) {
              ele.selectedColor = e.styleInfo
                ? e.styleInfo.color[e.color]
                : {
                    key: e.color,
                    name: e.shownColor
                  }
              // 每次切换商品，选中尺码需要重置
              ele.selectedSize = {}
              if (ele.goodsInfo) {
                ele.goodsInfo = {
                  ...ele.goodsInfo,
                  baseInfo: e,
                  imageInfo: e.imageInfo,
                  styleInfo: e.styleInfo
                }
              } else {
                ele.goodsInfo = {
                  baseInfo: e,
                  imageInfo: e.imageInfo,
                  styleInfo: e.styleInfo
                }
              }
              // 用户可能执行过删除操作，删除操作会清空goodsInfo内的所有内容，之后再切换商品，尺码颜色显示会有问题，所以这里要重新赋值
              if (!ele.styleInfo) {
                ele.goodsInfo.styleInfo = JSON.parse(JSON.stringify(this.originProducts[i].goodsInfo.styleInfo))
              }
              // 之前展示的商品切换后或者删除之后添加还要继续展示，所以需要重新赋值 showGoodsInfo
              ele.goodsInfo.showGoodsInfo = JSON.parse(JSON.stringify(this.originProducts[i].goodsInfo)).showGoodsInfo
            } else if (ele.goodsInfo && ele.goodsInfo.baseInfo) {
              ele.goodsInfo = JSON.parse(JSON.stringify(this.originProducts[i].goodsInfo))
              ele.selectedColor = JSON.parse(JSON.stringify(this.originProducts[i].selectedColor))
            } else {
              ele.goodsInfo = ''
            }
            break
          }
        }
      }
    },
    // 点击列表none,重置左边图片和右侧数据
    // 19270：点击none后直接删除对应品类搭配商品
    clickNone(e) {
      this.currentColor = {}
      // this.handleItemChange(e)
      // this.handleChange(e)
      this.showList = false
      this.handleDelete(e)
    },
    // 详细列表关闭操作，将products数据重置
    handleDetailsListClose(e) {
      for (let i = 0; i < this.products.length; i++) {
        const ele = this.products[i]
        if (ele.catId === e.catId) {
          ele.goodsInfo = JSON.parse(JSON.stringify(this.originProducts[i].goodsInfo))
          ele.selectedColor = JSON.parse(JSON.stringify(this.originProducts[i].selectedColor))
          break
        }
      }
    },
    // 处理点击change操作，显示对应类型的商品列表
    handleChange(e) {
      this.isAddToBag = false
      this.changeCatId = e.catId
      this.changeCatName = e.catName
      this.detailsList = []
      const payload = {
        // goodsId: e.goodsId,
        // color: e.selectedColor.key,
        dressType: e.goodsInfo && e.goodsInfo.baseInfo ? e.goodsInfo.baseInfo.dressType : 'dress',
        catId: e.catId,
        catName: e.catName
      }
      // 筛选操作过颜色后，后面点击change，需要传递该颜色
      // if (this.currentColor.key && this.currentColor.catId && e.catId === this.currentColor.catId) {
      //   payload.color = this.currentColor.key
      // }
      this.getShopLookContent(payload)
    },
    // 点击删除图标，删除对应搭配商品
    handleDelete(e) {
      for (let i = 0; i < this.products.length; i++) {
        const ele = this.products[i]
        if (ele.catId === e.catId) {
          ele.goodsInfo = ''
          break
        }
      }
    },
    // 点击搭配商品的颜色尺码，弹出快速加购的弹框，进行修改颜色和尺码操作
    handleChangeColorSize(e) {
      let goodsId = ''
      let dressType = ''
      let color = ''
      if (e.goodsInfo && e.goodsInfo.baseInfo) {
        goodsId = e.goodsInfo.baseInfo.goodsId
        dressType = e.goodsInfo.baseInfo.dressType
        color = e.selectedColor.key
      } else {
        goodsId = e.goodsId
        dressType = e.dressType
        color = e.color
      }
      this.loading = true
      const params = {
        goods_id: goodsId,
        color,
        dress_type: dressType,
        cat_id: e.catId
      }
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    // 点击搭配商品的颜色尺码修改
    handleUpdateColorSize(e, b = true, isAddToBag = false) {
      this.isAddToBag = isAddToBag
      this.quickShopScene = 'shopLookUpdate'
      if (b) {
        this.handleChangeColorSize(e)
      }
    },
    // 点击change后的颜色尺码修改
    handleConfirmColorSize(e) {
      this.quickShopScene = 'shopLookConfirm'
      this.handleChangeColorSize(e)
    },
    // 颜色筛选修改后，重新查询列表数据
    handleColorChange(e) {
      let color = ''
      // let goodsId = ''
      let dressType = ''
      for (let i = 0; i < this.products.length; i++) {
        const ele = this.products[i]
        if (ele.catId === this.changeCatId) {
          // goodsId = ele.goodsId
          dressType =
            ele.goodsInfo && ele.goodsInfo.baseInfo ? ele.goodsInfo.baseInfo.dressType : this.originProducts[i].goodsInfo.baseInfo.dressType
          if (e && e.key) {
            this.currentColor = {
              ...e,
              catId: ele.catId
            }
            color = e.key
            this.detailsList = []
          } else {
            color = ele.goodsInfo && ele.goodsInfo.baseInfo ? ele.goodsInfo.baseInfo.color : this.originProducts[i].goodsInfo.baseInfo.color
          }
          break
        }
      }
      const payload = {
        // goodsId,
        color,
        dressType,
        catId: this.changeCatId,
        catName: this.changeCatName
      }
      this.getShopLookContent(payload)
    },
    // 校验是否有错误
    checkError(isAddToBag) {
      let hasError = false
      let errorNum = 0
      // 1.当需要选择尺码但是没有选择尺码时，报错提示
      // 2.没有尺码的配件从列表切换商品回来后，selectedColor里没有对应的styleId，需要用户再次确认
      for (let i = 0; i < this.products.length; i++) {
        const ele = this.products[i]
        if (ele.goodsInfo && ele.goodsInfo.styleInfo && ele.goodsInfo.showGoodsInfo) {
          if (ele.goodsInfo.styleInfo.hasSize && !ele.selectedSize.styleId) {
            ele.error = this.nl('page_goods_select_size_tip')
            hasError = true
          } else if (ele.goodsInfo.styleInfo.hasColor && !ele.selectedColor.styleId) {
            ele.error = this.nl('page_goods_select_color_tip')
            hasError = true
          }
          if (hasError) {
            // 通过errorNum来避免quickshop重复弹框
            errorNum++
            // 如果有未选择尺码的商品，直接弹出quickshop弹框，所有未选择尺码的商品依次弹出
            this.handleUpdateColorSize(ele, errorNum <= 1, isAddToBag)
          }
        }
      }
      return hasError
    },
    // 点击add to bag，将所有搭配商品都加入购物车
    clickAddToBag() {
      if (this.disabeld) return

      const hasError = this.checkError(true)
      if (hasError) return

      const groupGoods = []
      this.products.forEach((ele) => {
        if (ele.goodsInfo && ele.goodsInfo.baseInfo && ele.goodsInfo.showGoodsInfo) {
          groupGoods.push({
            goods_id: ele.goodsInfo.baseInfo.goodsId,
            dress_type: ele.goodsInfo.baseInfo.dressType,
            styles: {
              select: {
                color: ele.selectedColor.styleId,
                size: ele.selectedSize.styleId
              },
              size_type: this.showEuSize ? '_cm' : '_inch',
              freeStyle: 'false'
            },
            goods_number: 1
          })
        }
      })
      // 订单追踪
      this.setOrderSourceFlag('shopthelook', true)
      this.loading = true
      const params = {
        from_showroom: this.fromShowroom,
        from_details_entry: this.fromDetailsEntry,
        from_instagram: this.fromInstagram,
        from_whatAreU: this.fromWhatAreU,
        recommend_flag: this.recommendFlag,
        group_goods: groupGoods
      }
      this.$axios
        .$post('/1.0/cart/goods/group', params)
        .then((res) => {
          this.loading = false
          if (res.code === 0) {
            this.setPoint('shopthelook', 'addtobag_success', 'click')
            setTimeout(() => {
              window.location.href = this.countryUrl('/cart')
            }, 1500)
          } else {
            alert(res.msg)
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    handleClickImg(item) {
      this.handleChange(item)
    }
  }
}
</script>
<style lang="less" scoped>
.flex-center {
  display: flex;
  align-items: center;
}
.flex-between {
  .flex-center();
  justify-content: space-between;
}
.shop-the-look {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 200px);
  padding: 100px 0px;
  background: var(--color-eeeeee);
  .flex-center();
  justify-content: center;
  &-main {
    display: flex;
    justify-content: center;
  }
  &-goods {
    width: 28.646vw;
    max-width: 550px;
    min-width: 280px;
    margin-left: 40px;
    position: relative;
    .title {
      padding: 30px 0px;
      font-size: 18px;
      line-height: 25px;
      font-family: @font-family-600;
      text-transform: uppercase;
      .flex-center();
      .interval-symbol {
        display: inline-block;
        margin: 0px 15px;
      }
      .price {
        font-size: 13px;
        line-height: 18px;
        font-family: @font-family-500;
      }
    }
    .total-box {
    }
    .total {
      font-size: 13px;
      line-height: 18px;
      font-family: @font-family-600;
      text-transform: uppercase;
      &-box {
        margin: 30px 0px;
        text-align: right;
        .price-box {
          .price {
            font-size: 16px;
            line-height: 22px;
            margin-left: 10px;
          }
        }
        .total-no-deal-price {
          font-size: 14px;
          line-height: 19px;
          color: @theme-color;
          margin-top: 5px;
        }
      }
    }
    .btn-box {
      height: 50px;
      padding: 5px;
      background: #fff;
      box-shadow: 0px 25px 50px rgba(0, 0, 0, 0.15);
      .flex-between();
      .btn {
        height: 50px;
        &.cancel {
          width: 115px;
          margin-right: 5px;
        }
        &.btn-theme {
          flex: 1;
        }
        &.disabled {
          background: var(--color-ede1d3);
        }
      }
    }
  }
  &-imgs-box {
    margin-left: -50px;
  }
}
</style>
