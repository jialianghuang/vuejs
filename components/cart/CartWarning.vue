<template>
  <div v-if="cartWarningDec && Object.keys(cartWarningDec).length" class="cart-warning">
    <div v-for="(item, key) in cartWarningDec" :key="key" class="error-item">{{ item.msg }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CartWarning',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('cart', ['cartWarningDec'])
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.cart-warning {
  width: 100%;
  border: 1px solid #d77ea9;
  background: var(--color-f1e9e6);
  color: var(--color-121212);
  font-size: 13px;
  padding: 8px;
  // width: 1140px;
  margin: 8px auto 15px;
  box-sizing: border-box;
}
</style>
