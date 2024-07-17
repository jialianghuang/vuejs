export default {
  computed: {
    showColorNotifyLabel({ showColorNotify, colorNotifyOption }) {
      return showColorNotify && !!Object.keys(colorNotifyOption).length
    },
    showSizeNotifyLabel({ showSizeNotify, sizeNotifyOption }) {
      return showSizeNotify && !!Object.keys(sizeNotifyOption).length
    },
    showNotifyMeBtn({ baseInfo, hasColor, colorStock, hasSize, sizeStock, stockInfo, selectedColor, selectedSize }) {
      if (!(baseInfo.isStockGoods || baseInfo.supportStockSales)) return false
      if (!stockInfo.hasStock) {
        return !stockInfo.hasStock
      }
      // 无色 无尺码 有库存直接return
      if (!hasColor && !hasSize && stockInfo.hasStock) {
        return false
      }
      // 138 男配， 13-wraps
      if (this.country == 'MX' && this.baseInfo.mxBdBatch) {
        return false
      }
      // 防尘袋
      if (this.isGarmentBags && this.tipStatus.key !== 'hasStock' && this.tipStatus.key !== 'shipsImmediately') {
        return true
      }
      // 有颜色
      if (hasColor) {
        // 颜色无库存
        if (colorStock.length == 0) return true
        // 颜色有库存 选了颜色
        if (selectedColor.key) {
          if (colorStock.includes(selectedColor.key)) {
            if (stockInfo.colorMap && stockInfo.colorMap[selectedColor.key]) {
              const { hasStock } = stockInfo.colorMap[selectedColor.key]
              // 有尺码且选了尺码的情况看sizeStock
              if (selectedSize.key) {
                return !sizeStock.includes(selectedSize.key)
              } else {
                // 无尺码 或者 有尺码没选尺码
                return !hasStock
              }
            }
          } else {
            return true
          }
        }
      } else {
        if (!hasSize && this.tipStatus.key !== 'hasStock' && this.tipStatus.key !== 'shipsImmediately') {
          return true
        }
        if (selectedSize.key && !sizeStock.includes(selectedSize.key)) {
          return true
        }
      }
      return false
    },
    // 获取颜色下面的无库存的尺码信息
    notifyColorAndSize({ hasColor, colorStock, hasSize, sizeStock, stockInfo, sizes, colorsFormat, selectedColor }) {
      const options = {}
      if (hasColor) {
        if (hasSize) {
          const { colorMap = {}, sizeMap = {} } = stockInfo
          for (const key in colorMap) {
            const color = JSON.parse(JSON.stringify(colorMap[key]))
            color.name = colorsFormat.shown[key] ? colorsFormat.shown[key].name : ''
            color.lastAvailableDate = color.lastAvailableDate ? this.$dayjs(color.lastAvailableDate).format('MM/DD HH:mm') : ''

            const { inStockSize = {}, hideSize = {} } = color
            const outOfSizes = []

            sizes.forEach((item) => {
              const isHasStock = inStockSize.hasOwnProperty(item.key)
              let lastAvailableDate = sizeMap[item.key] && sizeMap[item.key].lastAvailableDate
              lastAvailableDate = lastAvailableDate ? this.$dayjs(lastAvailableDate).format('MM/DD HH:mm') : ''
              if (!isHasStock && !hideSize.hasOwnProperty(item.key)) {
                outOfSizes.push({
                  ...item,
                  lastAvailableDate
                })
              }
            })
            if (outOfSizes.length) {
              options[key] = {
                ...color,
                outOfSizes
              }
            } else if (!colorStock.includes(key)) {
              options[key] = color
            }
          }
        } else {
          for (const key in colorsFormat.shown) {
            if (!colorStock.includes(key)) {
              options[key] = colorsFormat.shown[key]
            }
          }
        }
      } else {
        /* eslint-disable */
        if (hasSize) {
          options[this.baseInfo.color] = {
            outOfSizes: []
          }
          sizes.forEach((item) => {
            const isHasStock = sizeStock.hasOwnProperty(item.key)
            if (!isHasStock) {
              options[this.baseInfo.color].outOfSizes.push({
                ...item,
                lastAvailableDate: ''
              })
            }
          })
        } else {
          // 无尺码 无颜色
          options[this.baseInfo.color] = { outOfSizes: [] }
        }
      }
      return options
    },
    notifyBindValue({ notifyColorAndSize, selectedColor, selectedSize }) {
      const type = !this.hasSize && !this.hasColor ? 'none' : this.hasSize ? 'size' : 'color'
      return {
        type,
        selectedColor,
        selectedSize,
        options: notifyColorAndSize
      }
    }
  }
}
