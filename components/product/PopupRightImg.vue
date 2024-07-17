<template>
  <div>
    <div class="askq-prod">
      <div class="askq-prod-img">
        <az-sticker
          v-if="baseInfo.stickers && Object.keys(baseInfo.stickers).length"
          :stickerInfo="baseInfo.stickers"
          :sticker-class="`product-item-icon-small`"
          :goodsId="baseInfo.goodsId"
        ></az-sticker>
        <img
          :data-src="addWebpSuffix(getGoodsPictureUrl)"
          :src="require('~/assets/images/default_img.jpg')"
          alt="default"
          class="lazyload"
        />
        <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
      </div>
      <h3 class="goods-name">{{ baseInfo.shownGoodsName }}</h3>
      <p v-if="selectedColor" class="goods-color-box">
        <span>{{ showNameOfColor }}: </span>
        <span>{{ selectedColor.name }}</span>
      </p>
      <template v-if="baseInfo.hasLinePrice">
        <div class="goods-price goods-price-box">
          <span class="goodsprice-current">{{ baseInfo.shopPriceDisplay }}</span>
          <span class="goods-nodeal-price">{{ baseInfo.noDealPriceDisplay }}</span>
        </div>
      </template>
      <template v-else>
        <p class="goodsprice">{{ baseInfo.shopPriceDisplay }}</p>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'

export default {
  name: 'PopupRightImg',
  languageKeys: ['page_style_dress_color', 'page_common_color', ...AzSticker.languageKeys],
  components: { AzSticker },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      selectedColor: 'product/getSelectedColor'
    }),
    showNameOfColor() {
      return this.baseInfo.isDress ? this.nl('page_style_dress_color') : this.nl('page_common_color')
    },
    getGoodsPictureUrl() {
      return this.PIC_PATH + 's179/' + this.baseInfo.goodsThumb
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.askq-prod {
  border: 10px solid #f6f6f6;
  text-align: center;
  img {
    width: 100%;
  }
  &-img {
    position: relative;
    .mattel {
      position: absolute;
      right: 3px;
      bottom: 37px;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: #fff;
      transform-origin: right bottom;
      transform: scale(0.5);
      width: max-content;
    }
  }
  .goods-name {
    color: var(--color-121212);
    text-transform: uppercase;
    font-family: @font-family-600, sans-serif;
  }
  .goods-color-box {
    text-transform: capitalize;
  }
  .goods-price-box {
    font-size: 0;
    .goodsprice-current {
      color: @theme-color;
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 22px;
    }
    .goods-nodeal-price {
      color: var(--color-999999);
      text-decoration: line-through;
      font-size: 13px;
      margin-left: 5px;
    }
  }
}
</style>
