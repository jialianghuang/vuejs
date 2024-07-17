<template>
  <div id="unsubscribe">
    <div class="unsubscribe-content">
      <div class="header-logo">
        <a href="https://www.azazie.com/"> </a>
        <p v-html="nl('page_unsubscribe_text')"></p>
      </div>
      <div class="info-content">
        <h1>{{ nl('page_unsubscribe_ing') }}</h1>
        <template v-if="unsubscribeStatus == 'un'">
          <p>{{ nl('page_unsubscribe_permanently') }}</p>
          <p class="exclude">{{ nl('page_unsubscribe_exclude') }}</p>
        </template>
        <template v-else-if="unsubscribeStatus == 'undo'">
          <p>{{ nl('page_unsubscribe_reactivated') }}</p>
        </template>
        <template v-else>
          <p>{{ nl('page_unsubscribe_would_like') }}</p>
          <p class="exclude">{{ nl('page_unsubscribe_exclude') }}</p>
          <az-button @click="subscribeSubmit" :disabled="loading" class="btn btn-default btn-submit">
            {{ loading ? nl('page_js_processing') : nl('page_unsubscribe_ing') }}
          </az-button></template
        >
      </div>
    </div>
    <main-app v-if="showMainApp"></main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import AzButton from '@/components/az-ui/Button/AzButton'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'Unsubscribe',
  components: {
    mainApp,
    AzButton
  },
  data() {
    return {
      showMainApp: false,
      loading: false,
      unsubscribeStatus: '' // un undo
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      return {
        ...commonAsyncData
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
  mounted() {},
  methods: {
    subscribeSubmit() {
      this.loading = true
      this.retentionReject()
      this.$axios
        .$get(`/1.0/email/unsubscribe?email=${this.$route.query.email}&act=""`)
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.unsubscribeStatus = 'un'
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>
<style lang="less" scoped>
#unsubscribe {
  background: #fffafa;
  min-height: 952px;
  display: flex;
  //   align-items: center;
  justify-content: center;
  .unsubscribe-content {
    padding: 0 10%;
    margin: 0 auto;
    position: relative;
    margin-top: 100px;
    .header-logo {
      text-align: center;
      a {
        display: block;
        width: 245px;
        height: 32px;
        margin: auto;
        background: url(~assets/images/common/azazie_logo.svg) no-repeat;
        background-size: contain;
      }
      p {
        padding: 20px 5px;
        height: 20px;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
      }
    }
    .info-content {
      width: 480px;
      padding: 90px 70px;
      background: #fff;
      margin-top: 30px;
      h1 {
        font-size: 22px;
        margin-bottom: 20px;
      }
      p {
        margin: 5px 0 10px 0;
        font-size: 12px;
        text-indent: 0;
        &.exclude {
          color: rgba(153, 153, 153, 1);
        }
      }
      .btn-submit {
        margin-top: 20px;
      }
    }
  }
}
</style>
