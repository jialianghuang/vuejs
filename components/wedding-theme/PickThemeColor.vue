<template>
  <div v-track.viewOnce="{ common: getBiParams('color family') }" :style="[{ backgroundColor: bgColor }]" class="pick-theme-color">
    <div class="pick-theme-color-content">
      <div class="title">
        {{
          theme === 'spring-wedding' ? nl('page_wedding_theme_pick_theme_color_spring') : nl('page_wedding_theme_pick_theme_color_beach')
        }}
      </div>
      <div v-if="colorFamilyList && colorFamilyList.length > 0" class="color-family">
        <template v-for="(item, index) in colorFamilyList">
          <div :key="index" @click="selectColor(index)" class="color-family-item">
            <div :class="['image', { active: colorFamilyCur === index }]">
              <img v-if="isImg(item.key)" :src="colorHex(item.key)" :alt="'color family ' + item" />
              <div v-else :style="{ backgroundColor: colorHex(item.key) }" class="bg"></div>
            </div>
            <div class="color">{{ item.value }}</div>
          </div>
        </template>
      </div>
      <slot></slot>
      <!-- <div class="mark">
        {{ theme === 'spring-wedding' ? nl('page_wedding_theme_real_spring_weddings') : nl('page_wedding_theme_real_beach_weddings') }}
      </div> -->
      <div class="text">
        {{
          theme === 'spring-wedding'
            ? nl('page_wedding_theme_pick_theme_color_spring_intro')
            : nl('page_wedding_theme_pick_theme_color_beach_intro')
        }}
      </div>
      <div class="keyword">
        <div class="item">{{ nl('page_wedding_theme_pick_theme_color_keyword') }}</div>
        <template v-for="(item, index) in keyWordsList">
          <div :key="index" class="item">{{ item }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * wedding-theme主题页 选择色系组件
 *
 */
const colorMap = {
  black: { isImage: false, bgColor: '#30312b' },
  blues: { isImage: false, bgColor: '#909ead' },
  green: { isImage: false, bgColor: '#8ea088' },
  purple: { isImage: false, bgColor: '#bea6bc' },
  pink: { isImage: false, bgColor: '#ead6d7' },
  blue: { isImage: false, bgColor: '#909ead' },
  'crimson blush': { isImage: true, url: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/e4/5e/b236236d48c5fa8003a2c2886836e45e.png' }, // spring 二色
  'pastel tones': { isImage: true, url: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/8f/99/01d555a0745d004b51e4854f94ea8f99.png' }, // spring 四色
  'wineberry coast': { isImage: true, url: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/ec/dd/27628c5fe09b718dab9d8ddbf835ecdd.png' }, // beach 二色
  'coastal breeze': { isImage: true, url: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/3a/8c/2284d003d05ddad120c9bc24115f3a8c.png' } // beach 四色
}

export default {
  name: 'PickThemeColor',
  props: {
    theme: {
      type: String,
      default: ''
    },
    currentColor: {
      type: String,
      default: ''
    },
    ec: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: ''
    },
    colorFamilyList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      colorFamilyCur: 0 // 当前颜色index
    }
  },
  computed: {
    keyWordsList() {
      // 关键词多语言配置
      return this.theme === 'spring-wedding'
        ? this.nl('page_wedding_theme_pick_theme_color_keyword_spring').split(',')
        : this.nl('page_wedding_theme_pick_theme_color_keyword_beach').split(',')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 初始化要判断是否有选中状态
      this.colorFamilyCur =
        this.colorFamilyList.indexOf((item) => {
          return item.selected
        }) || undefined
    },
    selectColor(index) {
      this.colorFamilyCur = index
      this.$emit('select-color', this.colorFamilyList[index])
      this.setPoint(this.ec, 'color family', 'click', { color: this.colorFamilyList[index].value })
    },
    colorHex(item) {
      return this.isImg(item) ? colorMap[item].url || '' : colorMap[item].bgColor || ''
    },
    isImg(item) {
      return colorMap[item].isImage ? colorMap[item].isImage : false
    },
    getBiParams(el) {
      if (process.server) return
      return {
        ec: this.ec,
        el,
        msg: { color: this.currentColor }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pick-theme-color {
  position: relative;
  .pick-theme-color-content {
    margin: 0 auto;
    padding: 30px 0;
  }
  .mark {
    margin: 0 auto;
    padding: 15px 0;
    color: @gray-light;
    background: #f6f6f6;
    text-align: center;
    font-family: @font-family-500;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.56px;
    text-transform: uppercase;
  }
  .title {
    color: #121212;
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 32px;
    letter-spacing: 2.56px;
    text-transform: uppercase;
    padding: 0 3.75%;
    margin: 0 auto;
    max-width: 1600px;
  }
  .mark {
    position: absolute;
    top: 15px;
    left: 15px;
    color: @gray-light;
    font-family: @font-family-500;
    font-size: 24px;
    letter-spacing: 2.88px;
  }
  .title {
    color: @gray-dark;
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 36px;
    letter-spacing: 2.88px;
    text-transform: uppercase;
  }

  .color-family {
    max-width: 1600px;
    padding: 0 3.75%;
    margin: 30px auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .color-family-item {
    margin: 0 20px;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .image {
      width: 76px;
      height: 76px;
      border-radius: 100px;
      img {
        position: relative;
        z-index: 3;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 100px;
      }
      .bg {
        position: relative;
        z-index: 3;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 100px;
      }
    }
    .active {
      position: relative;
      z-index: 2;
      &::before {
        content: ' ';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100px;
        width: 81px;
        height: 81px;
        border: 3px solid @theme-color;
        background: @body-bg;
        z-index: 1;
      }
    }
    .color {
      margin-top: 15px;
      color: @gray-dark;
      text-align: center;
      font-family: @font-family-500;
      font-size: 14px;
      letter-spacing: 0.28px;
      text-transform: uppercase;
    }
  }
  .text {
    max-width: 1600px;
    padding: 30px 3.75% 15px;
    color: @gray-dark;
    text-align: center;
    font-family: @font-family-500;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: 0.8px;
    margin: 0 auto;
  }
  .keyword {
    max-width: 1600px;
    padding: 0 3.75%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    .item {
      padding: 8px 15px;
      color: @gray-dark;
      text-align: center;
      font-family: @font-family-600;
      font-size: 24px;
      letter-spacing: 1.44px;
    }
  }
}
</style>
