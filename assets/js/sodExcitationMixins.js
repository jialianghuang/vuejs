export default {
  data() {
    return {
      viewList: {
        looking_now: {
          icon: 'excitation-eye',
          title: 'popular',
          titleAlias: 'popular1',
          description: '',
          className: 'eye'
        },
        looked_recently: {
          icon: 'excitation-eye',
          title: 'popular',
          titleAlias: 'popular2',
          description: '',
          className: 'eye'
        },
        added_to_bags: {
          icon: 'excitation-bag',
          title: 'Don’t miss out!',
          titleAlias: 'dontmiss',
          description: '',
          className: 'bag'
        },
        sold_order: {
          icon: 'excitation-shop',
          title: 'in demand!',
          titleAlias: 'indemand',
          description: '',
          className: 'shop'
        }
      }
    }
  },
  computed: {
    getExcitationValues({ baseInfo, viewList }) {
      const sticker = (baseInfo.driveInfo && baseInfo.driveInfo.detailSticker) || {}
      const listTemp = []
      for (const key in sticker) {
        if (sticker[key] && viewList[sticker[key].type]) {
          const item = viewList[sticker[key].type]
          listTemp.push({
            icon: item.icon,
            title: item.title,
            description: sticker[key].subText,
            className: item.className,
            type: sticker[key].type,
            titleAlias: item.titleAlias
          })
        }
      }
      return listTemp
    }
  },
  methods: {
    getStickerText() {
      const list = []
      for (const key in this.getExcitationValues) {
        list.push(this.getExcitationValues[key].titleAlias)
      }
      if (list.length == 0) return ''
      return list.join('-')
    }
  }
}
