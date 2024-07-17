<template>
  <div class="color-palette-list">
    <div class="try-it-yourself">
      <h2 class="try-it-yourself-title">{{ title }}</h2>
    </div>
    <div class="popular-weddings">
      <div class="image-box">
        <div v-for="(item, index) in lists" :key="index" class="popular-box">
          <div class="img" style="height: 320px;">
            <img
              :src="replaceImgCdnUrl(item.imgUrl)"
              :alt="item.alt"
              @load="getColorPalette"
              :data-imgurl="item.imgUrl"
              class="target-image"
            />
          </div>
          <div class="color-box" style="display: block;">
            <div v-if="paletteList[item.imgUrl] && paletteList[item.imgUrl].colors" class="color-list get-color">
              <div class="color-title">
                <h3>{{ colorTitle }}</h3>
              </div>
              <div class="color-swatches">
                <a
                  :style="{ 'background-color': '#' + paletteList[item.imgUrl].colors.color }"
                  :href="countryUrl(paletteList[item.imgUrl].colors.url)"
                  target="_blank"
                  class="swatch"
                ></a>
                <div class="text-tip">
                  <span>{{ paletteList[item.imgUrl].colors.matchColor }}</span>
                </div>
              </div>
            </div>
            <div v-if="paletteList[item.imgUrl] && paletteList[item.imgUrl].newPalette" class="color-list get-palette">
              <div class="palette-title">
                <h3>{{ paletteTitle }}</h3>
              </div>
              <div class="palette-output">
                <div v-for="(palette, pindex) in paletteList[item.imgUrl].newPalette" :key="pindex" class="swatches">
                  <a
                    :style="{ 'background-color': '#' + palette.colors }"
                    :href="countryUrl(palette.urls)"
                    target="_blank"
                    class="swatch"
                  ></a>
                  <div class="text-tip">
                    <span>{{ palette.matchPalette }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="customer_upload" v-if="uploadImgUrl">
          <div @click="$emit('open')">
            <img :src="replaceImgCdnUrl(uploadImgUrl)" class="color_inspiration_customer_photo" height="320" width="482" alt="upload" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorThief from 'colorthief'
import { mapState } from 'vuex'

export default {
  name: 'ColorPaletteList',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    uploadImgUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    colorTitle: {
      type: String,
      default: ''
    },
    paletteTitle: {
      type: String,
      default: ''
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  },
  data() {
    return {
      count: 1,
      paletteList: {}
    }
  },
  computed: {
    ...mapState({
      colorHex: (state) => state.colorHex
    }),
    azazieColors() {
      if (!this.colorHex) return []
      const arr = []
      let hexes
      for (const k in this.colorHex) {
        hexes = this.colorHex[k].hexes
        if (!(hexes && hexes.length)) continue
        const name = this.colorHex[k].showColor
        // 去除中文
        if (/[\u4E00-\u9FA5]/g.test(name)) {
          continue
        }
        hexes.forEach((item) => {
          arr.push({
            name,
            hex: item.replace('#', '')
          })
        })
      }
      return arr
    }
  },
  mounted() {
    window.colorThief = new ColorThief()
    const imgs = document.querySelectorAll('.target-image')
    imgs.forEach((item) => {
      this.getColorPalette({ target: item }, true)
    })
  },
  methods: {
    getColorPalette(e, crossOrigin) {
      const imgurl = e.target.dataset.imgurl
      if (this.paletteList[imgurl]) return
      const res = this.showColorsForImage(e.target, crossOrigin)
      this.$set(this.paletteList, imgurl, res)
    },
    showColorsForImage(image, crossOrigin) {
      const colorThief = window.colorThief
      let color = colorThief.getColor(image)
      const palette = colorThief.getPalette(image, 8)
      const bridesmaidUrl = '/all/bridesmaid-dresses/colors/'
      const matchColor = this.closestMatch(color)
      for (let i = 0; i < this.azazieColors.length; i++) {
        if (this.azazieColors[i].name.toUpperCase() == matchColor) {
          color = this.azazieColors[i].hex
          break
        }
      }
      const url = bridesmaidUrl + matchColor.toLowerCase().replace(' ', '-')
      const colors = { color, url, matchColor }
      const newPalette = []

      for (let p = 0; p < palette.length; p++) {
        const ob = {}
        ob.matchPalette = this.closestMatch(palette[p])
        ob.urls = bridesmaidUrl + ob.matchPalette.toLowerCase().replace(' ', '-')
        for (let i = 0; i < this.azazieColors.length; i++) {
          if (this.azazieColors[i].name.toUpperCase() == ob.matchPalette) {
            ob.colors = this.azazieColors[i].hex
            break
          }
        }
        let colorRepeat = 0
        if (p > 0) {
          for (let k = 0; k < newPalette.length; k++) {
            if (ob.colors == newPalette[k].colors) {
              colorRepeat = 1
              break
            }
          }
        }
        if (colorRepeat == 0) {
          newPalette.push(ob)
        }
      }

      return {
        newPalette,
        colors
      }
    },

    closestMatch(color) {
      let minDistance = this.distance(this.hexStringToByte(this.azazieColors[0].hex), color)
      let minColor = 0

      for (let i = 1; i < this.azazieColors.length; i++) {
        const d = this.distance(this.hexStringToByte(this.azazieColors[i].hex), color)
        if (d < minDistance) {
          minDistance = d
          minColor = i
        }
      }

      return this.azazieColors[minColor].name.toUpperCase()
    },

    distance(h1, h2) {
      const a = h1[0] - h2[0]
      const b = h1[1] - h2[1]
      const c = h1[2] - h2[2]

      return Math.sqrt(a * a + b * b + c * c)
    },

    hexStringToByte(str) {
      if (!str) {
        return [0, 0, 0]
      }

      const a = []
      for (let i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16))
      }
      return a
    }
  }
}
</script>

