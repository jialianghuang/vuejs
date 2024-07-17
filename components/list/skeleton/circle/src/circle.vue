<template>
  <div :style="{ margin, flex, width: diameter, height: diameter, opacity }" class="circle"></div>
</template>

<script>
export default {
  name: 'SkeletonCircle',
  props: {
    margin: {
      type: String,
      default: ''
    },
    flex: {
      type: String,
      default: ''
    },
    // 直径
    diameter: {
      type: String,
      default: ''
    },
    opacity: {
      type: String,
      default: '1'
    }
  }
}
</script>

<style lang="less" scoped>
.circle {
  flex: 0 0 auto;
  background-color: #efefef;
  border-radius: 50%;
}
</style>
