<template>
  <div
    v-if="!isSpecialCatId(baseInfo.catId) || (isSpecialCatId(baseInfo.catId) && tip.tips)"
    :class="['stock-tips', { wgd: isSpecialCatId(catId) }]"
  >
    <div v-if="!isSpecialCatId(baseInfo.catId)" class="status">
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
    <div v-if="tip.tips && tipStatus.key !== 'shipsImmediately'" :class="{ 'tips-red': tipStatus.tipsRed }" class="tips">
      {{ nl(tip.tips) }}
      <span v-if="showSampleSimilar" class="sample-similar"> {{ nl('page_stock_tips_text') }}</span>
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
          status: 'page_stock_tips_status_1'
        },
        sizeNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_8'
        },
        colorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_9'
        },
        noColor: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_10'
        },
        noColorAndNoStock: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_10'
        },
        sashColorNoStock: {
          status: 'page_stock_tips_status_2',
          tips: 'page_stock_tips_text_11'
        },
        noSashColor: {
          status: 'page_stock_unavailable',
          tips: 'page_stock_tips_text_12'
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
      baseInfo: (state) => state.quickshop.baseInfo,
      selectedColor: (state) => state.quickshop.selectedColor,
      selectedSize: (state) => state.quickshop.selectedSize
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
      if (this.isClearance) {
        tip.tips = ''
      }
      if (this.tipStatus.key == 'hasStock' || this.tipStatus.key == 'shipsImmediately') {
        if ((this.supportStockSales && this.tipStatus.stockNumber <= 5) || this.tipStatus.stockNumber <= 3) {
          tip.tips = `${this.nl('page_product_only')} ${this.tipStatus.stockNumber}  ${this.nl('page_product_only_order_soon')}`
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
        switch (tip.status) {
          case 'Unavailable':
            this.setPoint('availability', 'unavailable', 'view')
            break
          case 'Out of Stock':
            this.setPoint('availability', 'outofstock', 'view')
            break
          case 'In Stock':
            this.setPoint('availability', 'instock', 'view')
            break
          case 'Select Color and Size for Availability':
            this.setPoint('availability', 'availability', 'view')
            break
          default:
            break
        }
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
  &.wgd {
    margin: 0;
    padding: 8px 0;
  }
  .status {
    font-family: @font-family-600, sans-serif;
    display: flex;
    align-items: center;
    .status-text {
      font-family: @font-family-500, sans-serif;
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
  .tips {
    margin-top: 5px;
  }
  .tips-red {
    color: var(--color-ff0000);
  }
  .sample-similar {
    font-family: @font-family-600, sans-serif;
  }
}
</style>
