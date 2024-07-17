import Vue from 'vue'
import { pathToFilters } from '@/assets/js/utils.js'
const seoLanguages = require('../modules/supportSeoLanguage')
export default ({ app, store }) => {
  Vue.prototype.$store = store
  app.router.afterEach((to, from) => {
    // 路由导航确认之后需要确认是否是 list 链接，如果是的话，需要重置链接参数
    // storefrontView门店分享落地页跟列表页类似
    if (
      from.matched.length &&
      ((from.name === 'list' && to.name === 'list') ||
        (from.name === 'storefront-storefrontView' && to.name === 'storefront-storefrontView'))
    ) {
      // store.commit('list/setProdList', [])
      const seoLangPath = to.fullPath
      let tempPath = ''
      const currentSeoLanguages = seoLanguages.filter((item) => seoLangPath == `/${item}` || seoLangPath.startsWith(`/${item}/`))
      if (currentSeoLanguages.length) {
        tempPath = seoLangPath.substring(currentSeoLanguages[0].length + 1, seoLangPath.length)
      } else {
        tempPath = seoLangPath
      }
      const firstQuery = pathToFilters(tempPath, store)
      store.commit('list/setApiCatName', firstQuery.cat_name)
      store.commit('list/setApiDressType', firstQuery.dress_type)
      store.commit('list/setApiFilters', firstQuery.filtersObj)
      store.commit('list/setApiMkt', firstQuery.mkt)
      firstQuery.viewMode && store.commit('list/setApiViewMode', firstQuery.viewMode)
      if (firstQuery.query) {
        store.commit('list/setApiQuery', firstQuery.query)
        firstQuery.query.sod_view && store.commit('list/setSodView', firstQuery.query.sod_view)
        firstQuery.query.current_in_stock && store.commit('list/setCurrentInStock', firstQuery.query.current_in_stock)
      }
      // store.commit('list/setIsCanLoading', true)
      // store.commit('list/setLoadingFlag', true)
    }
  })
  app.router.beforeEach((to, from, next) => {
    // 路由导航确认之后需要确认是否是 list 链接，如果是的话，需要重置链接参数
    if (from.matched.length && from.name === 'list' && to.name === 'list') {
      store.commit('list/setProdList', [])
      store.commit('list/setIsCanLoading', true)
      store.commit('list/setLoadingFlag', true)
    }
    next()
  })
}
