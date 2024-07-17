<template>
  <div v-track.view.click="{ common: { ec: 'alterations', el: 'reviewlabel' } }" class="refund-label">
    <ul>
      <li v-for="(item, index) in options" :key="index" :class="{ active: item.selected }" @click="handleClick(item)">{{ item.name }}</li>
    </ul>
  </div>
</template>
<script>
/**
 * 补修费提交评价标签功能组件
 * 目前用在/order/alteration_reimbursement页
 */
export default {
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick(e) {
      this.$emit('select', e)
    }
  }
}
</script>
<style lang="less" scoped>
.refund-label {
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
      font-size: 13px;
      line-height: 33px;
      height: 35px;
      padding: 0px 15px;
      background: var(--color-f9f9f9);
      border-radius: 4px;
      font-family: @font-family-600;
      margin-right: 10px;
      margin-top: 10px;
      box-sizing: border-box;
      cursor: pointer;
      border: 1px solid var(--color-f9f9f9);
      &.active,
      &:hover {
        color: @theme-color;
        border-color: @theme-color;
      }
      &:last-of-type {
        margin-right: 0px;
      }
    }
  }
}
</style>
