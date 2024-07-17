<template>
  <div class="header-nav-dot">
    <div>
      <div class="header-nav-box-out-box">
        <div id="header-nav" class="header-nav-box header-nav-version-a">
          <div class="nav-wrap">
            <div ref="navFixed" class="nav-fixed">
              <div ref="nav" :class="['nav', { 'not-one-line-nav': menuListGrid && menuListGrid.length > 1 }]">
                <div
                  v-for="(navItem, navIndex) in showMenuList"
                  :key="`${navItem.id}-${navIndex}`"
                  @mouseenter="navMouseenter(navItem)"
                  @mouseleave="navMouseleave(navItem)"
                  @click="selectNav(navItem)"
                  :class="[
                    navItem.name,
                    {
                      'nav-item': true,
                      'nav-item-selected': currentSelectedNavKey == navItem.id && jsKey == 'list',
                      'nav-hover': currentNav == navItem.id
                    }
                  ]"
                >
                  <div class="nav-item-box">
                    <a @click="navBuryPoint(navItem.name)" :class="navItem.style" :href="countryUrl(navItem.linkUrl)" class="nav-a-link"
                      >{{ navItem.nameText ? navItem.nameText : nl(navItem.name) }}
                    </a>
                    <img
                      v-if="navItem.imgUrl"
                      :src="addWebpSuffix(navItem.imgUrl)"
                      :alt="navItem.nameText ? navItem.nameText : nl(navItem.name)"
                      class="icon-tag"
                    />
                  </div>
                  <div v-show="currentNav == navItem.id && (navItem.children || navItem.imgs)" class="nav-sub-menu">
                    <div
                      :class="{ 'overfour-wrapper': navItem.children && navItem.children.length > 3 && navIndex === 0 }"
                      class="desktop-wrapper"
                    >
                      <template v-for="(subMenuItem, subMenuIndex) in navItem.children">
                        <template v-if="!subMenuItem.key">
                          <div :key="`${subMenuItem.name}-${navIndex}-${subMenuIndex}`" class="header-submenu header-submenu-normal">
                            <h4
                              v-track.viewOnce="{
                                id: `point_${navItem.id}_${subMenuItem.id}`,
                                view: getBiParamsView(navItem.name, subMenuItem.name, '')
                              }"
                            >
                              {{ subMenuItem.nameText ? subMenuItem.nameText : nl(subMenuItem.name) }}
                            </h4>
                            <div :class="[{ 'two-line': getDoubleColumnList(subMenuItem.children).length == 2 }, country]">
                              <ul v-for="(dItem, dIndex) in getDoubleColumnList(subMenuItem.children)" :key="dIndex">
                                <li
                                  v-for="(menuLinkItem, menuLinkIndex) in dItem"
                                  :key="`${menuLinkItem.name}-${navIndex}-${subMenuIndex}-${menuLinkIndex}`"
                                >
                                  <a
                                    v-if="menuLinkItem.linkUrl && menuLinkItem.linkUrl !== 'javascript:void(0);'"
                                    @click="menuLinkBuryPoint(navItem.name, subMenuItem.name, menuLinkItem.name)"
                                    :href="countryUrl(menuLinkItem.linkUrl)"
                                    :class="menuLinkItem.style"
                                    v-track.viewOnce="{
                                      id: `point_${navItem.id}_${subMenuItem.id}_${menuLinkItem.id}`,
                                      view: getBiParamsView(navItem.name, subMenuItem.name, menuLinkItem.name)
                                    }"
                                    :aria-label="
                                      menuLinkItem.imgUrl
                                        ? navItem.name + ' ' + menuLinkItem.name + ' img link ' + menuLinkIndex
                                        : navItem.name + ' ' + menuLinkItem.name + ' link ' + menuLinkIndex
                                    "
                                  >
                                    {{ menuLinkItem.name }}
                                    <img
                                      v-if="menuLinkItem.imgUrl"
                                      :src="addWebpSuffix(menuLinkItem.imgUrl)"
                                      :alt="menuLinkItem.name"
                                      class="icon-tag"
                                    />
                                  </a>
                                  <span v-else :class="menuLinkItem.style">{{ menuLinkItem.name }}</span>
                                </li>
                              </ul>
                            </div>
                            <!-- 仿照m站新增banner配置 -->
                            <div v-if="subMenuItem.menuImgs && subMenuItem.menuImgs.length">
                              <a
                                v-for="(img, index) in subMenuItem.menuImgs"
                                :key="index"
                                :href="countryUrl(img.linkUrl)"
                                @click="menuLinkBuryPoint(navItem.name, subMenuItem.name, img.alt)"
                              >
                                <img
                                  @click="clickMenuImg(img.name)"
                                  :src="addWebpSuffix(img.imgUrl)"
                                  :alt="img.alt"
                                  class="submenu-list-banner"
                                />
                              </a>
                            </div>
                            <!-- 仿照m站新增banner配置 -->
                          </div>
                        </template>
                      </template>
                      <template v-if="navItem.imgs">
                        <div
                          :class="{ 'header-submenu-swatches': navItem.activity && navItem.activity.param == 'swatches-fabrics' }"
                          class="header-submenu"
                        >
                          <div class="submenu-img-box">
                            <div
                              v-for="(menuImgItem, menuImgIndex) in navItem.imgs"
                              :key="`${navIndex}-${menuImgIndex}`"
                              :class="{ 'swatch-fabric-box': navItem.activity && navItem.activity.param == 'swatches-fabrics' }"
                              :style="getImgBoxWidth(navItem.imgs.length, navItem.activity && navItem.activity.param == 'swatches-fabrics')"
                              class="submenu-img-item"
                            >
                              <a
                                :href="countryUrl(menuImgItem.linkUrl)"
                                @click="externalSetDatelayer(menuImgItem, menuImgIndex, navItem.name)"
                                :class="{
                                  'no-pointer': judgeIsEmptyUrl(menuImgItem.linkUrl)
                                }"
                                :aria-label="itemLinkTitleAriaLabel(navItem, menuImgItem, menuImgIndex)"
                                :target="menuImgItem.newWindows ? '_blank' : '_self'"
                                class="item-link"
                              >
                                <img
                                  :src="addWebpSuffix(menuImgItem.imgUrl)"
                                  :class="getCurrentImgWidth(navItem.id, menuImgIndex)"
                                  :alt="menuImgItem.imgText || menuImgItem.bannerText"
                                />
                                <!-- 热区 lego 配置-->
                                <ImageHotSpot :positions="menuImgItem.positions" ec="navbar" />
                                <div class="item-link-title">
                                  <span>{{ menuImgItem.imgText || menuImgItem.bannerText }}</span>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div v-if="showMoreBtn && menuListGrid" class="arrow-btn"> -->
              <div v-if="showMoreBtn" class="arrow-btn">
                <az-icon
                  :class="{ disabled: menuListGridIndex <= 0 }"
                  @click="getGridStep(-1)"
                  v-track.viewOnce.click="getBiParamsArrow('showleftnavbar', 'left')"
                  class="arraw-icon"
                  icon-class="icon-lby_arrow_left"
                />
                <az-icon
                  :class="{ disabled: menuListGridIndex > 0 }"
                  @click="getGridStep(1)"
                  v-track.viewOnce.click="getBiParamsArrow('showrightnavbar', 'right')"
                  class="arraw-icon"
                  icon-class="icon-lby_arrow_right"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import signRoomBagMixins from '@/assets/js/signRoomBagMixins'
