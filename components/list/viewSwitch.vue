<template>
  <div id="view_switch" @click="changeViewSwitch" class="view-switch fl">
    <SvgList />
    <template v-if="viewSwitch == 'larger'">
      <az-icon icon-class="icon-lby_view_smaller" class="icon view-icon"></az-icon>
      <span class="view_txt">{{ nl('page_common_view_smaller') }}</span>
    </template>
    <template v-else>
      <az-icon icon-class="icon-lby_view_larger" class="icon view-icon"></az-icon>
      <span class="view_txt">{{ nl('page_common_view_larger') }}</span>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SvgList from '@/components/svgs/SvgList'
import AzIcon from '../az-ui/AzIcon.vue'

export default {
  name: 'ViewSwitch',
  languageKeys: ['page_common_view_smaller', 'page_common_view_larger'],
  components: { AzIcon, SvgList },
  props: {
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dress_type: 'bridesmaids'
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      sodView: (state) => state.list.sodView
    })
  },
  watch: {
    sodView(newval) {
      if (this.isSpecialCatId(this.catId) && this.sodView == 'petite_plus') {
        this.$store.commit('list/setViewSwitch', 'smaller')
      } else if (this.isSpecialCatId(this.catId)) {
        const viewSwitch = this.$cookie.getCookie('view_switch') || 'larger'
        this.$store.commit('list/setViewSwitch', viewSwitch)
      }
    }
  },
  mounted() {
    // 打点 只针对 list
    if (this.$route.name == 'list') {
      const msg = {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      this.buryPoint(this, 'event', {
        ec: 'viewsmaller',
        el: 'viewsmaller',
        ea: 'view',
        msg: JSON.stringify(msg)
      })
    }
    // 为了区别时装的胖瘦图，这里大小图模式使用 view_switch 存cookie,setViewSwitch存store
    const viewSwitch = this.viewSwitch || this.$cookie.getCookie('view_switch') || 'larger'
    this.$store.commit('list/setViewSwitch', viewSwitch)
  },
  methods: {
    changeViewSwitch() {
      if (this.from == 'gift-card-detail') {
        // 礼品卡详情，see more 弹框使用大小视图
        if (this.viewSwitch === 'smaller') {
          this.$store.commit('list/setViewSwitch', 'larger')
        } else {
          this.$store.commit('list/setViewSwitch', 'smaller')
        }
        return
      }
      const txt = this.viewSwitch === 'smaller' ? 'Larger' : 'Smaller'
      const msg = {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      this.setDataLayer({
        action: 'click',
        category: 'PC_ListpageRevision',
        label: `ListPageA_View${txt}_Click`
      })
      switch (this.dress_type) {
        case 'brides':
          this.setDataLayer({
            action: 'click',
            category: 'ListPageSwitch',
            label: `BrideListPage_View${txt}_Click`
          })
          break
        case 'bridesmaids':
          this.setDataLayer({
            action: 'click',
            category: 'ListPageSwitch',
            label: `BridesmaidListPage_View${txt}_Click`
          })
          break
        default:
          this.setDataLayer({
            action: 'click',
            category: 'ListPageSwitch',
            label: `ListPage_View${txt}_Click`
          })
          break
      }
      if (this.viewSwitch === 'smaller') {
        if (this.$route.name == 'list') {
          this.buryPoint(this, 'event', {
            ec: 'viewlarger',
            el: 'viewlarger',
            ea: 'click',
            msg: JSON.stringify(msg)
          })
        }
        this.$store.commit('list/setViewSwitch', 'larger')
        this.$cookie.setCookie('view_switch', 'larger', 7, '.' + this.APP_DOMAIN_LOWER)
      } else {
        if (this.$route.name == 'list') {
          this.buryPoint(this, 'event', {
            ec: 'viewsmaller',
            el: 'viewsmaller',
            ea: 'click',
            msg: JSON.stringify(msg)
          })
          this.buryPoint(this, 'event', {
            ec: 'viewlarger',
            el: 'viewlarger',
            ea: 'view',
            msg: JSON.stringify(msg)
          })
        }
        this.$store.commit('list/setViewSwitch', 'smaller')
        this.$cookie.setCookie('view_switch', 'smaller', 7, '.' + this.APP_DOMAIN_LOWER)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.view-switch {
  // margin-left: 20px;
  color: #666;
  padding: 5px 0 5px;
  display: flex;
  align-items: center;
  // padding: 24px 0 11px;
  // display: inline-block;
  // height: 14px;
  // line-height: 14px;
  // vertical-align: top;
  cursor: pointer;
  .view-icon {
    vertical-align: 0;
    color: var(--color-999999);
    margin-right: 4px;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
  .view_txt {
    text-decoration: underline;
    vertical-align: text-top;
    text-transform: capitalize;
  }
}
</style>
