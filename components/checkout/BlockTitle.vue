<template>
  <div :class="{ 'align-left': tipLink || eventDate }" class="pay-title">
    <span class="title">{{ title }}</span>
    <span v-if="secureSslShow && country == 'CA'" class="secure-ssl"><i></i> {{ nl('page_checkout_Secure_SSL_Encryption') }}</span>
    <div v-if="btnShow" @click="btnClick" class="title-btn">{{ btnText }}</div>
    <div v-if="tipLink && country == 'US'" class="pay-title-tips">
      <az-icon icon-class="icon-gwc-_question_" class="tip-icon"></az-icon>
      <div class="text_tip">
        <em></em>
        <span></span>
        <div v-html="nl('page_checkout_expedited_shipping_des')" class="text_content"></div>
      </div>
    </div>
    <div v-if="eventDate" class="help_hover">
      <az-icon icon-class="icon-gwc-_question_" class="question_mark"></az-icon>
      <div class="text_tip">
        <em></em>
        <span></span>
        <div class="text_content">
          {{ nl('page_order_event_date_tip') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AzIcon from '@/components/az-ui/AzIcon'
export default {
  name: 'BlockTitle',
  languageKeys: ['page_checkout_Secure_SSL_Encryption', 'page_checkout_expedited_shipping_des', 'page_order_event_date_tip'],
  components: {
    AzIcon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    btnShow: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: ''
    },
    tipLink: {
      type: String,
      default: ''
    },
    secureSslShow: {
      type: Boolean,
      default: false
    },
    eventDate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    btnClick() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
.pay-title {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-cccccc);
  padding-bottom: 5px;
  width: 752px;
  .title {
    font-size: 16px;
    font-family: @font-family-600;
    color: var(--color-121212);
  }
  .secure-ssl {
    flex: 1;
    text-transform: capitalize;
    font-size: 12px;
    i {
      display: inline-block;
      width: 8px;
      height: 9px;
      margin: 0 8px 0 10px;
      background-image: data-uri('~assets/images/checkout/shield.png');
      background-size: cover;
    }
  }
  .title-btn {
    font-family: @font-family-500;
    color: var(--color-121212);
    text-transform: capitalize;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: @black-btn-hover-color;
    }
  }
}
.align-left {
  justify-content: flex-start;
}
.pay-title-tips {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  .tip-icon {
    cursor: pointer;
  }

  .text_tip {
    display: none;
    border: 1px solid #e1e1e1;
    position: absolute;
    background: #ffffff;
    padding: 10px 20px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    text-align: center;
    line-height: 18px;
    border-radius: 2px;
    z-index: 1;
    width: 300px;
    left: -158px;
    top: 30px;
    text-transform: initial;
    text-align: left;
    em {
      display: block;
      border-width: 10px;
      position: absolute;
      left: 153px;
      top: -20px;
      border-style: dashed dashed solid;
      border-color: transparent transparent #e1e1e1;
      font-size: 0;
      line-height: 0;
    }
    span {
      display: block;
      border-width: 10px;
      position: absolute;
      left: 153px;
      top: -18px;
      border-style: dashed dashed solid;
      border-color: transparent transparent #ffffff;
      font-size: 0;
      line-height: 0;
    }
    .text_content {
      /deep/ p {
        margin-top: 10px;
        a {
          color: @theme;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }

  &:hover {
    .text_tip {
      display: block;
    }
  }
}
.help_hover {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  top: 0;
  vertical-align: 0.15em;
  cursor: pointer;
  .question_mark {
    display: inline-block;
    width: 13px;
    height: 13px;
  }
  .text_tip {
    display: none;
    border: 1px solid #e1e1e1;
    position: absolute;
    background: #ffffff;
    padding: 10px 20px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    text-align: center;
    line-height: 18px;
    border-radius: 2px;
    z-index: 10000;
    width: 300px;
    left: 25px;
    top: -80px;
    text-transform: none;
    em {
      display: block;
      border-width: 10px;
      position: absolute;
      left: -21px;
      top: 80px;
      transform: rotate(-90deg);
      border-style: dashed dashed solid;
      border-color: transparent transparent #e1e1e1;
      font-size: 0;
      line-height: 0;
      z-index: 999;
    }
    span {
      display: block;
      border-width: 10px;
      position: absolute;
      left: -20px;
      top: 80px;
      transform: rotate(-90deg);
      border-style: dashed dashed solid;
      border-color: transparent transparent #ffffff;
      font-size: 0;
      line-height: 0;
      z-index: 1000;
    }
  }

  &:hover {
    .text_tip {
      display: block;
    }
  }
}
</style>
