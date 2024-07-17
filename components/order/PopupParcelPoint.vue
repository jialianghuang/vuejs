<template>
  <div>
    <az-popup-layer :lockScroll="true" :z-index="12" @close="closePopup" :title="'Find a ParcelPoint'" width="1174px" height="606px">
      <div id="parcelpoint-widget">
        <p v-if="extensions.addressLine1" class="choose-title">
          {{ nl('page_popup_parce_point_text1') }} : <strong>{{ extensions.addressLine1 }} {{ extensions.addressLine2 }}</strong>
        </p>
        <p v-else class="theme-warning">{{ nl('page_popup_parce_point_text2') }}</p>
        <az-button @click="confirmParcePoint" :disabled="!extensions.addressLine1" class="btn btn-default btn-confirm">
          {{ nl('page_common_confirm') }}
        </az-button>
      </div>
    </az-popup-layer>
  </div>
</template>
<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'PopupParcelPoint',
  components: { AzPopupLayer, AzButton },
  props: {
    goodsItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orderInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      extensions: {}
    }
  },
  mounted() {
    const _this = this
    window.parcelpoint.Store.init({
      apiKey: 'E49XO451',
      // initialAddress: '105 Kippax Street, Surry Hills, NSW 2010',
      initialAddress: this.orderInfo.address + ', ' + this.orderInfo.cityText,
      targetDiv: 'parcelpoint-widget',
      storeType: 'full',
      initialView: 'map',
      selectFirstStore: true,
      yourLocationMarker: true,
      features: ['CCF'],
      googleAPIKey: 'AIzaSyDak4FqbkmFymBdElnUpHhvm9XGhnyq8NQ'
    })

    window.parcelpoint.Store.display()
    window.parcelpoint.Property.onChange(['storeDetails'], function(key, value) {
      const storeId = value.storeId
      const addressLine1 = value.storeAddress1
      const addressLine2 = value.storeAddress2
      const city = value.storeCity
      const state = value.storeState
      const postcode = value.storePostCode

      _this.extensions = {
        storeId: value.storeId,
        addressLine1: value.storeAddress1,
        addressLine2: value.storeAddress2,
        storeCity: value.storeCity,
        storeState: value.storeState,
        storePostCode: value.storePostCode
      }

      const contentDocument = document.getElementById('ppIframeWidget-parcelpoint-widget').contentWindow.document
      contentDocument.querySelector('.header-container').style.display = 'none'
      contentDocument.querySelector('.footer-container').style.display = 'none'

      console.log(
        '-----storeId-----',
        storeId,
        '-----addressLine1-----',
        addressLine1,
        '-----addressLine2-----',
        addressLine2,
        '-----city-----',
        city,
        '-----state-----',
        state,
        postcode
      )
    })
  },
  beforeDestroy() {
    window.parcelpoint.Store.destroy()
  },
  methods: {
    closePopup() {
      this.$emit('close')
    },
    confirmParcePoint() {
      this.$emit('handleConfirmParcePoint', this.extensions)
    }
  }
}
</script>
<style lang="less" scoped>
.choose-title {
  margin-bottom: 20px;
}
.btn-confirm {
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 255px;
}
</style>
