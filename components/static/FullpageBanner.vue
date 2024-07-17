<template>
  <div class="brides_nav_box">
    <div class="banner_link_box">
      <a
        v-if="topBanner.banner"
        :data-datalayer-category="topBanner.banner.eventCategory"
        :data-datalayer-label="topBanner.banner.eventName"
        :href="countryUrl(topBanner.banner.linkUrl)"
        :class="{ need_datalayer: topBanner.banner.eventName && topBanner.banner.eventCategory }"
        :target="linkTarget"
        :aria-label="topBanner.banner.eventName"
        class="banner_link"
      >
        <img :src="replaceImgCdnUrl(topBanner.banner.imgUrl)" :alt="topBanner.banner.imgAlt" />
      </a>
      <slot name="btn"></slot>
    </div>
    <slot name="menu"></slot>
  </div>
</template>

<script>
export default {
  name: 'FullpageBanner',
  props: {
    topBanner: {
      type: Object,
      default() {
        return {}
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  }
}
</script>

<style lang="less" scoped>
.brides_nav_box {
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  &:after {
    display: block;
    content: '';
    padding-bottom: 41.66%;
  }
  .banner_link_box {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    .banner_link {
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .other_link_box {
      position: absolute;
      bottom: 13%;
      a {
        display: block;
        text-align: center;
      }
      a.shop_all {
        // width: 300px;
        height: 50px;
        background: #666;
        border-radius: 2px;
        color: #fff;
        line-height: 50px;
        font-size: 14px;
        font-family: @font-family-600;
        padding: 0 20px;
        &:hover {
          background: var(--color-121212);
        }
      }
      a.try_before_you_buy {
        margin-top: 10px;
        width: 300px;
        height: 50px;
        background: #fff;
        opacity: 0.8;
        border-radius: 2px;
        color: var(--color-121212);
        line-height: 50px;
        font-size: 14px;
        font-family: @font-family-500;
      }
    }
  }
}
</style>
