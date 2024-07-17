<template>
  <div @click="click" class="notify-label">{{ notifyText }}</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'NotifyLabel',
  languageKeys: ['page_notify_label_text1', 'page_notify_label_text2', 'page_notify_label_text3', 'page_notify_label_text4'],
  props: {
    isSample: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'size'
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    stock: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.quickshop.baseInfo,
      selectedColor: (state) => state.quickshop.selectedColor,
      selectedSize: (state) => state.quickshop.selectedSize,
      indexNo: (state) => state.quickshop.indexNo
    }),
    ...mapState('list', ['sortBy']),
    notifyText() {
      if (this.isSample) {
        return this.nl('page_notify_label_text1')
      } else if (this.type == 'size') {
        return this.nl('page_notify_label_text2')
      } else if (this.type == 'color') {
        return this.nl('page_notify_label_text3')
      } else {
        return this.nl('page_notify_label_text4')
      }
    }
  },
  mounted() {
    this.setPoint('notifyme', 'notice', 'view')
  },
  methods: {
    setPoint(ec, el, ea) {
      const msg = {
        goodsId: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        size: this.getSizeKey(),
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType,
        cat_id: this.baseInfo.catId
      }
      if (this.indexNo) {
        msg.no = this.indexNo
        msg.sort_by = this.sortBy
      }
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(msg)
      })
    },
    click() {
      this.setPoint('notifyme', 'notice', 'click')
      this.$emit('click')
    },
    getSizeKey() {
      const flag = this.isStockGoods && !this.stock.includes(this.selectedKey)
      if (flag) {
        return this.selectedKey
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.notify-label {
  width: 100%;
  color: var(--color-121212);
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 10px;
  &::before {
    content: '';
    background: url(~assets/images/common/a_sprite_l_20190422.png) -32px -421px no-repeat;
    display: inline-block;
    width: 12px;
    height: 14px;
    margin-right: 5px;
    top: 2px;
    position: relative;
  }
}
</style>
