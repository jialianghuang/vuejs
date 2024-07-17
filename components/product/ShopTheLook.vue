<template>
  <div v-track.view.click="{ common: getBiParams('complete the look', 'item') }" class="shop-the-look">
    <div class="shop-the-look-title">{{ nl('page_gallery_shop_the_look') }}</div>
    <div class="shop-the-look-main">
      <div
        ref="shopTheLookItem"
        v-for="(item, index) in outfitInfo"
        :key="index"
        :style="{ height: itemHeight + 'px' }"
        v-track.view.click="{ common: getBiParams('complete the look', 'item' + index, item) }"
        @click="clickShopTheLookItem(item)"
        @mouseenter="handleMouseenter(index)"
        @mouseleave="handleMouseleave(index)"
        class="shop-the-look-item"
      >
        <template v-if="item.videoUrl">
          <video
            ref="shopTheLookVideo"
            :src="item.videoUrl"
            :poster="replaceImgCdnUrl(item.imageUrl)"
            width="100%"
            height="100%"
            autoplay
            preload
            muted
            loop
          ></video>
          <az-icon :icon-class="isPlaying ? 'icon-icon_pause' : 'icon-bofang'" class="icon-bofang"></az-icon>
        </template>
        <img v-else :src="addWebpSuffix(item.imageUrl)" :alt="'Shop the look img' + index" />
        <div ref="shopTheLookText" v-if="!item.videoUrl" class="shop-icon">
          <az-icon icon-class="iconicon_add"></az-icon>
          <span>{{ nl('page_gallery_shop_the_look') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 推荐搭配组件
 * 图片中展示衣服，鞋子，包包等搭配
 */
export default {
  name: 'ShopTheLook',
  languageKeys: ['page_gallery_shop_the_look'],
  props: {
    // 配套商品信息
    outfitInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      itemHeight: '',
      isPlaying: true // 是否正在播放
    }
  },
  mounted() {
    this.setItemHeight()
    window.addEventListener('resize', this.setItemHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setItemHeight)
  },
  methods: {
    // 鼠标进入，动态设置宽度，以适应多语言内容样式
    handleMouseenter(i) {
      const stltDom = this.$refs.shopTheLookItem[i]
      const shopIcon = stltDom.children[1]
      if (shopIcon && shopIcon.className.includes('shop-icon')) {
        shopIcon.style.width = shopIcon.children[1].clientWidth + 32 + 'px'
      }
    },
    // 鼠标离开
    handleMouseleave(i) {
      const stltDom = this.$refs.shopTheLookItem[i]
      const shopIcon = stltDom.children[1]
      if (shopIcon && shopIcon.className.includes('shop-icon')) {
        shopIcon.style.width = '20px'
      }
    },
    getBiParams(ec, el, item) {
      if (process.server) return
      let msg = {
        goodsId: this.baseInfo.goodsId,
        cat_name: this.baseInfo.catName,
        cat_id: this.baseInfo.catId
      }
      if (item) {
        msg = {
          ...msg,
          category_ids: item.goodsList
            ? item.goodsList.map((ele) => {
                return ele.catId
              })
            : []
        }
      }
      const obj = {
        ec,
        el,
        msg: JSON.stringify(msg)
      }
      return obj
    },
    // 因为设计稿视图并不是完全的正方形，考虑屏幕适应，高度需要动态计算
    setItemHeight() {
      this.itemHeight = this.$refs.shopTheLookItem[0].clientWidth * 0.992
    },
    // 点击播放暂停
    clickPlayPause() {
      if (this.isPlaying) {
        // 暂停
        this.$refs.shopTheLookVideo[0].pause()
      } else {
        // 解除静音
        this.$refs.shopTheLookVideo[0].muted = false
        // 播放
        this.$refs.shopTheLookVideo[0].play()
      }
      this.isPlaying = !this.isPlaying
    },
    clickShopTheLookItem(e) {
      if (!e.videoUrl) {
        this.$emit('onItemClick', e)
      } else {
        this.clickPlayPause()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.shop-the-look {
  &-title {
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-family: @font-family-600;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--color-121212);
    margin-bottom: 20px;
  }
  &-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-item {
    flex: 1;
    height: 595px;
    border: 1px solid var(--color-cccccc);
    margin-right: 30px;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    img,
    video {
      width: 100%;
      height: 100%;
    }
    &:last-of-type {
      margin-right: 0px;
    }
    .icon-bofang {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 64px;
      height: 64px;
      transform: translate(-50%, -50%);
      display: none;
    }
    .shop-icon {
      position: absolute;
      bottom: 8px;
      left: 35px;
      width: 20px;
      height: 20px;
      padding: 6px 5px 6px 7px;
      border-radius: 16px;
      background: var(--color-666666);
      overflow: hidden;
      color: #fff;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      transition: all 0.3s;
      .az-icon {
        font-size: 20px;
        fill: #fff;
      }
      span {
        display: inline-block;
        position: absolute;
        left: 32px;
        top: 6px;
        white-space: nowrap;
      }
    }
    &:hover {
      .icon-bofang {
        display: block;
      }
      .shop-icon {
        width: 143px;
      }
    }
  }
}
</style>
