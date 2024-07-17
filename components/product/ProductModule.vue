<template>
  <div :key="fromText" v-if="!!list.length" class="product-module-container">
    <p v-if="title" class="module-title">{{ nl(title) }}</p>
    <product-swiper :key="swiperText + fromText" v-bind="productSwiperBindValue">
      <div :ref="fromText" v-swiper:[swiperText]="swiperOption" class="swiper-container">
        <div v-track.view="viewBiParams" class="swiper-wrapper product-swiper-viewport">
          <div
            v-for="(item, index) in list"
            :key="index + fromText"
            @click="eventListeners(moduleTitle, item, index + 1)"
            v-track.view.click="getViewParams(ec, item.currentOrder || index, item, el)"
            class="goods-item swiper-slide"
          >
            <product-swiper-item
              :item="item"
              :addSuffix="true"
              :hasQuick="item.canQuickShop"
              :hasQuickBtn="item.canQuickShop"
              :from="fromText"
              @quickShop="showQuickShopDialog"
              :index="index"
              :itemTarget="scene == 'cybermonday' ? '_blank' : '_self'"
            ></product-swiper-item>
          </div>
          <div v-if="viewMoreInfo" class="goods-item swiper-slide view-more-block">
            <div
              v-track.view.click="{
                common: getBiParams(viewMoreInfo.ec, viewMoreInfo.el)
              }"
              class="view-more"
            >
              <a :href="countryUrl(viewMoreInfo.linkUrl)" target="_blank">
                <span class="view-more-text">{{ nl(viewMoreInfo.seeMoreDes || 'page_common_view_more') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </product-swiper>
  </div>
</template>

<script>
import ProductSwiper from '@/components/product/ProductSwiper'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import { mapState } from 'vuex'
export default {
  name: 'ProductModule',
  languageKeys: ['page_common_view_more', ...ProductSwiperItem.languageKeys],
  components: {
    ProductSwiper,
    ProductSwiperItem
  },
  props: {
    // 模块区分关键字，如youmayalsolike，mostpopular
    moduleKey: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    swiperText: {
      type: String,
      default: 'refSwiper'
    },
    fromText: {
      require: true,
      type: String,
      default: () => 'youmayalsolike'
    },
    moduleTitle: {
      require: true,
      type: String,
      default: 'product_you_may_also_like'
    },
    ec: {
      type: String,
      default: ''
    },
    el: {
      type: String,
      default: ''
    },
    viewMoreInfo: {
      type: Object,
      default: () => {
        return null
      }
    },
    isMob: {
      type: Boolean,
      default: false
    },
    // 该组件出现的场景，区分不同使用场景
    scene: {
      type: String,
      default: ''
    },
    slidesPerView: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      viewArr: [],
      currentSnapIndex: 0
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    }),
    productSwiperBindValue({ list, swiperOption }) {
      if (this.scene === 'barbie') {
        return {
          prodList: this.viewMoreInfo && this.viewMoreInfo.linkUrl ? [...list, {}] : list,
          nextEl: swiperOption.navigation.nextEl.replace('.', ''),
          prevEl: swiperOption.navigation.prevEl.replace('.', ''),
          rightArrowEvent: {
            ec: this.ec,
            el: 'Slide'
          },
          slidesPerView: swiperOption.slidesPerView
        }
      }
      return {
        prodList: this.viewMoreInfo && this.viewMoreInfo.linkUrl ? [...list, {}] : list,
        nextEl: swiperOption.navigation.nextEl.replace('.', ''),
        prevEl: swiperOption.navigation.prevEl.replace('.', '')
      }
    },
    swiperOption({ moduleTitle, catId, swiperText, baseInfo, scene }) {
      const that = this
      // 以下代码注释掉，会造成左右切换重名，多个模块操作联动bug
      // const navigationClass = moduleTitle.replace(/./g, '_') + swiperText.replace(/./g, '_') // 运营有可能会把 moduleTitle 配置成带 . 的，calss不支持带. 所以这里兼容下
      if (['cybermonday', 'barbie'].includes(scene)) {
        return {
          slidesPerView: scene === 'barbie' ? 4 : 5,
          spaceBetween: scene === 'barbie' ? 20 : 10,
          slidesPerGroup: scene === 'barbie' ? 4 : 5,
          simulateTouch: false,
          speed: 800,
          navigation: {
            nextEl: '.module-swiper-button-next' + swiperText,
            prevEl: '.module-swiper-button-prev' + swiperText
          },
          on: {
            slideChangeTransitionEnd() {
              // comments: this 指代swiper实例，并非当前vue实例
              if (this.fromText) that.setPoint(that.fromText, `${that.isMob ? 'mob' : ''}items${this.snapIndex + 1}`, 'view')
              that.currentSnapIndex = this.snapIndex
            }
          }
        }
      }
      return {
        slidesPerView: this.isSpecialCatId(catId) ? 8 : 7,
        spaceBetween: this.isSpecialCatId(catId) ? 20 : 10,
        slidesPerGroup: this.isSpecialCatId(catId) ? 8 : 7,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: '.module-swiper-button-next' + swiperText,
          prevEl: '.module-swiper-button-prev' + swiperText
        },
        on: {
          slideChangeTransitionEnd() {
            // comments: this 指代swiper实例，并非当前vue实例
            if (this.fromText) that.setPoint(that.fromText, `${that.isMob ? 'mob' : ''}items${this.snapIndex + 1}`, 'view')
            that.currentSnapIndex = this.snapIndex
          }
        },
        breakpoints: {
          1500: {
            slidesPerView: 6,
            slidesPerGroup: 6
          },
          1536: {
            slidesPerView: this.isSpecialCatId(catId) ? 8 : 6,
            slidesPerGroup: this.isSpecialCatId(catId) ? 8 : 6
          }
        }
      }
    },
    viewBiParams({ fromText, baseInfo, isMob = false }) {
      if (fromText) {
        const params = [
          {
            ec: fromText,
            el: isMob ? 'mobitems1' : 'items1',
            msg: JSON.stringify({
              goodsId: baseInfo.goodsId,
              cat_name: baseInfo.catName,
              dress_type: baseInfo.dressType,
              from_cat_id: this.catId, // 主商品catId
              cat_id: baseInfo.catId
            })
          }
        ]
        // designinthiscolorandfabric  在原有的基础上，再加上一个 items的view点
        if (fromText === 'designinthiscolorandfabric') {
          params.push({
            ec: fromText,
            el: isMob ? 'mobitems' : 'items',
            msg: JSON.stringify({
              goodsId: baseInfo.goodsId,
              cat_name: baseInfo.catName,
              dress_type: baseInfo.dressType,
              from_cat_id: this.catId, // 主商品catId
              cat_id: baseInfo.catId
            })
          })
        }
        return {
          common: params
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        if (this.list && this.list.length) {
          const gaParams = this.getGAItemListParams(this.list, null, 'view', this.fromText)
          this.setGA4DataLayer(gaParams)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    setPoint(ec, el, ea, msg) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(
          msg || {
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType,
            cat_id: this.baseInfo.catId,
            from_cat_id: this.catId // 主商品catId
          }
        )
      })
    },
    // 订单追踪
    eventListeners(_module, item, index) {
      // 为点击商品的打点
      if (!(this.ec === 'ordersuccess' && this.moduleKey === 'youmayalsolike')) {
        if (this.fromText) {
          this.setPoint(this.fromText, this.isMob ? 'mobitems' : 'items', 'click', {
            index,
            goodsId: item.goodsId,
            cat_name: item.catName,
            dress_type: item.dressType || this.dressType,
            cat_id: item.catId,
            from_cat_id: this.catId // 主商品catId
          })
        }
      }
      if (this.scene === 'cybermonday') {
        const path = this.$route.path
        if (path.includes('/black-friday-cyber-monday-influencer-selected')) {
          this.setOrderSourceFlagWithGoodsId('2023_black_friday_cyber_monday_influencer', item.goodsId)
        } else if (path.includes('/black-friday-cyber-monday')) {
          this.setOrderSourceFlagWithGoodsId('2023_black_friday_cyber_monday', item.goodsId)
        }
        return
      }
      if (_module === 'order_success_you_may_also_like') {
        this.setOrderSourceFlag(_module, true)
      } else {
        this.setModuleCookie(_module, item.goodsId)
      }
    },
    showQuickShopDialog(params) {
      this.$emit('quickShop', params)
    },
    getViewParams(ec, index, item, el = null) {
      if (this.scene === 'cybermonday') {
        return {
          common: {
            ec: 'product module',
            el,
            msg: JSON.stringify({
              goodsId: item.goodsId
            })
          }
        }
      }
      if (this.scene === 'barbie') {
        return {
          common: [
            {
              ec,
              el,
              msg: JSON.stringify({
                goodsId: item.goodsId
              })
            },
            {
              ec,
              el: `item${index + 1}`,
              msg: JSON.stringify({
                goodsId: item.goodsId
              })
            }
          ]
        }
      }
      // designinthiscolorandfabric  需要特殊处理下，click打点多了第几屏点击数
      if (ec === 'designinthiscolorandfabric') {
        const commonParams = [
          {
            ec,
            el: this.isMob ? `mobgoods${index + 1}` : `goods${index + 1}`,
            index: index + 1,
            goodsId: item.goodsId,
            color: item.colorReal,
            cat_id: item.catId,
            from_cat_id: this.catId // 主商品catId
          }
        ]
        const itemsParams = {
          ec,
          el: this.isMob ? `mobitems${this.currentSnapIndex + 1}` : `items${this.currentSnapIndex + 1}`,
          goodsId: item.goodsId,
          color: item.colorReal,
          cat_id: item.catId,
          from_cat_id: this.catId // 主商品catId
        }
        return {
          view: commonParams,
          click: commonParams.concat(itemsParams)
        }
      }
      if (ec) {
        let el = `goods${index + 1}`
        let param2 = null
        if (ec === 'ordersuccess' && this.moduleKey === 'youmayalsolike') {
          el = 'youmayalsolike'
          param2 = this.versionObj.checkoutSuccessBannerAbtest // 订单完成页新增banner入口abtest
        }
        return {
          common: {
            ec,
            el,
            msg: JSON.stringify({
              index: index + 1,
              goodsId: item.goodsId,
              color: item.colorReal,
              cat_id: item.catId,
              cat_name: item.catName,
              from_cat_id: this.catId // 主商品catId
            }),
            param2
          }
        }
      }
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.product-module-container {
  background-color: #fff;
  margin: 60px auto;
  .module-title {
    padding-bottom: 5px;
    margin-bottom: 20px;
    box-shadow: 0 1px 0 var(--color-121212);
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-121212);
    text-transform: uppercase;
  }
  /deep/ .quick-shop {
    top: 50%;
    left: 50%;
    transform: translate(-50%);
  }
}
.view-more-block {
  height: auto;
  .view-more {
    background-color: var(--color-f9f9f9);
    height: calc(100% - 40px);
    align-items: center;
    justify-content: center;
    display: flex;
    .view-more-text {
      text-transform: uppercase;
      border-bottom: 2px solid var(--color-121212);
      padding-bottom: 5px;
      font-size: 14px;
      color: var(--color-121212);
    }
  }
}
</style>
