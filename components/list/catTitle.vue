<template>
  <div id="cat_title" class="cat-title-box cat-title">
    <h1 v-if="searchDressType == 'sample'">{{ nl('page_cat_title_sample') }}</h1>
    <h1 v-else-if="searchDressType == 'outlet'">{{ nl('page_cat_title_outlet') }}</h1>
    <h1 v-else-if="searchDressType == 'clearance'">{{ nl('page_cat_title_clearance') }}</h1>
    <!-- <h1 v-else-if="nl(seoCatName)">{{ nl(seoCatName) }}</h1> -->
    <template v-else-if="seoCatName">
      <h1 v-if="seoCatName === 'barbie_swatches'">
        BARBIE™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE {{ nl('page_header_swatches') }}
      </h1>
      <h1 v-else-if="['barbie_all', 'barbie_bd', 'barbie_wd', 'barbie_fgd'].includes(seoCatName)">
        BARBIE™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE {{ nl(barbieSeoTitle) }}
      </h1>
      <h1 v-else-if="barbieSeoName">
        BARBIE™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE {{ barbieSeoName }}
      </h1>
      <h1 v-else>{{ seoCatName }}</h1>
    </template>
    <template v-if="total > 0">
      <!-- 备注： 这个 id="cat-title-goods-total" 不要轻易改动，lego里面会爬网站拿到这个列表页的商品数量，需要保证这个id里面的内容为当前列表页的数量 -->
      <span id="cat-title-goods-total" class="goods-total">{{ total }}</span>
      <span v-if="showStyleText" class="txt">&nbsp;{{ total == 1 ? nl('page_common_style') : nl('page_common_styles') }}</span>
      <span v-else class="txt">&nbsp;{{ total == 1 ? nl('page_cat_item') : nl('page_cat_items') }}</span>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CatTitle',
  languageKeys: [
    'page_cat_title_sample',
    'page_cat_title_outlet',
    'page_cat_title_clearance',
    'page_common_style',
    'page_common_styles',
    'page_cat_item',
    'page_cat_items',
    'page_header_dresses',
    'page_header_bridesmaid_dresses',
    'page_header_wedding_dresses',
    'page_header_flower_girl_dresses',
    'page_header_swatches'
  ],
  props: {
    seoCatName: {
      type: String,
      default: () => {
        return ''
      }
    },
    total: {
      type: null,
      default: () => {
        return 0
      }
    },
    searchDressType: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  computed: {
    ...mapState('list', ['isOutlet']),
    showStyleText({ dressType, searchDressType }) {
      return ['sample', 'clearance', 'outlet'].includes(dressType) || ['sample', 'clearance', 'outlet'].includes(searchDressType)
    },
    barbieSeoTitle() {
      let res = 'page_header_dresses'
      if (this.seoCatName === 'barbie_bd') {
        res = 'page_header_bridesmaid_dresses'
      } else if (this.seoCatName === 'barbie_wd') {
        res = 'page_header_wedding_dresses'
      } else if (this.seoCatName === 'barbie_fgd') {
        res = 'page_header_flower_girl_dresses'
      }
      return res
    },
    // 特殊处理barbie相关seo name，截取后半部分后拼接成带红心的名字
    barbieSeoName() {
      const seoName = this.seoCatName.toLowerCase()
      if (seoName.includes('barbie™ ') && seoName.includes(' azazie ')) {
        return seoName.split(' azazie ')[1]
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat-title-box {
  &.cat-title {
    display: flex;
    align-items: center;
    height: 32px;
    line-height: 32px;
    font-size: 0;
    h1 {
      display: inline;
      padding-right: 15px;
      font-size: 16px;
      font-family: @font-family-600, sans-serif;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      .barbie-heart {
        fill: #de1c85;
        transform: scale(0.5);
      }
    }
    .ready-to-ship-icon {
      width: 120px;
      height: 16px;
      vertical-align: middle;
      margin-right: 15px;
    }
    .goods-total,
    .txt {
      font-family: @font-family-500;
      text-transform: capitalize;
      font-size: 13px;
      line-height: 18px;
    }
  }
}
</style>
