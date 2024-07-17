<template>
  <div>
    <div v-if="!skeleton" class="azazie-perks">
      <div v-if="!isHistory" @click="showHistory" class="azazie-history-title">
        {{ nl('page_azazie_perks_purchase_history') }}
      </div>
      <template v-if="isHistory">
        <azazie-history></azazie-history>
      </template>
      <div v-else class="azazie-perks-box">
        <template v-if="perksData.length > 0">
          <template v-for="(item, index) in perksData">
            <azazie-perk-item @payment="paymentCheckout" :data="item" :key="index" :id="index"></azazie-perk-item>
          </template>
        </template>
        <template v-else>
          <div class="empty_order">
            <img src="~assets/images/order/no_order.png" alt="No order" />
            <p class="order-empty-text">{{ nl('page_azazie_perks_no_perks') }}</p>
          </div>
        </template>
      </div>
      <template v-if="pageInfo.totalPage">
        <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" :isLoading="false" @pageChange="pageChange"></az-pager>
      </template>
    </div>
    <div v-else class="skeleton">
      <img src="~/assets/images/rights/img-bg.png" alt="bg" width="200" />
      <img src="~/assets/images/rights/img-bg.png" alt="bg" width="200" />
    </div>
  </div>
</template>
<script>
import AzaziePerkItem from '@/components/rights/AzaziePerkItem.vue'
import AzazieHistory from '@/components/rights/AzazieHistory'
import azPager from '@/components/az-ui/Pager/AzPager'

export default {
  name: 'AzaziePerks',
  components: {
    AzaziePerkItem,
    AzazieHistory,
    azPager
  },
  data() {
    return {
      perksData: [],
      isHistory: false,
      payResult: false,
      pageInfo: {
        limit: 20,
        totalPage: 0, // 总页数
        page: 1 // 当前页
      },
      skeleton: true
    }
  },
  created() {
    if (this.$route.query.coupon_history) {
      this.isHistory = !!(this.$route.query.coupon_history * 1)
    }
    this.getRightsPage()
  },
  methods: {
    getRightsPage() {
      const params = {
        page: this.pageInfo.page,
        limit: 10
      }
      this.$axios
        .post('/1.0/rights/package', params)
        .then((res) => {
          this.skeleton = false
          if (res.data.code == 0) {
            this.perksData = res.data && res.data.data && [...res.data.data]
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    showHistory() {
      this.isHistory = !this.isHistory
      this.$emit('changeTitle', this.nl('page_azazie_perks_purchase_history'))
    },
    paymentCheckout(rightsId) {
      location.href = this.countryUrl(`/rights-checkout?rightsId=${rightsId}`)
    },
    pageChange(page) {
      this.pageInfo.page = page
      this.getRightsPage()
    }
  }
}
</script>

<style lang="less" scoped>
.azazie-perks {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  cursor: pointer;
  .azazie-perks-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .azazie-history-title {
    position: absolute;
    right: 0;
    top: -25px;
    height: 18px;
    line-height: 18px;
    font-size: 13px;
    font-family: @font-family-500;
    color: var(--color-121212);
    text-decoration: underline;
    cursor: pointer;
  }
}
.skeleton {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  flex-wrap: wrap;
}
.empty_order {
  text-align: center;
  margin: 0 auto;
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
</style>
