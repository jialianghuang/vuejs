<template>
  <div class="new-privacy-policy content">
    <div class="new-privacy-policy-title">
      <h1>{{ nl('page_help_menu_privacy') }}</h1>
      <a href="https://privacy.azazie.com/privacy-request" target="_blank">{{ nl('page_common_privacy_request') }}</a>
    </div>
    <div class="new-privacy-policy-box">
      <div :class="['new-privacy-policy-menu', { 'fixed-menu': fixedClass, hide: isHide }]">
        <template v-for="(menuItem, menuIndex) in menu">
          <p v-if="menuItem.show" :key="menuIndex" @click="scrollIntoViewPort(menuItem.name)" class="anchor-link">
            <a :href="menuItem.name">{{ nl(menuItem.text) }}</a>
          </p>
        </template>
      </div>
      <div class="new-privacy-policy-content">
        <section v-for="(item, index) in privacyData" :key="index" :class="['row', { show: item.show }]">
          <a :id="menu[index].name.replace('#', '')"></a>
          <div :name="menu[index].name.replace('#', '')">
            <h2 :class="{ noMarginTop: index === 0 }">{{ nl(item.title) }}</h2>
            <div v-html="nl(item.text)"></div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { createThrottle } from '@/assets/js/utils'
let that = null
export default {
  name: 'NewPrivacyPolicy',
  data() {
    return {
      fixedClass: false,
      fixedFlag: false,
      isHide: false
    }
  },
  computed: {
    menu({ showCANotice }) {
      return [
        {
          name: '#information-we-collect',
          text: 'page_new_privacy_policy_menu_title1',
          show: true
        },
        {
          name: '#share-and-disclosure',
          text: 'page_new_privacy_policy_menu_title2',
          show: true
        },
        {
          name: '#california-privacy-notice',
          text: 'page_new_privacy_policy_menu_title3',
          className: 'truevault-polaris-privacy-notice',
          show: showCANotice
        },
        {
          name: '#financial-incentive',
          text: 'page_new_privacy_policy_menu_title5',
          show: true
        },
        {
          name: '#virginia-privacy-notice',
          text: 'page_new_privacy_policy_menu_title4',
          show: true
        },
        {
          name: '#eea-uk-privacy-notice',
          text: 'page_new_privacy_policy_menu_title6',
          show: true
        }
      ]
    },
    privacyData({ showCANotice }) {
      return [
        {
          title: 'page_new_privacy_policy_content_title1',
          text: 'page_new_privacy_policy_content_text1',
          show: true
        },
        {
          title: 'page_new_privacy_policy_content_title2',
          text: 'page_new_privacy_policy_content_text2',
          show: true
        },
        {
          title: 'page_new_privacy_policy_content_title3',
          text: 'page_new_privacy_policy_content_text3',
          show: showCANotice
        },
        {
          title: 'page_new_privacy_policy_content_title5',
          text: 'page_new_privacy_policy_content_text5',
          show: true
        },
        {
          title: 'page_new_privacy_policy_content_title4',
          text: 'page_new_privacy_policy_content_text4',
          show: true
        },
        {
          title: 'page_new_privacy_policy_content_title6',
          text: 'page_new_privacy_policy_content_text6',
          show: true
        }
      ]
    }
  },
  watch: {
    headerFixed: {
      handler(val) {
        if (process.client) {
          const menuDom = document.querySelector('.new-privacy-policy-menu')
          menuDom.style.setProperty('top', (val ? 50 : 170) + 'px')
        }
      }
    }
  },
  created() {
    that = this
  },
  mounted() {
    this.fixMenuBox()
    window.addEventListener('resize', createThrottle(this.fixMenuBox))
    window.addEventListener('scroll', createThrottle(this.fixMenuBox))
    if (location.hash) {
      document.querySelector(location.hash.split('?')[0]).scrollIntoView({
        behavior: 'smooth'
      })
      setTimeout(function() {
        window.scrollBy({
          top: this.headerFixed ? -175 : -300,
          left: 0
        })
      }, 0)
    }
    this.intersectionFooter()
    this.getLocationCode()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.fixMenuBox)
    window.removeEventListener('resize', this.fixMenuBox)
  },
  methods: {
    scrollIntoViewPort(neme) {
      setTimeout(function() {
        window.scrollBy({
          top: this.headerFixed ? -175 : -300,
          left: 0
        })
      }, 0)
    },
    fixMenuBox() {
      const menuDom = document.querySelector('.new-privacy-policy-menu')
      const contentDom = document.querySelector('.new-privacy-policy-content')
      const { left, top, width } = contentDom.getBoundingClientRect()
      if (top <= 0 && !this.fixedFlag) {
        this.fixedFlag = true
        that.fixedClass = true
        menuDom.style.setProperty('margin-left', left + 'px')
        menuDom.style.setProperty('max-width', width + 'px')
        menuDom.style.setProperty('top', that.headerFixed ? '50px' : '170px')
      }
      if (top >= 200) {
        this.fixedClass = false
        this.fixedFlag = false
        menuDom.style.setProperty('margin-left', 0)
      }
    },
    intersectionFooter() {
      const that = this
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          that.isHide = true
        } else {
          that.isHide = false
        }
      })
      const el = document.querySelector('.az-footer-box')
      observer.observe(el, { root: null, threshold: 0.1 })
    }
  }
}
</script>

<style lang="less">
html {
  font-size: 16px;
}
.new-privacy-policy {
  a {
    text-decoration: underline;
    &:hover {
      text-decoration: underline;
    }
  }
  &-title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
    letter-spacing: 0;
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
    box-shadow: 0 1px 0 0 #ccc;
    a {
      color: var(--color-121212);
      font-size: 13px;
      line-height: 18px;
    }
  }
  &-menu {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 1px;
    background-color: #fff;
    transition: top 0.25s ease;
    z-index: 1;
    .anchor-link {
      // width: calc(100% / 3 - 30px);
      width: max-content;
      margin-bottom: 15px;
      font-family: @font-family-600;
      font-size: 14px;
      line-height: 19px;
      text-transform: uppercase;
      &:not(:last-child) {
        margin-right: 30px;
      }
      a {
        color: var(--color-121212);
      }
    }
    &.fixed-menu {
      position: fixed;
      top: 50px;
      left: 0;
    }
    &.hide {
      display: none;
    }
  }
  &-content {
    height: max-content;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    .row {
      display: none;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      &.show {
        display: block;
      }
      h2 {
        font-family: @font-family-600;
        font-size: 14px;
        line-height: 19px;
        margin: 20px 0;
        text-transform: uppercase;
        &.noMarginTop {
          margin-top: 0;
        }
      }
      h3 {
        margin: 10px 0 25px;
      }
      p {
        margin-bottom: 25px;
      }
      ul {
        display: block;
        list-style-type: disc;
        padding-left: 15px;
        margin-bottom: 25px;
        li {
          list-style: disc;
          &::marker {
            font-size: 12px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
          }
        }
      }
    }
    table {
      width: 100%;
      display: table;
      text-indent: initial;
      border-spacing: 2px;
      border-color: gray;
      border-collapse: collapse;
      box-sizing: border-box;
    }
    // th:first-child {
    //   width: 30%;
    // }
    th,
    strong {
      font-size: 1rem;
      font-family: @font-family-600;
      font-weight: bold;
      color: var(--color-121212);
    }
    td,
    th {
      padding: 8px;
      text-align: left;
      vertical-align: top;
      border: 1px solid var(--color-121212);
    }
    a {
      color: @theme-color !important;
    }
  }
}
</style>
