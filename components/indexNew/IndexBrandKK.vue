<template>
  <div>
    <div
      v-show="!skeleton && loaded"
      v-track.view="{ common: getBiParams('Banner', 'KKbanner') }"
      @click="trackClick('Banner', 'KKbanner', null, null, null, null, null, '/')"
      class="index-brand-KK"
    >
      <div class="index-brand-KK-box">
        <img :src="addWebpSuffix(item.titleImg)" alt="brand kendall kylie" class="brand-KK-title-img" />
        <p class="brand-KK-des">{{ item.content }}</p>
        <div class="brand-KK-imgs">
          <dl
            v-for="(it, idx) in item.bannerList"
            :key="idx"
            v-track.viewOnce.click="{
              id: 'KKbanner_' + idx,
              view: getGAParams(it, idx, 'view'),
              click: getGAParams(it, idx, 'click')
            }"
          >
            <dt>
              <a
                :href="countryUrl(it.linkUrl)"
                :aria-label="it.imageLabel || 'kk banner' + idx"
                :target="it.newWindows ? '_blank' : '_self'"
              >
                <img
                  v-track.view="{ common: getBiParams('Banner', `KKbanner_${idx + 1}`) }"
                  @click="trackClick('Banner', `KKbanner_${idx + 1}`, null, null, null, null, null, '/')"
                  :src="addWebpSuffix(it.imageUrl)"
                  :alt="it.imageLabel || 'kk banner' + idx"
                  @load="imgLoad(it)"
                  :style="getImgStyle(it)"
                />
              </a>
            </dt>
            <dd>
              <a
                :href="countryUrl(it.linkUrl)"
                v-track.view.click="{ common: getBiParams('Button', `KKbutton_${idx + 1}`) }"
                @click="trackClick('Banner', `KKbutton_${idx + 1}`, null, null, null, null, null, '/')"
              >
                {{ it.imageLabel }}
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页brand_kendall_kylie分类模块
 */
export default {
  mixins: [indexModuleMixins]
}
</script>
<style lang="less" scoped>
.index-brand-KK {
  background: #ffffff;
  text-align: center;
  overflow: hidden;
  &-box {
    width: 83.33%;
    max-width: 1600px;
    margin: 100px auto;
  }
  .brand-KK {
    &-title {
      font-family: @font-Ivy-Mode-400;
      font-style: normal;
      font-weight: 400;
      font-size: 48px;
      line-height: 60px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    &-title-img {
      width: 47.69%;
      height: auto;
      vertical-align: middle;
      margin: 0 auto 15px;
    }
    &-des {
      font-family: @font-family-500;
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 30px;
      color: #666;
      margin-bottom: 50px;
    }
    &-imgs {
      display: flex;
      align-content: center;
      justify-content: space-between;
      dl {
        width: 24.13%;
        font-family: @font-Ivy-Mode-400;
        font-style: normal;
        font-weight: 400;
        // font-size: 20px;
        font-size: 1.04vw;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        dd {
          margin-top: 15px;
          a {
            display: inline-block;
            line-height: 1.25vw;
            color: var(--color-121212);
            border-bottom: 1px solid var(--color-121212);
            &:hover {
              color: #666;
              border-color: #666;
            }
          }
        }
      }
      img {
        width: 100%;
      }
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.5863;
}
</style>
