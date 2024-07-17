<template>
  <div v-if="categoriesBanners && categoriesBanners.list && categoriesBanners.list.length" class="sale-first-banner">
    <div v-if="jsKey != 'cybermonday-landing-page'" class="title-banner">
      <img v-if="categoriesBanners.titleThumb" :src="addWebpSuffix(categoriesBanners.titleThumb)" alt="first title banner" />
      <common-lazy-module v-else :radio="0.295" :hasSkeletonTitle="false"></common-lazy-module>
    </div>
    <div class="first-banner-container">
      <div v-for="(item, index) in categoriesBanners.list" :key="index" class="first-banner-item">
        <sale-banner-item :item="item" :keyStr="`firstbanner_${index}`" :index="index" :isFirstBanner="true" class="item-link" />
      </div>
    </div>
    <!-- <div v-else class="ca-banner">
      <sale-banner-item
        v-for="(item, index) in categoriesBanners.list"
        :key="index"
        :item="item"
        :keyStr="`firstbanner_ca`"
        :index="index"
        :isFirstBanner="true"
        class="item-link"
      />
    </div> -->
  </div>
</template>

<script>
import SaleBannerItem from '@/components/sale/SaleBannerItem'
import CommonLazyModule from '@/components/common/CommonLazyModule'
export default {
  name: 'SaleFirstBanner',
  components: { SaleBannerItem, CommonLazyModule },
  props: {
    categoriesBanners: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      imgReady: false
    }
  },
  created() {
    // this.preLoadImage()
  },
  mounted() {},
  methods: {
    preLoadImage() {
      if (!this.categoriesBanners || !this.categoriesBanners.titleThumb) return false
      const imageList = [this.addWebpSuffix(this.categoriesBanners.titleThumb)]
      let num = 0
      imageList &&
        imageList.map((url) => {
          const img = new Image()
          img.src = url
          img.onload = () => {
            num = num + 1
            if (num == imageList.length) {
              this.imgReady = true
            }
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.sale-first-banner {
  width: 100%;
  .title-banner {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .first-banner-container {
    margin-top: 46px;
    display: flex;
    .first-banner-item {
      display: inline-block;
      margin-left: 2%;
      width: 32%;
      &:nth-child(1) {
        margin-left: 0;
      }
      .item-link {
        position: relative;
        display: block;
        color: var(--color-121212);
        font-size: 0;
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
        }
      }
    }
  }
  .ca-banner {
    width: 100%;
    margin-top: 47px;
  }
  /deep/ .common-skeleton {
    padding: 0;
  }
}
</style>
