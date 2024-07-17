<template>
  <div class="edit-address-box">
    <main-app :navigation="navigation">
      <div v-if="!isSuccess" class="main-content account-width clearfix">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="account-flex">
          <account-menu v-if="!isGuest" :currentMenuType="currentMenuType" :accountMenu="accountMenu"></account-menu>
          <div class="account-right">
            <div class="order-info">
              <ul class="order-basic">
                <li>
                  <span>{{ nl('page_order_order_date') }}:</span> {{ orderTime }}
                </li>
                <li>
                  <span>{{ nl('page_common_order_number') }}:</span> {{ orderSn }}
                </li>
                <li>
                  <span>{{ nl('page_order_order_total') }}:</span> {{ orderAmountDisplay }}
                </li>
              </ul>
              <a :href="countryUrl(`/order/detail?order_sn=${orderSn}`)" class="account-back"
                >{{ nl('page_email_back_to_order_details') }} ></a
              >
            </div>
            <h2 class="edit-address-title">{{ nl('page_order_shipping_address') }}</h2>
            <div class="edit-address-conten">
              <div class="address-line">
                <div
                  v-for="(item, index) in shippingAddress"
                  @click="handleChooseAddress(index)"
                  :key="item.addressId"
                  :class="{ selected: selectAddressIndex == index }"
                  class="address-card"
                >
                  <div v-if="deleteLoading && removeIndex == index" class="shipping-add-address-card">
                    {{ `${nl('page_order_progress_processing')}...` }}
                  </div>
                  <template v-else>
                    <span :class="{ selected: selectAddressIndex == index }" class="radio-icon"></span>
                    <div class="shipping-address-content">
                      <address-info :addressInfo="item"></address-info>
                      <div @click.stop="handleEdite(index, 'shipping')" class="address_card_btn edit_address_btn">
                        {{ nl('page_address_edit') }}
                      </div>
                      <div @click.stop="handleRemove(item.addressId, index)" class="address_card_btn remove_address_btn">
                        {{ nl('page_address_remove') }}
                      </div>
                    </div>
                  </template>
                </div>
                <div class="address-card">
                  <div @click="handleNewAddress()" class="shipping-add-address-card">
                    <az-icon class="plus" icon-class="checkout_add"></az-icon>
                    <span>{{ nl('page_address_addnew') }}&nbsp;{{ nl('page_order_shipping_address') }}</span>
                  </div>
                </div>
              </div>
              <az-button
                @click="saveOrderAddress()"
                :loading="saveAddressLoading"
                :disabled="saveAddressLoading || !shippingAddress.length"
                :needIcon="false"
                class="btn btn-default btn-save"
              >
                {{ saveAddressLoading ? `${nl('page_order_progress_processing')}...` : nl('page_address_ship_to_this_address') }}
              </az-button>
            </div>
          </div>
        </div>
        <!-- 新增和编辑地址弹框 -->
        <popup-address
          @closeAddressPopup="closeAddressPopup"
          v-if="isAddressPopupShow"
          :addressInfo="addressEditing"
          @handleSaveAddress="handleSaveAddress"
          @setSuggestAddress="setSuggestAddress"
          :addressType="1"
          :sortBy="'addressId'"
          :editOrderAddressOrderSn="orderSn"
          :popupTitle="nl('page_address_shipping')"
          :zIndex="12"
        ></popup-address>
        <!-- 建议地址弹框 -->
        <popup-suggest-address
          :visible.sync="isSuggestAddressPopupShow"
          :list="suggestAddressList"
          :loading="suggestAddressLoading"
          @confirm="handleSaveSuggestAddress"
          @clickEdit="handleSuggestEdite"
        ></popup-suggest-address>
      </div>
      <div v-else class="main-content normal-width clearfix edit-result">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="content">
          <div class="icon icon-ok"></div>
          <div class="txt" style="width: 410px">{{ nl('page_cancel_updated_address') }}</div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import BreadCrumb from '@/components/common/Breadcrumb'
