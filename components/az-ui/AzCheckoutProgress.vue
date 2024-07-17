<template>
  <div class="checkout-progress">
    <div v-for="item in list" :key="item.id" :class="{ checked: item.id <= progressId }" class="progress">
      <span class="progress-id">{{ item.id }}</span>
      <span class="progress_txt">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzCheckoutProgress',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    progressId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.checkout-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  .progress {
    &.checked {
      .progress-id {
        background: var(--color-121212);
      }
    }
    .progress-id {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #ccc;
      color: #ffffff;
      border-radius: 50%;
      line-height: 20px;
      text-align: center;
      margin-left: 20px;
      margin-right: 10px;
    }
  }
}
</style>
