<template>
  <div class="details_module my-dashboard">
    <div class="details_module_header">{{ nl('page_common_showroom_my_dashboard') }}</div>
    <div class="details_module_content">
      <div v-if="dashboardInfo && dashboardInfo.prodList && Object.keys(dashboardInfo.prodList).length" class="order_box">
        <template v-for="(item, index) in dashboardInfo.prodList">
          <div v-if="item.hasGoods" :key="index" class="order_item">
            <span class="owner_icon">{{ item.shortName }}</span>
            <img :src="addWebpSuffix(item.imgUrl)" :alt="item.shownGoodsName" />
            <span class="goods_name">{{ item.shownGoodsName }}</span>
            <span class="goods_color"
              >{{ nl('page_style_color') }}: <span>{{ item.shownColor }}</span></span
            >
            <span class="buy_time">{{ item.buyTime }}</span>
            <span id="guide_order_status" class="order_status">{{ item.orderStatus }}</span>
          </div>
          <div v-else :key="index" class="order_item">
            <span class="owner_icon">{{ item.shortName }}</span>
            <img :src="require('~/assets/images/showroom/none_order.jpg')" alt="No order yet" />
            <span id="guide_order_status" class="order_status">{{ nl('page_common_showroom_no_order_yet') }}</span>
          </div>
        </template>
      </div>
      <div v-else class="order_box none_order_copy">
        <div v-for="(item, index) in userList" :key="index" class="order_item">
          <img :src="require('~/assets/images/showroom/dashborad_default.jpg')" alt="dashborad_default" />
          <span id="dashbord_guide_pos" class="dashbord_guide_pos">{{ nl('page_common_showroom_no_order_yet') }}</span>
          <div class="owner_icon">{{ item.shortName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'MyDashboard',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      ...mapState('showroom', ['userList', 'dashboardInfo'])
    })
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.my-dashboard {
  padding-bottom: 25px;
  .dashbord_guide_pos {
    text-transform: capitalize;
  }
  .order_box {
    .order_item:nth-child(4n + 0) {
      margin-right: 0 !important;
    }
  }
}
</style>
