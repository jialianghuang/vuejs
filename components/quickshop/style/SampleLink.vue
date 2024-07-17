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
    <span class="link-text">{{ linkText }}</span>
  </a>
</template>

<script>
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
    link() {
      if (this.baseInfo.dressType == 'dress') {
        return '/products/sample-brides?style=' + this.baseInfo.goodsName.replace(/\s+/g, '-').toLowerCase() + '&from_details_entry=1'
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
        this.setPoint('viewproduct', 'view')
        return this.nl('page_common_view_product')
      }
      this.setPoint('trybeforeyoubuy', 'view')
      return this.nl('page_sample_try')
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
  margin-top: 25px;
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
    margin-right: 8px;
    margin-bottom: 2px;
  }
  .link-text {
    text-decoration: underline;
  }
}
</style>
