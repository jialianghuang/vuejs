<template>
  <div>
    <div class="common-module__title">
      <h3 :class="['mix-title', { wgd: isSpecialCatId(catId) }]">
        <span
          @click="changeMixTitle(0)"
          :class="{ checked: currentMixId == 0, sigle: baseInfo.isComingSoon }"
          v-if="from != 'giftcardProduct' && !baseInfo.isComingSoon"
          class="page-product-item-title"
        >
          {{ nl('page_goods_reviews') }}
          {{ reviewInfo.pageInfo && reviewInfo.pageInfo.totalCount ? ` (${reviewInfo.pageInfo.totalCount})` : '' }}
        </span>
        <!-- jira 15046 隐藏questions -->
        <span
          v-if="!isSpecialCatId(catId)"
          @click="changeMixTitle(1)"
          :class="{ checked: currentMixId == 1, sigle: baseInfo.isComingSoon }"
          class="page-product-item-title"
        >
          {{ nl('page_goods_questions') }}
          {{ questionInfo.pageInfo && questionInfo.pageInfo.totalCount ? ` (${questionInfo.pageInfo.totalCount})` : '' }}
        </span>
      </h3>
      <!-- gift card详情页  没有这个功能 -->
      <a v-if="!isSpecialCatId(catId) && from != 'giftcardProduct'" class="az_v_directive_track"
        ><span @click="showPopupAskQuest" class="common-module__more">{{ nl('page_goods_ask_a_question') }} &gt;</span></a
      >
    </div>
    <div>
      <product-reviews
        v-if="!baseInfo.isComingSoon && from != 'giftcardProduct'"
        v-show="currentMixId == 0"
        :baseInfo="{
          ...baseInfo,
          plus: plusSizeView || selectedSize.isPlusSize || false
        }"
        :reviewInfo="reviewInfo"
        :size="size"
        :customPhotoList="customPhotoList"
        @reviewsChange="reviewsChange"
      ></product-reviews>
      <product-qa-block
        v-show="currentMixId == 1"
        :baseInfo="baseInfo"
        :questionInfo="questionInfo"
        @questionsChange="questionsChange"
        :from="from"
      ></product-qa-block>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ProductReviews from '@/components/product/ProductReviews'
import productQaBlock from '@/components/product/ProductInfoDetailBlock/ProductQaBlock'

export default {
  name: 'ReviewsQaMix',
  languageKeys: [
    'page_goods_reviews',
    'page_goods_questions',
    'page_goods_ask_a_question',
    ...ProductReviews.languageKeys,
    ...productQaBlock.languageKeys
  ],
  components: {
    ProductReviews,
    productQaBlock
  },
  props: {
    questionInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    reviewInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: Array,
      default() {
        return []
      }
    },
    customPhotoList: {
      type: Array,
      default() {
        return []
      }
    },
    from: {
      // 目前如果是giftcard 详情页，只展示 product-qa-block 模块
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentMixId: 0
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      selectedSize: (state) => state.product.selectedSize,
      plusSizeView: (state) => state.product.plusSizeView
    })
  },
  created() {
    if (this.from == 'giftcardProduct') {
      this.currentMixId = 1
    }
    if (this.baseInfo.isComingSoon) {
      this.currentMixId = 1
    }
  },
  methods: {
    changeMixTitle(index) {
      this.currentMixId = index
    },
    reviewsChange(val) {
      this.$emit('reviewsChange', val)
    },
    questionsChange(val) {
      this.$emit('questionsChange', val)
    },
    showPopupAskQuest() {
      this.$store.commit('product/setPopupAskQuestShow', true)
      this.buryPoint(this, 'event', {
        ec: 'customerquestions&answers',
        el: 'askaquesiton',
        ea: 'click',
        msg: JSON.stringify({ goodsId: this.baseInfo.goodsId, cat_name: this.baseInfo.catName, cat_id: this.baseInfo.catId })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.common-module__title {
  position: relative;
  .mix-title {
    text-align: left;
    padding-bottom: 6px;
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
    margin-bottom: 22px;
    box-shadow: 0 1px 0 var(--color-121212);
    .page-product-item-title {
      position: relative;
      padding-bottom: 6px;
      cursor: pointer;
      color: #ccc;
      &:nth-child(1) {
        margin-right: 30px;
      }
      &.checked {
        color: var(--color-121212);
        &::after {
          display: inline-block;
          position: absolute;
          content: '';
          background-color: var(--color-121212);
          width: 100%;
          height: 5px;
          left: 0;
          bottom: 0;
          transform: translateY(50%);
        }
      }
      &.sigle {
        &::after {
          display: none;
        }
      }
    }
  }
  .common-module__more {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    text-transform: uppercase;
    cursor: pointer;
  }
}
</style>
