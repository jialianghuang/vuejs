<template>
  <div :style="getModuleStyle()" class="common-module">
    <div v-if="!skeleton" class="common-module__container">
      <div v-if="+config.titleHeight" :style="getTitleOutboxStyle()" class="common-module__title">
        <h3 v-if="config.title" :style="getTitleStyle()">{{ nl(config.title) }}</h3>
        <div v-else :style="getTitleStyle()"></div>
        <a
          v-if="config.viewMoreText"
          :href="countryUrl(config.viewMoreUrl)"
          :target="config.newWindows ? '_blank' : '_self'"
          v-track.viewOnce.click="getBiParams(config.viewMoreText)"
        >
          <span class="common-module__more">{{ config.viewMoreText }}</span>
        </a>
      </div>
      <div :style="getListOutboxStyle()" class="common-module__list-outbox">
        <div :style="getListStyle()" class="common-module__list">
          <div :style="getListItemStyle(index)" v-for="(banners, index) in config.bannerList" :key="index" class="common-module__list-item">
            <common-module-item
              :banners="banners"
              :bis="{ ec: config.description || '-1', x: index, id: config.keyStr }"
            ></common-module-item>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="common-module__container common-skeleton">
      <div :style="getTitleStyle()" class="common-module__title common-skeleton__head"></div>
      <div :style="getListOutboxStyle(getDefaultBgStyle())" class="common-module__list-outbox common-skeleton__body"></div>
    </div>
  </div>
</template>

<script>
import CommonModuleItem from './CommonModuleItem'

export default {
  name: 'CommonModule',
  components: {
    CommonModuleItem
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    skeleton: {
      type: Boolean,
      default() {
        return true
      }
    },
    autoSize: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      itemPadding: 15,
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const pageWidth = this.$el.parentNode.offsetWidth
      this.pageWidth = pageWidth
    },
    getTitleOutboxStyle() {
      const config = this.config
      const horizontalPadding = config.horizontalPadding
      return {
        marginLeft: horizontalPadding + 'px',
        marginRight: horizontalPadding + 'px'
      }
    },
    getTitleStyle() {
      const config = this.config
      return this.skeleton
        ? { height: config.titleHeight + 'px' }
        : {
            fontSize: config.titleFontSize + 'px',
            fontWeight: config.titleFontWeight === 'bold' ? 'bold' : 'normal',
            color: config.titleColor,
            textAlign: config.titleAlign,
            height: config.titleHeight + 'px',
            lineHeight: config.titleHeight + 'px'
          }
    },
    // 模块样式
    getModuleStyle() {
      const config = this.config
      const scale = config.height / config.width
      let style = {}
      if (!config.scrollable || this.autoSize) {
        style = {
          width: '100%',
          paddingBottom: `calc(100% * ${scale} + ${+config.titleHeight || 0}px)`,
          marginBottom: `${config.paddingBottom}px`
        }
      } else {
        style = {
          width: '100%',
          height: config.height + 'px',
          marginBottom: `${config.paddingBottom}px`
        }
      }
      return style
    },
    // 通用背景样式
    getBackgroundStyle() {
      const config = this.config
      let bgStyle = {}
      if (config.bgImage) {
        bgStyle = {
          backgroundImage: `url(${config.bgImage})`
        }
      } else if (config.bgColor) {
        bgStyle = {
          backgroundColor: config.bgColor
        }
      }
      if (this.skeleton) bgStyle = {}
      return bgStyle
    },
    /*
     * 骨架屏 背景样式
     * 需要考虑ssr渲染 无法获取元素  height/width undefined
     */
    getDefaultBgStyle() {
      const el = this.$el && this.$el.querySelector('.common-skeleton__body')
      const height = el && el.offsetHeight
      const width = el && el.offsetWidth
      if (height >= 80 && width >= 74) {
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
        }
      } else if (!height && !width) {
        // ssr
        return {
          background: `var(--color-f9f9f9)`
        }
      } else {
        // 过小
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ contain, var(--color-f9f9f9)`
        }
      }
    },
    getListOutboxStyle(styles) {
      const config = this.config
      const bgStyle = this.getBackgroundStyle()
      const style = {
        overflow: !config.scrollable || this.autoSize ? 'unset' : 'auto',
        height:
          !config.scrollable || this.autoSize
            ? `calc(100% * ${config.height / config.width} + ${+config.titleHeight || 0}px)`
            : `${config.height}px`
      }
      return Object.assign(style, bgStyle, styles)
    },
    getListStyle() {
      const config = this.config
      const horizontalPadding = config.horizontalPadding
      const verticalPadding = config.verticalPadding
      return {
        top: config.titleHeight + 'px',
        width: !config.scrollable || this.autoSize ? '100%' : config.width + 'px',
        paddingLeft: horizontalPadding + 'px',
        paddingRight: horizontalPadding + 'px',
        paddingTop: verticalPadding + 'px',
        paddingBottom: verticalPadding + 'px'
      }
    },
    getListItemStyle(index) {
      const config = this.config
      const childVerticalSpacing = config.childConfigureSpacing ? config.childVerticalSpacing || 0 : this.itemPadding
      const childHorizontalSpacing = config.childConfigureSpacing ? config.childHorizontalSpacing || 0 : this.itemPadding
      const row = config.rowNum
      const column = config.columnNum

      const lastRow = ~~(index / column) + 1 === row
      const lastColumn = (index + 1) % column === 0

      return {
        width: `calc((100% - ${childHorizontalSpacing}px * (${column} - 1)) / ${column} )`,
        height: `calc((100% - ${childVerticalSpacing}px * (${row} - 1)) / ${row} )`,
        marginBottom: (lastRow ? 0 : childVerticalSpacing) + 'px',
        marginRight: (lastColumn ? 0 : childHorizontalSpacing) + 'px',
        overflow: 'hidden'
      }
    },
    getBiParams(el) {
      if (process.server) return
      return {
        id: `${this.config.keyStr}-${el}`,
        common: {
          ec: this.config.description || '-1',
          el,
          param1: (location && location.href) || '-1',
          param2: this.versionGroup.home_custom_home
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.common-module {
  position: relative;
  height: 0;
  &__title {
    position: relative;
  }
  &__more {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: var(--color-121212);
    font-family: @font-family-500, sans-serif;
  }
}
.common-module__container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.common-module__title {
  box-sizing: border-box;
  background: #fff;
  border-bottom: 1px solid var(--color-cccccc);
}
.common-module__list {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  height: 100%;
}
.common-module__list-outbox {
  flex: 1;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
.common-module__list-item {
  box-sizing: border-box;
  position: relative;
}

.common-skeleton {
  padding: 0 15px;
  box-sizing: border-box;
  background: #fff;
  &__head,
  &__body {
    background: var(--color-f9f9f9);
    box-sizing: border-box;
  }
  &__head {
    margin: 0 0 15px;
    border-bottom: 1px solid var(--color-f9f9f9);
  }
}
</style>
