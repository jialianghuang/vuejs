<template>
  <main-app :navigation="navigation" :adaptive="true" class="adaptive-box">
    <div class="beach-wedding">
      <div class="content">
        <!-- 主题颜色选择 -->
        <pick-theme-color
          :theme="theme"
          :ec="ec"
          :current-color="color"
          :bg-color="beachWeddingData.familyBackground"
          :color-family-list="colorFamilyList"
          @select-color="selectColor"
        >
          <gallery-banner
            :theme="theme"
            :image-url="beachWeddingData.topBannerUrl"
            :ec="ec"
            :current-color="color"
            :style-gallery-list="beachWeddingData.styleGalleryList"
            @getGalleryInfo="getGalleryInfo"
          ></gallery-banner
        ></pick-theme-color>
        <!-- 选择分类 -->
        <choose-category :theme="theme" :category-list="beachWeddingData.categoryList"></choose-category>
        <!-- 商品列表 -->
        <template v-if="moduleList && moduleList.length > 0">
          <template v-for="(item, index) in moduleList">
            <wedding-product-list
              :product-list-data="item"
              :ec="ec"
              :current-color="color"
              :module-id="item.moduleId"
              :key="index"
              @refresh="refrechProductList"
              @quick-shop="quickShopClick"
            ></wedding-product-list>
          </template>
        </template>
        <!-- 底部banner -->
        <bottom-banner :image-url="beachWeddingData.bottomBannerUrl" :ec="ec"></bottom-banner>
        <!-- seo -->
        <seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content" class="seo-content"></seo-content>
      </div>
    </div>
    <!-- quickshop -->
    <quick-shop-dialog
      ref="quickShopDialog"
      :fromDialog="'list'"
      @addSuccess="addSuccess"
      @refreshCartList="getCartInfo()"
    ></quick-shop-dialog>
    <!-- style gallery -->
    <popup-style-gallery
      v-if="popupStyleGallery.popupStyleGalleryShow"
      @getGalleryInfo="getGalleryInfo"
      @getGalleryList="getGalleryList"
      :pageInfo="pageInfo"
      :show-switch-button="false"
    ></popup-style-gallery>
    <az-loading v-if="loading"></az-loading>
  </main-app>
</template>

<script>
import mainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import SeoContent from '@/components/sale/SaleSeoContent'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
// 页面组件引入
import GalleryBanner from '@/components/wedding-theme/GalleryBanner'
import ChooseCategory from '@/components/wedding-theme/ChooseCategory'
import PickThemeColor from '@/components/wedding-theme/PickThemeColor'
import WeddingProductList from '@/components/wedding-theme/WeddingProductList'
import BottomBanner from '@/components/wedding-theme/BottomBanner'
import AzLoading from '@/components/az-ui/Loading/AzLoading'
import PopupStyleGallery from '@/components/styleGallery/PopupStyleGallery'
import azLoading from '@/components/az-ui/AzLoading'

const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog'),
  // 异步组件加载时使用的组件
  loading: AzLoading
})

