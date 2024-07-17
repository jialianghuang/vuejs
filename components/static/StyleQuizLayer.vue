<template>
  <az-overlay :zIndex="12" @click="close">
    <div v-if="styleQuizBridal && Object.keys(styleQuizBridal).length" class="style_quiz_bridal_entry">
      <div @click="close" class="layer-close">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      </div>
      <div v-show="!swiperShow" class="first-screen">
        <img :src="replaceImgCdnUrl(styleQuizBridal.entry.dataUrl)" :alt="nl(styleQuizBridal.entry.imgAlt)" class="wd_style_quiz" />
        <div class="entry_content_box">
          <p class="entry_title">{{ nl(styleQuizBridal.entry.header) }}</p>
          <p v-html="nl(styleQuizBridal.entry.title)" class="entry_description"></p>
          <span @click="toSwiper">{{ nl(styleQuizBridal.entry.text) }}</span>
        </div>
      </div>
      <div v-show="swiperShow" v-swiper:styleQuiz="swiperOption">
        <div v-if="styleQuizBridal.content && styleQuizBridal.content.list" class="swiper-wrapper">
          <div v-for="(slideItem, sIndex) in styleQuizBridal.content.list" :key="sIndex" class="swiper-slide">
            <div :class="`${slideItem.listCls}-wrapper`" class="style_quiz_content">
              <h4 :class="{ multi: slideItem.text }">
                {{ nl(slideItem.title).replace('\\', '') }}
                <p v-if="slideItem.text" class="multi-select">{{ nl(slideItem.text) }}</p>
              </h4>
              <div class="content_box_style">
                <div
                  v-for="(item, index) in slideItem.list"
                  :key="index"
                  @click="selectFilter(item)"
                  :class="{
                    selected: filterParams[item.filterType] && filterParams[item.filterType].includes(item.filterName),
                    [slideItem.listCls]: true
                  }"
                  class="content_item_box"
                >
                  <template v-if="item.dataUrl">
                    <div class="img-box">
                      <img
                        :data-src="replaceImgCdnUrl(item.src)"
                        :alt="nl(item.imgAlt)"
                        :src="replaceImgCdnUrl(item.dataUrl)"
                        class="bd_style_quiz swiper-lazy"
                      />
                      <div class="img-border"></div>
                    </div>
                    <h5>{{ nl(item.title) }}</h5>
                  </template>
                  <template v-else>
                    <div class="img-box">
                      <div class="text-content">
                        <p class="text">{{ nl('page_brides_gowns_under') }}</p>
                        <p :class="['text big', { middle: country === 'MX' }]">{{ item.amount }}</p>
                      </div>
                    </div>
                    <h5>{{ nl(item.title) }}</h5>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div v-show="swiperShow" class="button-box clearfix">
        <div v-show="slideIndex" v-html="` < ${nl('page_common_style_quiz_back')}`" class="swiper-prev-button"></div>
        <div v-show="slideIndex < 4" class="swiper-next-button">{{ nl('page_common_continue') }}</div>
        <div v-show="slideIndex == 4" @click="showResultEvent" class="show-result-btn">{{ nl('page_common_style_quiz_view_all') }}</div>
      </div>
      <p v-show="swiperShow" class="count_tip">
        ({{ styleQuizBridal.countTipText }}:&nbsp;<span>{{ count ? count : 0 }}</span
        >)
      </p>
    </div>
    <az-loading v-if="isLoading"></az-loading>
  </az-overlay>
</template>

