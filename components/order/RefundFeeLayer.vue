<template>
  <div v-if="refundFeeLayerShow" class="refund-fee-layer">
    <az-popup-layer
      :lockScroll="true"
      :z-index="12"
      @close="close"
      :title="nl('page_refund_reimbursement_limits_for_dresses')"
      width="466px"
      height="auto"
    >
      <div class="refund-fee-layer-box">
        <div class="refund-fee-container">
          <div class="refund-fee-list">
            <table class="base">
              <tbody>
                <tr>
                  <th>{{ nl('page_refund_dress_value') }}</th>
                  <th>{{ nl('page_refund_reimbursement_limit') }}</th>
                </tr>
                <tr v-for="(item, index) in limitRule" :key="index">
                  <!-- 除了'NL', 'BE', 'AT'，其它欧元货币符号在后面,克朗符号放金额后面 -->
                  <template v-if="['€', 'kr'].includes(currentCurrencySymbol) && !['NL', 'BE', 'AT'].includes(countryCode)">
                    <td v-if="index == 0">{{ nl('page_checkout_up_to') }} {{ item.max }}{{ currentCurrencySymbol }}</td>
                    <td v-else-if="index == limitRule.length - 1">
                      {{ nl('page_common_over') }} {{ item.min }}{{ currentCurrencySymbol }}
                    </td>
                    <td v-else>{{ item.min }}{{ currentCurrencySymbol }} - {{ item.max }}{{ currentCurrencySymbol }}</td>
                    <td>{{ item.limit }}{{ currentCurrencySymbol }}</td>
                  </template>
                  <template v-else>
                    <td v-if="index == 0">{{ nl('page_checkout_up_to') }} {{ currentCurrencySymbol }}{{ item.max }}</td>
                    <td v-else-if="index == limitRule.length - 1">
                      {{ nl('page_common_over') }} {{ currentCurrencySymbol }}{{ item.min }}
                    </td>
                    <td v-else>{{ currentCurrencySymbol }}{{ item.min }} - {{ currentCurrencySymbol }}{{ item.max }}</td>
                    <td>{{ currentCurrencySymbol }}{{ item.limit }}</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </az-popup-layer>
  </div>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import { mapState } from 'vuex'
export default {
  name: 'RefundFeeLayer',
  components: {
    AzPopupLayer
  },
  mixins: [],
  props: {
    limitRule: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('order', ['refundFeeLayerShow']),
    // 当前应该展示的货币单位，currencySymbol是全局数据，但是不同国家的订单数据中货币应该根据订单国家来展示，
    // 所以当url路径中存在order_country_code时，应该根据根据此国家标识来确定当前页面应该展示的货币单位
    currentCurrencySymbol() {
      const orderCountryCode = this.$route.query.order_country_code
      if (orderCountryCode) {
        // this.siteOptions是所有国家数据对象
        let tempCurrencySymbol = this.currencySymbol
        this.siteOptions.forEach((ele) => {
          if (ele.countryCode === orderCountryCode) {
            tempCurrencySymbol = ele.currencySymbol
          }
        })
        return tempCurrencySymbol
      } else {
        // 如果没有订单国家code，返回全局默认货币单位
        return this.currencySymbol
      }
    },
    countryCode() {
      return this.$route.query.order_country_code || this.country
    }
  },
  methods: {
    close() {
      this.$store.commit('order/setRefundFeeLayerShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.refund-fee-layer {
  /deep/.az-popup-box .layer-title {
    // background-color: var(--color-121212);
    font-family: @font-family-600, sans-serif;
    font-size: 16px;
    padding-top: 10px;
    text-transform: capitalize;
    text-align: center;
    letter-spacing: 0;
  }
  .refund-fee-layer-box {
    .refund-fee-layer-title {
      height: 69px;
      background-color: var(--color-121212);
      color: #ffffff;
      text-align: center;
      font-size: 13px;
      padding: 0 30px;
      margin-top: -2px;
    }
    .refund-fee-container {
      height: 196px;
      overflow-y: auto;
      overflow-x: hidden;
      .refund-fee-list {
        .base {
          width: 100%;
          border-color: grey;
          .header {
            font-size: 16px;
            font-family: @font-family-600, sans-serif;
          }
          tr {
            width: 100%;
            height: 35px;
            border-width: 1px 0;
            th:first-child,
            td:first-child {
              width: 265px;
              padding-left: 35px;
            }
            td:last-child {
              width: 125px;
            }
          }
          tr:nth-child(even) {
            background-color: #f6f6f6;
          }
        }
      }
      .bottom-note {
        margin: 30px 40px 30px 30px;
      }
    }
  }
}
</style>
