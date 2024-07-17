<template>
  <div>
    <div v-for="moduleItem in modules" :key="moduleItem.keyStr" :id="'module_load_' + moduleItem.keyStr">
      <!-- video -->
      <template v-if="moduleItem.keyStr === 'video'">
        <div class="video-mask">
          <a :href="countryUrl(nl('page_bridal_video_mask_link'))">
            <img
              v-track.view.click="{ common: getBiParams('B_HP top banner', 'B_HP top banner') }"
              :src="nl(`page_iamge_bridal_video_mask_pc_${country.toLowerCase()}`)"
              alt="video mask"
            />
          </a>
        </div>
        <div v-if="!isSafari" class="video-module">
          <img
            v-if="!isIframeOnload"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/Shoes/61/83/ce95ffe620e6ba4b4bd9862813ec6183.jpg')"
            alt="bridal"
          />
          <iframe
            ref="videoRef"
            v-track.viewOnce.click="{
              id: 'Videobanner',
              view: [getBiParams('Video', 'Video'), getGAParamsNeedKey('Video', 0, 'view', 'video')],
              click: [getBiParams('Video', 'Video'), getGAParamsNeedKey('Video', 0, 'click', 'video')]
            }"
            src="https://customer-m2ql7eq6sbw2l9f1.cloudflarestream.com/c5675ab2ac97c51caacdff7925bfe100/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-m2ql7eq6sbw2l9f1.cloudflarestream.com%2Fc5675ab2ac97c51caacdff7925bfe100%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false"
            class="bridal-video-iframe"
            frameborder="0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen="true"
            title="Azazie bridal video"
          ></iframe>
        </div>
        <video
          id="bridal-video"
          v-else
          autoplay
          muted
          loop
          poster="https://cdn-1.azazie.com/upimg/userfiles/images/Shoes/61/83/ce95ffe620e6ba4b4bd9862813ec6183.jpg"
          class="hls-video-module"
        ></video>
      </template>
      <!-- introduce -->
      <template v-if="moduleItem.keyStr === 'introduce'">
        <index-top-banner :item="firstTopBanners(moduleItem)" ec="bridalbanner"></index-top-banner>
      </template>
      <!-- collection banner -->
      <template v-if="moduleItem.keyStr === 'collectionBanner'">
        <bridal-main-banner
          :banners="moduleItem.bannerList"
          :bridalIndexBannerPosition="bridalIndexBannerPosition"
          :moduleItem="moduleItem"
        ></bridal-main-banner>
      </template>
      <!-- moretolove -->
      <template v-if="moduleItem.keyStr === 'moretolove'">
        <div class="more-to-love">
          <p><img :src="addWebpSuffix(nl('page_image_bridal_index_moretolove_line_pc'))" alt="bridal" /></p>
          <ul>
            <li
              v-for="(item, index) in moduleItem.bannerList"
              :key="index"
              :class="{ 'second-li': index === 1 }"
              v-track.viewOnce.click="{
                id: 'more-to-love' + index,
                view: [
                  getBiParams('Moretolove', item.el),
                  getGAParamsNeedKey(item, index, 'view', moduleItem.keyStr),
                  getNewTrackParams('category1', 'banner', item.imageUrl, index + 1, null, item.desc)
                ],
                click: [getGAParamsNeedKey(item, index, 'click', moduleItem.keyStr)]
              }"
              @click="trackClick('Moretolove', item.el, 'category1', 'banner', item.imageUrl, index + 1, item.desc, '/')"
            >
              <a :href="countryUrl(item.linkUrl)" :target="item.newWindows ? '_blank' : '_self'" aria-label="more to love">
                <img :src="addWebpSuffix(item.imageUrl)" alt="more to love" />
              </a>
              <!-- 热区 lego 配置-->
              <ImageHotSpot
                :positions="item.positions"
                :img-url="item.imageUrl"
                @hotSpotClick="setPoint('Moretolove', item.el, 'click')"
                ec="Moretolove"
              />
              <a :href="countryUrl(item.linkUrl)" class="img-label">{{ nl(item.imageLabel) }}</a>
            </li>
          </ul>
        </div>
      </template>
      <!-- lookbook -->
      <template v-if="moduleItem.keyStr === 'lookbook'">
        <div v-if="!isNewLanguageCountry" class="banner-7">
          <a
            :href="countryUrl(moduleItem.bannerList[0].linkUrl)"
            :target="moduleItem.bannerList[0].newWindows ? '_blank' : '_self'"
            v-track.viewOnce.click="{
              id: 'lookbookbanner',
              view: [
                getBiParams('Bridallookbook', 'Getinspired'),
                getGAParamsNeedKey(moduleItem.bannerList[0], 0, 'view', moduleItem.keyStr)
              ],
              click: [
                getBiParams('Bridallookbook', 'Getinspired'),
                getGAParamsNeedKey(moduleItem.bannerList[0], 0, 'click', moduleItem.keyStr)
              ]
            }"
            aria-label="lookbook"
          >
            <img v-lazy="addWebpSuffix(moduleItem.bannerList[0].imageUrl)" alt="lookbook" />
          </a>
          <!-- 热区 lego 配置-->
          <ImageHotSpot
            :positions="moduleItem.bannerList[0].positions"
            :img-url="moduleItem.bannerList[0].imageUrl"
            @hotSpotClick="setPoint('Bridallookbook', 'Getinspired', 'click')"
            ec="Bridallookbook"
          />
        </div>
      </template>
      <!-- beinspired -->
      <template v-if="moduleItem.keyStr === 'beinspired'">
        <div class="more-to-love">
          <p><img :src="addWebpSuffix(nl('page_image_bridal_index_beinspired_line_pc'))" alt="beinspired" /></p>
          <ul>
            <li
              v-for="(item, index) in moduleItem.bannerList"
              :key="index"
              :class="{ 'second-li': index === 1 }"
              v-track.viewOnce.click="{
                id: 'beinspiredbanner_' + index,
                view: [
                  getBiParams('Beinspired', item.el),
                  getGAParamsNeedKey(item, index, 'view', moduleItem.keyStr),
                  getNewTrackParams('category2', 'banner', item.imageUrl, index + 1, null, item.desc)
                ],
                click: [getGAParamsNeedKey(item, index, 'click', moduleItem.keyStr)]
              }"
              @click="trackClick('Beinspired', item.el, 'category2', 'banner', item.imageUrl, index + 1, item.desc, '/')"
            >
              <a :href="countryUrl(item.linkUrl)" :target="item.newWindows ? '_blank' : '_self'" aria-label="beinspired">
                <img :src="addWebpSuffix(item.imageUrl)" alt="beinspired" />
              </a>
              <!-- 热区 lego 配置-->
              <ImageHotSpot
                :positions="item.positions"
                :img-url="item.imageUrl"
                @hotSpotClick="setPoint('Beinspired', item.el, 'click')"
                ec="Beinspired"
              />
              <a :href="countryUrl(item.linkUrl)" class="img-label">{{ nl(item.imageLabel) }}</a>
            </li>
          </ul>
        </div>
      </template>
      <!-- featuredin -->
      <template v-if="moduleItem.keyStr === 'featuredin'">
        <div v-track.view.click="{ common: getBiParams('Featuredin', 'Press') }" class="featured">
          <div>
            <h3>{{ nl(moduleItem.title) }}</h3>
            <p>{{ nl(moduleItem.content) }}</p>
          </div>
          <img v-lazy="addWebpSuffix(moduleItem.bannerList[0].imageUrl)" alt="featuredin" />
        </div>
      </template>
      <!-- ins -->
      <template v-if="moduleItem.keyStr === 'ins'">
        <div class="bridal-tag">
          <p>{{ nl(moduleItem.title) }}</p>
          <ul>
            <li
              v-for="(item, index) in moduleItem.bannerList"
              :key="index"
              @click="showStyleGallery(item)"
              v-track.view.click="{ common: getBiParams('Instmodule', `Picture${index + 1}`) }"
            >
              <img :src="addWebpSuffix(item.imageUrl)" alt="ins" />
            </li>
          </ul>
        </div>
        <popup-style-gallery
          v-if="popupStyleGallery.popupStyleGalleryShow"
          @getGalleryInfo="getGalleryInfo"
          :pageInfo="{ page: 1, totalPage: 1 }"
        ></popup-style-gallery>
      </template>
      <!-- salepoints -->
      <template v-if="moduleItem.keyStr === 'salepoints'">
        <ul class="dress-tag">
          <li v-for="item in moduleItem.bannerList" :key="item.imageLabel" v-track.view.click="{ common: getBiParams('Salepts', item.el) }">
            <p @click="toLink(item)"><img :src="addWebpSuffix(item.imageUrl)" alt="salepoints" /></p>
            <p @click="toLink(item)">
              <span>{{ nl(item.imageLabel) }}</span>
              <span>{{ nl(item.desc) }}</span>
            </p>
          </li>
        </ul>
      </template>
      <template v-if="moduleItem.keyStr === 'lovestories'">
        <div class="love-stories">
          <p v-html="nl('page_bridal_love_stories')" class="love-stories-des"></p>
          <div class="btn-box">
            <a
              v-track.view.click="{ common: { ec: 'B_HP style gallery', el: 'VIEW REAL BRIDES' } }"
              :href="countryUrl('/style-gallery/with/category/bridal?subsite=bridal')"
              class="btn"
              >{{ nl('page_bridal_be_inspired') }}</a
            >
            <button
              v-track.view.click="{ common: { ec: 'B_HP style gallery', el: 'SUBMIT YOUR PHOTOS' } }"
              @click="clickSubmitPhotos"
              class="btn"
            >
              {{ nl('page_common_submit_photos') }}
            </button>
          </div>
        </div>
      </template>
      <!-- 系统兜底模块，新增自定义模块在这之上添加 -->
      <template v-else-if="moduleItem.keyStr.indexOf('homepage_custom') === 0">
        <common-module :config="moduleItem" :skeleton="false" :autoSize="true" :indexBannerPosition="[]"></common-module>
      </template>
    </div>
    <popup-customer-photo-upload></popup-customer-photo-upload>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'
