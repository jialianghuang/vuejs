<template>
  <svg @click="click" class="az-icon">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'AzIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    }
    // iconColor: {
    //   type: String,
    //   default: 'unset'
    // }
  },
  computed: {
    iconName() {
      return `#${this.iconClass}`
    }
  },
  methods: {
    click(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="less">
.az-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
