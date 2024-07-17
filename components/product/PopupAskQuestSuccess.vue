<template>
  <div v-if="popupAskQuestSuccessShow">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-ask-qut-success">
        <div @click="closeDialog()" class="close-popup"></div>
        <div class="popup-content">
          <div class="goods-pic fl">
            <img :src="addWebpSuffix(getGoodsPictureUrl)" alt="goods pic" />
          </div>
          <div class="question-success-msg fr">
            <p v-html="nl('page_pop_thanks_for_submit')" class="msg-title"></p>
            <br />
            <p>
              <span v-html="nl('page_js_stylist_desc1')"></span>
              <span id="ticketId">{{ ticketId }}</span>
              <span v-html="nl('page_js_stylist_desc2')"></span>
            </p>
            <p v-html="nl('page_pop_reach_us')"></p>
            <br />
            <p>
              <span v-html="nl('page_pop_check_out_p1')"></span>
              <a v-html="nl('page_js_faq')" :href="faqUrl" target="_blank" class="faq"></a>
              <span v-html="nl('page_pop_check_out_p2')"></span>
            </p>
          </div>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import azPopup from '@/components/az-ui/Popup/AzPopup'
import { mapGetters } from 'vuex'

export default {
  name: 'PopupAskQuestSuccess',
  languageKeys: [
    'page_pop_thanks_for_submit',
    'page_js_stylist_desc1',
    'page_js_stylist_desc2',
    'page_pop_reach_us',
    'page_pop_check_out_p1',
    'page_js_faq',
    'page_pop_check_out_p2'
  ],
  components: { azPopup },
  props: {
    ticketId: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      popupAskQuestSuccessShow: 'product/getPopupAskQuestSuccessShow',
      selectedColor: 'product/getSelectedColor',
      baseInfo: 'product/getBaseInfo'
    }),
    faqUrl() {
      let url = ''
      let isCommon = false
      if (this.baseInfo.dressType == 'sample') {
        url = this.getSupportUrl('/sections/200806445-Sample-Program', '/articles/8076722')
      } else if ([33, 36].includes(this.baseInfo.catId)) {
        url = this.getSupportUrl(`/articles/203896295-Ordering-Swatches`, `/articles/8297499`)
      } else {
        url = this.getSupportUrl(`/`, `/`)
        isCommon = true
      }
      if (this.country == 'CA') {
        if (!isCommon) {
          url += '?from=ca'
        } else {
          url += 'hc/en-us?from=ca'
        }
      }
      return url
    },
    getGoodsPictureUrl() {
      return this.PIC_PATH + 's179/' + this.baseInfo.goodsThumb
    }
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$store.commit('product/setPopupAskQuestSuccessShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.popup-ask-qut-success {
  width: 583px;
  height: 300px;
  padding: 35px 35px 20px;
  margin: auto;
  position: relative;
  background: #fff;
  .close-popup {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 16px;
    height: 16px;
    background: data-uri('~assets/images/close_m_black.png');
    background-size: 100% 100%;
    cursor: pointer;
  }
  .popup-content {
    .goods-pic {
      border: 10px solid #f6f6f6;
      img {
        width: 179px;
        height: 278px;
      }
    }
    .question-success-msg {
      width: 350px;
      .msg-title {
        font-weight: 700;
        text-align: center;
        padding-top: 52px;
      }
      a.faq {
        color: var(--color-121212);
        text-decoration: underline;
      }
    }
  }
}
</style>
