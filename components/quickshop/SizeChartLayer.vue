<template>
  <az-popup-layer
    :z-index="12"
    :title="nl(title)"
    :lockScroll="true"
    @close="closeSizeChartLayer"
    :width="privateInfo.width || '960px'"
    height="unset"
  >
    <div :class="privateInfo.belongCategory" class="size-chart-box">
      <div class="scp-content">
        <!-- 10815新内容 -->
        <!-- 一图 -->
        <template v-if="sizeTemplateInfo.templateType === 1">
          <h3 style="margin-bottom: 10px;">{{ nl('page_sitemap_guide') }}</h3>
          <div class="content-box one">
            <div class="one">
              <div class="image-box">
                <img :src="addWebpSuffix(sizeTemplateInfo.list[0].url)" alt="size chart" />
              </div>
            </div>
          </div>
          <p v-if="!isNewLanguageCountry" class="tap-measure">
            {{ nl('page_size_tape') }}
            <a :href="countryUrl(`/products/azazie-tape-measure`)" target="_blank">{{ nl('page_size_click') + '.' }}</a>
          </p>
        </template>
        <!-- 二图 -->
        <template v-else-if="sizeTemplateInfo.templateType === 2">
          <div class="rings-size-chart">
            <div class="size-image-content">
              <div v-for="(item, index) of sizeTemplateInfo.list" :key="index" class="size-image-item">
                <img :src="addWebpSuffix(item.url)" alt="size chart" />
              </div>
            </div>
            <p v-if="!isNewLanguageCountry" class="tap-measure">
              {{ nl('page_size_tape') }}
              <a :href="countryUrl(`/products/azazie-tape-measure`)" target="_blank">{{ nl('page_size_click') + '.' }}</a>
            </p>
          </div>
        </template>
        <!-- 一图一视频 -->
        <template v-else-if="sizeTemplateInfo.templateType === 3">
          <div class="content-box">
            <div class="box-left">
              <h3>{{ nl('page_sitemap_guide') }}</h3>
              <img :src="addWebpSuffix(sizeTemplateInfo.list[0].url)" alt="size chart" />
            </div>
            <div class="box-right">
              <h3>{{ nl('page_pophelp_how_to_measure') }}</h3>
              <p v-if="!isNewLanguageCountry" class="tap-measure">
                {{ nl('page_size_tape') }}
                <a :href="countryUrl(`/products/azazie-tape-measure`)" target="_blank">
                  {{ nl('page_size_click') + '.' }}
                </a>
              </p>
              <img
                v-show="!play"
                @click="playVideo"
                :src="addWebpSuffix(nl('page_image_size_chart_video_poster_pc_img'))"
                alt="size chart"
                class="video-poster"
              />
              <div v-show="play" class="measurement">
                <video
                  id="sizeChartVideo"
                  :poster="replaceImgCdnUrl(nl('page_image_size_chart_video_poster_pc_img'))"
                  controls
                  height="281"
                  preload="auto"
                  data-setup="{}"
                >
                  <source :src="sizeTemplateInfo.list[1].url" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </template>
        <!-- 以下内容为尺码表格 -->
        <div class="scp-table">
          <div v-if="!sizeChartInfo.isRings" class="switch_unit_box">
            <span class="unit">IN</span>
            <div :class="unit" @click="switchingUnit()" class="switch_unit">
              <span class="selected_icon_bg_left selected_icon_bg"></span>
              <span class="selected_icon_bg_right selected_icon_bg"></span>
              <span class="selected_icon"></span>
            </div>
            <span class="unit">CM</span>
          </div>
          <table class="tbl-size">
            <thead v-if="!showShoes">
              <tr>
                <th>{{ sizeChartInfo.firstTitle }}</th>
                <td
                  v-for="(item, index) in tableInfo.columnsKey"
                  :key="item"
                  :data-size-key="item"
                  :data-size="tableInfo.columnsName[index]"
                  :class="{ active: item == needActive }"
                >
                  {{ tableInfo.columnsName[index] }}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="sizeChartInfo.secondTitle">
                <th>{{ sizeChartInfo.secondTitle }}</th>
                <td
                  v-for="item in sizeChartInfo[unit]"
                  :key="item.secondName"
                  :data-size-key="item.secondName"
                  :data-size="item.secondName"
                  :class="{ active: item.secondName == needActive }"
                >
                  {{ item.secondName }}
                </td>
              </tr>
              <tr v-for="(name, i) in tableInfo.rowsName" :key="i">
                <th v-if="!isBoyVest && !sizeChartInfo.isRings" class="th-block">
                  <span :class="['th-text', unit, { 'big-th-block': name.includes('Hollow') }]">
                    {{ name }}
                    <template v-if="!showShoes || (showShoes && name === 'Foot Length')">
                      <span :class="unit">({{ unit == 'inch' ? 'in' : 'cm' }})</span>
                    </template>
                    <size-chart-hover :unit="true" :name="name.toLowerCase()" :from="'quickshop'"></size-chart-hover>
                  </span>
                </th>
                <th v-else class="th-block">
                  <span :class="{ 'big-th-block': name.includes('Hollow') }" class="th-text">
                    {{ name }}
                    <size-chart-hover :unit="false" :name="name.toLowerCase()" :from="'quickshop'"></size-chart-hover>
                  </span>
                </th>
                <td
                  v-for="(item, j) in tableInfo.rowsInfo[tableInfo.rowsKey[i]]"
                  :key="j"
                  :data-value="item.value"
                  :data-size-key="tableInfo.columnsKey[j]"
                  :data-size="tableInfo.columnsName[j]"
                  :class="{
                    fontBold: tableInfo.columnsKey[j] == needFontBold[tableInfo.rowsKey[i]],
                    active: tableInfo.columnsKey[j] == needActive
                  }"
                >
                  {{ item.valueFaction }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="hasNote" class="note-size">
          <span
            >{{ nl('page_common_need_help') }}? {{ nl('page_common_ask') }}
            <a :href="getSupportUrl('/articles/360026475311-How-do-I-contact-you', `/articles/8076683`)" target="_blank">{{
              nl('page_common_stylist')
            }}</a
            >.
          </span>
        </div>
      </div>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import SizeChartHover from '@/components/product/SizeChartHover'
import { euSizeMap } from '@/assets/js/euSizeMap'

export default {
  name: 'SizeChartLayer',
  languageKeys: [
    'page_sitemap_guide',
    'page_size_tape',
    'page_size_click',
    'page_pophelp_how_to_measure',
    'page_image_size_chart_video_poster_pc_img',
    'page_common_need_help',
    'page_common_ask',
    'page_common_stylist',
    'page_goods_size_chart',
    'page_size_sash_size_chart',
    'page_size_separates_size_chart',
    ...SizeChartHover.languageKeys
  ],
  components: {
    AzPopupLayer,
    SizeChartHover
  },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return []
      }
    },
    sizeChartInfo: {
      type: Object,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      title: 'page_goods_size_chart',
      unit: 'inch',
      hasNeckHole: false,
      play: false,
      videoDom: '',
      inputValueCol: [],
      shoulder: '',
      shoulder_to_bust: '',
      armhole: '',
      bust: '',
      sizeCookie: '',
      sizeCookieArray: [],
      needFontBold: {
        shoulder: '',
        shoulder_to_bust: '',
        armhole: '',
        bust: ''
      },
      needActive: '',
      needHighLight: '',
      tableInfo: {},
      sashTHead: {},
      isBoyVest: false,
      euSizeMap
    }
  },
  computed: {
    privateInfo() {
      const privateInfo = {
        belongCategory: '',
        width: ''
      }
      switch (this.baseInfo.catId) {
        case 3:
          privateInfo.belongCategory = 'special_occasions'
          privateInfo.width = '900px'
          break
        case 18:
          privateInfo.belongCategory = 'formal'
          break
        case 7:
          privateInfo.belongCategory = 'bridesmaids'
          break
        case 158:
          privateInfo.belongCategory = 'modest'
          break
        case 15:
          privateInfo.belongCategory = 'sash'
          break
        case 139:
          privateInfo.belongCategory = 'separates'
          break
        case 9:
          privateInfo.belongCategory = 'junior'
          break
        case 8:
          privateInfo.belongCategory = 'mother'
          break
        case 2:
          privateInfo.belongCategory = 'brides'

          break
        case 45:
          privateInfo.belongCategory = 'maternity'
          break
        case 6:
          // 目前未发现详情页存在size chart 弹窗的头纱
          privateInfo.belongCategory = 'veil'
          break
        case 10:
          privateInfo.belongCategory = 'flower_girl'
          break
        case 13:
          privateInfo.belongCategory = 'wrap'
          break
        case 3102:
          privateInfo.belongCategory = 'shoes'
          break
        default:
          if (this.baseInfo.goodsId == 1002653) {
            // 大人马甲
            privateInfo.belongCategory = 'man_vests'
            privateInfo.width = '900px'
          } else if (this.baseInfo.goodsId == 1002654) {
            // 男孩马甲
            privateInfo.belongCategory = 'boy_vests'
            privateInfo.width = '900px'
          } else if (this.sizeChartInfo && this.sizeChartInfo.isRings) {
            privateInfo.belongCategory = 'other' // 没找到可以走进来的品类，暂不做处理
          } else {
            privateInfo.belongCategory = 'other' // 没找到可以走进来的品类，暂不做处理
          }
          break
      }
      return privateInfo
    },
    showTitle() {
      if (![3, 10].includes(this.baseInfo.catId) && ![1002653, 1002654].includes(this.baseInfo.goodsId * 1)) return true
      return false
    },
    showForm() {
      return this.baseInfo.catId == 13
    },
    // 判断当前产品的catId是否是shoes
    showShoes() {
      return this.baseInfo.catId == 3102
    },
    showVideo() {
      return [3, 7, 18, 158, 45, 2, 8, 9, 3098, 3099, 3101].includes(this.baseInfo.catId)
    },
    hasNote() {
      return (
        [3, 7, 18, 158, 45, 2, 8, 9, 10, 3102].includes(this.baseInfo.catId) ||
        [1002653, 1002654].includes(this.baseInfo.goodsId * 1) ||
        (this.sizeChartInfo && this.sizeChartInfo.isRings)
      )
    },
    sizeTemplateInfo() {
      return this.sizeChartInfo.sizeTemplateInfo || {}
    }
  },
  mounted() {
    if (this.baseInfo.catId == 15) {
      this.title = 'page_size_sash_size_chart'
    } else if (this.baseInfo.catId == 139) {
      this.title = 'page_size_separates_size_chart'
    }
    if (this.baseInfo.goodsId == 1002654) this.isBoyVest = true
    if (sessionStorage.getItem('ca_unit')) {
      this.unit = sessionStorage.getItem('ca_unit')
    } else if (this.showEuSize) {
      // 当没有查询到单位缓存时，说明用户还没有进行切换单位操作，这时，应该根据当前网站国家确定应该显示的单位
      this.unit = 'cm'
    }
    this.hasNeckHole = this.sizeChartInfo.hasNeckHole
    this.getTableInfo()
    if (!this.showForm) return
    this.sizeCookie = this.$cookie.getCookie('size') ? this.$cookie.getCookie('size') : ''
    if (this.sizeCookie != '') {
      this.setSizeCookieArray()
      this.showData()
    }
  },
  methods: {
    playVideo() {
      this.play = true
      this.videoDom = document.getElementById('sizeChartVideo')
      this.videoDom.play()
    },
    switchingUnit() {
      this.unit = this.unit == 'inch' ? 'cm' : 'inch'
      sessionStorage.setItem('ca_unit', this.unit)
      this.getTableInfo()
    },
    closeSizeChartLayer() {
      this.$store.commit('quickshop/setSizeChartLayerShow', false)
      this.$emit('closeSizeChartLayer')
    },
    getRecommendedSize() {
      this.inputValueCol = []
      this.tableInfo.rowsKey.forEach((key) => {
        let val = this[key]
        val = val && !isNaN(val) ? parseFloat(val) : 0
        this.inputValueCol.push(val)
      })
      this.setCookie()
    },
    showData() {
      this.getRecommendedSize()
      this.tableInfo.rowsKey.forEach((key) => {
        const val = parseFloat(this[key])
        let index = 0
        this.needFontBold[key] = ''
        if (val > 0) {
          for (let k = 0; k < this.tableInfo.rowsInfo[key].length; k++) {
            const v = parseFloat(this.tableInfo.rowsInfo[key][k].value)
            if (v >= val) {
              this.needFontBold[key] = this.tableInfo.columnsKey[k]
              if (index < k) {
                index = k
                this.needActive = this.needFontBold[key]
              }
              break
            }
            if (k == this.tableInfo.rowsInfo[key].length - 1) {
              this.needActive = ''
            }
          }
        }
      })
    },
    setCookie() {
      if (this.sizeCookie != '') {
        for (let i = 0; i < this.inputValueCol.length; i++) {
          if (this.inputValueCol[i] == 0) {
            this.inputValueCol[i] = this.sizeCookieArray[i]
          }
        }
      }
      const newCookie = this.inputValueCol.join('|')
      if (newCookie != this.sizeCookie) {
        this.$cookie.setCookie('size', newCookie, 365, '.' + this.APP_DOMAIN_LOWER)
        this.sizeCookie = newCookie
        this.setSizeCookieArray()
      }
    },
    setSizeCookieArray() {
      this.sizeCookieArray = this.sizeCookie.split('|')
      for (let i = 0; i < this.sizeCookieArray.length; i++) {
        this[this.tableInfo.rowsKey[i]] = this.sizeCookieArray[i] * 1 > 0 ? this.sizeCookieArray[i] : ''
      }
    },
    getTableInfo() {
      const data = this.sizeChartInfo[this.unit]
      this.tableInfo = {
        rows: '',
        rowsName: [],
        rowsKey: [],
        columns: Object.keys(data).length,
        columnsKey: Object.keys(data),
        columnsName: [],
        rowsInfo: {}
      }
      const key0 = Object.keys(data)[0]
      this.tableInfo.rows = data[key0].sizeDetail.length
      data[key0].sizeDetail.forEach((element) => {
        this.tableInfo.rowsName.push(element.name)
        this.tableInfo.rowsKey.push(element.key)
      })
      for (let i = 0; i < this.tableInfo.rows; i++) {
        this.tableInfo.rowsInfo[this.tableInfo.rowsKey[i]] = []
        for (let j = 0; j < this.tableInfo.columns; j++) {
          this.tableInfo.rowsInfo[this.tableInfo.rowsKey[i]].push(data[this.tableInfo.columnsKey[j]].sizeDetail[i])
        }
      }
      this.tableInfo.columnsKey.forEach((element) => {
        this.tableInfo.columnsName.push(data[element].shownName)
      })
    },
    getSashTableInfo() {
      const data = this.sizeChartInfo[this.unit].detailed
      this.sashTHead = {
        th: '',
        columns: {}
      }
      this.tableInfo = {
        rows: '',
        rowsName: [],
        rowsKey: [],
        columns: 0,
        columnsKey: [],
        columnsName: [],
        rowsInfo: {}
      }
      const keys = Object.keys(data)
      keys.forEach((key) => {
        const sashData = data[key].sizeDetail
        if (this.sashTHead.th == '') this.sashTHead.th = data[key].name + ' (' + this.unit + ')'
        this.sashTHead.columns[key] = {
          name: key.toUpperCase() + ' /' + data[key].value,
          colspan: Object.keys(sashData).length
        }
        if (this.tableInfo.rows == '') {
          const key0 = Object.keys(sashData)[0]
          this.tableInfo.rows = sashData[key0].sizeDetail.length
          sashData[key0].sizeDetail.forEach((element) => {
            this.tableInfo.rowsName.push(element.name)
            this.tableInfo.rowsKey.push(element.key)
          })
        }
        this.tableInfo.columns += Object.keys(sashData).length
        if (this.tableInfo.columnsKey == []) {
          this.tableInfo.columnsKey = Object.keys(sashData)
        } else {
          this.tableInfo.columnsKey.push.apply(this.tableInfo.columnsKey, Object.keys(sashData))
        }
        const sizeColumnsKey = Object.keys(sashData)
        for (let i = 0; i < this.tableInfo.rows; i++) {
          if (!this.tableInfo.rowsInfo[this.tableInfo.rowsKey[i]]) this.tableInfo.rowsInfo[this.tableInfo.rowsKey[i]] = []
          for (let j = 0; j < Object.keys(sashData).length; j++) {
            this.tableInfo.rowsInfo[this.tableInfo.rowsKey[i]].push(sashData[sizeColumnsKey[j]].sizeDetail[i])
          }
        }
        sizeColumnsKey.forEach((element) => {
          this.tableInfo.columnsName.push(sashData[element].name)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.switch_unit_box {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .unit {
    font-size: 13px;
    line-height: 18px;
    font-family: @font-family-500;
    color: #999;
  }
}
.switch_unit {
  display: flex;
  align-items: center;
  position: relative;
  width: 32px;
  height: 12px;
  margin: 0 8px;
  span {
    display: inline-block;
    width: 16px;
    height: 12px;
  }
  .selected_icon_bg {
    background: var(--color-eeeeee);
  }
  .selected_icon_bg_left {
    border-radius: 50% 0 0 50%;
  }
  .selected_icon_bg_right {
    border-radius: 0 50% 50% 0;
  }
  .selected_icon {
    position: absolute;
    top: -2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: @theme-color;
  }
  &.cm {
    .selected_icon {
      right: 0;
    }
  }
}
.size-chart-box {
  h3 {
    font-size: 14px;
    text-transform: uppercase;
    font-family: @font-family-600, sans-serif;
  }
  a {
    color: @theme-color;
    text-decoration: none;
  }
  .scp-content {
    .fl {
      // width: 465px;
      h3 {
        text-align: center;
        margin-top: -4px;
        margin-bottom: 4px;
      }
      img:not(.fl_neck) {
        margin-top: -30px;
        margin-left: -13px;
      }
      .fl_neck {
        margin-top: -8px;
        margin-left: 5px;
      }
      img.foot-length-img {
        margin: 0;
      }
    }
    .fr {
      h3 {
        padding: 0px 0 10px;
      }
    }
    .foot-length {
      width: 453px;
      h3 {
        margin-bottom: 10px;
        margin-top: 0px;
      }
      p {
        text-align: center;
        margin-bottom: 28px;
      }
    }
    .size-chart-click-me {
      text-decoration: none;
      color: @theme-color;
      &:hover {
        text-decoration: underline;
      }
    }
    .custom-size-video {
      text-align: center;
      margin-top: -4px;
      .tap-measure {
        margin-bottom: 20px;
      }
      .video-poster {
        cursor: pointer;
      }
    }
    .custom-size-form {
      width: 365px;
      text-align: center;
      a.custom-size-click-me {
        text-decoration: none;
        color: var(--color-121212);
        &:hover {
          text-decoration: underline;
        }
      }

      .customer-size-tape-link {
        p {
          margin-bottom: 15px;
        }
      }

      span {
        color: #858585;
        .color-theme {
          color: @theme-color;
        }
      }
      li {
        margin-top: 16px;
        text-align: left;
      }
      label {
        display: inline-block;
        width: 132px;
        margin-left: 50px;
        margin-right: 7px;
        text-align: left;
      }
      input {
        width: 58px;
        margin-right: 10px;
      }
      select {
        width: 70px;
        height: 40px;
        margin-right: 7px;
        margin-left: -3px;
        background: #fff;
        border: 0px;
        outline: 1px solid @border-color;
        border-radius: 0;
        outline-offset: -1px;
      }
      .btn {
        width: 232px;
        margin-top: 5px;
        padding: 10px;
        font-size: 14px;
        font-weight: 700;
        background: var(--color-121212);
        color: #fff;
        border: none;
        text-transform: uppercase;
      }
    }
    .shoes-size-intro {
      width: 415px;
      h3 {
        text-align: center;
      }
      p {
        margin-bottom: 11px;
      }
    }
    .rings-size-chart {
      .size-image-content {
        display: flex;
        justify-content: space-between;
        .size-image-item {
          width: 50%;
          &:nth-child(2) {
            margin-left: 20px;
          }
          img {
            width: 100%;
          }
          .size-image-item-left {
            .size-image-item-title {
              .icon-circle {
                display: flex;
                border: 1px solid var(--color-121212);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                align-items: center;
                justify-content: center;
                font-size: 24px;
              }
            }
          }
        }
      }
    }
    .scp-table {
      clear: both;
      padding-top: 20px;
    }
    .tbl-size {
      line-height: 18px;
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      th,
      td {
        border: solid 1px #e2e2e2;
        text-align: center;
        padding: 9px 0 8px;
        // width: 56px;
        .transition(all 0.5s ease 0s);
      }
      th,
      thead td {
        font-weight: normal;
        background: #f2f2f2;
        span {
          text-transform: uppercase;
        }
      }
      .active {
        background: #f9d4e3;
      }
      .fontBold {
        font-weight: bold;
      }
    }
    .note-size {
      margin-top: 5px;
    }
    .content-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .box-left {
        max-width: 486px;
        align-self: flex-start;
        h3 {
          text-align: center;
          margin-bottom: 10px;
        }
        img {
          width: 100%;
          vertical-align: bottom;
        }
      }
      .box-right {
        align-self: flex-start;
        max-width: 454px;
        h3,
        p.tap-measure {
          text-align: center;
          margin-bottom: 10px;
          font-family: @font-family-600;
          &.no-center {
            text-align: left;
          }
        }
        img {
          width: 100%;
          .video-poster {
            vertical-align: bottom;
            cursor: pointer;
          }
        }
        .measurement {
          max-width: 454px;
          video {
            width: 100%;
            object-fit: cover;
          }
        }
        .size_form {
          li {
            margin-top: 16px;
            text-align: left;
          }
          label {
            display: inline-block;
            width: 132px;
            margin-left: 50px;
            margin-right: 7px;
            text-align: left;
          }
          input {
            width: 58px;
            margin-right: 10px;
          }
          select {
            width: 70px;
            height: 40px;
            margin-right: 7px;
            margin-left: -3px;
            background: #fff;
            border: 0px;
            outline: 1px solid @border-color;
            border-radius: 0;
            outline-offset: -1px;
          }
          .btn {
            width: 232px;
            margin-top: 5px;
            padding: 10px;
            font-size: 14px;
            font-weight: 700;
            background: @theme-color;
            color: #fff;
            border: none;
            text-transform: uppercase;
          }
        }
      }
      &.one {
        justify-content: center;
        .image-box {
          // max-width: 610px;
          max-width: 906px;
          &.big {
            max-width: 906px;
          }
          img {
            width: 100%;
            vertical-align: bottom;
          }
        }
      }
    }
  }
}
.size-chart-box.special_occasions {
  .scp-content {
    .fl img {
      width: 430px;
      height: auto;
      margin: 0;
    }
    .tbl-size {
      tr th {
        width: 131px;
      }
      th,
      thead td {
        width: 88px;
      }
    }
  }
}
.size-chart-box.sash,
.size-chart-box.separates {
  h3 {
    margin-left: 9px;
    font-size: 13px;
    line-height: 18px;
  }
  .size-image {
    text-align: center;
    img {
      display: block;
      width: 460px;
      height: 200px;
      margin: 0 auto;
    }
  }
  .scp-content {
    tr th {
      width: 240px;
      // padding: 0 15px;
    }
    th,
    thead td {
      // padding: 0 5px;
      width: 124px;
    }
  }
}
.size-chart-box.junior {
  .scp-content {
    .tbl-size {
      tr th {
        width: 90px;
      }
    }
  }
}
.size-chart-box.maternity {
  .size-image {
    margin-top: 10px;
    img.fl {
      margin: 0 auto;
    }
  }
}
.size-chart-box.flower_girl {
  .scp-content {
    .tbl-size {
      tr th {
        width: 240px;
      }
      th,
      thead td {
        width: 124px;
      }
    }
  }
}
.size-chart-box.wrap {
  .fl {
    width: 465px;
    img:not(.fl_neck) {
      margin-top: -30px;
      margin-left: -13px;
    }
  }
}
.size-chart-box.man_vests,
.size-chart-box.boy_vests {
  .scp-content {
    .fl img {
      width: 790px;
      height: auto;
      margin: 0;
    }
    .tbl-size {
      tr th {
        width: 222px;
      }
      th,
      thead td {
        width: 72px;
      }
    }
    .size-image {
      margin-bottom: 10px;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
  }
}
.tbl-size {
  th.th-block {
    width: 200px !important;
    padding: 0 10px;
    box-sizing: border-box;
    span.th-text {
      display: inline-block;
      position: relative;
      text-transform: capitalize !important;
      width: 120px;
      &.big-th-block {
        width: 190px;
      }
      .cm,
      .inch {
        text-transform: uppercase;
      }
    }
  }
}
</style>
<style lang="less">
@media screen and (max-width: 1200px) {
  .az-popup-box {
    min-width: 960px;
  }
}
</style>
