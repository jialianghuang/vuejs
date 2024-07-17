<template>
  <div class="no-search">
    <p class="no-result-text">
      {{ nl('page_search_empty_list_text1') }}
      <span class="search-keyword">'{{ searchQ }}'</span>
      {{ nl('page_search_empty_list_text2') }}
    </p>
    <p v-if="noSearchGooods.btnText" class="search-go-back">
      <a @click="continueShopping" class="btn-continue-shopping">{{ noSearchGooods.btnText }}</a>
    </p>
    <p class="search-title">{{ noSearchGooods.title }}</p>
    <div class="suggests-tag-list">
      <div v-for="item in noSearchGooods.suggests" :key="item" @click="goList(item)" class="tag-suggests">
        <span>{{ item }}</span>
      </div>
    </div>
    <div class="search-tips">
      <h3>{{ nl('page_search_empty_list_search_tips') }}</h3>
      <p>{{ nl('page_search_empty_list_search_tip_text1') }}</p>
      <p>{{ nl('page_search_empty_list_search_tip_text2') }}</p>
      <p>{{ nl('page_search_empty_list_search_tip_text3') }}</p>
      <p class="contact-us-tip">
        {{ nl('page_search_empty_list_search_tip_looking_for') }}
        <span @click="getHelp" class="contact-us">{{ nl('page_search_empty_list_search_tip_contact_us') }}</span>
      </p>
    </div>
    <div class="search-bestselling no-result-page">
      <div class="suggest-title">
        <p>{{ nl(noSearchGooods.suggestTitle) }}</p>
      </div>
      <div>
        <You-look-for :suggestProdList="noSearchGooods.suggestProdList"></You-look-for>
      </div>
    </div>
  </div>
</template>

<script>
import YouLookFor from '@/components/list/searchEmpty/component/YoulookFor'
export default {
  name: 'NoSearch',
  components: {
    YouLookFor
  },
  props: {
    noSearchGooods: {
      type: Object,
      default() {
        return {}
      }
    },
    searchQ: {
      type: String,
      default: ''
    }
  },
  methods: {
    goList(e) {
      const msg = JSON.stringify({ q: e })
      this.buryPoint(this, 'events', [
        { ec: 'search', el: 'noresultslistpage', ea: 'click', msg }
        // { ec: 'search', el: 'noresultslistpage_' + e, ea: 'click', msg }
      ])
      window.location.href = this.countryUrl(`/search?q=${e}`)
    },
    getHelp() {
      // const helpBtn = document.getElementById('solvvy-support-flow-launch-widget')
      // helpBtn.click()
      this.buryPoint(this, 'event', { ec: 'search', el: 'noresultslistpage', ea: 'click' })
      location.href = this.getSupportUrl(`/articles/360026475311-How-do-I-contact-you`, `/articles/8076683`)
    },
    continueShopping() {
      history.back(-1)
    }
  }
}
</script>

<style scoped lang="less">
.no-search {
  width: 1004px;
  margin: 0 auto;
  overflow: hidden;
}
.no-result-text {
  padding-top: 90px;
  text-align: center;
  font-size: 24px;
  margin-bottom: 23px;
}
.search-go-back {
  text-align: center;
  .btn-continue-shopping {
    padding: 0;
    width: 214px;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    margin-bottom: 10px;
    font-family: @font-family-600, sans-serif;
    color: black;
    background: #fff;
    border: solid 1px #ccc;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-block;
    text-align: center;
    &:hover,
    &:focus,
    &:active,
    &.active {
      background: #eee;
    }
  }
}
.search-keyword {
  color: @theme-color;
}
.search-title {
  color: #666;
  font-size: 14px;
  text-align: center;
}
.suggests-tag-list {
  margin-top: 17px;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
}
.tag-suggests {
  background: #f0f0f0;
  border-radius: 25px;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 24px;
  display: block;
  height: 28px;
  width: fit-content;
  line-height: 28px;
  border: none;
  font-size: 14px;
  font-family: @font-family-500;
  font-weight: 400;
  color: var(--color-121212);
  margin-left: 5px;
  margin-right: 5px;
}
.search-tips {
  line-height: 18px;
  // width: 1004px;
  margin: 50px 0 50px 58px;
  margin-left: auto;
  margin-right: auto;
}
.search-bestselling {
  // width: 1004px;
  margin: 0 auto;
}
.contact-us-tip {
  margin-top: 30px;
}
.contact-us {
  text-decoration: underline;
  cursor: pointer;
}
.suggest-title {
  border-top: 1px solid #ccc;
  padding-top: 20px;
  text-transform: uppercase;
  font-size: 24px;
  letter-spacing: 0;
  font-family: @font-family-500, sans-serif;
  font-weight: 400;
}
</style>
