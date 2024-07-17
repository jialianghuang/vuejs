<template>
  <div v-if="footerBanners && footerBanners.list && footerBanners.list.length" class="sale-footer-banner">
    <div v-for="(item, index) in footerBanners.list" :key="index" :id="`footer_banner_${index + 1}`" class="footer-banner-container">
      <sale-banner-item :item="item" :index="index" :keyStr="`footerbanner_${index}`" :isFirstBanner="false" class="item-link" />
    </div>
  </div>
</template>

<script>
import SaleBannerItem from '@/components/sale/SaleBannerItem'
export default {
  name: 'SaleFooterBanner',
  components: { SaleBannerItem },
  props: {
    footerBanners: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.sale-footer-banner {
  margin: 0 0 100px;
}
.footer-banner-container {
  margin-top: 60px;
  img {
    width: 100%;
  }
}
</style>
