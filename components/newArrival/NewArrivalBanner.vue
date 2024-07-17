<template>
  <div
    id="new_arrival_first_banner"
    ref="new_arrival_first_banner"
    v-if="categoriesBanners && categoriesBanners.list && categoriesBanners.list.length"
    v-track.viewOnce="{ id: 'new_arrival_first_banner', common: getBiParams() }"
    class="new-arrival-first-banner"
  >
    <!-- topBanners该模块不是lego配置banner -->
    <div v-if="topBanners && topBanners.list && topBanners.list.length" class="img-box">
      <img
        ref="newArrivalBanner"
        :src="addWebpSuffix(newArrivalBanner.imgUrl)"
        :alt="newArrivalBanner.alt"
        :usemap="newArrivalBanner.isHotspot ? '#newArrivalMap' : ''"
        v-track.view.click="{ common: getMapAreaBiParams(1) }"
        @click="clickNewArrivalBanner"
        @load="handleHotMap"
      />
      <map id="newArrivalMap" v-if="newArrivalBanner.isHotspot && newArrivalBanner.hotSpotRegion.length" name="newArrivalMap">
        <area
          v-for="(item, index) in newArrivalBanner.hotSpotRegion"
          :key="index"
          :shape="item.type"
          :coords="item.coordinates.join(',')"
          :alt="item.alt"
          :href="item.linkUrl"
          v-track.view.click="{ id: 'newArrivalMapArea' + index, common: getMapAreaBiParams(index + 2) }"
        />
      </map>
    </div>
    <div v-if="!cateNoHead" class="first-banner-title">
      <!-- <h3>{{ categoriesBanners.title }}</h3> -->
      <p class="main-title">{{ nl('page_common_new_arrivals_years') }}</p>
      <p class="main-title sub">{{ nl('page_common_new_arrivals_years_sub') }}</p>
    </div>
    <div class="first-banner-container">
      <div v-for="(item, index) in categoriesBanners.list" :key="index" class="first-banner-item">
        <a :href="item.linkUrl" v-track.click="{ common: getBiParams(item) }" class="item-link">
          <img :data-src="addWebpSuffix(item.imgUrl)" :alt="item.alt" class="lazyload" />
          <div class="item-link-title">{{ item.imgText }}</div>
        </a>
        <!-- 热区 lego 配置-->
        <ImageHotSpot :positions="item.positions" ec="newarrivalspage" />
      </div>
    </div>
  </div>
</template>

<script>
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'NewArrivalBanner',
  mixins: [bannerMixins],
  props: {
    categoriesBanners: {
      type: Object,
      default() {
        return {}
      }
    },
    topBanners: {
      type: Object,
      default() {
        return {}
      }
    },
    cateNoHead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newArrivalBanner: (this.topBanners.list && this.topBanners.list[0]) || {}
    }
  },
  watch: {
    topBanners(e) {
      if (e.list) {
        this.newArrivalBanner = JSON.parse(JSON.stringify(e.list[0]))
      }
    }
  },
  mounted() {
    if (this.topBanners.list) {
      this.newArrivalBanner = JSON.parse(JSON.stringify(this.topBanners.list[0]))
    }
    // 不能在这里执行这个方法，因为图片可能还没有加载，这时候计算就会是 infinity
    // this.handleHotMap()
    window.addEventListener('resize', this.handleHotMap)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleHotMap)
  },
  methods: {
    // 热图相关的埋点
    getMapAreaBiParams(i) {
      if (process.server || !this.newArrivalBanner.isHotspot) return
      if (this.newArrivalBanner.isHotspot) {
        return {
          ec: 'Banner',
          el: 'newbanner_' + i
        }
      }
    },
    clickNewArrivalBanner() {
      location.href = this.countryUrl(this.newArrivalBanner.linkUrl)
    },
    // 因为接口返回的热图坐标是相对于图片真实大小的坐标，但是显示时不会正好显示那个大小，
    // 所以要根据当前视图显示比例，动态调整热图坐标数据
    handleHotMap() {
      setTimeout(() => {
        const pageWidth = this.$refs.new_arrival_first_banner.clientWidth // 获取页面宽度
        if (this.topBanners.list) {
          const tempArr = JSON.parse(JSON.stringify(this.topBanners.list))
          for (let i = 0; i < tempArr.length; i++) {
            const ele = tempArr[i]
            if (ele.isHotspot) {
              // 当前视图宽度/图片真实宽度 * 热图的坐标，就可以获取当前视图上热图应该有的坐标
              const ratio = pageWidth / this.$refs.newArrivalBanner.naturalWidth
              if (ele.hotSpotRegion) {
                for (let x = 0; x < ele.hotSpotRegion.length; x++) {
                  const e = ele.hotSpotRegion[x]
                  for (let y = 0; y < e.coordinates.length; y++) {
                    const v = e.coordinates[y]
                    this.newArrivalBanner.hotSpotRegion[x].coordinates[y] = Math.round(v * ratio)
                  }
                }
              }
            }
          }
        }
        this.$forceUpdate()
      }, 100)
    },
    getBiParams(item) {
      if (process.server) return
      return {
        dp: '/all/new-arrivals',
        ec: 'newarrivalspage',
        el: item ? item.imgText : 'newarrivalspage',
        param1: (location && location.href) || '-1',
        param2: this.versionGroup.banner_new_arrival_top
      }
    }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  img {
    width: 100%;
    vertical-align: middle;
    // cursor: pointer;
  }
}
.first-banner-title {
  text-align: center;
  margin: 50px 0;
  .main-title {
    font-family: @font-family;
    font-weight: 300;
    color: var(--color-121212);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 42px;
    line-height: 57px;
    &.sub {
      font-family: @font-family-500;
      text-transform: inherit;
      margin-top: 10px;
      line-height: 22px;
      font-size: 16px;
      letter-spacing: 0;
    }
  }
}
.first-banner-container {
  display: flex;
  .first-banner-item {
    display: inline-block;
    margin-left: 1%;
    width: 24.25%;
    position: relative;
    &:nth-child(1) {
      margin-left: 0;
    }
    .item-link {
      position: relative;
      // display: block;
      color: var(--color-121212);
      font-size: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      img {
        width: 100%;
      }
      &:hover {
        .item-link-title {
          background: var(--color-121212);
          color: #fff;
        }
      }
      .item-link-title {
        flex: 1;
        width: 100%;
        background: var(--color-ede1d3);
        padding: 14px 0;
        font-size: 16px;
        font-family: @font-family-600, sans-serif;
        font-weight: 600;
        color: var(--color-121212);
        text-align: center;
        text-transform: uppercase;
        line-height: 22px;
        word-wrap: break-word;
        word-break: break-word;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
