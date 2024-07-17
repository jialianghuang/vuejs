<template>
  <div v-if="titles && titles.length" class="size-detail-container">
    <div :class="['size-unit', { wgd: isSpecialCatId(baseInfo.catId) }]">
      <span class="unit">IN</span>
      <div @click="switchUnit" :class="{ right: unit == 'cm' }" class="unit-switch"><span class="switch-icon"></span></div>
      <span class="unit">CM</span>
    </div>
    <div class="size-fixed">
      <span
        v-for="(sizeFixedItem, index) in sizeFixedInfo"
        :key="index"
        :class="{ active: selectedSize == sizeFixedItem.key.toLowerCase(), bg: index == 0 }"
        class="size-item"
        >{{ sizeFixedItem.name }}</span
      >
    </div>
    <div class="size-detail">
      <div ref="sizeTitle" :class="['size-title', { 'fit-content': fitDom }]">
        <span v-for="title in titles" :key="title.key" :class="[title.key, language]" class="size-item">{{ title.name }}</span>
      </div>
      <div
        ref="sizeValue"
        v-for="(size, key) in sizes"
        :key="key"
        :class="{ active: size.key == selectedSize, 'fit-content': fitDom }"
        class="size-value"
      >
        <span v-if="!showSwitch" class="size-item">{{ size.shownName }}</span>
        <span v-if="sizeChart.secondTitle && !showSwitch" class="size-item">{{ size.secondName }}</span>
        <span v-for="detail in size.sizeDetail" :key="detail.key" :class="detail.key" class="size-item">
          {{ detail.value }}
          {{ detail.key != 'age' && !showSwitch ? (unit == 'inch' ? 'in' : 'cm') : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { euSizeMap } from '@/assets/js/euSizeMap'
import { mapState } from 'vuex'

export default {
  name: 'SizeDetail',
  props: {
    sizeChart: {
      type: Object || Array,
      default: () => {
        return {
          in: [],
          cm: []
        }
      }
    },
    selectedSize: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: 'inch'
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    showSwitch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      euSizeMap,
      sizeTableStyle: []
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.quickshop.baseInfo
    }),
    sizes() {
      const charList = this.sizeChart[this.unit].concat([])
      let i = 0
      for (const j in charList) {
        if (charList[j].key == this.selectedSize) {
          i = j * 1
        }
      }
      const sizes = []
      if (i < 0) {
        return sizes
      } else if (i == 0 || (i == 1 && charList.length == 2)) {
        // 如果选择第一项，或这选择第二项，并且size共2种类型，渲染前三条
        charList.forEach((e, i) => {
          if (i < 3) {
            sizes.push(e)
          }
        })
      } else if (i == charList.length - 1) {
        sizes[0] = charList[i - 2]
        sizes[1] = charList[i - 1]
        sizes[2] = charList[i]
      } else {
        sizes[0] = charList[i - 1]
        sizes[1] = charList[i]
        sizes[2] = charList[i + 1]
      }
      return sizes
    },
    titles() {
      let data = []
      const charList = this.sizeChart[this.unit].concat([])
      for (const i in charList) {
        if (charList[i].key == this.selectedSize) {
          data = charList[i].sizeDetail
        }
      }
      const titles = []
      if (data && data.length > 0) {
        if (!this.showSwitch) {
          if (this.sizeChart.firstTitle) {
            titles.push({
              name: this.sizeChart.firstTitle,
              key: 'size'
            })
          }
          if (this.sizeChart.secondTitle) {
            titles.push({
              name: this.sizeChart.secondTitle,
              key: 'secondSize'
            })
          }
        }

        const unit = this.unit === 'inch' ? '(in)' : '(cm)'
        for (const i in data) {
          titles.push({
            name: this.showSwitch && data[i].name == 'Foot Length' ? data[i].name + unit : data[i].name,
            key: data[i].key
          })
        }
      }
      return titles
    },
    sizeFixedInfo() {
      const tempSizeFixedInfo = []
      if (this.titles && this.titles.length > 6) {
        tempSizeFixedInfo.push({ name: this.titles[0].name, key: this.titles[0].name })
        for (const i in this.sizes) {
          const item = this.sizes[i]
          tempSizeFixedInfo.push({ name: item.shownName, key: item.name })
        }
      }
      return tempSizeFixedInfo
    },
    fitDom({ sizeFixedInfo }) {
      return sizeFixedInfo.length > 0
    }
  },
  mounted() {
    // sizechart表格的显示样式会出现不对齐的情况，让内容跟表头宽度一致，保持对齐
    this.sizeTableStyle = []
    if (this.$refs.sizeTitle && this.$refs.sizeTitle.childNodes && this.$refs.sizeTitle.childNodes.length) {
      this.$refs.sizeTitle.childNodes.forEach((ele) => {
        this.sizeTableStyle.push(ele.clientWidth)
      })
    }
    if (this.$refs.sizeValue && this.$refs.sizeValue.length) {
      this.$refs.sizeValue.forEach((ele) => {
        if (ele.children) {
          for (let i = 0; i < ele.children.length; i++) {
            ele.children[i].style.width = this.sizeTableStyle[i] + 'px'
          }
        }
      })
    }
  },
  methods: {
    switchUnit() {
      this.$emit('switch-unit')
    }
  }
}
</script>

