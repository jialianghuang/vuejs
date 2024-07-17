<template>
  <az-popup v-if="visible" :overlayZIndex="12">
    <div class="give-up-bundle">
      <div class="give-up-bundle-header">
        {{ nl('page_give_up_bundle_attention') }}
      </div>
      <div class="give-up-bundle-main">
        <div v-for="(item, index) in giveUpList" :key="index" class="give-up-bundle-item">
          <img :src="addWebpSuffix(item.imgUrl)" :alt="item.shownGoodsName" class="goods-img" />
          <div class="give-up-bundle-item-info">
            <div>
              <p class="name">{{ item.shownGoodsName }}</p>
              <p class="color">{{ nl('page_common_color') }}:{{ item.color }}</p>
              <p v-if="item.size" class="size">{{ nl('page_common_size') }}:{{ item.size }}</p>
            </div>
            <div class="price">
              <div>
                <span class="shop-price">{{ item.shopPriceDisplay }}</span>
                <span class="no-deal-price">{{ item.noDealPriceDisplay }}</span>
              </div>
              <span>{{ nl('page_common_save') }} {{ item.bundlePriceOff }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="give-up-bundle-footer">
        <button v-track.view.click="{ common: { ec: 'bundle', el: 'giveup_saving' } }" @click="clickRemove" class="btn cancel">
          {{ nl('page_give_up_bundle_remove') }}
        </button>
        <button v-track.view.click="{ common: { ec: 'bundle', el: 'keepit' } }" @click="clickSave" class="btn save">
          {{ nl('page_give_up_bundle_save') }}
        </button>
      </div>
    </div>
  </az-popup>
</template>
<script>
import AzPopup from '@/components/az-ui/Popup/AzPopup'

/**
 * 用户在购物车满足条件，但是把唯一一件裙子删掉
 * 这种场景下，弹窗提示用户删掉裙子会丧失鞋包权益，是否要删除
 * 目前仅在购物车中会用到
 */
export default {
  components: {
    AzPopup
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 购物车删除操作的商品数据
    deleteItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    // 展示用到数据
    giveUpList() {
      const res = []
      this.list.forEach((ele) => {
        if (ele.showBundlePrice) {
          let size = ''
          if (ele.formatStyles && ele.formatStyles.size) {
            if (ele.formatStyles.size.CustomSize) {
              size = ele.formatStyles.size.CustomSize.value
            } else if (ele.formatStyles.size.standardSize) {
              size = ele.formatStyles.size.standardSize.shownName
            }
          }
          res.push({
            ...ele,
            size
          })
        }
      })
      return res
    }
  },
  methods: {
    clickSave() {
      this.$emit('update:visible', false)
    },
    // 删除购物车中的商品
    clickRemove() {
      this.$axios
        .$delete(`/1.0/cart/goods/${this.deleteItem.recId}`, { params: { ignoreRedeemed: 1, is_real_delete: 0 } })
        .then((res) => {
          if (res.code == 0) {
            this.$emit('refreshCartList')
            this.clickSave()
          } else {
            const _msg = res.message || this.nl('page_error_something_wrong')
            alert(_msg)
          }
        })
        .catch((error) => {
          console.log(error)
          const _msg = error.msg || this.nl('page_error_something_wrong')
          alert(_msg)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.give-up-bundle {
  width: 500px;
  background: #fff;
  margin: 0 auto;
  &-header {
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    padding: 25px 15px;
    background: var(--color-f9f9f9);
  }
  &-main {
    padding: 0px 20px;
    max-height: 467px;
    overflow: auto;
  }
  &-footer {
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.05);
    .btn {
      width: 225px;
      height: 40px;
      box-sizing: border-box;
      font-size: 14px;
      font-family: @font-family-600;
      padding: 0px;
      &:hover,
      &:focus,
      &:active {
        opacity: 0.9;
      }
      &.cancel {
        border: 1px solid var(--color-121212);
        background: #fff;
      }
      &.save {
        background: var(--color-121212);
        color: #fff;
      }
    }
  }
  &-item {
    display: flex;
    align-items: center;
    padding: 15px 0px;
    border-bottom: 1px solid #eee;
    &:last-of-type {
      border-bottom: none;
    }
    .goods-img {
      width: 90px;
      height: 125px;
      margin-right: 15px;
    }
    &-info {
      flex: 1;
      height: 125px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 16px;
      line-height: 16px;
      p {
        margin-bottom: 5px;
      }
      .price {
        font-family: @font-family-600;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: @theme;
        .no-deal-price {
          font-size: 12px;
          line-height: 16px;
          text-decoration-line: line-through;
          color: var(--color-999999);
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
