<template>
  <div v-if="popupAddToCartOnlyShow">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-pannier">
        <div @click="closeDialog()" class="close-popup"></div>
        <div class="popup-content">
          <div class="title">
            <img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/s74/5f/80/29e28eb563dcccb7c51d5033546d5f80.jpg')"
              alt="add to cart only"
            />
            <span>{{ nl('page_add_to_cart_only_text') }}</span>
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
  name: 'PopupAddToCartOnly',
  languageKeys: ['page_add_to_cart_only_text'],
  components: { azPopup },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      popupAddToCartOnlyShow: 'product/getPopupAddToCartOnlyShow'
    })
  },
  watch: {
    popupAddToCartOnlyShow: {
      handler(val) {
        if (process.client) {
          this.setMessageZindex(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$store.commit('product/setPopupAddToCartOnlyShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.popup-pannier {
  width: 650px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  .close-popup {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 16px;
    height: 16px;
    background: data-uri('~assets/images/close_m_black.png');
    background-size: 100% 100%;
  }
  .popup-content {
    padding: 40px;
    background: #fff;
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 74px;
        margin-right: 20px;
      }
      span {
        font-size: 13px;
        line-height: 18px;
        color: var(--color-121212);
        font-family: @font-family-500;
      }
    }
  }
}
</style>
