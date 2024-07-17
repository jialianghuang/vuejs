<template>
  <div v-show="showBox">
    <div :class="{ 'address-delivery-info-wgd': isSpecialCatId(catId) }" class="address-delivery-info">
      <!-- jira: 20459 调整为只有US 展示州切换，其他站点统一不显示 -->
      <div v-if="country == 'US'" class="shipping-to-box">
        <div class="txt-box">
          <span class="txt">{{ nl('page_goods_shipping_to') }}</span
          ><span class="address-txt theme-color">{{ regionNameSelected }}, {{ country }}.</span>
        </div>
        <div @click="toggleRegionBlock" v-show="!showRegionSelect" class="change-txt">
          {{ nl('page_common_change') }}
        </div>
        <span v-if="isSpecialCatId(catId)" class="wgd-arrow">></span>
      </div>
      <div v-show="showRegionSelect" class="region-select-block">
        <div class="select_extra">
          <div id="region_select" @click.stop="showRegionSelectList" :class="{ error: regionSelectError }" class="delivery_select region">
            <div v-if="!regionSelectListShow" class="select_value">{{ selShowRegionSelected.regionNameSelected }}</div>
            <input ref="searchInput" v-else v-model="regionNameKeyword" @input="handleChange" class="select_value" type="text" />
            <div class="select_after">
              <svg :style="regionSelectListShow ? 'transform:rotate(180deg)' : ''" class="az-icon">
                <use xlink:href="#icon-lby_expand_arrow_down"></use>
              </svg>
            </div>
          </div>
          <div ref="region_select_list_options" v-show="regionSelectListShow" class="region_select_list delivery_select_list">
            <label
              @click.stop="chooseRegion(region.regionId, region.regionName)"
              v-for="(region, index) in showRegionList"
              :key="index"
              :value="region.regionId"
              :code="region.regionCode"
            >
              {{ region.regionName }}
              <az-icon v-if="selShowRegionSelected.regionIdSelected == region.regionId" icon-class="icon-right" class="icon-right" />
            </label>
            <label v-if="!showRegionList.length" class="no-data">
              {{ nl('page_no_reslut') }}
            </label>
          </div>
        </div>
        <div @click="getDeliveryInfo('go')" class="delivery-button">
          <span>{{ nl('page_common_go') }}</span>
        </div>
      </div>
      <div :class="['delivery-time-content', { 'no-expedited': !expeditedDaysSateStr, country }]">
        <div class="delivery-time-info">
          <div class="shipping-standard">
            <az-icon icon-class="icon-xxy_check_estimated_delivery_dates"></az-icon>
            <span class="time-t">{{ nl(!expeditedDaysSateStr ? 'page_order_today' : 'page_order_standard_shipping') }}</span>
            <span class="time-d">{{ nl('page_order_estimated_delivery') }} {{ standardDaysStateStr }}</span>
            <template v-if="isSpecialCatId(baseInfo.catId) && baseInfo.sodPreSaleGoods">
              <PreSaleShippingNotice />
            </template>
          </div>
          <div v-if="expeditedDaysSateStr" class="shipping-expedited">
            <az-icon icon-class="icon-a-7day1"></az-icon>
            <span class="time-t">{{ expeditedText }}</span>
            <span class="time-d">{{ expeditedDaysSateStr }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArrayByName } from '../../assets/js/utils'

