<template>
  <div id="product_description" :class="blockOpen ? 'open' : 'close'" class="info-block" block-name="sample">
    <div
      @click="toggleBlock('sample')"
      :data-datalayer-label="blockLabel"
      class="block_bar_title need_datalayer"
      data-datalayer-category="PC_DetailPageRevision"
    >
      <div class="block_bar_desc">
        {{ baseInfo.catId == '10' ? nl('page_description_and_no_tips') : nl('page_description_and_tips') }}
        <span class="hide"></span>
      </div>
      <div class="switch">
        <az-icon class="switch_close" icon-class="icon-lby_add" />
        <az-icon class="switch_open" icon-class="icon-lby_subtraction" />
      </div>
    </div>

    <client-only>
      <div v-if="baseInfo.dressType != 'sample'" class="info-block-container">
        <div>
          <div class="info-block-title">{{ nl('page_goods_goods_desc_title') }}</div>
          <div class="info-block-content">
            <template v-if="isSpecialCatId(catId)">
              <WGDDecriptionBlock :description="detailsInfo.description" :baseInfo="baseInfo" />
            </template>
            <span v-else v-html="detailsInfo.description.txt"></span>
            <a
              v-if="showTurnaroundTime"
              @click="hrefPoint('turnaroundtime')"
              :href="getSupportUrl('/articles/203132789-When-will-I-receive-my-order-', '/articles/8076714')"
              target="_blank"
            >
              {{ nl('page_product_desc_turnaround_time') }}
            </a>

            <a
              v-if="showSwatch"
              @click="hrefPoint('swatchfaq')"
              :href="getSupportUrl('/articles/203896295-Ordering-Swatches', `/articles/8297499`)"
              class="email-address"
              >{{ nl('page_swatch_faq') }}</a
            >
            <template v-if="!detailsInfo.showDetails && !baseInfo.isGiftCard">
              <!-- or -->
              <div class="ask_question_position">
                <a
                  id="ask_question"
                  @click="showPopupAskQuest()"
                  :data-datalayer-label="'DetailPage' + TABLE_TEST + '_ProductDetail_Click'"
                  rel="nofollow"
                  href="javascript:void(0)"
                  class="need_datalayer"
                  data-datalayer-category="PC_DetailPageRevision"
                  >{{ nl('page_goods_ask_a_question') }}</a
                >
              </div>
            </template>
          </div>
        </div>

        <template v-if="showOrderInfo">
          <!-- 根据颜色显示 -->
          <div id="swatch_wrapper" :class="{ show: !isInNoSwatch }">
            <div class="info-block-title">{{ nl('page_v6_order_swatch') }}</div>
            <div id="order_swatch_block" class="info-block-content">
              <a
                @click="hrefPoint('colormaydifferenttips')"
                :href="
                  getSupportUrl('/articles/115005523786-How-much-can-color-vary-between-different-fabrics', '/articles/8076748-color-guide')
                "
                target="_blank"
              >
                {{ nl('page_product_note_color') }}
              </a>
              &nbsp;{{ nl('page_product_note_color_make_sure_you') }}
              <a id="swatch_link_entrance" @click="orderSwatch" rel="external">{{ nl('page_product_note_color_order_swatches') }}</a>
              {{ nl('page_product_note_color_first') }}
            </div>
          </div>

          <!-- 根据接口显示 -->
          <div id="sample_entrance_wrapper" v-if="showSampleEntrance && baseInfo.catId != 2">
            <div class="info-block-title">{{ nl('page_v6_order_sample') }}</div>
            <div id="try_on_home_block" class="info-block-content">
              <a
                id="sample_dress_entrance"
                @click="clickTryOnDresses"
                :href="countryUrl(sampleInfo.sampleUrl)"
                data-ajax="false"
                rel="enternal"
                data-datalayer-label="NewDetailPageV1.5_OrdreSample_Click"
                class="need_datalayer"
                data-datalayer-category="PC_DetailPageRevision"
                >{{ nl('page_goods_try_you_grows') }}</a
              >
              {{ nl('page_goods_at_home_for') }} {{ sampleInfo.shopPriceDisplay }}.<br />
              {{ nl('page_product_return_shipping_included') }}
            </div>
          </div>
        </template>

        <div v-if="showVideo" class="video-tip-block">
          <div class="info-block-title">{{ nl('page_write_review_tips') }}</div>
          <div
            @click="videoEvent"
            class="info-block-content pannier_gift_video need_datalayer"
            data-datalayer-category="Video"
            data-datalayer-label="Video_HPCTips_Click"
          >
            {{ nl('page_pannier_video_tips') }}
          </div>
        </div>
      </div>

      <div v-else class="info-block-container">
        <div>
          <div class="info-block-title">{{ nl('page_goods_goods_desc_title') }}</div>
          <div class="info-block-content">
            <template v-if="isSpecialCatId(catId)">
              <WGDDecriptionBlock :description="detailsInfo.description" />
            </template>
            <template v-else>{{ detailsInfo.description.txt }}</template>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WGDDecriptionBlock from './WGDDecriptionBlock'

