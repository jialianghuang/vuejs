<template>
  <div :class="{ 'comming-soon': isComingSoon }" class="cat-empty-prod-list">
    <div v-if="markStr === 'list' && emptyInfo.noResultTips1 && emptyInfo.noResultTips2" class="list-result-info">
      <div v-html="nl(emptyInfo.noResultTips1)" class="tips1"></div>
      <div v-html="nl(emptyInfo.noResultTips2, null, { removeAllFilterUrl: removeAllFilterUrl })" class="tips2"></div>
      <div class="search-box">
        <input
          ref="searchInput"
          v-model="searchQ"
          :placeholder="nl('page_list_no_result_placeholder')"
          type="text"
          class="input-box"
          autocomplete="off"
        />
        <button
          v-track.viewOnce.click="{
            id: 'removeallfilters-search',
            common: {
              ec: 'removeallfilters',
              el: 'search'
            }
          }"
          @click="handleSearch"
          class="search-btn"
        >
          {{ nl('page_common_search') }}
        </button>
      </div>
    </div>
    <div v-else-if="emptyInfo.text" class="result-info">
      <div class="empty_text">
        <p v-html="emptyInfo.text"></p>
      </div>
      <div v-if="markStr == 'holidayShop'">
        <div @click="holidayShopClick" class="holidayShop_btn" role="button">{{ emptyInfo.btnText }}</div>
      </div>
      <button v-else @click="clearSession" class="btn empty_btn">{{ emptyInfo.btnText }}</button>
    </div>
    <template v-if="prodList.length > 0">
      <h3 :class="{ 'result-title': emptyInfo.text }" class="bestSeller-title">
        {{ bestSellerTitle }}
      </h3>
      <div class="most-popular">
        <div class="item-list">
          <product-swiper
            v-if="prodList.length > 0"
            :prodList="prodList"
            :nextEl="'mp-swiper-button-next'"
            :prevEl="'mp-swiper-button-prev'"
          >
            <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
              <div class="swiper-wrapper product-swiper-viewport">
                <div
                  v-for="(item, index) in prodList"
                  :title="item.shownGoodsName"
                  :key="index"
                  data-datalayer-category="MostPopular_Click"
                  data-datalayer-label="MostPopular_Click"
                  class="swiper-slide need_datalayer goods-item empty-recommend-box"
                >
                  <product-swiper-item :item="item" :show-limited-time-tag="true" :addSuffix="true" :index="index"></product-swiper-item>
                </div>
                <div
                  id="empty-sale-shop-all"
                  v-show="emptyInfo.shopAll"
                  :data-datalayer-label="'DetailPage' + TABLE_TEST + '_MostPopular_Click'"
                  class="goods-item swiper-slide need_datalayer"
                  data-datalayer-category="PC_DetailPageRevision"
                >
                  <a :href="countryUrl(emptyInfo.shopAll)" class="goods-item-a">
                    {{ nl('page_header_sale_shop_all') }}
                  </a>
                </div>
              </div>
            </div>
          </product-swiper>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import ProductSwiper from '@/components/product/ProductSwiper'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import { mapState } from 'vuex'

let that = null
export default {
  name: 'EmptyProductList',
  languageKeys: [
    'page_list_no_result_placeholder',
    'page_common_search',
    'page_header_sale_shop_all',
    'page_empty_text1',
    'page_empty_text2',
    'page_empty_text3',
    'page_empty_text4',
    'page_empty_text5',
    ...ProductSwiperItem.languageKeys
  ],
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    emptyInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    markStr: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      TABLE_TEST: 'A',
      MPSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 20,
        slidesPerGroup: 6,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        },
        on: {
          slideNextTransitionStart() {
            that.getShopAll('.empty-recommend-box .img-box img')
          }
        }
      },
      searchQ: ''
    }
  },
  computed: {
    ...mapState({
      prodList: (state) => state.list.prodList
    }),
    bestSellerTitle() {
      if (this.dressType == 'sample') {
        return this.nl('page_empty_text1')
      } else if (this.dressType == 'clearance') {
        return this.nl('page_empty_text2')
      } else if (this.dressType == 'outlet') {
        return this.nl('page_empty_text3')
      } else if (this.isComingSoon) {
        return this.nl('page_empty_text4')
      } else {
        return this.nl('page_empty_text5')
      }
    },
    removeAllFilterUrl() {
      return this.emptyInfo.removeAllFilterUrl.includes('/collection/all') ? 'javascript:void(0);' : this.emptyInfo.removeAllFilterUrl
    }
  },
  created() {
    that = this
  },
  mounted() {
    that.getShopAll('.empty-recommend-box .img-box img')
    window.addEventListener('resize', () => {
      that.getShopAll('.empty-recommend-box .img-box img')
    })
    if (document.querySelector('.list-result-info .remove-all-filter')) {
      document.querySelector('.list-result-info .remove-all-filter').addEventListener('click', () => {
        if (this.emptyInfo.removeAllFilterUrl.includes('/collection/all')) {
          document.querySelector('#filter_clear_all') && document.querySelector('#filter_clear_all').click()
        }
      })
    }
    if (document.querySelector('.result-info .remove-all-filter')) {
      // 打点，文案是多语言配置，所以根据多语言里面的类名判断
      this.setPoint('removeallfilters', 'removeallfilters', 'view')
      document.querySelector('.result-info .remove-all-filter').addEventListener('click', () => {
        this.setPoint('removeallfilters', 'removeallfilters', 'click')
      })
    }
  },
  methods: {
    holidayShopClick() {
      this.$emit('holidayShopClick')
    },
    getShopAll(selector) {
      this.$nextTick(() => {
        const sourceDom = document.querySelector(selector)
        let rect = { height: 0 }
        rect = sourceDom && sourceDom.getBoundingClientRect()
        const targetDom = document.getElementById('empty-sale-shop-all')
        targetDom && targetDom.style.setProperty('height', rect.height + 'px')
        targetDom && targetDom.style.setProperty('line-height', rect.height + 'px')
      })
    },
    clearSession() {
      sessionStorage && sessionStorage.removeItem('current_selected_nav_key')
      location.href = this.countryUrl(this.emptyInfo.continueShoppingUrl)
    },
    handleSearch() {
      window.location.href = this.countryUrl(`/search?q=${this.searchQ}`)
    }
  }
}
</script>

