<template>
  <div id="product_page_revires" class="reviews-box">
    <div id="prod_reviews" class="prod-reviews">
      <div :class="['review-top-block', { wgd: isSpecialCatId(catId) }]">
        <div v-if="from == 'product'" class="prod-heading">
          <div class="show_overall_rating">
            <template v-if="isSpecialCatId(catId)">
              <div class="rating_avg-b">
                <div class="rating-left">
                  <div class="rate-box">
                    <az-rate
                      :value="reviewInfo.rating * 1"
                      :readonly="true"
                      :showScore="false"
                      :textStyle="{ 'margin-left': '10px', 'font-family': '@font-family-600' }"
                      :style="{ display: 'block' }"
                      :fontStarSize="'16px'"
                    ></az-rate>
                    <p class="rate-box-review">({{ reviewInfo.totalCount }}&nbsp;{{ nl('page_reviews_description') }})</p>
                  </div>
                  <div class="over-fit">
                    <span>{{ nl('page_goods_your_fit_photo') }}: </span>{{ nl('page_common_true_to_size') }}
                  </div>
                </div>
                <customer-photo v-if="!!customPhotoList.length" :customPhotoList="customPhotoList" :baseInfo="baseInfo"></customer-photo>
              </div>
            </template>
            <template v-else>
              <div class="rating_avg">
                <label>{{ nl('page_review_over_all_rating') }}</label>
                <az-rate
                  :value="reviewInfo.rating * 1"
                  :readonly="true"
                  :showScore="false"
                  :textStyle="{ 'margin-left': '10px', 'font-family': '@font-family-600' }"
                  :style="{ margin: '15px 15px 10px 0', display: 'block' }"
                  :fontStarSize="'24px'"
                ></az-rate>
                <p>
                  {{ nl('page_product_reviews_based_on') }} {{ reviewInfo.totalCount }}
                  <span style="text-transform: lowercase;">{{ nl('page_reviews_description') }}</span>
                </p>
              </div>
              <template v-if="!fit_catIds.includes(baseInfo.catId)">
                <div v-if="reviewInfo.fitRating > 0" class="fit">
                  <label>{{ nl('page_goods_your_fit_photo') }}</label>
                  <div class="fit_pic_all">
                    <az-icon icon-class="icon-daxiaojindutiao" class="icon-fit"></az-icon>
                    <div :style="fitPosition" class="red_point"></div>
                  </div>
                  <span class="small">{{ nl('page_review_fit_small') }}</span>
                  <span>{{ nl('page_review_fit_large') }}</span>
                </div>
              </template>
              <div class="wr_a fr">
                <a @click="writeReviewBtn" class="write-review">{{ nl('page_category_write_a_review') }}</a>
              </div>
            </template>
          </div>
        </div>
        <div v-if="reviewInfo.reviewFilter" class="review_filter_block">
          <div class="review-filter">
            <div class="review_filter_title">{{ nl('page_review_refine_by') }}:</div>
            <div>
              <az-select
                :allSelectName="reviewInfo.reviewFilter.star_rating.name"
                :defaultSelectedArray="reviewsFilters.star"
                :selectList="starList"
                :mode="true"
                :selectOptionStyle="{ 'min-width': '120px' }"
                :id="'reviewFilter-star_rating'"
                @change="reviewFilterHandleChange($event, 'starrating')"
                style="min-width: 120px;vertical-align: middle;margin-right: 8px;"
              ></az-select>
              <az-select
                v-if="reviewInfo.reviewFilter.fit"
                :allSelectName="reviewInfo.reviewFilter.fit.name"
                :defaultSelectedArray="reviewsFilters.fit"
                :selectList="fitList"
                :mode="true"
                :selectOptionStyle="{ 'min-width': '150px' }"
                :id="'reviewFilter-fit'"
                @change="reviewFilterHandleChange($event, 'fit')"
                style="min-width: 70px;vertical-align: middle;margin-right: 8px;"
              ></az-select>
              <az-select
                :allSelectName="reviewInfo.reviewFilter.color.name"
                :defaultSelectedArray="reviewsFilters.color"
                :selectList="colorList"
                :mode="true"
                :selectOptionStyle="{ 'min-width': '107px' }"
                :id="'reviewFilter-color'"
                @change="reviewFilterHandleChange($event, 'color')"
                style="min-width: 87px;vertical-align: middle;"
              ></az-select>
            </div>
          </div>

          <div class="review-sort-by">
            <span
              v-for="(item, index) in sortByList"
              :key="index"
              @click="reviewFilterHandleChange(item.value, 'sortBy')"
              :class="{ checked: reviewsFilters.sortBy[0] == item.value }"
              class="review-sort-by-item"
            >
              {{ item.name }} {{ item.key == 'photo_reviews' ? `(${item.number})` : '' }}
              <az-icon v-if="['ratings', 'helpfulness'].includes(item.value)" icon-class="iconshengxu" class="icon-sort-up"></az-icon>
            </span>
          </div>
        </div>
      </div>
      <template v-if="reviewList.length">
        <div id="review_list" v-track.view.click="getTrackCommon()" class="prod-reviews-list review_list">
          <product-review-item
            v-for="(item, index) in reviewList"
            :key="item.id"
            :info="item"
            :itemIndex="index"
            :fitCatIds="fit_catIds"
            :baseInfo="baseInfo"
            @openPreview="openPreview"
          ></product-review-item>
        </div>
      </template>
    </div>
    <div class="review_see_all">
      <az-pager
        v-if="reviewList.length"
        :totalPage="reviewInfo.pageInfo.totalPage"
        :page="page"
        :isLoading="pageLoading"
        @pageChange="pageChange"
      ></az-pager>
      <div
        v-if="reviewList.length && from == 'product'"
        class="see_all_review_div need_datalayer"
        data-datalayer-category="PC_DetailPageRevision"
        data-datalayer-label="DetailPageA_SeeMoreReviews_Click"
      >
        <a v-track.view.click="{ common: { ec: 'reviews', el: 'seemorereviews' } }" :href="getMoreUrl(baseInfo)">{{
          nl('page_review_see_more')
        }}</a>
      </div>
    </div>
    <review-photo-preview
      v-if="previewImgList.length"
      :index="previewImgIndex"
      :srcList="previewImgList"
      @close="resetPreviewImg"
      name="Azazie Sedona BG"
    ></review-photo-preview>
    <popup-write-reviews
      v-if="writeReviewFlag && from == 'product'"
      @close="writeReviewFlag = false"
      :fitCatIds="fit_catIds"
      :baseInfo="baseInfo"
      :size="size"
      @success="writeSuccess"
    ></popup-write-reviews>
    <write-reviews-success
      v-if="writeReviewSuccessFlag && from == 'product'"
      @close="writeReviewSuccessFlag = false"
      :successData="successData"
    ></write-reviews-success>
  </div>