export default {
  name: 'BeachWedding',
  components: {
    mainApp,
    SeoContent,
    GalleryBanner,
    ChooseCategory,
    PickThemeColor,
    WeddingProductList,
    BottomBanner,
    PopupStyleGallery,
    QuickShopDialog,
    azLoading
  },
  data() {
    return {
      theme: 'beach-wedding',
      ec: 'beach wedding theme page',
      color: '', // 控制所有组件一致的色系
      moduleList: [],
      pageInfo: {},
      lazyloadData: [],
      loading: false
    }
  },
  computed: {
    ...mapState('styleGallery', ['popupStyleGallery', 'galleryList', 'selectedFilters', 'currentGalleryId']),
    colorFamilyList() {
      return this.beachWeddingData.familyList ? Object.values(this.beachWeddingData.familyList) : []
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const params = {
        theme: 'beach-wedding', // string类型 区分获取的页面信息
        'color-family': undefined // 可选 每次点击color-family要重新调用接口更新页面内容
      }

      const [{ data: beachWeddingData }, colorHexRes] = await Promise.all([
        context.$axios.$get(`/1.0/wedding-theme-page`, { params }),
        context.$axios.$get('/1.0/common/color-hex')
      ])

      // 将colorHex放在首屏里面，优化页面渲染
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      } else {
        context.redirect(302, '/')
      }

      return {
        ...commonAsyncData,
        beachWeddingData
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
  created() {
    this.getProductListData()
  },
  mounted() {
    // 页面mounted后继续懒加载数据
    this.getLazyloadData()
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    selectColor(item) {
      // 优先从懒加载数据中获取 没找到则请求接口
      const index = this.lazyloadData.findIndex((i) => {
        return item.key === i.key
      })
      if (index > -1) {
        this.color = item.key
        this.beachWeddingData = this.lazyloadData[index]
      } else {
        this.getAsyncData(item)
      }

      // 拿到懒加载数据中index
      const lazyIndex = this.lazyloadData.findIndex((i) => {
        return i.key === item.key
      })
      // 匹配对应懒加载数据中的moduleId 并取categoryList中数据对moduleList重新赋值背景色
      this.moduleList.forEach((i, idx) => {
        if (['BRIDESMAID', 'MEN'].includes(i.moduleId)) {
          const catIndex = this.lazyloadData[lazyIndex].categoryList.findIndex((catIdx) => {
            return catIdx.key === i.moduleId
          })
          const bgObj = {
            bannerBackground: this.lazyloadData[lazyIndex].categoryList[catIndex].bannerBackground,
            productBackground: this.lazyloadData[lazyIndex].categoryList[catIndex].productBackground
          }
          this.$set(this.moduleList, idx, {
            ...this.moduleList[idx],
            ...bgObj
          })
        }
      })
    },
    async getAsyncData(item) {
      try {
        // 每次点击color-family要重新调用接口
        const { data } = await this.$axios.$get(`/1.0/wedding-theme-page?theme=${this.theme}&color-family=${item.key}`)
        if (data) {
          this.color = item.key
          this.beachWeddingData = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getProductListData() {
      try {
        // category: string类型 返回对应category的商品信息
        const asyncList = this.beachWeddingData.categoryList.map((item) => {
          return { api: `/1.0/wedding-theme-goods?theme=${this.theme}&color-family=&category=` + item.key }
        })

        const [res, res2, res3, res4, res5] = await Promise.all(
          asyncList.map((item) => {
            return this.$axios.$get(item.api)
          })
        )

        if (res && res2 && res3 && res4 && res5) {
          const resList = [res.data, res2.data, res3.data, res4.data, res5.data]

          // 给每个组件绑定module id
          this.moduleList = this.beachWeddingData.categoryList
            ? this.beachWeddingData.categoryList.map((item) => {
                return { moduleId: item.key, bannerBackground: item.bannerBackground, productBackground: item.productBackground }
              })
            : []

          resList.forEach((item) => {
            // 查找res对应categoryList的index
            const index = this.beachWeddingData.categoryList.findIndex((i) => {
              return i.value === item.name
            })
            // 将对应res赋值到moduleList
            if (item.name === this.beachWeddingData.categoryList[index].value) {
              Object.assign(this.moduleList[index], item)
            }
          })
        }
      } catch (error) {}
    },
    async refrechProductList(item) {
      // 更新商品列表
      this.loading = true
      try {
        const res = await this.$axios.$get(
          `/1.0/wedding-theme-goods?theme=${this.theme}&color-family=${this.color}&color=${item.key || ''}&category=${item.moduleId || ''}`
        )
        if (res) {
          const idx = this.moduleList.findIndex((i) => {
            return i.moduleId === item.moduleId
          })
          this.$set(this.moduleList, idx, {
            ...this.moduleList[idx],
            ...res.data
          })
          this.loading = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getLazyloadData() {
      try {
        const asyncList = this.beachWeddingData.familyList.map((item) => {
          return { api: `/1.0/wedding-theme-page?theme=${this.theme}&color-family=${item.key}&category=` }
        })

        const [res, res2, res3, res4, res5, res6] = await Promise.all(
          asyncList.map((item) => {
            return this.$axios.$get(item.api)
          })
        )
        if (res && res2 && res3 && res4 && res5 && res6) {
          const resList = [res.data, res2.data, res3.data, res4.data, res5.data, res6.data]
          // 拼接obj
          this.lazyloadData = resList.map((item, index) => {
            return { key: item.familyList[index].key, ...item }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 引入quick-shop
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
      this.setOrderSourceFlag('wedding_theme_beach_wedding', true)
    },
    addSuccess() {
      this.getCartInfo()
      this.$store.commit('product/setShowAddCartDialog', true)
      this.$store.commit('setTopCartListShow', true)
    },
    async getCartInfo() {
      // 导航栏的购物车icon,hover上去有删除功能，删除之后获取购物车状态
      try {
        const res = await this.$axios.$get(`/1.0/cart`, {
          params: { for_checkout: 1, sodGalleryVersion: this.versionObj.sodGalleryVersion.toLowerCase() }
        })
        if (res.code == 0) {
          if (res.data.summary) {
            this.$store.commit('setCartInfo', {
              totalCount: res.data.forCheckoutQty,
              prodList: res.data.checkoutGoodsList || [],
              hasLineTotal: res.data.summary.goodsAmount != res.data.summary.totalNoDealGoodsAmount,
              totalPrice: res.data.summary.goodsAmountDisplay,
              totalNoDealPrice: res.data.summary.totalNoDealGoodsAmountDisplay,
              sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
              freeShippingProgress: res.data.freeShippingProgress, // 免运费进度条相关数据
              cartBundleList: res.data.cartBundleList, // buy more get more
              activityInfo: res.data.activityInfo || {}
            })
          } else {
            this.$store.commit('setCartInfo', {
              totalCount: 0,
              prodList: [],
              hasLineTotal: false,
              totalPrice: 0,
              totalNoDealPrice: 0,
              sample_gift_goods_id: '',
              freeShippingProgress: null,
              activityInfo: {}
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 引入gallery弹窗方法
    async getGalleryList(data) {
      try {
        const page = data && data[0]
        const cb = data && data[1]
        this.loadingFlag = true
        const res = await this.$axios.$post(`/1.0/style-gallery/`, {
          filters: this.selectedFilters,
          page: page || 1,
          limit: this.pageInfo.limit,
          last_gallery_id: page && page != 1 ? this.lastGalleryId : 0 // 更换filter的时候 页码要重置为1 并且 last_gallery_id 要重置
        })
        if (res.code == 0) {
          this.lastGalleryId = res.data.lastGalleryId
          this.pageInfo = res.data.pageInfo || {}
          const productList = res.data.galleryList || []
          if (productList[0]) {
            //   这里设置一下当前的 CurrentGalleryId 是因为，在弹窗里面点击下一个的时候，如果是目前页面最后一个，需要自动加载下一页，所以，加载数据的时候默认把第一个数据的 galleryId 设置为当前的 CurrentGalleryId
            this.$store.commit('styleGallery/setCurrentGalleryId', productList[0].galleryId)
          }
          if (this.pageInfo.page && this.pageInfo.page > 1) {
            this.$store.commit('styleGallery/setGalleryList', this.galleryList.concat(productList))
          } else {
            this.$store.commit('styleGallery/setGalleryList', productList)
          }
          if (cb && cb == 'getInfo') {
            this.getGalleryInfo()
          }
        }
        if (!this.axiosError) {
          this.loadingFlag = false
        }
      } catch (error) {
        console.log(error)
        this.axiosError = true
      }
    },
    getGalleryInfo() {
      if (!this.currentGalleryId) return
      // 设置弹窗和url地址都在这里统一处理，其他地方只需要设置好currentGalleryId并且调用这个方法即可
      this.$store.commit('styleGallery/setCurrentUrl', window.location.href)
      history.pushState('', '', `/style-gallery/${this.currentGalleryId}`)
      this.$store.commit('styleGallery/setGalleryInfoAgg', {})
      this.$axios.$post(`/1.0/style-gallery/info/${this.currentGalleryId}`).then((res) => {
        if (res.code == 0) {
          this.$store.commit('styleGallery/setGalleryInfoAgg', res.data || {})
        } else {
          alert(res.msg)
        }
      })
      this.$store.commit('styleGallery/setPopupStyleGalleryShow', {
        popupStyleGalleryShow: true,
        popupStyleGalleryId: this.currentGalleryId
      })
    }
  }
}
</script>

<style lang="less" scoped>
.beach-wedding {
  position: relative;
  .content {
    width: 100%;
    word-break: break-word;
  }
}

.seo-content {
  box-sizing: border-box;
  max-width: 1600px;
  clear: both;
  padding: 0;
  margin: 0 auto;
}

/deep/ .sale-seo-content h1 {
  margin: 0 0 15px;
}

/deep/ .az-footer-box {
  margin-top: 80px;
}

/deep/ .az-popup-box {
  width: unset !important;
}

@media screen and (max-width: 1600px) {
  .seo-content {
    padding: 0 30px;
  }
}
</style>
