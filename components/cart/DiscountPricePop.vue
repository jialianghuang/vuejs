<template>
  <div @mouseenter="handleOver()" class="hover-tips discount-price-pop">
    <az-icon
      v-track.view.click="{
        common: getBiParams(ec, el)
      }"
      :icon-class="questionIcon"
      class="tip-icon"
    ></az-icon>
    <div class="discount-price-box">
      <!-- 气泡上的小三角 -->
      <div class="pop-triangle-box-1"></div>
      <div class="pop-triangle-box-2"></div>
      <div class="discount-price-content">
        <template v-for="item in showBonusDetail">
          <div :key="item.key" :class="[item.key]" class="item clearfix">
            <span class="item-left fl">{{ item.name }}</span>
            <div class="item-right fr">
              {{ ['originalPrice', 'subtotal'].includes(item.key) ? item.showPrice : `-${item.showPrice}` }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DiscountPricePop',
  props: {
    popTips: {
      type: String,
      default: ''
    },
    ec: {
      type: String,
      default: ''
    },
    el: {
      type: String,
      default: ''
    },
    bonusDetail: {
      type: Array,
      default() {
        return []
      }
    },
    questionIcon: {
      type: String,
      default: 'icon-gwc-_question_'
    }
  },
  data() {
    return {}
  },
  computed: {
    showBonusDetail() {
      // 控制数据，保证数组第一项是originalPrice，最后一项是subtotal
      if (!this.bonusDetail || !Object.keys(this.bonusDetail).length) return
      const showBonusDetail = JSON.parse(JSON.stringify(this.bonusDetail))
      let originalPriceItem = {}
      let subtotalItem = {}
      showBonusDetail.forEach((item, index) => {
        if (['originalPrice', 'subtotal'].includes(item.key)) {
          if (item.key == 'originalPrice') {
            originalPriceItem = item
          } else if (item.key == 'subtotal') {
            subtotalItem = item
          }
          showBonusDetail.splice(index, 1)
        }
      })
      showBonusDetail.unshift(originalPriceItem)
      showBonusDetail.push(subtotalItem)
      return showBonusDetail
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      if (!ec || !el) return
      const obj = {
        ec,
        el
      }
      return obj
    },
    handleOver() {
      this.ec && this.el && this.setPoint(this.ec, this.el, 'click')
    }
  }
}
</script>
<style lang="less" scoped>
.hover-tips {
  display: inline-block;
  position: relative;
  margin-left: 2px;
  .tip-icon {
    cursor: pointer;
    font-size: 13px;
  }

  .discount-price-box {
    display: none;
    border: 1px solid #e1e1e1;
    position: absolute;
    background: #ffffff;
    padding: 15px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    text-align: center;
    line-height: 18px;
    border-radius: 2px;
    z-index: @z-index-5;
    width: 280px;
    top: 30px;
    text-transform: initial;
    text-align: left;
    left: 50%;
    transform: translateX(-50%);
    .pop-triangle-box-1 {
      display: block;
      border-width: 10px;
      position: absolute;
      top: -20px;
      border-style: dashed dashed solid;
      border-color: transparent transparent #e1e1e1;
      font-size: 0;
      line-height: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .pop-triangle-box-2 {
      display: block;
      border-width: 10px;
      position: absolute;
      top: -18px;
      border-style: dashed dashed solid;
      border-color: transparent transparent #ffffff;
      font-size: 0;
      line-height: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .discount-price-content {
      .item {
        font-size: 13px;
        font-family: @font-family-500;
        color: var(--color-121212);
        line-height: 20px;
        margin-top: 5px;
        &:first-child {
          margin-top: 0;
        }
        .item-right {
          font-family: @font-family-600;
          color: @theme-color;
        }
        &.originalPrice,
        &.subtotal {
          font-family: @font-family-600 !important;
          .item-right {
            color: var(--color-121212) !important;
          }
        }
        &.subtotal {
          border-top: 1px solid #ccc;
          margin-top: 10px;
          padding-top: 5px;
        }
      }
    }
  }

  &:hover {
    .discount-price-box {
      display: block;
    }
  }
}
</style>
