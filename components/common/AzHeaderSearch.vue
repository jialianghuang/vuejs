<template>
  <div :class="{ 'is-support': isSupport }" class="az-header-search" style="opacity: 1 !important;visibility: visible !important;">
    <form id="azheadersearch" :action="countryUrl('/search')" onsubmit="return false" method="get" class="header-search">
      <label>
        <span style="display: none">{{ nl('page_common_search') }}</span>
        <input ref="fromType" :value="fromType" type="hidden" name="from_type" />
        <input
          ref="searchInput"
          :value="queryString"
          :placeholder="isBridal ? nl('page_placeholder_search') : nl('page_placeholder_search_new')"
          @focus="searchFocus"
          @click.stop="searchClick"
          @input="searchInput"
          type="text"
          name="q"
          class="input_text"
          autocomplete="off"
        />
        <template v-if="tagValue">
          <input v-show="false" v-model="tagValue" name="sourceTag" type="text" />
        </template>
        <input v-if="isBridal" v-show="false" value="bridal" type="text" name="subsite" autocomplete="off" />
      </label>
      <button @click="searchBtnClick(null, 'go')" class="search" aria-label="search" type="submit">
        <az-icon icon-class="icon-search1" class="search"></az-icon>
      </button>
      <ul v-if="showProductListView" :class="{ 'search-reminder-position-right': position == 'right' }" class="search-reminder">
        <template v-if="goodsListLoading || (goodsObject.goodsList && goodsObject.goodsList.length)">
          <div class="search-reminder-left">
            <li class="search-title">{{ goodsListLoading ? nl('page_suggest_related_products_title') : goodsObject.title }}</li>

            <div class="out-box">
              <template v-if="goodsListLoading">
                <div v-for="skeleton in 3" :key="`search-product-skeleton-${skeleton}`" class="search-product-skeleton search-product">
                  <div class="product-img-skeleton"></div>
                  <div class="product-name-skeleton"></div>
                  <div class="product-color-skeleton"></div>
                </div>
              </template>
              <template v-if="goodsObject.goodsList && goodsObject.goodsList.length">
                <div
                  v-for="(good, index) in goodsObject.goodsList"
                  :key="good.goodsId"
                  :data-goods-id="good.goodsId"
                  :data-product-kind="goodsObject.kind"
                  @click.stop="searchGoodClick(good, goodsObject.kind)"
                  class="search-product"
                >
                  <a
                    :href="
                      navToGoodsDetail(
                        setSeatchSource(good.goodsUrl, goodsObject.kind == 1 ? 'search_popular_products' : 'search_related_products'),
                        good,
                        'others'
                      )
                    "
                  >
                    <img
                      :src="addWebpSuffix(good.goodsThumb ? `${PIC_PATH}m179/${good.goodsThumb}` : good.imgUrl)"
                      v-track.click="{
                        click: getGAItemListParams(good, index, 'imgClick', itemListName)
                      }"
                      alt="product"
                      class="product-image"
                    />
                    <div
                      v-track.click="{
                        click: getGAItemListParams(good, index, 'titleClick', itemListName)
                      }"
                    >
                      <div class="product-name">
                        {{ good.shownGoodsName ? good.shownGoodsName : good.goodsName }}
                      </div>
                      <template v-if="good.isNew && good.isNew == 1">
                        <div class="new-no-rating">{{ nl('page_common_new_capital') }}!</div>
                      </template>
                      <template v-else-if="good.comments && good.comments.rating && good.comments.rating.value > 0">
                        <div rel="nofollow" class="show_rating">
                          <az-rate :value="good.comments.rating.value * 1" :readonly="true"></az-rate>
                        </div>
                      </template>
                      <template v-else>
                        <div class="new-no-rating">{{ nl('page_search_recommended') }}</div>
                      </template>
                      <div class="product-color">{{ good.shownColor }}</div>
                      <template v-if="good.noDealPriceDisplay && good.shopPriceDisplay !== good.noDealPriceDisplay">
                        <p class="good_price">{{ good.shopPriceDisplay }}</p>
                        <p class="goods_no_deal_price">{{ good.noDealPriceDisplay }}</p>
                      </template>
                      <template v-else>
                        <div class="product-price">{{ good.shopPriceDisplay }}</div>
                      </template>
                    </div>
                  </a>
                </div>
              </template>
            </div>
          </div>
          <div class="search-reminder-separator"></div>
        </template>
        <div v-if="wordsLoading" class="search-reminder-right">
          <li v-for="skeleton in 10" :key="`search-item-skeleton—${skeleton}`" class="search-item-skeleton"></li>
        </div>
        <div v-else class="search-reminder-right">
          <template v-if="compsList.length">
            <li
              v-for="(compsItem, index) in compsList"
              :key="'s' + index"
              @mouseenter="handleMouseenter(compsItem.text)"
              @mouseleave="handleMouseleave"
              @click="searchResultClick({ text: compsItem.textMore.source, link: compsItem.textMore.url }, 'suggestions')"
              :style="{ 'margin-bottom': index == compsList.length - 1 && compsList.length < 10 ? '20px' : '0' }"
              class="suggestions search-item"
              tabindex="0"
            >
              <span class="word_box">
                <span class="reminder-search-keyword suggestions-search-keyword">
                  <span v-html="compsItem.textMore.hit" class="li-search-hit-word"></span>
                  <span v-if="compsItem.textMore.more" v-html="compsItem.textMore.more" class="text-more"></span>
                </span>
                <span v-if="compsItem.searchCount" class="li-search-hot-num">{{ compsItem.searchCount }}</span>
              </span>
              <!-- 用来占位的，让文案宽度正常 -->
              <div style="line-height: 0;height: 0;opacity:0;margin-top: -30px;">
                <span v-html="compsItem.text"></span>
              </div>
            </li>
          </template>
          <template v-if="recnetSearchBoxShow">
            <li class="search-title recent-searches-title">
              {{ nl('page_search_recent_searches') }}
              <svg @click.stop="deleteRecentSearches" tabindex="0" role="button" class="icon icon-remove">
                <use xlink:href="#remove"></use>
              </svg>
            </li>
            <li
              v-for="(item, index) in recentSearch"
              :key="item"
              @mouseenter="handleMouseenter(item)"
              @mouseleave="handleMouseleave"
              @click="searchResultClick({ text: item }, 'recent-searches')"
              :style="{ 'margin-bottom': index == recentSearch.length - 1 ? '20px' : '0' }"
              class="recent-searches search-item"
              tabindex="0"
            >
              <span class="word_box"
                ><span class="reminder-search-keyword">{{ item }}</span></span
              >
            </li>
          </template>
          <template v-if="popularListMinusSearch.length">
            <li class="search-title">{{ nl('page_search_popular_keyword') }}</li>
            <li
              v-for="(popularItem, index) in popularListMinusSearch"
              :key="index"
              @mouseenter="handleMouseenter(popularItem.keyword)"
              @mouseleave="handleMouseleave"
              @click="searchResultClick({ text: popularItem.keyword, link: popularItem.link }, 'popular-keywords')"
              :class="{
                is_high_light: popularItem.isHighLight,
                is_flash_sale: popularItem.isFlashSale
              }"
              tabindex="0"
              class="popular-keywords search-item"
            >
              <span class="word_box">
                <span class="reminder-search-keyword">{{ popularItem.keyword }}</span>
                <span v-if="popularItem.searchCount" class="li-search-hot-num">{{ popularItem.searchCount }}</span>
              </span>
            </li>
          </template>
        </div>
      </ul>
      <div v-if="showProductEmptyView" :class="{ 'search-suggester-position-right': position == 'right' }" class="search-suggester">
        <p class="p-keyword-search-suggester">
          {{ nl('page_search_empty_title') }}
        </p>
        <p class="p-keyword-search">{{ lastQueryString.length > 50 ? `${lastQueryString.slice(0, 50)}...` : lastQueryString }}</p>
        <p class="p-keyword-looking-for">{{ lookingKey }}</p>
        <ul class="search-looking-for">
          <li v-for="item in suggestion" :key="item" class="search-suggestion-item">
            <span @click="suggestionWordClick(item)" class="search-suggestion-word">{{ item }}</span>
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import AzRate from '@/components/az-ui/Rate/AzRate'
import { mapState } from 'vuex'
import { getUrlQueryNoPage } from '@/assets/js/utils'

