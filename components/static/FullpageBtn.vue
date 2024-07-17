<template>
  <div v-if="btns && btns.length" class="other_link_box">
    <a
      v-for="(item, index) in btns"
      :key="index"
      :class="{ need_datalayer: item.eventName && item.eventCategory, [item.className]: true }"
      :href="countryUrl(item.linkUrl)"
      :data-datalayer-category="item.eventCategory"
      :data-datalayer-label="item.eventName"
      :target="linkTarget"
      >{{ item.title }} ></a
    >
  </div>
</template>

<script>
export default {
  name: 'FullpageBtn',
  props: {
    btns: {
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
</style>
