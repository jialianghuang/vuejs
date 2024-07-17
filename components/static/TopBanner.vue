<template>
  <div class="r1">
    <slot name="header"></slot>
    <a
      v-if="topBanner.linkUrl"
      :data-datalayer-category="topBanner.eventCategory"
      :data-datalayer-label="topBanner.eventName"
      :href="countryUrl(topBanner.linkUrl)"
      :target="linkTarget"
      :class="{
        need_datalayer: topBanner.eventCategory && topBanner.eventName
      }"
      :aria-label="topBanner.eventCategory"
    >
      <img :src="replaceImgCdnUrl(topBanner.imgUrl)" alt="img" />
    </a>

    <div v-else>
      <img :src="replaceImgCdnUrl(topBanner.imgUrl)" alt="img" />
    </div>
    <slot name="center"></slot>
  </div>
</template>
<script>
export default {
  name: 'TopBanner',
  props: {
    topBanner: {
      type: Object,
      default() {
        return {}
      }
    },
    linkTarget: {
      type: String,
      default: '_self'
    }
  }
}
</script>

<style lang="less" scoped>
.r1 {
  text-align: center;
  margin-bottom: 24px;
  position: relative;

  img {
    max-width: 100%;
  }
}
</style>
