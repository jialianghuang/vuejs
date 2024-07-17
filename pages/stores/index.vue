<template>
  <!-- Find a store 页（零售商） -->
  <div class="brides-box">
    <SvgStorefront />
    <main-app :navigation="navigation">
      <template v-if="country === 'US'">
        <p class="breadcrumbs-content">
          <a :href="countryUrl('/')">{{ nl('page_common_home') }}</a>
          <i>></i>
          <a>{{ nl('page_head_find_store') }}</a>
          <i>></i>
          <a>{{ nl('page_common_store') }}</a>
          <template v-if="choosedCity.cityName">
            <i>></i>
            <a>{{ choosedCity.cityName }}</a>
          </template>
        </p>
        <div class="center-content">
          <!-- 左侧列表 -->
          <div class="left-content">
            <p class="store-title">{{ nl('page_common_store') }}</p>
            <ul>
              <li
                :class="{ 'act-city': choosedCity.cityName === item.cityName }"
                v-for="(item, index) in cityList.slice(0, showCityNum)"
                :key="index"
                @click="chooseCity(item)"
                v-track.view.click="{
                  common: {
                    ec: 'retailer',
                    el: 'storecity',
                    msg: JSON.stringify({ cityName: item.cityName, provinceCode: item.provinceCode })
                  }
                }"
              >
                {{ item.cityName }}, {{ item.provinceCode }}
              </li>
              <a v-if="cityList.length > showCityNum" @click="showCityNum = showCityNum + 25">{{ nl('page_common_see_more') }}</a>
            </ul>
            <!-- <a :href="countryUrl('/partner')" aria-label="partner"
              ><img
                :src="replaceImgCdnUrl('https://cdn-1.azazie.com/upimg/userfiles/images/7a/4f/1cc1e2276ef1f15ac4a1089ddc537a4f.png')"
                alt="partner"
            /></a> -->
          </div>
          <!-- 右侧banner和州列表 -->
          <div class="right-content">
            <div class="banner-module">
              <div class="banner-layer"></div>
              <img
                v-track.viewOnce="{ common: { ec: 'retailer', el: 'findastorebanner' } }"
                :src="replaceImgCdnUrl('https://cdn-1.azazie.com/upimg/userfiles/images/b0/c1/1bace540d4510e966e9c47246b31b0c1.png')"
                alt="retailer"
              />
              <div class="banner-content">
                <h2>{{ nl('page_common_store') }}</h2>
                <p>{{ nl('page_store_banner_description1') }}.</p>
                <p>
                  {{ nl('page_store_banner_description2') }}
                  <a
                    :href="countryUrl('/all/sample-dresses?current_in_stock=yes')"
                    v-track.viewOnce.click="{ common: { ec: 'retailer', el: 'findastorebannertryon' } }"
                    style="color:#fff"
                    >{{ nl('page_strore_banner_description3') }}</a
                  >
                </p>
              </div>
            </div>
            <div class="province-list">
              <!-- 最外层州 -->
              <ul v-for="(list, key) in provinceMap" :key="key">
                <li
                  v-for="item in list"
                  :key="item.provinceName"
                  v-track.view="{
                    common: {
                      ec: 'retailer',
                      el: 'province',
                      ea: 'view',
                      msg: JSON.stringify({ provinceName: item.provinceName, provinceCode: item.provinceCode })
                    }
                  }"
                >
                  <h4 @click="showProvinceDetail(item)">{{ item.provinceName === actProvince ? '-' : '+' }} {{ item.provinceName }}</h4>
                  <!-- 城市 -->
                  <ul v-if="item.provinceName === actProvince" class="city-list">
                    <li
                      v-for="city in item.cityList"
                      :key="city.cityName"
                      v-track.view="{
                        common: {
                          ec: 'retailer',
                          el: 'city',
                          msg: JSON.stringify({ cityName: city.cityName, provinceName: item.provinceName })
                        }
                      }"
                    >
                      <p>
                        <i>{{ city.cityName }}, {{ item.provinceCode }}</i>
                        <a @click="showCityDetail(city)" v-if="actCity !== city.cityName" class="uppercase-text">{{
                          nl('page_goods_see_details')
                        }}</a>
                      </p>

                      <!-- 店铺 -->
                      <div v-if="actCity === city.cityName" class="store-list">
                        <div
                          v-for="store in city.storeList"
                          :key="store.storeId"
                          v-track.view="{
                            common: {
                              ec: 'retailer',
                              el: 'citytostore',
                              msg: JSON.stringify({ cityName: city.cityName, storeName: store.storeName, storeId: store.storeId })
                            }
                          }"
                        >
                          <h5>{{ store.storeName }}</h5>
                          <a
                            :href="
                              `https://maps.google.com/maps/dir//${store.storeName}+${store.storeAddress}+${city.cityName}+${item.provinceName}+${store.zipcode}`
                            "
                            v-track.click="{
                              common: {
                                ec: 'retailer',
                                el: 'storeaddress',
                                msg: JSON.stringify({ cityName: city.cityName, storeName: store.storeName })
                              }
                            }"
                            target="_blank"
                            style="color:#666"
                            >{{ store.storeAddress }}<br />
                            {{ city.cityName }},{{ item.provinceName }}, {{ store.zipcode }}</a
                          >
                          <a
                            :href="`tel:${store.storePhone}`"
                            v-track.click="{
                              common: {
                                ec: 'retailer',
                                el: 'storephone',
                                msg: JSON.stringify({ cityName: city.cityName, storeName: store.storeName })
                              }
                            }"
                            style="color:#666"
                            >{{ nl('page_placeholder_phone') }}: {{ store.storePhone }}</a
                          >
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
      <!-- 非US国家打开该页面时显示 -->
      <template v-else>
        <div class="tip-page">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/7b/d3/730a5ab008625ba290ced45be1ac7bd3.jpg')"
            alt="tip"
          />
          <div class="tip-content">
            <az-icon icon-class="icon-hint" class="icon-hint" />
            <h2>{{ nl('page_common_sorry') }}!</h2>
            <p>{{ nl('page_store_banner_tip') }}</p>
            <a :href="countryUrl('/all/bridesmaid-dresses')">{{ nl('page_common_shopdress') }}</a>
          </div>
        </div>
      </template>
      <back-to-top></back-to-top>
      <StoreDialog ref="storeDialog" :choosedCity="choosedCity"></StoreDialog>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
