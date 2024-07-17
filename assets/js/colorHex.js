import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      colorHex: (state) => state.colorHex
    })
  },
  methods: {
    /**
     *
     * @param {*} key
     * @param {*} imgType
     * @param {*} deepShadow
     * @param {*} bgImg
     * @param {*} curentColor 列表色值在商品颜色属性里提供
     * @returns
     */
    getColorStyle(key, imgType, deepShadow, bgImg = '', curentColor = null) {
      // 如果key为空或者undefined，则不处理
      if (!key) return false
      const colors = this.colorHex
      const color = (['list', 'product'].includes(this.jsKey) && curentColor) || colors[key]
      if (!color) {
        return ''
      }

      let style = {}
      if (color.hasOwnProperty('colorRoundImg') && color.colorRoundImg) {
        style = {
          backgroundImage: `url(${this.addWebpSuffix(color.colorRoundImg)})`,
          backgroundSize: 'cover'
        }
      } else if (color.isComplexColor == 1) {
        const count = color.hexes.length
        const percent = Math.round(100 / count)
        let bg = 'linear-gradient('
        for (const i in color.hexes) {
          const hex = color.hexes[i]
          if (i == count - 1) {
            bg += hex + ' ' + (i * percent + 1) + '%, ' + hex + ')'
          } else {
            bg += hex + ' ' + (i * percent + 1) + '%, ' + hex + ' ' + (i + 1) * percent + '%, '
          }
        }
        style = {
          background: bg
        }
      } else if (color.hexes) {
        style = {
          background: color.hexes[0]
        }
      }
      if (color.colorType == 0) {
        style['box-shadow'] = '0 0 2px #ccc inset'
        // 列表页的 色系下的颜色，阴影要加深
        if (deepShadow) {
          style['box-shadow'] = '0 0 2px rgba(0, 0, 0, 0.5) inset'
        }
      }
      if (bgImg) {
        // 有自定义的背景图片，且有colorhex的颜色
        style = {
          ...style,
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover'
        }
      }
      return style
    },
    getColorType(key) {
      const colors = this.colorHex
      const color = colors[key]
      if (!color) {
        return ''
      }
      return color.colorType
    },
    getColorHexAjax() {
      return this.$axios.$get('/1.0/common/color-hex').then((res) => {
        if (res.code == 0) {
          this.$store.commit('setColorHex', res.data.colorHex)
        } else {
          console.log(res.msg)
        }
      })
    }
  }
}
