<template>
  <az-popup-layer :z-index="12" :title="nl('page_goods_post_my_review')" @close="close" width="770px" height="687px">
    <div class="wreview-content">
      <write-reviews :fitCatIds="fitCatIds" :baseInfo="baseInfo" :size="size" @success="writeSuccess"></write-reviews>
      <div class="write-review-goods-info">
        <popup-right-img :baseInfo="baseInfo"></popup-right-img>
      </div>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import WriteReviews from '@/components/review/WriteReviews'
import popupRightImg from '@/components/product/PopupRightImg'
export default {
  name: 'PopupWriteReviews',
  languageKeys: ['page_goods_post_my_review'],
  components: {
    AzPopupLayer,
    WriteReviews,
    popupRightImg
  },
  props: {
    fitCatIds: {
      type: Array,
      default() {
        return []
      }
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    writeSuccess(res) {
      this.$emit('success', res)
    }
  }
}
</script>

<style lang="less" scoped>
.wreview-content {
  width: 700px;
  padding: 35px;
  .write-review-goods-info {
    width: 202px;
    float: right;
    padding: 0;
    label {
      display: block;
      text-align: center;
      font-weight: normal;
      font-weight: bold;
    }
    .pic {
      text-align: center;
      img {
        width: 179px;
        height: 278px;
      }
    }
  }
}
</style>