<script>
import { pathToFilters } from '@/assets/js/utils.js'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import azLoading from '@/components/az-ui/AzLoading'
let vm = null // eslint-disable-line no-unused-vars
export default {
  name: 'StyleQuizLayer',
  languageKeys: [
    'page_brides_gowns_under',
    'page_common_style_quiz_back',
    'page_common_continue',
    'page_common_style_quiz_view_all',
    'page_common_bridal_style_quiz_select_style',
    'page_common_bridal_style_quiz_multi_select',
    'page_common_style_romantic',
    'page_style_quiz_bridal_romantic_alt',
    'page_style_quiz_bridal_romantic_title',
    'page_common_style_vintage',
    'page_style_quiz_bridal_vintage_alt',
    'page_style_quiz_bridal_vintage_title',
    'page_common_style_boho',
    'page_style_quiz_bridal_boho_alt',
    'page_style_quiz_bridal_boho_title',
    'page_style_quiz_bridal_beach_destination_alt',
    'page_style_quiz_bridal_beach_destination_title',
    'page_common_style_chic_modern',
    'page_style_quiz_bridal_chic_modern_alt',
    'page_style_quiz_bridal_chic_modern_title',
    'page_common_style_fairytale',
    'page_style_quiz_bridal_fairytale_alt',
    'page_style_quiz_bridal_fairytale_title',
    'page_common_style_glamorous',
    'page_style_quiz_bridal_glamorous_alt',
    'page_style_quiz_bridal_glamorous_title',
    'page_common_style_elegant',
    'page_style_quiz_bridal_elegant_alt',
    'page_style_quiz_bridal_elegant_title',
    'page_common_style_traditional',
    'page_style_quiz_bridal_traditional_alt',
    'page_style_quiz_bridal_traditional_title',
    'page_common_style_casual',
    'page_style_quiz_bridal_casual_alt',
    'page_style_quiz_bridal_casual_title',
    'page_common_style_simple',
    'page_style_quiz_bridal_simple_alt',
    'page_style_quiz_bridal_simple_title',
    'page_style_quizlayer_title1',
    'page_common_silhouette_a_line',
    'page_style_quiz_bridal_a_line_alt',
    'page_style_quiz_bridal_a_line_title',
    'page_common_silhouette_trumpet_mermaid',
    'page_style_quiz_bridal_trumpet_mermaid_alt',
    'page_style_quiz_bridal_trumpet_mermaid_title',
    'page_common_silhouette_ball_gown',
    'page_style_quiz_bridal_ball_gown_alt',
    'page_style_quiz_bridal_ball_gown_title',
    'page_common_silhouette_sheath_column',
    'page_style_quiz_bridal_sheath_column_alt',
    'page_style_quiz_bridal_sheath_column_title',
    'page_common_silhouette_pant_suit_new',
    'page_style_quiz_bridal_pant_suit_alt',
    'page_style_quiz_bridal_pant_suit_title',
    'page_common_style_quiz_price',
    'page_brides_gowns_under',
    'page_style_quizlayer_title3',
    'page_common_straps_sleeves_strapless',
    'page_style_quiz_bridal_strapless_alt',
    'page_style_quiz_bridal_strapless_title',
    'page_common_straps_sleeves_spaghetti_straps',
    'page_style_quiz_bridal_spaghetti_straps_alt',
    'page_style_quiz_bridal_spaghetti_straps_title',
    'page_common_straps_sleeves_sleeveless',
    'page_style_quiz_bridal_sleeveless_alt',
    'page_style_quiz_bridal_sleeveless_title',
    'page_common_straps_sleeves_sleeves',
    'page_style_quiz_bridal_sleeves_alt',
    'page_style_quiz_bridal_sleeves_title',
    'page_common_straps_sleeves_cap_sleeves',
    'page_style_quiz_bridal_cap_sleeves_alt',
    'page_style_quiz_bridal_cap_sleeves_title',
    'page_common_straps_sleeves_off_the_shoulder',
    'page_style_quiz_bridal_off_the_shoulder_alt',
    'page_style_quiz_bridal_off_the_shoulder_title',
    'page_style_quizlayer_title4',
    'page_common_embellishment_lace',
    'page_style_quiz_bridal_lace_alt',
    'page_style_quiz_bridal_lace_title',
    'page_common_embellishment_sequins',
    'page_style_quiz_bridal_sequins_alt',
    'page_style_quiz_bridal_sequins_title',
    'page_common_embellishment_beaded',
    'page_style_quiz_bridal_beaded_alt',
    'page_style_quiz_bridal_beaded_title',
    'page_common_embellishment_pleated',
    'page_style_quiz_bridal_pleated_alt',
    'page_style_quiz_bridal_pleated_title',
    'page_common_embellishment_ruched',
    'page_style_quiz_bridal_ruched_alt',
    'page_style_quiz_bridal_ruched_title',
    'page_common_embellishment_bow_s',
    'page_style_quiz_bridal_bow_s_alt',
    'page_style_quiz_bridal_bow_s_title',
    'page_common_embellishment_cascading_ruffles',
    'page_style_quiz_bridal_cascading_ruffles_alt',
    'page_style_quiz_bridal_cascading_ruffles_title',
    'page_common_features_belt_sash',
    'page_style_quiz_bridal_belt_sash_alt',
    'page_style_quiz_bridal_belt_sash_title',
    'page_common_features_side_slit',
    'page_style_quiz_bridal_side_slit_alt',
    'page_style_quiz_bridal_side_slit_title',
    'page_common_features_pockets',
    'page_style_quiz_bridal_pockets_alt',
    'page_style_quiz_bridal_pockets_title',
    'page_common_features_detachable_train',
    'page_style_quiz_bridal_detachable_train_alt',
    'page_style_quiz_bridal_detachable_train_title',
    'page_common_features_convertible',
    'page_style_quiz_bridal_convertible_alt',
    'page_style_quiz_bridal_convertible_title',
    'page_style_quiz_bridal_entry_alt',
    'page_header_bridal_style_finder',
    'page_style_quizlayer_entry_title',
    'page_common_style_quiz',
    'page_common_style_quiz_back',
    'page_common_style_quiz_skip',
    'page_category_match_dressed',
    'page_common_style_beach_destination'
  ],
  components: {
    AzOverlay,
    azLoading
  },
  props: {
    styleQuizBridalTest: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      filterParams: {},
      swiperShow: false,
      swiperInit: false,
      url: '',
      count: 0,
      slideIndex: 0,
      color: '',
      length: '',
      feature: [],
      price: '',
      swiperOption: {
        init: false,
        lazy: {
          loadPrevNext: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-next-button',
          prevEl: '.swiper-prev-button'
        },
        on: {
          slideChange() {
            vm.slideIndex = this.realIndex
            vm.setPoint('bridalstylefinder', `selection${vm.slideIndex + 1}`, 'view')
          },
          slideNextTransitionStart() {
            vm.setPoint('bridalstylefinder', `selection${this.realIndex}skip`, 'click')
          }
        }
      },
      filters: {},
      styleQuizBridal: {},
      isLoading: false
    }
  },
  created() {
    vm = this
    this.getFilters()
  },
  methods: {
    close() {
      !this.swiperShow && this.toSwiper() // 这个模块，如果不显示swiper，直接关闭会报错，所以，这里在关闭的时候，先模拟打开了swiper
      this.styleQuiz && this.styleQuiz.slideTo(0)
      this.swiperShow = false
      this.color = ''
      this.length = ''
      this.feature = []
      this.price = ''
      this.$emit('close')
    },
    toSwiper() {
      this.setPoint('bridalstylefinder', `selection1`, 'view')
      this.swiperShow = true
      this.getCount()
      if (!this.swiperInit) {
        this.swiperInit = true
        this.styleQuiz.init()
      }
    },
    selectFilter(item) {
      if (!this.filterParams[item.filterType]) {
        this.$set(this.filterParams, item.filterType, [item.filterName])
      } else if (this.filterParams[item.filterType].includes(item.filterName)) {
        this.filterParams[item.filterType] = this.filterParams[item.filterType].filter((name) => name !== item.filterName)
      } else if (item.multi) {
        this.filterParams[item.filterType].push(item.filterName)
      } else {
        this.filterParams[item.filterType] = [item.filterName]
      }
      this.getCount()
    },
    featureHaveCurrent(obj) {
      let res = -1
      this.feature.map((item, index) => {
        if (item.featureName == obj.featureName) {
          res = index
        }
      })
      return res
    },
    featureClick(obj) {
      if (this.featureHaveCurrent(obj) > -1) {
        this.feature.splice(this.featureHaveCurrent(obj), 1)
      } else {
        this.feature.push(obj)
      }
    },
    async getCount() {
      let url = `/all/wedding-dresses`
      let filterUrl = ''
      const colorFilter = {}
      const alternativeFilter = {}
      for (const key in this.filterParams) {
        if (key && this.filterParams[key].length > 0) {
          if (key == 'colors') {
            colorFilter.colors = this.filterParams[key]
          } else {
            alternativeFilter[key] = this.filterParams[key]
          }
        }
      }
      for (const key in alternativeFilter) {
        filterUrl += '/' + key + '/' + alternativeFilter[key].join(',')
      }
      if (filterUrl) {
        if (colorFilter.colors && colorFilter.colors[0]) {
          url += '/colors/' + colorFilter.colors.join(',')
        }
        url += '/with' + filterUrl
      }
      this.url = url + '?from_style_quiz=1'
      url += '?from=style_quiz'
      const firstQuery = pathToFilters(this.url, this.$store)
      console.log('firstQuery:', firstQuery)
      const filtersObj = firstQuery.filtersObj
      const res = await this.$axios.$post(
        `/1.0/list/products`,
        {
          filters: filtersObj
        },
        {
          params: {
            cat_name: firstQuery.cat_name,
            dress_type: firstQuery.dress_type,
            page: 1,
            from_style_quiz: true,
            quiz_progress: 'ing'
          }
        }
      )
      if (res.code == 0) {
        this.count = res.data.pageInfo.totalCount
      }
    },
    showResultEvent() {
      this.setPoint('bridalstylefinder', 'selection5skip', 'click')
      window.location.href = this.countryUrl(this.url)
    },
    setFilterNameByType(newList) {
      // 根据filterType filterKye 修改 filterName
      // 根据filters 筛选出网站有的属性，才展示
      const result = newList.map((child, childIndex) => {
        const subList = child.list.map((item, index) => {
          const filterType = item.filterType
          const filterkeyList = this.filters[filterType] && this.filters[filterType].values && Object.keys(this.filters[filterType].values)
          if (filterType === 'price') {
            return item
          } else if (filterkeyList && filterkeyList.includes(item.filterKey)) {
            item.filterName = this.filters[filterType].values[item.filterKey].value
            return item
          } else {
            return null
          }
        })
        child.list = subList.filter((item) => {
          return item && Object.keys(item).length
        })
        return child
      })
      return result
    },
    getFilters() {
      this.isLoading = true
      this.$axios
        .$post(
          `/1.0/list/content`,
          {},
          {
            params: {
              cat_name: 'wedding-dresses'
            }
          }
        )
        .then((res) => {
          if (+res.code === 0 && res.data) {
            this.filters = res.data.filters || {}
            this.setStyleQuizBridal()
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setStyleQuizBridal() {
      const priceName = [
        {
          US: 'price0-200',
          AU: 'priceaudau0-300',
          GB: 'pricegbpgb0-200',
          CA: 'pricecadca0-300',
          FR: 'priceeurfr0-200',
          MX: 'pricemxnmx0-5999',
          DE: 'priceeurde0-200',
          ES: 'priceeures0-200',
          IT: 'priceeurit0-200',
          IE: 'priceeurie0-200',
          NL: 'priceeurnl0-200',
          BE: 'priceeurbe0-200'
        },
        {
          US: 'price0-400',
          AU: 'priceaudau0-600',
          GB: 'pricegbpgb0-400',
          CA: 'pricecadca0-600',
          FR: 'priceeurfr0-400',
          MX: 'pricemxnmx0-11999',
          DE: 'priceeurde0-400',
          ES: 'priceeures0-400',
          IT: 'priceeurit0-400',
          IE: 'priceeurie0-400',
          NL: 'priceeurnl0-400',
          BE: 'priceeurbe0-400'
        },
        {
          US: 'price0-600',
          AU: 'priceaudau0-900',
          GB: 'pricegbpgb0-600',
          CA: 'pricecadca0-900',
          FR: 'priceeurfr0-600',
          MX: 'pricemxnmx0-17999',
          DE: 'priceeurde0-600',
          ES: 'priceeures0-600',
          IT: 'priceeurit0-600',
          IE: 'priceeurie0-600',
          NL: 'priceeurnl0-600',
          BE: 'priceeurbe0-600'
        },
        {
          US: 'price0-800',
          AU: 'priceaudau0-1200',
          GB: 'pricegbpgb0-800',
          CA: 'pricecadca0-1200',
          FR: 'priceeurfr0-900',
          MX: 'pricemxnmx0-23999',
          DE: 'priceeurde0-900',
          ES: 'priceeures0-900',
          IT: 'priceeurit0-900',
          IE: 'priceeurie0-900',
          NL: 'priceeurnl0-900',
          BE: 'priceeurbe0-900'
        }
      ]

      const amountText = [
        {
          US: '$200',
          AU: 'AU$300',
          GB: '￡200',
          CA: 'CA$300',
          FR: '200€',
          MX: 'MXN$5999',
          DE: '200€',
          ES: '200€',
          IT: '200€',
          IE: '200€',
          NL: '200€',
          BE: '200€'
        },
        {
          US: '$400',
          AU: 'AU$600',
          GB: '￡400',
          CA: 'CA$600',
          FR: '400€',
          MX: 'MXN$11999',
          DE: '400€',
          ES: '400€',
          IT: '400€',
          IE: '400€',
          NL: '400€',
          BE: '400€'
        },
        {
          US: '$600',
          AU: 'AU$900',
          GB: '￡600',
          CA: 'CA$900',
          FR: '600€',
          MX: 'MXN$17999',
          DE: '600€',
          ES: '600€',
          IT: '600€',
          IE: '600€',
          NL: '600€',
          BE: '600€'
        },
        {
          US: '$800',
          AU: 'AU$1200',
          GB: '￡800',
          CA: 'CA$1200',
          FR: '900€',
          MX: 'MXN$23999',
          DE: '900€',
          ES: '900€',
          IT: '900€',
          IE: '900€',
          NL: '900€',
          BE: '900€'
        }
      ]

      const newList = [
        {
          title: 'page_common_bridal_style_quiz_select_style',
          text: 'page_common_bridal_style_quiz_multi_select',
          listCls: 'style_content_box',
          list: [
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/b8/1a/2a0d814629a56a0ab9237c6691f9b81a.png',
              filterName: this.nl('page_common_style_romantic'),
              filterKey: 'romantic',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_romantic_alt',
              title: 'page_style_quiz_bridal_romantic_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/ff/74/41f0b61e5c169326b5d4e35f4e09ff74.png',
              filterName: this.nl('page_common_style_vintage'),
              filterKey: 'vintage',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_vintage_alt',
              title: 'page_style_quiz_bridal_vintage_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/00/c4/59528ece7149902b79d31716aaa300c4.png',
              filterName: this.nl('page_common_style_boho'),
              filterKey: 'boho',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_boho_alt',
              title: 'page_style_quiz_bridal_boho_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/f0/54/6478377d3183396dca01c3d34ff2f054.png',
              filterName: this.nl('page_common_style_beach_destination'),
              filterKey: 'beach/destination',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_beach_destination_alt',
              title: 'page_style_quiz_bridal_beach_destination_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/c0/10/ed632b136ec3896b238b36efc7a0c010.png',
              filterName: this.nl('page_common_style_chic_modern'),
              filterKey: 'chic/modern',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_chic_modern_alt',
              title: 'page_style_quiz_bridal_chic_modern_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/0b/af/4432ca30d691ef15b149b4bf6aa30baf.png',
              filterName: this.nl('page_common_style_fairytale'),
              filterKey: 'fairytale',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_fairytale_alt',
              title: 'page_style_quiz_bridal_fairytale_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/6b/57/9501570d7e037d3dedee9be16e756b57.png',
              filterName: this.nl('page_common_style_glamorous'),
              filterKey: 'glamorous',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_glamorous_alt',
              title: 'page_style_quiz_bridal_glamorous_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/17/9f/7398967e56f59e04c6e497ef2eea179f.png',
              filterName: this.nl('page_common_style_elegant'),
              filterKey: 'elegant',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_elegant_alt',
              title: 'page_style_quiz_bridal_elegant_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/66/26/bdb739d0798442f773f9431167fb6626.png',
              filterName: this.nl('page_common_style_traditional'),
              filterKey: 'traditional',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_traditional_alt',
              title: 'page_style_quiz_bridal_traditional_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/19/e9/c6169cd193e454052e076ed7bc2319e9.png',
              filterName: this.nl('page_common_style_casual'),
              filterKey: 'casual',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_casual_alt',
              title: 'page_style_quiz_bridal_casual_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/a9/29/bba6a130adfeb806f514729e5baca929.png',
              filterName: this.nl('page_common_style_simple'),
              filterKey: 'simple',
              multi: true,
              filterType: 'style',
              imgAlt: 'page_style_quiz_bridal_simple_alt',
              title: 'page_style_quiz_bridal_simple_title'
            }
          ]
        },
        {
          title: 'page_style_quizlayer_title1',
          text: 'page_common_bridal_style_quiz_multi_select',
          listCls: 'silhouette_content_box',
          list: [
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/f2/40/6a99babb1a10f8c74d3249a11ec8f240.png',
              filterName: this.nl('page_common_silhouette_a_line'),
              filterKey: 'a_line',
              multi: true,
              filterType: 'silhouette',
              imgAlt: 'page_style_quiz_bridal_a_line_alt',
              title: 'page_style_quiz_bridal_a_line_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/04/8f/5f6f346a7b4a109363d8cb05e215048f.png',
              filterName: this.nl('page_common_silhouette_trumpet_mermaid'),
              filterKey: 'trumpet/mermaid',
              multi: true,
              filterType: 'silhouette',
              imgAlt: 'page_style_quiz_bridal_trumpet_mermaid_alt',
              title: 'page_style_quiz_bridal_trumpet_mermaid_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/52/6c/46f59ad045655754ebb2c1a86e6e526c.png',
              filterName: this.nl('page_common_silhouette_ball_gown'),
              filterKey: 'ball_gown',
              multi: true,
              filterType: 'silhouette',
              imgAlt: 'page_style_quiz_bridal_ball_gown_alt',
              title: 'page_style_quiz_bridal_ball_gown_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/04/5e/414726e726d8003e74082827bb2d045e.png',
              filterName: this.nl('page_common_silhouette_sheath_column'),
              filterKey: 'sheath/column',
              multi: true,
              filterType: 'silhouette',
              imgAlt: 'page_style_quiz_bridal_sheath_column_alt',
              title: 'page_style_quiz_bridal_sheath_column_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/82/94/f55ff705cff5f8a82ea17b57eda48294.png',
              filterName: this.nl('page_common_silhouette_pant_suit_new'),
              filterKey: 'pant_suit',
              multi: true,
              filterType: 'silhouette',
              imgAlt: 'page_style_quiz_bridal_pant_suit_alt',
              title: 'page_style_quiz_bridal_pant_suit_title'
            }
          ]
        },
        {
          title: 'page_common_style_quiz_price',
          listCls: 'price_content_box',
          list: [
            {
              imgUrl: 's_20180723.gif',
              dataUrl: '',
              filterName: priceName[0][this.country],
              // filterType: priceType[this.country],
              filterType: 'price',
              imgAlt: this.nl('page_brides_gowns_under') + ` ${amountText[0][this.country]}`,
              title: this.nl('page_brides_gowns_under') + ` ${amountText[0][this.country]}`,
              amount: amountText[0][this.country]
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: '',
              filterName: priceName[1][this.country],
              // filterType: priceType[this.country],
              filterType: 'price',
              imgAlt: this.nl('page_brides_gowns_under') + ` ${amountText[1][this.country]}`,
              title: this.nl('page_brides_gowns_under') + ` ${amountText[1][this.country]}`,
              amount: amountText[1][this.country]
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: '',
              filterName: priceName[2][this.country],
              // filterType: priceType[this.country],
              filterType: 'price',
              imgAlt: this.nl('page_brides_gowns_under') + ` ${amountText[2][this.country]}`,
              title: this.nl('page_brides_gowns_under') + ` ${amountText[2][this.country]}`,
              amount: amountText[2][this.country]
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: '',
              filterName: priceName[3][this.country],
              // filterType: priceType[this.country],
              filterType: 'price',
              imgAlt: this.nl('page_brides_gowns_under') + ` ${amountText[3][this.country]}`,
              title: this.nl('page_brides_gowns_under') + ` ${amountText[3][this.country]}`,
              amount: amountText[3][this.country]
            }
          ]
        },
        {
          title: 'page_style_quizlayer_title3',
          text: 'page_common_bridal_style_quiz_multi_select',
          listCls: 'selleve_content_box',
          list: [
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/24/d7/253667c012135da2840597de161524d7.png',
              filterName: this.nl('page_common_straps_sleeves_strapless'),
              filterKey: 'strapless',
              multi: true,
              filterType: 'straps_&_sleeves',
              imgAlt: 'page_style_quiz_bridal_strapless_alt',
              title: 'page_style_quiz_bridal_strapless_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/78/91/2acaa25a46ef015ae9924fc66a197891.png',
              filterName: this.nl('page_common_straps_sleeves_spaghetti_straps'),
              filterKey: 'spaghetti_straps',
              multi: true,
              filterType: 'straps_&_sleeves',
              imgAlt: 'page_style_quiz_bridal_spaghetti_straps_alt',
              title: 'page_style_quiz_bridal_spaghetti_straps_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/ff/76/56d6a4ef8a5e848113853021ca51ff76.png',
              filterName: this.nl('page_common_straps_sleeves_sleeveless'),
              filterKey: 'sleeveless',
              multi: true,
              filterType: 'straps_&_sleeves',
              imgAlt: 'page_style_quiz_bridal_sleeveless_alt',
              title: 'page_style_quiz_bridal_sleeveless_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/a5/c4/f32a67579c16dd4ae1711357dc07a5c4.png',
              filterName: this.nl('page_common_straps_sleeves_sleeves'),
              filterKey: 'sleeves',
              multi: true,
              filterType: 'straps_&_sleeves',
              imgAlt: 'page_style_quiz_bridal_sleeves_alt',
              title: 'page_style_quiz_bridal_sleeves_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/62/62/f2a70b23523f6f43b2c26b52733b6262.png',
              filterName: this.nl('page_common_straps_sleeves_cap_sleeves'),
              filterKey: 'cap_sleeves',
              multi: true,
              filterType: 'straps_&_sleeves',
              imgAlt: 'page_style_quiz_bridal_cap_sleeves_alt',
              title: 'page_style_quiz_bridal_cap_sleeves_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/a4/ee/cc6da32e9665b563eeccdcf0004aa4ee.png',
              filterName: this.nl('page_common_straps_sleeves_off_the_shoulder'),
              filterKey: 'off_the_shoulder',
              multi: true,
              filterType: 'straps_&_sleeves',
              imgAlt: 'page_style_quiz_bridal_off_the_shoulder_alt',
              title: 'page_style_quiz_bridal_off_the_shoulder_title'
            }
          ]
        },
        {
          title: 'page_style_quizlayer_title4',
          text: 'page_common_bridal_style_quiz_multi_select',
          listCls: 'detail_content_box',
          list: [
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/03/32/51b5c67c8b975b8caf084b9561a20332.png',
              filterName: this.nl('page_common_embellishment_lace'),
              filterKey: 'lace',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_lace_alt',
              title: 'page_style_quiz_bridal_lace_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/24/00/0adada5e3d43e27b09b7b08b9f822400.png',
              filterName: this.nl('page_common_embellishment_sequins'),
              filterKey: 'sequins',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_sequins_alt',
              title: 'page_style_quiz_bridal_sequins_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/9f/8a/bb194f0046c916c11876bdf5cc049f8a.png',
              filterName: this.nl('page_common_embellishment_beaded'),
              filterKey: 'beaded',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_beaded_alt',
              title: 'page_style_quiz_bridal_beaded_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/cd/40/3c4b02e45554027001b2cfad5a1bcd40.png',
              filterName: this.nl('page_common_embellishment_pleated'),
              filterKey: 'pleated',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_pleated_alt',
              title: 'page_style_quiz_bridal_pleated_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/65/80/f89404f99413444b13042ff3185b6580.png',
              filterName: this.nl('page_common_embellishment_ruched'),
              filterKey: 'ruched',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_ruched_alt',
              title: 'page_style_quiz_bridal_ruched_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/2d/49/88d31ef2addd3daa6fbc0a9fccbb2d49.png',
              filterName: this.nl('page_common_embellishment_bow_s'),
              filterKey: 'bow(s)',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_bow_s_alt',
              title: 'page_style_quiz_bridal_bow_s_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/e6/0c/5ae0392c30c24bba13cd2c747fc1e60c.png',
              filterName: this.nl('page_common_embellishment_cascading_ruffles'),
              filterKey: 'cascading_ruffles',
              multi: true,
              filterType: 'embellishment',
              imgAlt: 'page_style_quiz_bridal_cascading_ruffles_alt',
              title: 'page_style_quiz_bridal_cascading_ruffles_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/ca/64/63afb2a6a17407c227d000d9cc79ca64.png',
              filterName: this.nl('page_common_features_belt_sash'),
              filterKey: 'belt/sash',
              multi: true,
              filterType: 'features',
              imgAlt: 'page_style_quiz_bridal_belt_sash_alt',
              title: 'page_style_quiz_bridal_belt_sash_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/eb/68/b937fd35b1536a23f986cd77e651eb68.png',
              filterName: this.nl('page_common_features_side_slit'),
              filterKey: 'leg_slit',
              multi: true,
              filterType: 'features',
              imgAlt: 'page_style_quiz_bridal_side_slit_alt',
              title: 'page_style_quiz_bridal_side_slit_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/95/21/f4656e1593bc168c3bee3049fdff9521.png',
              filterName: this.nl('page_common_features_pockets'),
              filterKey: 'pockets',
              multi: true,
              filterType: 'features',
              imgAlt: 'page_style_quiz_bridal_pockets_alt',
              title: 'page_style_quiz_bridal_pockets_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/43/7d/c144356b841babaad1f03f3159ef437d.png',
              filterName: this.nl('page_common_features_detachable_train'),
              filterKey: 'detachable_train',
              multi: true,
              filterType: 'features',
              imgAlt: 'page_style_quiz_bridal_detachable_train_alt',
              title: 'page_style_quiz_bridal_detachable_train_title'
            },
            {
              imgUrl: 's_20180723.gif',
              dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/c3/32/d7936a894c5e2861a70aa1cbdd96c332.png',
              filterName: this.nl('page_common_features_convertible'),
              filterKey: 'convertible',
              multi: true,
              filterType: 'features',
              imgAlt: 'page_style_quiz_bridal_convertible_alt',
              title: 'page_style_quiz_bridal_convertible_title'
            }
          ]
        }
      ]
      this.styleQuizBridal = {
        entry: {
          imgUrl: 's_20180723.gif',
          dataUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/15/c6/29b3cac23ffb5124899465e1a0ac15c6.gif',
          imgAlt: 'page_style_quiz_bridal_entry_alt',
          header: 'page_header_bridal_style_finder',
          title: 'page_style_quizlayer_entry_title',
          text: 'page_common_style_quiz'
        },
        content: {
          buttonPrevText: this.nl('page_common_style_quiz_back'),
          buttonNextText: this.nl('page_common_style_quiz_skip'),
          spanIsLastText: this.nl('page_common_style_quiz_view_all'),
          list: this.setFilterNameByType(newList)
        },
        countTipText: this.nl('page_category_match_dressed')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.selected_style {
  .img-box {
    border-color: @theme;
  }
  .img-border {
    border-color: #fff;
    cursor: pointer;
  }
  h5 {
    color: @theme-color;
    cursor: pointer;
  }
}
.style_quiz_bridal_entry {
  position: relative;
  width: 940px;
  height: 700px;
  z-index: 10;
  border: solid 1px var(--color-121212);
  background-color: #fff;
  .layer-close {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .first-screen {
    width: 940px;
    height: 700px;
    img.wd_style_quiz {
      width: 940px;
      height: 700px;
    }
    .entry_content_box {
      position: absolute;
      bottom: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .entry_title {
        font-size: 32px;
        font-family: @font-Ivy-Mode-700;
        color: #fff;
        line-height: 40px;
        text-transform: uppercase;
      }
      .entry_description {
        font-size: 24px;
        font-family: @font-family-500;
        color: #fff;
        line-height: 33px;
        margin-bottom: 25px;
        text-align: center;
      }
      span {
        cursor: pointer;
        display: inline-block;
        width: 210px;
        height: 50px;
        color: #fff;
        font-size: 14px;
        font-family: @font-family-600;
        line-height: 50px;
        text-align: center;
        text-transform: uppercase;
        background-color: @theme;
      }
    }
  }
  .swiper-container {
    width: 940px;
    height: 700px;
    .style_quiz_content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 50px 30px;
      h4 {
        font-size: 24px;
        font-family: @font-Ivy-Mode-700;
        color: var(--color-121212);
        line-height: 24px;
        text-align: center;
        margin-bottom: 23px;
        cursor: default;
        text-transform: uppercase;
      }
      h4.multi {
        margin-bottom: 20px;
      }
      .multi-select {
        color: #666;
        margin-top: 10px;
        font-size: 14px;
        line-height: 14px;
        font-weight: normal;
        font-family: @font-family-500;
        text-transform: none;
      }
      .content_box_style {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        .img-box {
          border: 3px solid transparent;
          position: relative;
          .img-border {
            position: absolute;
            border: 3px solid transparent;
            top: 0;
            left: 0;
            box-sizing: border-box;
          }
        }
        .style_content_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100/6%;
          img,
          .img-border {
            display: block !important;
            width: 134px !important;
            height: 180px !important;
          }
        }
        .detail_content_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100/6%;
          img,
          .img-border {
            display: block !important;
            width: 100px !important;
            height: 100px !important;
          }
        }
        .silhouette_content_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 20%;
          img,
          .img-border {
            display: block !important;
            width: 141px !important;
            height: 210px !important;
          }
        }
        h5 {
          margin: 10px 0 20px;
          text-align: center;
          font-size: 13px;
          font-family: @font-family-500;
          font-weight: normal;
          color: var(--color-121212);
          word-break: break-all;
        }
        & > div {
          &:hover,
          &.selected {
            .selected_style;
            .text-content {
              border-color: #fff;
            }
          }
        }
        .price_content_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 25%;
          padding: 10px 0;
          .img-box {
            border: 3px solid transparent;
            position: relative;
          }
          .text-content {
            width: 200px !important;
            height: 200px !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 2px solid #c1a767;
            .text {
              font-family: @font-Ivy-Mode-400;
              font-size: 18px;
              line-height: 22px;
              text-align: center;
              text-transform: uppercase;
              color: #c1a767;
              &.big {
                font-size: 36px;
                line-height: 45px;
              }
              &.middle {
                font-size: 32px;
              }
            }
          }
          h5 {
            text-transform: capitalize;
          }
        }
        .selleve_content_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100/3%;
          img,
          .img-border {
            display: block !important;
            width: 141px !important;
            height: 156px !important;
          }
        }
      }
      .about_feature {
        justify-content: flex-start;
        margin-left: 20px;
      }
      &.silhouette_content_box-wrapper {
        margin-top: 90px;
        .content_box_style {
          margin-top: 90px;
          justify-content: space-between;
        }
      }
      &.price_content_box-wrapper {
        margin-top: 90px;
        .content_box_style {
          margin-top: 90px;
          justify-content: space-between;
        }
      }
      &.selleve_content_box-wrapper {
        margin: 47px 169px 0 169px;
        .content_box_style {
          margin-top: 50px;
          justify-content: space-between;
        }
      }
      &.detail_content_box-wrapper {
        margin: 89px 60px 0;
        .content_box_style {
          margin-top: 70px;
          justify-content: space-between;
        }
      }
    }
  }
  .swiper-slide {
    background: url('https://cdn-1.azazie.com/upimg/userfiles/reviews/84/e3/75239f4d16aa2e1a08b8e203b57484e3.png');
  }
  .swiper-pagination {
    bottom: 35px;
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
    /deep/ .swiper-pagination-bullet-active {
      background: #666 !important;
    }
    /deep/ .swiper-pagination-bullet {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 100%;
      background: #ccc;
      margin: 0 5px;
      opacity: 1 !important;
      cursor: pointer;
      &:focus,
      &:active {
        outline: none;
      }
    }
  }
  .button-box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 63px;
    z-index: 10;
    font-size: 13px;
    font-family: @font-family-500;
    color: #999;
    line-height: 40px;
    .swiper-prev-button {
      float: left;
      cursor: pointer;
      outline: none;
      margin-left: 35px;
      color: var(--color-121212);
      font-size: 14px;
    }
    .swiper-next-button,
    .show-result-btn {
      cursor: pointer;
      outline: none;
      width: 210px;
      height: 50px;
      background-image: none;
      background-color: @theme;
      line-height: 50px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-family: @font-family-600;
      text-transform: uppercase;
      margin: 0 auto;
      &:hover {
        background-color: @theme-hover;
      }
    }
  }
  .count_tip {
    position: absolute;
    bottom: 80px;
    right: 35px;
    font-size: 13px;
    font-family: @font-family-500;
    color: #666;
    line-height: 18px;
    z-index: 1;
  }
}
</style>
