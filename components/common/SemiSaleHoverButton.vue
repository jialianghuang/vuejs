<template>
  <div id="isSemiSaleBtn" :class="{ rolling: rolling }" class="hoverBtn">
    <a :href="countryUrl('/all/bridesmaid-dresses')" aria-label="bridesmaid dresses"><img :src="addWebpSuffix(imgSrc)" alt="SemiSale"/></a>
  </div>
</template>

<script>
/**
 * 该组件没有使用
 */
export default {
  name: 'SemiSaleHoverButton',
  data() {
    return {
      startTopValue: 0, // 记录每次开始滚动时到滚动条到顶部的距离
      topValue: 0, // 滚动条到顶部的距离，用于判断是否滚动事件完毕
      interval: null,
      rolling: false
    }
  },
  computed: {
    imgSrc() {
      return this.country == 'CA' ? this.nl('page_image_sale_hover_btn_img1') : this.nl('page_image_sale_hover_btn_img2')
    }
  },
  mounted() {
    // const self = this
    // window.addEventListener('scroll', function() {
    //   const scrollTop = document.querySelector('html').scrollTop
    //   if (!self.rolling) self.rolling = true
    //   if (self.interval == null) {
    //     self.interval = setInterval(function() {
    //       self.ShowImg()
    //     }, 500)
    //   }
    //   self.topValue = scrollTop
    // })
  },
  methods: {
    ShowImg() {
      // 判断此刻到顶部的距离是否和1500ms前的距离相等
      if (document.querySelector('html').scrollTop == this.topValue) {
        this.rolling = false
        clearInterval(this.interval)
        this.interval = null
        this.startTopValue = this.topValue
      }
    }
  }
}
</script>

<style lang="less" scoped>
#isSemiSaleBtn {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: @popuy-z-index;
  margin: -76px 0 0;
  transition: right 0.3s;
  img {
    width: 104px;
    height: 152px;
  }
  &.rolling {
    right: -84px;
  }
}
</style>
