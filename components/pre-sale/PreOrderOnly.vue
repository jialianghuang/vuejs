<template>
  <div v-if="showText" class="pre-order-only">
    <p class="pre-order-only-text">
      <span>{{ showText }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'PreOrderOnly',
  languageKeys: ['page_common_sod_preorder_text2', 'page_common_sod_preorder_text10', 'page_common_sod_preorder_text11'],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    showText({ type, nl }) {
      if (!type) return null
      const textObj = {
        made_to_order: nl('page_common_sod_preorder_text10'),
        limited_stock: nl('page_common_sod_preorder_text11')
      }
      return textObj[type] || null
    }
  }
}
</script>

<style lang="less" scoped>
.pre-order-only {
  display: flex;
  justify-content: flex-end;
  height: 22px;
  .pre-order-only-text {
    box-sizing: border-box;
    padding: 2px 15px 2px 5px;
    margin-left: 5px;
    clip-path: polygon(0% 0%, 100% 0, 92% 50%, 100% 100%, 0% 100%);
    background-color: #fef0f3;
    max-width: fit-content;
    font-size: 13px;
    line-height: 18px;
    color: @theme;
    span {
      text-transform: capitalize;
    }
  }
}
</style>
