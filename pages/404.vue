<template>
  <div class="page404-box">
    <main-app :navigation="navigation">
      <div class="guided-entry-menu">
        <a
          v-for="(item, index) in settled"
          :key="index"
          v-track.view.click="{ common: getBiParams('404_error', item.cat_name.toLowerCase()) }"
          :href="countryUrl(item.url)"
          class="guided-entry-menu-item"
        >
          {{ item.title }}
        </a>
      </div>
      <div class="page404-main">
        <div class="content">
          <p class="desc-text">{{ tips && tips.desc }}</p>
          <template v-if="tips.button">
            <div v-for="(item, key, index) in tips.button" :key="key">
              <a
                v-track.view.click="{ common: getBiParams('404_error', 'shop_similar', key) }"
                :href="countryUrl(item.linkUrl)"
                :class="index === 0 ? 'btn-theme' : 'btn-white'"
                class="btn"
              >
                <span>{{ item.desc }}</span>
              </a>
            </div>
          </template>
          <template v-else>
            <p>
              <a id="btn-shop-bridesmaids" :href="countryUrl('/all/bridesmaid-dresses')" class="btn btn-theme">
                <span>{{ nl('page_common_shop_bridesmaids') }}</span>
              </a>
            </p>
            <p>
              <a id="btn-shop-brides" :href="countryUrl('/all/wedding-dresses')" class="btn btn-white">
                <span>{{ nl('page_common_shop_brides') }}</span>
              </a>
            </p>
          </template>
        </div>
        <most-popular
          v-if="allGoods.prodList && Object.keys(allGoods.prodList).length > 0"
          :title="allGoods.title"
          :mostPopular="allGoods"
          scene="404_error"
        ></most-popular>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import MostPopular from '@/components/index/MostPopular'
import { countryList } from '@/assets/js/euSizeMap'

export default {
  name: 'P404',
  languageKeys: [
    'page_common_shop_bridesmaids',
    'page_common_shop_brides',
    'page_header_sale_shop_all',
    'page_common_try_on_for',
    'page_index_shop_now',
    'page_order_dress',
    'page_showroom_quick_shop',
    ...countryList.map((v, i) => 'page_common_try_on_number_for_wd_' + v),
    ...countryList.map((v, i) => 'page_common_try_on_number_for_' + v),
    ...backToTop.languageKeys
  ],
  components: {
    MainApp,
    backToTop,
    MostPopular
  },
  props: {
    // 详情页对于下架商品显示404页面内容
    bindObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  // todo  等接口
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const params = {
        originUrl: context.route.query.originUrl
      }
      const res = await context.$axios.$get(`/1.0/error/p404`, { params })
      if (res.code == 0) {
        // todo
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + '/404')
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      context.store.commit('setJsKey', '404')
      context.res.statusCode = 404
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        tips: res.data.Tips || {},
        allGoods: res.data.goods || {},
        settled: res.data.settled || []
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    // 详情页对于下架商品显示404页面内容
    if (this.bindObj && Object.keys(this.bindObj).length) return
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    // 详情页对于下架商品显示404页面内容
    if (this.bindObj && Object.keys(this.bindObj).length) {
      this.tips = this.bindObj.tips
      this.allGoods = this.bindObj.allGoods
      this.settled = this.bindObj.settled
    }
  },
  methods: {
    getBiParams(ec, el, key) {
      if (process.server) return
      if (key && key === 'default') {
        el = 'shop_now'
      }
      return {
        ec,
        el
      }
    }
  }
}
</script>

<style lang="less" scope>
.page404-box {
  .guided-entry-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-item {
      flex: 1;
      margin-right: 15px;
      height: 59px;
      background: #f8f2ef;
      font-size: 14px;
      line-height: 59px;
      font-family: @font-family-600;
      text-align: center;
      cursor: pointer;
      color: var(--color-121212);
      text-transform: capitalize;
      &:last-of-type {
        margin-right: 0px;
      }
    }
  }
  .page404-main {
    min-width: 768px;
    max-width: 1353px;
    margin: 0 auto;
    clear: both;
    padding: 9px 20px 20px 20px;
    min-height: 535px;
    .content {
      width: 800px;
      margin: 60px auto;
      text-align: center;
      p {
        text-align: center;
      }
      .desc-text {
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 22px;
        color: var(--color-121212);
      }
      .btn {
        padding: 0;
        width: 214px;
        height: 42px;
        border-radius: 0;
        font-family: @font-family-600, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        text-transform: uppercase;
        font-size: 14px;
        margin: 0 auto;
      }
      .btn-theme {
        background: var(--color-121212);
        color: #fff;
        margin-top: 25px;
        margin-bottom: 10px;
        &:hover {
          background: var(--color-1e1e1e);
        }
      }
      .btn-white {
        background: #fff;
        border: 1px solid #ccc;
        color: var(--color-121212);
        margin-bottom: 10px;
        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
