<template>
  <div class="sitemap">
    <main-app :navigation="navigation">
      <div class="sitemap-content">
        <order-breadcrumb :listCrumb="listCrumb"></order-breadcrumb>
        <h1 class="sitemap-title">{{ title }}</h1>
        <div v-if="list.length" class="sitemap-list">
          <div v-for="(item, index) in list" :key="index" class="sitemap-list-children">
            <h2 v-if="item.title" class="sub-title">
              {{ item.title }}
            </h2>
            <div class="sitemap-list-children-list">
              <div v-for="(it, idx) in item.list" :key="idx" class="sitemap-list-item">
                <div v-if="item.list[0] && item.list[0].title" class="sub-title-h3">
                  <h3 v-if="it.title" class="sub-title">
                    {{ it.title }}
                  </h3>
                </div>
                <ul v-if="it.list && it.list.length" class="sub-content">
                  <li v-for="(ele, ix) in it.list" :key="ix" class="sub-item">
                    <a :href="countryUrl(ele.url)" :aria-label="it.title + ' ' + ele.title">{{ ele.title }}</a>
                  </li>
                </ul>
              </div>
              <div v-for="it in 4" :key="it" :class="'sitemap-list-item' + it" class="sitemap-list-item"></div>
            </div>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import OrderBreadcrumb from '@/components/order/OrderBreadcrumb'
export default {
  name: 'SiteMap',
  components: {
    MainApp,
    backToTop,
    OrderBreadcrumb
  },
  data() {
    return {
      listCrumb: [{ name: this.nl('page_sitemap_description') }]
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/sitemap`)
      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }

      // 处理list内容数据结构，让每一列最多显示5行
      const list = res.data.list || []
      const resList = []
      if (list.length) {
        list.forEach((ele) => {
          const tempList = {
            title: ele.title,
            list: []
          }
          if (ele.list) {
            ele.list.forEach((item) => {
              const tempArr = []
              if (item.list && item.list.length > 5) {
                for (let i = 0; i < Math.ceil(item.list.length / 5); i++) {
                  const arr = []
                  for (let x = i * 5; x < i * 5 + 5; x++) {
                    const it = item.list[x]
                    if (it) arr.push(it)
                  }
                  tempArr.push({
                    list: arr,
                    title: i === 0 ? item.title : ''
                  })
                }
              } else {
                tempArr.push(item)
              }
              tempList.list.push(...tempArr)
            })
          }
          resList.push(tempList)
        })
      }

      context.store.commit('setJsKey', 'size_map')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        list: resList,
        title: res.data.title || ''
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
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  }
}
</script>

<style lang="less" scoped>
.sitemap-content {
  width: 83.33%;
  max-width: 1600px;
  margin: 0 auto;
  clear: both;
  min-height: 535px;
  /deep/ #bread_crumb {
    max-width: 1600px;
  }
  .sitemap-title {
    padding: 5px 0px;
    border-bottom: solid 1px var(--color-121212);
    font-size: 18px;
    font-weight: normal;
    text-transform: uppercase;
    margin: 15px 0px 30px;
    font-family: @font-family-600, sans-serif;
  }
  .sitemap-list {
    word-wrap: break-word;
    &-children {
      margin-top: 10px;
      &-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
    &-item {
      width: 304px;
      margin-bottom: 30px;
    }
    .sub-title {
      font-family: @font-family-600, sans-serif;
      text-transform: uppercase;
      color: var(--color-121212);
      &-h3 {
        min-height: 17.5px;
        line-height: 17.5px;
        margin-bottom: 20px;
      }
    }
    h2.sub-title {
      font-size: 16px;
      margin-bottom: 30px;
    }
    h3.sub-title {
      font-size: 14px;
    }
    .sub-content {
      .sub-item {
        margin-bottom: 10px;
        &:last-of-type {
          margin-bottom: 0px;
        }
        a {
          // text-decoration: underline;
          color: var(--color-121212);
          font-size: 13px;
          border-bottom: 1px solid var(--color-121212);
          &:hover {
            color: #666;
            border-color: #666;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1460px) {
  .sitemap-content {
    .sitemap-list {
      &-item3,
      &-item4 {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 1825px) {
  .sitemap-content {
    .sitemap-list {
      &-item4 {
        display: none;
      }
    }
  }
}
</style>
