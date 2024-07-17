<template>
  <div id="cat-prod-list" :class="[viewSwitch, resetDisplay || resetSubDisplay ? 'flex-box' : 'grid-box']">
    <product-list-item
      v-for="(product, index) in showList"
      :key="product.goodsId + '-' + index"
      :productIndex="index"
      :item="product"
      :page="page"
      :show-limited-time-tag="true"
      :addSuffix="true"
      :scene="scene"
      v-bind="getPluginParams(product)"
      @quickShop="quickShopClick"
      @sodViewChange="sodViewChange"
      @reset-display="handleResetDisplay"
      @notify-me="notifyMe"
    ></product-list-item>
    <client-only v-if="componentReady">
      <product-list-item
        v-for="(product, index) in subList"
        :key="product.goodsId + '-2-' + index"
        :productIndex="index + 15"
        :item="product"
        :page="page"
        :show-limited-time-tag="true"
        :addSuffix="true"
        :scene="scene"
        v-bind="getPluginParams(product)"
        @quickShop="quickShopClick"
        @sodViewChange="sodViewChange"
        @reset-display="handleResetDisplay"
        @notify-me="notifyMe"
      ></product-list-item>
    </client-only>
    <a
      v-if="scene === 'holidayBride' && showViewMore"
      v-track.view.click="{ common: { ec: 'charityproduct', el: 'view more' } }"
      :href="countryUrl('/all/wedding-dresses?subsite=bridal')"
      class="view-more goods-item"
      target="_blank"
    >
      <span class="view-more-text">{{ nl('page_common_view_more') }}</span>
    </a>
    <div
      :class="[
        { 'catpl-prod-270x370': viewSwitch == 'smaller' },
        { 'catpl-prod-360x498': viewSwitch == 'larger' && sodView != 'petite_plus' },
        { 'catpl-prod-petite-plus-270x370': sodView == 'petite_plus' }
      ]"
      v-for="key in [1, 2, 3, 4, 5]"
      :key="key"
      class="goods-item"
    ></div>
  </div>
</template>

