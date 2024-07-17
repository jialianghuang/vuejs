<template>
  <div class="season_list">
    <div v-for="(item, index) in lists" :key="index" class="season_item">
      <a
        :data-datalayer-category="item.eventCategory"
        :data-datalayer-label="item.eventName"
        :href="countryUrl(item.linkUrl)"
        :class="{
          need_datalayer: item.eventCategory && item.eventName
        }"
        :target="linkTarget"
        :aria-label="item.eventCategory"
      >
        <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.alt" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopbySeaonCard',
  props: {
    lists: {
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
.season_list {
  display: flex;
  justify-content: space-around;
  align-content: center;
  flex-wrap: wrap;
  padding: 30px 30px 0;
  .season_item {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    width: 506px;
    margin-top: 50px;
    img {
      display: inline-block;
      width: 506px;
      height: 506px;
    }
  }
}
</style>
