<template>
  <div :class="[{ 'is-bridal': isBridal, 'is-wgd': currentCatId == 3 }, scene, from]" class="cyber-sale">
    <div v-if="scene === 'details'" class="cyber-sale-main">
      <span>
        {{ nl('page_activity_cyber_sale') }}: <span class="strong">{{ nl('page_activity_cyber_sale_des_' + country.toLowerCase()) }}</span>
      </span>
      <cyber-sale-question :desc="desc"></cyber-sale-question>
    </div>
    <span v-else>{{ nl('page_activity_cyber_sale') }}</span>
  </div>
</template>
<script>
import CyberSaleQuestion from '@/components/list/CyberSaleQuestion'
import { countryList } from '@/assets/js/euSizeMap'

/***
 * cyber sale相关需求标签
 */
export default {
  languageKeys: ['page_activity_cyber_sale', ...countryList.map((v, i) => 'page_activity_cyber_sale_des_' + v)],
  components: {
    CyberSaleQuestion
  },
  props: {
    // 使用场景
    scene: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    // 当前所属catId
    itemCatId: {
      type: [Number, String],
      default: ''
    },
    from: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 当前所属catId，没有取全局
    currentCatId() {
      if (this.itemCatId) {
        return this.itemCatId
      }
      return this.catId
    }
  }
}
</script>
<style lang="less" scoped>
.cyber-sale {
  background-color: #fef0f3;
  color: @theme-color;
  width: max-content;
  font-size: 12px;
  line-height: 18px;
  padding: 2px 15px 2px 5px;
  text-transform: uppercase;
  position: relative;
  margin: 0 auto;
  display: flex;
  align-items: center;
  &-main {
    font-family: @font-family-500;
    display: flex;
    align-items: center;
    .strong {
      font-family: @font-family-600;
    }
    &:hover {
      /deep/ .icon-question-des {
        display: block;
      }
    }
  }

  &::after {
    content: '';
    width: 0px;
    height: 0px;
    border-right: 8px solid #fff;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    position: absolute;
    right: 0px;
    top: 0px;
  }
  &.is-wgd,
  &.details,
  &.addonitem,
  &.addcartdialog {
    display: inline-block;
    margin: 0px;
  }
  &.addonitem,
  &.addcartdialog {
    margin-top: 3px;
  }
  &.swiperitem {
    display: block;
    margin: 0 auto;
    margin-top: 3px;
  }
  &.is-bridal {
    background-color: var(--color-dedcd6);
  }
  &.details {
    margin-left: 10px;
  }
  &.completeTheLook {
    transform: scale(0.7);
  }
  &.addcartdialog {
    transform-origin: left;
    transform: scale(0.85);
  }
}
</style>
