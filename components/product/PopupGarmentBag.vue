<template>
  <div v-if="popupGarmentBagShow">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-pannier">
        <div @click="closeDialog()" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div class="popup-content">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/s290/2d/a5/98f7b179e24a4fb899219f7ec7462da5.jpg')"
            alt="free garment bag"
          />
          <span>{{ nl('page_popup_free_garment_bag_note') }}</span>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import AzPopup from '@/components/az-ui/Popup/AzPopup'
import { mapState } from 'vuex'

export default {
  name: 'PopupGarmentBag',
  languageKeys: ['page_popup_free_garment_bag_note'],
  components: { AzPopup },
  computed: {
    ...mapState({
      popupGarmentBagShow: (state) => state.product.popupGarmentBagShow
    })
  },
  methods: {
    closeDialog() {
      this.$store.commit('product/setPopupGarmentBagShow', false)
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
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 40px;
    background: #fff;
    img {
      width: 74px;
      margin-right: 20px;
    }
    span {
      text-align: left;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      font-family: @font-family-500;
    }
  }
}
</style>
