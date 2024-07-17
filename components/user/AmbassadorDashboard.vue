<template>
  <!-- 校园大使个人页面 -->
  <div>
    <div v-if="ambassadorData.isAmbassador" class="data-dashboard">
      <p class="term">{{ nl('page_ambassador_dashboard_term') }}: {{ dashboardData.start_date }} - {{ dashboardData.end_date }}</p>
      <p v-if="showNoteTip" class="data-dashboard-note">
        {{ isExpired ? nl('page_ambassador_dashboard_term_tip2') : nl('page_ambassador_dashboard_term_tip1') }}
        <span @click="handleContinue(true)">{{ nl('page_ambassador_dashboard_term_yes') }}</span>
        <span @click="handleContinue(false)">{{ nl('page_ambassador_dashboard_term_no') }}</span>
      </p>
      <div class="data-dashboard-input paypal-input">
        <p class="data-dashboard-input-title">
          {{ nl('page_ambassador_dashboard_my_paypal') }}{{ dashboardData.paypal_account ? `: ${dashboardData.paypal_account}` : '' }}
        </p>
        <p v-if="dashboardData.paypal_account" class="paypal-tip">
          {{ nl('page_ambassador_dashboard_my_paypal_tip') }}
        </p>
        <p v-else>
          <input :placeholder="nl('page_ambassador_my_paypal_placeholder')" v-model="paypal_account" type="text" />
          <az-button @click="tooglePaypalShow" class="btn btn-hollow">{{ nl('page_index_save') }}</az-button>
        </p>
      </div>
      <div class="data-dashboard-input">
        <p class="data-dashboard-input-title">{{ nl('page_ambassador_dashboard_my_link') }}</p>
        <p>
          <input v-model="dashboardData.share_url" type="text" disabled />
          <az-button v-clipboard:copy="dashboardData.share_url" v-clipboard:success="onCopySuccess" class="btn btn-hollow">{{
            nl('page_ambassador_dashboard_copy')
          }}</az-button>
        </p>
      </div>
      <div class="data-dashboard-input">
        <p class="data-dashboard-input-title">{{ nl('page_my_reference') }}</p>
        <p>
          <input v-model="dashboardData.my_code" type="text" disabled />
          <az-button v-clipboard:copy="dashboardData.my_code" v-clipboard:success="onCopySuccess" class="btn btn-hollow">{{
            nl('page_ambassador_dashboard_copy')
          }}</az-button>
        </p>
      </div>
      <ul class="data-dashboard-commission">
        <li v-for="item in commissionList" :key="item.name">
          <div>
            <p class="commission-title">{{ nl(item.name) }}</p>
            <p v-if="item.tip" class="commission-tip">
              <az-icon
                @mouseover.native="currentTip = item.name"
                @mouseleave.native="currentTip = null"
                icon-class="a-icon-question-mark"
                class="question-mark"
              ></az-icon>
              <span v-if="currentTip === item.name">{{ nl(item.tip) }}</span>
            </p>
          </div>
          <span v-if="['commission_paid', 'estimated_commission'].includes(item.value)" @click="linkTo(item.value)" class="link-text">
            {{ currencyUnitMap[country] + dashboardData[item.value] }}
          </span>
          <span v-else>
            {{ (['commission_unpaid'].includes(item.value) ? currencyUnitMap[country] : '') + dashboardData[item.value] }}
          </span>
        </li>
      </ul>
      <ul class="chart-list">
        <li v-for="(item, index) in chartList" :key="item.id">
          <p>{{ nl(item.name) }}{{ item.id === 3 ? `(${currencyUnitMap[country]})` : '' }}</p>
          <line-chart :chart-id="item.chartId" :chartData="item.chartData" v-if="isInit" :ref="item.chartId"></line-chart>
          <div class="chart-select">
            <p>
              {{ chartX[item.currentX]
              }}<az-icon
                @click="item.showOption = !item.showOption"
                :class="['arrow-down-icon', { 'arrow-up': item.showOption }]"
                icon-class="icon-lby_expand_arrow_down"
              ></az-icon>
            </p>
            <ul v-if="item.showOption" :class="{ open: item.showOption }">
              <li v-for="option in item.id === 3 ? yearList : quarterList" :key="option" @click="handleSelect(option, item, index)">
                {{ option }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <dashboard-banner v-else-if="ambassadorData.isAmbassador === false"></dashboard-banner>
    <div v-if="paypalSaveDialog" class="paypal-save-dialog">
      <div>
        <az-icon @click="tooglePaypalShow" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        <img :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/d5/49/82f1e803854e6bdfffb21b459defd549.jpg')" alt="" />
        <p>{{ nl('page_ambassador_dashboard_save_tip') }}</p>
        <p>
          <az-button @click="handleSave" class="btn btn-theme">{{ nl('page_index_save') }}</az-button>
          <az-button @click="tooglePaypalShow" class="btn btn-hollow">{{ nl('page_ambassador_dashboard_later') }}</az-button>
        </p>
      </div>
    </div>
    <p v-if="showTip" :class="['tip', tipType === 'error' ? 'error-tip' : 'success-tip']">{{ nl(tipContent) }}</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AzButton from '@/components/az-ui/Button/AzButton'
import LineChart from '@/components/help/ambassadorProgram/LineChart'
import DashboardBanner from '../help/ambassadorProgram/dashboardBanner'
export default {
  components: {
    DashboardBanner,
    AzButton,
    LineChart
  },
  data() {
    return {
      currentTip: null,
      paypalSaveDialog: false,
      showTip: false,
      dashboardData: {},
      tipContent: '',
      paypal_account: '',
      tipType: 'success',
      chartX: {
        currentPromotedQuarter: '',
        currentLinkClickQuarter: '',
        currentCommissionYear: ''
      },
      chartList: [
        {
          id: 1,
          name: 'page_ambassador_promoted_orders',
          chartId: 'orders_chart',
          showOption: false,
          currentX: 'currentPromotedQuarter',
          chartData: []
        },
        {
          id: 2,
          name: 'page_ambassador_link_clicks',
          chartId: 'link_chart',
          showOption: false,
          currentX: 'currentLinkClickQuarter',
          chartData: []
        },
        {
          id: 3,
          name: 'page_ambassador_commission_paid',
          chartId: 'paid_chart',
          showOption: false,
          currentX: 'currentCommissionYear',
          chartData: []
        }
      ],
      yearList: [],
      quarterList: [],
      isInit: false
    }
  },
  computed: {
    ...mapState('userInfo', ['ambassadorData']),
    showNoteTip() {
      return this.dashboardData.is_notice && this.dashboardData.limit_days <= 20 && this.dashboardData.status !== 'End cooperation'
    },
    isExpired() {
      return this.dashboardData.limit_days < 0
    },
    commissionList() {
      return [
        {
          name: 'page_ambassador_estimated_commission',
          tip: 'page_ambassador_estimated_commission_tip',
          value: 'estimated_commission'
        },
        {
          name: 'page_ambassador_commission_paid',
          tip: 'page_ambassador_commission_paid_tip',
          value: 'commission_paid'
        },
        {
          name: 'page_ambassador_commission_unpaid',
          tip: `page_ambassador_commission_unpaid_tip${this.country !== 'US' ? `_${this.country.toLowerCase()}` : ''}`,
          value: 'commission_unpaid'
        },
        {
          name: 'page_ambassador_valid_users',
          tip: 'page_ambassador_valid_users_tip',
          value: 'valid_users'
        },
        {
          name: 'page_ambassador_promoted_orders',
          tip: 'page_ambassador_promoted_orders_tip',
          value: 'promoted_orders'
        },
        {
          name: 'page_ambassador_link_clicks',
          tip: 'page_ambassador_link_clicks_tip',
          value: 'link_clicks'
        }
      ]
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
  mounted() {
    // 获取dashboard数据
    this.$axios.$get('/1.0/ambassador/dashboard').then((res) => {
      this.dashboardData = res.data || {}
      if (this.dashboardData.chart_select) {
        this.quarterList = this.dashboardData.chart_select.quarter
        this.yearList = this.dashboardData.chart_select.year
        this.chartX = {
          currentPromotedQuarter: this.quarterList[this.quarterList.length - 1],
          currentLinkClickQuarter: this.quarterList[this.quarterList.length - 1],
          currentCommissionYear: this.yearList[this.yearList.length - 1]
        }
        this.getChartData()
      }
    })
  },
  methods: {
    /* 获取图表数据 */
    getChartData(chartType, searchParams, index) {
      this.$axios
        .$get('/1.0/ambassador/chart', {
          params: {
            chart_type: chartType,
            search_params: searchParams
          }
        })
        .then((res) => {
          if (res.code === 0) {
            if (index && chartType) {
              this.$set(
                this.chartList[index - 1],
                'chartData',
                !res.data[chartType] || res.data[chartType].length === 0 ? [] : this.formatChartData(res.data[chartType])
              )
              this.$nextTick(() => {
                this.$refs[chartType][0].drawLineChart()
              })
            } else {
              this.chartList.forEach((chart, i) => {
                this.$set(
                  this.chartList[i],
                  'chartData',
                  !res.data[chart.chartId] || res.data[chart.chartId].length === 0 ? [] : this.formatChartData(res.data[chart.chartId])
                )
              })
              console.log(this.chartList)
            }
          }
          this.isInit = true
        })
    },
    formatChartData(obj) {
      const arr = []
      for (const key in obj) {
        arr.push({ x: key, y: obj[key] })
      }
      return arr
    },
    /* 复制成功 */
    onCopySuccess() {
      this.tipType = 'success'
      this.tipShow('page_common_copy_successfully')
    },
    tipShow(content) {
      this.showTip = true
      this.tipContent = content
      this.timer = setTimeout(() => {
        this.showTip = false
        this.timer = null
      }, 1500)
    },
    tooglePaypalShow() {
      if (!this.paypalSaveDialog && !this.paypal_account.trim()) return
      this.paypalSaveDialog = !this.paypalSaveDialog
    },
    /* 续约/不显示note */
    handleContinue(isNotice) {
      this.$axios.$post('/1.0/ambassador/renew', { is_notice: isNotice }).then((res) => {
        if (res.code === 0) {
          this.$set(this.dashboardData, 'is_notice', false)
          if (isNotice === false) {
            this.tipType = 'success'
            this.tipShow('page_common_continue_successfully')
          }
        } else {
          this.tipType = 'error'
          this.tipShow(res.msg)
        }
      })
    },
    /* 保存paypal */
    handleSave() {
      this.$axios
        .$post('/1.0/ambassador/paypal', {
          paypal: this.paypal_account
        })
        .then((res) => {
          if (res.code === 0) {
            this.paypalSaveDialog = false
            this.dashboardData.paypal_account = this.paypal_account
          } else {
            this.tipType = 'error'
            this.tipShow(res.msg)
          }
        })
    },
    /* 图表切换季度或年 */
    handleSelect(option, item, index) {
      this.$set(this.chartX, item.currentX, option)
      this.$set(this.chartList[index], 'showOption', false)
      this.getChartData(item.chartId, option, index + 1)
    },
    linkTo(type) {
      location.href = this.countryUrl(`/user?ambassador_commission_details&type=${type}`)
    }
  }
}
</script>
<style lang="less" scoped>
.data-dashboard {
  position: relative;
  .term {
    position: absolute;
    top: -25px;
    right: 0;
    font-family: @font-family-500;
    font-size: 13px;
    text-align: center;
    color: var(--color-999999);
  }
  &-note {
    display: flex;
    padding: 0 10px;
    width: calc(100% - 20px);
    height: 40px;
    line-height: 40px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    background: var(--color-ede1d3);
    span {
      display: block;
      font-family: @font-family-600;
      font-size: 13px;
      text-decoration-line: underline;
      cursor: pointer;
      &:first-child {
        margin-left: 25px;
        color: var(--color-121212);
      }
      &:last-child {
        margin-left: 15px;
        color: #999;
      }
    }
  }
  &-input {
    &.paypal-input {
      padding-top: 20px;
    }
    margin-bottom: 20px;
    .paypal-tip {
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-999999);
    }
    &-title {
      margin-bottom: 5px;
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-121212);
    }
    p {
      display: flex;
    }
    input {
      width: 813px;
    }
    .btn {
      display: block;
      margin-left: 10px;
      min-width: 80px;
      width: 80px;
      height: 40px;
      font-family: @font-family-500;
      font-size: 14px;
      text-transform: uppercase;
    }
  }
  &-commission {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      padding: 12px;
      margin-bottom: 15px;
      width: 267px;
      height: 46px;
      background: var(--color-f9f9f9);
      & > div {
        display: flex;
        align-items: center;
      }
      & > span {
        margin-top: 2px;
        font-family: @font-family-500;
        font-size: 16px;
        letter-spacing: 0.02em;
        text-transform: capitalize;
        color: var(--color-121212);
      }
      .commission-title {
        font-family: @font-family-500;
        font-size: 13px;
        text-transform: capitalize;
        color: var(--color-121212);
      }
      .commission-tip {
        position: relative;
        margin-left: 6px;
        .question-mark {
          width: 12px;
          height: 12px;
          fill: #888888;
          cursor: pointer;
        }
        span {
          display: block;
          position: absolute;
          left: -141px;
          top: 22px;
          padding: 12px;
          width: 267px;
          border: 1px solid var(--color-cccccc);
          border-radius: 5px;
          background: #fff;
          z-index: 4;
          font-family: @font-family-500;
          font-size: 13px;
          line-height: 18px;
          color: var(--color-121212);
          &::after {
            position: absolute;
            top: -6px;
            left: 50%;
            margin-left: -5px;
            content: '';
            display: inline-block;
            z-index: 3;
            width: 10px;
            height: 10px;
            background: #fff;
            border-left: 1px solid var(--color-cccccc);
            border-top: 1px solid var(--color-cccccc);
            transform: rotate(45deg);
          }
        }
      }
    }
    .link-text {
      cursor: pointer;
      &:hover {
        color: @theme-color;
      }
    }
  }
  .chart-list {
    margin-top: 25px;
    & > li {
      position: relative;
      margin-bottom: 60px;
      & > p {
        font-family: @font-family-500;
        font-size: 14px;
        text-transform: uppercase;
        color: var(--color-121212);
      }
      .chart-select {
        position: absolute;
        width: 100px;
        top: 20px;
        right: 0;
        & > p {
          font-family: @font-family-500;
          font-size: 13px;
          color: var(--color-121212);
          .az-icon {
            margin-left: 5px;
            cursor: pointer;
            user-select: none;
          }
          .arrow-up {
            transform: rotate(180deg);
          }
        }
        ul {
          width: 100px;
          background: #fff;
          margin-top: 5px;
          border-radius: 3px;
          box-shadow: 0 0 4px #ccc;
          transform: scaleY(0);
          &.open {
            transform: scaleY(1);
            transition: 0.2s;
            transform-origin: top center;
          }
          li {
            height: 35px;
            line-height: 35px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.paypal-save-dialog {
  position: fixed;
  z-index: @popuy-z-index;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    width: 440px;
    height: 273px;
    background: #fff;
    .icon {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 15px;
      height: 15px;
      fill: var(--color-121212);
      cursor: pointer;
    }
    img {
      display: block;
      margin: auto;
      margin-bottom: 25px;
      width: 254px;
      height: 150px;
    }
    p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 440px;
      font-family: @font-family-500;
      font-size: 14px;
      line-height: 19px;
      text-align: center;
      color: var(--color-121212);
    }
  }
  .btn {
    display: block;
    margin: auto;
    width: 210px;
    height: 40px;
    margin-top: 20px;
    font-weight: 600;
    text-transform: uppercase;
  }
}
.tip {
  position: fixed;
  top: 20px;
  left: 50%;
  width: 500px;
  padding: 15px;
  border-radius: 5px;
  z-index: @popuy-z-index;
  opacity: 1;
  transform: translateX(-50%);
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
}
.success-tip {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}
.error-tip {
  background-color: #f76a71;
  color: #792626;
  border: 1px solid #fbadad;
}
</style>
