<template>
  <div
    v-if="showLabel"
    v-track.viewOnce.click="{
      id: 'helpmysize-label',
      common: {
        ec: 'helpmysize',
        el: 'helpmysize',
        msg: { cat_id: baseInfo.catId, goods_id: baseInfo.goodsId }
      }
    }"
    @click="openSizeRecommend"
    class="size-recommend-label"
  >
    <az-icon icon-class="size-recommend-icon" class="recommend-az-icon"></az-icon>
    <span class="recommend-label-text">{{ nl('page_size_recommend_help_with_sizeing') }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SizeRecommendLabel',
  languageKeys: ['page_size_recommend_help_with_sizeing'],
  data() {
    return {}
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      showRecommendSizePopup: (state) => state.product.showRecommendSizePopup
    }),
    showLabel({ country, baseInfo }) {
      // 1002420、1006376、1009674、1004424采用逻辑1，1005298采用逻辑2
      const { goodsId, dressType } = baseInfo
      return (
        [1000515, 1056554, 1006432, 1009611, 1051104, 1009614, 1052860, 1052904, 1006334].includes(goodsId) &&
        country === 'US' &&
        dressType == 'dress' &&
        this.language === 'en'
      )
    }
  },
  watch: {
    showRecommendSizePopup: {
      handler(val) {
        if (process.client) {
          const bodyDom = document.body
          if (val) {
            bodyDom.classList.add('hidden-scroll')
          } else {
            bodyDom.classList.remove('hidden-scroll')
          }
          this.setMessageZindex(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    openSizeRecommend() {
      this.$store.commit('product/setShowRecommendSizePopup', true)
    }
  }
}
</script>

<style lang="less">
.size-recommend-label {
  background-color: #fff;
  cursor: pointer;
}
.recommend-az-icon {
  font-size: 18px;
  margin-left: 11px;
  vertical-align: middle;
}
.recommend-label-text {
  line-height: 18px;
  font-family: @font-family-500;
  font-size: 13px;
  color: var(--color-e3bda1);
  text-decoration: underline;
  text-transform: capitalize;
}
</style>
<style lang="less">
body.hidden-scroll {
  overflow: hidden;
  transition: overflow 0.25s ease;
}
</style>