<style lang="less">
.cat-empty-prod-list {
  padding-top: 27px;
  clear: both;
  .holidayShop_btn {
    color: #fff;
    background-color: @theme-color;
    width: 235px;
    text-align: center;
    line-height: 50px;
    margin: 60px auto 20px;
    font-size: 14px;
    font-weight: 600;
  }
  &.comming-soon {
    .empty_text {
      margin: 60px auto 20px;
    }
    .empty_btn {
      border-color: @theme-color;
      background: @theme-color;
      color: #ffffff;
      &:hover {
        background: @theme-color;
      }
    }
    .most-popular {
      padding: 0;
      .goods-img {
        width: 179px !important;
      }
    }
  }
  .bestSeller-title {
    text-transform: uppercase;
    font-size: 24px;
    letter-spacing: 0;
    font-family: @font-family-500, sans-serif;
    font-weight: normal;
    &.result-title {
      border-top: 1px solid #ccc;
      padding-top: 20px;
    }
  }
  .empty_text {
    margin: 60px auto;
    text-align: center;
    font-size: 24px;
    width: 70%;
  }
  .empty_btn {
    color: @theme-color;
    // width: 214px;
    height: 42px;
    font-family: @font-family-600, sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    margin: auto;
    display: block;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-bottom: 80px;
    &:hover {
      background: #efefef;
    }
  }
  .most-popular {
    width: 100%;
    box-sizing: border-box;
    // max-width: 1353px;
    min-width: unset;
    margin: 22px auto 43px;
    // padding: 0 25px;
    .product-swiper-container {
      padding: 0 48px !important;
      #empty-sale-shop-all {
        width: 100%;
        // width: 191px;
        // height: 264px;
        // display: table-cell;
        // vertical-align: middle;
        background-color: #f6f6f6;
        text-align: center;
        .goods-item-a {
          font: bold 14px @font-family-500, sans-serif;
          color: var(--color-121212);
        }
      }
    }
    .title {
      color: var(--color-121212);
      text-transform: uppercase;
      letter-spacing: 0;
      font-weight: 400;
      font-family: @font-family-500, sans-serif;
      font-size: 24px;
      line-height: 24px;
      padding-bottom: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-cccccc);
      a {
        display: inline-block;
        float: right;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 400;
        font-family: @font-family-500, sans-serif;
        color: var(--color-121212);
      }
    }
    .arraw-icon {
      width: 18px;
      height: 18px;
    }
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

  .list-result-info {
    text-align: center;
    padding: 13px 0 60px;
    .tips1 {
      font-family: @font-family-600;
      margin-bottom: 10px;
      font-size: 16px;
      line-height: 22px;
    }
    .tips2 {
      margin-bottom: 25px;
      font-size: 13px;
      line-height: 18px;
    }
    /deep/ a {
      color: var(--color-121212);
      text-decoration: underline;
    }
    a {
      color: var(--color-121212);
      text-decoration: underline;
    }
    .search-box {
      font-size: 0;
      color: var(--color-121212);
      .input-box {
        width: 320px;
        height: 40px;
        box-sizing: border-box;
        border: 1px solid var(--color-121212);
        font-size: 13px;
        color: var(--color-121212);
        &:focus {
          background: #ffffff;
        }
      }
      .search-btn {
        min-width: 90px;
        height: 40px;
        background: var(--color-121212);
        color: #ffffff;
        font-size: 13px;
        padding: 0 10px;
        box-sizing: border-box;
        border: none;
      }
    }
  }
}
</style>
