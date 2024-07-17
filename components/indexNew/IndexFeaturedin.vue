<template>
  <div>
    <div v-show="!skeleton && loaded" class="index-featuredin">
      <h2>{{ item.title }}</h2>
      <div>
        <a
          v-for="(it, idx) in item.bannerList"
          :key="idx"
          :href="countryUrl(it.linkUrl)"
          :aria-label="it.imageLabel"
          :target="it.newWindows ? '_blank' : '_self'"
        >
          <img :src="addWebpSuffix(it.imageUrl)" :alt="it.imageLabel" @load="imgLoad(it)" :style="getImgStyle(it)" />
        </a>
      </div>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页featuredin模块
 */
export default {
  mixins: [indexModuleMixins]
}
</script>
<style lang="less" scoped>
.index-featuredin {
  margin-top: 100px;
  margin-bottom: 100px;
  font-family: @font-Ivy-Mode-400;
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
  line-height: 45px;
  text-align: center;
  text-transform: uppercase;
  h2 {
    margin-bottom: 30px;
    font-family: @font-Ivy-Mode;
  }
  img {
    width: 83.33%;
    max-width: 1600px;
    margin: 0 auto;
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.0983;
  margin-top: 100px;
  margin-bottom: 100px;
}
</style>
