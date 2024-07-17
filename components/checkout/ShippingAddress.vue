<template>
  <div id="shipping_address" class="shipping-address-block">
    <block-title
      :title="nl('page_order_shipping_address')"
      :btnShow="Boolean(defaultAddressShow && Object.keys(shippingAddressList).length && orderInfo.editable)"
      :btnText="nl('page_common_change')"
      @change="handleChange()"
    ></block-title>
    <div class="address-content pay-shipping-address">
      <!-- 有地址 -->
      <template v-if="isHaveAddress">
        <!-- 默认地址 -->
        <div v-if="defaultAddressShow" class="address-defalut-content">
          <address-Info :addressInfo="shippingAddressList[0]"></address-Info>
        </div>

        <!-- 地址列表 -->
        <template v-else>
          <div class="address-list-content">
            <div
              v-for="(item, index) in shippingAddressList"
              :class="{ selected: selectAddressIndex == index }"
              @click="handleChooseAddress(index)"
              :key="index"
              class="shipping-address-card"
            >
              <div v-if="deleteLoading && removeIndex == index" class="shipping-add-address-card">
                {{ `${nl('page_order_progress_processing')}...` }}
              </div>
              <template v-else>
                <span :class="{ selected: selectAddressIndex == index }" class="radio-icon"></span>
                <div class="shipping-address-card-content">
                  <address-info :addressInfo="item"></address-info>
                  <div @click.stop="handleEdite(index)" class="address_card_btn edit_address_btn">
                    {{ nl('page_address_edit') }}
                  </div>
                  <div
                    v-if="!orderInfo.isGuest"
                    @click.stop="handleRemove(item.addressId, index)"
                    class="address_card_btn remove_address_btn"
                  >
                    {{ nl('page_address_remove') }}
                  </div>
                </div>
              </template>
            </div>
            <div v-if="!orderInfo.isGuest && isLogin" class="shipping-address-card">
              <div @click="handleNewAddress()" class="shipping-add-address-card">
                <span class="plus"><az-icon icon-class="checkout_add"></az-icon></span>
                <span>{{ nl('page_address_addnew') }}&nbsp;{{ nl('page_order_shipping_address') }}</span>
              </div>
            </div>
          </div>
          <az-button
            @click="handleSaveAddressList()"
            :loading="defaultAddressLoading"
            :disabled="defaultAddressLoading"
            :needIcon="false"
            class="btn btn-default btn-save"
          >
            {{ defaultAddressLoading ? `${nl('page_order_progress_processing')}...` : nl('page_common_save') }}
          </az-button>
        </template>

        <!-- 新增和编辑地址弹框 -->
        <popup-address
          @closeAddressPopup="closeAddressPopup"
          v-if="isAddressPopupShow"
          :addressInfo="shippingAddress"
          :editIndex="editIndex"
          @handleSaveAddress="handleSaveAddress"
          @setSuggestAddress="setSuggestAddress"
          :addressType="1 * 1"
          :popupTitle="nl('page_address_shipping')"
        ></popup-address>
      </template>
      <!-- 新增地址(没有地址) -->
      <address-form
        v-else
        @handleSaveAddress="handleSaveAddress"
        @setSuggestAddress="setSuggestAddress"
        :addressType="1 * 1"
      ></address-form>

      <!-- 建议地址弹框 -->
      <popup-suggest-address
        :visible.sync="isSuggestAddressPopupShow"
        :list="suggestAddressList"
        :loading="suggestAddressLoading"
        @confirm="handleSaveSuggestAddress"
        @clickEdit="handleSuggestEdite"
      ></popup-suggest-address>

      <div :class="{ 'animated animate-shake': checkoutError.isShippingAddressError }" class="error-tip">
        {{ nl('page_js_save_address') }}
      </div>
    </div>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import BlockTitle from '@/components/checkout/BlockTitle'
