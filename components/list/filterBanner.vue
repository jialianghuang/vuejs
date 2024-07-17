<template v-if="filterBanner && filterBanner.length > 0">
  <div id="filter_banner" v-track.viewOnce.click="{ id: 'filter_banner', common: getBiParams('outer') }" class="filter-banner">
    <div
      v-for="(item, index) in filterBanner"
      :key="index"
      :isWebActivity="item.isWebActivity"
      v-track.viewOnce.click="{ id: 'filter_banner_item_' + index, common: getBiParams('inner', item, index) }"
      class="filter-banner-item item"
    >
      <a
        :href="countryUrl(solveLink(item.linkUrl))"
        :class="{ 'no-pointer': judgeIsEmptyUrl(item.linkUrl) }"
        :aria-label="item.alt ? item.alt.replace('+', ' ') : 'banner' + index"
        :target="item.newWindows ? '_blank' : '_self'"
        v-track.viewOnce.click="{
          id: `ga_filterbanner_${item.alt}_${index}`,
          view: getGAParams(item, index, 'view'),
          click: getGAParams(item, index, 'click')
        }"
      >
        <img
          :src="addWebpSuffix(item.imgUrl)"
          :alt="item.alt ? item.alt.replace(/\+/g, ' ').replace(/_/g, ' ') : 'filter banner' + index"
        />
        <!-- 热区 lego 配置-->
        <ImageHotSpot :positions="item.positions" ec="filter" />
      </a>
    </div>
  </div>
</template>

<script>
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'FilterBanner',
  mixins: [bannerMixins],
  props: {
    filterBanner: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      viewArr: []
    }
  },
  methods: {
    getBiParams(type, item, index) {
      if (process.server) return
      const currentItem = item || this.filterBanner[1] || {}
      const msg = {
        index: index + 1,
        img_link: currentItem.imgUrl,
        category_ids: this.catIds
      }
      if (currentItem && currentItem.isWebActivity) {
        msg.report_pos = 'activity_banner'
      }

      const params = {
        ec: 'filter',
        el: 'filter banner',
        param1: (location && location.href) || '-1',
        msg: JSON.stringify(msg)
      }
      if (type == 'inner') {
        params.el = this.catBiName + '_filter banner'
      }
      if (msg) {
        params.param2 = this.versionObj && this.versionObj.activityAbtest
      }
      return params
    },
    solveLink(url) {
      if (!url) return ''
      if (!url.includes('all/sample-') && !url.includes('all/ready-to-ship') && !url.includes('all/last-chance-outlet')) return url
      if (!url.includes('?')) return url + '?current_in_stock=yes'
      else if (url.includes('current_in_stock')) return url.replace(/current_in_stock(=[^=&#]*)?/, 'current_in_stock=yes')
      else return url + '&current_in_stock=yes'
    },
    getGAParams(item, index, type) {
      // ga打点
      if (process.server) return
      const creativeSlot = `side banner_${index + 1}`
      const creativeName = item.alt || item.bannerText
      const params = {
        event: 'ga4Event',
        event_parameters: {
          creative_slot: creativeSlot,
          creative_name: creativeName,
          promotion_name: item.activityName || 'none',
          items: [
            {
              item_id: 'none',
              item_name: 'none',
              item_category: 'none',
              item_brand: 'none',
              currency: this.currencyCode,
              promotion_id: item.activityId || 'none',
              promotion_name: item.activityName || 'none'
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
    }
  }
}
</script>

<style lang="less" scoped>
.filter-banner {
  background-color: #fff;
  .filter-banner-item {
    margin-bottom: 10px;
    a {
      display: block;
      position: relative;
    }
    img {
      width: 100%;
    }
  }
}
</style>
