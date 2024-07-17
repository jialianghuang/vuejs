<template>
  <div v-if="popupPannierShow">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-pannier">
        <div @click="closeDialog()" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div class="popup-content">
          <div class="title">
            <img :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/s74/3a/99/3b28885b3818919fe07dec04aba33a99.jpg')" alt="free pannier" />
            <span>{{ nl('page_popup_pannier_text') }}</span>
          </div>
          <img :src="addWebpSuffix(getImgUrl())" alt="free pannier" />
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import AzPopup from '@/components/az-ui/Popup/AzPopup'
import { mapGetters } from 'vuex'

export default {
  name: 'PopupPannier',
  languageKeys: ['page_popup_pannier_text', 'page_image_popup_pannier_img'],
  components: { AzPopup },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      popupPannierShow: 'product/getPopupPannierShow'
    })
  },
  methods: {
    closeDialog() {
      this.$store.commit('product/setPopupPannierShow', false)
    },
    getImgUrl() {
      return this.nl('page_image_popup_pannier_img')
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
    top: 15px;
    right: 15px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .popup-content {
    padding: 40px;
    background: #fff;
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 20px;
      margin-bottom: 20px;
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
    img {
      width: 510px;
    }
  }
}
</style>
