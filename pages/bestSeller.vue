<template>
  <div :class="{ bridal: isBridal }" class="best-seller">
    <main-app ref="main" :navigation="navigation" :prodList="prodList" :adaptive="true">
      <div v-track.view.click="{ common: { ec: 'top_seller_list', el: 'landing_page' } }">
        <div class="best-seller-main">
          <div class="best-seller-main-head">
            <div class="best-seller-main-head-content">
              <img
                :src="
                  isBridal
                    ? 'https://cdn-1.azazie.com/upimg/userfiles/images/1/d2/8c/e26c21ed096c0c70d1c146bade7bd28c.png'
                    : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/2c/69/b851c119fdae0f2f4486457393122c69.png'
                "
                class="vector-left"
                alt="vector left"
              />
              <h2 :class="language">
                {{ nl('page_best_seller_in') }} <span>{{ bestSellerIn }}</span>
              </h2>
              <img
                :src="
                  isBridal
                    ? 'https://cdn-1.azazie.com/upimg/userfiles/images/1/d2/8c/e26c21ed096c0c70d1c146bade7bd28c.png'
                    : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/2c/69/b851c119fdae0f2f4486457393122c69.png'
                "
                class="vector-right"
                alt="vector right"
              />
            </div>
          </div>
          <div class="best-seller-main-content">
            <product-list-item
              v-for="(item, index) in prodList"
              :key="index"
              :item="item"
              :product-index="index"
              :show-limited-time-tag="true"
              :addSuffix="true"
              v-track.view.click="{ id: 'bestSeller' + index, common: getBiCommon('landing_page_product', item, index) }"
              @onGoodsClick="onGoodsClick"
              @quickShop="quickShopClick"
            ></product-list-item>
            <div class="goods-item"></div>
            <div class="goods-item"></div>
            <div class="goods-item"></div>
            <div class="goods-item"></div>
          </div>
        </div>
        <div class="best-seller-view-more">
          <h2>{{ nl('page_best_seller_view_more_in') }}</h2>
          <div class="best-seller-view-more-list">
            <a
              v-for="(item, index) in sellerList"
              :key="index"
              :href="countryUrl(item.url)"
              v-track.view.click="{ id: 'bestSellerRec' + index, common: getBiCommon('landing_page_rec', item, index) }"
              class="best-seller-view-more-item"
            >
              <img :src="replaceImgCdnUrl(`${PIC_PATH}s240/${item.imgUrl}`)" :alt="item.name" />
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
      <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'" @refreshCartList="getCartInfo()"></quick-shop-dialog>
      <az-loading v-model="loadingFlag" :msgFlag="axiosError"></az-loading>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import ProductListItem from '@/components/list/ProductListItem'
import AzLoading from '@/components/az-ui/Loading/AzLoading'
import { Base64 } from 'js-base64'
import { mapState } from 'vuex'
// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog'),
  // 异步组件加载时使用的组件
  loading: AzLoading
})

export default {
  name: 'BestSeller',
  components: {
    MainApp,
    ProductListItem,
    AzLoading,
    QuickShopDialog
  },
  data() {
    return {
      axiosError: false
    }
  },
  computed: {
    ...mapState({
      prodList: (state) => state.list.prodList,
      loadingFlag: (state) => state.list.loadingFlag
    }),
    bestSellerIn() {
      let res = this.sellerInfo.url || ''
      res = res.replace(/_|-/g, ' ')
      return res
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let sellerUrl = commonAsyncData.requestUrl.split('?')[0]
      if (sellerUrl) sellerUrl = sellerUrl.split('/best-seller/')[1]
      if (!sellerUrl) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }
      // 首屏,色圈接口并发
      const [res, colorHexRes] = await Promise.all([
        context.$axios.$post(`/1.0/list/content?fromPage=seller&sellerUrl=${sellerUrl}&limit=20`),
        context.$axios.$get('/1.0/common/color-hex')
      ])

      if (!res.data.prodList || res.data.prodList.length === 0) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }

      context.store.commit('list/setProdList', res.data.prodList || [])
      context.store.commit('list/setLoadingFlag', false)

      // 列表页将colorHex放在首屏里面，优化页面渲染
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }

      const seoInfo = res.data.seoInfo
      if (seoInfo.content) seoInfo.content = Base64.encode(seoInfo.content)

      return {
        ...commonAsyncData,
        seoInfo,
        // prodList: res.data.prodList,
        sellerList: res.data.sellerList,
        sellerInfo: res.data.sellerInfo
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
    getBiCommon(el, e, i) {
      const msg = {
        cat_id: e.catId,
        name: this.bestSellerIn
      }
      if (el === 'landing_page_rec') {
        msg.postion = i + 1
      } else if (el === 'landing_page_product') {
        msg.ranking = i + 1
      }
      return {
        ec: 'top_seller_list',
        el,
        msg: JSON.stringify(msg)
      }
    },
    onGoodsClick() {
      // 订单追踪
      this.setOrderSourceFlag('Best Seller' + this.sellerInfo.catId, true)
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main.getCartInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.best-seller {
  overflow: hidden;
  &-main {
    &::before {
      content: '';
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      height: 220px;
      background: #d87b86;
      z-index: 0;
    }
    &-head {
      width: 100%;
      height: 415px;
      background: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/9e/a4/9cce4ad069126042bba8e96310539ea4.png') no-repeat center;
      background-size: 100% 100%;
      text-align: center;
      line-height: normal;
      font-family: @font-family-700;
      color: #fff;
      margin-top: -92px;
      overflow: hidden;
      position: relative;
      z-index: 1;
      &-content {
        margin-top: 127px;
        display: flex;
        align-items: center;
        justify-content: center;
        h2 {
          width: 380px;
          margin: 0px 20px;
          font-size: 28px;
          overflow-wrap: break-word;
          span {
            text-transform: capitalize;
          }
          &.fr,
          &.es {
            width: 455px;
          }
        }
        img {
          width: 32px;
          height: 55px;
          margin-bottom: -20px;
          &.vector-left {
            transform: rotateY(180deg);
          }
        }
      }
    }
    &-content {
      width: 79.6875vw;
      min-width: 1004px;
      background: #fff;
      margin: 0 auto;
      margin-top: -173px;
      position: relative;
      z-index: 1;
      padding: 0.78125vw;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      > div {
        margin-right: 0.78125vw;
        margin-bottom: 30px;
        &:nth-child(5n) {
          margin-right: 0px;
        }
      }
      /deep/ .goods-item {
        width: 15.3125vw;
        min-width: 192.9375px;
      }
    }
  }
  &-view-more {
    padding: 60px 0px;
    background: var(--color-f1e9e6);
    text-align: center;
    > h2 {
      font-size: 24px;
      font-family: @font-family-500;
      margin-bottom: 30px;
    }
    &-list {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-item {
      width: 19.167vw;
      min-width: 242px;
      padding: 15px;
      box-sizing: border-box;
      background: #fff;
      margin-right: 30px;
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 18px;
      cursor: pointer;
      text-transform: capitalize;
      &:hover {
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);
      }
      &:last-of-type {
        margin-right: 0px;
      }
      img {
        width: 7.292vw;
        min-width: 92px;
        margin-right: 15px;
      }
    }
  }
  &.bridal {
    .best-seller-main::before {
      background: #5c756c;
      height: 178px;
    }
    .best-seller-main-head {
      background: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/d2/e0/7075ed8d5017d184ff32ee061fbdd2e0.png') no-repeat center;
      background-size: 100% 100%;
    }
    .best-seller-view-more {
      background: var(--color-dedcd6);
    }
  }
}
</style>
