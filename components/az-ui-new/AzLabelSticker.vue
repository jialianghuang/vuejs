<template>
  <span v-if="showName" :style="{ margin: margin }" :class="size" class="az-label-sticker">
    <span class="az-label-sticker-text">{{ showName }}</span>
  </span>
</template>
<script>
/**
 * 标签类型的sticker
 * 现主要用于商品列表，商品详情
 */
export default {
  languageKeys: [
    'page_common_sticker_text_stretch',
    'page_common_sticker_text_stain',
    'page_common_sticker_two_piece',
    'page_common_sticker_matte_stain',
    'page_common_sticker_free_pannier'
  ],
  props: {
    // 显示大小，默认small类型，mini类型缩放0.833
    size: {
      type: String,
      default: 'small'
    },
    // 接口返回的sticker数据
    stickers: {
      type: Array,
      default() {
        return []
      }
    },
    // 标签文本内容
    text: {
      type: String,
      default: ''
    },
    // margin样式属性，用于处理不同场景的样式间距
    margin: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 本标签最终显示的内容
    showName() {
      if (this.text) {
        return this.text
      } else if (Array.isArray(this.stickers) && this.stickers[0]) {
        const name = this.stickers[0].name
        if (name === 'stretch') {
          return this.nl('page_common_sticker_text_stretch')
        } else if (name === 'newsatin') {
          return this.nl('page_common_sticker_text_stain')
        } else if (name === 'twoPiece') {
          return this.nl('page_common_sticker_two_piece')
        } else if (name === 'matteSatinStretch') {
          return this.nl('page_common_sticker_matte_stain')
        } else if (name === 'freePannier') {
          return this.nl('page_common_sticker_free_pannier')
        }
        return null
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.az-label-sticker {
  display: inline-block;
  background-color: var(--color-ede1d3);
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  padding: 0px 8px;
  font-size: 12px;
  color: var(--color-121212);
  text-transform: capitalize;
  vertical-align: middle;
  font-family: var(--font-family-600);
  &-text {
    display: inline-block;
    height: 100%;
  }
  &.mini {
    height: 14px;
    line-height: 14px;
    border-radius: 7px;
    &-text {
      transform: scale(0.833); // 缩放字体10px
    }
  }
}
</style>
