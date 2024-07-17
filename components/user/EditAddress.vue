<template>
  <div class="edit-address-box">
    <div class="address-list">
      <h2>{{ nl('page_order_bill_address') }}</h2>
      <div class="address-line">
        <div v-for="(item, index) in billingAddress" :key="item.addressId" class="address-card">
          <address-info :addressInfo="item"></address-info>
          <div @click.stop="handleEdite(index, 'billing')" class="address_card_btn edit_address_btn">
            {{ nl('page_address_edit') }}
          </div>
        </div>
      </div>
    </div>
    <div class="address-list">
      <h2>{{ nl('page_order_shipping_address') }}</h2>
      <div class="address-line">
        <div v-for="(item, index) in shippingAddress" :key="item.addressId" class="address-card">
          <div v-if="deleteLoading && removeIndex == index" class="shipping-add-address-card">
            {{ `${nl('page_order_progress_processing')}...` }}
          </div>
          <template v-else>
            <address-info :addressInfo="item"></address-info>
            <div @click.stop="handleEdite(index, 'shipping')" class="address_card_btn edit_address_btn">
              {{ nl('page_address_edit') }}
            </div>
            <div @click.stop="handleRemove(item.addressId, index)" class="address_card_btn remove_address_btn">
              {{ nl('page_address_remove') }}
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
    </div>
    <!-- 新增和编辑地址弹框 -->
    <popup-address
      @closeAddressPopup="closeAddressPopup"
      v-if="isAddressPopupShow"
      :addressInfo="addressEditing"
      @handleSaveAddress="handleSaveAddress"
      @setSuggestAddress="setSuggestAddress"
      :addressType="currentClick == 'shipping' ? 1 : 2"
      :popupTitle="currentClick == 'shipping' ? nl('page_address_shipping') : nl('page_order_bill_address')"
      :sortBy="'addressId'"
      :zIndex="12"
      source="billing"
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
</template>

<script>
import AddressInfo from '@/components/checkout/AddressInfo'
import PopupAddress from '@/components/checkout/PopupAddress'
// import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
// import AzButton from '@/components/az-ui/Button/AzButton'
import PopupSuggestAddress from '@/components/checkout/PopupSuggestAddress'
import { mapState } from 'vuex'
export default {
  name: 'EditAddress',
  components: {
    AddressInfo,
    PopupAddress,
    // AzPopupLayer,
    // AzButton,
    PopupSuggestAddress
  },
  data() {
    return {
      editIndex: -1,
      removeIndex: -1,
      isAddressPopupShow: false, // 新增编辑地址弹框是否显示
      suggestAddressLoading: false,
      deleteLoading: false,
      isSuggestAddressPopupShow: false, // 建议地址是否显示
      selectAddressIndex: 0,
      selectSuggestAddressIndex: 1,
      editSuggestIndex: 0,
      suggestAddressList: [],
      currentClick: 'shipping'
    }
  },
  computed: {
    ...mapState('checkout', ['shippingAddress', 'billingAddress']),
    addressEditing() {
      let tempAddressInfo = {}
      const addressList = this.currentClick == 'shipping' ? this.shippingAddress : this.billingAddress
      if (Object.keys(this.suggestAddressList).length) {
        tempAddressInfo = this.suggestAddressList.length ? this.suggestAddressList[this.editSuggestIndex] : {}
      } else {
        tempAddressInfo = addressList.length ? addressList[this.editIndex] : {}
      }
      return tempAddressInfo
    }
  },
  created() {},
  methods: {
    // 新增地址
    handleNewAddress() {
      this.editIndex = -1
      this.isAddressPopupShow = true
      this.currentClick = 'shipping'
    },
    // 编辑
    handleEdite(index, addressType) {
      this.editIndex = index
      this.isAddressPopupShow = true
      this.currentClick = addressType
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
      this.$axios
        .$get(`/1.0/address/delete?address_id=${addressId}&address_type=1`)
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
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  border-bottom: 1px solid #ccc;
  text-transform: uppercase;
  padding: 20px 0 5px;
  line-height: 19px;
  font-family: @font-family-600;
  font-size: 14px;
}
.address-list {
  margin-top: 40px;
  &:first-child {
    margin-top: 0;
  }
}

.address-line {
  display: flex;
  flex-wrap: wrap;
}

.address-card {
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
  margin: 28px 20px 0 0;
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
</style>