<style lang="less" scoped>
.color-palette-list {
  clear: both;
  margin-bottom: 80px;
}
.try-it-yourself-title {
  letter-spacing: 1px;
  font-size: 16px;
  font-family: @font-family-600, sans-serif;
  text-transform: uppercase;
  border-bottom: solid 1px var(--color-121212);
  padding-bottom: 10px;
}
.popular-weddings {
  width: 1004px;
  margin-left: auto;
  margin-right: auto;
  clear: both;
  .image-box {
    width: 1004px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .popular-box {
      display: inline-block;
      padding-top: 20px;
      width: 482px;
      .color-box {
        display: none;
        height: 150px;
        padding: 20px 35px;
        background-color: #fafafa;
        border: 1px solid #eee;
        border-top-width: 0;
        //border-radius: 0 0 8px 8px;
      }

      .img {
        text-align: center;
      }
      .target-image {
        // max-width: 100%;
        // max-height: 100%;
        width: 482px;
        height: 320px;
      }

      .color-list {
        margin-bottom: 10px;
        display: flex;
        & > div:first-child {
          margin-right: 15px;
        }
      }

      .color-title {
        display: inline;
        font-size: 16px;
        font-family: @font-family-600, sans-serif;
        color: var(--color-121212);
        padding-top: 6px;
        max-width: 150px;
        word-break: break-all;
      }
      .color-swatches {
        position: relative;
        .text-tip {
          top: 66%;
          // left: -239px;
          left: -164px;
          right: -150px;
        }
        &:hover {
          .text-tip {
            display: block;
          }
        }
      }

      //palette-title
      .palette-title {
        display: inline;
        font-size: 16px;
        font-family: @font-family-600, sans-serif;
        color: var(--color-121212);
        padding-top: 6px;
        max-width: 150px;
        min-width: 59px;
        word-break: break-all;
      }
      .palette-output {
        display: inline;
        flex: 1;
        .swatches {
          position: relative;
          display: inline;
          .text-tip {
            top: 0%;
            left: -164px;
            right: -150px;
          }
          &:hover {
            .text-tip {
              display: block;
            }
          }
        }
      }

      .swatch {
        display: inline-block;
        margin: 0 15px 15px 0;
        width: 36px;
        height: 36px;
        transition: 0.5s ease;
        backface-visibility: hidden;
        background: #dddddd;
        border-radius: 50%;
        vertical-align: -4px;
      }
    }
  }
  #customer_upload {
    width: 1004px;
    margin-left: auto;
    margin-right: auto;
    clear: both;
    .color_inspiration_customer_photo {
      cursor: pointer;
    }
    width: 482px;
    padding-top: 20px;
    margin: 0;
    clear: none;
  }
}
</style>
