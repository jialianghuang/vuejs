<template>
  <div class="index-style-gallery">
    <div class="title">
      {{ nl('page_index_style_gallery_title') }}
      <a
        id="browse-the-gallery"
        v-track.view.click="{ common: getBiParams() }"
        :href="countryUrl(`/shop-our-instagram`)"
        class="gallery-entrance"
      >
        {{ nl('page_index_style_gallery_view_all') }}
      </a>
    </div>
    <div ref="foursixty" class="foursixty-container"></div>
  </div>
</template>

<script>
export default {
  name: 'IndexStyleGallery',
  mounted() {
    const scriptEl = document.createElement('script')
    scriptEl.src = '//foursixty.com/media/scripts/fs.slider.v2.5.js'
    scriptEl.setAttribute('data-feed-id', 'azazie_1')
    scriptEl.setAttribute('data-theme', 'slider_v2_5')
    scriptEl.setAttribute('data-open-links-in-same-page', 'true')
    scriptEl.setAttribute('data-cell-size', '20%')
    this.$refs.foursixty.appendChild(scriptEl)
  },
  methods: {
    getBiParams() {
      if (process.server) return
      return {
        dp: 'home',
        ec: 'ShopOurInstagram',
        el: 'view all',
        param1: (location && location.href) || '-1'
      }
    }
  }
}
</script>

<style lang="less">
.fs-has-links::after {
  padding: 17px 25.5px;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.8);
  content: 'SHOP IT';
}
.fs-wrapper {
  height: auto;
}
.fs-entry-container {
  height: 0 !important;
  width: 20% !important;
  padding-top: 20% !important;
}
.fs-wrapper div.fs-text-container .fs-entry-title,
div.fs-detail-title {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
}
div.fs-text-container .fs-entry-date,
div.fs-detail-container .fs-post-info,
div.fs-wrapper div.fs-has-links::after,
.fs-text-product,
.fs-overlink-text {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
}
.fs-slider-next-button,
.fs-slider-prev-button {
  opacity: 1;
  z-index: @popuy-z-index;
}
.fs-wrapper {
  margin: auto;
  // width: calc(100% - 120px);
  width: 100%;
}
.fs-wrapper div.fs-text-container * {
  color: #ffffff;
}
.fs-wrapper div.fs-text-container {
  background-color: rgba(0, 0, 0, 0.8);
  margin: 0px;
}
div.fs-entry-date {
  display: none;
}
div.fs-entry-title {
  display: none;
}
.fs-wrapper div.fs-timeline-entry {
  margin: 4px;
}
.index-style-gallery {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  max-width: 1640px;
  min-width: unset;
  margin: 30px auto 60px;
  .title {
    color: var(--color-121212);
    text-transform: uppercase;
    letter-spacing: 0;
    font-weight: 400;
    font-family: @font-family-500, sans-serif;
    font-size: 24px;
    line-height: 24px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--color-cccccc);
    a {
      display: inline-block;
      float: right;
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 400;
      font-family: @font-family-500, sans-serif;
      color: var(--color-121212);
    }
  }
}
</style>
