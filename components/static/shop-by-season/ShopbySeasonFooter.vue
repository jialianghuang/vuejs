<template>
  <div class="other_seasons">
    <h3 v-if="title" class="module_name">{{ title }}</h3>
    <div class="season_show">
      <a
        v-for="(item, index) in lists"
        :key="index"
        :data-datalayer-category="item.eventCategory"
        :data-datalayer-label="item.eventName"
        :href="countryUrl(item.linkUrl)"
        :class="{
          need_datalayer: item.eventCategory && item.eventName,
          no_margin_right: (index + 1) % 3 === 0
        }"
        :target="linkTarget"
        :aria-label="item.eventCategory"
      >
        <img :src="replaceImgCdnUrl(item.imgSrc)" :alt="item.imgAlt" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopbySeaonFooter',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    linkTarget: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.other_seasons {
  margin-top: 60px;
  .season_show {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 5px;
  }
  a {
    margin-right: 20px;
    &.no_margin_right {
      margin-right: 0;
    }
    img {
      width: 364px;
      height: 220px;
    }
  }
}
</style>