<script>
import ProductListItem from '@/components/list/ProductListItem'
import { mapState } from 'vuex'
export default {
  name: 'ProductList',
  languageKeys: [...ProductListItem.languageKeys],
  components: {
    ProductListItem
  },
  props: {
    page: {
      type: Number,
      default: 0
    },
    isProductsSplit: {
      type: Boolean,
      default: false
    },
    resetDisplay: {
      type: Boolean,
      default: false
    },
    // 组件出现的场景
    scene: {
      type: String,
      default: ''
    },
    // 是否最后一项展示view more
    showViewMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      TABLE_TEST: 'A',
      indexList: [],
      // 已经打过点的列
      viewArr: [],
      resetSubDisplay: false,
      componentReady: false // 页面是否滚动，滚动的话，渲染客户端的45个商品
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      sodView: (state) => state.list.sodView,
      prodList: (state) => state.list.prodList
    }),
    // 是否是伴娘裙
    isBridesmaids() {
      return [7, 9, 10, 45, 139, 158].includes(this.catId)
    },
    showList() {
      return this.isProductsSplit ? this.prodList.slice(0, 15) : this.prodList
    },
    subList() {
      return this.isProductsSplit && !this.is_chrome_lighthouse ? this.prodList.slice(15, this.prodList.length) : []
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    // list 挂载打点
    const msg = {
      cat_id: this.catId,
      category_ids: this.catIds,
      cat_name: this.seoCatName,
      dress_type: this.dressType,
      cdn_prvd: this.catIds.length == 1 && this.catIds[0] == 9 ? this.cdnPrvd(this.catIds[0]) : -1
    }
    this.buryPoint(this, 'event', {
      ec: 'listpage',
      el: 'listpage',
      ea: 'view',
      param2: this.versionObj.listWithCodeAbtest,
      msg
    })
    // list 收藏按钮挂载打点
    this.buryPoint(this, 'event', {
      ec: 'lovebutton',
      el: 'lovebutton',
      ea: 'view',
      msg
    })
    // 列表打点
    if (this.prodList && this.prodList.length) {
      this.setDataLayer({
        category: 'ListpageRevision',
        action: 'view',
        label: 'PageVersion' + this.TABLE_TEST + '_View'
      })
      if (this.isBridesmaids) {
        this.setDataLayer({
          category: 'ListpageRevision',
          action: 'view',
          label: 'BridesmaidsListPage' + this.TABLE_TEST + '_1L_View'
        })
      } else if (this.catId === 2) {
        this.setDataLayer({
          category: 'ListpageRevision',
          action: 'view',
          label: 'BridesListPage' + this.TABLE_TEST + '_1L_View'
        })
      }
    }
    // this.bindElmSVD()
    // this.dressesListDot()
    // const self = this
    // window.addEventListener('scroll', self.throttle(self.handleScroll, 500))
    // this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 处理页面滚动监听
    handleScroll() {
      this.componentReady = true
    },
    throttle(fun, wait) {
      const self = this
      let previous = 0
      return function() {
        const now = Date.now()
        if (now - previous > wait) {
          fun.call(self)
          previous = now
        }
      }
    },
    // dress打点
    // dressesListDot() {
    //   switch (this.$cookie.getCookie('SOD_VIEW_NEW')) {
    //     case 'petite':
    //       this.scrollDressOdd()
    //       break
    //     case 'plus':
    //       this.scrollDressOdd()
    //       break
    //     case 'petite_plus':
    //       this.scrollDress()
    //       break
    //   }
    // },
    // scrollDressOdd() {
    // const _this = this
    // window.addEventListener('scroll', function() {
    // const ArrList = Object.keys(document.getElementsByClassName('goods-item'))
    // ArrList.map((item, index) => {
    // const ele = document.getElementsByClassName('goods-item')[index]
    // if (!ele) return false
    // const p = _this.getOffset(ele).top
    // const docTop = document.documentElement.scrollTop
    // const broHight = document.body.offsetHeight
    // if (p >= docTop && p < docTop + broHight) {
    // index = index + 1
    // if (!_this.indexList.includes(index)) {
    //   _this.indexList.push(index)
    //   if (index % 2 !== 0) {
    //     _this.setDataLayer({
    //       category: 'ProductListBounce',
    //       action: 'view',
    //       label: `ProductListLine=${Math.ceil(index / 2)}_View`
    //     })
    //   }
    // }
    // }
    // })
    // })
    // },
    // scrollDress() {
    //   const _this = this
    //   window.addEventListener('scroll', function() {
    //     const ArrList = Object.keys(document.getElementsByClassName('goods-item'))
    //     ArrList.map((item, index) => {
    //       const ele = document.getElementsByClassName('goods-item')[index]
    //       if (!ele) return false
    //       const p = _this.getOffset(ele).top
    //       const docTop = document.documentElement.scrollTop
    //       const broHight = document.body.offsetHeight
    //       if (p >= docTop && p < docTop + broHight) {
    //         index = index + 1
    //         if (!_this.indexList.includes(index)) {
    //           _this.indexList.push(index)
    //           _this.setDataLayer({
    //             category: 'ProductListBounce',
    //             action: 'view',
    //             label: `ProductListLine=${index}_View`
    //           })
    //         }
    //       }
    //     })
    //   })
    // },
    // getOffset(elem) {
    //   const docElem = document.documentElement
    //   const box = elem.getBoundingClientRect()
    //   return {
    //     top: box.top + docElem.scrollTop,
    //     left: box.left + docElem.scrollLeft
    //   }
    // },
    // sod列表兜底图曝光打点
    // bindElmSVD() {
    //   // bind Element Viewed OnScoll DataLayer
    //   if (this.sodView == 'petite') {
    //     return false
    //   }
    //   // const that = this
    //   // const iv = ''
    //   const elementList = {}
    //   let eventLabel = ''
    //   if (this.sodView == 'petite_plus') {
    //     eventLabel = 'Dress_ PlusSizePhotoComingSoon'
    //   } else {
    //     eventLabel = 'Dress_PlusSizeAvailable'
    //   }
    //   for (let i = 0; i < this.prodList.length; i++) {
    //     if (!this.prodList[i].specialPlus) {
    //       const item = {
    //         elementId: '.plusSizePhotoComingSoon_' + this.prodList[i].goodsStyleId,
    //         triggerPercentage: 0.5,
    //         currentStatus: false,
    //         eventCategory: 'Dress',
    //         eventLabel
    //       }
    //       elementList[i] = item
    //     }
    //   }
    // 开始的时候检查view状态并打点
    // for (const p in elementList) {
    //   if (that.checkModuleVisible(elementList[p].elementId, elementList[p].triggerPercentage)) {
    //     const eventCategory = elementList[p].eventCategory + iv + '_View'
    //     const eventLabel = elementList[p].eventLabel + iv + '_View'
    //     // event_point: 因第一次进入 曝光而打点
    //     that.setDataLayer({
    //       action: 'view',
    //       category: eventCategory,
    //       label: eventLabel
    //     })
    //     elementList[p].currentStatus = true
    //   }
    // }
    // 滚动响应检查可视
    // window.addEventListener('scroll', function() {
    //   for (const p in elementList) {
    //     if (that.checkModuleVisible(elementList[p].elementId, elementList[p].triggerPercentage)) {
    //       if (elementList[p].currentStatus === false) {
    //         const eventCategory = elementList[p].eventCategory + iv + '_View'
    //         const eventLabel = elementList[p].eventLabel + iv + '_View'
    //         // event_point: 滚动而出现打点
    //         that.setDataLayer({
    //           action: 'view',
    //           category: eventCategory,
    //           label: eventLabel
    //         })
    //         elementList[p].currentStatus = true
    //       }
    //     } else {
    //       elementList[p].currentStatus = false
    //     }
    //   }
    // })
    // },
    // 显示quick shop事件
    quickShopClick(param) {
      this.$emit('quickShop', param)
    },
    sodViewChange(sodView) {
      this.$emit('sodViewChange', sodView)
    },
    handleResetDisplay(bol) {
      this.resetSubDisplay = bol
    },
    notifyMe(info) {
      this.$emit('notify-me', info)
    },
    getPluginParams(product) {
      return {
        'data-goods-id': product.goodsId,
        'data-color-id': product.color,
        'data-goods-index': product.indexNo,
        'data-cat-id': product.catId,
        'data-dress-type': product.dressType,
        'data-country-code': this.country,
        'data-category': this.$store.state.list.apiCatName
      }
    }
  }
}
</script>

