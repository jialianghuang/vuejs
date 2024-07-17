<template>
  <div>
    <div v-show="!skeleton && loaded">
      <a
        v-for="(it, idx) in item.bannerList"
        :key="idx"
        :href="countryUrl(it.linkUrl)"
        :target="it.newWindows ? '_blank' : '_self'"
        class="index-tryon"
      >
        <div class="tryon-left">
          <img
            v-track.view="{ common: getBiParams('Banner', 'athometryon') }"
            :src="addWebpSuffix(it.imageUrl)"
            :alt="it.imageLabel"
            @load="imgLoad(it)"
            @click="trackClick('Banner', 'athometryon', null, null, null, null, null, '/')"
            :style="getImgStyle(it)"
          />
          <ImageHotSpot
            :positions="it.positions"
            :img-url="it.imageUrl"
            @hotSpotClick="setPoint('Banner', 'athometryon', 'click', {}, null, '/')"
          />
        </div>
        <div class="tryon-right">
          <div class="tryon-right-main">
            <h1 class="tryon-title">{{ it.imageLabel }}</h1>
            <p v-html="it.imageLabelContent" class="tryon-des"></p>
            <span v-track.view.click="{ common: getBiParams('Button', 'shopnow4') }" class="tryon-btn">
              {{ it.imageLabelLinkText }}
            </span>
          </div>
        </div>
      </a>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'
import bannerMixins from '@/assets/js/bannerMixins'

/**
 * 首页IndexTryOn模块
 */
export default {
  mixins: [indexModuleMixins, bannerMixins]
}
</script>
<style lang="less" scoped>
.index-tryon {
  margin-top: 100px;
  background: linear-gradient(to left, var(--color-f1e9e6) 80%, #fff 50%);
  width: 100%;
  padding: 88px 0px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 100%;
  }
  .tryon {
    &-left {
      display: block;
      width: 50%;
      position: relative;
      img {
        width: 100%;
      }
    }
    &-right {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      &-main {
        width: 68.7%;
        max-width: 660px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: var(--color-121212);
      }
    }
    &-title {
      font-family: @font-Ivy-Mode-400;
      font-style: normal;
      font-weight: 400;
      font-size: 48px;
      line-height: 60px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    &-des {
      font-family: @font-family-500;
      font-size: 18px;
      line-height: 30px;
      margin: 15px 0px 50px;
    }
    &-btn {
      font-family: @font-family-600;
      // font-size: 24px;
      font-size: 1.25vw;
      line-height: 33px;
      letter-spacing: 0.06em;
      text-decoration-line: underline;
      text-transform: uppercase;
      color: var(--color-121212);
      &:hover {
        color: var(--color-121212);
      }
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.45;
  margin-top: 100px;
}
</style>
