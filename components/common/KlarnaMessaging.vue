<template>
  <div class="klarna-box">
    <template v-if="needInitial && !kmReady">
      <az-icon icon-class="icon-theme-klarna" class="klarna-icon"></az-icon>
    </template>
    <client-only>
      <template v-if="['credit-promotion-auto-size', 'credit-promotion-badge'].includes(dataKey)">
        <klarna-placement :data-purchase-amount="purchaseAmount" :data-locale="locale" :data-key="dataKey" class="az-klarna-content">
          <div v-if="needInitial" class="az-placeholder"><az-icon icon-class="icon-theme-klarna" class="klarna-icon"></az-icon></div>
        </klarna-placement>
      </template>
      <template v-else>
        <klarna-placement :data-locale="locale" :data-key="dataKey" class="az-klarna-content"></klarna-placement>
      </template>
    </client-only>
  </div>
</template>

<script>
// 更加目前的需求#18124建立的组件，后续如果需要扩展，可以更新组件
export default {
  silent: true,
  name: 'KlarnaMessaging',
  props: {
    purchaseAmount: {
      type: Number,
      default: 0
    },
    dataKey: {
      type: String,
      default: 'credit-promotion-badge'
    },
    needInitial: {
      // 是否需要初始状态，在组件sdk加载完成之前展示icon
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      kmReady: false
    }
  },
  computed: {
    locale() {
      return `${this.language.toLowerCase()}-${this.country.toUpperCase()}`
    }
  },
  watch: {
    purchaseAmount(val) {
      // 更改了价格以及展示条件之后更新 klarna 的 on-site-messaging
      this.$nextTick(() => {
        window && window.Klarna && window.Klarna.OnsiteMessaging && window.Klarna.OnsiteMessaging.refresh()
      })
    }
  },
  mounted() {
    this.loadKlarnaservicesoad()
    this.$nextTick(() => {
      window && window.Klarna && window.Klarna.OnsiteMessaging && window.Klarna.OnsiteMessaging.refresh()
      this.kmReady = true
    })
  },
  methods: {
    loadKlarnaservicesoad() {
      // 加载js 不放在head 里面是因为： 1. 按需加载js,是否展示需要根据接口返回字段控制，避免非不要的时候加载js  2. 页面需要挂载<klarna-placement>组件后才能渲染，放mounted里面能更改的控制加载时机
      // #18124：klarna 前端卖点展示   文档： https://docs.klarna.com/on-site-messaging/integrate-with-on-site-messaging/
      // 确保每页仅加载 1 个 JavaScript 库实例。  https://docs.klarna.com/on-site-messaging/troubleshooting/
      if (this.hasLoadKlarnaservices() || this.is_chrome_lighthouse) return false
      // 在此处插入 Klarna On-Site Messaging 的 JavaScript 代码片段
      // 测试阶段使用： 'data-environment':"playground",'data-client-id': '10e34f86-4761-5dc7-8afd-1cb994560fd4'
      // 正式阶段使用： 'data-environment':"production",'data-client-id': '509e3deb-2a10-59b3-a989-30a2a8172e7a'
      const klarnaScript = document.createElement('script')
      klarnaScript.setAttribute('src', 'https://osm.klarnaservices.com/lib.js')
      klarnaScript.setAttribute('async', 'true')
      klarnaScript.setAttribute('data-environment', 'production')
      klarnaScript.setAttribute('data-client-id', '509e3deb-2a10-59b3-a989-30a2a8172e7a')
      document.head.appendChild(klarnaScript)
    },
    hasLoadKlarnaservices() {
      const es = document.getElementsByTagName('script') || []
      for (let i = 0; i < es.length; i++) {
        if (es[i] && es[i].src && es[i].src.includes('osm.klarnaservices.com/lib.js')) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style lang="less" scoped>
.klarna-box {
  margin-top: 5px;
  position: relative;
  .klarna-icon {
    width: 60px;
    height: 30px;
  }
  /deep/ .az-klarna-content {
    *::part(osm-container) {
      border: none;
      padding: 0;
      background: transparent;
      font-size: 13px;
      line-height: 18px;
    }
    .az-placeholder {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 0;
    }
  }
}
</style>
<style>
/* 第三方的这个样式覆盖有点问题，再加一层防止失效 */
*::part(osm-container) {
  border: none;
  padding: 0;
  background: transparent;
  font-size: 13px;
  line-height: 18px;
}
</style>
