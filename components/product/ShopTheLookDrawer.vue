<template>
  <az-drawer :visible="visible" :maskEnable="true" @onClose="handleClose" :title="nl('page_gallery_shop_the_look')">
    <div v-track.view="{ common: getBiParams('complete the look', 'allitem') }" class="shop-the-look-drawer">
      <div class="shop-the-look-drawer-main">
        <shop-the-look-match-item
          ref="matchItem"
          v-for="(item, index) in goodsDatas"
          :key="index"
          :info="item"
          :options-upper="index > 1 && index === goodsDatas.length - 1"
          :shopTheLookIndex="shopTheLookIndex"
          @onAddedToCart="onAddedToCart"
        ></shop-the-look-match-item>
      </div>
      <div class="add-them-to-cart">
        <az-button :disabe="disabed" @click="clickAddThemToCart" class="btn">{{ nl('page_combo_add_them_to_bag') }}</az-button>
      </div>
    </div>
    <az-toast ref="azToast" :message="nl('page_added_to_bag')" :duration="3000"></az-toast>
  </az-drawer>
</template>
<script>
import AzDrawer from '@/components/az-ui/AzDrawer'
import AzButton from '@/components/az-ui/AzButton.vue'
import ShopTheLookMatchItem from '@/components/product/ShopTheLookMatchItem.vue'
import AzToast from '@/components/az-ui/AzToast'

/**
 * shop the look右侧弹框抽屉组件
 */
export default {
  name: 'ShopTheLookDrawer',
  languageKeys: ['page_gallery_shop_the_look', 'page_added_to_bag', 'page_combo_add_them_to_bag', ...ShopTheLookMatchItem.languageKeys],
  components: {
    AzDrawer,
    AzButton,
    ShopTheLookMatchItem,
    AzToast
  },
  props: {
    // 是否可用，控制显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 所有推荐搭配商品数据
    goodsDatas: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 详情主商品baseInfo
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    shopTheLookIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      disabed: false, // 按钮是否禁用
      addedCartCount: 0 // 当前搭配商品中已成功加购的数量
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          cat_id: this.baseInfo.catId
        })
      }
      return obj
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    // 点击全部加购
    clickAddThemToCart() {
      // 获取所有搭配项实例，先判断是否都满足加购的条件
      let checkedAll = true
      this.$refs.matchItem.forEach((ele) => {
        const checkRes = ele.checkSelected()
        if (!checkRes) checkedAll = false
      })
      // 当所有搭配项均校验通过后，才执行对应搭配商品的加购操作
      if (checkedAll) {
        this.disabed = true
        this.$refs.matchItem.forEach((ele) => {
          ele.addToBag()
        })
      }
    },
    // 监听加购成功操作
    onAddedToCart() {
      this.disabed = false
      this.addedCartCount++
      // 如果搭配商品全部加购成功，提醒用户
      if (this.addedCartCount === this.$refs.matchItem.length) {
        this.$refs.azToast.show()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.shop-the-look-drawer {
  &-main {
    padding: 15px 25px;
    height: calc(100vh - 155px);
    overflow: auto;
    /deep/ .shop-the-look-match-item {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      &:last-of-type {
        margin-bottom: 0px;
        border-bottom: none;
      }
    }
  }
  .add-them-to-cart {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding: 15px;
    background: #ffffff;
    box-shadow: 0px -1px 6px rgba(0, 0, 0, 0.1);
    .btn {
      width: 100%;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      font-family: @font-family-700;
    }
  }
}
</style>