import AccountMenu from '@/components/user/AccountMenu'
import AddressInfo from '@/components/checkout/AddressInfo'
import PopupAddress from '@/components/checkout/PopupAddress'
// import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import backToTop from '@/components/common/BackToTop'
import PopupSuggestAddress from '@/components/checkout/PopupSuggestAddress'
import { mapState } from 'vuex'
import { init, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import accountMixins from '@/assets/js/accountMixins'

export default {
  name: 'EditAddress',
  components: {
    mainApp,
    AddressInfo,
    PopupAddress,
    // AzPopupLayer,
    BreadCrumb,
    AccountMenu,
    AzButton,
    backToTop,
    PopupSuggestAddress
  },
  mixins: [accountMixins],
  data() {
    return {
      flashSaleInfo: null,
      isSuccess: false,
      currentMenuType: '',
      editIndex: -1,
      suggestAddressLoading: false,
      isAddressPopupShow: false, // 新增编辑地址弹框是否显示
      isSuggestAddressPopupShow: false, // 建议地址是否显示
      selectAddressIndex: 0,
      selectSuggestAddressIndex: 1,
      editSuggestIndex: 0,
      suggestAddressList: [],
      saveAddressLoading: false,
      currentActIndex: 0,
      deleteLoading: false
    }
  },
  computed: {
    ...mapState('userInfo', ['isGuest', 'isRetailer', 'ambassadorData']),
    ...mapState('checkout', ['shippingAddress']),
    addressEditing() {
      let tempAddressInfo = {}
      if (Object.keys(this.suggestAddressList).length) {
        tempAddressInfo = this.suggestAddressList.length ? this.suggestAddressList[this.editSuggestIndex] : {}
      } else {
        tempAddressInfo = this.shippingAddress.length ? this.shippingAddress[this.editIndex] : {}
      }
      return tempAddressInfo
    },
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        viewOrder: {
          href: `/order/list`,
          title: this.nl('page_orders_title')
        },
        changeShippingAddress: {
          title: this.nl('page_email_change_shipping_address')
        }
      }
    },
    // url路径中携带的订单国家code
    orderCountryCode() {
      const res = this.$route.query.order_country_code
      return res
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'editAddress')
      const query = context.route.query
      const url = '/1.0/order/edit-address'
      const res = await context.$axios.$get(url, {
        params: {
          ...query
        }
      })

      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 0) {
        context.store.commit('checkout/setAddressInfo', res.data.addressList)
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, `/user/login?back=${context.route.fullPath}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/order/list')
        return
      }

      await getUserIdentity(context)

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        orderTime: res.data.orderTime,
        orderSn: res.data.orderSn,
        orderAmountDisplay: res.data.orderAmountDisplay
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 新增地址
    handleNewAddress() {
      this.editIndex = -1
      this.isAddressPopupShow = true
      this.currentActIndex = 0
    },
    // 选择地址
    handleChooseAddress(index) {
      this.selectAddressIndex = index
    },
    // 编辑
    handleEdite(index) {
      this.editIndex = index
      this.isAddressPopupShow = true
      this.currentActIndex = index
    },
    // 建议地址编辑
    handleSuggestEdite(index) {
      this.closeSuggestAddressPopup()
      this.isAddressPopupShow = true
      this.editSuggestIndex = index
    },
    // 删除地址
    handleRemove(addressId, index) {
      this.removeIndex = index
      this.deleteLoading = true
      let url = '/1.0/address/delete?address_id=' + addressId + '&address_type=1'
      if (this.orderCountryCode) {
        url = url + '&order_country_code=' + this.orderCountryCode
      }
      this.$axios
        .$get(url)
        .then((res) => {
          if (res.code == 0) {
            res.data.addressList && this.$store.commit('checkout/setAddressInfo', res.data.addressList)
            this.removeIndex = -1
            this.selectAddressIndex = 0
          } else {
            this.deleteLoading = false
          }
        })
        .catch((error) => {
          console.log(error)
          this.deleteLoading = false
        })
    },
    setSuggestAddress(suggestAddressList) {
      this.isAddressPopupShow = false
      this.isSuggestAddressPopupShow = true
      this.suggestAddressList = suggestAddressList
    },
    handleSaveAddress() {
      this.closeAddressPopup()
      if (Object.keys(this.suggestAddressList).length) {
        this.isSuggestAddressPopupShow = true
      } else {
        this.selectAddressIndex = this.currentActIndex
      }
    },
    // 关闭弹窗
    closeAddressPopup() {
      this.isAddressPopupShow = false
      this.setAddressEditeState()
    },
    // 关闭建议地址弹窗
    closeSuggestAddressPopup() {
      this.isSuggestAddressPopupShow = false
    },
    // 选择建议地址
    handleSelectSuggestAddress(index) {
      this.selectSuggestAddressIndex = index
    },
    // 选择保存建议地址
    handleSaveSuggestAddress(i) {
      this.suggestAddressLoading = true
      const tempShippingAddress = this.suggestAddressList[i]
      const act = tempShippingAddress.addressId ? 'edit' : 'add'
      const param = {
        check_validation: 0,
        address_type: 1,
        first_name: tempShippingAddress.firstName,
        last_name: tempShippingAddress.lastName,
        country: tempShippingAddress.country,
        province: tempShippingAddress.province,
        city_text: tempShippingAddress.cityText,
        address: tempShippingAddress.address,
        sign_building: tempShippingAddress.signBuilding,
        zipcode: tempShippingAddress.zipcode,
        tel: tempShippingAddress.tel
      }
      // 如果页面url路径存在国家code，传入国家code
      if (this.orderCountryCode) {
        param.order_country_code = this.orderCountryCode
      }
      // 账户修改地址特殊逻辑
      param.sort_by = 'addressId'

      if (tempShippingAddress.addressId) {
        param.address_id = tempShippingAddress.addressId
        param.is_default = tempShippingAddress.isDefault
      }
      this.$axios
        .$post(`/1.0/address/${act}`, param)
        .then((res) => {
          this.suggestAddressLoading = false
          if (res.code == 0) {
            this.closeSuggestAddressPopup()
            this.closeAddressPopup()
            this.selectAddressIndex = this.currentActIndex
            res.data.addressList && this.$store.commit('checkout/setAddressInfo', res.data.addressList)
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
          this.suggestAddressLoading = false
        })
    },
    // 重置地址编辑状态
    setAddressEditeState() {
      this.selectSuggestAddressIndex = 1
      this.editSuggestIndex = 0
      this.suggestAddressList = []
    },
    saveOrderAddress() {
      this.saveAddressLoading = true
      const param = {
        order_sn: this.orderSn,
        address_id: this.shippingAddress[this.selectAddressIndex].addressId
      }
      // 如果页面url路径存在国家code，传入国家code
      if (this.orderCountryCode) {
        param.order_country_code = this.orderCountryCode
      }
      this.$axios
        .$post(`/1.0/order/edit-address`, param)
        .then((res) => {
          if (res.code == 0) {
            this.saveAddressLoading = false
            this.isSuccess = true
          }
        })
        .catch((error) => {
          console.log(error)
          this.saveAddressLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.account-right {
  width: 903px;
  float: right;
  margin-top: 18px;
}

.order-info {
  position: relative;
  .account-back {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 19px;
    padding: 0 10px;
    color: var(--color-121212);
    text-decoration: underline;
    font-size: 13px;
    &:hover {
      color: @theme-color;
    }
  }
  .order-basic {
    font-size: 14px;
    li {
      color: var(--color-121212);
      text-transform: uppercase;
      margin-bottom: 5px;
      font-family: @font-family-600;
    }
    span {
      color: var(--color-121212);
    }
    a {
      color: @theme-color;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.edit-address-title {
  border-top: solid 1px #ccc;
  border-bottom: solid 1px #ccc;
  padding: 20px 0 5px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
}

.btn {
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  padding: 7px 18px;
}

.btn-save {
  margin: 20px 0 !important;
}

#back {
  background: #fff;
  border: solid 1px var(--color-e3bda1);
  color: var(--color-e3bda1);
  margin-left: 10px;
  &:hover {
    background: var(--color-121212);
    color: #fff;
  }
}

.account-flex {
  display: flex;
  margin-top: 25px;
  .account-right {
    width: 903px;
    margin-top: 0;
  }
  .account-left {
    flex: 1;
    margin-right: 1293px - 903px - 350px;
    // 兼容未修改页面
    float: left;
    margin-top: 0;
  }
}

.address-line {
  display: flex;
  flex-wrap: wrap;
}

.address-card {
  display: flex;
  width: 443px;
  min-height: 186px;
  position: relative;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  margin: 20px 0 0;
  cursor: pointer;
  border: 1px solid #eee;
  &:nth-child(2n + 1) {
    margin-right: 17px;
  }
  &:hover {
    border: 1px solid #ccc;
    background: #f6f6f6;
  }
  &.selected {
    background: var(--color-f9f9f9);
  }
  .shipping-add-address-card {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .plus {
      width: 15px;
      height: 15px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin-right: 10px;
    }
    span {
      text-transform: capitalize;
    }
  }
}

.address_card_btn {
  text-transform: capitalize;
  color: var(--color-666666);
  font-size: 13px;
  margin: 13px 20px 0 0;
  line-height: 20px;
  display: inline-block;
  line-height: 18px;
  text-decoration: underline;
  &:last-child {
    margin-right: 0;
  }
  &.edit_address_btn {
    &::before {
      background-position: -277px 0;
    }
  }
  &.remove_address_btn {
    &::before {
      background-position: -287px 0;
    }
  }
}

.radio-icon {
  display: block;
  width: 15px;
  height: 15px;
  padding: 2px;
  border-radius: 50%;
  margin-left: 3px;
  margin-right: 10px;
  border: 1px solid #ccc;
  background-clip: content-box;
  box-sizing: border-box;
  margin-top: 4px;
  &.selected {
    background-color: var(--color-121212);
    cursor: default;
  }
}

.popup-suggest-address-content {
  display: flex;
  justify-content: center;
  margin-top: 35px;
  margin-bottom: 35px;
  flex-wrap: wrap;
  .suggest-address-tips {
    width: 600px;
    /deep/ .diff {
      border: 1px solid orangered;
      padding: 0 2px;
    }
  }
  .suggest-address-list-content-wrap {
    border: 1px solid #ccc;
    width: 600px;
    text-align: center;
    margin-top: 15px;
    .suggest-address-item-title {
      background: linear-gradient(#fff, var(--color-f9f9f9));
      border-bottom-width: 0;
      font-weight: bold;
      padding: 8px 6px;
      text-align: left;
    }
    .suggest-address-list-content {
      display: flex;
      text-align: left;
      .suggest-shipping-address-card {
        width: 50%;
        border-right: 1px solid #ccc;
        display: flex;
        padding: 15px 6px;
        cursor: pointer;

        &:hover {
          background: #f6f6f6;
        }
        &:nth-child(2) {
          border: 0;
        }
        .shipping-address-card-content {
          margin-top: -4px;
          .shipping-address-card-content-title {
            font-weight: bold;
          }
        }
        &.selected {
          background-color: #f6f6f6;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
  .btn-suggest-save {
    margin-top: 20px;
  }
}

.edit-result {
  .content {
    display: flex;
    width: 830px;
    font-size: 16px;
    font-weight: bold;
    vertical-align: middle;
    margin: 0 auto;
    height: 400px;
    justify-content: center;
    align-items: center;
    .icon {
      content: '';
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-right: 10px;
      padding-bottom: 0;
    }
    .icon-ok {
      background: url('~assets/images/order/ok-icon.png') no-repeat;
    }
    .txt {
      display: inline-block;
      width: 760px;
    }
  }
}
</style>
