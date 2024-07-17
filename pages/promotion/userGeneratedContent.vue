<template>
  <div class="uesr-generated-content">
    <main-app :navigation="navigation" :isShowSubscribe="'hide'" :adaptive="true" class="adaptive-box">
      <div class="ugc-box">
        <section class="top-banner">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/prom/80/72/fbbe30f133f4631c841b48c9fef38072.jpg')"
            :style="styleInfo"
            usemap="#btn-wrap"
            class="skeleton-default"
            width="1280px"
            height="400px"
            alt="best day ever"
          />
          <!-- <map name="btn-wrap">
            <area :href="countryUrl('/all/prom-dresses')" shape="rect" coords="1184,310,1584,370" alt="" />
            <area @click="uploadImg" shape="rect" coords="1184,400,1584,460" alt="" />
          </map> -->
          <div class="btn-wrap">
            <a
              v-track.view.click="{ common: { el: 'shoppromdress', ec: 'shoppromdress' } }"
              :href="countryUrl('/all/prom-dresses')"
              class="a-link"
              >shop prom dress</a
            >
            <span v-track.view.click="{ common: { el: 'uploadyourmemory', ec: 'uploadyourmemory' } }" @click="uploadImg" class="img-upload"
              >upload</span
            >
          </div>
        </section>
        <section>
          <img
            :style="styleInfo"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/prom/eb/f0/fa9fc09a508ea82f56b67fadda50ebf0.jpg')"
            width="1280px"
            height="400px"
            class="skeleton-default"
            alt="share you prom story"
          />
        </section>
        <section>
          <img
            :style="styleInfo"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/prom/9a/db/7cca0abd9ada062f0eea299324a49adb.jpg')"
            width="1280px"
            height="400px"
            class="skeleton-default"
            alt="what you will win"
          />
        </section>
        <section>
          <img
            :style="styleInfo"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/prom/e8/dc/729b8d30eba0e3a286f8bb7153e4e8dc.jpg')"
            width="1280px"
            height="400px"
            class="skeleton-default"
            alt="how to enter and win"
          />
        </section>
        <section>
          <img
            :style="styleInfo"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/prom/e0/1d/e7d6ea1a8ccfc946569762166a0fe01d.jpg')"
            width="1280px"
            height="400px"
            class="skeleton-default"
            alt="requirements"
          />
        </section>
      </div>
      <popup-customer-photo-upload :activity-type="'ugc'"></popup-customer-photo-upload>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import popupCustomerPhotoUpload from '@/components/product/PopupCustomerPhotoUpload'

import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'CybermondayLandingPage',
  components: {
    MainApp,
    popupCustomerPhotoUpload
  },
  data() {
    return {
      loaded: false,
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png')
    }
  },
  computed: {
    styleInfo() {
      return {
        background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
      }
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'user-generated-content')
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
    uploadImg() {
      this.$store.commit('product/setPopupCustomerPhotoUploadShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
.uesr-generated-content {
  min-width: 1353px;
  background-color: #fff;
  .ugc-box {
    font-size: 0;
    img {
      width: 100%;
    }
    section {
      margin-bottom: 60px;
    }
    section:not(:first-child) {
      max-width: 1293px;
      margin: 0 auto 60px;
    }
    .top-banner {
      position: relative;
      .btn-wrap {
        position: absolute;
        top: 52%;
        left: 60%;
        transform: translate(0, -10%);
        .a-link {
          display: block;
          min-width: 400px;
          min-height: 60px;
          // background-color: blueviolet;
          cursor: pointer;
        }
        .img-upload {
          display: block;
          min-width: 400px;
          min-height: 60px;
          margin-top: 20px;
          // background-color: blueviolet;
          cursor: pointer;
        }
      }
    }
  }
  .skeleton-default {
    background-color: var(--color-f9f9f9);
    width: 100%;
    height: auto;
  }
}
</style>
