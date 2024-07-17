<template>
  <div>
    <!-- v-show="!skeleton && loaded" -->
    <div class="index-collections">
      <div class="index-collections-box">
        <h1 class="collections-title">{{ item.title }}</h1>
        <p class="collections-des">{{ item.content }}</p>
        <div class="collections-imgs">
          <dl
            v-for="(it, idx) in item.bannerList"
            :key="idx"
            v-track.viewOnce.click="{
              id: 'collectionsbanner_' + idx,
              view: getGAParams(it, idx, 'view'),
              click: getGAParams(it, idx, 'click')
            }"
          >
            <dt>
              <a :href="countryUrl(it.linkUrl)" :target="it.newWindows ? '_blank' : '_self'" :aria-label="it.imageLabel">
                <img
                  v-track.view="{
                    common: [
                      getBiParams('Banner', it.imageLabel),
                      getNewTrackParams('category1', 'banner', it.imageUrl, idx + 1, null, it.desc)
                    ]
                  }"
                  :src="addWebpSuffix(it.imageUrl)"
                  :alt="it.imageLabel"
                  @click="trackClick('Banner', it.imageLabel, 'category1', 'banner', it.imageUrl, idx + 1, it.desc, '/')"
                  :style="styleInfo"
                  class="skeleton-default"
                  width="362px"
                  height="522px"
                />
              </a>
            </dt>
            <dd>
              <a
                :href="countryUrl(it.linkUrl)"
                :target="it.newWindows ? '_blank' : '_self'"
                v-track.view="{
                  common: [
                    getBiParams('Button', it.imageLabel),
                    getNewTrackParams('category1', 'button', it.imageUrl, idx + 1, null, it.desc)
                  ]
                }"
                @click="trackClick('Button', it.imageLabel, 'category1', 'button', it.imageUrl, idx + 1, it.desc, '/')"
              >
                {{ it.imageLabel }}
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <!-- <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div> -->
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页collections分类模块
 */
export default {
  mixins: [indexModuleMixins]
}
</script>
<style lang="less" scoped>
.index-collections {
  background: var(--color-f1e9e6);
  text-align: center;
  overflow: hidden;
  &-box {
    width: 83.33%;
    max-width: 1600px;
    margin: 80px auto 80px;
  }
  .collections {
    &-title {
      font-family: @font-Ivy-Mode-400;
      font-style: normal;
      font-weight: 400;
      font-size: 48px;
      line-height: 60px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
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
        height: auto;
      }
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  // height: 100vw * 0.46876;
}
</style>
