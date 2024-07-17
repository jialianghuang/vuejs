<template>
  <div id="cart_label_banner" v-if="cartLabelBannerData">
    <a :href="countryUrl(cartLabelBannerData.linkUrl)" :class="{ 'no-pointer': judgeIsEmptyUrl(cartLabelBannerData.linkUrl) }">
      <img :src="replaceImgCdnUrl(cartLabelBannerData.imgUrl)" :alt="cartLabelBannerData.bannerText" />
      <ImageHotSpot
        :positions="cartLabelBannerData.positions && Array.isArray(cartLabelBannerData.positions) ? cartLabelBannerData.positions : []"
        :img-url="cartLabelBannerData.imgUrl"
        ec="cart label banner"
      />
      <span v-html="cartLabelBannerData.cartText"></span>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'CartLabelBanner',
  mixins: [bannerMixins],
  data() {
    return {}
  },
  computed: {
    ...mapState({
      activityInfo: (state) => state.activityInfo
    }),
    cartLabelBannerData() {
      let cartLabelBannerData
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        if (activity.banner && activity.banner.cartLabelBanner) {
          //   cartLabelBannerData.push({
          //     floatBanner: activity.bar[activity.base.status],
          //     status: activity.base.status,
          //     countdownEndTime: activity.base.countdownEndTime
          //   })
          cartLabelBannerData = activity.banner.cartLabelBanner[0]
          break
        }
      }
      return cartLabelBannerData
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
#cart_label_banner {
  padding-bottom: 10px;
  img {
    height: 24px;
  }
  span {
    font-family: @font-family-500;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
    display: inline-block;
  }
}
</style>
