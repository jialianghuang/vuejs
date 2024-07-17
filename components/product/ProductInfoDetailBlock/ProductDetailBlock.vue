<template>
  <div id="product_details" v-if="detailsInfo.showDetails" :class="blockOpen ? 'open' : 'close'" class="info-block" block-name="detail">
    <div
      @click="toggleBlock('detail')"
      :data-datalayer-label="blockLabel"
      class="block_bar_title need_datalayer"
      data-datalayer-category="PC_DetailPageRevision"
    >
      <div class="block_bar_desc">{{ nl('page_goods_product_details') }}</div>
      <div class="switch">
        <az-icon class="switch_close" icon-class="icon-lby_add" />
        <az-icon class="switch_open" icon-class="icon-lby_subtraction" />
      </div>
    </div>

    <client-only>
      <div class="info-block-container product_details_container">
        <div class="info-block-title">{{ nl('page_common_details') }}</div>
        <div :class="['info-block-content', { 'not-wgd': !isSpecialCatId(catId) }]">
          <div v-for="(detail, key) in detailsInfo.showDetails" :key="key" class="not-wgd-item">
            <span v-html="detail.value"></span>
          </div>
          <div v-if="baseInfo.showVeilHint">
            <span class="pannier_gift">
              - {{ nl('page_goods_veil_hint') }}. {{ nl('page_common_click') }}
              <a :href="countryUrl('/products/azazie-princess-wedding-veils?color=ivory')" target="_blank" class="a-link">{{
                nl('page_after_pay_here')
              }}</a>
              {{ nl('page_common_to_purchase') }}
            </span>
          </div>
        </div>

        <div v-if="baseInfo.isDifferentSize" class="product-detail-note">
          {{ nl('page_goods_show_different_info') }}
        </div>

        <!-- care -->
        <div v-if="detailsInfo.other && detailsInfo.other.careDesc">
          <div class="info-block-title">{{ nl('page_goods_care') }}</div>
          <div class="info-block-content">{{ detailsInfo.other.careDesc }}</div>
        </div>

        <div
          v-if="detailsInfo.other && detailsInfo.other.whatIsHollow"
          v-html="unescape(detailsInfo.other.whatIsHollow)"
          class="what_is_hollow_block"
        ></div>

        <!--婚纱和mbd的衣服和样衣不需要该链接-->
        <div v-if="show_sample_url" class="sample_do_u_like">
          <p @click="hrefPoint">
            {{ nl('page_sample_order_real_tip_1') }}
            <a id="sample_real_url_a" :href="countryUrl(baseInfo.goodsDefaultUrl)" target="_blank">
              {{ nl('page_sample_order_real_tip_2') }}
            </a>
          </p>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProductDetailBlock',
  languageKeys: [
    'page_goods_try_you_grows',
    'page_goods_product_details',
    'page_common_details',
    'page_goods_veil_hint',
    'page_common_click',
    'page_after_pay_here',
    'page_common_to_purchase',
    'page_goods_show_different_info',
    'page_goods_care',
    'what_is_hollow_block',
    'page_sample_order_real_tip_1',
    'page_sample_order_real_tip_2'
  ],
  props: {
    value: {
      type: Number,
      default: -1
    },
    baseInfo: {
      type: Object,
      default() {
        return []
      }
    },
    detailsInfo: {
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
      TABLE_TEST: 'A'
    }
  },
  computed: {
    ...mapGetters({
      currentBlock: 'product/getCurrentBlock'
    }),
    blockLabel() {
      const blockOpenStatus = this.blockOpen ? 'Open' : 'Close'
      return 'DetailPage' + this.TABLE_TEST + '_ProductDetail' + blockOpenStatus + '_Click'
    },
    show_sample_url() {
      // 婚纱和mbd的衣服和样衣不需要该链接
      if (![2, 8].includes(this.baseInfo.catId) && this.baseInfo.dressType == 'sample') {
        // this.setPoint('orderyoursnow', 'view')
        return true
      }
      return false
    },
    blockOpen() {
      return this.currentBlock == 'detail'
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    if (this.baseInfo.isComingSoon) {
      this.setCompletePosition()
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const elePD = document.getElementById('product_details')
      if (!elePD) return
      const screenHeight = window.screen.height
      const eleBottom = elePD.getBoundingClientRect().bottom
      if (eleBottom < screenHeight) {
        this.setPoint('productdetails', 'view')
        window.removeEventListener('scroll', this.handleScroll)
      }
    },
    setPoint(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'productdetails',
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
    hrefPoint() {
      this.setPoint('orderyoursnow', 'click')
    },
    point() {
      if (this.show_sample_url) {
        this.setPoint('orderyoursnow', 'view')
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
    showPopupPannier() {
      this.$store.commit('product/setPopupPannierShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
#product_details {
  .product_details_container {
    &.open {
      display: block;
    }
    &.close {
      display: none;
    }
    .not-wgd {
      display: flex;
      flex-wrap: wrap;
      .not-wgd-item {
        width: 50%;
        line-height: 24px;
      }
    }
    .what_is_hollow_block,
    .product-detail-note {
      font-size: 13px;
      font-family: @font-family-500, sans-serif;
      font-style: italic;
      color: rgba(102, 102, 102, 1);
      line-height: 19px;
    }
    .product-detail-note {
      padding-bottom: 5px;
    }
    p {
      font-family: @font-family-500;
      font-size: 12px;
      color: #666;
      line-height: 20px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    /deep/ .what_is_mesh_block {
      display: inline-block;
      position: relative;
      .what_is_mesh {
        color: var(--color-121212);
        text-transform: none;
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          color: @theme-color;
        }
      }
      &:hover {
        .what_is_mesh_hover {
          display: block;
        }
      }
      .what_is_mesh_hover {
        display: none;
        position: absolute;
        left: -100px;
        padding: 12px;
        border: 1px solid var(--color-cccccc);
        color: var(--color-121212);
        margin-top: 8px;
        background: #ffffff;
        text-transform: none;
        width: 295px;
        .em1,
        .em2 {
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 6px solid var(--color-cccccc);
          position: absolute;
          top: -7px;
          left: 145px;
        }
        .em2 {
          border-bottom-color: #ffffff;
          top: -5px;
        }
      }
    }
    .sample_do_u_like {
      margin-top: 15px;
      font-family: @font-family-600;
      p {
        font-family: @font-family-600;
      }
      a {
        color: @theme-color;
        text-decoration: underline;
      }
    }
    .ask_question_position {
      margin: 12px 0 20px;
      #ask_question {
        &:hover {
          color: var(--color-121212);
          cursor: pointer;
        }
      }
    }
    .a-link {
      text-decoration: underline;
      color: var(--color-121212) !important;
      font-family: @font-family-600;
    }
  }
}
</style>
