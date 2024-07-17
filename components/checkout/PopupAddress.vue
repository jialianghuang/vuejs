<template>
  <az-popup-layer :z-index="zIndex" :title="popupTitle" @close="closeAddressPopup" width="750px" height="auto">
    <!-- <div class="popup-address"> -->
    <div class="popup-address-content">
      <address-form
        :scene="scene"
        :addressInfo="addressInfo"
        :addressType="addressType"
        :verifyAddres="verifyAddress"
        :sortBy="sortBy"
        :editOrderAddressOrderSn="editOrderAddressOrderSn"
        :editIndex="editIndex"
        :source="source"
        @handleSaveAddress="handleSaveAddress"
        @setSuggestAddress="setSuggestAddress"
      ></address-form>
    </div>
    <!-- </div> -->
  </az-popup-layer>
</template>

<script>
import AddressForm from '@/components/checkout/AddressForm'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
export default {
  name: 'PopupAddress',
  components: {
    AddressForm,
    AzPopupLayer
  },
  props: {
    // 使用场景，default,alteration
    // 如果是alteration，没有name和phone
    scene: {
      type: String,
      default: ''
    },
    popupTitle: {
      type: String,
      default: ''
    },
    addressType: {
      type: Number,
      default: 1
    },
    editIndex: {
      type: Number,
      default: -1
    },
    addressInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    verifyAddress: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 12
    },
    sortBy: {
      type: String,
      default: ''
    },
    editOrderAddressOrderSn: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  },
  beforeDestroy() {
    document.querySelector('body').style.overflow = 'auto'
  },
  mounted() {
    document.querySelector('body').style.overflow = 'hidden'
  },
  methods: {
    // 关闭弹窗
    closeAddressPopup(val) {
      if (val == 'outside') return
      this.$emit('closeAddressPopup')
    },
    handleSaveAddress(e) {
      this.$emit('handleSaveAddress', e)
    },
    setSuggestAddress(suggestAddressList) {
      this.$emit('setSuggestAddress', suggestAddressList)
    }
  }
}
</script>

<style lang="less" scoped>
.popup-address-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
