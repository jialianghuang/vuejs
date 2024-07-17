<template>
  <client-only>
    <div
      v-track.view="userInfoDown ? getTrackParam(baseInfo) : {}"
      v-if="!!value"
      :class="versionObj.listWithCodeAbtest"
      class="az-with-coupon"
    >
      <span v-if="hasShopPriceRange" class="az-with-coupon-item left">
        {{ nl('page_common_up_to_off', null, { upToSaveRateValue: value.replace('-', '') }) }}</span
      >
      <span v-else class="az-with-coupon-item left">{{ nl('page_common_save') }} {{ value.replace('-', '') }}</span>
      <template v-if="showText">
        <p v-if="isBlock" class="az-with-coupon-item block">{{ code ? nl('page_common_with_code') : nl('page_common_with_coupon') }}</p>
        <span v-else class="az-with-coupon-item">{{ code ? nl('page_common_with_code') : nl('page_common_with_coupon') }}</span>
        <span v-if="code" class="az-with-coupon-item">{{ code }}</span>
      </template>
    </div>
  </client-only>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AzWithCoupon',
  languageKeys: ['page_common_save', 'page_common_with_coupon', 'page_common_up_to_off'],
  props: {
    value: {
      type: String,
      default: ''
    },
    showText: {
      type: Boolean,
      default: true
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    },
    hasShopPriceRange: {
      // 价格区间
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: [Object],
      default: () => {}
    },
    fromDialog: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      userInfoDown: (state) => state.userInfo.userInfoDown
    })
  },
  methods: {
    getTrackParam(item = {}) {
      const common = {}
      if (Object.keys(item).length) {
        const isShowCode = this.showCode(this.baseInfo)
        if (this.$route.name == 'list') {
          common.ec = 'swatch'
          common.el = 'withcoupon'
          if (this.fromDialog == 'list') {
            common.ec = 'productdetail'
            common.el = isShowCode ? 'withcode' : 'withcoupon'
          }
        }
        if (this.$route.name == 'product') {
          common.ec = 'productdetail'
          common.el = isShowCode ? 'withcode' : 'withcoupon'
        }
        common.msg = JSON.stringify({
          cat_id: item.catId,
          dress_type: item.dressType,
          goodsId: item.goodsId
        })
      }
      if (common.ec && common.el) {
        return {
          id: '',
          common
        }
      }
      return {}
    }
  }
}
</script>

<style lang="less" scoped>
.az-with-coupon {
  margin: 2px 0 1px;
  text-align: end;
  font-size: 0;
  &.A {
    .az-with-coupon-item {
      font-family: @font-family-600;
      color: var(--theme-color);
    }
  }
  .az-with-coupon-item {
    font-size: 12px;
    color: #666;
    &.left {
      padding: 0 5px;
      color: #fff;
      background-color: var(--theme-color);
    }
    &.block {
      margin: 2px 0 1px;
    }
    &:not(:first-child) {
      margin-left: 5px;
    }
  }
}
</style>