export default {
  name: 'AddressDeliveryInfo',
  languageKeys: [
    'page_goods_shipping_to',
    'page_common_change',
    'page_no_reslut',
    'page_common_go',
    'page_order_today',
    'page_order_standard_shipping',
    'page_order_estimated_delivery',
    'page_product_detail_order_desc',
    'page_order_expedited_shipping',
    'page_order_expedited_shipping_wgd',
    'page_help_menu_deep_shipping'
  ],
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    makeTimeInfo: {
      type: Object,
      default() {
        return null
      }
    },
    goodsNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      countrySelected: '',
      regionSelectListShow: false,
      allRegionJson: {},
      regionSelectError: false,
      showRegionSelect: false,
      standardDaysStateStr: '',
      expeditedDaysSateStr: '',
      selShowRegionSelected: {
        regionIdSelected: '',
        regionNameSelected: ''
      },
      showRegionList: [],
      selTempRegionSelected: {
        // 因为添加了可搜索功能，所以用来展示在搜索框内
        regionIdSelected: '',
        regionNameSelected: ''
      },
      regionNameKeyword: '',
      showBox: false
    }
  },
  computed: {
    ...mapState('product', [
      'selectedColor',
      'selectedSize',
      'regionIdSelected',
      'regionNameSelected',
      'isCurrentStyleSupportStock',
      'selectRush'
    ]),
    expeditedText({ baseInfo, nl }) {
      if (baseInfo.isMassProduct != 0 && this.isSpecialCatId(baseInfo.catId)) {
        return nl('page_order_expedited_shipping_wgd')
      } else {
        return nl('page_order_expedited_shipping')
      }
    }
  },
  watch: {
    selectRush: {
      handler(val, oldVal) {
        this.getDeliveryInfo()
      },
      deep: true
    },
    goodsNumber(e) {
      if (e) {
        this.getDeliveryInfo()
      }
    }
  },
  created() {
    if (process.client) {
      if (this.country == 'US') {
        this.initAllRegion()
      } else {
        this.getDeliveryInfo()
      }
    }
  },
  mounted() {
    // 全局点击隐藏选择省份下拉框
    document.addEventListener('click', () => {
      this.regionSelectListShow = false
    })
  },
  methods: {
    async initAllRegion() {
      const res = await this.getAllRegionJson() // 接口返回的数据结构由之前的对象改成了数组
      // 因为 /1.0/geolocation 这个接口是运维在 cloudflare 直接配置的，这里做个兼容 只有线上环境调用定位接口
      let defaultGeolocation = {}
      if (this.environment != 'prod') {
        defaultGeolocation = {}
      } else {
        const result = await this.$axios.get('/1.0/geolocation')
        defaultGeolocation = result.data
      }
      this.allRegionJson = res || {}
      this.showRegionList = Object.values(this.allRegionJson)
      // 匹配定位地址是否存在
      const findDefaultRegion = this.showRegionList.find((item) => item.regionCode == defaultGeolocation.regionCode) || {}
      // 取记录在cookie中的地址
      const initRegionId = this.$cookie.getCookie('delivery_province_new')
      const initRegionArr = this.showRegionList.filter((item) => {
        if (item.regionId == initRegionId) {
          return item
        }
      })
      const initRegion = initRegionArr[0]
      if (initRegionId && initRegion) {
        this.initShowData(initRegion)
      } else if (Object.keys(findDefaultRegion).length) {
        this.initShowData(findDefaultRegion)
      } else {
        this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
      }
      this.getDeliveryInfo()
    },
    showRegionSelectList() {
      if (this.regionSelectListShow) return
      this.regionSelectError = false
      this.regionSelectListShow = true
      // 点击展示下拉框的时候，关键词回显选中的 regionName,并且重置下拉框展示数据
      this.regionNameKeyword = this.selShowRegionSelected.regionNameSelected
      this.handleChange()
      this.$nextTick(() => {
        this.$refs.searchInput && this.$refs.searchInput.focus()
        this.handleScroll()
      })
    },
    async toggleRegionBlock() {
      this.showRegionSelect = !this.showRegionSelect
      if (!this.allRegionJson) {
        await this.initAllRegion()
      } else {
        this.handleChange()
      }
    },
    chooseRegion(regionId, regionName) {
      this.selShowRegionSelected = {
        regionIdSelected: regionId,
        regionNameSelected: regionName
      }
      this.regionSelectListShow = false
    },
    getAllRegionJson() {
      return this.$axios.get(`/1.0/region`).then((response) => {
        const res = response.data
        if (res.code == 0) {
          return res.data.regionList
        }
      })
    },
    getDeliveryInfo(type) {
      const _this = this
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType,
        province_id: this.selShowRegionSelected ? this.selShowRegionSelected.regionIdSelected : '', // 选中的地址
        color_style_id: this.selectedColor.styleId,
        size_style_id: this.selectedSize.styleId,
        goods_number: this.goodsNumber
      }
      const { groupId, key } = this.selectRush || {}
      if (key) {
        params.rush_type = key
        params.rush_group_id = groupId
      }
      if (this.baseInfo.supportStockSales && this.isCurrentStyleSupportStock) {
        params.isSpecialStockGoods = 1 // DB库存
      }
      if (this.baseInfo.dressType === 'clearance') {
        params.discount = -1
      }
      this.$axios.$post('/1.0/delivery', params).then((res) => {
        if (res.code == 0) {
          _this.$store.commit('product/setDeliveryInit', true)
          _this.showBox = true
          const deliveryInfo = res.data.deliveryInfo
          _this.standardDaysStateStr = deliveryInfo.standardDaysStateStr
          _this.expeditedDaysSateStr = deliveryInfo.expeditedDaysSateStr
          // 更新交期信息
          _this.$store.commit('product/setMakeTimeInfo', { ...deliveryInfo, minWeeks: deliveryInfo.minWeek })
          // 保存Shipped to You交期时间
          _this.$store.commit('product/setShippingInfo', deliveryInfo.shippingInfo)
          if (type === 'go') {
            this.showRegionSelect = false
          }
          const shippingTo = deliveryInfo.shippingTo || {}
          if (shippingTo.province) {
            this.$store.commit('product/setRegionIdSelected', shippingTo.province)
            this.$store.commit('product/setRegionNameSelected', shippingTo.provinceName)
            type && this.$cookie.setCookie('delivery_province_new', shippingTo.province, 7, '.' + this.APP_DOMAIN_LOWER)
            this.selShowRegionSelected = {
              regionIdSelected: shippingTo.province,
              regionNameSelected: shippingTo.provinceName
            }
          }
          this.setCompletePosition()
        }
      })
    },
    // 搜索输入修改监听
    handleChange(event) {
      if (!event || event.target.value.length < 2) {
        this.showRegionList = JSON.parse(JSON.stringify(Object.values(this.allRegionJson)))
        return
      }
      const filterArr = getArrayByName(Object.values(this.allRegionJson), event.target.value, 'regionName')
      this.showRegionList = JSON.parse(JSON.stringify(filterArr))
    },
    handleScroll() {
      let scrollTop = 0
      if (this.selShowRegionSelected.regionIdSelected) {
        for (let i = 0; i < this.showRegionList.length; i++) {
          const ele = this.showRegionList[i]
          if (ele.regionId === this.selShowRegionSelected.regionIdSelected) {
            scrollTop = i * 40
            break
          }
        }
      }
      this.$refs.region_select_list_options && this.$refs.region_select_list_options.scrollTo(0, scrollTop)
    },
    // 初始化显示数据
    initShowData(option) {
      if (!(option.regionId && option.regionName)) return
      this.$store.commit('product/setRegionIdSelected', option.regionId)
      this.$store.commit('product/setRegionNameSelected', option.regionName)
      this.selShowRegionSelected = {
        regionIdSelected: option.regionId,
        regionNameSelected: option.regionName
      }
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme-color;
}
.address-delivery-info {
  .shipping-to-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .txt-box {
      font-size: 12px;
      margin-right: 20px;
      .txt {
        color: var(--color-121212);
        text-transform: uppercase;
        &::after {
          content: ':';
          width: 1px;
          height: 12px;
          padding-left: 1px;
          padding-right: 5px;
        }
        &.shipping {
          &::after {
            content: '';
          }
        }
      }
    }
    .change-txt {
      font-size: 12px;
      text-decoration-line: underline;
      color: var(--color-121212);
      cursor: pointer;
    }
    .wgd-arrow {
      vertical-align: middle;
      margin-left: 3px;
      color: #999;
    }
  }
  .region-select-block {
    display: flex;
    margin: 15px 0;
    .select_extra {
      flex: 1;
      position: relative;
      .select_value {
        width: 100%;
        border: none;
        background: #fff;
        padding: 0;
      }
      .select_after {
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 1px;
        pointer-events: none;
        .az-icon {
          transition: 0.2s;
        }
      }
      .delivery_select_list {
        position: absolute;
        background: #ffffff;
        border: 1px solid #e1e1e1;
        box-sizing: border-box;
        cursor: pointer;
        max-height: 240px;
        width: 100%;
        label {
          padding-left: 10px;
          display: block;
          box-sizing: border-box;
          width: 100%;
          line-height: 40px;
          cursor: pointer;
          &:hover {
            background-color: var(--color-f9f9f9);
          }
        }
        .icon-right {
          margin-left: 10px;
        }
        .no-data {
          text-align: center;
        }
      }
      .region_select_list {
        overflow-y: auto;
        z-index: 1;
        &::-webkit-scrollbar {
          width: 5px;
          background-color: #f6f6f6;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #e1e1e1;
        }
        label {
          color: var(--color-121212);
          &.not_selected {
            color: var(--color-666666);
          }
        }
      }
    }
    #region_select {
      height: 40px;
      line-height: 38px;
      padding: 0 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border: 1px solid #e1e1e1;
      cursor: pointer;
      appearance: none;
      background: #ffffff;
      border: 1px solid var(--color-cccccc);
      &.error {
        border: 1px solid red;
      }
    }
    .delivery-button {
      margin-left: 10px;
      vertical-align: top;
      width: 100px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      background: @theme-color;
      color: #ffffff;
      text-align: center;
      &:hover {
        background: @btn-hover-color;
        color: #ffffff;
      }
    }
  }
  &-wgd {
    background-color: transparent;
    .shipping-to-box {
      .change-txt {
        color: #666;
      }
    }
  }
  .delivery-time-content {
    &.US {
      margin-top: 10px;
    }
    .delivery-time-info {
      display: flex;
      align-items: center;
      font-size: 13px;
      line-height: 18px;
      font-family: @font-family-500;
      > div {
        display: flex;
        align-items: center;
        .az-icon {
          font-size: 13px;
          margin-right: 5px;
          fill: @theme-color;
        }
      }
      .shipping {
        &-standard {
          .after {
            margin-left: 5px;
            position: relative;
            cursor: pointer;
            .order_desc {
              display: none;
              position: absolute;
              left: 4px;
              top: 24px;
              width: 245px;
              transform: translateX(-50%);
              background: #fff;
              border: 1px solid #ccc;
              border-radius: 3px;
              text-align: center;
              padding: 10px;
              box-sizing: border-box;
              z-index: 1;
              font-family: @font-family-500;
              &:before {
                content: '';
                width: 0;
                height: 0;
                border-right: 6px solid transparent;
                border-bottom: 6px solid var(--color-cccccc);
                border-left: 6px solid transparent;
                position: absolute;
                top: 0%;
                left: 48.4%;
                margin-top: -7px;
              }
              &:after {
                content: '';
                width: 0;
                height: 0;
                border: 6px solid transparent;
                border-bottom-color: #ffffff;
                position: absolute;
                top: 0%;
                left: 48.4%;
                margin-top: -11px;
              }
            }
          }
          .after:hover .order_desc {
            display: inline-block;
          }
        }
        &-expedited {
          &::before {
            content: '';
            width: 1px;
            height: 12px;
            background-color: #ccc;
            margin: 0 20px;
          }
        }
      }
      .time-t {
        &::after {
          content: ':';
          width: 1px;
          height: 12px;
          padding-left: 1px;
          padding-right: 5px;
        }
      }
    }
  }
}
</style>
