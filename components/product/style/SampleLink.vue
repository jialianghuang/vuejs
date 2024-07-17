<template>
  <a
    :href="countryUrl(link)"
    @click="hrefPoint"
    :data-datalayer-category="category"
    :data-datalayer-label="label"
    class="sample-link need_datalayer"
    rel="external"
  >
    <az-icon v-if="baseInfo.dressType == 'dress'" icon-class="icon-xxy_try_before_you_buy" class="link-icon"></az-icon>
    <az-icon v-else icon-class="icon-xingzhuangjiehe" class="link-icon"></az-icon>
    <span class="link-text">{{ linkText }}</span>
  </a>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SampleLink',
  languageKeys: ['page_common_view_product', 'page_sample_try'],
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
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
    category() {
      if (this.baseInfo.catId == 2) {
        return 'WDSampleButton'
      } else if (this.baseInfo.catId == 8) {
        return 'M_MOBSampleButton'
      }
      return ''
    },
    label() {
      if (this.baseInfo.catId == 2 && this.baseInfo.dressType == 'dress') {
        return 'WDSampleButton_TryBYP_Click'
      } else if (this.baseInfo.catId == 2 && this.baseInfo.dressType == 'sample') {
        return 'WDSampleButton_ViewProduct_Click'
      } else if (this.baseInfo.catId == 8 && this.baseInfo.dressType == 'sample') {
        return 'MOBSampleButton_ViewProduct_Click'
      }
      return ''
    },
    linkText() {
      if (this.baseInfo.dressType == 'sample') {
        return this.nl('page_common_view_product')
      }
      return this.nl('page_sample_try')
    }
  },
  created() {
    if (this.baseInfo.dressType == 'sample') {
      this.setPoint('viewproduct', 'view')
    } else {
      this.setPoint('trybeforeyoubuy', 'view')
    }
  },
  methods: {
    setPoint(ec, ea) {
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
          this.setPoint('viewproduct', 'click')
          break
        case this.nl('page_sample_try'):
          this.setPoint('trybeforeyoubuy', 'click')
          // 订单追踪 tryongowns，订单层面的追踪，不需要到商品，如果需要到商品，使用setOrderSourceFlagWithGoodsId
          this.setOrderSourceFlag('tryongowns', true)
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sample-link {
  width: 80%;
  max-width: 420px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  background-color: #fff;
  text-transform: uppercase;
  font-family: @font-family-600;
  font-size: 14px;
  box-sizing: border-box;
  color: @theme-color;
  cursor: pointer;
  .link-icon {
    fill: currentColor;
    height: 15px;
    width: 20px;
    margin-right: 6px;
    margin-bottom: 2px;
  }
  .link-text {
    text-decoration: underline;
  }
}
</style>
