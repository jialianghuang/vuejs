<template>
  <div v-if="(!isSpecialCatId(baseInfo.catId) && !noStatus) || tip.tips" class="stock-tips">
    <div v-if="!isSpecialCatId(baseInfo.catId) && !noStatus" class="status">
      {{ nl('page_availability') }}: <span :class="{ 'status-red': tipStatus.statusRed }" class="status-text">{{ nl(tip.status) }}</span>
      <div v-if="tipStatus.key === 'shipsImmediately'" class="suffix">
        <az-icon
          v-track.view.click="getBiParams('availability', 'question_button')"
          class="icon-question"
          icon-class="icon-gwc-_question_"
        />
        <div class="suffix-des">
          <p v-html="nl(tip.tips)"></p>
        </div>
      </div>
    </div>
    <div v-if="tip.tips && tipStatus.key !== 'shipsImmediately'" class="tips-box">
      <div
        :class="{
          'tips-red': tipStatus.tipsRed,
          'hide-bold': isSample && !showSampleSimilar && !['default', 'hasStock', 'shipsImmediately'].includes(tipStatus.key)
        }"
        v-track.view="getBiParams('oos', 'similar')"
        v-html="nl(tip.tips)"
        class="tips"
      ></div>
      <div
        v-html="nl('page_sample_hide_sample_similar_not')"
        v-if="isSample && !showSampleSimilar && !['default', 'hasStock', 'shipsImmediately'].includes(tipStatus.key)"
        class="not"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StockTips',
  languageKeys: [
    'page_availability',
    'page_stock_tips_text',
    'page_stock_tips_default_status',
    ...new Array(5).fill().map((v, i) => 'page_stock_tips_status_' + (i + 1)),
    ...new Array(12).fill().map((v, i) => 'page_product_desc_text' + (i + 1)),
    'page_product_valid_until',
    'page_product_sale_ends',
    'page_goods_dress_color',
    'page_common_size_ques',
    'page_stock_unavailable',
    ...new Array(12).fill().map((v, i) => 'page_stock_tips_text_' + (i + 1)),
    'page_product_only',
    'page_product_only_order_soon',
    'page_sample_hide_sample_similar_not',
    'page_sample_stock_size_stock_color_no_stock',
    'page_sample_stock_size_no_stock_color_stock',
    'page_sample_stock_color_no_stock_no_sel_size',
    'page_sample_stock_size_no_stock_color_no_stock',
    'page_stock_ships_immediately',
    'page_stock_ships_immediately_des'
  ],
  props: {
    tipStatus: {
      type: Object,
      default: () => {
        return {
          key: 'default',
          stockNumber: 0,
          tipsRed: false,
          statusRed: false
        }
      }
    },
    isSample: {
      type: Boolean,
      default: false
    },
    isClearance: {
      type: Boolean,
      default: false
    },
    showSampleSimilar: {
      type: Boolean,
      default: false
    },
    supportStockSales: {
      type: Boolean,
      default: false
    },
    // sample similar 接口的loaing态
    isSimilarLoading: {
      type: Boolean,
      default: false
    },
    // 不展示status
    noStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      normalTips: {
        default: {
          status: 'page_stock_tips_default_status'
        },
        hasStock: {
          status: 'page_stock_tips_status_1'
        },
        sizeNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_1'
        },
        colorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_1'
        },
        noColor: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_1'
        },
        noColorAndNoStock: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_1'
        },
        onlyColorDefault: {
          status: 'page_stock_tips_status_2'
        },
        onlyColorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_2'
        },
        color_no_stock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_3'
        },
        noColorNoSize: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_4'
        },
        shipsImmediately: {
          status: 'page_stock_ships_immediately',
          tips: 'page_stock_ships_immediately_des'
        }
      },
      dressTips: {
        default: {
          status: 'page_stock_tips_default_status'
        },
        hasStock: {
          status: 'page_stock_tips_status_1'
        },
        sizeNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_5'
        },
        colorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_6'
        },
        noColor: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_7'
        },
        noColorAndNoStock: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_7'
        },
        onlyColorDefault: {
          status: 'page_stock_tips_status_2'
        },
        onlyColorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_2'
        },
        color_no_stock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_3'
        },
        noColorNoSize: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_4'
        },
        shipsImmediately: {
          status: 'page_stock_ships_immediately',
          tips: 'page_stock_ships_immediately_des'
        }
      },
      sampleTips: {
        default: {
          status: 'page_stock_tips_status_4'
        },
        hasStock: {
          // 当前size下选中的颜色有库存
          status: 'page_stock_tips_status_1'
        },
        sizeNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_8',
          pointMsg: 'size_lentout'
        },
        colorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_9',
          pointMsg: 'size_lentout'
        },
        noColor: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_10',
          pointMsg: 'color_unavailable'
        },
        noColorAndNoStock: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_10',
          pointMsg: 'color_unavailable'
        },
        sizeStockColorNoStock: {
          // 选择有库存尺码+无库存颜色
          status: 'page_stock_unavailable',
          tips: 'page_sample_stock_size_stock_color_no_stock',
          el: 'sku_no_skc'
        },
        sizeNoStockColorStock: {
          // 选择无库存尺码+有库存颜色
          status: 'page_stock_unavailable',
          tips: 'page_sample_stock_size_no_stock_color_stock',
          el: 'skc_no_sku'
        },
        colorNoStockNoSelSize: {
          // 选择无库存颜色+未选择尺码
          status: 'page_stock_unavailable',
          tips: 'page_sample_stock_color_no_stock_no_sel_size',
          el: 'sku_no_skc'
        },
        sizeNoStockColorNoStock: {
          // 选择无库存尺码+无库存颜色
          status: 'page_stock_unavailable',
          tips: 'page_sample_stock_size_no_stock_color_no_stock',
          el: 'no_skc_sku'
        },
        sashColorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_11',
          pointMsg: 'size_lentout'
        },
        noSashColor: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_12',
          pointMsg: 'color_unavailable'
        }
      },
      garmentBagsTips: {
        default: {
          status: 'page_stock_tips_status_5'
        },
        hasStock: {
          status: 'page_stock_tips_status_1'
        },
        noColorNoSize: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_4'
        }
      }
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      selectedColor: (state) => state.product.selectedColor,
      selectedSize: (state) => state.product.selectedSize
    }),
    tip() {
      let tips = this.dressTips
      if (this.isSample) {
        tips = this.sampleTips
      } else if (this.baseInfo.catId == 13 || this.baseInfo.catId == 1504) {
        tips = this.normalTips
      } else if (this.baseInfo.catId == 1508) {
        tips = this.garmentBagsTips
      }
      const tip = {}
      tip.status = tips[this.tipStatus.key].status
      tip.tips = tips[this.tipStatus.key].tips
      tip.el = tips[this.tipStatus.key].el
      if (this.isClearance) {
        tip.tips = ''
        tip.el = ''
      }
      if (this.tipStatus.key == 'hasStock' || this.tipStatus.key == 'shipsImmediately') {
        if ((this.supportStockSales && this.tipStatus.stockNumber <= 5) || this.tipStatus.stockNumber <= 3) {
          tip.tips = `${this.nl('page_product_only')} ${this.tipStatus.stockNumber}  ${this.nl('page_product_only_order_soon')}`
          tip.el = ''
        }
      }
      return tip
    }
  },
  watch: {
    tipStatus(val) {
      this.handleTip()
    }
  },
  methods: {
    handleTip() {
      let tips = this.dressTips
      if (this.isSample) {
        tips = this.sampleTips
      } else if (this.baseInfo.catId == 13 || this.baseInfo.catId == 1504) {
        tips = this.normalTips
      } else if (this.baseInfo.catId == 1508) {
        tips = this.garmentBagsTips
      }
      const tip = {}
      tip.status = tips[this.tipStatus.key].status
      tip.tips = tips[this.tipStatus.key].tips
      if (this.isClearance) {
        tip.tips = ''
      }
      if ((this.tipStatus.key == 'hasStock' || this.tipStatus.key == 'shipsImmediately') && this.tipStatus.stockNumber <= 3) {
        this.setPoint('stock', 'attention', 'view')
      } else {
        switch (this.nl(tip.status)) {
          case this.nl('page_stock_unavailable'):
            this.setPoint('availability', 'unavailable', 'view')
            break
          case this.nl('page_stock_tips_status_2'):
            this.setPoint('availability', 'outofstock', 'view')
            break
          case this.nl('page_stock_tips_status_1'):
            this.setPoint('availability', 'instock', 'view')
            break
          case this.nl('page_stock_tips_default_status'):
            this.setPoint('availability', 'availability', 'view')
            break
          default:
            break
        }
      }

      // 样衣详情页无库存打点
      if (this.baseInfo.dressType === 'sample' && this.tip && this.tip.tips && this.tip.el) {
        this.buryPoint(this, 'event', {
          ec: 'oos',
          el: this.tip.el,
          ea: 'view',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType,
            cat_id: this.baseInfo.catId,
            from_cat_id: this.baseInfo.catId // 主商品catId
          })
        })
      }
    },
    setPoint(ec, el, ea) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          size: this.selectedSize.key,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    getBiParams(ec, el) {
      if (process.server) return
      // 样衣详情页无库存打点
      if (this.baseInfo.dressType !== 'sample' && this.tipStatus.key !== 'shipsImmediately') return
      if (!this.showSampleSimilar && ec === 'oos' && el === 'similar') return
      const msg = {
        goodsId: this.baseInfo.goodsId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType,
        cat_id: this.baseInfo.catId,
        color: this.selectedColor.key,
        from_cat_id: this.baseInfo.catId // 主商品catId
      }
      return {
        common: {
          ec,
          el,
          msg: JSON.stringify(msg)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.stock-tips {
  width: 100%;
  margin-top: 10px;
  .status {
    font-family: @font-family-600, sans-serif;
    display: flex;
    align-items: center;
    .status-text {
      font-family: @font-family-500, sans-serif;
      margin-left: 3px;
    }
    .status-red {
      color: @theme-color;
    }
    .suffix {
      position: relative;
      display: flex;
      align-items: center;
      width: 12px;
      height: 18px;
      cursor: pointer;
      margin-left: 5px;
      .az-icon {
        font-size: 12px;
      }
      &:hover {
        .suffix-des {
          display: block;
        }
      }
      &-des {
        display: none;
        position: absolute;
        z-index: 1;
        width: 358px;
        line-height: normal;
        padding: 15px;
        background: #fff;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
        top: 24px;
        left: -188px;
        font-family: @font-family-500;
        &:before {
          content: '';
          width: 0;
          height: 0;
          border-top: 4px solid #fff;
          border-right: 4px solid #fff;
          border-bottom: 4px solid transparent;
          border-left: 4px solid transparent;
          box-shadow: 2px -2px 2px 0 rgba(0, 0, 0, 0.2);
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(-45deg);
        }
      }
    }
  }
  .tips-box {
    margin-top: 5px;
    /deep/.bold {
      font-family: @font-family-600, sans-serif;
    }
    .tips {
      display: inline-block;
      &.hide-bold {
        /deep/.bold {
          display: none;
        }
      }
    }
    .not {
      display: inline-block;
    }
  }
  .tips-red {
    color: var(--color-ff0000);
  }
  .sample-similar {
    font-family: @font-family-600, sans-serif;
  }
}
</style>
