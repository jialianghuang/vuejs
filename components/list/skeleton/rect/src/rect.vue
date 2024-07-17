<template>
  <div :style="{ margin, flex, width, opacity }" class="rect"></div>
</template>

<script>
export default {
  name: 'SkeletonRect',
  props: {
    margin: {
      type: String,
      default: ''
    },
    flex: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    opacity: {
      type: String,
      default: '1'
    }
  }
}
</script>

<style lang="less" scoped>
.rect {
  flex: 0 0 auto;
  background-color: #efefef;
  border-radius: 2px;
}
</style>
