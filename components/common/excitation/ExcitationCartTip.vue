<template>
  <div v-if="['US', 'CA', 'AU', 'IE', 'GB'].includes(country)" class="excitation-cart-tip">
    <span class="excitation-cart-tip-icon">
      <az-icon icon-class="excitation-cart-bag"></az-icon>
    </span>
    <span class="excitation-cart-tip-text">
      {{ sticker[0] && sticker[0].subText }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ExcitationCartTip',
  languageKeys: [],
  props: {
    sticker: {
      type: [Object, Array],
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
.excitation-cart-tip {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #fbf1e8 85%, rgba(255, 218, 218, 0.7) 100%);
  padding: 5px 10px;
  &-text {
    white-space: nowrap;
  }
  &-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    .az-icon {
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
