<template>
  <div>
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-ask-qut-success">
        <div @click="closeDialog" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div class="popup-content">
          <h3>{{ nl('page_js_thank_submit') }}</h3>
          <div class="question-success-msg">
            {{ `${nl('page_js_stylist_desc1')} ${ticketId}${nl('page_js_stylist_desc2')}` }}
          </div>
          <div class="question-success-msg">{{ nl('page_pop_reach_us') }}</div>
          <div class="question-success-btn">
            <az-button
              @click="jump"
              :text="askType === 'reviews' ? nl('page_module_review_btn_summary') : nl('page_module_review_btn_orders')"
            ></az-button>
          </div>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import azPopup from '@/components/az-ui/Popup/AzPopup'
import AzButton from '../az-ui/AzButton.vue'

export default {
  name: 'PopupAskQuestSuccessReviews',
  languageKeys: [
    'page_js_thank_submit',
    'page_js_stylist_desc1',
    'page_js_stylist_desc2',
    'page_pop_reach_us',
    'page_module_review_btn_summary',
    'page_module_review_btn_orders'
  ],
  components: { azPopup, AzButton },
  props: {
    ticketId: {
      type: [String, Number],
      default: '',
      required: true
    },
    askType: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close', false)
    },
    jump() {
      if (this.askType === 'reviews') {
        this.setPoint('review', 'back_list', 'click')
        location.href = this.countryUrl('/order/list')
      } else if (this.askType === 'review') {
        this.setPoint('review', 'back_detail', 'click')
        location.href = this.countryUrl('/order/detail?order_sn=' + this.$route.query.order_sn)
      }
    },
    setPoint(ec, el, ea, msg) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.popup-ask-qut-success {
  width: 660px;
  min-height: 289px;
  padding: 40px;
  box-sizing: border-box;
  margin: auto;
  position: relative;
  background: #fff;
  text-align: center;
  .close-popup {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .popup-content {
    h3 {
      font-family: @font-family-600, serif;
      font-size: 20px;
      line-height: 27px;
      padding-bottom: 5px;
      text-transform: uppercase;
    }
    .question-success-msg {
      font-size: 14px;
      margin-top: 20px;
    }
    .question-success-btn {
      width: 285px;
      height: 50px;
      line-height: 50px;
      margin: 30px auto 0;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
