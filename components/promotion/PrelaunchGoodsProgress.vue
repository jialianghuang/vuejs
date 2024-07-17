<template>
  <div :class="[from, { 'is-bridal': isBridal }]" class="goods-progress-box">
    <div
      :style="{ width: preSaleGoodsProgress.progress * 1 + '%' }"
      :class="{ full: preSaleGoodsProgress.progress * 1 == 100 }"
      class="goods-progress-bar"
    ></div>
    <div v-if="preSaleGoodsProgress.showPercent" class="goods-progress-txt goods-progress-txt-1">
      {{ `${preSaleGoodsProgress.progress}% ${nl('page_common_sold')}` }}
    </div>
    <div v-else class="goods-progress-txt goods-progress-txt-2">
      <az-icon class="almost-sold-out-icon" icon-class="icon-a-AlmostSoldOut"></az-icon>{{ nl('page_preorder_progress_almost_sold_out') }}
    </div>

    <a
      v-if="$route.name !== 'landingPage-preorderList'"
      :href="countryUrl('/all/special-occasion-dresses/kendall-kylie')"
      v-track.viewOnce.click="{ id: `${baseInfo.goodsId}_${baseInfo.color}_progress`, common: getBiParamsKKPre() }"
      target="_blank"
      class="progress-arraw"
      aria-label="progress arraw"
    >
      <az-icon class="progress-icon" icon-class="icon-xxy_arrow_right_l" />
    </a>
  </div>
</template>
<script>
export default {
  name: 'PrelaunchGoodsProgress',
  languageKeys: ['page_common_sold', 'page_preorder_progress_almost_sold_out'],
  props: {
    preSaleGoodsProgress: {
      type: Object,
      default: () => {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    getBiParamsKKPre() {
      if (process.server) return
      return {
        ec: 'kkdetail',
        el: 'progress',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.baseInfo.color
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.goods-progress-box {
  width: 100%;
  height: 18px;
  background: #fde9e9;
  border-radius: 80px;
  position: relative;
  &.is-bridal {
    background: @bg-color;
    .goods-progress-bar {
      background: @theme-color;
    }
  }
  .goods-progress-bar {
    position: absolute;
    left: 0;
    top: 0px;
    border-radius: 80px 0 0 80px;
    background: #ffabab;
    height: 100%;
    width: 0%;
    transition: width 0.5s linear 0.5s;
    &.full {
      border-radius: 80px;
    }
  }
  .goods-progress-txt {
    position: absolute;
    font-size: 14px;
    line-height: 18px;
  }
  .goods-progress-txt-1 {
    left: 10px;
  }
  .goods-progress-txt-2 {
    left: 0px;
    bottom: 0px;
    .almost-sold-out-icon {
      width: 22px;
      height: 27px;
      margin-right: 10px;
      vertical-align: bottom;
    }
  }
  &.product {
    height: 15px;
    .goods-progress-txt {
      font-size: 12px;
      line-height: 15px;
    }
    .almost-sold-out-icon {
      width: 16px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .progress-arraw {
    position: absolute;
    right: -6px;
    transform: translate(100%, -50%);
    top: 50%;
    font-size: 10px;
    fill: var(--color-666666);
    color: currentColor;
  }
}
</style>
