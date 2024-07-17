<template>
  <div v-if="showFiltersExtra" class="filter-extra border-line">
    <!-- ON SALE筛选开关 -->
    <div v-if="showOnSale" class="on-sale-filter filter-item switch-filter-item">
      <az-switch
        :value="!!onSaleValue"
        @onChange="onSaleChange"
        v-track.view.click="{ common: getBiParamsSwitchFilter('filter', 'on_sale_filter') }"
        >{{ nl('page_saletype_sale_offers') }}
      </az-switch>
    </div>
    <!-- rush filter: 改成switch模式 -->
    <div
      v-if="showRush"
      v-track.view="{ common: getBiParamsSwitchFilter('filter', 'Rush') }"
      class="rush-filter filter-item switch-filter-item"
    >
      <az-switch :value="!!rushValue" @onChange="onRushChange">{{ rushFilter.value }}</az-switch>
    </div>
    <!-- ship in 48h -->
    <div
      v-if="showShipin"
      v-track.view="{ common: getBiParamsSwitchFilter('filter', 'Shipin48hrs') }"
      class="ship-in-filter filter-item switch-filter-item"
    >
      <az-switch :value="!!supportStockSales" @onChange="onShipInChange">
        <div class="ship-in-box">
          <az-icon :icon-class="'icon-a-7day1'" class="icon-stock"></az-icon>
          <span>{{ nl('page_ships_in_time') }}</span>
        </div>
      </az-switch>
    </div>
    <!-- Available Sizes -->
    <div v-if="showShipin && supportStockSales && sizeFilter && Object.keys(sizeFilter).length" class="available-sizes-filter filter-item">
      <h5 @click="ssFilterBodyShowEvent" class="expanded">
        <p class="expanded-title">
          <span>{{ sizeFilter.value }}</span>
        </p>
        <template v-if="ssFilterBodyFlag">
          <svg class="filter-title-delete">
            <use xlink:href="#icon-lby_add"></use>
          </svg>
        </template>
        <template v-else>
          <svg class="filter-title-add">
            <use xlink:href="#icon-lby_subtraction"></use>
          </svg>
        </template>
      </h5>
      <template v-if="ssFilterBodyFlag">
        <filter-size
          :info="{
            key: sizeFilter.key,
            values: sizeFilter.values,
            value: sizeFilter.value,
            parentFold: sizeFilter.fold,
            parentKey: sizeFilter.key
          }"
        ></filter-size>
      </template>
    </div>
  </div>
</template>

