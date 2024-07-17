<template>
  <div v-if="afterpayLayerShow">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="afterpay-layer">
        <div @click="closeDialog" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div class="popup-content">
          <div class="icon_title">
            <az-icon class="icon" icon-class="icon-icon_afterpay"></az-icon>
          </div>
          <div class="title">{{ nl('page_afterpay_first_title') }}</div>
          <div class="slogan">{{ nl('page_afterpay_first_slogan_half') }}</div>
          <div class="detail_block">
            <div v-for="(infoItem, index) in detailInfo" :key="index" class="detail_div">
              <img :src="replaceImgCdnUrl(infoItem.img)" :alt="infoItem.slogan" />
              <div v-html="infoItem.slogan" class="detail_slogan"></div>
            </div>
          </div>
          <p class="description">
            {{ nl('page_afterpay_layer_description_one') }}
            <a href="https://www.afterpay.com/installment-agreement">{{ nl('page_common_here') }}</a>
            {{ nl('page_afterpay_layer_description_two') }}
          </p>
          <p v-html="nl('page_afterpay_layer_description_three')" class="description"></p>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import azPopup from '@/components/az-ui/Popup/AzPopup'
import { mapState } from 'vuex'

export default {
  name: 'AfterpayLayer',
  languageKeys: [
    'page_afterpay_first_title',
    'page_afterpay_first_slogan_half',
    'page_afterpay_layer_description_one',
    'page_common_here',
    'page_afterpay_layer_description_two',
    'page_afterpay_layer_description_three',
    'page_afterpay_layer_detail_one',
    'page_afterpay_layer_detail_two',
    'page_afterpay_layer_detail_three',
    'page_afterpay_layer_detail_four'
  ],
  components: { azPopup },
  data() {
    return {
      detailInfo: [
        {
          img: require('~/assets/images/afterpay/icon_cart.png'),
          slogan: this.nl('page_afterpay_layer_detail_one')
        },
        {
          img: require('~/assets/images/afterpay/icon_checkout.png'),
          slogan: this.nl('page_afterpay_layer_detail_two')
        },
        {
          img: require('~/assets/images/afterpay/icon_login.png'),
          slogan: this.nl('page_afterpay_layer_detail_three')
        },
        {
          img: require('~/assets/images/afterpay/icon_pay.png'),
          slogan: this.nl('page_afterpay_layer_detail_four')
        }
      ]
    }
  },
  computed: {
    ...mapState(['afterpayLayerShow'])
  },
  methods: {
    closeDialog() {
      this.$store.commit('setAfterpayLayerShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.afterpay-layer {
  width: 920px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  background-color: #fff;
  .close-popup {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .popup-content {
    padding: 40px;
    .icon_title {
      height: 50px;
      .icon {
        width: 200px;
        height: 50px;
      }
    }
    .title {
      font-size: 24px;
      font-family: @font-family-700;
      margin-top: 30px;
    }
    .slogan {
      font-size: 13px;
      font-family: @font-family-500;
      margin-top: 15px;
    }
    .detail_block {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      margin-bottom: 50px;
      .detail_div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 202px;
        box-sizing: border-box;
        position: relative;
        img {
          width: 64px;
          height: 64px;
        }
        .detail_slogan {
          font-size: 16px;
          font-family: @font-family-600;
          text-align: center;
          margin-top: 6px;
          white-space: pre-line;
        }
      }
    }
    .description {
      text-align: center;
      font-family: @font-family-500;
      color: var(--color-121212);
      font-size: 13px;
      margin-bottom: 20px;
      &:first-of-type {
        margin-bottom: 20px;
      }
      .here {
        text-transform: lowercase;
      }
      a {
        text-transform: lowercase;
        color: var(--color-121212);
        text-decoration: underline;
      }
    }
  }
}
</style>
