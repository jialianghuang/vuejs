<template>
  <div v-if="shippingFeeLayerShow" class="shipping-fee-layer">
    <az-popup-layer
      :lockScroll="true"
      :z-index="12"
      :close-color="'#fff'"
      @close="close"
      :title="nl('page_shipping_how_much')"
      width="660px"
      height="auto"
    >
      <div class="shipping-fee-layer-box">
        <div class="shipping-fee-layer-title">
          <p v-html="nl('page_shipping_rate_check')" class="question"></p>
          <p class="shipping-fee-cyber-tips">{{ nl(`page_black_firday_shipping_fee_pop_statment_${country.toLowerCase()}`) }}</p>
        </div>
        <div class="shipping-fee-container">
          <div class="shipping-fee-list">
            <table class="base">
              <tbody>
                <tr>
                  <td class="header" colspan="3">{{ nl('page_cost_freight') }}</td>
                </tr>
                <tr>
                  <th>{{ nl('page_checkout_order_value') }}</th>
                  <th>{{ nl('page_cart_rush_type_standard') }}</th>
                  <th v-if="showExpeditedTitle">{{ nl('page_checkout_shipping_expedited_title') }}</th>
                </tr>
                <template v-for="(item, index) in shippingFeeList">
                  <template v-if="shippingFeeList.length >= 13">
                    <tr v-if="index < 13" :key="index">
                      <td>
                        {{ !item.min ? nl('page_checkout_up_to') : item.minDisplay }}
                        {{ !item.min ? '' : ' - ' }}
                        {{ item.maxDisplay }}
                      </td>
                      <td>{{ item.feeDisplay }}</td>
                      <td v-if="showExpeditedTitle">{{ item.expeditedDisplay || ' / ' }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr :key="index">
                      <td>
                        {{ !item.min ? nl('page_checkout_up_to') : item.minDisplay }}
                        {{ !item.min || !item.max ? '' : ' - ' }}
                        {{ !item.max ? nl('page_common_and_above') : item.maxDisplay }}
                      </td>
                      <td>{{ item.feeDisplay }}</td>
                      <td v-if="showExpeditedTitle">{{ item.expeditedDisplay || ' / ' }}</td>
                    </tr>
                  </template>
                </template>
                <tr v-if="!more && shippingFeeList.length >= 13">
                  <td colspan="3">
                    <div @click="showMore" class="show-more">
                      {{ nl('page_common_show_all') }}
                      <img :src="require('~/assets/images/cart/show_more_fee.png')" alt="show more" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-if="more" class="more">
              <template v-for="(item, index) in shippingFeeList">
                <tr v-if="index >= 13" :key="index">
                  <td>
                    {{ item.minDisplay }}
                    {{ !item.max ? '' : ' - ' }}
                    {{ !item.max ? nl('page_common_and_above') : item.maxDisplay }}
                  </td>
                  <td>{{ item.feeDisplay }}</td>
                  <td v-if="showExpeditedTitle">{{ item.expeditedDisplay || ' / ' }}</td>
                </tr>
              </template>
            </table>
          </div>
          <div class="bottom-note">
            <p>{{ nl('page_shipping_canadian_charge') }}</p>
            <p style="margin-top: 30px">{{ nl('page_cost_love_note') }}</p>
            <p v-if="country === 'US'" class="shipping-fee-tips">{{ nl('page_checkout_shipping_expedited_desc') }}</p>
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
  name: 'ShippingFeeLayer',
  components: {
    AzPopupLayer
  },
  mixins: [],
  props: {},
  data() {
    return {
      more: false,
      shippingFeeList: [],
      showExpedited: 0
    }
  },
  computed: {
    ...mapState('cart', ['shippingFeeLayerShow']),
    showExpeditedTitle({ showExpedited, country }) {
      // shippingFeeList.some((item) => item.expeditedDisplay) &&
      // return ['US', 'AU', 'CA'].includes(country)
      return showExpedited
    }
  },
  created() {
    this.getShippingFeeList()
  },
  methods: {
    getShippingFeeList() {
      this.$axios.$get('/1.0/shipping/fee/conf').then((res) => {
        if (res.code == 0) {
          this.shippingFeeList = res.data.shippingFee
          this.showExpedited = res.data.showExpedited
        }
      })
    },
    close() {
      this.$store.commit('cart/setShippingFeeLayerShow', false)
    },
    showMore() {
      this.more = true
    }
  }
}
</script>

<style lang="less" scoped>
.shipping-fee-layer {
  /deep/.az-popup-box {
    padding: 0 0 40px 0 !important;
    .layer-title {
      background-color: #f6f6f6;
      font-family: @font-family-600;
      font-size: 24px;
      padding-top: 15px;
      text-transform: capitalize;
      text-align: center;
      letter-spacing: 0;
      border-bottom: none;
      padding-top: 45px;
      padding-bottom: 20px;
      margin-bottom: 0;
    }
  }
  .shipping-fee-layer-box {
    .shipping-fee-layer-title {
      // height: 69px;
      background-color: #f6f6f6;
      text-align: center;
      font-size: 13px;
      padding: 0 30px;
      // margin-top: -2px;
      font-family: @font-family-600;
      padding-bottom: 40px;
      .shipping-fee-cyber-tips {
        color: @theme-color;
        margin-top: 10px;
      }
    }

    .shipping-fee-container {
      padding: 0 40px;
      height: 480px;
      overflow-y: auto;
      overflow-x: hidden;
      .shipping-fee-list {
        .base,
        .more {
          width: 100%;
          border-color: grey;
          .header {
            font-size: 16px;
            font-family: @font-family-600;
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

            th:first-child:nth-last-child(2),
            td:first-child:nth-last-child(2) {
              width: 200px;
              padding-left: 35px;
            }
          }
          tr:nth-child(even) {
            background-color: #f6f6f6;
          }
        }
        .more {
          tr:nth-child(odd) {
            background-color: #ffffff;
          }
          tr:nth-child(even) {
            background-color: #f6f6f6;
          }
        }
        .show-more {
          cursor: pointer;
          text-align: center;
          width: calc(100% - 35px);
        }
      }
      .bottom-note {
        margin: 30px 40px 30px 30px;
        .shipping-fee-tips {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
