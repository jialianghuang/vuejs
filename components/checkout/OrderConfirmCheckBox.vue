<template>
  <!-- review_order 页面勾选确定 -->
  <div :class="{ error: isConfirmError, confirm: isOrderConfirm }" class="confirm-order">
    <table>
      <tbody>
        <tr>
          <td @click="toggleOrderConfirm" class="td-checkbox">
            <template v-if="isOrderConfirm">
              <az-icon
                :icon-class="isOrderConfirm ? 'a-icon-checkbox-new' : 'iconcheckbox'"
                :class="['checkbox-icon', { 'a-icon-checkbox-new': isOrderConfirm }]"
              ></az-icon>
            </template>
            <template v-else><div class="checkbox-icon-box"></div></template>
          </td>
          <td
            v-if="!purchaseSamples"
            v-html="country === 'DE' ? nl('page_checkout_disclaimer_txt_de') : nl('page_checkout_disclaimer_txt')"
            @click="clickDisclaimerTxt"
            :class="country"
            class="td-text"
          ></td>
          <td v-else class="td-text">
            {{ nl('page_samples_review_confirm_note') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OrderConfirmCheckBox',
  props: {
    purchaseSamples: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  computed: {
    ...mapState('checkout', ['isConfirmError', 'isOrderConfirm'])
  },
  methods: {
    // 如果点击文本里的a标签，执行相应打点
    clickDisclaimerTxt(e) {
      if (e.target && e.target.tagName === 'A' && e.target.dataset.el) {
        this.hrefPoint(e.target.dataset.el)
      }
    },
    hrefPoint(type) {
      switch (type) {
        case 'returnpolicy':
          this.setPoint('note', 'returnpolicy', 'click')
          break
        case 'dyelotFAQ':
          this.setPoint('note', 'dyelotFAQ', 'click')
          break
      }
    },
    toggleOrderConfirm() {
      this.$store.commit('checkout/setIsOrderConfirm', !this.isOrderConfirm)
    }
  }
}
</script>

<style lang="less" scoped>
.confirm-order {
  background: white;
  border: 1px solid #eee;
  margin-top: 12px;
  width: 310px;
  tr {
    vertical-align: top;
  }
  .td-checkbox {
    cursor: pointer;
    padding: 10px;
    .checkbox-icon {
      width: 15px;
      height: 15px;
    }
    .checkbox-icon-box {
      width: 13px;
      height: 13px;
      border: 1px solid #ccc;
    }
  }
  .td-text {
    font-weight: normal;
    text-align: left;
    font-size: 13px;
    padding: 6px 17px 7px 0;
    line-height: 20px;
    &.DE {
      /deep/ a {
        color: @title-color;
      }
    }
  }
  &.error {
    border: 1px solid #f00;
  }
  &.confirm {
    border: 1px solid #ccc;
  }
  /deep/ a {
    color: var(--color-121212);
    text-decoration: underline;
    margin: 0px 2px;
  }
  .a-icon-checkbox-new {
    fill: var(--color-121212);
  }
}
.checkout-box {
  .a-icon-checkbox-new {
    fill: var(--color-121212);
  }
}
</style>
