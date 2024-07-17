<template>
  <div
    v-show="show"
    :class="{ 'animation-slideflex-enter-active': show, 'animation-slideflex-leave-active': !show }"
    class="country-menu country-menu-b"
  >
    <ul>
      <li>
        <p>{{ nl('page_common_country') }}</p>
        <div @click.stop="countrySelectShow = !countrySelectShow" tabindex="0" role="button" class="select-item active select-item-country">
          <img :alt="countryName" :src="addWebpSuffix(headItemImageUrl)" class="icon-country" />
          {{ countryName }}
          <az-icon :class="{ rotate: countrySelectShow }" class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
        </div>
        <client-only>
          <transition name="collapseCountry" mode="out-in">
            <ul v-show="countrySelectShow" class="az-select-options show-scrollbar country-container">
              <li
                v-for="item in siteOptions"
                :key="item.countryId"
                @click="handleCountryChange(item)"
                v-track.click="{ common: getBiParams(`country_${item.countryCode}`) }"
                tabindex="0"
                role="button"
                class="select-item"
              >
                <img :src="addWebpSuffix(item.headItemImageUrl)" :alt="item.countryName" class="icon-country" />
                {{ item.countryName }}
              </li>
            </ul>
          </transition>
        </client-only>
      </li>
      <li>
        <p>{{ nl('page_common_currency') }}</p>
        <div class="select-item active">
          {{ currencyCode }}
        </div>
      </li>
      <li>
        <p>{{ nl('page_common_language') }}</p>
        <div @click.stop="languageSelectShow = !languageSelectShow" tabindex="0" role="button" class="select-item active">
          {{ languageName }}
          <az-icon :class="{ rotate: languageSelectShow }" class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
        </div>
        <!-- 语言选择 -->
        <transition name="collapseCountry" mode="out-in">
          <ul v-show="languageSelectShow" class="az-select-options show-scrollbar language">
            <li
              v-for="item in languageOptions"
              :key="item.languageId"
              @click="handleLanguageChange(item)"
              v-track.click="{ common: getBiParams(`language_${item.code}`) }"
              tabindex="1"
              role="button"
              class="select-item"
            >
              {{ item.name }}
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>
<script>
import { removeURLParameters, setUrlParam, getCountryRedirectUrl } from '@/assets/js/utils'
const seoLanguages = require('../../modules/supportSeoLanguage')

/**
 * 国家选择展示组件
 * 用于页面头部鼠标浮动后展示
 */