import bannerMixins from '@/assets/js/bannerMixins'
import { createThrottle } from '@/assets/js/utils'

export default {
  name: 'AzHeaderNav',
  filters: {
    /* 过滤roomName名称显示格式 */
    filtRoomName(e) {
      let res = e
      // 页面中视图显示位置最多显示7位，如果roomName大于7位，就要做格式过滤处理
      if (e.length > 7) {
        // 格式:abcd...(1),abcdef...
        // 先判断字符串中有没有（），如果有格式第一种，如果没有格式第二种
        const reg = /\(|\)/g // 正则校验字符串中是否有括号
        if (reg.test(res)) {
          res = res.substring(0, 4) + '...' + res.substring(res.length - 3, res.length)
        } else {
          res = res.substring(0, 6) + '...'
        }
      }
      return res
    }
  },
  mixins: [signRoomBagMixins, bannerMixins],
  props: {
    adaptive: {
      type: Boolean,
      default: false
    },
    onlyFixedHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // navSize: {}
      menuListGridIndex: 0,
      menuListGrid: null,
      sizeMap: {},
      sizeCount: 0,
      showMoreBtn: false,
      // 以上新增
      mouseEnterTimer: 0,
      searchShow: false,
      currentNav: '',
      mouseTimer: null,
      activityLoading: false,
      researchShow: false,
      loginHref: '',
      top: '42px',
      copyNavItem: {},
      // 当前选择的 nav的 key，用来设置选中状态
      currentSelectedNavKey: ''
    }
  },
  computed: {
    showMenuList({ menuListGrid, menuListGridIndex, menuList }) {
      return menuListGrid && menuListGrid.length > 1 ? menuListGrid[menuListGridIndex] : menuList
    },
    // 考虑一行元素的使用 space-arround
    overOneGridItem({ menuListGrid }) {
      return menuListGrid && menuListGrid.length > 1
    },
    barData() {
      const barData = []
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        if (activity.bar && activity.bar[activity.base.status]) {
          barData.push({
            couponCode: activity.base.couponCode || '',
            bar: activity.bar[activity.base.status],
            status: activity.base.status,
            countdownEndTime: activity.base.countdownEndTime
          })
        }
      }
      return barData
    },
    size() {
      return (item) => {
        if (item.formatStyles && item.formatStyles.size) {
          if (item.formatStyles.size.CustomSize) {
            return item.formatStyles.size.CustomSize.name
          } else if (item.formatStyles.size.standardSize) {
            return this.nl('page_common_size') + ': ' + item.formatStyles.size.standardSize.name
          }
        }
        return ''
      }
    },
    menuList() {
      const tempMenuList = JSON.parse(JSON.stringify(this.navigation.navigation)) || []
      return tempMenuList
    }
  },
  watch: {
    activityInfo: {
      handler(newVal, oldVal) {
        const glVar = typeof window === 'object' ? window : global
        if (newVal.length && !glVar.isActivityFlag) {
          glVar.isActivityFlag = true
          this.activityLoading = true
          // 判断活动banner是否有数据，如果有匹配数据，修改菜单列表对应数据
          if (newVal[0].banner && newVal[0].banner.navBanner && newVal[0].banner.navBanner.length && this.menuList.length) {
            const navBanner = newVal[0].banner.navBanner
            navBanner.forEach((item) => {
              this.menuList.forEach((navItem, navIndex) => {
                if (navItem.activity && navItem.activity.param && item.navName == navItem.activity.param) {
                  item.isWebActivity = true
                  if (navItem.imgs) {
                    const itemImgLen = navItem.imgs.length
                    if (navItem.activity && navItem.activity.param == 'swatches-fabrics') {
                      navItem.imgs.splice(0, 0, item)
                    } else {
                      navItem.imgs.splice(item.displayOrder * 1 - 1, 0, item)
                    }
                    navItem.imgs.splice(itemImgLen, 1)
                  } else {
                    navItem.imgs = [item]
                  }
                }
              })
            })
          }
        }
      }
    }
  },
  mounted() {
    // 为第一级菜单的曝光打点
    let temp = {}
    const items = []
    if (this.menuList && this.menuList.length) {
      this.menuList.forEach((item) => {
        const name = this.nl(item.name).toLowerCase()
        temp.ec = 'Firstngbar'
        temp.ea = 'view'
        temp.el = name
        temp.msg = JSON.stringify({ p1: name })
        temp.param1 = (location && location.href) || '-1'
        items.push(temp)
        temp = {}
      })
    }

    this.buryPoint(this, 'events', items)
    this.loginHref = `/user/login?back=${location.href}`
    document.documentElement.addEventListener('click', (e) => {
      if (e.target.closest('.az-header-search')) {
        setTimeout(() => {
          this.searchShow = false
        }, 0)
      } else {
        this.searchShow = false
      }
    })
    this.currentSelectedNavKey = (sessionStorage && sessionStorage.getItem('current_selected_nav_key')) || ''
    const sizeMap = {}
    let sizeCount = 0
    const elements = document.body.querySelectorAll('.nav .nav-item')
    this.menuList.forEach((navItem, index) => {
      const element = elements[index]
      if (element) {
        const width = element.offsetWidth
        sizeCount += width
        sizeMap[navItem.id] = width
      }
    })
    this.sizeMap = sizeMap
    this.sizeCount = sizeCount
    // 初始执行
    // this.resizeFn()
    this.resizeFnThrottle = createThrottle(this.resizeFn.bind(this))
    this.resizeFnThrottle()
    window.addEventListener('resize', this.resizeFnThrottle)
  },
  methods: {
    // 获取item-link-title元素对应的aria-label内容
    itemLinkTitleAriaLabel(navItem, menuImgItem, menuImgIndex) {
      const catName = navItem.nameText ? navItem.nameText : this.nl(navItem.name)
      return catName + ' ' + (menuImgItem.imgText || menuImgItem.bannerText) + ' img link' + menuImgIndex
    },
    getBiParamsArrow(el, p1) {
      if (process.server) return
      return {
        id: el + '-' + p1,
        common: {
          ec: 'navbar',
          el,
          msg: {
            p1
          },
          param1: (location && location.href) || '-1'
        }
      }
    },
    resizeFn() {
      // 节流后执行
      this.scheduledResize = false
      const nav = document.body.querySelector('.nav')
      if (!nav) return false
      const navWidth = nav.offsetWidth
      // const arrow = document.body.querySelector('.arrow-btn')
      // if (!arrow) navWidth -= 45
      this.showMoreBtn = this.sizeCount > navWidth
      // this.getGroup(navWidth)
    },
    getGroup(navWidth) {
      const grid = []
      let row = []
      const sizeMap = this.sizeMap
      let allowWidth = navWidth
      const prevId =
        this.menuListGrid && this.menuListGrid[this.menuListGridIndex]
          ? this.menuListGrid[this.menuListGridIndex][0].id
          : this.menuList[0].id
      let prevToCurrentIndex = 0
      // console.log(prevId)
      this.menuList.forEach((navItem, index) => {
        const itemWidth = sizeMap[navItem.id]
        if (navWidth < itemWidth) {
          if (row.length) {
            grid.push(row)
            row = []
          }
          grid.push([navItem])
          allowWidth = navWidth
        } else {
          if (allowWidth >= itemWidth) row.push(navItem)
          else {
            grid.push(row)
            row = [navItem]
            allowWidth = navWidth
          }
          allowWidth -= itemWidth
        }
        if (prevId === navItem.id) {
          prevToCurrentIndex = grid.length - 1 + (row.length ? 1 : 0)
        }
      })
      grid.push(row)
      this.menuListGrid = grid
      this.menuListGridIndex = prevToCurrentIndex
    },
    getGridStep(step) {
      if (step > 0) {
        const scrollLeft = this.$refs.navFixed.scrollWidth - this.$refs.navFixed.clientWidth
        this.$refs.navFixed.scrollTo(scrollLeft, 0)
        const scrollLeftNav = this.$refs.nav.scrollWidth - this.$refs.nav.clientWidth
        this.$refs.nav.scrollTo(scrollLeftNav, 0)
      } else {
        this.$refs.navFixed.scrollTo(0, 0)
        this.$refs.nav.scrollTo(0, 0)
      }
      this.menuListGridIndex = step
      // const index = this.menuListGridIndex + step
      // if (index < 0 || index > this.menuListGrid.length - 1) return
      // this.menuListGridIndex = index
    },
    selectNav(navItem) {
      sessionStorage && sessionStorage.setItem('current_selected_nav_key', navItem.id)
      this.currentSelectedNavKey = navItem.id
    },
    // nav bar 的订单追踪
    setNavBarOrderSourceFlag() {
      const navBarVersion = 'VersionB_NavBar'
      this.setOrderSourceFlag(navBarVersion, true)
    },
    // 为nav的点击事件埋点
    navBuryPoint(langName) {
      let eventParams = {}
      eventParams = {
        ec: 'Firstngbar',
        el: this.nl(langName).toLowerCase(),
        ea: 'click',
        msg: JSON.stringify({ p1: this.nl(langName).toLowerCase() }),
        param1: (location && location.href) || '-1'
      }
      this.buryPoint(this, 'event', eventParams)
      this.setNavBarOrderSourceFlag()
    },
    // 为menuLink打点
    menuLinkBuryPoint(navItemName, subMenuName, menuLinkName) {
      let eventParams = {}
      const msg = {
        p1: this.nl(navItemName).toLowerCase(),
        p2: this.nl(subMenuName).toLowerCase(),
        p3: this.nl(menuLinkName).toLowerCase()
      }

      eventParams = {
        ec: 'Thirdngbar',
        el: this.nl(menuLinkName).toLowerCase(),
        ea: 'click',
        msg: JSON.stringify(msg),
        param1: (location && location.href) || '-1'
      }
      this.buryPoint(this, 'event', eventParams)
      this.setNavBarOrderSourceFlag()
    },
    // 为nav的子元素打点
    subMenuBuryPoint(menuImgIndex, navItemName, menuImgItem) {
      // 这里对图片事件进行打点，el是如 1st image 这样的。根据图片的顺序
      const numberSuffix = ['st', 'nd', 'rd']
      const defaultSuffix = 'th'
      const defaultEl = ' image'
      const suffix = numberSuffix[menuImgIndex] || defaultSuffix
      const el = menuImgIndex + 1 + suffix + defaultEl
      let eventParams = {}
      let msg = {}

      msg = {
        p1: this.nl(navItemName).toLowerCase(),
        p3: el
      }
      eventParams = {
        ec: 'navbar',
        el,
        ea: 'click',
        msg: JSON.stringify(msg),
        param1: (location && location.href) || '-1',
        param2: this.versionGroup.banner_navigation_top
      }

      if (menuImgItem.isWebActivity) {
        eventParams.msg = JSON.stringify({
          report_pos: 'activity_banner'
        })
        eventParams.param2 = this.versionObj.activityAbtest
      }

      this.buryPoint(this, 'event', eventParams)
      this.setNavBarOrderSourceFlag()
    },
    debounce(fn, wait) {
      let timeout = null
      return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
      }
    },
    externalSetDatelayer(menuImgItem, menuImgIndex, subMenuItem) {
      this.subMenuBuryPoint(menuImgIndex, subMenuItem, menuImgItem)
      if (menuImgItem && menuImgItem.eventCategory && menuImgItem.eventName) {
        this.setDataLayer({
          action: 'click',
          category: menuImgItem.eventCategory,
          label: menuImgItem.eventName
        })
      }
    },
    showSignSubmenu(show) {
      if (!this.isLogin) {
        this.setDataLayer({
          action: 'view',
          category: 'PC_GuestCheckout',
          label: 'PC_TrackOrderTop_View'
        })
      }
      this.signShowSubmenu = show
    },
    getCurrentImgWidth(key, index) {
      let res
      switch (key) {
        case 'bridesmaids':
          res = 'img-186-240'
          break
        case 'brides':
          res = 'img-266-240'
          break
        case 'mbd':
          res = 'img-255-240'
          break
        case 'special-occasions':
          res = 'img-236-240'
          break
        case 'accessories':
          res = 'img-266-240'
          break
        case 'swatch-fabric':
          res = 'img-616-240'
          break
        case 'samples':
          res = 'img-319-240'
          break
        case 'ready_to_ship':
          res = 'img-248-240'
          break
        case 'inspo':
          res = 'img-324-240'
          break
        case 'sale':
          res = 'img-275-240'
          break
        default:
          break
      }
      return res
    },
    getImgBoxWidth(n, bol) {
      if (!n || !bol) return {}
      return {
        width: `calc((100% - (${bol ? '0px' : '24px'})) / ${n}) !important;`
      }
    },
    navMouseenter(item) {
      this.copyNavItem = item
      // 清除显示定时器
      if (this.mouseEnterTimer) clearTimeout(this.mouseEnterTimer)
      // 等于当前显示导航，清除隐藏定时器
      if (this.mouseTimer && this.currentNav === item.id) clearTimeout(this.mouseTimer)
      this.mouseEnterTimer = setTimeout(
        () => {
          if (this.currentNav !== item.id) this.currentNav = item.id
        },
        // 有二级导航延迟显示
        150
      )
    },
    // 二级导航栏子列表曝光率打点
    setDataLayerOfNavSubItemsView(navItem) {
      if (!navItem) return
      if (navItem.children && navItem.children[navItem.children.length - 1] && navItem.children[navItem.children.length - 1].children) {
        navItem.children[navItem.children.length - 1].children.map((imgsItem) => {
          if (imgsItem.eventViewCategory && imgsItem.eventViewName) {
            this.setDataLayer({
              category: imgsItem.eventViewCategory,
              action: 'view',
              label: imgsItem.eventViewName
            })
          }
        })
      }
    },
    navMouseleave(item) {
      clearTimeout(this.mouseEnterTimer)
      if (this.currentNav !== item.id) return
      this.mouseTimer = setTimeout(() => {
        // 等于当前显示导航 且 隐藏定时器 > 显示定时器
        if (this.currentNav === item.id) {
          this.currentNav = ''
        }
      }, 300)
    },
    getStyle(el) {
      let myGetComputedStyle
      if (typeof window.getComputedStyle !== 'function') {
        myGetComputedStyle = function(el, pseudo) {
          const oStyle = {}
          const oCurrentStyle = el.currentStyle || {}
          for (const key in oCurrentStyle) {
            oStyle[key] = oCurrentStyle[key]
          }

          oStyle.styleFloat = oStyle.cssFloat

          oStyle.getPropertyValue = function(prop) {
            return oCurrentStyle.getAttribute(prop) || null
          }
          return oStyle
        }
      } else {
        myGetComputedStyle = window.getComputedStyle
      }
      return myGetComputedStyle(el)
    },
    searchFixedEvent() {
      this.searchShow = true
    },
    closeActivity() {
      this.activityLoading = false
    },
    buyNowClick() {
      window.location.href = this.countryUrl('/checkout')
    },
    clickMenuImg(menuName) {
      if (menuName == 'bridalstylefinder') this.$emit('styleQuizBtnClick')
    },
    getBiParamsView(p1, p2, p3) {
      if (process.server) return
      const msg = {
        p1: this.nl(p1).toLowerCase()
      }
      if (p2) {
        msg.p2 = this.nl(p2).toLowerCase()
      }
      if (p3 && p3.toLowerCase() != p1.toLowerCase()) {
        msg.p3 = this.nl(p3).toLowerCase()
      }
      return {
        ec: p3 ? 'Thirdngbar' : 'Secondngbar',
        el: this.nl(msg.p3 || msg.p2 || msg.p1).toLowerCase(),
        msg: JSON.stringify(msg),
        param1: (location && location.href) || '-1'
      }
    },
    getDoubleColumnList(item = []) {
      const arr = []
      let spliceIndex = 0
      if (item && item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          const tempItem = item[i]
          if (tempItem.style && tempItem.style.includes('columns')) {
            spliceIndex = i
            break
          }
        }
        if (spliceIndex > 0) {
          arr[0] = item.slice(0, spliceIndex)
          arr[1] = item.slice(spliceIndex)
        } else {
          arr[0] = item.slice(0)
        }
      }
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
@navFixHeight: 48px;
.header-nav-dot {
  position: relative;
}
.smooth-header {
  height: 53px;
  &.activity-smooth-header {
    height: 35px;
  }
}

