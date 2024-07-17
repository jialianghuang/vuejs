<template>
  <div class="my-coupons">
    <div @click="showUnavilable" class="my-coupons-unavilable-title">
      <span>{{ !isUnavailable ? nl('page_stock_unavailable') : nl('page_rights_return_text') }}</span>
    </div>
    <div v-if="loadingFlag" class="loading-box">
      <az-loading></az-loading>
    </div>
    <template v-if="!skeleton && hasData">
      <div class="my-coupons-box">
        <template v-if="couponList.length">
          <div v-for="num in [0, 1]" :key="num">
            <template v-for="(item, index) in couponList">
              <my-coupon-card :item="item" v-if="index % 2 === num" :key="index" @showDetail="showDetail"></my-coupon-card>
            </template>
          </div>
        </template>
        <template v-else>
          <empty-coupons-card class="ml-0"></empty-coupons-card>
        </template>
      </div>
    </template>
    <!-- 分页 -->
    <template v-if="pageInfo.totalPage > 1">
      <az-pager
        v-track.view.click="{ common: { ec: 'viewmore', el: 'button' } }"
        :totalPage="pageInfo.totalPage"
        :page="pageInfo.page * 1"
        :isLoading="false"
        @pageChange="pageChange"
      ></az-pager>
    </template>
  </div>
</template>

<script>
import MyCouponItem from '@/components/rights/MyCouponItem'
import EmptyCoupons from '@/components/rights/EmptyCoupons'
import azPager from '@/components/az-ui/Pager/AzPager'
import AzLoading from '@/components/az-ui/AzLoading'
export default {
  name: 'MyCoupons',
  components: {
    MyCouponCard: MyCouponItem,
    EmptyCouponsCard: EmptyCoupons,
    azPager,
    AzLoading
  },
  data() {
    return {
      skeleton: true,
      hasData: false,
      isUnavailable: false,
      couponList: [],
      pageInfo: {
        limit: 10,
        totalPage: 0, // 总条数
        page: 1 // 当前页
      },
      status: 'available',
      loadingFlag: true
    }
  },
  watch: {
    skeleton: {
      handler(val) {
        if (process.server || this.hasData) return
        if (!val) {
          this.hasData = true
          // 可以在这里请求数据
        }
      },
      immediate: true
    }
  },
  created() {
    this.fetchCoupons()
  },
  methods: {
    showUnavilable() {
      this.initData()
      this.isUnavailable = !this.isUnavailable
      this.status = this.isUnavailable ? this.nl('page_stock_unavailable') : this.nl('page_rights_available_text')
      this.$emit('changeTitle', !this.isUnavailable ? this.nl('page_account_my_coupons') : this.nl('page_stock_unavailable'))
      this.fetchCoupons()
    },
    pageChange(page, type) {
      this.pageInfo.page = page
      this.fetchCoupons()
    },
    fetchCoupons() {
      const params = {
        page: this.pageInfo.page,
        status: this.status,
        limit: this.pageInfo.limit
      }
      this.$axios
        .post(`/1.0/rights/order/listInfo?page=${this.pageInfo.page}&status=${this.status}`, params)
        .then((res) => {
          this.skeleton = false
          this.loadingFlag = false
          this.pageInfo.totalPage = res.data.data.pageInfo.totalPage
          this.couponList =
            res.data &&
            res.data.data &&
            [].concat(res.data.data.list).map((item, index) => {
              return {
                ...item,
                show: false,
                index
              }
            })
        })
        .catch(() => {
          this.initData()
        })
    },
    initData() {
      this.pageInfo.page = 1
      this.pageInfo.totalPage = 0
      this.skeleton = true
      this.hasData = false
      this.couponList = []
      this.loadingFlag = false
    },
    showDetail(position) {
      this.couponList.forEach((item, index) => {
        if (index === position) {
          item.show = !item.show
        } else {
          item.show = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my-coupons {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .my-coupons-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: 950px;
    & > :nth-child(2n + 1) {
      margin-right: 14px;
    }
    .ml-0 {
      margin: 0;
      margin-top: 20px;
    }
  }
  .my-coupons-unavilable-title {
    position: absolute;
    right: 0;
    top: -25px;
    height: 18px;
    font-size: 13px;
    font-family: @font-family-500;
    color: var(--color-121212);
    line-height: 18px;
    text-decoration: underline;
    cursor: pointer;
  }
}
/deep/ .az-overlay-box {
  top: 200px !important;
  left: 400px !important;
}
</style>
