<template>
  <div
    id="seo-content"
    @click="handleSeoContent($event)"
    v-html="content"
    class="seo-content need_datalayer seo-content-b"
    data-datalayer-category="SEOC_Click"
    data-datalayer-label="SEOC_Click"
  ></div>
</template>

<script>
export default {
  name: 'SeoContent',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollDointFlag: false
    }
  },
  watch: {
    scrollDointFlag(nval) {
      if (nval) {
        // 首页此模块打点
        this.buryPoint(this, 'event', {
          dp: 'home',
          ec: 'SEOContent',
          ea: 'view',
          el: 'SEOContent',
          param1: (location && location.href) || '-1'
        })
      }
    }
  },
  mounted() {
    if (this.$route.name == 'index') {
      // abtest 首页模块打点
      this.scrollShowPoint()
    }
  },
  methods: {
    scrollShowPoint() {
      const _this = this
      window.addEventListener('scroll', function() {
        const ele = document.getElementById('seo-content')
        if (!ele) {
          _this.scrollDointFlag = false
        } else {
          _this.scrollDointFlag = _this.inViewPort(ele, 0.5)
        }
      })
    },
    handleSeoContent(e) {
      this.setOrderSourceFlag('Seoa_PC')
      // abtest 首页模块打点
      if (this.$route.name == 'index') {
        const tagName = e.target && e.target.tagName
        const targetHtml = e.target && e.target.innerHTML
        if (tagName == 'A' && targetHtml) {
          this.buryPoint(this, 'event', {
            dp: 'home',
            ec: 'SEOContent',
            ea: 'click',
            el: targetHtml,
            param1: (location && location.href) || '-1'
          })
        }
      }
    }
  }
}
</script>

<style lang="less">
.seo-content {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  max-width: 1640px;
  margin: 0 auto 60px;

  h1 {
    letter-spacing: 1px;
    font-size: 24px;
    font-weight: 400;
    text-transform: uppercase;
    margin: 20px 0 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-cccccc);
    color: var(--color-121212);
  }
  h2 {
    letter-spacing: 1px;
    font-size: 24px;
    font-weight: 400;
    text-transform: uppercase;
    margin: 20px 0 5px 0;
    color: var(--color-121212);
  }
  h3 {
    margin-top: 13px;
    font-size: 13px;
    font-weight: bold;
    a {
      font-weight: normal;
      color: var(--color-121212);
    }
  }
  a {
    color: var(--color-121212);
    text-decoration: underline;
  }
  p {
    margin-bottom: 13px;
    color: var(--color-121212);
    width: 100%;
    letter-spacing: 0.01em;
    word-break: keep-all;
    line-height: 1.5em;
    &.wide {
      width: 100%;
    }
  }
  &-b {
    width: 83.33%;
    max-width: 1600px;
    padding: 0;
    h1 {
      font-family: @font-Ivy-Mode-400;
      font-size: 36px;
      line-height: 45px;
      text-align: center;
      text-transform: uppercase;
      border: none;
      margin: 0;
      margin-bottom: 50px;
    }
  }
}
</style>
