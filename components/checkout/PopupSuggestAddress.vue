<template>
  <az-popup-layer @close="handleClose" v-if="visible" width="668px" height="auto">
    <div class="popup-suggest-address-content">
      <h2 class="layer-title">{{ nl('page_address_shipping') }}</h2>
      <div v-html="unescape(nl('page_address_problem'))" class="suggest-address-tips"></div>
      <div class="suggest-address-list-content-wrap">
        <div class="suggest-address-item-title">{{ nl('page_address_select_address') }}</div>
        <div class="suggest-address-list-content">
          <div
            v-for="(item, index) in list"
            :class="{ selected: selectedAddressIndex == index }"
            @click="handleSelectSuggestAddress(index)"
            :key="index"
            class="suggest-shipping-address-card"
          >
            <span :class="{ selected: selectedAddressIndex == index }" class="radio-icon"></span>

            <div class="shipping-address-card-content">
              <div class="shipping-address-card-content-title">
                {{ index == 0 ? nl('page_address_original') : nl('page_address_suggest') }}
              </div>
              <address-info :addressInfo="item" :isAddressError="item.isAddressError" :isCsz="item.isCsz" :scene="scene"></address-info>
              <div
                @click.stop="handleSuggestEdit(index)"
                :data-datalayer-label="
                  index == 0 ? 'NewStructureCheckout_Address_Error4_Button1_View' : 'NewStructureCheckout_Address_Error4_Button2_View'
                "
                class="address_card_btn edit_address_btn need_datalayer"
                data-datalayer-category="NewStructureCheckout"
              >
                {{ nl('page_address_edit') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <az-button
        :loading="loading"
        :disabled="loading"
        :needIcon="false"
        @click="handleSave"
        class="btn btn-default btn-suggest-save need_datalayer"
        data-datalayer-category="NewStructureCheckout"
        data-datalayer-label="NewStructureCheckout_Address_Error4_Button3_View"
      >
        <span v-html="loading ? `${nl('page_order_progress_processing')}...` : nl('page_address_continue')"></span>
      </az-button>
    </div>
  </az-popup-layer>
</template>
<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AddressInfo from '@/components/checkout/AddressInfo'
import AzButton from '@/components/az-ui/Button/AzButton'

/**
 * 建议地址组件
 * 添加地址操作后，根据校验结果，弹出建议地址
 * 使用场景：个人地址页，alteration页
 */
export default {
  components: {
    AzPopupLayer,
    AddressInfo,
    AzButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 使用场景值：default, alteration
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedAddressIndex: 1
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSave() {
      this.$emit('confirm', this.selectedAddressIndex)
    },
    // 选择建议地址
    handleSelectSuggestAddress(index) {
      this.selectedAddressIndex = index
    },
    // 点击内容中的edit
    handleSuggestEdit(index) {
      this.$emit('clickEdit', index)
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>
