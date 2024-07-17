<template>
  <!-- 校园大使佣金明细页面 -->
  <div class="ambassador-commission-details">
    <dashboard-banner v-if="ambassadorData.isAmbassador === false" :title="nl('page_ambassador_commission_details')"></dashboard-banner>
    <template v-else-if="ambassadorData.isAmbassador">
      <az-tabs :options="tabs" @onChange="handleTabsChange" :default="defaultTab" height="28px" mode="left"></az-tabs>
      <div v-if="!loading" class="commission-details-main">
        <div class="filter-module">
          <date-picker
            v-if="status === 'estimated_commission'"
            :lang="datePickerLang"
            :disabled-date="disabledMonth"
            :editable="false"
            v-model="month"
            :placeholder="nl('page_ambassador_select_month')"
            :input-attr="{ 'aria-label': 'date picker' }"
            type="month"
            format="YYYY-MM"
            value-type="format"
          ></date-picker>
          <date-picker
            v-else
            :lang="datePickerLang"
            :disabled-date="disabledYear"
            :editable="false"
            v-model="year"
            :placeholder="nl('page_ambassador_select_year')"
            :input-attr="{ 'aria-label': 'date picker' }"
            type="year"
            value-type="YYYY"
          ></date-picker>
          <p v-if="list.length > 0">{{ nl('page_order_total') }}: {{ formatAmount(totalCount, true) }}</p>
        </div>
        <template v-if="list.length > 0">
          <ul class="commission-list">
            <li v-for="item in list" :key="item.id">
              <p v-if="status === 'estimated_commission'" class="commission-list-type">
                <az-icon
                  :icon-class="typeMap[item.serial_type] && typeMap[item.serial_type].icon"
                  class="ambassador-commission-icon"
                ></az-icon
                ><span>{{ item.serial_type }}</span>
              </p>
              <p v-else class="commission-list-type">
                <az-icon icon-class="ambassador-commission-order-deposit"></az-icon>
                <span>{{ nl('page_ambassador_commission_deposit') }}</span>
              </p>
              <p :style="{ color: typeMap[item.serial_type] && typeMap[item.serial_type].color }" class="commission-list-amount">
                {{
                  (status === 'estimated_commission' ? typeMap[item.serial_type] && typeMap[item.serial_type].amountType : '') +
                    formatAmount(item.commission_amount, status === 'commission_paid' || item.serial_type === 'Order Canceled')
                }}
              </p>
              <p class="commission-list-time">{{ status === 'commission_paid' ? item.payment_time : item.order_time }}</p>
            </li>
          </ul>
          <az-pager
            :totalPage="pageInfo.totalPage"
            :page="pageInfo.page * 1"
            :isLoading="loading"
            @pageChange="pageChange"
            class="pager"
          ></az-pager>
        </template>
      </div>
      <div v-if="list.length === 0 && !loading" class="empty-data">
        <img src="~assets/images/order/no_order.png" alt="No order" />
        <p class="empty-text">{{ nl('page_ambassador_no_data') }}</p>
      </div>
      <az-loading v-if="loading"></az-loading>
    </template>
  </div>
</template>
<script>
import AzTabs from '@/components/az-ui/AzTabs'
import AzLoading from '@/components/az-ui/AzLoading'
import DatePicker from 'vue2-datepicker'
import azPager from '@/components/az-ui/Pager/AzPager'
import { mapState } from 'vuex'
import DashboardBanner from '../help/ambassadorProgram/dashboardBanner'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'

