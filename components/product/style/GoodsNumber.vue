<template>
  <div class="goods-number">
    <label for="goods-number">{{ nl('page_common_quantity') }}:</label>
    <az-select-input v-show="!isQuickShop" :value="number" :max="Math.min(max, stockNumber)" @changeNumber="changeNumber"></az-select-input>
    <div id="dialog-goods-number" v-if="isQuickShop">
      <div @click="toggleDropList" class="goods_number_choose_box">
        <span class="goods_number">{{ number }}</span>
        <az-icon class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
      </div>
      <div v-show="dropListShow" class="drop_down_list">
        <div
          v-for="i in realMax"
          :key="i"
          :value="i"
          :class="{ disabled: i > stockNumber }"
          @click="dropListItemClick($event, i)"
          class="drop_down_item"
        >
          {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AzSelectInput from '@/components/az-ui/Select/AzSelectInput'
export default {
  name: 'GoodsNumber',
  languageKeys: ['page_common_quantity'],
  components: { AzSelectInput },
  props: {
    max: {
      type: Number,
      default: 20
    },
    goodsNumber: {
      type: Number,
      default: 1
    },
    stockNumber: {
      type: Number,
      default: 100
    },
    isQuickShop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropListShow: false,
      timer: null
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    }),
    number: {
      get() {
        return this.goodsNumber
      },
      set(val) {
        this.$emit('change-qty', val)
      }
    },
    realMax() {
      return this.isSpecialCatId(this.baseInfo.catId) ? 10 : this.max
    }
  },
  mounted() {
    document.documentElement.addEventListener('click', (event) => {
      let flag = false
      let parent = event.target.parentNode
      while (parent) {
        if (parent == this.$el) {
          flag = true
          break
        }
        parent = parent.parentNode
      }
      if (!flag) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.dropListShow = false
        }, 10)
      }
    })
  },
  methods: {
    changeNumber(val) {
      this.number = val
      // console.log('changeNumber', val)
    },
    toggleDropList() {
      this.dropListShow = !this.dropListShow
    },
    dropListItemClick(e, val) {
      if (!e.target.className.includes('disabled')) {
        this.$emit('change-qty', val)
      }
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.dropListShow = false
      }, 10)
    }
  }
}
</script>

<style lang="less" scoped>
.goods-number {
  width: 100%;
  margin: 6px auto 14px;
  display: flex;
  align-items: center;
  label {
    white-space: nowrap;
    text-transform: uppercase;
  }
  #goods-number {
    height: 21px;
    min-width: 47px;
    padding: 0;
    margin-left: 8px;
    .disabled {
      color: #d6d6d6;
    }
  }
}
#dialog-goods-number {
  position: relative;
  .goods_number_choose_box {
    width: 90px;
    height: 32px;
    line-height: 32px;
    margin-left: 5px;
    border: 1px solid #ccc;
    padding-left: 10px;
    color: var(--color-121212);
    cursor: pointer;
    box-sizing: border-box;
    .arrow-down-icon {
      width: 10px;
      height: 5px;
      position: absolute;
      right: 10px;
      top: 11px;
    }
  }
  .drop_down_list {
    position: absolute;
    max-height: 150px;
    width: 90px;
    left: 5px;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 1;
    box-shadow: 0px 2px 4px 0px rgba(102, 102, 102, 0.3);
    .drop_down_item {
      width: 90px;
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      background: #ffffff;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background: #f6f6f6;
      }
      &.disabled {
        color: #ccc;
        cursor: not-allowed;
      }
    }
  }
}
</style>