// import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import StoreDialog from '@/components/stores/storeDialog.vue'
import SvgStorefront from '@/components/svgs/SvgStorefront'

export default {
  name: 'Stores',
  components: {
    MainApp,
    backToTop,
    StoreDialog,
    SvgStorefront
  },
  data() {
    return {
      actProvince: '',
      actCity: '',
      choosedCity: {},
      showCityNum: 25
    }
  },
  asyncData(context) {
    try {
      // context.redirect(302, '/ambassador-program')
      // return
      // const commonAsyncData = await init(context)
      // if (!commonAsyncData) return
      // context.store.commit('setJsKey', 'stores')
      // let cityList = []
      // const provinceMap = {}
      // // 国家为US时请求有零售商的州、城市列表接口
      // if (context.store.state.country === 'US') {
      //   const dataJson = await context.$axios.$get('/1.0/retailer-address')
      //   if (!dataJson.data) {
      //     context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
      //     return false
      //   }
      //   // 城市列表
      //   cityList = dataJson.data.cityList || []
      //   // 州列表，从上至下、从左至右排序，分三列
      //   const provinceList = dataJson.data.provinceList || []
      //   const len = provinceList.length
      //   const maxLength = Math.ceil(len / 3)
      //   const minddleLength = len % 3 === 1 ? maxLength + Math.floor(len / 3) : maxLength * 2
      //   for (let i = 1; i <= (len > 3 ? 3 : len); i++) {
      //     if (i === 1) {
      //       provinceMap[i] = provinceList.slice(0, maxLength)
      //     } else if (i === 2) {
      //       provinceMap[i] = provinceList.slice(maxLength, minddleLength)
      //     } else if (i === 3) {
      //       provinceMap[i] = provinceList.slice(minddleLength, len)
      //     }
      //   }
      // }
      // return {
      //   ...commonAsyncData,
      //   cityList,
      //   provinceMap
      // }
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
  methods: {
    // 点击打开州详情，显示州下的城市
    showProvinceDetail(item) {
      this.actProvince = this.actProvince === item.provinceName ? '' : item.provinceName
      this.buryPoint(this, 'event', {
        ec: 'retailer',
        el: 'province',
        ea: 'click',
        msg: JSON.stringify({ provinceCode: item.provinceCode, provinceName: item.provinceName })
      })
    },
    // 点击打开城市详情，显示城市下的店铺
    showCityDetail(city) {
      this.actCity = this.actCity === city.cityName ? '' : city.cityName
      this.buryPoint(this, 'event', {
        ec: 'retailer',
        el: 'city',
        ea: 'click',
        msg: JSON.stringify({ cityName: city.cityName })
      })
    },
    // 点击左侧城市，显示城市详情弹窗
    chooseCity(item) {
      this.choosedCity = item
      this.$refs.storeDialog.show()
    }
  }
}
</script>
<style lang="less" scoped>
.brides-box {
  .center-content,
  .breadcrumbs-content {
    box-sizing: border-box;
    clear: both;
    margin: 5px auto 0;
    margin-bottom: 84px;
    box-sizing: border-box;
    max-width: 1353px;
    width: 100%;
    padding: 0 30px;
  }
  .breadcrumbs-content {
    margin: 15px auto 0;
    display: flex;
    align-items: center;
    i {
      margin: 0 10px;
      font-size: 8px;
      color: var(--color-999999);
    }
    a {
      font-size: 13px;
      color: var(--color-121212);
      font-weight: 500;
    }
  }
  .center-content {
    display: flex;
  }
  .left-content {
    margin-top: 20px;
    margin-right: 40px;
    flex: 1;
    color: var(--color-121212);
    ul {
      margin: 20px 0;
      li {
        font-size: 13px;
        line-height: 30px;
        letter-spacing: 3%;
        cursor: pointer;
      }
      a {
        font-size: 13px;
        color: #666;
        text-transform: uppercase;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    img {
      width: 190px;
      cursor: pointer;
    }
    .act-city {
      color: var(--color-1e1e1e);
    }
  }
  .store-title {
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding-bottom: 6px;
    border-bottom: 1px solid #ccc;
  }
  .right-content {
    margin-top: 5px;
    width: 903px;
    .banner-module {
      position: relative;
      width: 100%;
      height: 360px;
      img {
        width: 100%;
        height: 100%;
      }
      .banner-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(269.56deg, rgba(38, 40, 20, 0.88) 0.41%, rgba(38, 40, 20, 0) 67.24%);
      }
      .banner-content {
        position: absolute;
        right: 26px;
        top: 60px;
        width: 480px;
        text-align: center;
        color: #ffffff !important;
        h2 {
          font-family: @font-Ivy-Mode-400;
          font-weight: 400;
          font-size: 72px;
          letter-spacing: 8px;
          text-transform: uppercase;
        }
        p {
          font-family: @font-family-500;
          font-weight: 300;
          font-size: 16px;
          line-height: 20px;
          letter-spacing: 0.07em;
          margin-bottom: 14px;
          &:first-child {
            padding: 0 20px;
          }
          &:last-child {
            width: 490px;
          }
        }
        a {
          font-family: @font-family-600;
          text-decoration: underline;
          letter-spacing: 0.07em;
          cursor: pointer;
        }
      }
    }
  }
  .province-list {
    display: flex;
    margin-top: 24px;
    width: 100%;
    & > ul {
      margin-right: 20px;
      width: calc(863px / 3);
      &:last-child {
        margin-right: 0;
      }
      & > li {
        padding: 20px 20px 0px 32px;
        margin-bottom: 20px;
        background: var(--color-f9f9f9);
        h4 {
          font-size: 16px;
          color: var(--color-121212);
          font-family: @font-Ivy-Mode-700;
          cursor: pointer;
          padding-bottom: 20px;
        }
      }
    }
    .city-list {
      & > li {
        cursor: pointer;
        &:first-child {
          margin-top: -10px;
        }
        &:last-child {
          & > p a {
            margin-bottom: 0px;
          }
        }
        & > p {
          padding: 8px 0;
          &:hover {
            width: 100%;
            margin-left: -32px;
            padding: 8px 20px 8px 32px;
            background: #e5e5e5;
          }
          i {
            display: block;
            font-family: @font-family-500;
            font-style: italic;
            font-size: 14px;
            color: var(--color-666666);
          }
          a {
            display: block;
            margin-top: 8px;
            font-family: @font-Ivy-Mode-400;
            font-weight: 400;
            font-size: 14px;
            text-decoration-line: underline;
            color: var(--color-1e1e1e);
            cursor: pointer;
          }
        }
        &:last-child {
          .store-list {
            &:last-child {
              padding-bottom: 0 !important;
            }
          }
        }
      }
    }
    .store-list {
      width: calc(100% + 52px);
      margin-left: -32px;
      color: var(--color-666666);
      padding: 16px 20px 16px 32px;
      background: #fff;
      font-size: 14px;
      & > div {
        margin: 20px 0;
        font-family: @font-Ivy-Mode-400;
        &:first-child {
          margin-top: 0;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      h5 {
        font-size: 14px;
        font-family: @font-Ivy-Mode-700;
      }
      a {
        display: block;
        margin-top: 8px;
        word-break: break-all;
        cursor: pointer;
        &:hover {
          text-decoration-line: underline;
        }
      }
    }
  }
}
.tip-page {
  position: relative;
  width: 100%;
  img {
    width: 100%;
  }
  .tip-content {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 40vw;
    max-width: 700px;
    min-width: 400px;
    height: 30vw;
    max-height: 580px;
    min-height: 400px;
    background: #fff;
    font-family: @font-family-500;
    color: var(--color-121212);
    .icon-hint {
      font-size: 60px;
      fill: var(--color-1e1e1e);
    }
    & > h2 {
      margin: 15px 0;
      font-weight: 400;
      font-size: 24px;
      text-transform: uppercase;
    }
    & > p {
      margin-top: 5px;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      text-align: center;
      width: 82%;
      max-width: 486px;
    }
    & > a {
      display: block;
      margin-top: 30px;
      width: 189px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      text-transform: uppercase;
      background: var(--color-121212);
      cursor: pointer;
    }
  }
}
.uppercase-text {
  text-transform: uppercase;
}
</style>
