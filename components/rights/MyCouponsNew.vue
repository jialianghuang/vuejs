<template>
  <div class="my-coupons-new">
    <az-tabs :options="tabs" @onChange="handleTabsChange" height="28px" mode="left"></az-tabs>
    <div ref="myCouponsMain" class="my-coupons-new-main">
      <coupon-item v-for="item in list" :key="item.couponCode" :val="item"></coupon-item>
    </div>
    <no-data v-if="list.length === 0 && !loading"></no-data>
    <az-loading v-if="loading"></az-loading>
  </div>
</template>
<script>
import AzTabs from '@/components/az-ui/AzTabs'
import CouponItem from '@/components/coupon/CouponItem'
import NoData from '@/components/common/NoData'
import AzLoading from '@/components/az-ui/AzLoading'

/**
 * MyCoupons新版本组件
 * TODO：待本组件稳定使用后，MyCoupons.vue文件可删除
 * /user?my_coupons
 */
export default {
  components: {
    AzTabs,
    CouponItem,
    NoData,
    AzLoading
  },
  data() {
    return {
      status: 'available', // 切换卡状态，优惠券状态
      tabs: [
        {
          name: 'page_coupon_tab_available_coupons',
          key: 'available',
          ec: 'mycoupon',
          el: 'available'
        },
        {
          name: 'page_coupon_tab_no_available_text',
          key: 'unavailable',
          ec: 'mycoupon',
          el: 'notavailable'
        }
      ],
      pageInfo: {
        page: 1,
        limit: 20,
        totalPage: 1
      },
      list: [],
      couponMainHeight: '',
      loading: true
    }
  },
  mounted() {
    this.queryData()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const myCouponsMainHeight = this.$refs.myCouponsMain.scrollHeight + this.$refs.myCouponsMain.offsetTop
      if (scrollTop + clientHeight >= myCouponsMainHeight - 160) {
        // 如果当前页码小于总页码，查询页码加1
        if (this.pageInfo.page < this.pageInfo.totalPage) {
          this.pageInfo.page++
          this.queryData()
        }
        // 移除滚动监听，避免重复执行上述代码
        window.removeEventListener('scroll', this.handleScroll, true)
      }
    },
    // 查询数据
    queryData() {
      this.loading = true
      const params = {
        page: this.pageInfo.page,
        available: this.status === 'available',
        limit: this.pageInfo.limit
      }
      // 查询优惠券接口
      this.$axios
        .$post(`/1.0/coupon/my-coupon`, params)
        .then((res) => {
          this.loading = false
          if (res && res.data) {
            const data = res.data
            data.couponList.forEach((ele) => {
              this.list.push(ele)
            })
            this.pageInfo = data.pageInfo || { page: 1, limit: 20, totalPage: 1 }
            // 如果查询页面小于总页码，恢复内容滚动监听，以进行下一页查询
            if (this.pageInfo.page < this.pageInfo.totalPage) {
              window.addEventListener('scroll', this.handleScroll, true)
            }
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    // 切换卡切换操作
    handleTabsChange(e) {
      this.status = e
      this.list = []
      this.queryData()
    }
  }
}
</script>
<style lang="less" scoped>
.my-coupons-new {
  overflow: hidden;
  &-main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: auto;
    /deep/ .coupon-item {
      margin-top: 15px;
    }
  }
}
</style>
