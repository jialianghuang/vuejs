<template>
  <div class="banner-bottom">
    <a
      v-track.viewOnce.click="{ common: getBiParams('stylegallery') }"
      :href="countryUrl('/style-gallery')"
      aria-label="style gallery bottom banner"
    >
      <img :data-src="imageUrl" :src="require('~/assets/images/default_img.jpg')" class="lazyload" alt="style gallery bottom banner" />
    </a>
  </div>
</template>

<script>
/**
 * wedding-theme页 底部bannder组件
 *
 */
export default {
  name: 'BottomBanner',
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    ec: {
      type: String,
      default: ''
    }
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      return {
        ec: this.ec,
        el
      }
    }
  }
}
</script>

<style lang="less" scoped>
.banner-bottom {
  width: 100%;
  background: @shadow-color;
  margin: 80px 0;
  img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
