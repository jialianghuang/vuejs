<template>
  <div>
    <div v-for="(item, index) in lists" :key="index" :class="[itemClassName]">
      <a
        :data-datalayer-category="item.eventCategory"
        :data-datalayer-label="item.eventName"
        :href="countryUrl(item.linkUrl)"
        :class="{
          need_datalayer: item.eventCategory && item.eventName
        }"
        :target="linkTarget"
        :aria-label="item.imgAlt"
      >
        <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgOneitemList',
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
    },
    itemClassName: {
      type: String,
      default: 'one-item'
    }
  }
}
</script>

<style lang="less" scoped>
.header-widgets {
  border: none;
}
.one-item {
  margin: 105px auto;
}
.veil-guide {
  margin-bottom: 15px;
}
a {
  color: inherit;
  text-decoration: none;
}
img {
  width: 100%;
  vertical-align: middle;
  background: #ededf0;
}
</style>
