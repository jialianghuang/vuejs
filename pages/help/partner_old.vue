<template>
  <div class="partner">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_common_partner') }}</h1>
      <div class="partner-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content help-right">
          <div class="help-preferred-partner block">
            <h2 class="title">{{ preferred.title }}</h2>
            <div class="list-box">
              <div v-for="(item, index) in preferred.list" :key="index" class="list-item">
                <a @click="linkToUrl(item.linkUrl)" :class="{ 'has-link': item.linkUrl && item.linkUrl != 'none' }">
                  <div class="img">
                    <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
                  </div>
                  <div class="txt">{{ item.title }}</div>
                </a>
              </div>
              <i class="list-item"></i>
              <i class="list-item"></i>
              <i class="list-item"></i>
              <i class="list-item"></i>
            </div>
          </div>
          <div class="footer">
            <h2 class="title">{{ footer.title }}</h2>
            <div v-html="footer.text" class="txt"></div>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
// 注意：此为原有的partner页面内容，13805需求作废，partner路径页面为新的零售商申请页面
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import HelpMenu from '@/components/common/HelpMenu'
export default {
  name: 'Partner',
  components: {
    MainApp,
    backToTop,
    HelpMenu
  },
  data() {
    return {
      currentMenuTitle: '',
      accountMenu: {}
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/partner`)
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
      context.store.commit('setJsKey', 'partner')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        preferred: res.data.preferred || {},
        normal: res.data.normal || {},
        footer: res.data.footer || {}
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
  },
  created() {},
  mounted() {},
  methods: {
    linkToUrl(url) {
      if (url && url != 'none') {
        if (['http'].includes(url)) {
          window.open(url)
        } else {
          window.open('http://' + this.WEB_ROOT + url)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.partner-main {
  .content {
    .block,
    .footer {
      .title {
        margin-bottom: 20px;
      }
      .list-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .has-link {
          cursor: pointer;
        }
        .list-item {
          text-align: center;
          min-height: 1px;
          vertical-align: top;
          margin-bottom: 40px;
          width: 25%;
          box-sizing: border-box;
          width: 215px;
          .img {
            border: 1px solid #eee;
            img {
              max-width: 100%;
              height: auto;
              max-height: 160px;
            }
          }
          .txt {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            text-transform: uppercase;
            font-size: 13px;
            color: var(--color-121212);
            background-color: #f6f6f6;
            user-select: none;
          }
        }
      }
      .txt {
        color: var(--color-121212);
      }
    }
    .help-partner {
      margin-top: -11px;
    }
  }
  .footer {
    margin-top: -11px;
    /deep/a {
      font-size: 13px;
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
}
</style>
