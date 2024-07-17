<template>
  <div :class="{ 'bridal-footer-menu': isBridal }" class="footer-menu-box">
    <div id="footer_module" class="footer-menu-wrapper">
      <div class="footer-help">
        <div id="aria-foot-nav">
          <div v-for="(itemList, itemIndex) in isBridal ? bridalFooterMenu : footerMenu" :key="itemList.name" class="col">
            <div v-if="isBridal" v-track.viewOnce="{ common: getBiParams('Bridalfooter', nl(itemList.name)) }" class="bridal h3">
              {{ nl(itemList.name) }}
            </div>
            <div v-else class="h3">{{ nl(itemList.name) }}</div>
            <ul>
              <li v-for="(item, index) in itemList.items" :key="`footer${index}`">
                <a
                  v-if="showFooterMenu(item)"
                  @click="clickFooterMenuItem(item.key, itemList, item, itemIndex)"
                  :class="[item.class, { need_datalayer: item.need_datalayer, 'font-bold': item.font_bold }]"
                  :data-datalayer-category="item.category"
                  :data-datalayer-label="item.label"
                  :href="setFooterMenuUrl(item)"
                  :aria-label="item.nameText ? nl(item.nameText) : nl(item.name)"
                  >{{ item.nameText ? nl(item.nameText) : nl(item.name) }}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-service-right">
        <!-- <client-only>
          <bridal-footer-subscribe v-if="isBridal"></bridal-footer-subscribe>
        </client-only> -->
        <div class="footer-service-right-top">
          <div class="footer-share social-share-index footer-share-A">
            <div :class="{ bridal: isBridal }" class="h3">{{ nl('page_common_follow_us') }}</div>
            <ul class="sns-set">
              <li v-for="(item, index) in followLinkList" :key="index">
                <a
                  :class="item.type"
                  :data-datalayer-label="item.label"
                  :href="countryUrl(item.href)"
                  :aria-label="item.type"
                  target="_blank"
                  class="need_datalayer"
                  data-datalayer-category="Bottom_FollowUs_Click"
                >
                  <az-icon :icon-class="item.iconClass" />
                </a>
              </li>
              <li
                id="li-footer-fblike"
                class="footer-fblike need_datalayer"
                data-datalayer-category="Bottom_FollowUs_Click"
                data-datalayer-label="FollowUs_Like_Click"
              >
                <div
                  class="fb-like"
                  data-href="https://www.facebook.com/azazieofficial"
                  data-width="240"
                  data-height="40"
                  data-layout="button_count"
                  data-show-faces="false"
                  data-action="like"
                  data-colorscheme="light"
                ></div>
              </li>
            </ul>
          </div>
          <div class="download-app">
            <div :class="{ bridal: isBridal }" class="h3">{{ nl('page_download_azazie_app') }}</div>
            <div class="download-icon">
              <a href="https://azazie.onelink.me/IW0r/8izofs7e" aria-label="iphone">
                <az-icon icon-class="icon-iPhone"></az-icon>
              </a>
              <a href="https://azazie.onelink.me/IW0r/8izofs7e" aria-label="android">
                <az-icon icon-class="icon-Android1"></az-icon>
              </a>
            </div>
          </div>
        </div>
        <p id="view-mobile-site" class="hide">
          <a id="_goto_mobile_site" style="cursor: pointer;">{{ nl('page_common_view_mobile_site') }}</a>
        </p>
        <client-only>
          <div v-if="!cart_info" class="wedding-wire-awards">
            <section class="icon-box">
              <a
                v-for="(item, index) in footerIcons"
                v-track.viewOnce.click="{
                  id: item.ec + item.el,
                  common: { ec: item.ec, el: item.el }
                }"
                :href="item.linkUrl ? item.linkUrl : 'javascript:;'"
                :key="index"
                :target="item.linkUrl ? '_blank' : '_self'"
                :class="{ 'no-link': !item.linkUrl }"
                :aria-label="item.text"
              >
                <span class="hide">{{ item.text }}</span>
                <img :class="item.text" :src="addWebpSuffix(item.iconClass)" :alt="item.text.replace('_', ' ')" class="icon-img" />
              </a>
            </section>
          </div>

          <SvgPayment />
          <div class="payment-type">
            <div :class="{ bridal: isBridal }" class="h3">{{ nl('page_common_cart_we_accept') | filterWeAccept }}</div>
            <ul class="card-list">
              <li v-for="(item, index) in allPayCardList" :key="index" :class="item" class="card-item">
                <img
                  v-if="item == 'cartes-bancaires'"
                  :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/77/51/723e448f39d9ccc6f8f1c96bcefa7751.png')"
                  alt="cartes bancaires"
                />
                <az-icon v-else :icon-class="item" class="icon"></az-icon>
              </li>
            </ul>
          </div>
          <div class="privacy-policy-menu">
            <section class="privacy-policy-item">
              <template v-for="(item, index) in list">
                <a
                  v-if="
                    ((!item.belong && !item.uninclude) ||
                      (item.belong && item.belong == country) ||
                      (item.belong && item.belong.length && item.belong.includes(country)) ||
                      (item.uninclude && item.uninclude.length && !item.uninclude.includes(country))) &&
                      item.show
                  "
                  @click="clickFooterMenuItem(item.key, itemList, item, itemIndex)"
                  :href="setFooterMenuUrl(item)"
                  :target="item.isBlank ? '_blank' : ''"
                  :key="index"
                  :class="[item.className]"
                  noreferrer
                  noopener
                  hidden
                >
                  <span>{{ item.nameText ? nl(item.nameText) : nl(item.name) }}</span>
                  <template v-if="item.hasIcon">
                    <img :src="item.icon" :alt="item.alt" />
                  </template>
                  <span v-if="item.hasLine" class="inlineBlock"></span>
                </a>
              </template>
            </section>
          </div>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { countryList } from '@/assets/js/euSizeMap'
