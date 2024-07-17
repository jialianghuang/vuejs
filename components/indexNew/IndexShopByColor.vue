<template>
  <div>
    <div v-show="!skeleton && loaded" class="index-shopbycolor">
      <h2>{{ item.title }}</h2>
      <!-- <div class="shopbycolor-box">
        <a
          v-for="(it, idx) in item.bannerList"
          :key="idx"
          :href="countryUrl(it.linkUrl)"
          v-track.view.click="{ common: getBiParams('shopbycolor', it.imageLabel) }"
        >
          <img :src="it.imageUrl" :alt="it.imageLabel" @load="imgLoad(it)" :style="getImgStyle(it)" />
          <span>{{ it.imageLabel }}</span>
        </a>
      </div> -->

      <!-- 首页改成色系+颜色模块 -->
      <color-family-filter
        :fromListFilter="false"
        :colorsFamilyListObj="setIndexColorsFamilyList(item.bannerList)"
        @imgLoad="imgLoad"
        :indexShowModule="!skeleton && loaded"
        :fromIndex="true"
        :cfClass="cfClass"
      ></color-family-filter>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'
import ColorFamilyFilter from '@/components/list/ColorFamilyFilter'
/**
 * 首页shop by color 模块
 */
export default {
  components: { ColorFamilyFilter },
  mixins: [indexModuleMixins],
  languageKeys: ['PAGE_FAMILY_ALL'],
  data() {
    return {
      cfClass: ''
    }
  },
  mounted() {
    this.getStyleClass()
    window.addEventListener('resize', () => {
      this.getStyleClass()
    })
  },
  methods: {
    setIndexColorsFamilyList(obj) {
      let tempObj = {
        all: {
          name: this.nl('PAGE_FAMILY_ALL'), // 提供的code就是大写的
          key: 'all',
          url: '/all/bridesmaid-dresses',
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/e5/ca/8a759b0f1709956793eac6e299efe5ca.jpg'
        }
      }
      if (obj && Object.keys(obj).length) {
        tempObj = {
          ...obj,
          ...tempObj
        }
      }
      return tempObj
    },
    getStyleClass() {
      // 获取屏幕宽度，首页的色系颜色模块要根据屏幕来定样式
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (windowWidth >= 1536) {
        this.cfClass = 'big-style'
      } else {
        this.cfClass = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.index-shopbycolor {
  margin: 100px 0;
  padding: 0;
  text-align: center;
  h2 {
    font-family: @font-Ivy-Mode-400;
    font-style: normal;
    font-weight: 400;
    font-size: 36px;
    line-height: 45px;
    text-transform: uppercase;
    margin-bottom: 34px;
  }
  .shopbycolor-box {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    a {
      display: inline-block;
      width: 7.15%;
      max-width: 137.27px;
      font-family: @font-family-500;
      font-style: normal;
      font-size: 13px;
      line-height: 18px;
      text-transform: uppercase;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-121212);
      &:hover {
        color: var(--color-121212);
      }
      img {
        width: 65.56%;
        max-width: 90px;
        margin-bottom: 10px;
      }
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.2179;
  margin-top: 100px;
}
</style>
