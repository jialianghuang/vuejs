<template>
  <a
    :href="
      bundlePromotionInfo.linkUrl
        ? countryUrl(getNewQueryUrl(bundlePromotionInfo.linkUrl, 'bundleId', bundlePromotionInfo.bundleId))
        : 'javascript:void(0)'
    "
  >
    <div
      v-track.view.click="{
        common: getBiParams('buy_more_save_more', `popup_all`)
      }"
      class="cart-buy-more-save-more"
    >
      <TagBuyMoreSaveMore :nameEl="'popup_name'" :descEl="'popup_description'" :bundlePromotionInfo="bundlePromotionInfo" />
      <ul>
        <li
          v-for="(item, index) in bundlePromotionInfo.goodsList"
          :key="index"
          v-track.view.click="{
            common: getBiParams('buy_more_save_more', `popup_prod_${index + 1}`)
          }"
        >
          <img :src="addWebpSuffix(`${PIC_PATH}s240/${item.goodsThumb}`)" alt="product img" />
        </li>
        <!--  bundleLimit  content -->
        <li
          v-for="(item, index) in emptyList"
          :key="'empty_' + index"
          v-track.view.click="{
            common: getBiParams('buy_more_save_more', `popup_prod_${bundlePromotionInfo.goodsList.length + index + 1}`)
          }"
        >
          <az-icon icon-class="icon-add-circle"></az-icon>
        </li>
      </ul>
    </div>
  </a>
</template>

<script>
/**
 * AZWEB-18459 Buy more save more 加车弹框进度
 */
import TagBuyMoreSaveMore from '@/components/product/TagBuyMoreSaveMore'
import { getNewQueryUrl } from '@/assets/js/utils.js'
export default {
  name: 'BuyMoreSaveMore',
  components: { TagBuyMoreSaveMore },
  props: {
    bundlePromotionInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      getNewQueryUrl
    }
  },
  computed: {
    emptyList({ bundlePromotionInfo }) {
      let tempList = []
      if (bundlePromotionInfo.countProgress) tempList = new Array(bundlePromotionInfo.countProgress).fill(1)
      return tempList
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.cart-buy-more-save-more {
  height: 65px;
  display: flex;
  align-items: center;
  background: @bg-light-color;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 10px;
  ul {
    display: flex;
    align-items: center;
    li {
      width: 33px;
      height: 45px;
      margin: 0 2.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      background: #fff;
      a {
        display: block;
      }
      img {
        width: 100%;
      }
    }
  }
}
/deep/ .tag-buy_more_save_more {
  span {
    font-size: 14px;
  }
}
</style>
