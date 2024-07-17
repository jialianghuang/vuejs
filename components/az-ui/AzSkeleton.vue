<template>
  <div class="skeleton-list">
    <div v-for="(item, index) in list" :key="index" :style="{ width, height, margin }" class="skeleton-item"></div>
  </div>
</template>
<script>
/** 骨架占位loading */
export default {
  name: 'AzSkeleton',
  props: {
    width: {
      type: String,
      default: '166px'
    },
    height: {
      type: String,
      default: '230px'
    },
    margin: {
      type: String,
      default: '15px 7.5px 0'
    },
    num: {
      type: Number,
      default: 3
    }
  },
  computed: {
    list() {
      return new Array(this.num).fill(1)
    }
  }
}
</script>
<style lang="less" scoped>
.skeleton-list {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 15px);
  margin-left: -7.5px;
  margin-right: -7.5px;
  .skeleton-item {
    background: #f1f1f1;
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: linear-gradient(to right, var(--color-eeeeee) 8%, #dddddd 18%, var(--color-eeeeee) 33%);
    background-size: 800px 104px;
    height: 179.24px;
    position: relative;
  }
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
</style>
