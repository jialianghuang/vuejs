<template>
  <div>
    <div v-if="!skeleton" class="index-collections-links">
      <ul>
        <li v-for="(it, idx) in item.bannerList" :key="idx">
          <a
            :href="countryUrl(it.linkUrl)"
            v-track.view="{
              common: [
                getBiParams('Category', it.imageLabel),
                getNewTrackParams('category2', 'button', null, idx + 1, null, it.desc || it.imageLabel)
              ]
            }"
            @click="trackClick('Category', it.imageLabel, 'category2', 'button', null, idx + 1, it.desc || it.imageLabel, '/')"
            :aria-label="it.imageLabel + ' link'"
            :target="it.newWindows ? '_blank' : '_self'"
            >{{ it.imageLabel }}</a
          >
        </li>
      </ul>
    </div>
    <div v-else :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页collections links分类模块
 */
export default {
  mixins: [indexModuleMixins]
}
</script>
<style lang="less" scoped>
.index-collections-links {
  background: var(--color-f1e9e6);
  text-align: center;
  overflow: hidden;
  ul {
    width: 83.33%;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 100px;
    li {
      width: 24.25%;
      height: 80px;
      background: #ffffff;
      border: 1px solid var(--color-121212);
      box-sizing: border-box;
      // font-size: 18px;
      font-size: 0.9375vw;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-family: @font-family-500;
      margin-top: 15px;
      overflow: hidden;
      &:hover {
        border-color: #666;
        background: var(--color-f9f9f9);
        a {
          color: #666;
        }
      }
      a {
        color: var(--color-121212);
        display: inline-block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.2469;
}
</style>
