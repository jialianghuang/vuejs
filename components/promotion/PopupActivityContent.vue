<template>
  <az-overlay @click="overlayClick" :z-index="12" :lockScroll="false">
    <div class="popup-activity-content">
      <div @click="overlayClick" class="close-popup">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
      </div>
      <div v-track.view.click="{ common: getBiParams() }" class="activity-content-banner">
        <div v-if="banners.length" class="item-activity-content-banner">
          <a
            v-for="(bannerItem, key) in banners"
            :key="key"
            :href="countryUrl(bannerItem.linkUrl)"
            :class="{ 'no-cursor': !bannerItem.linkUrl }"
            aria-label="banner"
          >
            <img :src="replaceImgCdnUrl(bannerItem.imgUrl)" alt="banner" />
            <!-- 热区 lego 配置-->
            <ImageHotSpot :positions="bannerItem.positions" ec="Banner" />
          </a>
        </div>
        <div v-if="banners2.length" class="item-activity-content-banner">
          <a
            v-for="(bannerItem, key) in banners2"
            :key="key"
            :href="countryUrl(bannerItem.linkUrl)"
            :class="{ 'no-cursor': !bannerItem.linkUrl }"
            aria-label="banner"
          >
            <img :src="replaceImgCdnUrl(bannerItem.imgUrl)" alt="banner" />
          </a>
        </div>
        <div v-if="banners3.length" class="item-activity-content-banner">
          <a
            v-for="(bannerItem, key) in banners3"
            :key="key"
            :href="countryUrl(bannerItem.linkUrl)"
            :class="{ 'no-cursor': !bannerItem.linkUrl }"
            aria-label="banner"
          >
            <img :src="replaceImgCdnUrl(bannerItem.imgUrl)" alt="banner" />
          </a>
        </div>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'PopupActivityContent',
  components: {
    AzOverlay
  },
  mixins: [bannerMixins],
  props: {
    activityContentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    banners() {
      // 1*1 1*2 1*3
      if (Object.keys(this.activityContentData).length && this.activityContentData.barBanner && this.activityContentData.barBanner.length) {
        const tempData = JSON.parse(JSON.stringify(this.activityContentData))
        const bannerSites = tempData.bannerSite.split('*')
        return tempData.barBanner.slice(0, bannerSites[1] * 1)
      }
      return []
    },
    banners2() {
      // 2*2
      if (Object.keys(this.activityContentData).length && this.activityContentData.barBanner && this.activityContentData.barBanner.length) {
        const tempData = JSON.parse(JSON.stringify(this.activityContentData))
        const bannerSites = tempData.bannerSite.split('*')
        return (
          ((bannerSites[0] == '2' || bannerSites[0] == '3') && tempData.barBanner.slice(bannerSites[1] * 1, bannerSites[1] * 1 * 2)) || []
        )
      }
      return []
    },
    banners3() {
      // 3*2
      if (Object.keys(this.activityContentData).length && this.activityContentData.barBanner && this.activityContentData.barBanner.length) {
        const tempData = JSON.parse(JSON.stringify(this.activityContentData))
        const bannerSites = tempData.bannerSite.split('*')
        return (
          (tempData.barBanner.length && bannerSites[0] == '3' && tempData.barBanner.slice(bannerSites[1] * 2, bannerSites[1] * 3)) || []
        )
      }
      return []
    }
  },
  methods: {
    getBiParams() {
      if (process.server) return
      return {
        ec: 'Banner',
        el: 'RedBarPop',
        param1: (location && location.href) || '-1',
        param2: this.versionObj.activityAbtest
      }
    },
    overlayClick() {
      this.$store.commit('setPopupActivityContentShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.popup-activity-content {
  position: relative;
  .activity-content-banner {
    // display: flex;
    max-width: 780px;
    font-size: 0;
    .item-activity-content-banner {
      display: flex;
      a {
        &.no-cursor {
          cursor: auto;
        }
        img {
          width: 100%;
        }
      }
    }
  }
  .close-popup {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
}
</style>
