<template>
  <div v-if="titles && titles.length" :class="['size-detail', { wgd: isSpecialCatId(baseInfo.catId) }]">
    <div :class="['size-unit', { wgd: isSpecialCatId(catId) }]">
      <span class="unit">IN</span>
      <div @click="switchUnit" :class="{ right: unit == 'cm' }" class="unit-switch"><span class="switch-icon"></span></div>
      <span class="unit">CM</span>
    </div>
    <div ref="sizeTitle" class="size-title">
      <span v-for="title in titles" :key="title.key" :class="[title.key, language]" class="size-item">{{ title.name }}</span>
    </div>
    <div ref="sizeValue" v-for="(size, index) in sizes" :key="index" :class="{ active: size.key == selectedSize }" class="size-value">
      <span v-if="!showSwitch" class="size-item">{{ size.shownName }}</span>
      <!-- <span v-if="showEuSizeMap && !showSwitch" class="size-item">{{ euSizeMap[baseInfo.catId][size.name] }}</span> -->
      <span v-if="sizeChart.secondTitle && !showSwitch" class="size-item">{{ size.secondName }}</span>
      <span v-for="detail in size.sizeDetail" :key="detail.key" :class="detail.key" class="size-item">
        {{ detail.value }}
        {{ detail.key != 'age' && !showSwitch ? (unit == 'inch' ? 'in' : 'cm') : '' }}
      </span>
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
      type: [Object, Array],
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
    // 是否显示switch，这里对shoes进行适配，shoes产品始终显示switch
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
      baseInfo: (state) => state.product.baseInfo
    }),
    sizes() {
      const charList = this.sizeChart[this.unit] && this.sizeChart[this.unit].concat([])
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
      const charList = this.sizeChart[this.unit] && this.sizeChart[this.unit].concat([])
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
            // if (this.showEuSizeMap) {
            //   titles.push({
            //     name: 'EU',
            //     key: 'size_eu'
            //   })
            // }
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
          // 如果是shoes产品并且表格表头是length，根据UI设计后面跟上单位，否则，不用带单位
          titles.push({
            name: this.showSwitch && data[i].name == 'Foot Length' ? data[i].name + unit : data[i].name,
            key: data[i].key
          })
        }
      }
      return titles
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
.size-detail {
  width: fit-content;
  background-color: #fafafa;
  margin: 0 0 10px;
  position: relative;
  max-width: 100%;
  min-width: 480px;
  &.wgd {
    margin: 10px 0;
    .size-title {
      background-color: var(--color-eeeeee);
    }
    .size-item {
      flex: 1;
      &.bust,
      &.waist,
      &.hips {
        min-width: 120px;
        &.fr {
          min-width: 130px;
        }
      }
    }
  }
  .size-unit {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    background-color: #fff;
    &.wgd {
      // padding-top: 5px;
      background-color: #f7f7f7;
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
  .size-title {
    display: flex;
    justify-content: space-between;
    height: 50px;
    text-align: center;
    align-items: center;
    font-family: @font-family-600, sans-serif;
    background-color: var(--color-f9f9f9);
  }
  .size-value {
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    background-color: #fff;
    line-height: 15px;
    min-height: 30px;
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
    &.de,
    &.it {
      width: 130px;
    }
    &.es {
      width: 170px;
    }
  }
  .hollow_to_floor {
    order: 3;
    width: 105px;
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
}
</style>
