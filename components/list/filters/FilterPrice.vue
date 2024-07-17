<template>
  <div class="filter-body filter-price">
    <div v-if="!isCheckboxPriceFilter" class="price-box">
      <!-- 欧元货币符号在后面 -->
      <div class="price-label left-label">
        <template v-if="currencyCode == 'EUR'">{{ value[0] }}{{ currencySymbol }}</template>
        <template v-else>{{ currencySymbol }}{{ value[0] }}</template>
      </div>
      <div class="price">
        <vue-slider
          v-model="value"
          :dotSize="10"
          :min="info.min"
          :max="info.max"
          :contained="true"
          :drag-on-click="!sliderDisabled && true"
          :process="process"
          :tooltip="'none'"
          :disabled="sliderDisabled"
          @drag-end="sliderDragEnd"
        />
      </div>
      <div class="price-label">
        <template v-if="currencyCode == 'EUR'">{{ value[1] }}{{ currencySymbol }}</template>
        <template v-else>{{ currencySymbol }}{{ value[1] }}</template>
      </div>
    </div>
    <template v-else>
      <!-- jira:16399  wgd 要求价格加on sale筛选项，与下面的价格选择共存. search 也需要-->
      <div v-if="hasOnSaleFilter" class="simple-filters-item">
        <filter-checkbox
          :selected="onSale.selected"
          :info="{ ...onSale, parentKey: info.parentKey, multi: jsKey == 'search' ? false : true }"
          v-track.view.click="{ common: getBiParamsWithItem(onSale) }"
          :hasNumber="false"
          @click="clickOnSale(onSale)"
        ></filter-checkbox>
      </div>
      <template v-for="item in info.values">
        <div :key="item.key" class="simple-filters-item">
          <!-- v-show="!(info.parentFold && item.fold)" -->
          <filter-checkbox
            :selected="item.selected"
            :info="{ ...item, parentKey: info.parentKey, multi: jsKey == 'search' ? false : true }"
            v-track.view.click="{ common: getBiParamsWithItem(item) }"
            :hasNumber="false"
            @click="clickFilter(item)"
          ></filter-checkbox>
        </div>
      </template>
      <div v-if="hasPriceInputFilter" class="cat-id-3">
        <section :class="['cat-id-3-price-box', currencyCode, { 'min-not-empty': minPrice }]">
          <label for="minPrice">{{ currencySymbol }}</label>
          <input
            id="minPrice"
            v-model="minPrice"
            oninput="value=value.replace(/^[^0-9]*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
            onkeyup="value=value.replace(/^[^0-9]*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
            name="minPrice"
          />
        </section>
        <span class="cat-id-3-text">{{ nl('page_common_to') }}</span>
        <section :class="['cat-id-3-price-box', currencyCode, { 'max-not-empty': maxPrice }]">
          <label for="maxPrice">{{ currencySymbol }}</label>
          <input
            id="maxPrice"
            v-model="maxPrice"
            oninput="value=value.replace(/^[^0-9]*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
            onkeyup="value=value.replace(/^[^0-9]*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
            name="maxPrice"
          />
        </section>
        <div @click="prichHandleChange" class="cat-id-3-text apply">{{ nl('page_checkout_apply') }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import filtersMixins from '@/assets/js/filters'
import FilterCheckbox from '@/components/list/filters/FilterCheckbox'
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'
export default {
  name: 'FilterPrice',
  languageKeys: ['page_common_to', 'page_checkout_apply'],
  components: {
    VueSlider,
    FilterCheckbox
  },
  mixins: [filtersMixins],
  props: {
    originInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      process: (dotsPos) => [[dotsPos[0], dotsPos[1], { backgroundColor: !this.isBridal ? 'var(--color-121212)' : 'var(--color-121212)' }]],
      timer: null,
      value: [],
      sliderDisabled: false,
      minPrice: '',
      maxPrice: '',
      info: {}
    }
  },
  watch: {
    info: {
      handler(newVal) {
        let res = [0, 0]
        // const reg = /[price|pricecadca|priceaudau|pricegbpgb|priceeurfr|pricemxnmx|priceeurde|priceeures|priceeurit](\d+)-(\d+)/.exec(
        //     this.priceRange || ''
        // )
        // if (reg && reg.length) {
        //   res = [reg[1] * 1, reg[2] * 1]
        // }
        res = this.priceRange
          .replace(/[A-Za-z]/g, '')
          .split('-')
          .map((price) => {
            return Number(price.trim())
          })

        if (res[0] < this.info.min || !res[0]) {
          res[0] = this.info.min
        }
        if (res[1] > this.info.max || !res[1]) {
          res[1] = this.info.max
        }
        if (this.info.min === this.info.max) {
          res = [this.info.min, this.info.min]
        }
        this.value = res
        if (res[0] === res[1] && res[1] === 0) {
          this.sliderDisabled = true
        } else {
          this.sliderDisabled = false
        }
      },
      deep: true
    },
    originInfo: {
      handler(val) {
        this.info = JSON.parse(JSON.stringify(this.originInfo))
        this.hasPriceInputFilter && this.asyncPriceInfo()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    sliderDragEnd() {
      const price = this.currencySymbol + this.value[0] + '_' + this.currencySymbol + this.value[1]
      const msg = {
        cat_name: this.seoCatName,
        cat_id: this.catId,
        dress_type: this.dressType
      }
      this.buryPoint(this, 'event', {
        ec: 'filter',
        el: 'filter',
        ea: 'click',
        msg: JSON.stringify(msg)
      })
      this.buryPoint(this, 'event', {
        ec: 'filter',
        el: this.catBiName + '_filter',
        ea: 'click',
        msg: JSON.stringify({ ...msg, name: price })
      })
      if (this.sliderDisabled) return false
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.changePriceFilters(this.value, this.info)
      }, 500)
      switch (this.dressType) {
        case 'bridesmaids':
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'BridesmaidsListPageA_FilterPrice_Click'
          })
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'BridesmaidsListPageA__Filters_Click'
          })
          break
        case 'brides':
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'BridesListPageA_FilterPrice_Click'
          })
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'BridesListPageA_Filters_Click'
          })
          break
        case 'mbd':
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'MOBListPageA_FilterPrice_Click'
          })
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'MOBListPageA_Filters_Click'
          })
          break
        case 'special_occasion':
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'SODListPageA_FilterPrice_Click'
          })
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'SODListPageA_Filters_Click'
          })
          break
        case 'accessories':
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'ACCListPageA_FilterPrice_Click'
          })
          this.setDataLayer({
            category: 'PC_ListpageRevision',
            action: 'click',
            label: 'ACCListPageA_Filters_Click'
          })
          break
        case 'dress':
          if (this.catId && this.catId == 9) {
            this.setDataLayer({
              category: 'PC_ListpageRevision',
              action: 'click',
              label: 'JBDListPageA_FilterPrice_Click'
            })
            this.setDataLayer({
              category: 'PC_ListpageRevision',
              action: 'click',
              label: 'JBDListPageA_Filters_Click'
            })
          } else if (this.catId && this.catId == 10) {
            this.setDataLayer({
              category: 'PC_ListpageRevision',
              action: 'click',
              label: 'FGListPageA_FilterPrice_Click'
            })
            this.setDataLayer({
              category: 'PC_ListpageRevision',
              action: 'click',
              label: 'FGListPageA_Filters_Click'
            })
          }
          break
      }
    },
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, this.info, null)
    },
    clickFilter(item) {
      if (this.$route.name === 'search') {
        this.$store.commit('list/setPriceRange', '')
      }
      this.clearMinMaxPrice()
      this.filterSelectOption(this.info.key, item.key)
      return false

      // 原来的列表页的逻辑有问题，这里统一改一下。
      // comments: 点击价格选项清空输入价格内容
      // this.clearMinMaxPrice()
      // // comments: 如果选中再次点击反选
      // if (item.selected) {
      //   this.toNewPath({
      //     path: item.url,
      //     query: this.$route.query
      //   })
      //   return false
      // }
      // this.$set(item, 'selected', true)
      // const values = item.value
      //   .replace(/[A-Za-z]/g, '')
      //   .split('-')
      //   .map((price) => {
      //     return Number(price.trim())
      //   })
      // this.changePriceFilters(values, this.info)
    },
    prichHandleChange() {
      // const tempValues = this.info.values || {}
      // for (const key in tempValues) {
      //   this.$set(tempValues[key], 'selected', false)
      // }
      // 清空 price的选项,优化： 之前的方法不会更改到原数据，
      this.clearFilters(this.info.key)

      if (this.minPrice == '') {
        this.minPrice = 0
      }
      if (this.maxPrice == '') {
        this.maxPrice = this.info.max || 999999
      }
      if (Number(this.minPrice) > Number(this.maxPrice)) {
        const [minPrice, maxPrice] = [this.maxPrice, this.minPrice]
        this.minPrice = minPrice
        this.maxPrice = maxPrice
      }
      const values = [this.minPrice, this.maxPrice]
      this.changePriceFilters(values, this.info, 'apply')
    },
    clearMinMaxPrice() {
      this.minPrice = ''
      this.maxPrice = ''
    },
    // comments: 同步价格信息
    asyncPriceInfo() {
      this.clearMinMaxPrice()
      if (Object.keys(this.info.values).length === 0) return
      let flag = true
      let apiFilterPrice = null
      const tempKey = this.info.key
      if (this.$store.state.list.apiFilters[tempKey]) {
        // search 的 入参是 字符串用，拼接.
        if (this.$route.name === 'search') {
          const apiFilterPriceArr = (this.priceRange && this.$store.state.list.apiFilters[tempKey].split(',')) || []
          apiFilterPrice = apiFilterPriceArr[0] || ''
        } else {
          apiFilterPrice = this.$store.state.list.apiFilters[tempKey][0] || ''
        }
        const tempValues = this.info.values || {}
        for (const key in tempValues) {
          if (tempValues[key].selected) {
            flag = false
            break
          }
        }
      }
      if (flag && apiFilterPrice) {
        const value = JSON.parse(JSON.stringify(apiFilterPrice))
          .replace(/[A-Za-z]/g, '')
          .split('-')
        this.minPrice = value[0] || ''
        this.maxPrice = value[1] || ''
      }
    },
    clickOnSale(item) {
      if (this.$route.name === 'search') {
        this.$store.commit('list/setOnSale', !item.selected)
        this.handleSearchFilterResult()
      } else {
        const query = { ...this.$route.query }
        const route = this.$route
        this.$store.commit('list/setOnSale', !item.selected)
        // fresh_deals=yes
        if (item.selected) {
          query.os = 1
        } else {
          delete query.os
        }
        this.$router.push({ path: route.path, query })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filter-body {
  max-width: 270px;
  padding-top: 10px;
  color: var(--color-121212);
  line-height: 2;
  border: 0;
  .price-box {
    display: flex;
    align-items: center;
    height: 30px;
    .price-label {
      font-family: @font-family-500, sans-serif;
      font-size: 13px;
      color: #666;
      line-height: 30px;
      margin-left: 5px;
      &.left-label {
        text-align: right;
        margin-left: 0;
        margin-right: 5px;
      }
    }
    .price {
      flex: auto;
      /deep/ .vue-slider {
        padding: 0 10px !important;
      }
    }
  }
  .cat-id-3 {
    max-width: 290px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    .cat-id-3-price-box {
      max-width: 80px;
      height: 35px;
      position: relative;
      border: 1px solid #ccc;
      padding: 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      label {
        transition: all 0.25s ease;
      }
      input {
        width: 100%;
        padding: 0;
        box-sizing: border-box;
        border: none;
        margin-left: 2px;
      }
      /* chrome */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      /* 火狐浏览器 */
      input[type='number'] {
        -moz-appearance: textfield;
      }
      &:focus-within {
        label {
          transform: translateX(-2px);
        }
      }
      &.max-not-empty,
      &.min-not-empty {
        label {
          transform: translateX(-2px);
        }
      }
      &.EUR {
        flex-direction: row-reverse;
        input {
          margin-left: 0;
          margin-right: 2px;
        }
        &:focus-within {
          label {
            transform: translateX(2px);
          }
        }
        &.max-not-empty,
        &.min-not-empty {
          label {
            transform: translateX(2px);
          }
        }
      }
    }
    .cat-id-3-text {
      padding: 0 10px;
      font-family: @font-family-500;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      text-transform: lowercase;
      &.apply {
        text-transform: uppercase;
        padding-right: 0;
        border: none;
        cursor: pointer;
      }
    }
  }
  .simple-filters-item:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
