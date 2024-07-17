<template>
  <div id="bread_crumb">
    <div class="breadcrumb clearfix ul">
      <div @click="goHome" class="home li">
        <a :href="countryUrl(baseInfo.indexUrl + (isBridal ? `${baseInfo.indexUrl.includes('?') ? '&' : '?'}subsite=bridal` : ''))">{{
          nl('page_common_home')
        }}</a>
      </div>
      <div @click="goCategory" v-if="hasCatName" class="li">
        <a v-if="baseInfo.dressType != 'clearance' && baseInfo.dressType != 'outlet'" :href="categoryUrl"> {{ catShowName }}</a>
        <a
          v-else
          :href="countryUrl(baseInfo.categoryUrl + (isBridal ? `${baseInfo.categoryUrl.includes('?') ? '&' : '?'}subsite=bridal` : ''))"
          >{{ nl(baseInfo.catName) }}</a
        >
      </div>
      <div class="li">
        <span :class="{ 'special-occasions-detail-prod-name': baseInfo.catId == '3' }">{{ nl(baseInfo.shownGoodsName) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BreadCrumb',
  languageKeys: ['page_common_home', 'page_category_gifts', 'page_product_selling_point_ready_to_ship'],
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    hasCatName: {
      // 是否显示分类名称
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({}),
    catShowName() {
      if (this.baseInfo.catName == 'Fabric') {
        return 'Swatches & Fabrics'
      } else if (this.baseInfo.isFinalSale) {
        // return this.nl('page_product_selling_point_ready_to_ship')
        // 暂时不改 等seo提了在改成多语言
        return 'Ready to Ship'
      } else if (this.baseInfo.catId === 129) {
        return this.nl('page_category_gifts')
      }
      return this.baseInfo.catName
    },
    categoryUrl() {
      let res = this.baseInfo.categoryUrl
      if (!res.includes('current_in_stock') && this.baseInfo.dressType === 'sample') {
        if (res.includes('?')) {
          res = `${res}&current_in_stock=yes`
        } else {
          res = `${res}?current_in_stock=yes`
        }
      }
      return this.countryUrl([33, 36].includes(this.baseInfo.catId) ? `/swatches-fabric` : res)
    }
  },
  methods: {
    goHome() {
      this.buryPoint(this, 'event', {
        ec: 'image',
        el: 'topleftconnerhome',
        ea: 'click',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    goCategory() {
      const path = this.$route.name
      // 对详情下的 顶部home后边的 点击事件打点
      if (path == 'product') {
        this.buryPoint(this, 'event', {
          ec: 'image',
          el: 'topleftconnercategory',
          ea: 'click',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
#bread_crumb {
  box-sizing: border-box;
  max-width: 1353px;
  width: 100%;
  margin: 0 auto;
  padding: 8px 0 5px;
  .ul {
    .li {
      height: 29px;
      float: left;
      position: relative;
      &:nth-child(1) {
        a {
          padding-left: 0;
        }
      }
      span,
      a {
        color: var(--color-121212);
        display: inline-block;
        height: 29px;
        line-height: 29px;
        padding: 0 8px 0 10px;
        &:after {
          content: '';
          position: absolute;
          top: 2px;
          right: -6px;
          background-position: 0 7px;
          width: 7px;
          height: 27px;
          background-image: data-uri('../../assets/images/breadcrumb.png');
          background-repeat: no-repeat;
        }
        &:hover {
          color: @theme-color;
        }
      }
      span {
        &::after {
          display: none;
        }
        &:hover {
          color: var(--color-121212);
        }
      }
      .special-occasions-detail-prod-name {
        text-transform: capitalize;
      }
    }
  }
}
</style>