export default {
  name: 'ProductDescriptionBlock',
  languageKeys: [
    'page_description_and_no_tips',
    'page_description_and_tips',
    'page_goods_goods_desc_title',
    'page_product_desc_turnaround_time',
    'page_swatch_faq',
    'page_v6_order_swatch',
    'page_product_note_color',
    'page_product_note_color_order_swatches',
    'page_product_note_color_make_sure_you',
    'page_product_note_color_first',
    'page_v6_order_sample',
    'page_goods_try_you_grows',
    'page_goods_at_home_for',
    'page_product_return_shipping_included',
    'page_pannier_video_tips'
  ],
  components: { WGDDecriptionBlock },
  props: {
    value: {
      type: Number,
      default: -1
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    swatchInfo: {
      type: Object,
      default() {
        return null
      }
    },
    videoInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    giftInfo: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      TABLE_TEST: 'A',
      videoStatus: false
    }
  },
  computed: {
    ...mapState({
      selectedColor: (state) => state.product.selectedColor,
      sampleInfo: (state) => state.product.sampleInfo,
      showSampleEntrance: (state) => state.product.showSampleEntrance
    }),
    ...mapGetters({
      currentBlock: 'product/getCurrentBlock'
    }),
    blockLabel() {
      const blockOpenStatus = this.blockOpen ? 'Open' : 'Close'
      return 'DetailPage' + this.TABLE_TEST + '_DescriptionTips' + blockOpenStatus + '_Click'
    },
    dressTypeInSample() {
      return ['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType)
    },
    isInNoSwatch() {
      let flag = false
      if (this.swatchInfo && this.swatchInfo.noSwatchInfo && this.swatchInfo.noSwatchInfo[this.baseInfo.catId]) {
        flag = this.swatchInfo.noSwatchInfo[this.baseInfo.catId].colors.some((element) => {
          return element == this.selectedColor.key.split('/')[0]
        })
      }
      return flag
    },
    blockOpen() {
      return this.currentBlock == 'sample'
    },
    showOrderInfo() {
      const isTrue =
        this.baseInfo.hasBeforeYouBuy &&
        !this.baseInfo.isComingSoon &&
        !this.dressTypeInSample &&
        this.baseInfo.isDress &&
        this.baseInfo.brandId != 12
      return isTrue
    },
    showOrderInfoAndSample() {
      const isTrue = this.showOrderInfo && this.showSampleEntrance
      return isTrue
    },
    showVideo() {
      const isTrue = this.giftInfo && this.giftInfo.pannier && this.giftInfo.pannier.videoSource
      return isTrue
    },
    showSwatch() {
      const isTrue = this.baseInfo.isSwatch
      return isTrue
    },
    showTurnaroundTime() {
      const isTrue = this.baseInfo.goodsId == 1000166
      return isTrue
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const elePD = document.getElementById('product_description')
      if (!elePD) return
      const screenHeight = window.screen.height
      const eleBottom = elePD.getBoundingClientRect().bottom
      if (eleBottom < screenHeight) {
        this.setPoint('entrance', 'view')
        window.removeEventListener('scroll', this.handleScroll)
      }
    },
    setPoints(params) {
      this.buryPoint(this, 'events', params)
    },
    setPoint(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'description&tips',
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType,
          cat_id: this.baseInfo.catId
        })
      })
    },
    hrefPoint(param) {
      this.setPoint(param, 'click')
    },
    point() {
      if (this.showOrderInfo) {
        const params = [
          {
            ec: 'description&tips',
            el: 'colormaydifferenttips',
            ea: 'view',
            msg: JSON.stringify({
              goodsId: this.baseInfo.goodsId,
              cat_name: this.baseInfo.catName,
              dress_type: this.baseInfo.dressType || this.dressType
            })
          },
          {
            ec: 'description&tips',
            el: 'orderswatches',
            ea: 'view',
            msg: JSON.stringify({
              goodsId: this.baseInfo.goodsId,
              cat_name: this.baseInfo.catName,
              dress_type: this.baseInfo.dressType || this.dressType
            })
          }
        ]
        this.setPoints(params)
      }
      if (this.showOrderInfoAndSample) {
        this.setPoint('tryondresses', 'view')
      }
      if (this.showVideo) {
        this.setPoint('howtopaceacrinoline', 'view')
      }
      if (this.showSwatch) {
        this.setPoint('swatchfaq', 'view')
      }
      if (this.showTurnaroundTime) {
        this.setPoint('turnaroundtime', 'view')
      }
    },
    toggleBlock(val) {
      this.setPoint('entrance', 'click')
      if (this.blockOpen) {
        this.$store.commit('product/setCurrentBlock', '')
      } else {
        this.$store.commit('product/setCurrentBlock', val)
        this.point()
      }
    },
    videoEvent() {
      this.setPoint('howtopaceacrinoline', 'click')
      this.$store.commit('product/setPannierVideoStatus', true)
      const ele = document.getElementById('pannierVideo')
      if (ele) {
        ele
          .play()
          .then(() => {})
          .catch((e) => {
            console.log(e)
          })
      }
    },
    orderSwatch() {
      this.hrefPoint('orderswatches')
      location.href = this.countryUrl('/swatches?from=image')
    },
    showPopupAskQuest() {
      this.$store.commit('product/setPopupAskQuestShow', true)
    },
    // 点击description&tips中的try on dresses，添加订单追踪
    clickTryOnDresses() {
      this.hrefPoint('tryondresses')
      // 订单追踪 tryongowns，订单层面的追踪，不需要到商品，如果需要到商品，使用setOrderSourceFlagWithGoodsId
      this.setOrderSourceFlag('tryongowns', true)
    }
  }
}
</script>

<style lang="less" scoped>
#product_description {
  #sample_dress_entrance {
    // color: @theme;
    text-transform: none;
  }
  .pannier_gift_video {
    text-decoration: underline;
    cursor: pointer;
  }
  #swatch_wrapper {
    display: none;
    &.show {
      display: block;
    }
  }
  #swatch_link_entrance {
    cursor: pointer;
  }
}
</style>