import SvgPayment from '@/components/svgs/SvgPayment'
import footerMenu from './../../assets/js/footerMenu'
import bridalFooterMenu from './../../assets/js/bridalFooterMenu'

export default {
  name: 'AzFooterMenu',
  languageKeys: [
    'page_common_follow_us',
    'page_download_azazie_app',
    'page_common_view_mobile_site',
    'page_common_cart_we_accept',
    /** * footerMenu.js  start */
    'page_sitemap_shopping',
    'page_sitemap_shop_color',
    'page_sitemap_shop_length',
    'page_sitemap_shop_fabric',
    'page_sitemap_shop_silhouette',
    'page_footer_menu_shop_by_style',
    'page_footer_menu_shop_by_strap_&_sleeves',
    'page_footer_menu_shop_by_back_style',
    'page_shop_by_collection',
    'page_index_shop_blush_mark',
    'page_index_shop_gift_card',
    'page_js_azazie',
    'page_common_blog',
    'page_common_about_us',
    'page_common_careers',
    'page_sitemap_press',
    'page_common_partner',
    'page_sitemap_affiliate_program',
    'page_sitemap_ambassador_program',
    'page_common_site_map',
    'page_sitemap_terms',
    'page_sitemap_privacy',
    'page_common_accessibility_statement',
    'page_sitemap_ca_transparency',
    'page_reviews_keywords',
    'page_sitemap_customer_care',
    'page_common_customer_support',
    'page_goods_size_chart',
    'page_footer_menu_track_your_order',
    'page_mid_dress_guide',
    'page_common_goods_shipping',
    'page_common_payment_methods',
    'page_student_discount_title',
    'page_common_return_policy',
    'page_common_contact_us',
    'page_new_privacy_policy_menu_title3',
    'page_new_privacy_policy_menu_dnns',
    /** * footerMenu.js end */
    /** bridalFooterMenu start */
    'page_bridal_footer_brand',
    'page_bridal_footer_our_story',
    'page_bridal_footer_azazie_brides',
    'page_bridal_footer_testimonials',
    'page_bridal_footer_lookbooks',
    'page_bridal_footer_careers',
    'page_bridal_footer_resources',
    'page_bridal_footer_ordering_timerframes',
    'page_bridal_footer_sizing_charts',
    'page_bridal_footer_faqs',
    'page_bridal_footer_shipping',
    'page_bridal_footer_return',
    'page_bridal_footer_terms',
    'page_sitemap_ca_transparency',
    'page_bridal_footer_account',
    'page_bridal_footer_cantact',
    'page_bridal_footer_our_dresses',
    'page_bridal_footer_wedding_dresses',
    'page_bridal_footer_plus_size',
    'page_bridal_footer_dresses',
    'page_bridal_footer_bridesmaid',
    'page_bridal_footer_mother_bride',
    'page_bridal_footer_how_our_sizing_works',
    'page_sitemap_choices_privacy',
    ...countryList.map((v, i) => 'page_common_provacy_policy_pdf_' + v)
    /** bridalFooterMenu end */
  ],
  filters: {
    // 因为多语言中有：，没必要新增多语言，直接对内容进行处理
    filterWeAccept(e) {
      return e.split(':')[0]
    }
  },
  components: {
    SvgPayment
  },
  data() {
    return {
      cart_info: '',
      scrollIndex: true,
      footerMenu,
      bridalFooterMenu
    }
  },
  computed: {
    footerIcons() {
      return [
        {
          linkUrl:
            'http://www.theknot.com/marketplace/redirect-894418?utm_source=vendor_website&utm_medium=banner&utm_term=02784224-8fcd-4607-8ce4-a510009cd907&utm_campaign=vendor_badge_assets',
          iconClass:
            this.country == 'MX'
              ? 'https://cdn-1.azazie.com/upimg/userfiles/images/65/70/ce8a9ffd3890e91b87ac20d28cba6570.png'
              : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/4a/31/c6a9c6fe37e7060d6317e2c8f5bc4a31.png',
          ec: 'bottomicon',
          el: 'theknot',
          text: 'theknot'
        },
        {
          linkUrl: 'https://www.weddingwire.com/reviews/azazie-inc-san-jose/784a02386cc70386.html',
          iconClass: 'https://cdn-1.azazie.com/upimg/userfiles/images/65/59/2ae504f88f6401ebf4e21600f2eb6559.png',
          ec: 'bottomicon',
          el: 'weddingwire',
          text: 'weddingwire_awards'
        },
        {
          linkUrl: '',
          iconClass: 'https://cdn-1.azazie.com/upimg/userfiles/images/c0/10/5fc55b3d6a14f67ac98f4a434113c010.png',
          ec: 'bottomicon',
          el: 'glorssy-fashion',
          text: 'glorssy_fashion'
        }
        // {
        //   linkUrl:
        //     'https://www.digitalcommerce360.com/product/top-1000-database/?_hsmi=216662806&_hsenc=p2ANqtz-8YOZWqyhsNPi0i0J6_6wDSFIO3JB3vaBrw0jdAdfQ721gl7zLjVhobqAS4rz8sSHZ6iAL80ZIQJ7Yk1auOsSWKsLxoeg',
        //   iconClass: 'https://cdn-1.azazie.com/upimg/userfiles/images/0b/fd/97d31511620ba047a5906797c17e0bfd.png',
        //   ec: 'bottomicon',
        //   el: 'top-1000-database',
        //   text: 'top 1000'
        // }
      ]
    },
    list({ showCANotice }) {
      return [
        {
          name: 'page_sitemap_terms',
          url: '/terms-of-use',
          hasLine: true,
          show: true
        },
        {
          name: 'page_sitemap_privacy',
          url: this.nl('page_common_provacy_policy_pdf_' + this.country.toLowerCase()),
          isBlank: true,
          hasLine: true,
          show: true
        },
        {
          name: 'page_sitemap_choices_privacy',
          url: 'https://privacy.azazie.com/opt-out',
          hasIcon: true,
          hasLine: true,
          // className: 'truevault-polaris-optout',
          show: true,
          icon: 'https://polaris.truevaultcdn.com/static/assets/icons/optout-icon-blue.svg',
          alt: 'California Consumer Privacy Act (CCPA) Opt-Out Icon'
        },
        {
          name: 'page_common_accessibility_statement',
          url: '/accessibility_statement',
          belong: ['US', 'AU', 'CA', 'GB'],
          hasLine: true,
          show: true
        },
        {
          name: 'page_sitemap_ca_transparency',
          url: '/ca-transparency',
          belong: 'US',
          hasLine: true,
          show: true
        },
        {
          name: 'page_new_privacy_policy_menu_title3',
          url: 'https://privacy.azazie.com/privacy-policy#california-privacy-notice',
          isBlank: true,
          hasLine: true,
          className: 'truevault-polaris-privacy-notice',
          show: showCANotice
        },
        {
          name: 'page_new_privacy_policy_menu_dnns',
          url: 'https://privacy.azazie.com/opt-out',
          isBlank: true,
          hasLine: false,
          show: true
        }
      ]
    }
  },
  mounted() {
    const self = this
    window.addEventListener('scroll', function() {
      if (!document.querySelector('.track-your-order')) return false
      const a = document.querySelector('.track-your-order').offsetTop
      if (a >= document.querySelector('html').scrollTop && a < document.querySelector('html').scrollTop + window.innerHeight) {
        if (self.scrollIndex) {
          self.scrollIndex = false
          self.setDataLayer({
            action: 'view',
            category: 'PC_GuestCheckout',
            label: 'PC_TrackOrderBot_View'
          })
        }
      } else if (a - document.querySelector('html').scrollTop < 0 || a > document.querySelector('html').scrollTop + window.innerHeight) {
        self.scrollIndex = true
      }
    })
  },
  methods: {
    // 是否展示对应的footerMenu
    showFooterMenu(item) {
      // 大使入口US,CA仅限en，其他语言不展示
      if (item.key && item.key === 'ambassador_program') {
        if ((this.country === 'US' && this.language !== 'en') || (this.country === 'CA' && this.language !== 'en')) {
          return false
        }
      }
      return (
        (!item.belong && !item.uninclude) ||
        (item.belong && item.belong.length && item.belong.includes(this.country)) ||
        (item.uninclude && item.uninclude.length && !item.uninclude.includes(this.country))
      )
    },
    setFooterMenuUrl(item) {
      let footerMenuUrl = ''
      if (item.key == 'track_your_order') {
        footerMenuUrl = 'javascript:void(0);'
      } else if (item.country) {
        if (item.country == this.country) {
          footerMenuUrl = item.yesUrl
        } else {
          footerMenuUrl = item.noUrl
        }
      } else if (item.url.includes('http') || item.isSupportUrl) {
        footerMenuUrl = item.url
      } else {
        footerMenuUrl = this.countryUrl(item.url)
      }

      if (item.key && item.key === 'blog_link') {
        footerMenuUrl = this.getBlogUrl(footerMenuUrl)
      }

      if (item.isSupportUrl) {
        return this.getSupportUrl(footerMenuUrl, item.intercomUrl)
      }

      return footerMenuUrl
    },
    clickFooterMenuItem(key, itemList, item, itemIndex) {
      if (key == 'track_your_order') {
        if (!this.isLogin) {
          window.location.href = this.countryUrl('/user/login?has_track=1')
        } else {
          window.location.href = this.countryUrl('/order/list')
        }
        return false
      } else if (key === 'ambassador_program') {
        this.buryPoint(this, 'event', {
          ec: 'AMBASSADOR PROGRAM',
          el: 'AMBASSADOR PROGRAM',
          ea: 'click'
        })
      } else if (this.isBridal) {
        this.buryPoint(
          this,
          'event',
          this.getBiParams(this.nl(itemList.name), item.nameText ? this.nl(item.nameText) : this.nl(item.name), itemIndex + 1)
        )
      }
    },
    getBiParams(ec, el, index) {
      if (process.server) return
      const obj = {
        ec: !index ? 'Bridalfooter' : ec.toLowerCase(),
        el: el.toLowerCase()
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.footer-menu-box {
  background: var(--color-f9f9f9);
  overflow: hidden;
}
.footer-menu-wrapper {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  max-width: 1640px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
  text-transform: uppercase;
  a {
    color: var(--color-121212);
    &:hover {
      color: var(--color-121212);
    }
  }
  .footer-help {
    #aria-foot-nav {
      display: flex;
    }
    .col {
      width: fit-content;
      overflow: hidden;
      white-space: nowrap;
      &:not(:last-of-type) {
        margin-right: calc(100px - 0.078125 * (1920px - 100vw));
      }
    }
    .h3 {
      margin-bottom: 22px;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 1px;
      font-family: @font-family-600;
      font-size: @title-font-size;
      &.bridal {
        font-family: @title-font-family;
      }
    }
    li {
      font-family: @font-family-500;
      font-size: 14px;
      a {
        display: inline-block;
        margin-bottom: 15px;
      }
    }
    .track-order-foot-entry {
      font-family: @font-family-600, sans-serif;
    }
    .semi_bold {
      font-family: @font-family-600, sans-serif;
    }
  }
  .footer-service-right {
    width: 545px;
    .h3 {
      font-family: @font-family-600;
      font-size: @title-font-size;
      line-height: 19px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      &.bridal {
        font-family: @title-font-family;
      }
    }
    &-top {
      display: flex;
      justify-content: space-between;
      .download-app {
        width: 200px;
        .download-icon {
          display: flex;
          align-items: center;
          margin-top: 15px;
          a {
            margin-right: 23px;
          }
        }
        .az-icon {
          width: 24px;
          height: 24px;
        }
      }
    }
    .wedding-wire-awards {
      padding-top: 40px;
      .icon-box {
        max-width: 545px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0;
        > a {
          margin-right: 10px;
          &.no-link {
            cursor: default;
          }
          &:last-of-type {
            margin: 0;
          }
        }
        .icon-img {
          max-height: 100px;
        }
        .glorssy_fashion,
        .weddingwire_awards {
          height: 73px;
        }
      }
    }
    .footer-share-A {
      .h3 {
        font-family: @font-family-600;
        margin-bottom: 14px;
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 1px;
        &.bridal {
          font-family: @title-font-family;
        }
      }
    }
    .sns-set {
      width: 260px;
      height: 25px;
      li {
        float: left;
        a {
          box-sizing: content-box;
          display: block;
          float: left;
          overflow: hidden;
          line-height: 24px;
          font-size: 24px;
          margin-right: 19px;
        }
        &.footer-fblike {
          margin-top: 16px;
          overflow: hidden;
        }
      }
    }
    .payment-type {
      margin-top: 40px;
      .h3 {
        margin-bottom: 15px;
        font-family: @font-family-600;
        &.bridal {
          font-family: @title-font-family;
        }
      }
      .card-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .card-item {
          height: 30px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          &.icon-google-pay-1 {
            width: 44px;
            height: 24px;
            .az-icon {
              width: 100%;
              height: 24px;
            }
          }
          &:last-of-type {
            margin: 0;
            margin-bottom: 10px;
          }
          img {
            width: 46.36px;
            height: 30px;
          }
          .az-icon {
            width: 46.36px;
            height: 30px;
          }
        }
      }
    }
    .privacy-policy-menu {
      margin: 30px auto 5px;
      a {
        display: inline-block;
        margin-bottom: 5px;
        font-size: 14px;
        line-height: 16px;
        color: var(--color-121212);
        img {
          height: 14px;
          vertical-align: sub;
        }
      }
      .inlineBlock {
        display: inline-block;
        height: 10px;
        width: 1px;
        margin: 0 10px 0 8px;
        background-color: #ccc;
      }
    }
  }
}
.bridal-footer-menu {
  background: var(--color-f2e9e6);
  .footer-menu-wrapper {
    padding: 50px 20px 30px;
    a:hover {
      color: @btn-hover-color;
    }
    .footer-help {
      .col {
        min-width: 150px;
      }
      .h3 {
        border-bottom: 1px solid var(--color-121212);
        padding-bottom: 10px;
      }
    }
  }
}
.footer-underline {
  background: var(--color-ffffff);
  width: 100%;
  height: 5px;
}
</style>