<script>
// 这个组件的filter比较特殊，目前没办法做成可复用性的，业务比较奇葩
import filtersMixins from '@/assets/js/filters'
import AzSwitch from '@/components/az-ui/AzSwitch'
import FilterSize from '@/components/list/filters/FilterSize'
import { mapState } from 'vuex'
export default {
  name: 'FiltersExtra',
  languageKeys: ['page_common_new_more', 'page_common_new_less', 'page_ships_in_time_24', 'page_ships_in_time'],
  components: {
    AzSwitch,
    FilterSize
  },
  mixins: [filtersMixins],
  props: {},
  data() {
    return {
      ssFilterBodyFlag: false
    }
  },
  computed: {
    ...mapState('list', ['showSupportStockSales']),
    showOnSale() {
      if (this.saleTypeFilter && this.saleTypeFilter.values) {
        const values = Object.values(this.saleTypeFilter.values)
        const onSaleItem = values.filter((item) => {
          return item.key === 'sales_&_offers' && item.number
        })
        // 当前没有正在做活动的商品时，隐藏此filter
        return onSaleItem && onSaleItem.length
      }
      return false
    },
    showRush() {
      return this.rushFilter && Object.keys(this.rushFilter).length
    },
    showShipin() {
      return this.showSupportStockSales
    },
    showFiltersExtra() {
      return this.showRush || this.showShipin || this.showOnSale
    },
    saleTypeFilter() {
      let saleTypeFilter = {}
      for (const key in this.filters) {
        if (this.filters[key] && this.filters[key].key === 'sale_type') {
          saleTypeFilter = this.filters[key]
        }
      }
      return saleTypeFilter
    },
    rushFilter() {
      let rushFilter = {}
      for (const key in this.filters) {
        if (this.filters[key] && this.filters[key].key === 'rush') {
          rushFilter = this.filters[key]
        }
      }
      return rushFilter
    },
    sizeFilter() {
      let sizeFilter = {}
      for (const key in this.filters) {
        if (this.filters[key] && this.filters[key].key === 'stock_size') {
          sizeFilter = this.filters[key]
        }
      }
      return sizeFilter
    },
    onSaleValue() {
      // 由于sale_type是多选项，onsale的开关filter，根据sale_type的values值选中情况判断，选中时：相当于只选中了sales_&_offers，没选中时，相当于全部选中或者全部没选
      const onSaleValue = []
      if (this.saleTypeFilter.selected) {
        const values = this.saleTypeFilter.values || {}
        for (const key in values) {
          if (values[key] && values[key].selected) {
            onSaleValue.push(values[key].key)
          }
        }
      }
      // 只有当值只为 sales_&_offers 表示 onsale打开
      return onSaleValue.length === 1 && onSaleValue[0] == 'sales_&_offers'
    },
    rushValue() {
      // 这里的switch的开关值跟普通意义上的不一样 ： 产品要求，选中时：相当于选了 yes，没选中时，相当于没选（而不是相当于选了No）
      // 由于 rush 的filter，values返回的是 yes on 的对象，所以这里根据选中结果判断
      let rushValue = false
      if (this.rushFilter.selected) {
        const values = this.rushFilter.values || {}
        for (const key in values) {
          if (values[key] && values[key].selected) {
            rushValue = values[key].key === 'yes'
          }
        }
      }
      return rushValue
    }
  },
  created() {
    this.ssFilterBodyFlag = this.filtersOpen.includes('stock_size')
  },
  methods: {
    getBiParamsSwitchFilter(ec, el) {
      return {
        ec,
        el,
        msg: JSON.stringify({
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName || this.catName,
          dress_type: this.dressType
        })
      }
    },
    ssFilterBodyShowEvent() {
      const arr = JSON.parse(JSON.stringify(this.filtersOpen))
      if (this.ssFilterBodyFlag) {
        const index = arr.indexOf('stock_size')
        if (index > -1) {
          arr.splice(index, 1)
        }
      } else {
        arr.push('stock_size')
      }
      this.$store.commit('list/setFiltersOpen', arr)
      this.ssFilterBodyFlag = !this.ssFilterBodyFlag
    },
    onSaleChange(bol) {
      // 由于 sale-type 是多选项，链接中可能存在多个值，所以需要手动处理url
      // 注意，每个国家对应的sale-type的链接都是不一样的,比如 /sale-type-ca/ /sale-type-de/。 这里是为了兼容老链接，要去掉老连接里面的带国家站的链接，新的链接直接使用/sale-type/
      let resUrl = this.$route.path
      let saleTypeBaseUrlCountry = '/sale-type/'
      for (const key in this.filters) {
        if (this.filters[key] && this.filters[key].key === 'sale_type') {
          saleTypeBaseUrlCountry = `/${key.replace(/_/g, '-')}/`
        }
      }
      let salesOffersItem = {}
      if (this.saleTypeFilter && this.saleTypeFilter.values) {
        const values = Object.values(this.saleTypeFilter.values)
        salesOffersItem = values.filter((item) => {
          return item.key === 'sales_&_offers'
        })
      }
      if (bol) {
        let saleTypeUrl = `/sale-type/${salesOffersItem[0].value}`
        if (!resUrl.includes('/with/') && !resUrl.includes('/sale-type/')) {
          saleTypeUrl = '/with' + saleTypeUrl
          resUrl = resUrl + saleTypeUrl
        } else if (resUrl.includes('/sale-type/') || resUrl.includes(saleTypeBaseUrlCountry)) {
          if (resUrl.includes(saleTypeBaseUrlCountry)) {
            // 去掉原链接上携带的带有国家属性的/sale-type/，比如 /sale-type-ca/
            const url0 = resUrl.split(saleTypeBaseUrlCountry)[0]
            const url1 = resUrl.split(saleTypeBaseUrlCountry)[1]
            const urlArr = url1.split('/')
            urlArr.shift()
            resUrl = url0
            if (urlArr.length > 0) {
              resUrl = resUrl + '/' + urlArr.join('/')
            }
          }
          if (resUrl.includes('/sale-type/')) {
            // 再去掉链接中的 /sale-type/
            const url0 = resUrl.split('/sale-type/')[0]
            const url1 = resUrl.split('/sale-type/')[1]
            const urlArr = url1.split('/')
            urlArr.shift() // 去掉之前/sale-type/拼接的参数
            resUrl = url0
            if (urlArr.length > 0) {
              resUrl = url0 + '/' + urlArr.join('/')
            }
          }
          resUrl = resUrl + saleTypeUrl // 拼接上新的属性
        } else {
          resUrl = resUrl + saleTypeUrl
        }
      } else {
        // 取消的时候取消链接中的/sale-type/所有的参数
        // eslint-disable-next-line
        if (resUrl.includes(saleTypeBaseUrlCountry)) {
          // 去掉原链接上携带的带有国家属性的/sale-type/，比如 /sale-type-ca/
          const url0 = resUrl.split(saleTypeBaseUrlCountry)[0]
          const url1 = resUrl.split(saleTypeBaseUrlCountry)[1]
          const urlArr = url1.split('/')
          urlArr.shift()
          resUrl = url0
          if (urlArr.length > 0) {
            resUrl = resUrl + '/' + urlArr.join('/')
          }
        }
        if (resUrl.includes('/sale-type/')) {
          const url0 = resUrl.split('/sale-type/')[0]
          const url1 = resUrl.split('/sale-type/')[1]
          const urlArr = url1.split('/')
          urlArr.shift() // 去掉之前/sale-type/拼接的参数
          resUrl = url0
          if (urlArr.length > 0) {
            resUrl = resUrl + '/' + urlArr.join('/')
          }
        }
        if (resUrl.endsWith('/with')) {
          resUrl = resUrl.replace('/with', '')
        }
      }
      // 拼接上query参数，page需要去掉
      let queryStr = ''
      const queryKey = Object.keys(this.$route.query)
      queryKey.forEach((qKey, qIndex) => {
        if (qKey === 'page') {
          return false
        }
        if (qIndex) {
          queryStr += '&'
        } else {
          queryStr += '?'
        }
        queryStr += `${qKey}=${this.$route.query[qKey]}`
      })
      resUrl = queryStr ? resUrl + queryStr : resUrl
      this.filterSelectOption(this.saleTypeFilter.key, 'sales_&_offers', resUrl)
    },
    onRushChange(bol) {
      // rush 为 yes的时候， supportStockSales 需要设置为0
      this.setPoint('filter', bol ? 'RushOn' : 'RushOff', 'click', {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      })
      if (bol) {
        this.$store.commit('list/setSupportStockSales', 0)
        this.filterSelectOption(this.rushFilter.key, 'yes')
      } else {
        // 取消选中yes
        this.filterSelectOption(this.rushFilter.key, 'yes')
      }
    },
    onShipInChange(bol) {
      this.setPoint('filter', bol ? 'Shipin48hrsOn' : 'Shipin48hrsOff', 'click', {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      })
      if (bol && !this.ssFilterBodyFlag) {
        // 默认展开
        this.ssFilterBodyShowEvent()
      }
      this.$emit('handleNormalStockChange', bol ? 1 : 0)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-extra {
  padding: 20px 0;
  box-shadow: 0 1px 0 var(--color-eeeeee);
  .filter-item {
    margin-top: 10px;
    &.available-sizes-filter {
      margin-top: 15px;
    }
    &:first-child {
      margin-top: 0;
    }
    &.switch-filter-item {
      text-transform: uppercase;
      font-size: 13px;
      line-height: 18px;
      font-family: @font-family-600;
      color: var(--color-121212);
    }
    .expanded {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: @font-family-600, sans-serif;
      font-size: 13px;
      line-height: 18px;
      text-transform: uppercase;
      color: var(--color-121212);
      cursor: pointer;
      .expanded-title {
        :not(:first-child) {
          margin-left: 3px;
        }
      }
      .filter-title-delete,
      .filter-title-add {
        width: 10px;
        height: 10px;
        margin-right: 20px;
        color: #666;
        vertical-align: middle;
        fill: currentColor;
        overflow: hidden;
      }
    }
  }
}
</style>
