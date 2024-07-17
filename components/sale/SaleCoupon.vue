<template>
  <div class="sale-coupon">
    <div class="coupon-list">
      <!-- promotion活动配置banner -->
      <div v-for="(banner, index) in activityBanners" :key="index" class="coupon-item">
        <a
          v-if="banner.linkUrl"
          :href="countryUrl(banner.linkUrl)"
          :aria-label="banner.alt || 'sale coupon img' + index"
          :target="banner.newWindows ? '_blank' : '_self'"
        >
          <img :src="banner.imgUrl" :alt="banner.alt || 'sale coupon img' + index" class="activity-banner" />
        </a>
        <img v-else :src="banner.imgUrl" :alt="banner.alt || 'sale coupon img' + index" class="activity-banner" />
        <!-- 热区 lego 配置-->
        <ImageHotSpot :positions="banner.positions" ec="allsale" />
      </div>
      <template v-for="(item, index) in couponActivity">
        <div :key="`${item.activitySubject}_${index}`" class="coupon-item">
          <img :src="addWebpSuffix(item.image)" :alt="item.title" class="img" />
          <div class="content">
            <div v-html="item.title" class="title"></div>
            <div v-html="item.subTitle" class="sub-title"></div>
          </div>
          <div
            @click="handleClick(item)"
            v-track.viewOnce.click="{ id: 'sale-coupon-button', common: { ec: 'allsale', el: `${item.activitySubject}_button` } }"
            v-html="item.buttonText"
            class="btn"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'SaleCoupon',
  components: {},
  mixins: [bannerMixins],
  props: {
    couponActivity: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    activityBanners() {
      let activityBanners = []
      for (const key in this.activityInfo) {
        const activityNow = this.activityInfo[key]
        if (activityNow.banner && activityNow.banner.promotionBanner) {
          activityBanners = activityBanners.concat(activityNow.banner.promotionBanner)
          for (const i in activityBanners) {
            const bannerData = activityBanners[i]
            // 因为ga打点需要,所以这里把促销活动的id和name也加进去
            if (activityNow.base) {
              bannerData.activityId = activityNow.base.activityId
              bannerData.activityName = activityNow.base.name
            }
          }
        }
      }
      return activityBanners
    }
  },
  methods: {
    handleClick(item) {
      // 订单追踪
      this.setOrderSourceFlag('allsale_promotions', true)
      // 根据不同的coupon处理
      if (item.type == 'newUserCoupon') {
        this.$emit('openNewUserCoupon')
      } else if (item.type === 'afterPay') {
        this.$store.commit('setAfterpayLayerShow', true)
      } else if (item.type === 'couponWheel') {
        this.$emit('handleCouponWheel')
      } else if (item.type === 'supportUrl') {
        window.open(this.getSupportUrl(item.url, item.url))
      } else {
        window.open(this.countryUrl(item.url))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sale-coupon {
  color: var(--color-121212);
  padding: 0 0 40px;
  .coupon-list {
    .coupon-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-f9f9f9);
      margin-bottom: 20px;
      position: relative;
      a {
        position: relative;
      }
      .activity-banner {
        width: 100%;
      }
      .img {
        width: 260px;
        height: 200px;
        vertical-align: middle;
      }
      .content {
        flex: 1;
        padding: 10px 30px;
        .title {
          font-size: 24px;
          line-height: 33px;
          font-family: @font-family-600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .sub-title {
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.02em;
          color: var(--color-121212);
          margin-top: 10px;
        }
      }
      .btn {
        width: 250px;
        height: 50px;
        line-height: 50px;
        background: var(--color-121212);
        color: #fff;
        font-size: 14px;
        font-family: @font-family-600;
        text-align: center;
        margin-right: 30px;
        cursor: pointer;
        text-transform: uppercase;
      }
    }
  }
}
</style>
