<template>
  <div class="gallery-banner">
    <div class="image">
      <div v-track.viewOnce="{ common: getBiParams('customer photo') }">
        <img :data-src="imageUrl" :src="require('~/assets/images/default_img.jpg')" class="lazyload" alt="top gallery banner" />
        <ImageHotSpot :positions="getPosition()" :ec="ec" @hotSpotClick="hotSpotClick" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * wedding-theme页 顶部bannder组件
 * 点击展示gallery弹窗
 *
 */
import bannerMixins from '@/assets/js/bannerMixins'

const positionMap = {
  three: [
    {
      name: '1',
      url: '',
      width: '0.33',
      height: '1',
      x: '0',
      y: '0',
      newWindows: false
    },
    {
      name: '2',
      url: '',
      width: '0.33',
      height: '1',
      x: '0.335',
      y: '0',
      newWindows: false
    },
    {
      name: '3',
      url: '',
      width: '0.33',
      height: '1',
      x: '0.67',
      y: '0',
      newWindows: false
    }
  ],
  five: [
    {
      name: '1',
      url: '',
      width: '0.355',
      height: '0.495',
      x: '0',
      y: '0',
      newWindows: false
    },
    {
      name: '2',
      url: '',
      width: '0.355',
      height: '0.495',
      x: '0',
      y: '0.5',
      newWindows: false
    },
    {
      name: '3',
      url: '',
      width: '0.275',
      height: '1',
      x: '0.36',
      y: '0',
      newWindows: false
    },
    {
      name: '4',
      url: '',
      width: '0.355',
      height: '0.495',
      x: '0.64',
      y: '0',
      newWindows: false
    },
    {
      name: '5',
      url: '',
      width: '0.355',
      height: '0.495',
      x: '0.64',
      y: '0.5',
      newWindows: false
    }
  ],
  nine: [
    {
      name: '1',
      url: '',
      width: '0.195',
      height: '1',
      x: '0',
      y: '0',
      newWindows: false
    },
    {
      name: '2',
      url: '',
      width: '0.17',
      height: '0.645',
      x: '0.2',
      y: '0',
      newWindows: false
    },
    {
      name: '3',
      url: '',
      width: '0.17',
      height: '0.35',
      x: '0.2',
      y: '0.655',
      newWindows: false
    },
    {
      name: '4',
      url: '',
      width: '0.23',
      height: '0.625',
      x: '0.375',
      y: '0',
      newWindows: false
    },
    {
      name: '5',
      url: '',
      width: '0.23',
      height: '0.365',
      x: '0.375',
      y: '0.63',
      newWindows: false
    },
    {
      name: '6',
      url: '',
      width: '0.22',
      height: '0.40',
      x: '0.61',
      y: '0',
      newWindows: false
    },
    {
      name: '7',
      url: '',
      width: '0.22',
      height: '0.59',
      x: '0.61',
      y: '0.41',
      newWindows: false
    },
    {
      name: '8',
      url: '',
      width: '0.165',
      height: '0.59',
      x: '0.835',
      y: '0',
      newWindows: false
    },
    {
      name: '9',
      url: '',
      width: '0.165',
      height: '0.40',
      x: '0.835',
      y: '0.6',
      newWindows: false
    }
  ]
}

export default {
  name: 'GalleryBanner',
  mixins: [bannerMixins],
  props: {
    theme: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    currentColor: {
      type: String,
      default: ''
    },
    ec: {
      type: String,
      default: ''
    },
    styleGalleryList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    // 根据传入的id数量获取热区位置
    getHotSpotMode() {
      if (this.styleGalleryList.length > 8) {
        return 'nine'
      } else if (this.styleGalleryList.length < 4) {
        return 'three'
      } else {
        return 'five'
      }
    }
  },
  methods: {
    getPosition() {
      return positionMap[this.getHotSpotMode]
    },
    hotSpotClick(item) {
      // 通过获取点击的name匹配styleGalleryList拿到对应的galleryId上报
      const galleryId = this.styleGalleryList[+item.name - 1] || ''
      this.$store.commit('styleGallery/setCurrentGalleryId', galleryId)
      this.$emit('getGalleryInfo')
      this.setPoint(this.ec, 'customer photo', 'click', { color: this.currentColor, styleGalleryId: galleryId }) // 点击时携带galleryId
    },
    getBiParams(el) {
      if (process.server) return
      return {
        ec: this.ec,
        el,
        msg: { color: this.currentColor }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-banner {
  position: relative;
  background: @shadow-color;
  .image {
    width: 100%;
    img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
  }
}
</style>
