<template>
  <div>
    <div v-show="!skeleton && loaded" class="index-sellpoint">
      <a
        v-for="(it, idx) in item.bannerList"
        :key="idx"
        :href="countryUrl(it.linkUrl)"
        :aria-label="it.imageLabel"
        v-track.view.click="{ common: getBiParams('Sellingpoint', idx + 1 + '_sellingpoint') }"
        :target="it.newWindows ? '_blank' : '_self'"
      >
        <img :src="addWebpSuffix(it.imageUrl)" :alt="it.imageLabel" @load="imgLoad(it)" :style="getImgStyle(it)" />
      </a>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页sellingpoint模块
 */
export default {
  mixins: [indexModuleMixins]
}
</script>
<style lang="less" scoped>
.index-sellpoint {
  margin-top: 100px;
  background: var(--color-f1e9e6);
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    width: 16.25%;
    max-width: 312px;
    max-height: 150px;
    // margin: 0px 5px;
    border-right: 5px solid #fff;
    &:last-of-type {
      border: none;
    }
  }
  img {
    width: 100%;
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.07793;
  margin-top: 100px;
}
</style>
