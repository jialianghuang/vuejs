<template>
  <div class="try-before-you-buy-new tbyb">
    <az-icon icon-class="icon-xxy_try_before_you_buy" class="link-icon"></az-icon>
    <a :href="countryUrl(link)" @click="hrefPoint" class="sample-try">{{ linkText }}</a>
    <div class="tips-box">
      <az-icon icon-class="icon-gwc-_question_" class="question-icon"></az-icon>
      <div class="tbyb-tips">
        <div v-html="nl('page_try_before_des')" class="tbyb-tips-main"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

/**
 * 新版try before you buy组件，限制国家和品类条件下展示
 */
export default {
  name: 'TryBeforeYouBuyNew',
  languageKeys: ['page_sample_try', 'page_common_view_product', 'page_try_before_des'],
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
    ...mapState('product', ['sampleUrl', 'selectedSize', 'needJointColorSize']),
    link() {
      if (this.baseInfo.dressType == 'dress' && this.sampleUrl) {
        const color = this.baseInfo.color || ''
        let stockSize = this.baseInfo.stockSize || ''
        // 如果stockSize不存在，判断selecedSize是否有值
        if (!stockSize && this.selectedSize.key) {
          stockSize = this.selectedSize.key
        }
        const obj = { color, size: stockSize }
        let tempUrl = this.sampleUrl // 根据sample-info接口返回的数据，如果有样衣地址，返回样衣地址
        if (tempUrl && !tempUrl.includes('javascript:') && this.needJointColorSize) {
          for (const key in obj) {
            if (obj[key] && !tempUrl.includes(key)) {
              if (tempUrl.includes('?')) {
                tempUrl = `${tempUrl}&${key}=${obj[key]}`
              } else {
                tempUrl = `${tempUrl}?${key}=${obj[key]}`
              }
            }
          }
        }
        return tempUrl
      } else {
        return this.baseInfo.goodsDefaultUrl
      }
    },
    linkText() {
      if (this.baseInfo.dressType == 'sample') {
        return this.nl('page_common_view_product')
      }
      return this.nl('page_sample_try')
    }
  },
  mounted() {
    this.setPoint('trybeforeyoubuy', 'trybeforeyoubuy', 'view')
  },
  methods: {
    setPoint(ec, el, ea) {
      this.buryPoint(this, 'event', {
        ec,
        el: ec,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType,
          cat_id: this.baseInfo.catId
        }),
        param2: this.versionObj.tryBeforeAbtest
      })
    },
    hrefPoint() {
      switch (this.linkText) {
        case this.nl('page_common_view_product'):
          this.setPoint('viewproduct', 'viewproduct', 'click')
          break
        case this.nl('page_sample_try'):
          this.setPoint('trybeforeyoubuy', 'trybeforeyoubuy', 'click')
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tbyb {
  position: relative;
  padding: 10px;
  font-size: 12px;
  line-height: 20px;
  font-family: @font-family-600;
  background: @bg-color;
  display: flex;
  align-items: center;
  margin: 15px 0px -5px;
  .sample-try {
    text-transform: uppercase;
    margin: 0px 5px 0px 12px;
    text-decoration: underline;
    color: var(--color-121212);
  }
  .link-icon {
    width: 20px;
    height: 15px;
  }
  .question-icon {
    font-size: 13px;
    cursor: pointer;
  }
  .tips-box {
    position: relative;
    &:hover {
      .tbyb-tips {
        display: block;
      }
    }
  }
  &-tips {
    display: none;
    position: absolute;
    top: 16px;
    left: 0px;
    transform: translateX(-50%);
    z-index: 12;
    padding-top: 12px;
    &-main {
      position: relative;
      font-size: 13px;
      line-height: 20px;
      background: #fff;
      border-radius: 3px;
      padding: 10px;
      border: 1px solid #ccc;
      width: max-content;
      max-width: 492px;
      font-family: @font-family-500;
      &::before {
        content: '';
        width: 12px;
        height: 12px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        position: absolute;
        top: -7px;
        left: 50%;
        transform: rotate(-45deg);
        background: #fff;
      }
    }
  }
}
</style>