export default {
  components: {
    AzTabs,
    AzLoading,
    DatePicker,
    azPager,
    DashboardBanner
  },
  data() {
    return {
      status: '',
      defaultTab: '',
      tabs: [
        {
          name: 'page_ambassador_estimated_commission',
          key: 'estimated_commission',
          ec: 'ambassador commission details',
          el: 'estimated_commission'
        },
        {
          name: 'page_ambassador_commission_paid',
          key: 'commission_paid',
          ec: 'ambassador commission details',
          el: 'commission_paid'
        }
      ],
      pageInfo: {
        page: 1,
        limit: 12,
        totalPage: 1
      },
      list: [],
      couponMainHeight: '',
      loading: false,
      month: null,
      year: new Date().getFullYear().toString(),
      totalCount: 0
    }
  },
  computed: {
    ...mapState('userInfo', ['ambassadorData']),
    datePickerLang() {
      const datePickerLang = this.language || 'en'
      return datePickerLang
    },
    typeMap() {
      return {
        Earning: { icon: 'ambassador-commission-earning', color: 'var(--color-121212)', amountType: '+' },
        Refund: { icon: 'ambassador-commission-refund', color: 'var(--color-121212)', amountType: '-' },
        'Order Canceled': { icon: 'ambassador-commission-order-canceled', color: '#ccc', amountType: '' }
      }
    },
    currencyUnitMap() {
      return {
        US: '$',
        CA: 'CA$',
        AU: 'AU$',
        GB: '￡'
      }
    }
  },
  watch: {
    month() {
      this.queryData(1)
    },
    year() {
      this.queryData(1)
    }
  },
  created() {
    this.status = this.$route.query.type || 'estimated_commission'
    this.defaultTab = this.status
    this.queryData(1)
  },
  methods: {
    disabledMonth(date) {
      // Can not select days before 2022-10 or after today
      return date && (date < this.$dayjs('2022-10').startOf('month') || date > this.$dayjs().endOf('month'))
    },
    disabledYear(date) {
      return date && (date < this.$dayjs('2022').startOf('year') || date > this.$dayjs().endOf('year'))
    },
    // 查询数据
    queryData(page) {
      this.loading = true
      this.pageInfo.page = page
      const params = {
        page,
        limit: this.pageInfo.limit
      }
      const requestInterface =
        this.status === 'estimated_commission'
          ? this.$axios.$get(`/1.0/ambassador/estimated`, { params: { ...params, search_date: this.month } })
          : this.$axios.$get(`/1.0/ambassador/paid`, { params: { ...params, search_date: this.year } })
      // 获取预估佣金列表接口
      requestInterface
        .then((res) => {
          this.loading = false
          if (res && res.data) {
            this.list = res.data.data
            this.pageInfo = res.data.pageInfo
            this.totalCount = res.data.estimated_amount
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    // tab切换
    handleTabsChange(e) {
      this.status = e
      this.list = []
      this.queryData(1)
    },
    // 分页
    pageChange(e) {
      this.queryData(e)
    },
    formatAmount(amount, hasSymbol) {
      let amountNew = +amount
      amountNew = (amountNew < 0 && hasSymbol ? `-` : ``) + this.currencyUnitMap[this.country] + Math.abs(amountNew)
      return amountNew
    }
  }
}
</script>
<style lang="less" scoped>
.ambassador-commission-details {
  overflow: hidden;
  .filter-module {
    display: flex;
    align-items: center;
    margin-top: 20px;
    & > p {
      margin-left: 30px;
      font-family: @font-family-600;
      font-size: 16px;
      color: var(--color-121212);
    }
    /deep/ .mx-datepicker {
      width: 150px;
    }
    /deep/ .mx-input {
      display: block;
      height: 36px;
      border: 1px solid @border-color !important;
      border-radius: 0;
    }
  }
  .commission-list {
    margin-top: 15px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #eee;
      .az-icon {
        margin-right: 10px;
        width: 18px;
        height: 18px;
        fill: #fff;
      }
      & > p {
        width: calc(100% / 3);
      }
    }
    &-type {
      display: flex;
      align-items: center;
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-121212);
    }
    &-amount {
      font-family: @font-family-600;
      font-weight: 600;
      text-align: center;
    }
    &-time {
      text-align: right;
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-999999);
    }
  }
}
.empty-data {
  text-align: center;
  img {
    display: block;
    width: 132px;
    margin: 90px auto 0 auto;
  }
  .empty-text {
    font-size: 14px;
    color: #666;
    font-family: @font-family-500;
    margin-top: 30px;
  }
}
.pager {
  margin-top: 40px;
}
</style>
