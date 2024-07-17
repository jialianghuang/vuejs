<template>
  <div v-track.view.click="{ common: getBiParams() }" class="category-second-banner">
    <!-- <second-banner-img v-if="showSecondBannerImg"> </second-banner-img> -->
    <second-banner-swiper :secondaryBanner="secondaryBanner"> </second-banner-swiper>
  </div>
</template>

<script>
// import secondBannerImg from '@/components/list/secondBannerImg'
import secondBannerSwiper from '@/components/list/secondBannerSwiper'
import { mapState } from 'vuex'
export default {
  name: 'CategorySecondBanner',
  components: {
    // secondBannerImg,
    secondBannerSwiper
  },
  props: {
    secondaryBanner: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // showSecondBannerImg: false // todu 只有在列表页是男配并且没有轮播图的时候出现 if cat_name == 'accessories' and secondary_banner|length == 0,需要字段啊啊啊啊
    }
  },
  computed: {
    ...mapState({
      // pageConfig: (state) => state.list.pageConfig
      dressType: (state) => state.dressType
    }),
    showSecondBannerImg() {
      return this.catName == 'accessories' && this.secondaryBanner.length == 0 && !this.isComingSoon
    }
  },
  mounted() {
    const category = this.catBiName
    if (this.showSecondBannerImg || this.secondaryBanner.length) {
      const msg = {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      this.buryPoint(this, 'event', {
        ec: 'secondarybanner',
        el: category + '_secondarybanner',
        ea: 'view',
        msg: JSON.stringify(msg)
      })
    }
  },
  methods: {
    getBiParams() {
      const msg = {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      return {
        ec: 'Banner',
        el: 'Promobanner',
        dp: 'home',
        msg: JSON.stringify(msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.category-second-banner {
  // 黑五期间，列表页banner先改成顶通的样式
  // margin-top: 10px;
}
</style>
