<template>
  <az-popup-layer
    :title="nl('page_detail_installment_dialog_header')"
    @close="closeDialog()"
    :z-index="1001"
    v-if="isPopupInstallmentShow"
    height="298px"
    width="465px"
  >
    <div :class="{ checkout: jsKey == 'checkout' }" class="installment-dialog-content">
      <div v-if="jsKey != 'checkout'" class="installment-dialog-des">
        <p>{{ nl('page_detail_installment_dialog_desc') }}</p>
        <div>
          <az-icon icon-class="a-icon-visa" />
          <az-icon icon-class="a-icon-master_card" />
        </div>
      </div>
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <div>
            <p>
              {{ item.installments }} x {{ item.installment_amount_display }}({{ item.total_amount_display }})
              {{ item.interestRate > 0 ? item.interestRate + '%' : '' }}
              <span :class="{ 'theme-color-green': item.interestRate * 1 == 0 }">{{
                item.interestRate * 1 == 0 ? nl('page_product_will_be_interested') : nl('page_product_of_interest')
              }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </az-popup-layer>
</template>

<script>
/**
 * MX  分期付款
 *  */
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import { mapState } from 'vuex'

export default {
  name: 'PopupInstallment',
  languageKeys: [
    'page_detail_installment_dialog_header',
    'page_detail_installment_dialog_desc',
    'page_product_will_be_interested',
    'page_product_of_interest'
  ],
  components: { AzPopupLayer },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      isPopupInstallmentShow: (state) => state.product.isPopupInstallmentShow
    })
  },
  methods: {
    closeDialog() {
      this.$store.commit('product/setPopupInstallmentShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .az-popup-box {
  .layer-title {
    margin-bottom: 5px;
    border-bottom: none;
  }
}
.icon-right {
  fill: currentColor;
  color: @theme-green;
}
.installment-dialog-content {
  &.checkout {
    padding-top: 0;
    ul {
      margin-top: 0;
    }
  }
  .installment-dialog-des {
    p {
    }
    svg {
      margin-top: 10px;
      width: 35px;
      height: 23px;
    }
  }

  ul {
    margin-top: 15px;
    border: 1px solid #ccc;
    padding: 0 15px;
    li {
      height: 40px;
      padding: 10px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    p {
      line-height: 20px;
    }
  }
}
</style>
