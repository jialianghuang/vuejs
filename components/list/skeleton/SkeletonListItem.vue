<template>
  <div class="skeleton-list-item">
    <div class="img-box">
      <skeleton-rect class="img"></skeleton-rect>
    </div>
    <skeleton-rect style="height: 28px;margin-top: 10px;"></skeleton-rect>
    <skeleton-rect style="height: 28px;margin-top: 10px;"></skeleton-rect>
  </div>
</template>

<script>
import SkeletonRect from '@/components/list/skeleton/rect/index.js'
export default {
  name: 'SkeletonListItem',
  components: {
    SkeletonRect
  }
}
</script>

<style lang="less" scoped>
.skeleton-list-item {
  display: inline-block;
  margin-top: 9px;
  margin-bottom: 5px;
  .img-box {
    position: relative;
    height: 0;
    width: 100%;
    padding-top: 138.13%;
    .img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
  }
}
.skeleton-column,
.skeleton-row {
  display: flex;
}
.skeleton-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.skeleton-column {
  flex-direction: column;
  align-items: center;
}
</style>
