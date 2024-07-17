<template>
  <div class="content-submission-agreement">
    <main-app :navigation="navigation">
      <div class="content-submission-agreement-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <h1 class="title">{{ nl('page_common_csa_title') }}</h1>
          <div class="item-block">
            <p v-html="nl(rules.description)" class="top-content-item bold-text"></p>
            <h3 v-html="nl(rules.title)" class="sub-title bold-text"></h3>
            <ol>
              <li v-for="(mainItem, mainIndex) in rules.contents" :key="mainIndex">
                <span class="main-sub-title bold-text">{{ nl(mainItem.title) }}</span>
                <ol>
                  <li v-for="(subItem, subIndex) in mainItem.children" :key="subIndex" class="text-part">
                    <span class="text-part-item">{{ nl(subItem.text) }}</span>
                    <span v-for="(tribleItem, tribleIndex) in subItem.children" :key="tribleIndex" class="text-part-item-sub">
                      {{ nl(tribleItem) }}
                    </span>
                  </li>
                </ol>
              </li>
            </ol>
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
import HelpMenu from '@/components/common/HelpMenu'
export default {
  name: 'PrivacyPolicy',
  components: {
    MainApp,
    backToTop,
    HelpMenu
  },
  data() {
    return {
      currentMenuTitle: '',
      rules: {
        description: 'page_common_csa_description',
        title: 'page_common_csa_main_title',
        contents: [
          {
            title: 'page_common_csa_content_one_title',
            children: [
              {
                text: 'page_common_csa_content_one_c_1_text',
                children: [
                  'page_common_csa_content_one_c_1_c_1',
                  'page_common_csa_content_one_c_1_c_2',
                  'page_common_csa_content_one_c_1_c_3',
                  'page_common_csa_content_one_c_1_c_4',
                  'page_common_csa_content_one_c_1_c_5',
                  'page_common_csa_content_one_c_1_c_6',
                  'page_common_csa_content_one_c_1_c_7'
                ]
              },
              {
                text: 'page_common_csa_content_one_c_2_text',
                children: []
              },
              {
                text: 'page_common_csa_content_one_c_3_text',
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_two_title`,
            children: [
              {
                text: `page_common_csa_content_two_c_1_text`,
                children: [
                  `page_common_csa_content_two_c_1_c_1`,
                  'page_common_csa_content_two_c_1_c_2',
                  'page_common_csa_content_two_c_1_c_3',
                  'page_common_csa_content_two_c_1_c_4'
                ]
              }
            ]
          },
          {
            title: `page_common_csa_content_three_title`,
            children: [
              {
                text: `page_common_csa_content_three_c_1_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_four_title`,
            children: [
              {
                text: 'page_common_csa_content_four_c_1_text',
                children: []
              },
              {
                text: `page_common_csa_content_four_c_2_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_3_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_4_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_5_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_6_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_7_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_8_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_9_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_10_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_11_text`,
                children: []
              },
              {
                text: `page_common_csa_content_four_c_12_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_five_title`,
            children: [
              {
                text: `page_common_csa_content_five_c_1_text`,
                children: []
              },
              {
                text: 'page_common_csa_content_five_c_2_text',
                children: ['page_common_csa_content_five_c_2_c_1', 'page_common_csa_content_five_c_2_c_2']
              },
              {
                text: `page_common_csa_content_five_c_3_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_six_title`,
            children: [
              {
                text: `page_common_csa_content_six_c_1_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_seven_title`,
            children: [
              {
                text: `page_common_csa_content_seven_c_1_text`,
                children: []
              },
              {
                text: `page_common_csa_content_seven_c_2_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_eight_title`,
            children: [
              {
                text: `page_common_csa_content_eight_c_1_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_nine_title`,
            children: [
              {
                text: `page_common_csa_content_nine_c_1_text`,
                children: []
              },
              {
                text: `page_common_csa_content_nine_c_2_text`,
                children: []
              }
            ]
          },
          {
            title: `page_common_csa_content_ten_title`,
            children: [
              {
                text: `page_common_csa_content_ten_c_1_text`,
                children: []
              }
            ]
          }
        ]
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/privacy-policy`)
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
      context.store.commit('setJsKey', 'content-submission-agreement')
      return {
        ...commonAsyncData,
        // seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        contents: res.data.contents || {}
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
.content-submission-agreement {
  .top-content-item {
    margin: 15px 0 25px;
    font-size: 13px;
    line-height: 18px;
  }
  .sub-title {
    margin-top: 25px;
  }
  ol {
    list-style-type: none;
    counter-reset: page;
    .main-sub-title {
      display: inline-block;
      margin: 40px 0 15px;
      text-transform: uppercase;
    }
    .text-part-item {
      font-family: @font-family-500;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      & + .text-part-item-sub {
        margin-top: 15px;
      }
    }
    li {
      margin-bottom: 15px;
      counter-increment: page;
      &::before {
        content: counters(page, '.') '.';
      }
    }
    .text-part {
      counter-reset: section;
      &:is(:last-child) {
        margin-bottom: -15px;
      }
    }
    .text-part-item-sub {
      display: block;
      margin-bottom: 10px;
      &::before {
        counter-increment: section;
        content: '(' counter(section, lower-roman) ')';
        padding-right: 2px;
      }
    }
  }
  .bold-text {
    font-family: @font-family-600;
    font-size: 14px;
    line-height: 19px;
    color: var(--color-121212);
  }
}
</style>
<style lang="less">
.content-submission-agreement {
  .text-up {
    text-transform: uppercase;
  }
}
</style>
