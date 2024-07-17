<template>
  <div @click="click" class="sample-confirm">
    <az-icon :icon-class="selected ? 'iconcheckbox-select' : 'iconcheckbox'"></az-icon>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'SampleConfirm',
  languageKeys: ['page_sample_understand_final', 'page_sample_agree_rent', 'page_customizable_agree'],
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    text() {
      if (this.baseInfo.customizable) {
        return this.nl('page_customizable_agree')
      }
      if (this.baseInfo.dressType == 'clearance' || this.baseInfo.dressType == 'outlet' || this.baseInfo.isFinalSale) {
        return this.nl('page_sample_understand_final')
      }
      return this.nl('page_sample_agree_rent')
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.sample-confirm {
  margin-top: 17px;
  font-family: @font-family-600, sans-serif;
  cursor: default;
  display: flex;
  align-items: center;
  .az-icon {
    margin-right: 3px;
  }
}
</style>