import AddressForm from '@/components/checkout/AddressForm'
// import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AddressInfo from '@/components/checkout/AddressInfo'
import PopupAddress from '@/components/checkout/PopupAddress'
import PopupSuggestAddress from '@/components/checkout/PopupSuggestAddress'
import { mapState } from 'vuex'
export default {
  name: 'ShippingAddress',
  languageKeys: [
    'page_order_shipping_address',
    'page_common_change',
    'page_order_progress_processing',
    'page_address_edit',
    'page_address_remove',
    'page_address_addnew',
    'page_order_shipping_address',
    'page_common_save',
    'page_address_shipping',
    'page_address_problem',
    'page_address_select_address',
    'page_address_original',
    'page_address_suggest',
    'page_address_edit',
    'page_address_continue',
    'page_js_save_address',
    'page_js_UN',
    'page_js_CAN',
    ...BlockTitle.languageKeys,
    ...AddressForm.languageKeys
  ],
  components: {
    AzButton,
    BlockTitle,
    AddressForm,
    // AzPopupLayer,
    AddressInfo,
    PopupAddress,
    PopupSuggestAddress
  },
  props: {
    shippingAddressList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultAddressLoading: false,
      suggestAddressLoading: false,
      deleteLoading: false,
      isAddressPopupShow: false, // 新增编辑地址弹框是否显示
      isSuggestAddressPopupShow: false, // 建议地址是否显示
      selectAddressIndex: 0,
      editIndex: -1,
      removeIndex: -1,
      selectSuggestAddressIndex: 1,
      editSuggestIndex: 0,
      suggestAddressList: []
    }
  },
  computed: {
    ...mapState('checkout', ['checkoutError', 'orderInfo', 'defaultAddressShow']),
    countryOption() {
      let res
      if (this.country === 'US') {
        res = {
          value: 3859,
          label: this.nl('page_js_UN')
        }
      } else if (this.country === 'CA') {
        res = {
          value: 3844,
          label: this.nl('page_js_CAN')
        }
      }
      return res
    },
    shippingAddress() {
      let tempAddressInfo = null
      if (Object.keys(this.suggestAddressList).length) {
        tempAddressInfo = this.suggestAddressList.length ? this.suggestAddressList[this.editSuggestIndex] : null
      } else {
        tempAddressInfo = this.shippingAddressList.length ? this.shippingAddressList[this.editIndex] : null
      }
      return tempAddressInfo
    },
    isHaveAddress() {
      const isTrue = Object.keys(this.shippingAddressList).length
      if (isTrue) {
        // 老用户的地址打点
        this.setPoint('checkout', 'existed', 'view', { num: Object.keys(this.shippingAddressList).length })
      } else {
        // 新用户的地址打点
        this.setPoint('checkout', 'new', 'view')
      }
      return isTrue
    },
    // url路径中的订单国家code
    orderCountryCode() {
      const res = this.$route.query.order_country_code
      return res
    }
  },
  created() {
    const action = this.$route.query.action
    if (action == 'edit_shipping_address') {
      this.orderInfo.editable && this.handleChange()
    }
  },
  mounted() {
    document.querySelector('#shipping_address').addEventListener('click', () => {
      this.$store.commit('checkout/setCheckoutError', { isShippingAddressError: false })
    })
    // ga4 打点
    this.$emit('setCheckoutGA4', {
      type: 'begin_checkout'
    })
  },
  methods: {
    // 新增地址
    handleNewAddress() {
      this.setPoint('shippingaddress', 'add', 'click')
      this.editIndex = -1
      this.isAddressPopupShow = true
    },
    // 修改地址
    handleChange() {
      this.setPoint('shippingaddress', 'change', 'click')
      this.$store.commit('checkout/setAddressId', '')
      this.$store.commit('checkout/setDefaultAddressShow', false)
    },
    // 选择地址
    handleChooseAddress(index) {
      this.selectAddressIndex = index
    },
    // 保存选择的默认地址
    handleSaveAddressList() {
      this.setPoint('shippingaddress', 'save', 'click')
      const addressId = this.shippingAddressList[this.selectAddressIndex].addressId
      // 重发色卡 设置 -10001 为默认地址 不处理  未登录用户不需要调用接口
      if (addressId == -10001 || !this.isLogin) {
        this.$store.commit('checkout/setAddressId', addressId)
        this.$store.commit('checkout/setDefaultAddressShow', true)
        this.selectAddressIndex = 0
        return
      }
      this.defaultAddressLoading = true
      let url = '/1.0/address/change-default?address_id=' + addressId + '&address_type=1'
      if (this.orderCountryCode) {
        url = url + '&order_country_code=' + this.orderCountryCode
      }
      this.$axios
        .$get(url)
        .then((res) => {
          this.defaultAddressLoading = false
          if (res.code == 0) {
            this.$store.commit('checkout/setDefaultAddressShow', true)
            res.data.addressList && this.$store.commit('checkout/setAddressInfo', res.data.addressList)
            this.$emit('setCheckoutAmount')
            this.selectAddressIndex = 0
          }
        })
        .catch((error) => {
          console.log(error)
          this.defaultAddressLoading = false
        })
    },
    // 编辑
    handleEdite(index) {
      this.setPoint('shippingaddress', 'edit', 'click')
      this.editIndex = index
      this.isAddressPopupShow = true
    },
    // 建议地址编辑
    handleSuggestEdite(index) {
      this.closeSuggestAddressPopup()
      this.isAddressPopupShow = true
      this.editSuggestIndex = index
      if (this.editSuggestIndex == 0) {
        this.setDataLayer({
          action: 'view',
          category: 'ShippingAddressVerification',
          label: 'ShippingAddressVerification_Original_Edit_Click'
        })
      } else if (this.editSuggestIndex == 1) {
        this.setDataLayer({
          action: 'view',
          category: 'ShippingAddressVerification',
          label: 'ShippingAddressVerification_Suggested_Edit_Click'
        })
      }
    },
    // 删除地址
    handleRemove(addressId, index) {
      this.setPoint('shippingaddress', 'remove', 'click')
      this.removeIndex = index
      this.deleteLoading = true
      // 游客用户删除
      if (!this.isLogin) {
        const tempShippingaddress = JSON.parse(JSON.stringify(this.shippingAddressList))
        const tempBillingaddress = JSON.parse(JSON.stringify(this.$store.state.checkout.billingAddress))
        tempShippingaddress.splice(this.removeIndex, 1)
        this.$store.commit('checkout/setAddressInfo', { billingAddress: tempBillingaddress, shippingAddress: tempShippingaddress })
        this.removeIndex = -1
        this.selectAddressIndex = 0
        this.deleteLoading = false
        return
      }
      let url = '/1.0/address/delete?address_id=' + addressId + '&address_type=1'
      if (this.orderCountryCode) {
        url = url + '&order_country_code=' + this.orderCountryCode
      }
      this.$axios
        .$get(url)
        .then((res) => {
          if (res.code == 0) {
            if (this.orderInfo.isGuest) {
              this.$store.commit('checkout/setAddressInfo', { billingAddress: [], shippingAddress: [] })
            } else {
              res.data.addressList && this.$store.commit('checkout/setAddressInfo', res.data.addressList)
            }
            this.removeIndex = -1
            this.selectAddressIndex = 0
            this.$emit('setCheckoutAmount')
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
      this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Address_Error4_View' })
    },
    handleSaveAddress() {
      this.closeAddressPopup()
      if (Object.keys(this.suggestAddressList).length) {
        this.isSuggestAddressPopupShow = true
        this.setDataLayer({
          action: 'view',
          category: 'ShippingAddressVerification',
          label: 'ShippingAddressVerification_View'
        })
      } else {
        this.$store.commit('checkout/setDefaultAddressShow', true)
      }

      this.$emit('setCheckoutAmount')
    },
    // 关闭弹窗
    closeAddressPopup() {
      this.isAddressPopupShow = false
      this.setAddressEditeState()
    },
    // 关闭建议地址弹窗
    closeSuggestAddressPopup() {
      this.setPoint('shippingaddress', 'suggestCancel', 'click')
      this.isSuggestAddressPopupShow = false
    },
    // 选择建议地址
    handleSelectSuggestAddress(index) {
      this.selectSuggestAddressIndex = index
    },
    // 选择保存建议地址
    handleSaveSuggestAddress(i) {
      this.setPoint('shippingaddress', 'edit', 'click')
      if (i == 0) {
        this.setPoint('shippingaddress', 'originalSave', 'click')
        this.setDataLayer({
          action: 'view',
          category: 'ShippingAddressVerification',
          label: 'ShippingAddressVerification_Original_Save_Click'
        })
      } else if (i == 1) {
        this.setPoint('shippingaddress', 'suggestSave', 'click')
        this.setDataLayer({
          action: 'view',
          category: 'ShippingAddressVerification',
          label: 'ShippingAddressVerification_Suggested_Save_Click'
        })
      }
      this.suggestAddressLoading = true
      const tempShippingAddress = this.suggestAddressList[i]
      let act = tempShippingAddress.addressId ? 'edit' : 'add'
      if (!this.isLogin && !this.orderInfo.orderSn && !this.$route.query.origin_order_sn) act = 'check'
      const param = {
        check_validation: 0,
        address_type: 1,
        first_name: tempShippingAddress.firstName,
        last_name: tempShippingAddress.lastName,
        country: tempShippingAddress.country,
        province: tempShippingAddress.province,
        province_text: tempShippingAddress.provinceText,
        city: tempShippingAddress.city,
        city_text: tempShippingAddress.cityText,
        district: tempShippingAddress.district,
        district_text: tempShippingAddress.districtText,
        address: tempShippingAddress.address,
        sign_building: tempShippingAddress.signBuilding,
        zipcode: tempShippingAddress.zipcode,
        tel: tempShippingAddress.tel
      }
      // 如果页面url路径存在国家code，传入国家code
      if (this.orderCountryCode) {
        param.order_country_code = this.orderCountryCode
      }
      if (tempShippingAddress.addressId) {
        param.address_id = tempShippingAddress.addressId
        param.is_default = tempShippingAddress.isDefault
      }
      // 未登录时 信息补全
      if (act == 'check') {
        param.country_name = tempShippingAddress.countryName
        param.country_code = this.country
        param.full_name = tempShippingAddress.fullName
      }
      this.$axios
        .$post(`/1.0/address/${act}`, param)
        .then((res) => {
          this.suggestAddressLoading = false
          if (res.code == 0) {
            this.closeSuggestAddressPopup()
            this.closeAddressPopup()
            this.$store.commit('checkout/setDefaultAddressShow', true)
            if (act == 'check') {
              const nowShippingAddress = JSON.parse(JSON.stringify(this.$store.state.checkout.shippingAddress))
              const nowBillingAddress = JSON.parse(JSON.stringify(this.$store.state.checkout.billingAddress))
              if (this.editIndex > -1) nowShippingAddress[this.editIndex] = { ...res.data, addressId: Date.parse(new Date()) }
              else nowShippingAddress.unshift({ ...res.data, addressId: Date.parse(new Date()) })
              if (nowBillingAddress.length < 1) nowBillingAddress.unshift({ ...res.data, addressId: Date.parse(new Date()) })
              this.$store.commit('checkout/setAddressInfo', { shippingAddress: nowShippingAddress, billingAddress: nowBillingAddress })
            } else {
              res.data.addressList && this.$store.commit('checkout/setAddressInfo', res.data.addressList)
            }
            this.$emit('setCheckoutAmount')
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
    }
  }
}
</script>

<style lang="less" scoped>
.shipping-address-block {
  .error-tip {
    height: 20px;
    color: #f00;
    margin-left: 10px;
    margin-top: 10px;
    display: none;
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
    display: block;
  }
  .animate-shake {
    animation-name: shake;
  }
  @keyframes shake {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-6px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translate3d(6px, 0, 0);
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
    &.selected {
      background-color: var(--color-121212);
      cursor: default;
    }
  }
  .address_card_btn {
    text-transform: capitalize;
    color: #666;
    font-size: 13px;
    font-family: @font-family-500;
    line-height: 18px;
    display: inline-block;
    margin-top: 13px;
    text-decoration: underline;
    cursor: pointer;
    &.remove_address_btn {
      margin-left: 20px;
    }
    &:hover {
      color: @theme-color;
    }
  }

  .address-content {
    margin: 20px 0 60px;
  }
  .address-list-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .shipping-address-card {
      width: 367px;
      min-height: 166px;
      position: relative;
      padding: 15px;
      box-sizing: border-box;
      border: 1px solid #eee;
      // margin: 8px 10px;
      margin-bottom: 20px;
      background-color: #fff;
      cursor: pointer;
      display: flex;
      .shipping-add-address-card {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .plus {
          font-size: 15px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin-right: 9px;
          fill: #666;
        }
        span {
          text-transform: capitalize;
        }
      }
      &.selected {
        border-color: #ccc;
        background-color: var(--color-f9f9f9);
      }
      &:hover {
        border-color: #ccc;
        background-color: var(--color-f9f9f9);
      }

      .shipping-address-card-content {
        flex: 1;
        margin-top: -5px;
        .info_part {
          // font-size: 14px;
          color: var(--color-121212);
          font-family: @font-family-500;
          word-break: break-word;
          .info_line:not(:first-of-type) {
            margin-top: 5px;
          }
        }
      }
    }
  }

  .btn-save {
    min-width: 80px;
    box-sizing: border-box;
    border-radius: 0%;
    font-size: 13px;
    font-family: @font-family-600;
  }
  .popup-address-content {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .popup-suggest-address-content {
    display: flex;
    justify-content: center;
    // padding: 40px;
    flex-wrap: wrap;
    .layer-title {
      font-family: @font-family-600;
      font-size: 16px;
      color: var(--color-121212);
      padding-bottom: 5px;
      margin-bottom: 15px;
      border-bottom: 1px solid #ccc;
      width: 100%;
    }
    .suggest-address-tips {
      width: 100%;
      /deep/ .diff {
        border: 1px solid orangered;
        padding: 0 2px;
      }
    }
    .suggest-address-list-content-wrap {
      border: 1px solid #ccc;
      width: 100%;
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
}
.checkout-box {
  .shipping-address-block {
    .btn-save {
      background: @black-btn-color;
      border: solid 1px @black-btn-color;
    }
    .radio-icon {
      &.selected {
        background-color: @black-btn-color;
      }
    }
    .address_card_btn {
      &:hover {
        color: @black-btn-color;
      }
    }
  }
  .btn-suggest-save {
    background-color: @black-btn-color;
  }
}
</style>
