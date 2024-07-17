<template>
  <div class="az-with-code-box">
    <p class="with-code-box">{{ code }}</p>
  </div>
</template>

<script>
export default {
  name: 'AzDiscount',
  props: {
    code: {
      type: String,
      default() {
        return ''
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.az-with-code-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.with-code-box {
  min-width: 82px;
  height: 18px;
  line-height: 18px;
  color: @theme-color;
  padding: 0 7px;
  position: relative;
  text-align: left;
  white-space: nowrap;
  background: @btn-light-hover-color;
  border-radius: 12px;
}
img {
  height: 18px;
  vertical-align: top;
}
</style>