</template>

<script>
import AzPager from '@/components/az-ui/Pager/AzPager'
import AzSelect from '@/components/az-ui/Select/AzSelect'
import AzRate from '@/components/az-ui/Rate/AzRate'
import ProductReviewItem from './ProductReviewItem'
import ReviewPhotoPreview from './ReviewPhotoPreview'
import WriteReviewsSuccess from './WriteReviewsSuccess'
import PopupWriteReviews from './PopupWriteReviews'
import CustomerPhoto from './CustomerPhoto'

export default {
  name: 'ProductReviews',
  languageKeys: [
    'page_reviews_description',
    'page_goods_your_fit_photo',
    'page_common_true_to_size',
    'page_review_over_all_rating',
    'page_product_reviews_based_on',
    'page_reviews_description',
    'page_goods_your_fit_photo',
    'page_review_fit_small',
    'page_review_fit_large',
    'page_category_write_a_review',
    'page_review_refine_by',
    'page_review_see_more',
    ...AzRate.languageKeys,
    ...ProductReviewItem.languageKeys,
    ...WriteReviewsSuccess.languageKeys,
    ...PopupWriteReviews.languageKeys,
    ...CustomerPhoto.languageKeys,
    ...AzPager.languageKeys
  ],
  components: {
    AzRate,
    AzSelect,
    ProductReviewItem,
    ReviewPhotoPreview,
    WriteReviewsSuccess,
    PopupWriteReviews,
    AzPager,
    CustomerPhoto
  },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    reviewInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: Array,
      default() {
        return []
      }
    },
    from: {
      type: String,
      default: 'product'
    },
    customPhotoList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      fit_catIds: [],
      previewImgList: [],
      previewImgIndex: 0,
      reviewList: [],
      page: 1,
      pageLoading: false,
      writeReviewFlag: false,
      writeReviewSuccessFlag: false,
      successData: {},
      starList: [],
      fitList: [],
      colorList: [],
      sortByList: [],
      reviewsFilters: {
        star: [],
        fit: [],
        color: [],
        sortBy: []
      },
      isReviewInit: false
    }
  },
  computed: {
    fitPosition() {
      return this.reviewInfo.fitRating ? { right: `${(5 - this.reviewInfo.fitRating) * 25}%` } : {}
    }
  },
  watch: {
    reviewInfo: {
      handler(newVal) {
        if (!Object.keys(this.reviewsFilters.sortBy).length > 0) this.reviewsFilters.sortBy = []
        newVal.reviewList && (this.reviewList = newVal.reviewList)
        if (newVal.pageInfo) {
          this.page = newVal.pageInfo.page
        }
        if (newVal.reviewFilter) {
          if (!Object.keys(this.reviewsFilters.sortBy).length > 0 && !this.isReviewInit) {
            // this.reviewsFilters.sortBy.push(newVal.reviewFilter.sort_by.data[Object.keys(newVal.reviewFilter.sort_by.data)[0]].key)
            this.isReviewInit = true
          }
          this.starList = []
          this.fitList = []
          this.colorList = []
          this.sortByList = []
          for (const key in newVal.reviewFilter.star_rating.data) {
            this.starList.push(newVal.reviewFilter.star_rating.data[key])
          }
          this.starList.reverse()
          if (newVal.reviewFilter.fit) {
            for (const key in newVal.reviewFilter.fit.data) {
              this.fitList.push(newVal.reviewFilter.fit.data[key])
            }
          }
          for (const key in newVal.reviewFilter.color.data) {
            this.colorList.push(newVal.reviewFilter.color.data[key])
          }
          for (const key in newVal.reviewFilter.sort_by.data) {
            this.sortByList.push(newVal.reviewFilter.sort_by.data[key])
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.fit_catIds = this.reviewInfo.noFitFilter || []
  },
  methods: {
    reviewFilterHandleChange(val, el) {
      this.setPoint('reviews', el, 'click')
      if (el == 'starrating') {
        this.reviewFilterChange('star', val)
      } else {
        this.reviewFilterChange(el, val)
      }
    },
    reviewFilterChange(key, val) {
      if (key == 'sortBy') {
        if (this.reviewsFilters.sortBy[0] == val) {
          this.reviewsFilters[key] = []
        } else {
          this.reviewsFilters[key] = [val]
        }
      } else {
        this.reviewsFilters[key] = val
      }
      this.$emit('reviewsChange', {
        star: this.filtersKeyToValue(this.starList, 'star'),
        fit: this.filtersKeyToValue(this.fitList, 'fit'),
        color: this.filtersKeyToValue(this.colorList, 'color'),
        sortBy: this.reviewsFilters.sortBy,
        page: this.page,
        isPageChange: false
      })
    },
    filtersKeyToValue(list, key) {
      const res = []
      list.map((item) => {
        this.reviewsFilters[key].map((element) => {
          if (item.key == element) {
            res.push(item.value)
          }
        })
      })
      return res
    },
    openPreview(obj) {
      this.previewImgIndex = obj.index
      this.previewImgList = obj.list
    },
    resetPreviewImg() {
      this.previewImgIndex = 0
      this.previewImgList = []
    },
    pageChange(val, item) {
      if (item == 'page') {
        this.setPoint(
          'reviews',
          'page' + val,
          'click',
          JSON.stringify({ page: val, cat_name: this.baseInfo.catName, dress_type: this.baseInfo.dressType || this.dressType })
        )
      } else if (item == 'prev') {
        this.setPoint('reviews', 'previouspage', 'click')
      } else if (item == 'next') {
        this.setPoint('reviews', 'nextpage', 'click')
      }
      this.page = val
      this.$emit('reviewsChange', {
        star: this.filtersKeyToValue(this.starList, 'star'),
        fit: this.filtersKeyToValue(this.fitList, 'fit'),
        color: this.filtersKeyToValue(this.colorList, 'color'),
        sortBy: this.reviewsFilters.sortBy,
        page: this.page,
        isPageChange: true
      })
    },
    writeReviewBtn() {
      this.setPoint('reviews', 'writereview', 'click')
      this.setDataLayer({
        action: 'click',
        category: 'PC_DetailPageRevision',
        label: `DetailPageA_WriteAReview_Click`
      })
      if (!this.isLogin) {
        this.$store.commit('setShowSignLayer', true)
        this.$parent.signLayerSource = ''
      } else {
        this.writeReviewFlag = true
      }
    },
    writeSuccess(data) {
      this.writeReviewFlag = false
      this.writeReviewSuccessFlag = true
      this.successData = data
    },
    setPoint(ec, el, ea, msg = {}) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(msg)
      })
    },
    getTrackCommon() {
      return {
        common: {
          ec: 'reviews',
          el: 'entrance'
        }
      }
    },
    getMoreUrl(baseInfo) {
      if (this.isInCatIds(baseInfo.catId) && baseInfo.plus) {
        let url = this.navToGoodsDetail(this.reviewInfo.reviewUrl, baseInfo)
        if (/\?/.test(url)) {
          url += `&view_mode=plus`
        } else {
          url += `?view_mode=plus`
        }
        return url
      } else {
        return this.navToGoodsDetail(this.reviewInfo.reviewUrl, baseInfo)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix:after {
  content: '.';
  clear: both;
  height: 0;
  visibility: hidden;
  display: block;
}
.reviews-box {
  margin: 0 auto;
  .review-top-block {
    background-color: var(--color-f9f9f9);
    padding: 30px;
    padding-bottom: 20px;
    &.wgd {
      padding: 25px 30px;
      box-sizing: border-box;
      /deep/ #product_customer_photo {
        overflow: hidden;
      }
    }
    .prod-heading {
      h2 {
        border-bottom: 1px solid #ccc;
        padding-bottom: 8px;
        letter-spacing: 1px;
        font-size: 24px;
        font-weight: normal;
        text-transform: uppercase;
      }
      .show_overall_rating {
        width: 100%;
        color: var(--color-121212);
        display: flex;
      }
      .rating_avg {
        text-align: left;
        label {
          font-family: @font-family-600, sans-serif;
          text-transform: uppercase;
        }
      }
      .rating_avg-b {
        // padding: 25px 30px;
        width: 100%;
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 27px;
        box-sizing: border-box;
        .rating-left {
          .rate-box {
            display: flex;
            align-items: center;
            height: max-content;
            .rate-box-review {
              font-family: @font-family-600;
              font-size: 13px;
              height: 18px;
              line-height: 18px;
              color: var(--color-121212);
            }
          }
          .over-fit {
            margin-top: 6px;
            font-family: @font-family-500;
            font-size: 13px;
            height: 18px;
            line-height: 18px;
            color: var(--color-121212);
            span {
              font-family: @font-family-600;
            }
          }
        }
        /deep/ #product_customer_photo {
          margin-bottom: 0 !important;
          h2 {
            display: none;
          }
        }
        /deep/ .product-swiper {
          padding-top: 0;
          .img-box {
            max-width: 60px !important;
            height: 90px;
            img {
              width: 60px !important;
              height: 90px !important;
              margin-top: unset !important;
            }
          }
          .product-swiper-container {
            padding: 0 20px;
          }
        }
        /deep/ .upload-btn-box {
          display: none;
        }
      }
      .fit {
        text-align: left;
        margin-left: 138px;
        label {
          font-family: @font-family-600, sans-serif;
          text-transform: uppercase;
        }
        .fit_pic_all {
          position: relative;
          margin: 26px 0 15px;
          width: 186px;
          height: 8px;
          .icon-fit {
            width: 254.8px;
            color: #ccc;
            fill: currentColor;
          }
          .red_point {
            position: absolute;
            margin-top: -14px;
            width: 14px;
            height: 14px;
            background-color: @theme-color;
            border-radius: 50%;
          }
        }
        .small {
          margin-right: 184px;
        }
      }
      .wr_a {
        display: none;
        float: right;
        margin: 36px 30px 0 0;
        width: 140px;
        height: 34px;
        background-color: #fff;
        border: 1px solid @title-color;
        .write-review {
          width: 100%;
          padding: 8px 0 8px;
          text-align: center;
          text-transform: uppercase;
          font-size: 13px;
          font-family: @font-family-600, sans-serif;
          color: @title-color;
          display: inline-block;
          cursor: pointer;
        }
      }
    }
    .review_filter_block {
      padding-top: 25px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .review-sort-by {
        display: flex;
        height: 40px;
        margin-bottom: 10px;
        .review-sort-by-item {
          cursor: pointer;
          border: 1px solid #ccc;
          display: block;
          margin-right: 10px;
          padding: 8px 10px;
          &.checked {
            border: 1px solid @theme-color;
            color: @theme-color;
          }
          .icon-sort-up {
            fill: currentColor;
          }
        }
      }
      .review-filter {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .review_filter_title {
          font-family: @font-family-600, sans-serif;
          margin-right: 8px;
          text-transform: uppercase;
        }
        /deep/ .az-select-box {
          .select {
            border: 1px solid #ccc;
          }
        }
      }
    }
  }

  .review_see_all {
    padding-top: 28px;
    margin-top: -1px;
    border-top: 1px solid #fff;
    text-align: right;
    margin-bottom: 40px;
    position: relative;
    .see_all_review_div {
      margin-top: -20px;
      a {
        color: #666;
        text-decoration: underline;
      }
    }
  }
}
</style>
