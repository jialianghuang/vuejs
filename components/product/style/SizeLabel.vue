<template>
  <div :class="['size-label', { from_dialog: isDialogCustomSize }]">
    <div v-if="!isDialogCustomSize" class="size-title">{{ nl('page_common_size') }}</div>
    <div v-if="hasSizeChart" class="size-chart">
      <template v-if="!isDialogCustomSize">(</template><az-icon icon-class="icon-xxy_what_size_am_I"></az-icon>
      <span @click="showSizeChartLayer" class="size-chart-btn">{{ nl('page_common_size_ques') }}</span
      ><template v-if="!isDialogCustomSize">)</template>
    </div>
    <SizeRecommendLabel />
  </div>
</template>

<script>
import SizeRecommendLabel from '@/components/product/style/SizeRecommendLabel'
export default {
  name: 'SizeLabel',
  languageKeys: ['page_common_size', 'page_common_size_ques', ...SizeRecommendLabel.languageKeys],
  components: {
    SizeRecommendLabel
  },
  props: {
    isStockGoods: {
      type: Boolean,
      default: false
    },
    isGroomsmen: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isDialogCustomSize: {
      type: Boolean,
      default: false
    },
    hasSizeChart: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.hasSizeChart) {
      this.setPoint('view')
    }
  },
  methods: {
    setPoint(ea) {
      this.buryPoint(this, 'event', {
        ec: 'size',
        el: 'chart',
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    showSizeChartLayer() {
      this.setPoint('click')
      this.$store.commit('product/setSizeChartLayerShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
.size-label {
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  &.from_dialog .size-chart {
    margin-top: 10px;
    margin-left: 0;
    .size-chart-btn {
      margin-left: 5px;
    }
  }
  .size-title {
    text-transform: uppercase;
  }
  .size-chart {
    color: @title-color;
    display: flex;
    align-items: center;
    margin-left: 5px;
    .az-icon {
      font-size: 18px;
      fill: currentColor;
      margin: 0 2px;
      height: 9px;
    }
    .size-chart-btn {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
