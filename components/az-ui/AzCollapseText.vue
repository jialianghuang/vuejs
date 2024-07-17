<template>
  <div ref="CollapseBody" :class="{ 'collapse-body-hidden': !hidden, 'animate-collapse': collapse }" class="collapse-body">
    <div><slot></slot></div>
  </div>
</template>
<script>
export default {
  name: 'AzCollapseText',
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hidden: false
    }
  },
  watch: {
    collapse: {
      immediate: true,
      deep: true,
      handler(val) {
        this.hidden = val
        if (val) this.hidden = false
        this.$nextTick(() => {
          setTimeout(() => {
            if (val) this.hidden = true
          }, 200)
          this.collapseHandle()
        })
      }
    }
  },
  methods: {
    collapseHandle() {
      const collapseBody = this.$refs.CollapseBody
      if (!collapseBody) return
      const collapseBodyHeight = collapseBody.childNodes[0].offsetHeight
      collapseBody.style.height = collapseBodyHeight + 'px'
      console.log(collapseBody.offsetHeight) // 不能去掉
      if (collapseBody.offsetHeight === 0 && this.collapse) {
        collapseBody.style.height = collapseBodyHeight + 'px'
        setTimeout(() => {
          collapseBody.style.height = 'auto'
        }, 200)
      } else {
        collapseBody.style.height = '0px'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.collapse-body {
  height: 0;
  transition: height 0.2s ease-in-out, transform 0.2s ease-in-out;
  transform: translateY(-15px);
  overflow: hidden;
  &.animate-collapse {
    transform: translateY(0px);
  }
}
</style>
