<template>
  <div>
    <div id="you-look-for" v-track.view="{ common: getBiParams() }" class="swiper-father">
      <product-swiper
        v-if="suggestProdList.length > 0"
        :prodList="suggestProdList"
        :nextEl="'mp-swiper-button-next'"
        :prevEl="'mp-swiper-button-prev'"
      >
        <div ref="MPSwiper" v-swiper:MPSwiper="swiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div
              v-for="(item, index) in suggestProdList"
              :title="item.shownGoodsName"
              :key="index"
              @click="seeItem(index, item)"
              data-datalayer-category="MostPopular_Click"
              data-datalayer-label="MostPopular_Click"
              class="swiper-slide need_datalayer goods-item"
            >
              <product-swiper-item :item="item" :index="index" :from="from"></product-swiper-item>
            </div>
          </div>
        </div>
      </product-swiper>
    </div>
  </div>
</template>
<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
let vm = null
export default {
  name: 'YoulookFor',
  components: {
    // ForItem,
    ProductSwiperItem,
    ProductSwiper
  },
  props: {
    suggestProdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      you_look_for: true,
      // 记录已经打的点 前四个打在首屏
      biViewsIndex: [0, 1, 2, 3],
      swiperOption: {
        slidesPerView: 8,
        slidesPerGroup: 8,
        spaceBetween: 20,
        simulateTouch: false,
        loop: false,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        },
        on: {
          slideChangeTransitionEnd: () => {
            if (vm.MPSwiper) {
              const index = this.realIndex
              const biArr = []
              // +4 => 没屏幕显示4个
              for (let i = index; i < vm.suggestProdList.length && i < index + 4; i++) {
                if (vm.biViewsIndex.includes(i)) continue
                vm.biViewsIndex.push(i)
                const name = vm.suggestProdList[i].shownGoodsName
                const bp = {
                  ec: 'search',
                  el: 'noresultslistpage',
                  ea: 'view',
                  msg: JSON.stringify({
                    name,
                    cat_id: vm.catId,
                    category_ids: vm.catIds,
                    cat_name: vm.seoCatName || vm.catName,
                    dress_type: vm.dressType
                  })
                }
                biArr.push(bp)
              }
              vm.buryPoint(vm, 'events', biArr)
            }
          }
        },
        breakpoints: {
          1500: {
            slidesPerView: 6,
            slidesPerGroup: 6
          },
          1920: {
            slidesPerView: 8,
            slidesPerGroup: 8
          }
        }
      },
      from: 'youLookFor'
    }
  },
  computed: {
    lookForList() {
      return this.setParting(this.suggestProdList, 4)
    }
  },
  watch: {
    suggestProdList: {
      handler(val) {
        if (this.suggestProdList && this.suggestProdList.length) {
          const gaParams = this.getGAItemListParams(this.suggestProdList, null, 'view', this.from)
          this.setGA4DataLayer(gaParams)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    vm = this
  },
  mounted() {
    this.scrollDom()
  },
  methods: {
    // 轮播内部模块可配置
    setParting(array, subGroupLength) {
      let index = 0
      const newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
      }
      return newArray
    },
    getOffset(elem) {
      const docElem = document.documentElement
      const box = elem.getBoundingClientRect()
      return {
        top: box.top + docElem.scrollTop
      }
    },
    scrollDom() {
      const _this = this
      window.addEventListener('scroll', function() {
        const ele = document.getElementById('you-look-for')
        if (!ele) return false
        const p = _this.getOffset(ele).top
        const docTop = document.documentElement.scrollTop
        const broHight = document.body.offsetHeight
        if (p >= docTop && p < docTop + broHight) {
          if (_this.you_look_for) {
            _this.setDataLayer({
              category: 'YouMayLookfor',
              action: 'view',
              label: 'YouMayLookfor_NoResult_View',
              value: _this.suggestProdList.length
            })
            _this.you_look_for = false
          }
        }
      })
    },
    seeItem(i, good) {
      this.setDataLayer({
        category: 'YouMayLookfor',
        action: 'Click',
        label: 'YouMayLookfor_NoResult_Click',
        value: i + 1
      })
      this.setModuleCookie('YouMayLookfor')
      const name = good.shownGoodsName
      const biArr = []
      const bp = {
        ec: 'search',
        el: 'noresultslistpage',
        ea: 'click',
        msg: JSON.stringify({
          name,
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName || this.catName,
          dress_type: this.dressType
        })
      }
      biArr.push(bp)
      this.buryPoint(this, 'events', biArr)

      // 14451 需求打点 购物车页面的you may also like楼层点击数
      let el = 'youmaylookforitem'
      const dressType = this.$route.query.dress_type
      if (dressType === 'sample') {
        el = 'samplemostpopularitem'
      } else if (dressType === 'outlet') {
        el = 'readytoshipmostpopularitem'
      }
      this.setPoint('searchnoresult', el, 'click', {
        index: i,
        goodsId: good.goodsId,
        color: good.colorReal,
        cat_id: good.catId
      })
    },
    getBiParams() {
      if (process.server) return
      let el = 'youmaylookforitem'
      const dressType = this.$route.query.dress_type
      if (dressType === 'sample') {
        el = 'samplemostpopularitem'
      } else if (dressType === 'outlet') {
        el = 'readytoshipmostpopularitem'
      }
      return {
        ec: 'searchnoresult',
        el
      }
    }
  }
}
</script>

<style lang="less">
.swiper-father {
  width: 100%;
  position: relative;
  margin: 22px 0 43px;
  text-align: center;
  // .goods-img {
  //   max-width: 179px !important;
  // }
  .prev-arraw,
  .next-arraw {
    display: block;
    cursor: pointer;
    background-image: none;
    width: auto;
    height: auto;
    &.swiper-button-disabled {
      cursor: default;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
