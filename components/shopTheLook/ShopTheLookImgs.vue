<template>
  <div :class="{ entry: scene === 'entry', default: !scene }" class="shop-the-look-imgs">
    <template v-for="(item, index) in showImgs">
      <img
        :key="index"
        v-if="item.imgUrl"
        :class="[item.inlineClass + '-img', { 'has-cat-link': hasCatLink(item) }]"
        :src="replaceImgCdnUrl(item.imgUrl)"
        :alt="item.alt"
        :style="{ opacity: scene === 'entry' && imgLoaded < showImgs.length ? 0 : 1 }"
        @load="handleLoaded(index)"
        @click="handleClickImg(item)"
        v-track.view.click="trackShopTheLook(item)"
        loading="lazy"
      />
      <az-icon
        :key="index + 4"
        v-if="!item.imgUrl || (scene === 'entry' && imgLoaded < showImgs.length)"
        :class="[item.inlineClass, { 'has-cat-link': hasCatLink(item) }]"
        :icon-class="item.iconClass"
        @click="handleClickImg(item)"
        v-track.view.click="trackShopTheLook(item)"
      ></az-icon>
    </template>
    <az-button v-if="scene === 'entry'" @click="clickCustomize" class="btn btn-hollow">{{ nl('page_common_customize') }}</az-button>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'

/**
 * 搭配商品图片展示组件
 * 用于入口和工具页
 */
export default {
  languageKeys: ['page_common_customize'],
  components: {
    AzButton
  },
  props: {
    // 使用场景，入口：entry
    scene: {
      type: String,
      default: ''
    },
    // 跳转链接
    link: {
      type: String,
      default: ''
    },
    products: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      imgLoaded: 0
    }
  },
  computed: {
    // 页面左侧搭配图片展示区内容图片
    showImgs() {
      const res = []
      this.products.forEach((ele) => {
        let imgUrl = ''
        let iconClass = ''
        let inlineClass = ''
        if (ele.goodsInfo) {
          const shopLookGallery = ele.goodsInfo.imageInfo.shopLookGallery
          let currentColorGallery = shopLookGallery[ele.selectedColor.key]
          if (!currentColorGallery) {
            currentColorGallery = shopLookGallery[ele.goodsInfo.baseInfo.color]
          }
          if (!Array.isArray(shopLookGallery) && shopLookGallery && currentColorGallery && currentColorGallery[0]) {
            let prefix = ele.goodsInfo.imageInfo.thumbPrefix // 正常图片路径，有大originalPrefix，普通thumbPrefix，小browserPrefix三种
            if (this.scene === 'entry') {
              prefix = ele.goodsInfo.imageInfo.browserPrefix // 小图路径
            }
            imgUrl = prefix + currentColorGallery[0].imgUrl
          }
        }
        if (ele.catId === 3109) {
          iconClass = 'icon-look-bag-big1'
          inlineClass = 'icon-bag'
        } else if (ele.catId === 7) {
          iconClass = 'icon-look-dress-big1'
          inlineClass = 'icon-dress'
        } else if (ele.catId === 3076) {
          iconClass = 'icon-look-jewelry-big1'
          inlineClass = 'icon-jewelry'
        } else if (ele.catId === 3102) {
          iconClass = 'icon-look-shoes-big1'
          inlineClass = 'icon-shoes'
        }
        res.push({
          catId: ele.catId,
          alt: ele.goodsInfo && ele.goodsInfo.baseInfo ? ele.goodsInfo.baseInfo.shownGoodsName : ele.catId + ' img',
          imgUrl,
          iconClass,
          inlineClass,
          categoryUrl: ele.goodsInfo && ele.goodsInfo.baseInfo ? ele.goodsInfo.baseInfo.categoryUrl : '',
          catName: ele.catName,
          showGoodsInfo: ele.showGoodsInfo
        })
      })
      return res
    }
  },
  methods: {
    handleLoaded() {
      this.imgLoaded++
    },
    clickCustomize() {
      if (this.scene === 'entry' && this.link) {
        this.$emit('clickCustomize')
        location.href = this.link
      }
    },
    handleClickImg(item) {
      if (this.scene === 'entry' && this.link) {
        if (this.link) {
          this.$emit('handleClickImg')
          location.href = this.link
        }
      } else {
        if (!this.hasCatLink(item)) return
        this.$emit('handleClickImg', item)
      }
    },
    hasCatLink(item) {
      return item.showGoodsInfo
    },
    trackShopTheLook(item) {
      if (this.scene !== 'entry' && this.hasCatLink(item)) {
        return { common: this.getBiParams('shopthelook', `left_preview_${item.catName}`) }
      }
    },
    getBiParams(ec, el) {
      if (process.server) return
      return {
        ec,
        el,
        param1: (location && location.href) || '-1'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.shop-the-look-imgs {
  overflow: hidden;
  &.default {
    position: sticky;
    top: 100px;
    width: 31.25vw;
    height: calc(31.25vw * 1.383);
    max-width: calc((100vh - 200px) / 1.383);
    max-height: calc(100vh - 200px);
    min-width: 300px;
    min-height: 415px;
  }
  &.entry {
    width: 100%;
    height: 179px;
    position: relative;
    overflow: unset;
    cursor: pointer;
  }
  > .az-icon,
  > img {
    position: absolute;
  }
  .icon-dress {
    height: 81.325%;
    width: 112.5%;
    top: 7.47%;
    left: 50%;
    transform: translateX(-50%);
    &-img {
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
    }
  }
  .icon-shoes {
    width: 23.33%;
    height: 16.867%;
    left: 8.17%;
    bottom: 5.5%;
    &-img {
      width: 26.67%;
      bottom: 1.42%;
      left: 21px;
    }
  }
  .icon-jewelry {
    width: 8%;
    height: 5.78%;
    top: 19.625%;
    right: 14.96%;
    &-img {
      width: 26.67%;
      top: 9.88%;
      right: 5%;
    }
  }
  .icon-bag {
    width: 18.67%;
    height: 13.494%;
    top: 37.988%;
    right: 7.83%;
    &-img {
      width: 26.67%;
      top: 31.169%;
      right: 5%;
    }
  }
  .btn {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translate(-50%, 100%);
    width: 100px;
    height: 32px;
    font-size: 12px;
    padding: 0px;
    background: rgba(255, 255, 255, 0.9);
    overflow: hidden;
  }
  .has-cat-link {
    cursor: pointer;
  }
}
</style>
