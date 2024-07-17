<template>
  <div id="index_float_banner" v-if="floatBannerData" :class="{ rolling: rolling }">
    <a
      :href="countryUrl(floatBannerData.linkUrl)"
      :class="{ 'no-pointer': judgeIsEmptyUrl(floatBannerData.linkUrl) }"
      v-track.view.click="{ common: getBiParams() }"
      :aria-label="floatBannerData.bannerText"
    >
      <img :src="replaceImgCdnUrl(floatBannerData.imgUrl)" :alt="floatBannerData.bannerText" />
    </a>
  </div>
</template>

<script>
/**
 * 该组件暂未使用
 */
import { mapState } from 'vuex'
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'IndexFloatBanner',
  mixins: [bannerMixins],
  data() {
    return {
      startTopValue: 0, // 记录每次开始滚动时到滚动条到顶部的距离
      topValue: 0, // 滚动条到顶部的距离，用于判断是否滚动事件完毕
      interval: null,
      rolling: false
    }
  },
  computed: {
    ...mapState({
      activityInfo: (state) => state.activityInfo
    }),
    floatBannerData() {
      let floatBannerData
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        if (activity.banner && activity.banner.indexFloatBanner) {
          //   floatBannerData.push({
          //     floatBanner: activity.bar[activity.base.status],
          //     status: activity.base.status,
          //     countdownEndTime: activity.base.countdownEndTime
          //   })
          floatBannerData = activity.banner.indexFloatBanner[0]
          break
        }
      }
      return floatBannerData
    }
  },
  mounted() {
    // const self = this
    // window.addEventListener('scroll', function() {
    //   const scrollTop = document.querySelector('html').scrollTop
    //   if (!self.rolling) self.rolling = true
    //   if (self.interval == null) {
    //     self.interval = setInterval(function() {
    //       self.ShowImg()
    //     }, 500)
    //   }
    //   self.topValue = scrollTop
    // })
  },
  methods: {
    getBiParams() {
      if (process.server) return
      return {
        ec: 'Banner',
        el: 'LittlePromoBanner1',
        param2: this.versionObj.activityAbtest,
        msg: JSON.stringify({
          report_pos: 'activity_banner'
        })
      }
    },
    ShowImg() {
      // 判断此刻到顶部的距离是否和1500ms前的距离相等
      if (document.querySelector('html').scrollTop == this.topValue) {
        this.rolling = false
        clearInterval(this.interval)
        this.interval = null
        this.startTopValue = this.topValue
      }
    }
  }
}
</script>

<style lang="less" scoped>
#index_float_banner {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: @popuy-z-index;
  margin: -120px 0 0;
  transition: right 0.3s;
  img {
    width: 190px;
    height: 240px;
  }
  &.rolling {
    right: -169px;
  }
}
</style>