<style lang="less" scoped>
.size-detail-container {
  position: relative;
  margin-top: 5px;
  .size-fixed {
    position: absolute;
    z-index: 9;
    width: 70px;
    left: -1px;
    &.size-fixed-extra {
      left: 69px;
    }
    .size-item {
      min-height: 30px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      &.bg {
        background-color: #eee;
      }
      &:nth-child(1) {
        height: 50px;
        font-family: @font-family-600, sans-serif;
      }
      &.active {
        background-color: @text-hover-color;
      }
    }
  }
  .size-unit {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    &.wgd {
      background-color: var(--color-f9f9f9);
    }
    .unit {
      font-size: 13px;
      line-height: 18px;
      color: #999;
    }
    .unit-switch {
      display: flex;
      align-items: center;
      width: 32px;
      height: 12px;
      border-radius: 8px;
      background: #eee;
      margin: 0 8px;
      &.right {
        justify-content: flex-end;
      }
      .switch-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: @theme-color;
      }
    }
  }
  .size-detail {
    width: fit-content;
    background-color: #fafafa;
    margin: 0 0 10px;
    position: relative;
    max-width: 100%;
    overflow-x: auto;

    .size-title {
      display: flex;
      justify-content: space-between;
      height: 50px;
      text-align: center;
      align-items: center;
      font-family: @font-family-600, sans-serif;
      background-color: #eee;
      width: 100%;
    }
    .size-value {
      display: flex;
      justify-content: space-between;
      text-align: center;
      align-items: center;
      background-color: #fff;
      line-height: 15px;
      min-height: 30px;
      width: 100%;
      &.active {
        background-color: @text-hover-color;
      }
    }
    .size-item {
      width: fit-content;
      min-width: 80px;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .robe_length,
    .pant_length,
    .sleeve_length,
    .skirt_lengths,
    .shoulder_width,
    .hollow_to_hem,
    .train_length,
    .shoulder_to_bust {
      order: 3;
      width: 105px;
      &.en {
        width: 120px;
      }
      &.fr {
        width: 125px;
      }
      &.de,
      &.it,
      &.es {
        width: 130px;
      }
    }
    .hollow_to_floor {
      order: 3;
      width: 105px;
      &.it {
        width: 130;
      }
    }
    .armhole,
    .shoulder {
      order: 1;
      width: 65px;
    }
    .under_bust,
    .neck_hole,
    .highest_point,
    .lowest_point {
      order: 2;
      width: 90px;
    }
    .length_from_hps {
      width: 120px;
    }
    .size-title,
    .size-value {
      &.fit-content {
        width: fit-content;
      }
    }
  }
}
</style>