export default {
  name: 'CountryMenu',
  languageKeys: ['page_common_country', 'page_common_currency', 'page_common_language'],
  props: {
    // 是否展示
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      countrySelectShow: false, // 展示国家选择列表
      languageSelectShow: false // 展示语言选择列表
    }
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      const obj = {
        ec: 'country',
        el
      }
      return obj
    },
    // 选择国家，切换国家，直接跳转到当前国家，重置国家相关货币语言信息，使用当前国家的默认数据
    handleCountryChange(item) {
      this.countrySelectShow = false
      this.updateUrl('', item)
    },
    // 选择语言
    handleLanguageChange(item) {
      this.languageSelectShow = false
      // 语言是否发生变化，不是的话直接关闭弹框
      if (item.code === this.language) return
      this.updateUrl(item.code)
    },
    // 更新跳转选择页  传国家和语言
    async updateUrl(language = '', countryItem = null) {
      const curCountry = this.country // 语言选择的时候，根据当前国家获取信息
      const currentCountryList = this.siteOptions.filter((item) => item.countryCode == curCountry)
      const item = countryItem || currentCountryList[0]
      const currentLanguage = language || item.language
      let domain = this.APP_DOMAIN_LOWER

      if (this.APP_DOMAIN_LOWER != item.topLevelDomain) {
        domain = item.topLevelDomain
      } else {
        domain = this.APP_DOMAIN_LOWER
      }
      if (this.environment.includes('dev')) {
        domain = 'localhost'
      }
      this.$cookie.removeCookie('CountryCode', '.' + this.APP_DOMAIN_LOWER)
      this.$cookie.removeCookie('Language', '.' + this.APP_DOMAIN_LOWER)

      this.$cookie.setCookie('CountryCode', item.countryCode, 30, '.' + domain)
      this.$cookie.setCookie('Currency', item.currencyCode, 30, '.' + domain)
      this.$cookie.setCookie('Language', currentLanguage, 30, '.' + domain)
      this.$cookie.setCookie('domain_accessed', 1, 180, '.' + domain) // 只要进行了国家切换操作，就设置domain_accessed

      const gtagIds = {
        client_id: null,
        session_id: null
      }
      if (
        (this.country !== 'CA' && countryItem && countryItem.countryCode == 'CA') ||
        (this.country == 'CA' && countryItem && countryItem.countryCode !== 'CA')
      ) {
        try {
          gtagIds.client_id = await new Promise((resolve) => {
            window.gtag('get', 'G-D8GXEMDR1J', 'client_id', (id) => resolve(id))
          })
          gtagIds.session_id = await new Promise((resolve) => {
            window.gtag('get', 'G-D8GXEMDR1J', 'session_id', (id) => resolve(id))
          })
        } catch (error) {
          console.log('----error---', error)
        }
      }
      // 记录用户选择的语言
      await this.$axios.$post(`/1.0/user/user-languageId?countryCode=${item.countryCode}&language=${currentLanguage}`)
      const query = `country=${item.countryCode}&currency=${item.currencyCode}` // 全球站url需要一直携带国家和货币参数
      let url = ''
      let tempPath = this.$route.fullPath
      if (this.$route.name === 'search' && this.$route.query && curCountry != item.countryCode) {
        //  搜索页切换国家的时候，只保留q的入参，需要清空其他的filter
        if (this.$route.path.includes('/collection/all')) {
          // 搜索结果页不需要q的入参
          tempPath = `${this.$route.path}`
        } else {
          tempPath = `${this.$route.path}?q=${this.$route.query.q}`
        }
      }
      const currentSeoLanguages = seoLanguages.filter(
        (item) => tempPath == `/${item}` || tempPath.startsWith(`/${item}?`) || tempPath.startsWith(`/${item}/`)
      )
      if (currentSeoLanguages.length) {
        tempPath = tempPath.substring(currentSeoLanguages[0].length + 1, tempPath.length)
      }
      url = tempPath
      url = removeURLParameters(url, ['country', 'currency']) // 先删除url中的Country和货币currency参数
      // 在路径上更新或者添加session_id client_id
      if (gtagIds.client_id && gtagIds.session_id) {
        url = setUrlParam(url, 'client_id', gtagIds.client_id)
        url = setUrlParam(url, 'session_id', gtagIds.session_id)
      }
      // 如果是跳转到.ca，直接跳转，不需要携带任何参数
      if (item.countryCode === 'CA') {
        if (currentLanguage == 'fr') url = '/fr' + url
        url = location.origin + url
        url = url.replace(this.APP_DOMAIN_LOWER, domain)
        location.href = url
        return
      }
      if (curCountry == item.countryCode) {
        // 判断url中是否还有未知参数，根据是否有未知参数，拼接query
        if (/\?/g.test(url)) {
          url = url + '&' + query
        } else {
          url = url + '?' + query
        }
        url = getCountryRedirectUrl(url, item.countryCode, currentLanguage)
        // console.log('---change language url----', url)
        location.href = location.origin + url
        return
      }
      const urlReg = /\/(colors|with)\/(.*)/ // eslint-disable-line no-useless-escape
      if (urlReg.test(url)) {
        url = url.replace(urlReg, '')
      }

      if (/\?/g.test(url)) {
        url = url + '&' + query
      } else {
        url = url + '?' + query
      }

      url = getCountryRedirectUrl(url, item.countryCode, currentLanguage)
      url = location.origin + url
      url = url.replace(this.APP_DOMAIN_LOWER, domain)
      // console.log('---change country url----', url)
      // !!! 国家确认后，跳转路径会有个中间件处理，修改路径，详情见middleware/resetSeoLanguage.js
      location.href = url
    }
  }
}
</script>
<style lang="less" scoped>
.country-menu {
  position: absolute;
  width: 320px;
  box-sizing: border-box;
  z-index: 5;
  .arrow-down-icon {
    margin-left: auto;
    margin-right: 10px;
    &.rotate {
      transform: rotate(180deg);
    }
  }
  > ul {
    padding: 20px;
    // min-height: 259px;
    background: #ffffff;
    border: 1px solid #ccc;
    li {
      &:not(:nth-child(1)) {
        margin-top: 15px;
      }
      p {
        font-weight: 600;
      }
      .select-item {
        height: 40px;
        margin-top: 5px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        &.select-item-country {
          cursor: pointer;
        }
        &.active {
          background: var(--color-f9f9f9);
        }
        .icon-country {
          width: 20px;
          height: 14px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      .az-select-options {
        max-height: 240px;
        overflow: auto;
        &.show-scrollbar {
          // 重置滚动条样式
          &::-webkit-scrollbar-track-piece {
            background: #f1f1f1;
          }

          &::-webkit-scrollbar {
            width: 4px;
            height: 8px;
          }

          &::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
          }
        }
        .select-item {
          cursor: pointer;
          margin: 0;
          &:hover {
            background: var(--color-f9f9f9);
          }
        }
      }
    }
  }
  &-b {
    right: -10px;
  }
  .collapseCountry-enter-active,
  .collapseCountry-leave-active {
    // transition: all 0.05s ease-in-out;
    transition: opacity 0.05s ease;
  }
  .collapseCountry-enter-from,
  .collapseCountry-leave-to {
    opacity: 0;
  }
}
</style>
