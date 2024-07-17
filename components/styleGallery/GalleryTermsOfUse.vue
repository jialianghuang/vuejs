<template>
  <div class="gallery-terms-of-use">
    <span class="title">{{ nl('page_gallery_terms_of_use_text1') }}</span>
    <div class="content">
      <h3>{{ nl('page_gallery_terms_of_use_text2') }}</h3>

      <p>{{ nl('page_gallery_terms_of_use_text3') }}</p>
      <h3>{{ nl('page_gallery_terms_of_use_text4') }}</h3>

      <p>{{ nl('page_gallery_terms_of_use_text5') }}</p>
      <ul>
        <li>• {{ nl('page_gallery_terms_of_use_text6') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text7') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text8') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text9') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text10') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text11') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text12') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text13') }}</li>
      </ul>
      <p>{{ nl('page_gallery_terms_of_use_text14') }}</p>
      <ul>
        <li>• {{ nl('page_gallery_terms_of_use_text15') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text16') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text17') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text18') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text19') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text20') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text21') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text22') }}</li>
        <li>• {{ nl('page_gallery_terms_of_use_text23') }}</li>
      </ul>
      <p>{{ nl('page_gallery_terms_of_use_text24') }}</p>
      <p class="empty-one-line">{{ nl('page_gallery_terms_of_use_text25') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GalleryTermsOfUse',
  props: {
    shareList: {
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
    ...mapState({})
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.gallery-terms-of-use {
  .title {
    display: block;
    text-align: center;
    font-size: 24px;
    font-family: @font-family-600, sans-serif;
    margin-top: 20px;
  }
  .content {
    text-align: left;
    margin: 0px 30px 25px;
    h3 {
      text-align: left;
      font-weight: bold;
      display: block;
      font-size: 16px;
      margin-top: 30px;
      margin-bottom: 13px;
    }
    p {
      font-size: 13px;
      margin-bottom: -8px;
    }

    .empty-one-line {
      margin-top: 18px;
    }

    ul {
      margin: 10px 0 10px 25px;
    }
  }
}
</style>
