<template>
  <div :class="{ 'align-left': tipLink }" class="pay-title">
    <span class="title">{{ title }}</span>
    <span v-if="secureSslShow && country == 'CA'" class="secure-ssl"><i></i> {{ nl('page_checkout_Secure_SSL_Encryption') }}</span>
    <div v-if="btnShow" @click="btnClick" class="title-btn">{{ nl(btnText) }}</div>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    btnShow: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: ''
    },
    tipLink: {
      type: String,
      default: ''
    },
    secureSslShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    btnClick() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
.pay-title {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-cccccc);
  padding-bottom: 5px;
  .title {
    font-size: 16px;
    font-family: @font-family-600;
    color: var(--color-121212);
  }
  .secure-ssl {
    flex: 1;
    text-transform: capitalize;
    font-size: 12px;
    i {
      display: inline-block;
      width: 8px;
      height: 9px;
      margin: 0 8px 0 10px;
      background-image: data-uri('~assets/images/checkout/shield.png');
      background-size: cover;
    }
  }
  .title-btn {
    font-family: @font-family-500;
    color: var(--color-121212);
    text-transform: capitalize;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: @theme;
    }
  }
}
.align-left {
  justify-content: flex-start;
}
.pay-title-tips {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  .tip-icon {
    cursor: pointer;
  }
}
</style>
