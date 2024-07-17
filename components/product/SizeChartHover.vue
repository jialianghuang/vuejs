<template>
  <div
    v-if="measureList[name] && !isSpecialCatId(baseInfo.catId)"
    :class="{
      hasUnit: !unit,
      'big-measure-box': name.indexOf('hollow') >= 0
    }"
    class="measure-box"
  >
    <az-icon v-track.view.click="getBiParams(name)" icon-class="icon-icon_undone1"></az-icon>
    <div v-track.view.click="getBiParams(name)" class="text-tip">
      <p class="big-card-measure">
        {{ nl(measureList[name].text) }}
        <img :src="addWebpSuffix(nl(measureList[name].imgUrl))" :alt="nl(measureList[name].imgUrl)" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SizeChartHover',
  languageKeys: [
    'page_size_chart_measure_bust',
    'page_size_chart_measure_waist',
    'page_size_chart_measure_hips',
    'page_size_chart_measure_hollow_to_hem',
    'page_size_chart_measure_height',
    'page_size_chart_measure_hollow_to_floor',
    'page_image_size_hollow_to_hem',
    'page_image_size_measure_height',
    'page_image_size_hollow_to_floor'
  ],
  props: {
    name: {
      type: String,
      require: true,
      default: 'bust'
    },
    unit: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: 'product'
    }
  },
  data() {
    return {
      measureList: {
        bust: {
          text: 'page_size_chart_measure_bust',
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/ppml/222/9a/59/92436b9bfee0b4205d6ec03599b49a59.png'
        },
        waist: {
          text: 'page_size_chart_measure_waist',
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/ppml/222/90/a4/7005278b684ee03bc8b229c612cc90a4.png'
        },
        hips: {
          text: 'page_size_chart_measure_hips',
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/ppml/222/a7/fb/e7afe2a7247ce420e57691535ca0a7fb.png'
        },
        'hollow to hem': {
          text: 'page_size_chart_measure_hollow_to_hem',
          imgUrl: 'page_image_size_hollow_to_hem'
        },
        height: {
          text: 'page_size_chart_measure_height',
          imgUrl: 'page_image_size_measure_height'
        },
        'hollow to floor': {
          text: 'page_size_chart_measure_hollow_to_floor',
          imgUrl: 'page_image_size_hollow_to_floor'
        }
      }
    }
  },
  computed: {
    baseInfo({ from }) {
      return this.$store.state[from || 'product'].baseInfo
    }
  },
  methods: {
    getBiParams(position) {
      if (process.server) return
      const baseInfo = this.baseInfo
      const msg = { goodsId: baseInfo.goodsId, cat_Name: baseInfo.catName }
      return {
        common: {
          ec: 'sizechart',
          el: `${position}_hover`,
          msg: JSON.stringify(msg)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.measure-box {
  position: absolute;
  right: 15px;
  bottom: 0px;
  &.big-measure-box {
    right: 20px;
    .text-tip {
      top: -170px;
      .big-card-measure::before {
        top: 170px;
      }
    }
  }
  &.hasUnit {
    right: 25px;
    &.big-measure-box {
      right: 30px;
    }
  }
  .text-tip {
    width: fit-content;
    margin-top: 0;
    left: 25px;
    top: -128px;
    &:hover {
      display: block;
    }
    .big-card-measure {
      position: relative;
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: fit-content;
      padding: 20px 15px;
      background: #fff;
      border: solid 1px #ccc;
      .border-radius(4px);
      white-space: nowrap;
      color: #231f1e;
      font-family: @font-family-500;
      font-size: 13px;
      text-transform: none;
      img {
        margin-top: 10px;
        width: 100%;
      }
    }
    .big-card-measure::before {
      background: url('~assets/images/measure/left-arrow.png') no-repeat;
      content: '';
      position: absolute;
      display: inline-block;
      width: 10px;
      height: 17px;
      top: 125px;
      left: -8px;
    }
  }
  &:hover .text-tip {
    display: block;
  }
  .az-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
