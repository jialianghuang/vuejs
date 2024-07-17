<template>
  <div v-if="lists.length" class="growns_under_price">
    <a
      v-for="(item, index) in lists"
      :key="index"
      :href="countryUrl(item.linkUrl)"
      :data-datalayer-category="item.eventCategory"
      :data-datalayer-label="item.eventName"
      :class="{ need_datalayer: item.eventCategory && item.eventName }"
      :target="linkTarget"
    >
      <span>{{ item.title }}</span>
      <span class="price">{{ item.text }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'GrownsUnderPrice',
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
.growns_under_price {
  display: flex;
  justify-content: space-between;
  width: 1132px;
  margin: 60px auto 80px;
  a {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 253px;
    height: 114px;
    background: #f8cbd1;
    box-shadow: 4px 4px 10px rgba(207, 139, 148, 0.4);
    color: #fff;
    font-size: 20px;
    line-height: 20px;
  }
  span.price {
    margin-top: 20px;
    font-size: 36px;
    font-family: @font-family-600;
    line-height: 36px;
  }
}
</style>
