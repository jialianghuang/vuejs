<template>
  <div
    id="try_before_you_buy_block"
    v-if="baseInfo.dressType == 'sample'"
    :class="{ show_container: sampleDetailShow }"
    class="try_before_you_buy_block"
  >
    <div @click="toggleSampleDetail" class="block_title">
      <span>{{ nl('page_sample_try_description') }}</span>
      <i></i>
    </div>
    <div v-show="sampleDetailShow" class="block_container">
      <!-- AZWEB-21718 -->
      <p v-if="baseInfo.bundlePromotionInfo && baseInfo.bundlePromotionInfo.bundleDes">
        1. <span v-html="baseInfo.bundlePromotionInfo.bundleDes"></span>
      </p>
      <p v-else>
        1.{{ nl('page_sample_try_note1_p1') }}
        <span>{{ baseInfo.sampleCount }}</span>
        {{ nl('page_sample_try_note1_p2') }}
        <span>{{ baseInfo.shopPriceDisplay }}</span
        >&nbsp;{{ nl('page_sample_try_note1_p3') }}
      </p>
      <p>2. <span v-html="nl('page_sample_try_note2')"></span></p>
      <p>3. <span v-html="nl('page_sample_try_note3')"></span></p>
      <!--AZWEB-20511 kk样衣买断折扣文案 -->
      <p v-if="baseInfo.brandId == 16 && baseInfo.dressType == 'sample'">4. <span v-html="nl('page_sample_try_note5')"></span></p>
      <template v-else>
        <p>4. <span v-html="nl('page_sample_try_note_add')"></span></p>
        {{ nl('page_sample_try_note4_p1') }}
        <a
          :href="sampleUrl + countryLinkSource"
          @click="setPoint('faq', 'click')"
          target="_blank"
          style="color:#666; text-decoration: underline"
          >{{ nl('page_js_faq') }}</a
        >
        {{ nl('page_sample_try_note4_p2') }}
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TryBeforeYouBuy',
  languageKeys: [
    'page_sample_try',
    ...new Array(3).fill().map((v, i) => 'page_sample_try_note1_p' + (i + 1)),
    ...new Array(2).fill().map((v, i) => 'page_sample_try_note4_p' + (i + 1)),
    'page_sample_try_note2',
    'page_sample_try_note3',
    'page_js_faq',
    'page_sample_try_description',
    'page_sample_try_note_add',
    'page_sample_try_note5'
  ],
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      sampleDetailShow: true
    }
  },
  computed: {
    sampleUrl() {
      return this.getSupportUrl('/sections/200806445-Sample-Program', '/articles/8076722')
    }
  },
  mounted() {
    this.setPoint('tips', 'view')
  },
  methods: {
    setPoint(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'sampletrybeforeyoubuy',
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    toggleSampleDetail() {
      this.setPoint('tips', 'click')
      this.sampleDetailShow = !this.sampleDetailShow
    }
  }
}
</script>

<style lang="less" scoped>
.try_before_you_buy_block {
  .block_title {
    margin: 8px 0 14px;
    line-height: 15px;
    font-size: 13px;
    color: var(--color-121212);
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-family: @font-family-600;
    span {
      text-decoration: underline;
      cursor: pointer;
    }
    i {
      border: none;
      border-bottom: 4px solid transparent;
      border-top: 4px solid transparent;
      border-left: 7px solid var(--color-121212);
      margin-left: 6px;
    }

    .link_span {
      width: 15px;
      height: 12px;
      margin-right: 8px;
    }
    .icon-try-before-you-buy {
      display: inline-block;
      width: 15px;
      height: 12px;
      margin-right: 8px;
      align-self: center;
    }
    #app_arrow_down {
      display: inline-block;
      vertical-align: middle;
      margin-left: 5px;
      width: 10px;
      height: 6px;
      margin-left: 4px;
    }
  }
  .block_container {
    display: none;
    font-size: 13px;
    color: var(--color-121212);
    line-height: 20px;
    margin-top: 12px;
    p,
    a {
      font-size: 13px;
      color: var(--color-121212);
      line-height: 20px;
    }
  }
  &.show_container {
    .block_title {
      i {
        display: inline-block;
        border: none;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 7px solid var(--color-121212);
      }
    }
    .block_container {
      display: block;
    }
  }
}
</style>