import PopupStyleGallery from '@/components/styleGallery/PopupStyleGallery'
import bannerMixins from '@/assets/js/bannerMixins'
import { loadScript } from '@/assets/js/utils.js'
import PopupCustomerPhotoUpload from '@/components/product/PopupCustomerPhotoUpload'
import CommonModule from '@/components/common/CommonModule'
import IndexTopBanner from '@/components/indexNew/IndexTopBanner'
import { countryList } from '@/assets/js/euSizeMap'
import BridalMainBanner from './BridalMainBanner'

export default {
  languageKeys: [
    ...countryList.map((v, i) => 'page_iamge_bridal_video_mask_pc_' + v),
    'page_bridal_index_tag',
    'page_image_bridal_index_moretolove_line_pc',
    'page_image_bridal_index_beinspired_line_pc',
    'page_bridal_plus_curve',
    'page_bridal_made_to_order',
    'page_bridal_wedding_accessoried',
    'page_bridal_weddings',
    'page_bridal_gown_gallery',
    'page_bridal_testimonials',
    'page_bridal_featured_in',
    'page_bridal_featured_in_content',
    'page_bridal_dress_tag_desined',
    'page_bridal_dress_tag_desined_desc',
    'page_bridal_dress_tag_support',
    'page_bridal_dress_tag_support_desc',
    'page_bridal_dress_tag_custom',
    'page_bridal_dress_tag_custom_desc',
    'page_iamge_bridal_video_mask_pc',
    'page_bridal_try_on',
    ...PopupStyleGallery.languageKeys,
    'page_bridal_love_stories',
    'page_bridal_be_inspired',
    'page_common_submit_photos',
    ...PopupCustomerPhotoUpload.languageKeys,
    'page_bridal_video_mask_link'
  ],
  components: {
    BridalMainBanner,
    PopupStyleGallery,
    PopupCustomerPhotoUpload,
    CommonModule,
    IndexTopBanner
  },
  mixins: [colorHex, bannerMixins],
  props: {
    modules: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isIframeOnload: false,
      isSafari: false
    }
  },
  computed: {
    ...mapState('styleGallery', ['popupStyleGallery', 'galleryList', 'currentGalleryId']),
    bridalIndexBannerPosition() {
      // ga4首页banner打点的banner顺序，从上往下排
      const indexBannerKeyList = ['video', 'introduce', 'collectionBanner', 'moretolove', 'lookbook', 'beinspired'] // 首页需要ga4 banner 打点的模块
      const bridalIndexBannerPosition = []
      this.modules &&
        this.modules.forEach((item) => {
          if (indexBannerKeyList.includes(item.keyStr)) {
            bridalIndexBannerPosition.push(item.keyStr)
          }
        })
      return bridalIndexBannerPosition
    }
  },
  mounted() {
    // safari上需用hls播放m3u8，其它浏览器用iframe
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    this.$nextTick(() => {
      if (this.isSafari) {
        loadScript('https://cdn.jsdelivr.net/npm/hls.js@latest', 'hls', () => {
          if (window.Hls.isSupported()) {
            const video = document.getElementById('bridal-video')
            const hls = new window.Hls()
            hls.attachMedia(video)
            hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
              hls.loadSource('https://www.azazie.com/upvideo/product/PC-Video.mp4')
            })
            hls.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
              video.play()
            })
          }
        })
      } else if (this.$refs.videoRef) {
        this.$refs.videoRef.onload = () => {
          this.isIframeOnload = true
        }
      }
    })

    const styleGalleryModules = this.modules.filter((item) => item.keyStr == 'ins')
    if (styleGalleryModules.length) {
      const styleGalleryModule = styleGalleryModules[0]
      const galleryList = styleGalleryModule.bannerList.map((ele) => {
        return {
          galleryId: ele.linkUrl && ele.linkUrl.split('info/')[1]
        }
      })
      this.$store.commit('styleGallery/setGalleryList', galleryList)
    }
  },
  methods: {
    firstTopBanners(item) {
      const tempItem = JSON.parse(JSON.stringify(item))
      const firstTopBannerTemp = tempItem.bannerList ? JSON.parse(JSON.stringify(tempItem.bannerList)) : []
      for (const key in this.activityInfo) {
        const activityNow = JSON.parse(JSON.stringify(this.activityInfo[key]))
        if (activityNow.banner && activityNow.banner.indexBanner) {
          const activityBanners = activityNow.banner.indexBanner // 首页活动banner
          for (const i in activityBanners) {
            const bannerData = activityBanners[i]
            // 因为ga打点需要,所以这里把促销活动的id和name也加进去
            if (activityNow.base) {
              bannerData.activityId = activityNow.base.activityId
              bannerData.activityName = activityNow.base.name
            }
            // 首页活动banner，插入到first banner
            const { imgUrl, linkUrl, activityName, positions, newWindows } = bannerData
            firstTopBannerTemp.splice(bannerData.displayOrder - 1, 0, {
              bannerType: 'carousel',
              linkUrl,
              imageUrl: imgUrl,
              desc: activityName,
              positions,
              newWindows
            })
          }
        }
      }
      tempItem.bannerList = firstTopBannerTemp
      return tempItem
    },
    clickSubmitPhotos() {
      this.$store.commit('product/setPopupCustomerPhotoUploadShow', true)
    },
    showStyleGallery(item) {
      const currentGalleryId = item.linkUrl && item.linkUrl.split('info/')[1]
      this.$store.commit('styleGallery/setCurrentGalleryId', currentGalleryId)
      this.getGalleryInfo()
    },
    getGalleryInfo(id) {
      if (!this.currentGalleryId) return
      this.$store.commit('styleGallery/setPopupStyleGalleryShow', {
        popupStyleGalleryShow: true,
        popupStyleGalleryId: this.currentGalleryId
      })
      this.$store.commit('styleGallery/setGalleryInfoAgg', {})
      this.$axios.$post(`/1.0/style-gallery/info/${this.currentGalleryId}`).then((res) => {
        if (res.code == 0) {
          this.$store.commit('styleGallery/setGalleryInfoAgg', res.data || {})
        } else {
          alert(res.msg)
        }
      })
    },
    toLink(e) {
      if (e.linkUrl) {
        const url = this.countryUrl(e.linkUrl)
        if (e.newWindows) {
          window.open(url)
        } else {
          location.href = url
        }
      }
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        dp: 'home',
        ec: ec || 'Bridalhomepage',
        el: el || 'Bridalhomepage'
      }
      return obj
    },
    getGAParamsNeedKey(it, index, type, keyStr) {
      // ga打点
      if (process.server || !this.getBannerCreativeSlot(keyStr)) return
      const creativeSlot = `${this.getBannerCreativeSlot(keyStr)}_${index + 1}`
      const creativeName = it.imageLabel || it.alt
      const params = {
        event: 'ga4Event',
        event_parameters: {
          creative_slot: creativeSlot,
          creative_name: creativeName,
          promotion_name: it.activityName || 'none',
          items: [
            {
              item_id: 'none',
              item_name: 'none',
              item_category: 'none',
              item_brand: 'none',
              currency: this.currencyCode,
              promotion_id: it.activityId || 'none',
              promotion_name: it.activityName || 'none'
            }
          ]
        }
      }
      if (type === 'view') {
        params.event_name = 'view_promotion'
      } else {
        params.event_name = 'select_promotion'
      }
      return params
    },
    getBannerCreativeSlot(keyStr) {
      const position = this.bridalIndexBannerPosition.indexOf(keyStr)
      let creativeSlot = null
      // ga4 首页banner 打点从上往下排，如果后面还有新增，下面的key继续往后加
      const creativeSlotList = [
        'top banner',
        'first mid banner',
        'second mid banner',
        'third mid banner',
        'fourth mid banner',
        'fifth mid banner'
      ]
      if (position > -1) {
        creativeSlot = creativeSlotList[position]
      }
      return creativeSlot
    }
  }
}
</script>
<style lang="less" scoped>
img {
  display: block;
}
.hls-video-module {
  width: 100%;
  margin-bottom: 50px;
  position: relative;
  z-index: 9;
}
#module_load_video {
  position: relative;
}
.video-mask {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 10;
  background: transparent;
  a {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 28.6%;
    min-height: 18%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
    }
  }
}
.video-module {
  position: relative;
  padding-top: 56.25%;
  z-index: 9;
  margin-bottom: 80px;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .bridal-video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.banner-2 {
  // margin-bottom: 50px;
  width: 100%;
  position: relative;
  img {
    width: 100%;
  }
}
.banner-3 {
  width: 100%;
  img {
    width: 100%;
  }
}
.more-to-love {
  // padding: 100px;
  padding: 80px 100px;
  & > p {
    display: block;
    font-family: @font-Ivy-Mode-400;
    font-size: 60px;
    color: @theme-color;
    img {
      width: 100%;
    }
    em {
      display: block;
      flex: 1;
      margin-left: 30px;
      border-bottom: 2px solid @theme-color;
      transform: translateY(-50%);
    }
  }
  ul {
    position: relative;
    margin-top: 30px;
    display: flex;
    font-family: @font-Ivy-Mode-400;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      &.second-li {
        margin: 0 15px;
      }
      .img-label {
        font-size: 24px;
        text-decoration-line: underline;
        text-transform: uppercase;
        color: @theme-color;
        text-underline-offset: 5px;
        &:hover {
          color: var(--color-121212);
          cursor: pointer;
        }
      }
      img {
        width: 100%;
        margin-bottom: 15px;
      }
    }
  }
}
.banner-7 {
  width: 100%;
  position: relative;
  img {
    width: 100%;
  }
}
.featured {
  display: flex;
  align-items: center;
  margin: 80px 100px;
  & > div {
    width: 310px;
    min-width: 310px;
  }
  h3 {
    font-family: @font-Ivy-Mode-400;
    font-size: 28px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-666666);
  }
  p {
    margin-top: 10px;
    font-family: @font-family-500;
    font-size: 18px;
    line-height: 25px;
    color: var(--color-666666);
  }
  img {
    display: block;
    margin-left: 80px;
    width: calc(100% - 390px);
    height: calc((100% - 390px) * 0.71);
  }
}
.bridal-tag {
  background: var(--color-f1e9e6);
  margin-bottom: 100px;
  p {
    padding: 3vw 0 2.6vw;
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 3vw;
    font-feature-settings: 'liga' off;
    color: var(--color-666666);
  }
  img {
    width: 100%;
    height: 21vw;
  }
  ul {
    display: flex;
    justify-content: space-between;
    li {
      width: calc((100% - 4 * 15px) / 5);
      margin-right: 15px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  @media screen and (min-width: 1920px) {
    p {
      padding: 60px 0 50px;
      font-size: 60px;
    }
  }
  @media screen and (max-width: 1280px) {
    // img {
    //   height: 273.33px;
    // }
  }
  @media screen and (max-width: 1600px) {
    p {
      padding: 30px 0 25px;
      font-size: 36px;
    }
  }
}
.dress-tag {
  margin: 20px auto 80px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  max-width: 1640px;
  width: 100%;
  p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    span {
      display: block;
      color: var(--color-666666);
      max-width: 320px;
      word-break: break-word;
      &:nth-child(1) {
        font-family: @font-Ivy-Mode-400;
        font-size: 20px;
        line-height: 25px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      &:nth-child(2) {
        font-family: @font-family-500;
        font-size: 14px;
        margin-top: 5px;
      }
    }
    &:nth-child(1) {
      position: relative;
      padding-right: 25px;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 15px;
        height: 70px;
        width: 1px;
        background: @border-color;
      }
    }
    &:nth-child(2) {
      padding-left: 25px;
    }
  }
  li {
    display: flex;
    justify-content: space-between;
    margin-right: 30px;
    &:last-child {
      margin-right: 0;
    }
    img {
      width: 80px;
    }
    &:hover {
      p,
      span {
        color: @theme-color!important;
      }
    }
  }
}
.love-stories {
  background: url('https://cdn-1.azazie.com/upimg/userfiles/images/Shoes/97/78/bab9c46f709391e0c80ad915fd319778.jpg') no-repeat center;
  background-size: cover;
  padding: 117px 0px;
  text-align: center;
  &-des {
    font-size: 60px;
    line-height: 85px;
    font-family: @font-Ivy-Mode-400;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .btn-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 430px;
      height: 70px;
      background: transparent;
      font-family: @font-family-600;
      font-size: 20px;
      font-style: normal;
      line-height: normal;
      letter-spacing: 2px;
      text-transform: uppercase;
      border: 1px solid var(--color-121212);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
      &:first-child {
        margin-right: 25px;
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .more-to-love {
    padding: 80px;
    ul {
      li {
        .img-label {
          font-size: 20px;
        }
      }
    }
  }
  .featured {
    margin: 0 80px 100px;
    h3 {
      font-size: 20px;
    }
    p {
      font-size: 15px;
    }
    img {
      margin-left: 50px;
    }
  }
  .dress-tag {
    p {
      span {
        &:nth-child(1) {
          font-size: 16px;
          line-height: 20px;
        }
      }
    }
  }
  .love-stories-des {
    font-size: 54px;
  }
}
@media screen and (max-width: 1280px) {
  .more-to-love {
    padding: 50px;
    ul {
      li {
        .img-label {
          font-size: 16px;
        }
      }
    }
  }
  .featured {
    margin: 30px 50px 80px;
    h3 {
      font-size: 16px;
    }
    p {
      font-size: 13px;
    }
    img {
      margin-left: 20px;
    }
  }
  .love-stories-des {
    font-size: 46px;
  }
}
a {
  position: relative;
}
</style>
