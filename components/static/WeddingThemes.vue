<template>
  <div class="wedding_themes_wrapper">
    <h3>{{ nl(topBanner.title) }}</h3>
    <div class="wedding_themes_desc">{{ nl(topBanner.text) }}</div>
    <div class="theme_list">
      <div v-for="(item, index) in midBanners" :key="index" class="theme_item">
        <div class="img_and_copywriting">
          <a
            :href="countryUrl(item.linkUrl)"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :class="{
              need_datalayer: item.eventCategory && item.eventName
            }"
            :target="linkTarget"
            :aria-label="item.eventCategory"
          >
            <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
          </a>
          <a
            :href="countryUrl(item.linkUrl)"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :class="{
              need_datalayer: item.eventCategory && item.eventName
            }"
            :target="linkTarget"
          >
            <h4>{{ nl(item.header) }}</h4>
          </a>
          <div
            v-html="unescape(item.title)"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :class="{
              need_datalayer: item.eventCategory && item.eventName
            }"
            class="wedding_themes_desc"
          ></div>
        </div>
        <a
          :href="countryUrl(item.linkUrl)"
          :data-datalayer-category="item.eventCategory"
          :data-datalayer-label="item.eventName"
          :class="{
            need_datalayer: item.eventCategory && item.eventName
          }"
          :target="linkTarget"
          class="link_btn"
          >{{ nl(item.text) }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeddingThemes',
  props: {
    topBanner: {
      type: Object,
      default() {
        return {}
      }
    },
    midBanners: {
      type: Array,
      default() {
        return []
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
.wedding_themes_wrapper {
  width: 1132px;
  margin: 50px auto 100px;
  h3 {
    margin-bottom: 10px;
    font-size: 26px;
    font-family: Libre Baskerville Regular;
    color: var(--color-121212);
    line-height: 26px;
    cursor: default;
    font-weight: normal;
  }
  .wedding_themes_desc {
    font-size: 13px;
    font-family: @font-family-500;
    color: rgba(51, 51, 51, 1);
    line-height: 21px;
    cursor: default;
  }
  h4 {
    margin-top: 42px;
    font-size: 16px;
    font-family: @font-family-600;
    color: var(--color-121212);
    line-height: 16px;
    cursor: default;
    font-weight: normal;
  }
  .theme_list {
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
    .theme_item {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      width: 550px;
      margin: 30px 0 20px;
      img {
        display: inline-block;
        width: 550px;
        height: 340px;
      }
      h4 {
        margin: 20px 0 6px;
        cursor: pointer;
      }
      .wedding_themes_desc {
        color: #666;
      }
      a.link_btn {
        display: inline-block;
        width: 280px;
        height: 40px;
        margin-top: 20px;
        background: var(--color-121212);
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 14px;
        font-family: @font-family-600;
        &:hover {
          background: var(--color-1e1e1e);
        }
      }
    }
  }
}
</style>
