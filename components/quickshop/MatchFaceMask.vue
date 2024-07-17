<template>
  <transition name="fade">
    <div v-if="faceMaskInfo" class="match-face-mask">
      <label @click="selectFaceMask" class="label-box">
        <div :class="{ selected: isSelected }" class="checkbox-box">
          <svg v-show="isSelected" class="icon">
            <use xlink:href="#icon-lby_tick_white_s"></use>
          </svg>
        </div>
        <div v-if="isWd" class="bg-mask-wd"></div>
        <div v-else>
          <svg :style="{ backgroundColor: fillColor }" class="face_mask">
            <use xlink:href="#face_mask"></use>
          </svg>
        </div>
        <div>
          <span v-if="faceMaskInfo.isCoordinatingColor">{{ nl('page_match_face_mask_text') }}</span>
          <span v-else>{{ nl('page_match_face_mask_text1') }}</span>
          <a @click="buriedPoint" :href="countryUrl(faceMaskInfo.goodsUrl)" class="click-a" target="_blank">{{
            nl('page_match_face_mask_text2')
          }}</a>
          {{ nl('page_match_face_mask_text3') }} {{ faceMaskInfo.shopPriceDisplay }}
        </div>
      </label>
    </div>
  </transition>
</template>

<script>
/**
 * 口罩组件暂未使用
 */
import { mapState } from 'vuex'
export default {
  name: 'MatchFaceMask',
  languageKeys: ['page_match_face_mask_text', 'page_match_face_mask_text1', 'page_match_face_mask_text2', 'page_match_face_mask_text3'],
  data() {
    return {
      isWd: false,
      // 口罩的绘制颜色
      fillColor: '#3E4454',
      isSelected: false,
      faceMaskInfo: null
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.quickshop.baseInfo,
      selectedColor: (state) => state.quickshop.selectedColor,
      colorHex: (state) => state.colorHex
    })
  },
  watch: {
    selectedColor: {
      handler(val, oldVal) {
        this.getMaskInfo(val.key)
      },
      immediate: true
    }
  },
  created() {
    if (this.baseInfo.catId == 2 && this.baseInfo.dressType == 'dress') {
      this.isWd = true
    } else {
      this.isWd = false
    }
  },
  methods: {
    selectFaceMask() {
      this.isSelected = !this.isSelected
      this.$emit('select-face-mask', this.isSelected)
    },
    buriedPoint(event) {
      event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true)
      this.setDataLayer({
        action: 'click',
        category: 'DetailPage',
        label: 'DetailPage_MatchFaceMask_Click'
      })
      return false
    },
    // 获取搭配口罩信息
    getMaskInfo(color) {
      this.$axios
        .$get(`/1.0/product/face-mask-info`, {
          params: {
            goods_id: this.baseInfo.goodsId,
            color
          }
        })
        .then((res) => {
          if (res.code == 0) {
            const faceMaskInfo = res.data.faceMaskInfo ? res.data.faceMaskInfo : null
            this.faceMaskInfo = faceMaskInfo
            if (faceMaskInfo) {
              const colorKey = faceMaskInfo.color.key
              this.fillColor = colorKey ? this.colorHex[colorKey].hexes[0] : ''
              this.$emit('is-render', true)
            } else {
              this.$emit('is-render', false)
            }
          }
        })
    }
  }
}
</script>

<style lang="less">
.match-face-mask {
  margin: 15px 0;
  .label-box {
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }
  .bg-mask-wd {
    width: 32px;
    height: 32px;
    margin: 0 5px;
    background: url('https://cdn-1.azazie.com/upimg/userfiles/images/fc/c5/995f3ee046586a28582cdae6f404fcc5.png') no-repeat;
    background-size: cover;
    border: 1px dashed var(--color-eeeeee);
  }
  .face_mask {
    width: 26px;
    height: 26px;
    margin: 0 5px;
    border: 1px dashed var(--color-eeeeee);
  }
  .click-a {
    color: var(--color-121212);
    font-family: @font-family-500, sans-serif;
    cursor: pointer;
    // border-bottom: 1px solid var(--color-121212);
    text-decoration: underline;
  }
  .checkbox-box {
    border: 1px solid var(--color-121212);
    width: 12px;
    height: 12px;
    line-height: 12px;
    display: inline-block;
    margin-right: 1px;
    box-sizing: border-box;
    &.selected {
      background: #666;
      border-color: #666;
    }
    .icon {
      width: 9px;
      height: 9px;
      color: #fff;
      vertical-align: top;
      fill: currentColor;
      overflow: hidden;
      margin: 1px 0 0 1px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
