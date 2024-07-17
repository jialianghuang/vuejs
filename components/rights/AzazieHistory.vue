<template>
  <div class="azazie-history">
    <div class="history-table-header">
      <span class="header-title">{{ nl('page_goods_costume_robe_name') }}</span>
      <span class="header-title">{{ nl('page_common_date') }}</span>
      <span class="header-title">{{ nl('page_cart_total') }}</span>
      <span class="header-title">{{ nl('page_common_status') }}</span>
    </div>
    <div class="history-table-box">
      <div v-if="loadingFlag" class="loading-box">
        <az-loading></az-loading>
      </div>
      <template v-else>
        <template v-if="historyList.length">
          <div v-for="(item, index) in historyList" :key="index" :class="{ 'even-item': index % 2 !== 0 }" class="table-box-item">
            <span @click="goHistoryOrder(item)" class="table-item-content under">{{ item.rightsPackageName }}</span>
            <span class="table-item-content">{{ $dayjs(item.orderTime).format('HH:mm:ss MM/DD/YYYY') }}</span>
            <span class="table-item-content">{{ item.showOrderAmount }}</span>
            <span class="table-item-content">{{ item.orderStatusName }}</span>
          </div>
          <div v-if="pageInfo.totalPage > 1" style="margin-top: 20px;">
            <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" :isLoading="false" @pageChange="pageChange"></az-pager>
          </div>
        </template>
        <!-- 无历史订单 -->
        <template v-else>
          <div class="empty_order">
            <img src="~assets/images/order/no_order.png" alt="No order" />
            <p class="order-empty-text">{{ nl('page_order_no_order') }}</p>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import azPager from '@/components/az-ui/Pager/AzPager'
import AzLoading from '@/components/az-ui/AzLoading'
export default {
  name: 'AzazieHistory',
  components: {
    azPager,
    AzLoading
  },
  data() {
    return {
      loadingFlag: true,
      historyList: [],
      page: 1,
      status: '', // all used
      pageInfo: {
        page: 1,
        limit: 20,
        totalPage: 0
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    goHistoryOrder(item) {
      location.href = this.countryUrl('/user?azazie_perks')
    },
    // 历史订单
    fetchList() {
      const url = `/1.0/rights/order/list?page=${this.pageInfo.page}&status=${this.status}`
      const params = {
        page: this.pageInfo.page,
        status: this.status,
        limit: 10
      }
      this.$axios
        .post(url, params)
        .then((res) => {
          this.historyList = []
          this.loadingFlag = false
          this.pageInfo = res.data && res.data.data && Object.assign({}, this.pageInfo, res.data.data.pageInfo || {})
          if (res.data.code === 0) {
            this.historyList = res.data && res.data.data && [...res.data.data.list]
          }
        })
        .catch((error) => {
          this.loadingFlag = false
          console.error(error)
        })
    },
    pageChange(page, type) {
      this.pageInfo.page = page
      this.fetchList()
    }
  }
}
</script>

<style lang="less" scoped>
.azazie-history {
  // margin-top: 20px;
  width: 100%;
  height: 100%;
  .history-table-header {
    width: 903px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--color-f9f9f9);
    height: 40px;
    padding: 10px;
    box-sizing: border-box;
    .header-title {
      text-transform: uppercase;
      width: calc(100% / 4);
      height: 19px;
      font-size: 14px;
      font-family: @font-family-600;
      font-weight: 600;
      color: var(--color-121212);
      line-height: 19px;
    }
  }
  .history-table-box {
    min-height: 200px;
    width: 903px;
    .table-box-item {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      .table-item-content {
        width: calc(100% / 4);
        height: 18px;
        font-size: 13px;
        font-family: @font-family-500;
        color: var(--color-121212);
        line-height: 18px;
        &.under {
          text-decoration: underline;
        }
      }
      &.even-item {
        background-color: var(--color-f9f9f9);
      }
      &:hover {
        background-color: #eee;
      }
    }
  }
  .empty_order {
    text-align: center;
    img {
      display: block;
      width: 132px;
      margin: 20px auto 0 auto;
    }
    .order-empty-text {
      font-size: 14px;
      color: #666;
      font-family: @font-family-500;
      margin-top: 30px;
    }
  }
}
</style>