export default {
  name: 'AzHeaderSearch',
  languageKeys: [
    'page_common_search',
    'page_placeholder_search',
    'page_placeholder_search_new',
    'page_common_suggestions',
    'page_search_recent_searches',
    'page_search_popular_keyword',
    'page_suggest_popular_products_title',
    'page_search_recommended',
    'page_search_empty_title',
    'page_suggest_related_products_title'
  ],
  components: {
    AzRate
  },
  props: {
    position: {
      type: String,
      default: 'left'
    },
    focus: {
      type: Boolean,
      default: false
    },
    isSupport: {
      // support页面不显示联想搜索
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 打点时发现会触发两次handlersearch
      debounceId: 0,
      // 存储上次查询
      lastQueryString: '',
      // 已完成的打点
      finishedQuery: null,
      // 首次及隐藏后强制打点
      forceBiWhenSearchHide: true,
      searchSelectFlag: false,
      queryString: '',
      reminderSkeleton: false,
      reminderShow: false,
      suggesterShow: false,
      searchBarClickAt: 0,
      searchindex: 0,
      // timer: null,
      popularWordsOK: false,
      popularWords: [],
      popularProducts: [],
      searchCache: {},
      searchGoodsCache: {},
      suggestion: [],
      lookingKey: '',
      popularList: [],
      compsList: [],
      goodsObject: {},
      recentSearch: [],
      recentSearchUser: '',
      recnetSearchBoxAllowShow: false,
      recentViewDataLayerFlag: false,
      maxrecentSearchShowNum: 4,
      maxrecentSearchNum: 10,
      maxListShowNum: 7, // recenSearch存在时，recenSearch和popular最大数量
      fpValue: '', // fromPageValue，记录当前搜索所属页面
      tagValue: '', // 如果搜索操作页面url存在sourcetag，带入搜索结果页
      goodsListLoading: false, // 商品模块的loading态，只会在第一次的时候出现
      wordsLoading: false, // 右侧推荐词模块的loading态，只会在第一次的时候出现
      fromType: '',
      tempQueryString: ''
    }
  },
  computed: {
    ...mapState({
      searchInfo: (state) => state.list.searchInfo
    }),
    recnetSearchBoxShow() {
      return this.recnetSearchBoxAllowShow && this.recentSearch.length
    },
    // 未输入文字，去除recentSearch长度
    popularListMinusSearch() {
      // if (this.queryString || !this.recentSearch.length || !this.popularList || !this.popularList.length) return this.popularList
      // return this.popularList.slice(0, this.maxListShowNum - this.recentSearch.length)
      return this.recnetSearchBoxShow ? this.popularList.slice(0, this.maxListShowNum - this.recentSearch.length) : this.popularList
    },
    showProductListView() {
      // searchSelectFlag为true   并且  （左侧商品loading态&&右侧单词loading态  ||  左侧有单词展示 ） 都要展示浮窗
      return (
        this.searchSelectFlag &&
        ((this.goodsListLoading && this.wordsLoading) ||
          this.compsList.length ||
          this.popularListMinusSearch.length ||
          (this.recnetSearchBoxShow && this.recentSearch.length))
      )
    },
    showProductEmptyView() {
      return this.searchSelectFlag && this.suggesterShow
    },
    itemListName() {
      let itemListName = ''
      if (this.goodsObject.kind === 1) {
        itemListName = 'popular product list'
      } else if (this.goodsObject.kind === 2) {
        itemListName = 'related products list'
      } else {
        itemListName = `${this.goodsObject.title} list`
      }
      return itemListName
    }
  },
  watch: {
    searchSelectFlag(nval) {
      if (!nval) {
        this.recentViewDataLayerFlag = false
      } else {
        this.recentSearchesViewDot()
      }
    },
    recnetSearchBoxShow(nval) {
      if (nval) this.recentSearchesViewDot()
    },
    isLogin(nval) {
      if (nval) this.getRecentSearches()
    }
  },
  created() {
    this.queryString = decodeURIComponent(this.searchInfo.q)
    if (!(!['sample', 'clearance', 'outlet'].includes(this.searchInfo.dress_type) && this.searchInfo.q && this.$route.name == 'search')) {
      this.queryString = ''
    }
  },
  mounted() {
    if (this.focus) {
      this.$refs.searchInput.focus()
      this.searchClick()
    }
    document.documentElement.addEventListener('click', () => {
      this.searchSelectFlag = false
      this.forceBiWhenSearchHide = true
    })
    this.getRecentSearches()
    // 页面名称加上分类id，用来区分哪个分类的哪个页面
    // this.fpValue = this.$route.name + this.catId
    let catId = this.catId
    if (!this.isSpecialCatId(catId)) {
      if (this.catIds.includes(3)) {
        catId = 3
      } else if (this.catIds.includes(3110)) {
        catId = 3110
      }
    }
    this.tagValue = this.getSourceTag({ catId })
  },
  methods: {
    setBiView(queryString) {
      if (this.finishedQuery == (this.queryString || '') && !this.forceBiWhenSearchHide) return
      const biArr = []
      if (this.showProductListView) {
        if (this.recnetSearchBoxShow) {
          ;(this.recentSearch || []).forEach((item) => {
            biArr.push({ el: 'recently searches', msg: { q: item } })
          })
        }
        if (this.popularListMinusSearch && this.popularListMinusSearch.length) {
          this.popularListMinusSearch.forEach((item) => {
            if (!(item && item.keyword)) return
            biArr.push({ el: 'popular keywords', msg: { q: item.keyword } })
          })
        }
        if (this.compsList && this.compsList.length) {
          this.compsList.forEach((item) => {
            const msg = item && (item.text || (item.textMore && item.textMore.html))
            if (!msg) return
            biArr.push({ el: 'suggestions', msg: { q: msg } })
            // #17082: 产品要新加的打点
            biArr.push({ el: 'suggestion', msg: { q: queryString, sg_key: item.text } })
          })
        }
      }
      if (this.showProductEmptyView) {
        biArr.push({ el: 'noresultpopup' })
      }
      if (biArr.length) {
        this.buryPoint(
          this,
          'events',
          biArr.map((item) => {
            const p = {
              ec: 'search',
              ea: 'view',
              ...item
            }
            if (p.msg) p.msg = JSON.stringify(p.msg)
            return p
          })
        )
        this.finishedQuery = queryString
        this.forceBiWhenSearchHide = false
      }
    },
    setGoodsBiView(queryString) {
      const biArr = []
      if (this.showProductListView) {
        if (this.goodsObject && this.goodsObject.goodsList && this.goodsObject.goodsList.length) {
          let type
          if (this.goodsObject.kind === 1) type = 'popular products'
          else if (this.goodsObject.kind === 2) type = 'related products'
          this.goodsObject.goodsList.forEach((item) => {
            const msg = item.shownGoodsName ? item.shownGoodsName : item.goodsName
            if (!msg) return
            biArr.push({ el: type, msg: { name: msg } })
          })
        }
      }
      if (biArr.length) {
        this.buryPoint(
          this,
          'events',
          biArr.map((item) => {
            const p = {
              ec: 'search',
              ea: 'view',
              ...item
            }
            if (p.msg) p.msg = JSON.stringify(p.msg)
            return p
          })
        )
      }
    },
    setBiAnalysisClick(el, msg) {
      if (typeof el === 'string') {
        const params = {
          ec: 'search',
          el,
          ea: 'click'
        }
        if (msg) {
          params.msg = JSON.stringify(msg)
        }
        this.buryPoint(this, 'event', params)
      } else if (Array.isArray(el) && el.length) {
        this.buryPoint(
          this,
          'events',
          el.map((item) => {
            const params = {
              ec: 'search',
              el: item.el,
              ea: 'click'
            }
            if (item.msg) {
              params.msg = JSON.stringify(item.msg)
            }
            return params
          })
        )
      }
    },
    // SearchRecent-view打点 埋点每次弹出 只打点一次
    recentSearchesViewDot() {
      if (!this.searchSelectFlag || this.recentViewDataLayerFlag || !this.recnetSearchBoxShow || !this.recentSearch.length) return
      this.recentViewDataLayerFlag = true
      this.setDataLayer({
        action: 'click',
        category: 'SearchRecent',
        label: 'SearchRecent_Recent_View'
      })
    },
    // 获取RecentSearches
    getRecentSearches() {
      const searchStr = this.$localStorage.getLocalStorage('recentSearches')
      const searchStrData = searchStr ? JSON.parse(searchStr) : { userInfo: '' }
      // 未登录 用户相同
      const lastName = this.deCode(searchStrData.userInfo)
      const recentSearch =
        !this.isLogin || searchStrData.userInfo === '' || (this.isLogin && lastName === this.userInfoEmail)
          ? searchStrData.recentSearch || []
          : []
      this.recentSearch =
        recentSearch.length > this.maxrecentSearchShowNum ? recentSearch.slice(0, this.maxrecentSearchShowNum) : recentSearch
      this.recentSearchUser = this.isLogin ? this.userInfoEmail : lastName || ''
    },
    deleteRecentSearches() {
      this.recentSearch = []
      localStorage.removeItem('recentSearches')
      this.setBiAnalysisClick('recently searches')
    },
    // 更新搜索内容 有账户时
    updateRecentSearches(msg) {
      if (!msg) return
      const recentSearch = [...this.recentSearch]
      const recentSearchLow = this.recentSearch.map((item) => item.toLocaleLowerCase())
      const index = recentSearchLow.indexOf(msg.toLocaleLowerCase())
      if (index !== -1) {
        recentSearch.splice(index, 1)
      }
      recentSearch.unshift(msg)
      recentSearch.length = recentSearch.length > this.maxrecentSearchShowNum ? this.maxrecentSearchShowNum : recentSearch.length
      this.recentSearch = recentSearch
      this.$localStorage.setLocalStorage(
        'recentSearches',
        JSON.stringify({
          recentSearch,
          userInfo: this.enCode(this.recentSearchUser)
        })
      )
    },
    enCode(msg) {
      return encodeURIComponent([...msg].map((item) => String.fromCharCode(item.charCodeAt() + 2)).join(''))
    },
    deCode(msg) {
      return [...decodeURIComponent(msg)].map((item) => String.fromCharCode(item.charCodeAt() - 2)).join('')
    },
    searchFocus() {
      this.searchSelectFlag = true
      this.$emit('focusEvent')
      this.handleSearch()
    },
    searchClick() {
      this.searchSelectFlag = true
      this.handleSearch()
      this.searchBarClickAt = new Date().getTime()
      this.setDataLayer({
        action: 'click',
        category: 'SearchBarClick',
        label: 'SearchBar_Box_Click'
      })
      this.setBiAnalysisClick('bar')
    },
    searchInput(event) {
      this.searchSelectFlag = true
      this.queryString = event.target.value
      this.handleSearch()
    },
    searchBtnClick(url, source) {
      // 没有搜索内容，不搜索
      if (!this.queryString.trim()) return
      this.setDataLayer({
        action: 'click',
        category: 'SearchButton_Click',
        label: 'SearchButton_Click',
        value: new Date().getTime() - this.searchBarClickAt
      })
      let jumpUrl = url
      if (source == 'go') {
        //  如果当前搜索词是提示词中的一个，为了减轻后端搜索压力，可以直接拿推荐词里面给的链接跳转，不需要再走一次search了
        this.compsList.forEach((item) => {
          if (item.textMore && this.queryString.trim() === item.textMore.source && item.textMore.url) {
            jumpUrl = item.textMore.url
          }
        })
      }
      if (jumpUrl) {
        window.location.href = this.countryUrl(this.setSeatchSource(jumpUrl, source))
        return false
      } else {
        this.fromType = this.getFromType(source)
        this.$nextTick(() => {
          this.$el.querySelector('#azheadersearch').submit()
        })
      }
    },
    handleDebounce(fn) {
      this.debounceId && clearTimeout(this.debounceId)
      this.debounceId = setTimeout(fn, 500)
    },
    handleSearch() {
      this.handleDebounce(this.handleSearchFn.bind(this))
    },
    handleSearchFn() {
      this.suggesterShow = false
      this.searchindex += 1
      this.recnetSearchBoxAllowShow = !this.queryString
      if (!this.queryString) {
        this.compsList = []
      }
      if (this.popularWordsOK && !this.queryString) {
        this.popularList = this.popularWords
        this.suggestion = []
        this.appendGoods(this.queryString, this.popularProducts)
        this.setBiView(this.queryString)
        return
      }
      if (this.finishedQuery != (this.queryString || '')) this.setBiAnalysisClick('go', { q: this.queryString })

      // 优先使用缓存的结果
      // 产品要求优先保证提示词的加载速度，商品模块结果可以稍后处理，所以这里的接口分开请求就行，无需使用Promise.all
      if (this.searchCache[this.queryString]) {
        this.appendData(this.queryString, this.searchCache[this.queryString])
        this.setBiView(this.queryString)
      } else {
        // goodsListLoading 和 wordsLoading 只会在完全没推荐的时候才会展示加载态，input输入过程中不会重置展示数据，所以走以下的赋值,也就是只有第一次打开浮窗的时候才会有加载态
        this.wordsLoading =
          !this.compsList.length && !this.popularListMinusSearch.length && !(this.recnetSearchBoxShow && this.recentSearch.length)
        this.requestWords()
      }

      if (this.searchGoodsCache[this.queryString]) {
        this.appendGoods(this.queryString, this.searchGoodsCache[this.queryString].products)
        this.setGoodsBiView(this.queryString)
      } else {
        // goodsListLoading 和 wordsLoading 只会在完全没推荐的时候才会展示加载态，input输入过程中不会重置展示数据，所以走以下的赋值,也就是只有第一次打开浮窗的时候才会有加载态
        this.goodsListLoading = !this.goodsObject || !this.goodsObject.goodsList || !this.goodsObject.goodsList.length
        this.requestGoods()
      }
    },
    requestGoods() {
      // 请求商品模块
      const queryString = this.queryString
      this.$axios
        .get(`/1.0/search/suggest-products?q=${queryString}&search_index=${this.searchindex}`)
        .then((res) => {
          if (res.status == 200 && res.data.data) {
            if (res.data.data.searchIndex != this.searchindex) {
              // 返回的不是本次请求的结果，不处理
              return
            }
            const products = res.data.data.products
            if (queryString == '') {
              this.popularProducts = products
            } else {
              this.searchGoodsCache[queryString] = {
                products
              }
            }
            this.appendGoods(queryString, products)
            this.goodsListLoading = false

            // 之前bi对商品模块的打点挪到这里，因为现在商品模块和单词模块是分开请求加载的，所以需要单独的打点
            this.setGoodsBiView()
            // ga4对商品推荐模块的打点
            if (this.goodsObject && this.goodsObject.goodsList && this.goodsObject.goodsList.length) {
              const gaParams = this.getGAItemListParams(this.goodsObject.goodsList, null, 'view', this.itemListName)
              this.setGA4DataLayer(gaParams)
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    requestWords() {
      // 请求推荐词等模块 // 请求商品模块
      const queryString = this.queryString
      this.$axios
        .get(`/1.0/search/suggest-words?q=${queryString}&search_index=${this.searchindex}`)
        .then((res) => {
          if (res.status == 200 && res.data.data) {
            if (res.data.data.searchIndex != this.searchindex) {
              // 返回的不是本次请求的结果，不处理
              return
            }
            if (queryString == '') {
              this.popularWordsOK = true
              this.popularWords = res.data.data.popular
            } else {
              this.searchCache[queryString] = {
                ...res.data.data
              }
            }
            this.appendData(queryString, res.data.data)
            this.setBiView(queryString)
            this.wordsLoading = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    appendReminder(popularWords) {
      // if (!popularWords.length) return
      // this.reminderShow = true
      this.popularList = popularWords
    },
    appendGoods(keyword, products = {}) {
      if (!products.title || !products.goodsList) return
      this.goodsObject = products
      // 添加搜索记录 缓存(客户清除历史记录，搜索结果缓存)/请求命中是执行, 仅在roducts.goodsList有数据存储
      if (keyword && products.goodsList.length) {
        this.updateRecentSearches(keyword)
      }
    },
    appendData(keyword, data = {}) {
      this.compsList = data.completion || []
      this.popularList = data.popular || []
      if (data.suggest && data.suggest.length > 0) {
        this.appendSuggestion(keyword, data.suggest, false)
      } else if (data.suggestPopular && data.suggestPopular.length > 0) {
        this.appendSuggestion(keyword, data.suggestPopular, true)
      }
    },
    appendCompletion(comps) {
      this.compsList = comps
    },
    appendSuggestion(keyword, suggestion, isPopular) {
      this.suggestion = suggestion
      this.lastQueryString = this.queryString
      this.suggesterShow = true
      if (isPopular) {
        this.lookingKey = 'You can try these keywords'
        // 无纠错场景
        this.setDataLayer({
          action: 'click',
          category: 'SearchNoResult',
          label: 'SearchNoResult_Recommend'
        })
      } else {
        this.lookingKey = 'Are you looking for'
        // 有纠错场景
        this.setDataLayer({
          action: 'click',
          category: 'SearchNoResult',
          label: 'SearchNoResult_Correct'
        })
      }
    },
    searchResultClick(obj, key) {
      this.$cookie.removeCookie('fromSource')
      let el = ''
      if (key == 'popular-keywords') {
        this.setDataLayer({
          action: 'click',
          category: 'PopularKeywords',
          label: 'PopularKeywords_Click'
        })
        el = 'popular keywords'
        this.$cookie.setCookie('fromSource', '1')
      }
      if (key == 'suggestions') {
        this.setPoint('search', 'suggestion', 'click', {
          q: this.queryString,
          sg_key: obj.text
        })
        this.setDataLayer({
          action: 'click',
          category: 'SuggestionKeywords',
          label: 'SuggestionKeywords_Click'
        })
        el = 'suggestions'
      }
      if (key == 'recent-searches') {
        this.setDataLayer({
          action: 'click',
          category: 'SearchRecent',
          label: 'SearchRecent_Recent_Click'
        })
        el = 'recently searches'
        // 搜索框订单追踪
        this.setOrderSourceFlag('SearchRecent_Recent', true)
      }
      this.queryString = obj.keyword || obj.text
      if (el) this.setBiAnalysisClick([{ el, msg: { q: this.queryString } }])
      this.setDataLayer({
        action: 'click',
        category: 'PopularKeywords',
        label: `PopularKeywords${this.queryString}_Click`
      })
      if (key == 'recent-searches') {
        this.setModuleCookie('from', 'SearchRecent_Recent')
      }
      this.$nextTick(() => {
        this.searchBtnClick(obj.link, key)
      })
      // ga4打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'search',
        event_parameters: {
          button_name: this.queryString,
          type: 'Click'
        }
      })
    },
    suggestionWordClick(val) {
      this.queryString = val
      this.setDataLayer({
        action: 'click',
        category: 'SuggestionKeywords',
        label: 'SuggestionKeywords_Click'
      })
      this.setBiAnalysisClick([{ el: 'noresultpopup', msg: { q: this.queryString } }])
      this.$nextTick(() => {
        this.$el.querySelector('.az-header-search .search') && this.$el.querySelector('.az-header-search .search').click()
      })
    },
    searchGoodClick(good, kind) {
      const id = good.goodsId
      if (kind == 1) {
        this.setDataLayer({
          action: 'click',
          category: 'SearchPopularGoods',
          label: 'SearchPopularGoods',
          value: id
        })
        this.setDataLayer({
          action: 'click',
          category: 'PopularProducts',
          label: 'PopularProducts_Click'
        })
      } else if (kind == 2) {
        this.setDataLayer({
          action: 'click',
          category: 'SearchRelatedGoods',
          label: 'SearchRelatedGoods',
          value: id
        })
        this.setDataLayer({
          action: 'click',
          category: 'RelatedGoods',
          label: 'RelatedGoods_Click'
        })
      }
      let type = ''
      if (kind == 1) {
        type = 'popular products'
      } else if (kind == 2) {
        type = 'related products'
      }
      if (type) {
        const name = good.shownGoodsName ? good.shownGoodsName : good.goodsName
        this.setBiAnalysisClick([{ el: type, msg: { name } }])
      }
    },
    // 获取搜索模块触发的类型
    getFromType(source) {
      // source: suggestions  recent-searches  popular-keywords   go
      // 打点msg  from_type
      // search_popular_keywords：从搜索框中 popular keywords 模块点过来的
      // search_recent_searches：从搜索框中 recent searches 模块点过来的
      // search_popular_products：从搜索框中 popular products 模块点过来的
      // search_related_products：从搜索框中 related products 模块点过来的
      // search_suggestions_auto：从搜索框中 suggestion 模块点过来的，并通过搜索逻辑自动跳转的（没有在 lego 中 search keywords 配置的情况）
      // search_suggestions_lego：从搜索框中 suggestion 模块点过来的，并通过lego 中 search keywords 模块配置的跳转链接
      // search_go_auto：从搜索框直接回车过来的，并通过搜索逻辑自动跳转的（没有在 lego 中 search keywords 配置的情况）
      // search_go_lego：搜索框直接回车过来的，并通过lego 中 search keywords 模块配置的跳转链接
      let urlSource = source
      switch (source) {
        case 'suggestions':
          urlSource = 'search_suggestions_auto' // search_suggestions_auto,后续会根据接口给的match_type再判断是否要更改为search_suggestions_lego
          break
        case 'recent-searches':
          urlSource = 'search_recent_searches'
          break
        case 'popular-keywords':
          urlSource = 'search_popular_keywords'
          break
        case 'go':
          urlSource = 'search_go_auto' // 先默认search_go_auto,后续会根据接口给的match_type再判断是否要更改为search_go_lego
          break
      }
      return urlSource
    },
    // 通过search模块点击跳转的链接需要在前端加上query，以便打点
    setSeatchSource(url, source) {
      if (source) {
        const urlSource = this.getFromType(source)
        if (urlSource) {
          let newUrlSource = urlSource
          const query = getUrlQueryNoPage(url)
          if (urlSource == 'search_suggestions_auto' && query.match_type) {
            newUrlSource = 'search_suggestions_' + query.match_type
          } else if (urlSource == 'search_go_auto' && query.match_type) {
            newUrlSource = 'search_go_' + query.match_type
          }
          url = url + (url.includes('?') ? '&' : '?') + 'from_type=' + newUrlSource
        }
      }
      return url
    },
    handleMouseenter(str) {
      this.tempQueryString = this.queryString
      this.queryString = str
    },
    handleMouseleave() {
      this.queryString = this.tempQueryString
    }
  }
}
</script>

<style lang="less" scoped>
.az-header-search {
  float: left;
  margin-left: 20px;
  &.is-support {
    .search-reminder,
    .search-reminder-skeleton {
      display: none;
    }
  }
  .header-search {
    position: relative;
    width: 173px;
    height: 18px;
    z-index: @z-index-5;
    padding-left: 10px;
    background: #fff;
    input {
      vertical-align: middle;
    }
    .input_text {
      position: absolute;
      // margin-top: 2px;
      width: 150px;
      height: 18px;
      line-height: 18px;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: 0;
      padding: 0px;
      font-family: @font-family-500, Sans-serif;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      background-color: #fff;
      border: none;
      border-bottom: 1px solid var(--color-121212);
      font-size: 12px;
    }
    .search {
      position: absolute;
      top: 0px;
      right: 0px;
      background: #fff;
      width: 18px;
      height: 18px;
      display: inline-block;
      padding: 0;
      border: 0;
      cursor: pointer;
    }

    input::-moz-placeholder {
      color: var(--color-121212);
    }
    input:-moz-placeholder {
      color: var(--color-121212);
    }
    input::-webkit-input-placeholder {
      color: #666;
    }
    input::-webkit-search-decoration,
    input::-webkit-textfield-decoration-container > div:first-child {
      display: none;
    }
    input::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
  }

  // 左边搜索联想样式
  .search-reminder {
    display: flex;
    position: absolute;
    top: 30px;
    right: 0;
    min-height: 340px;
    font-family: @font-family-500;
    font-weight: 400;
    box-shadow: 0px 0px 8px 0px rgba(102, 102, 102, 0.38);
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 225, 225, 1);
    border-radius: 3px;
    box-sizing: border-box;
    padding: 20px 30px 30px;
    &.search-reminder-position-right {
      right: 0;
    }
    .search-reminder-right {
      vertical-align: top;
      min-width: 180px;
      display: inline-block;
      padding-left: 30px;
    }

    .search-item-selected {
      background-color: rgba(246, 246, 246, 1);
    }

    .search-reminder-separator {
      vertical-align: top;
      border-left: 1px solid #e6e6e6;
      display: inline-block;
    }

    .search-reminder-left {
      vertical-align: top;
      display: inline-block;
      flex: 1;
      .out-box {
        display: flex;
        padding-right: 25px;
      }

      .search-product:first-of-type {
        margin-left: -5px;
      }

      .search-product {
        box-sizing: content-box;
        display: inline;
        float: left;
        margin-top: 5px;
        max-width: 110px;
        white-space: nowrap;
        padding: 0px 5px 5px 5px;
        &:hover {
          box-shadow: 0px 0px 5px 0px rgba(238, 238, 238, 1);
        }
        a {
          color: var(--color-121212);
        }

        .new-no-rating {
          color: @theme-color;
          height: 18px;
        }

        .product-image {
          width: 110px;
          height: 151px;
        }

        .product-name {
          margin-top: 9px;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .product-color {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .show_rating {
          display: flex;
          margin-top: 0;
        }

        .good_price {
          font-size: 13px;
          font-family: @font-family-600;
          font-weight: 600;
          color: @theme-color;
          line-height: 18px;
        }

        .goods_no_deal_price {
          font-size: 13px;
          font-family: @font-family-500;
          color: rgba(153, 153, 153, 1);
          line-height: 18px;
          text-decoration: line-through;
          margin-top: 2px;
        }
      }
    }

    .search-title {
      line-height: 20px;
      color: #666;
      font-family: @font-family-600;
      cursor: default;
      font-size: 14px;
      margin-bottom: 10px;
      &.recent-searches-title {
        position: relative;
        .icon-search-title {
          position: absolute;
          top: 18px;
          right: 0;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .icon-remove {
          cursor: pointer;
          width: 12px;
          height: 12px;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        // .icon-search-delete {
        //   background: url(~assets/images/search_icon/ic-delete.png) no-repeat center/ 100%;
        // }
      }
    }

    .search-item {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: rgba(51, 51, 51, 1);
      padding-left: 30px;
      padding-right: 30px;
      margin-left: -30px;
      margin-right: -30px;
      font-family: @font-family-600;
      span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:hover {
        background-color: rgba(246, 246, 246, 1);
      }
      span.word_box {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        max-width: 100%;
      }
      .suggestions-search-keyword {
        font-size: 0;
      }
      .li-search-hit-word {
        font-family: @font-family-600;
        color: var(--color-121212);
        font-size: 13px;
      }
      .text-more {
        color: #999;
        font-size: 13px;
        font-family: @font-family-500;
        white-space: pre-wrap;
      }
      i {
        display: inline-block;
        width: 0px;
        height: 12px;
      }

      &.is_high_light {
        span.reminder-search-keyword {
          color: @theme-color;
        }
        i {
          display: inline-block;
          width: 10px;
          height: 12px;
          margin-right: 5px;
          background: url(~assets/images/search_icon/ic-Dresses-Start.png) no-repeat;
          background-size: cover;
        }
      }
      &.is_flash_sale {
        i {
          height: 15px;
          background-image: url(~assets/images/search_icon/ic-flash-sale.png);
        }
      }
    }

    .search-item-skeleton,
    .product-img-skeleton,
    .product-name-skeleton,
    .product-color-skeleton {
      background: #f1f1f1;
      animation-duration: 1s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: placeHolderShimmer;
      animation-timing-function: linear;
      background: linear-gradient(to right, var(--color-eeeeee) 8%, #dddddd 18%, var(--color-eeeeee) 33%);
      background-size: 800px 104px;
      height: 40px;
      position: relative;
    }
    .product-img-skeleton {
      width: 110px;
      height: 151px;
    }

    .product-name-skeleton {
      width: 110px;
      height: 20px;
      margin-top: 15px;
    }

    .product-color-skeleton {
      width: 110px;
      height: 20px;
      margin-top: 5px;
    }

    .search-item-skeleton {
      width: 180px;
      height: 20px;
      margin-top: 10px;
    }
  }

  .search-suggester {
    &.search-suggester-position-right {
      right: 0;
    }
    position: absolute;
    top: 30px;
    right: 0;
    width: 610px;
    height: 320px;
    font-family: @font-family-500;
    box-shadow: 0px 0px 8px 0px rgba(102, 102, 102, 0.38);
    border-radius: 3px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 225, 225, 1);
    text-align: center;
    overflow: hidden;

    .p-keyword-search-suggester {
      height: 30px;
      font-size: 16px;
      font-family: @font-family-500;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      margin-left: 11px;
      margin-right: 12px;
      margin-top: 48px;
    }

    .search-looking-for {
      margin-top: 17px;
      justify-content: center;
      flex-wrap: wrap;
      flex-direction: row;
      display: flex;
      padding: 0 100px;
      font-size: 14px;

      .search-suggestion-item {
        margin-top: 12px;
        padding-right: 5px;
        padding-left: 5px;
      }
    }

    .search-suggestion-word {
      background: rgba(240, 240, 240, 1);
      border-radius: 14px;
      width: fit-content;
      white-space: nowrap;
      cursor: pointer;
      padding: 0px 20px;
      display: block;
      height: 28px;
      line-height: 28px;
    }

    .p-keyword-looking-for {
      height: 13px;
      font-size: 14px;
      font-weight: 600;
      font-family: @font-family-600;
      color: rgba(102, 102, 102, 1);
      line-height: 33px;
      margin-top: 20px;
    }

    .p-keyword-search {
      font-weight: bold;
      font-size: 16px;
      word-wrap: break-word;
      margin-left: 11px;
      margin-right: 12px;
    }
  }

  .li-search-hot-num {
    display: none; // 不显示热词
    float: right;
    color: rgba(161, 161, 161, 1);
  }
}
</style>
