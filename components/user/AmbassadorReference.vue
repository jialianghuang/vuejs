<template>
  <!-- my reference页面 -->
  <div class="my-reference">
    <coupon-item
      :val="codeVal"
      :disabled="false"
      :showUse="true"
      v-if="codeVal.couponValueTxt"
      v-track.view="{
        common: {
          ec: 'my reference',
          el: 'bound'
        }
      }"
      parent="reference"
    ></coupon-item>
    <div
      v-else-if="!isInitLoading"
      v-track.view="{
        common: {
          ec: 'my reference',
          el: 'unbound'
        }
      }"
      class="update-code"
    >
      <p class="title">{{ nl('page_ambassador_reference_code') }}</p>
      <div>
        <input v-model="code" :placeholder="nl('page_ambassador_code_placeholder')" type="text" />
        <az-button @click="saveCode" class="btn btn-hollow">{{ nl('page_ambassador_code_update') }}</az-button>
      </div>
      <p v-html="nl('page_ambassador_code_tip')" class="code-tip"></p>
    </div>
    <p v-if="showTip" :class="['tip', tipType === 'error' ? 'error-tip' : 'success-tip']">{{ nl(tipContent) }}</p>
    <div v-if="toastVisible" class="ambassdor-toast-popup">
      <div>
        <az-icon @click="closeToast" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        <img :src="replaceImgCdnUrl('https://cdn-1.azazie.com/upimg/point/ambassador/pc1.png')" alt="" />
        <p class="tip1">{{ nl('page_ambassador_code_success_tip1') }}</p>
        <p class="tip2">{{ nl(`page_ambassador_code_success_tip2${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <az-button @click="closeToast" class="btn btn-theme">{{ nl('page_common_ok') }}</az-button>
      </div>
    </div>
  </div>
</template>
<script>
import CouponItem from '@/components/coupon/CouponItem'
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  components: {
    CouponItem,
    AzButton
  },
  data() {
    return {
      codeVal: {
        couponTitle: this.nl('page_my_reference') + ':',
        couponValueTxt: '',
        couponCodeTxt: '',
        couponExpireTxt: this.nl('page_ambassador_code_expired'),
        couponConditionTxt: this.nl('page_ambassador_code_note'),
        couponStatus: 'available',
        target: this.countryUrl('/all/events-dresses')
      },
      code: '',
      showTip: false,
      tipContent: '',
      tipType: 'error',
      toastVisible: false,
      isInitLoading: true
    }
  },
  mounted() {
    this.getCode()
  },
  methods: {
    getCode() {
      this.$axios.$get('/1.0/ambassador/get-relation').then((res) => {
        if (res.data.my_code) {
          this.codeVal.couponExpireTxt = `${this.nl('page_ambassador_code_expired')} ${res.data.expire_time} PST`
          this.codeVal.couponValueTxt = res.data.my_code
          if (res.data.is_expire) {
            this.codeVal.couponStatus = 'Expired'
            this.codeVal.couponStatusTxt = 'Expired'
          }
        }
        this.codeVal.couponCodeTxt = this.nl(`page_ambassador_code_text${this.country !== 'US' ? `_${this.country.toLowerCase()}` : ''}`)
        this.isInitLoading = false
      })
    },
    saveCode() {
      if (!this.code) {
        this.tipType = 'error'
        this.tipShow(this.nl('page_ambassador_code_empty_tip'))
        return
      }
      this.$axios
        .$post('/1.0/ambassador/code', {
          code: this.code
        })
        .then((res) => {
          if (res.code === 0) {
            if (res.data.is_invited) {
              this.getCode()
            } else {
              this.getCode()
              this.toastVisible = true
            }
          } else {
            this.tipType = 'error'
            this.tipShow(res.msg)
          }
        })
    },
    tipShow(content) {
      this.showTip = true
      this.tipContent = content
      this.timer = setTimeout(() => {
        this.showTip = false
        this.timer = null
      }, 1500)
    },
    closeToast() {
      this.toastVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.my-reference {
  margin-top: 15px;
  .update-code {
    .title {
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-121212);
    }
    & > div {
      margin-top: 5px;
      display: flex;
      align-items: center;
    }
    .code-tip {
      width: 380px;
      font-family: @font-family-500;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-999999);
      margin-top: 10px;
      /deep/ a {
        color: @theme-color;
      }
    }
    input {
      width: 380px;
      height: 40px;
      background: #ffffff;
      padding: 0 5px;
      border: 1px solid @border-color;
      box-sizing: border-box;
    }
    .btn {
      font-family: @font-family-600;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      margin-left: 10px;
    }
  }
  .tip {
    position: fixed;
    top: 20px;
    left: 50%;
    width: 500px;
    padding: 15px;
    border-radius: 5px;
    z-index: @popuy-z-index;
    opacity: 1;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform 0.4s, top 0.4s;
  }
  .success-tip {
    background-color: #f0f9eb;
    color: #67c23a;
    border: 1px solid #e1f3d8;
  }
  .error-tip {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }
}
.ambassdor-toast-popup {
  position: fixed;
  z-index: @popuy-z-index;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    padding: 40px 0;
    background: #fff;
    .icon {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 15px;
      height: 15px;
      fill: var(--color-121212);
      cursor: pointer;
    }
    img {
      margin: auto;
      display: block;
      width: 254px;
      height: 150px;
    }
    .tip1 {
      margin: auto;
      margin-top: 25px;
      font-family: @font-family-600;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      text-transform: capitalize;
      color: var(--color-121212);
    }
    .tip2 {
      margin: auto;
      width: 320px;
      margin-top: 10px;
      font-family: @font-family-500;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      letter-spacing: 0.04em;
      color: var(--color-121212);
    }
    /deep/ a {
      color: @theme;
    }
  }
  .btn {
    display: block;
    margin: auto;
    width: 210px;
    height: 40px;
    margin-top: 20px;
    font-weight: 600;
  }
}
</style>
