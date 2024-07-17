<template>
  <div class="showroom-goods-list">
    <user-info-tutorial v-if="showroomBaseInfo.isOwner" class="showroom-tutorial"></user-info-tutorial>
    <div class="details_module_header">{{ nl('page_common_showroom_favorite_items') }}</div>
    <div v-if="prodList && Object.keys(prodList).length">
      <div class="goods-list-box">
        <div v-for="columnItem in [0, 1, 2, 3]" :key="columnItem" :class="`columnItem_${columnItem}`" class="columnItem">
          <template v-for="(item, index) in prodList">
            <showroom-goods-item
              :key="index"
              :goodsItem="item"
              :showroomGoodsIndex="index"
              v-if="index % 4 == columnItem"
              :data-line="index % 4"
              @getShowroomProdList="getShowroomProdList"
              @quickShop="quickShopClick"
            ></showroom-goods-item>
          </template>
        </div>
      </div>
      <div class="showroom-pager">
        <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" :isLoading="pageLoading" @pageChange="pageChange"></az-pager>
      </div>
    </div>
    <showroom-empty v-else></showroom-empty>
  </div>
</template>
<script>
import ShowroomGoodsItem from '@/components/showroom/ShowroomGoodsItem'
import ShowroomEmpty from '@/components/showroom/ShowroomEmpty'
import azPager from '@/components/az-ui/Pager/AzPager'
import UserInfoTutorial from '@/components/showroom/UserInfoTutorial'
import { mapState } from 'vuex'
export default {
  name: 'ShowroomGoodsList',
  components: {
    UserInfoTutorial,
    ShowroomGoodsItem,
    ShowroomEmpty,
    azPager
  },
  data() {
    return {
      pageLoading: false
    }
  },
  computed: {
    ...mapState('showroom', ['prodList', 'pageInfo', 'showroomBaseInfo'])
  },
  methods: {
    // 分页
    pageChange(val) {
      this.setPoint('reviews', 'page' + val, 'click')
      this.$nextTick(() => {
        this.$router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            page: val
          }
        })
        this.$store.commit('showroom/setLoadingFlag', true)
        this.getShowroomProdList(val)
      })
    },
    getShowroomProdList(pageVal, noLoad) {
      this.$emit('getShowroomProdList', pageVal || 1, noLoad)
    },
    // 显示quick shop事件
    quickShopClick(param) {
      this.$emit('quickShop', param)
    }
  }
}
</script>
<style lang="less" scoped>
.showroom-goods-list {
  padding: 0;
  display: block;
  position: relative;
  .showroom-tutorial {
    position: absolute;
    top: 8px;
    right: 0;
  }
  .details_module_header {
    font-size: 20px;
    font-family: @font-family-600;
    color: var(--color-121212);
    text-transform: capitalize;
    text-align: left;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }
  .goods-list-box {
    // column-count: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 25px;
    // i {
    //   width: 24%;
    // }
    .columnItem {
      display: flex;
      flex-direction: column;
      width: 24%;
      // margin-right: 1.3%;
    }
  }
  .showroom-pager {
    padding-top: 30px;
    position: relative;
  }
}
</style>
