<template>
  <section>
    <div
      id="groomsmen_accessories"
      v-for="(item, index) in adInfo"
      :key="index"
      class="need_datalayer"
      data-datalayer-category="ShowroomRecommend"
      data-datalayer-label="ShowroomRecommendAd_Click"
    >
      <a @click="hrefPoint" :href="countryUrl(item.linkUrl)" aria-label="groomsmen accessories" target="_blank">
        <img :src="replaceImgCdnUrl(item.imgUrl)" alt="groomsmen accessories" />
        <!-- 热区 lego 配置-->
        <ImageHotSpot :positions="item.positions" ec="showroom" />
      </a>
    </div>
  </section>
</template>
<script>
import bannerMixins from '@/assets/js/bannerMixins'
import { mapState } from 'vuex'
export default {
  name: 'GroomsmenAccessories',
  mixins: [bannerMixins],
  data() {
    return {}
  },
  computed: {
    ...mapState('showroom', ['adInfo'])
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    hrefPoint() {
      this.setPoint('showroom', 'accbanner', 'click')
    },
    handleScroll() {
      const ele = document.getElementById('groomsmen_accessories')
      if (!ele) return false
      const eleBottom = ele.getBoundingClientRect().bottom
      const screenHeight = window.screen.height
      if (eleBottom < screenHeight) {
        this.setPoint('showroom', 'accbanner', 'view')
        window.removeEventListener('scroll', this.handleScroll)
      }
    }
  }
}
</script>
<style lang="less" scoped>
#groomsmen_accessories {
  cursor: pointer;
  a {
    display: block;
    position: relative;
    img {
      width: 100%;
    }
  }
}
</style>