.arrow-btn {
  // margin-right: 15px;
  width: 30px;
  height: 39px;
  line-height: 39px;
  position: absolute;
  right: 18px;
  background-color: #fff;
  .arraw-icon {
    width: 12px;
    height: 12px;
    cursor: pointer;
    &.disabled {
      opacity: 0.35;
    }
  }
}

.nav-wrap {
  // position: relative;
  padding-right: 30px;
}
.nav-fixed {
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
  display: flex;
}
.header-fixed {
  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
  // z-index: @fixed-z-index;
  // background: #ffffff;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &.header-activty-fixed {
    // top: 50px;
  }
  .arrow-btn {
    height: @navFixHeight;
    line-height: @navFixHeight;
  }
  .header-nav-box-out-box {
    .header-nav-box {
      position: unset;
      height: unset;
      max-width: unset;
      &.header-nav-version-a {
        .nav-wrap .nav .nav-item {
          letter-spacing: 0;
        }
        .submenu-img-box {
          .submenu-img-item {
            &.swatch-fabric-box {
              width: 50% !important;
              .header-submenu-border {
                margin: 0 26px 0 26px !important;
              }
            }
          }
        }
      }
      .nav-wrap {
        height: unset;
        &.nav-wrap-fixed {
          box-sizing: content-box;
          .nav {
            // padding: 0 15px 6px;
            flex-wrap: nowrap;
            justify-content: center;
            height: @navFixHeight;
            line-height: @navFixHeight;
            margin: 0 15px;
            flex: 1;
            .nav-item {
              padding: 0;
              height: @navFixHeight;
              line-height: @navFixHeight;
              .nav-item-box {
                // padding: 0 15px;
                .icon-tag {
                  top: 3px;
                }
                .nav-a-link {
                  &::after {
                    padding: 0 2px;
                    left: -2px;
                  }
                }
              }
            }
            .nav-sub-menu {
              top: 80px;
            }
          }
        }
      }
    }
  }
}
.header-nav-box-out-box {
  border-bottom: 3px solid #f1f1f1;
  position: relative;
  .header-nav-box {
    // height: 39px;
    box-sizing: border-box;
    min-width: 1263px;
    max-width: 1353px;
    width: 100%;
    padding: 0 30px;
    margin: 0 auto;
    &.header-nav-version-a {
      .nav-wrap .nav .nav-item {
        letter-spacing: 0;
      }
      .submenu-img-box {
        .submenu-img-item {
          &.swatch-fabric-box {
            width: 50% !important;
            .header-submenu-border {
              margin: 0 26px 0 26px !important;
            }
            &:last-child {
              text-align: right;
            }
          }
        }
      }
    }
    .nav-wrap {
      top: 0;
      left: 0;
      right: 0;
      background: #fff;
      .nav {
        margin: 0 auto;
        font-size: 0;
        display: flex;
        justify-content: center;
        flex: 1;
        &.not-one-line-nav {
          justify-content: center;
        }
        .nav-item {
          display: inline-block;
          vertical-align: top;
          height: 39px;
          line-height: 39px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-size: 13px;
          white-space: nowrap;
          &:nth-child(1) {
            .nav-item-box {
              padding-left: 0;
            }
          }
          &:last-child {
            .nav-item-box {
              padding-right: 0;
            }
          }
          .nav-item-box {
            padding: 0 25px;
            position: relative;
            .icon-tag {
              // width: 36px;
              height: 15px;
              position: absolute;
              // top: -2px;
              // right: -15px;
              padding: 0;
            }
          }
        }
        .pdl24 {
          width: 10px;
          display: inline-block;
        }
        .nav-a-link {
          display: inline-block;
          width: 100%;
          height: 100%;
          padding: 0;
          position: relative;
          font-family: @font-family-500, sans-serif;
          color: var(--color-121212);
          &.bold {
            font-family: @font-family-600, sans-serif;
          }
          &::after {
            box-sizing: content-box;
            content: '';
            display: block;
            width: 100%;
            height: 3.5px;
            background-color: transparent;
            margin-top: -3.5px;
            padding: 0 8px;
            position: relative;
            left: -8px;
          }
        }
      }
    }
  }
}
.nav-item {
  // position: relative;
  .nav-item-box {
    .nav-a-link {
      &.space {
        color: @theme-color!important;
      }
    }
  }
  &.nav-hover {
    .nav-a-link {
      color: @theme-color!important;
      &::after {
        background-color: @theme-color!important;
      }
    }
  }
  .nav-a-link:hover {
    color: @theme-color!important;
    &::after {
      background-color: @theme-color!important;
    }
  }
}
.nav-item-selected {
  .nav-a-link {
    &::after {
      background-color: @theme-color!important;
    }
  }
}
.nav-a-link {
  &.highlight {
    color: @theme-color!important;
  }
}
.nav-sub-menu .desktop-wrapper .header-submenu {
  ul li {
    a {
      &:hover {
        color: @theme-color;
      }
      &.theme-color {
        color: @theme-color;
      }
      &.highlight {
        color: @theme-color;
      }
    }
  }
  .submenu-img-box .submenu-img-item .item-link {
    .item-link-title {
      background: @btn-light-hover-color;
    }
    &:hover {
      .item-link-title {
        background: @theme-color;
        color: #fff;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .header-fixed {
    .header-nav-box {
      padding-left: 30px !important;
      padding-right: 30px !important;
    }
  }
}
/deep/ .az-with-code-box {
  justify-content: flex-start !important;
}

// 自适应移出来
.nav-sub-menu {
  font-size: 13px;
  // line-height: 27px;
  line-height: 20px;
  letter-spacing: normal;
  font-family: @font-family-500, sans-serif;
  position: absolute;
  z-index: @z-index-5; // 兼容详情页和列表页视频
  text-transform: none;
  text-align: left;
  box-sizing: border-box;
  width: 100%;
  top: 42px;
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  min-height: 370px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
  .desktop-wrapper {
    margin: 0 auto;
    text-align: center;
    display: flex;
    justify-content: center;
    white-space: nowrap;
    min-width: 1204px;
    max-width: 1294px;
    .header-submenu {
      background: #fff;
      display: inline-block;
      vertical-align: top;
      text-align: left;
      padding: 30px;
      margin-right: -2px;
      h4 {
        display: block;
        margin-top: 0;
        line-height: 21px;
        text-decoration: none;
        font-family: @font-family-500, sans-serif;
        text-transform: uppercase;
        font-size: 13px;
        padding-bottom: 3px;
        margin-bottom: 11px;
        color: var(--color-121212);
        font-weight: normal;
        border-bottom: 1px solid #eee;
      }
      .survey-entrance {
        margin-top: 12px;
        a {
          cursor: pointer;
          display: inline-block;
          img {
            width: 150px;
            height: 90px;
          }
        }
      }
      ul {
        li {
          margin: 7px 0;
          a,
          span {
            position: relative;
            // display: block;
            // white-space: nowrap;
            color: var(--color-121212);
            overflow: hidden;
            white-space: nowrap;

            .icon-tag {
              // width: 24px;
              height: 15px;
              position: absolute;
              bottom: 8px;
              // right: -24px;
              padding: 0;
              // right: 0;
            }
            &.bold {
              font-family: @font-family-600, sans-serif;
            }
            &.space {
              margin-left: 10px;
            }
          }
          a {
            &:hover {
              color: @text-light-hover-color;
            }
          }
        }
      }
      .submenu-img-box {
        display: flex;
        justify-content: space-between;
        // padding: 5px 0 0 0;
        .submenu-img-item {
          display: inline-block;
          padding: 0;
          margin: 0 0 0 12px;
          &:nth-child(1) {
            margin-left: 0;
          }
          &.swatch-fabric-box {
            margin: 0;
            &:nth-child(1),
            &:nth-child(2) {
              width: 300px;
            }
            &:nth-child(3) {
              .item-link {
                .item-link-title {
                  display: none;
                }
              }
            }
            .item-link {
              display: inline-block;
            }
          }
          .item-link {
            position: relative;
            display: block;
            white-space: nowrap;
            color: var(--color-121212);
            font-size: 0;
            height: 280px;
            img {
              // width: 100%;
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 240px;
              vertical-align: middle;
              &.img-240-240 {
                width: 240px;
                height: 240px;
              }
              &.img-179-280 {
                width: 179px;
                height: 280px;
              }
              &.img-250-280 {
                width: 250px;
                height: 280px;
              }
              &.img-246-280 {
                width: 246px;
                height: 280px;
              }
              &.img-232-280 {
                width: 232px;
                height: 280px;
              }
              &.img-226-200 {
                width: 220px;
                height: 200px;
              }
              &.img-311-280 {
                width: 311px;
                height: 280px;
              }
              &.img-186-240 {
                width: 186px;
                height: 240px;
              }
              &.img-266-280 {
                width: 266px;
                height: 280px;
              }
              &.img-266-240 {
                width: 266px;
                height: 240px;
              }
              &.img-255-240 {
                width: 255px;
                height: 240px;
              }
              &.img-237-240 {
                width: 237px;
                height: 240px;
              }
              &.img-319-240 {
                width: 319px;
                height: 240px;
              }
              &.img-319-280 {
                width: 319px;
                height: 280px;
              }
              &.img-248-240 {
                width: 248px;
                height: 240px;
              }
              &.img-324-240 {
                width: 324px;
                height: 240px;
              }
              &.img-275-240 {
                width: 275px;
                height: 240px;
              }
              &.img-240-220 {
                width: 240px;
                height: 220px;
              }
              &.img-236-240 {
                width: 236px;
                height: 240px;
              }
              &.img-611-280 {
                width: 611px;
                height: 280px;
              }
              &.img-616-240 {
                width: 616px;
                height: 240px;
              }
            }
            .item-link-title {
              position: absolute;
              // bottom: 0;
              width: 100%;
              height: 40px;
              font-size: 13px;
              font-family: @font-family-600, sans-serif;
              color: var(--color-121212);
              text-align: center;
              text-transform: uppercase;
              line-height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: auto;
              padding: 2px 0;
              span {
                min-height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 18px;
                word-break: break-word;
                white-space: break-spaces;
              }
            }
          }
        }
      }
    }
    .header-submenu-swatches {
      width: 100%;
      .submenu-img-item {
        width: 50%;
        box-sizing: border-box;
        &:last-child {
          border-left: 1px solid #eee;
        }
      }
    }
    .header-submenu-border {
      display: inline-block;
      vertical-align: top;
      margin: 0 0 0 26px;
      background: #fff;
      height: 100%;
      width: 1px;
    }
    .submenu-list-banner {
      width: 118px;
      height: 64px;
      margin-top: 14px;
      &:first-child {
        margin-top: 1px;
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .desktop-wrapper {
      &.overfour-wrapper {
        width: 500px;
      }
    }
  }
}
.nav-logo {
  margin-top: 7px;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background: url(~assets/images/common/azazie_logo_fixed.svg) no-repeat;
  background-size: cover;
}
.right_container {
  position: unset;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: @navFixHeight;
  .header-search {
    position: absolute;
    top: 13px;
    right: 136px;
    z-index: @z-index-5;
  }
  .account_operation {
    background-color: #fff;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      float: left;
      position: relative;
      cursor: pointer;
      margin-left: 15px;
      height: 100%;
      display: flex;
      &:nth-child(1) {
        margin-left: 0;
      }
      a.account-a {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #101010;
        display: flex;
        justify-content: center;
        align-items: center;
        &::before {
          position: relative;
          display: inline-block;
          content: '';
          width: 18px;
          height: 18px;
        }
        &.ht_search_fixed::before {
          background: url(~assets/images/common/xxy_search_s.svg) no-repeat;
          background-size: cover;
        }
        &.ht_find_store::before {
          width: 20px;
          height: 20px;
          background: url(~assets/images/common/location.svg) no-repeat;
          background-size: contain;
        }
        &.ht_login_fixed::before {
          background: url(~assets/images/common/xxy_sign_in.svg) no-repeat;
          background-size: cover;
        }
        &.ht_fav_fixed::before {
          height: 16.5px;
          background: url(~assets/images/common/xxy_Create_a_Showroom.svg) no-repeat;
          background-size: cover;
        }
        &.ht_bag_fixed::before {
          background: url(~assets/images/common/xxy_bag.svg) no-repeat;
          background-size: cover;
        }
        &.ht_bag_fixed {
          span {
            font-size: 13px;
          }
        }
      }
      .msg_bubble {
        background-color: var(--color-121212);
        opacity: 0.8;
        border-radius: 4px;
        position: absolute;
        width: 192px;
        right: -20px;
        top: 30px;
        em {
          position: absolute;
          top: -6px;
          left: 90px;
          width: 13px;
          height: 8px;
          background: url(~assets/images/seo_sprite_20190129.png?5770949) no-repeat;
          background-position: -577px -33px;
          display: block;
          border-left: 0px;
        }
        p {
          line-height: normal;
          text-align: center;
          font-size: 13px;
          color: #ffffff;
          font-family: @font-family-500, sans-serif;
          padding: 12px;
        }
      }
      .submenu {
        color: #101010;
        background: #fff;
        border: 1px solid #e1e1e1;
        padding: 15px 20px;
        position: absolute;
        left: 0;
        top: 40px;
        text-align: left;
        &.sign-submenu {
          left: -22px;
          z-index: @z-index-5;
          .color-activity-info {
            font-size: 12px;
            color: #666;
            width: 198px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 6px;
            .welcome {
              font-weight: 600;
              margin-bottom: 5px;
            }
            .des {
              font-weight: normal;
              span {
                color: @theme-color;
              }
            }
          }
        }
        li {
          margin: 0;
          padding: 6px 0 6px 0px;
          float: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
        a {
          .text-link(@gray);
          background: #fff;
          padding: 0;
          height: auto;
        }
        &.popCart {
          width: 349px;
          padding: 0;
          z-index: @z-index-5;
          .goods_scroll {
            padding: 15px 15px 0;
            overflow: scroll;
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 466px;
            box-sizing: border-box;
          }
          border: 1px solid #e1e1e1;
          left: auto;
          right: 0;
          li {
            position: relative;
            display: flex;
            box-sizing: content-box;
            height: 125px;
            margin-bottom: 25px;
            padding: 0;
            box-sizing: border-box;
            .left_img {
              height: 100%;
              img {
                height: 125px;
              }
            }
            .right_info {
              height: 100%;
              display: flex;
              flex-direction: column;
              margin-left: 15px;
              .goods_div {
                padding-bottom: 5px;
                display: flex;
                width: 180px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .goods_name {
                  width: 100% !important;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  font-size: 13px;
                  font-family: @font-family-600;
                }
                span a {
                  font-size: 12px;
                  font-family: @font-family-600;
                  color: var(--color-121212);
                  line-height: 12px;
                }
              }
              .name,
              .value {
                text-transform: capitalize;
              }
              .color_div {
                width: 180px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .qty_div {
                width: 180px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .price {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                .goods-price-box {
                  .current-price {
                    color: @theme-color;
                    font-size: 16px;
                    font-family: @font-family-600;
                  }
                  .no-deal-price {
                    font-size: 13px;
                    font-family: @font-family-500;
                    color: var(--color-999999);
                    text-decoration: line-through;
                  }
                }
                .goods-price {
                  font-size: 13px;
                  color: var(--color-121212);
                  font-family: @font-family-600;
                }
              }
              .delete_rec {
                position: absolute;
                top: 10px;
                right: 0;
                .remove {
                  cursor: pointer;
                  display: block;
                  width: 14px;
                  height: 14px;
                  background: url(~assets/images/common/icon_delete.png);
                  background-size: contain;
                }
              }
            }
            ul {
              li {
                // position: relative;
                a {
                  position: relative;
                  // display: block;
                  white-space: nowrap;
                  color: var(--color-121212);
                  .icon-tag {
                    // width: 24px;
                    height: 15px;
                    position: absolute;
                    top: -7px;
                    // right: -24px;
                    padding: 0;
                  }
                  &:hover {
                    color: var(--color-121212);
                  }
                  &.theme-color {
                    color: var(--color-121212);
                  }
                  &.highlight {
                    color: var(--color-121212);
                  }
                  &.bold {
                    font-family: @font-family-600, sans-serif;
                  }
                  &.space {
                    margin-left: 10px;
                  }
                }
              }
            }
            &.go_to_cart {
              display: block;
              text-align: center;
              height: auto;
              margin: 0 15px;
              padding: 10px 0 15px;
              min-height: 100px;
              box-sizing: border-box;
              border-top: 1px solid #ccc;
              .total {
                padding: 0 0 15px 0;
                text-transform: uppercase;
                font-size: 13px;
                font-family: @font-family-600;
                color: var(--color-121212);
                .line-total-box {
                  .current-total {
                    color: @theme-color;
                    font-family: @font-family-600;
                  }
                  .line-total {
                    color: var(--color-999999);
                    font-size: 13px;
                    font-family: @font-family-500;
                  }
                }
                .sub-total {
                  text-transform: uppercase;
                }
              }
              .view_button {
                cursor: pointer;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .to_cart,
                .to_checkout {
                  display: block;
                  width: 155px;
                  text-transform: uppercase;
                  font-size: 14px;
                  font-family: @font-family-600;
                  box-sizing: border-box;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  .txt {
                    white-space: break-spaces;
                    line-height: 16px;
                    height: 100%;
                    display: inline-flex;
                    align-items: center;
                    max-width: calc(~'100% - 40px');
                  }
                }
                .to_cart {
                  background: @theme-color;
                  color: #fff;
                  .icon {
                    height: 15px;
                    width: 20px;
                    fill: currentColor;
                    margin-right: 5px;
                  }
                  &:hover {
                    background: @title-color;
                  }
                }
                .to_checkout {
                  border: 1px solid @theme-color;
                  background: #fff;
                  color: @theme-color;
                  .icon {
                    height: 13px;
                    width: 18px;
                    fill: currentColor;
                    margin-right: 5px;
                  }
                  &:hover {
                    background: var(--color-f1e9e6);
                  }
                }
                &.view_button_fr {
                  flex-direction: column;
                  .to_cart,
                  .to_checkout {
                    width: calc(100% - 30px) !important;
                  }
                  .to_checkout {
                    margin-top: 10px !important;
                  }
                }
              }
            }
          }
        }
        &.showroom_sub {
          z-index: @z-index-5;
          .showroom_name {
            display: inline-block;
            max-width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
          }
        }
      }
      .dropdown.over {
        .submenu {
          display: block;
        }
      }
    }
  }
}

// 自适应添加

.header-submenu-border {
  display: none;
}

.nav-logo {
  &.nav-logo-nofix {
    display: none;
  }
  &.nav-logo-fix {
    display: block;
  }
}

.right_container {
  &.right_container_nofix {
    display: none;
  }
  &.right_container_fix {
    display: block;
  }
}

.adaptive-header-nav-dot .header-nav-box-out-box {
  @media screen and (max-width: 1262px) {
    .header-nav-box {
      width: 100%;
      min-width: 768px;
      // min-width: unset;
      padding: 0 20px !important;
      margin: 0 auto;
    }

    .header-submenu-normal {
      // margin-right: 26px;
      &.header-submenu-normal-last {
        margin-right: 0;
      }
    }
    .nav-sub-menu {
      .desktop-wrapper {
        // width: 100%;
        .header-submenu .submenu-img-box {
          // flex-wrap: wrap;
          .submenu-img-item {
            // min-width: 80px;
            .item-link {
              height: unset;
              padding-bottom: 40px;
              img {
                // width: 100%;
                height: auto;
                width: auto;
                max-width: 100%;
                vertical-align: middle;
              }
              .item-link-title {
                bottom: 0px;
                // top: 100%;
              }
            }
          }
          .submenu-img-item.swatch-fabric-box {
            margin: 0;
            // margin: 12px;
          }
        }
        .submenu-img-box {
          .header-submenu-border {
            display: none;
          }
        }
      }
      .item-link-title {
        overflow: hidden;
        span {
          max-width: 100%;
          line-height: 18px;
          word-break: break-word;
          white-space: break-spaces;
        }
      }
    }
  }

  // @media screen and (min-width: 1024px) {
  //   .right_container {
  //     .account_operation {
  //       .acc_op_child {
  //         // margin-bottom: 10px;
  //         // margin-right: 10px;
  //         // margin-left: 0;
  //       }
  //       .acc_op_line:first-child {
  //         .acc_op_child:last-child {
  //           margin-right: 10px;
  //         }
  //       }
  //     }
  //   }
  // }
  @media screen and (max-width: 1023px) {
    .arrow-btn {
      height: @navFixHeight;
      line-height: @navFixHeight;
      right: 50px;
    }
    .nav-sub-menu {
      padding-left: 15px;
      padding-right: 15px;
      min-width: 768px;
    }
    .nav-fixed {
      overflow: initial;
    }
    .header-nav-box .nav-wrap .nav {
      justify-content: flex-start;
      padding-left: 15px;
      // padding-right: 15px;
      overflow: auto;
      margin-right: 30px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .nav-wrap .nav .nav-item {
      line-height: @navFixHeight;
      height: @navFixHeight;
    }
    .nav-logo {
      &.nav-logo-nofix {
        display: block;
      }
    }
    .right_container {
      &.right_container_nofix {
        display: block;
      }
      .header-search {
        right: 115px;
      }
    }
    // .header-nav-box .nav-wrap.nav-wrap-fixed .nav {
    //   padding: 0 15px 6px;
    //   margin-top: 15px;
    // }
  }
}

@media screen and (max-width: 900px) {
  .adaptive-header-nav-dot .header-nav-box-out-box .nav-sub-menu .item-link-title {
    height: auto;
    padding: 4px 0;
    span {
      font-size: 12px;
      line-height: 16px;
      min-height: 32px;
    }
  }
}
.BRIDES .submenu-list-banner {
  width: 147px !important;
}
@media screen and (max-width: 1360px) {
  .nav-sub-menu .desktop-wrapper .header-submenu-swatches {
    .submenu-img-item.swatch-fabric-box {
      &:last-child {
        border: none;
      }
    }
  }
  .nav-sub-menu .desktop-wrapper .header-submenu .submenu-img-box .submenu-img-item.swatch-fabric-box .item-link {
    max-width: 97%;
    height: unset;
    img {
      vertical-align: middle;
    }
    .item-link-title {
      bottom: -40px;
    }
  }
}
.two-line {
  display: flex;
  ul {
    &:nth-child(1) {
      margin-right: 40px;
    }
    li {
      &:nth-child(1) {
        margin-top: 0 !important;
      }
    }
  }
}
.header-fixed {
  .nav-item {
    height: 48px !important;
    line-height: 48px !important;
  }
  .nav-sub-menu {
    top: 50px;
  }
}
</style>