<style lang="less" scoped>
#cat-prod-list {
  width: 100%;
  line-height: 1.8;
  clear: both;
  &.grid-box {
    display: grid;
  }
  &.flex-box {
    display: flex;
    flex-wrap: wrap;
  }
  &.smaller {
    &.grid-box {
      grid-template-columns: repeat(5, 1fr);
      column-gap: 15px;
      .goods-item {
        width: 100% !important;
      }
    }
    &.flex-box {
      .goods-item {
        margin-right: 15px;
        &:nth-child(1) {
          margin-right: 30px;
        }
        &:nth-child(5n - 1) {
          margin-right: 0;
        }
      }
    }
  }
  &.larger {
    &.grid-box {
      grid-template-columns: repeat(4, 1fr);
      column-gap: 15px;
      .goods-item {
        width: 100% !important;
      }
    }
    &.flex-box {
      .goods-item {
        margin-right: 15px;
        &:nth-child(1) {
          margin-right: 30px;
        }
        &:nth-child(4n - 1) {
          margin-right: 0;
        }
      }
    }
  }
  @media screen and (max-width: 1600px) {
    &.smaller {
      &.grid-box {
        grid-template-columns: repeat(4, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(4n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
          &:nth-child(4) {
            margin-right: 15px;
          }
        }
      }
    }
    &.larger {
      &.grid-box {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(3n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1024px) {
    &.smaller {
      &.grid-box {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(3n - 1) {
            margin-right: 0;
          }
          &:nth-child(2) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
    &.larger {
      &.grid-box {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(2n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
          &:nth-child(2) {
            margin-right: 15px;
          }
        }
      }
    }
  }
  .view-more {
    background-color: var(--color-f9f9f9);
    height: 90%;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    cursor: pointer;
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
