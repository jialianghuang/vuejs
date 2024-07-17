<template>
  <div :id="idName" class="backtop">
    <div
      v-if="type == 'static'"
      @click="backToTop"
      class="top-bottom need_datalayer"
      data-datalayer-category="DetailPage_AddtoBag"
      data-datalayer-label="DetailPage_BacktoTop_Detail_Click"
    >
      {{ nl('page_back_to_top') }}
    </div>
    <div v-else v-show="showBtn" :class="{ 'bridal-icon-box': isBridal }" @click="backToTop" class="icon-box scroll-to-top">
      <az-icon icon-class="icon-top" class="icon-top"></az-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackToTop',
  languageKeys: ['page_back_to_top', 'page_image_back_to_top_img'],
  props: {
    idName: {
      type: String,
      default() {
        return 'backtop'
      }
    },
    type: {
      type: String,
      default() {
        return 'fixed'
      }
    }
  },
  data() {
    return {
      scrollIndex: true,
      showBtn: true
    }
  },
  mounted() {
    const self = this
    window.addEventListener('scroll', function() {
      if (self.type == 'static') {
        self.staticType()
      } else {
        self.fixedType()
      }
    })
  },
  methods: {
    backToTop() {
      this.buryPoint(this, 'event', {
        ec: 'backtotop',
        el: 'backtotop',
        ea: 'click'
      })
      window.scroll(0, 0)
    },
    staticType() {
      const topBottomDom = document.querySelector('.top-bottom')
      const a = (topBottomDom && topBottomDom.offsetTop) || 0
      if (a >= document.querySelector('html').scrollTop && a < document.querySelector('html').scrollTop + window.innerHeight) {
        if (this.scrollIndex) {
          this.scrollIndex = false
          this.setDataLayer('DetailPage_AddtoBag', 'view', 'DetailPage_BacktoTop_Detail_View')
        }
      }
    },
    fixedType() {
      if (document.querySelector('html').scrollTop <= 20) {
        this.showBtn = false
      } else {
        this.showBtn = true
      }
    },
    getStyle() {
      return {
        backgroundImage: `url(${this.nl('page_image_back_to_top_img')})`
      }
    }
  }
}
</script>

<style lang="less" scoped>
#goods-backtop {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  .top-bottom {
    min-width: 180px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid rgba(204, 204, 204, 1);
    font-size: 14px;
    font-family: @font-family-600;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
    padding: 0 30px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    &:hover {
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    }
  }
}
#backtop {
  position: absolute;
}
#top {
  position: fixed;
  right: 20px;
  bottom: 96px;
  z-index: @fixed-z-index;
  cursor: pointer;
  background-image: url('https://cdn-1.azazie.com/upimg/userfiles/images/ff/a8/fb395ae6593066c900a0996d7ff8ffa8.png');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25) !important;
  &:hover {
    opacity: 0.95;
  }
}
.scroll-to-top {
  position: fixed;
  right: 20px;
  bottom: 96px;
  z-index: @position-z-index;
  cursor: pointer;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  background: var(--color-f1e9e6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  &:hover {
    opacity: 0.95;
  }
  .icon-top {
    fill: var(--color-121212);
    width: 23px;
    height: 19px;
  }
  &.bridal-icon-box {
    background: #fff;
  }
}
</style>
