<template>
  <div @click.self="clickClose" class="color-chart">
    <div class="color-chart-main">
      <button @click="clickClose" aria-label="Close button" class="btn-close">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
      </button>
      <h3 class="title">{{ nl('page_skin_tone_lining') }}</h3>
      <div class="imgs-list">
        <div v-for="(item, index) in colorChartImage" :key="index" class="img-box">
          <img
            :src="require('~/assets/images/default_img.jpg')"
            :data-src="addWebpSuffix(item)"
            :alt="colorChartName[index]"
            class="lazyload"
          />
          <span v-html="colorChartName[index]"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

/**
 * color chart 配图显示组件
 */
export default {
  languageKeys: ['page_skin_tone_lining'],
  data() {
    return {}
  },
  computed: {
    ...mapState('product', ['colorChart']),
    colorChartName() {
      return this.colorChart.color_language_name || []
    },
    colorChartImage() {
      return this.colorChart.image || []
    }
  },
  methods: {
    clickClose() {
      this.$store.commit('product/setColorChartShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.color-chart {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 12;
  &-main {
    padding: 40px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .btn-close {
      width: 30px;
      height: 30px;
      padding: 7px;
      position: absolute;
      right: 15px;
      top: 10px;
      border: none;
      &:focus {
        background: #fff;
      }
      .icon-close {
        width: 16px;
        height: 16px;
        fill: #666;
      }
    }
    .title {
      font-size: 16px;
      line-height: normal;
      font-family: @font-family-600;
      text-transform: uppercase;
      padding-bottom: 5px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
    }
    .imgs-list {
      display: flex;
      justify-content: center;
      .img-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        font-size: 13px;
        font-family: @font-family-600;
        text-transform: capitalize;
        width: 140px;
        img {
          width: 100.1%;
          height: 300px;
          display: block;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
