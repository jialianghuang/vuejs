<template>
  <div id="size_view" class="size-view fl">
    <span class="fl">{{ nl('page_common_view') }}:&nbsp;</span>
    <div class="sod-img-view">
      <template v-for="(sodViewItem, sodViewKey) in sodViewPics">
        <div
          :key="sodViewKey"
          :class="sodViewKey"
          @mouseover="hoverSodView(sodViewKey, 'over')"
          @mouseout="hoverSodView(sodViewKey, 'out')"
          @click="selectSodView(sodViewKey)"
          class="sod-img  fl"
        >
          <template v-for="(val, itemKey) in sodViewItem">
            <img v-show="val.show" :src="val.img_url" :class="`sod-${itemKey}`" :key="itemKey" alt="img" />
          </template>
          <div v-show="showSodViewTips == sodViewKey" class="bubble">{{ nl(sodViewTips[sodViewKey]) }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SizeView',
  components: {},
  data() {
    return {
      sodViewPics: {
        petite: {
          normal: {
            img_url: require('../../assets/images/sod_size_transform/ic-petite-normal.png'),
            show: true
          },
          selected: {
            img_url: require('../../assets/images/sod_size_transform/ic-petite-selected.png'),
            show: false
          },
          hover: {
            img_url: require('../../assets/images/sod_size_transform/ic-petite-hover.png'),
            show: false
          }
        },
        plus: {
          normal: {
            img_url: require('../../assets/images/sod_size_transform/ic-plus-normal.png'),
            show: true
          },
          selected: {
            img_url: require('../../assets/images/sod_size_transform/ic-plus-selected.png'),
            show: false
          },
          hover: {
            img_url: require('../../assets/images/sod_size_transform/ic-plus-hover.png'),
            show: false
          }
        },
        petite_plus: {
          normal: {
            img_url: require('../../assets/images/sod_size_transform/ic-petite-plus-normal.png'),
            show: true
          },
          selected: {
            img_url: require('../../assets/images/sod_size_transform/ic-petite-plus-selected.png'),
            show: false
          },
          hover: {
            img_url: require('../../assets/images/sod_size_transform/ic-petite-plus-hover.png'),
            show: false
          }
        }
      },
      sodViewTips: {
        petite: 'page_seo_cat_petite',
        plus: 'page_filter_plus',
        petite_plus: 'Petite & Plus'
      },
      showSodViewTips: null
    }
  },
  computed: {
    ...mapState({
      sodView: (state) => state.list.sodView
    })
  },
  watch: {
    sodView(newval) {
      this.setSodViewSelected()
    }
  },
  mounted() {
    if (!this.sodView) {
      this.$store.commit('list/setSodView', this.$cookie.getCookie('SOD_VIEW_NEW') || 'petite')
    }
    this.setSodViewSelected()
    // 补充多语言
    this.sodViewTips.petite_plus = this.nl('page_seo_cat_petite') + '&' + this.nl('page_filter_plus')
  },
  methods: {
    hoverSodView(key, type) {
      this.showSodViewTips = null
      if (type == 'over') {
        this.showSodViewTips = key
      }
      if (this.sodViewPics[key].selected.show) return
      if (type == 'over') {
        this.sodViewPics[key].hover.show = true
        this.sodViewPics[key].normal.show = false
        let txt = ''
        switch (key) {
          case 'petite_plus':
            txt = 'Petite&Plus'
            break
          case 'plus':
            txt = 'Plus'
            break
          case 'petite':
            txt = 'Petite'
            break
        }
        this.setDataLayer({
          action: 'hover',
          category: 'Dress',
          label: `Dress_View${txt}_Hover`
        })
      } else {
        this.sodViewPics[key].hover.show = false
        this.sodViewPics[key].normal.show = true
      }
    },
    selectSodView(key) {
      if (this.sodViewPics[key].selected.show) return
      this.$store.commit('list/setSodView', key)
      this.$cookie.setCookie('SOD_VIEW_NEW', key, 7, '.' + this.APP_DOMAIN_LOWER)
      this.$emit('sodViewChange', key)
      let txt = ''
      switch (key) {
        case 'petite_plus':
          txt = 'Dress_ViewPetiteAndPlus_Click'
          break
        case 'plus':
          txt = 'Dress_ViewPlus_Click'
          break
        case 'petite':
          txt = 'Dress_ViewPetite_Click'
          break
      }
      this.setDataLayer({
        action: 'click',
        category: 'Dress',
        label: txt
      })
    },
    setSodViewSelected() {
      for (const sodViewKey in this.sodViewPics) {
        this.sodViewPics[sodViewKey].normal.show = true
        this.sodViewPics[sodViewKey].hover.show = false
        this.sodViewPics[sodViewKey].selected.show = false
      }
      this.sodViewPics[this.sodView].selected.show = true
      this.sodViewPics[this.sodView].hover.show = false
      this.sodViewPics[this.sodView].normal.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.size-view {
  margin-left: 20px;
  padding: 5px 0 5px;
  line-height: 32px;
  .sod-img-view {
    display: inline-flex;
    height: 31px;
    vertical-align: middle;
    .hover {
      cursor: pointer;
    }
    .sod-img {
      position: relative;
      width: 36px;
      height: 36px;
      margin-top: -2.5px;
      margin-right: 16px;
      img {
        width: 100%;
      }
      .bubble {
        white-space: nowrap;
        left: 50%;
        transform: translate(-50%, 100%);
        position: absolute;
        bottom: -5px;
        padding: 8px 11px;
        border: 1px solid var(--color-cccccc);
        border-radius: 2px;
        z-index: 3;
        background-color: #fff;
        font-size: 13px;
        font-family: @font-family-500;
        color: rgba(51, 51, 51, 1);
        line-height: 15px;
        &:before {
          content: '';
          display: block;
          position: absolute;
          height: 7px;
          width: 7px;
          border: 1px solid var(--color-cccccc);
          background-color: #fff;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        }
        &:after {
          content: '';
          width: 50%;
          height: 7px;
          top: 0;
          background-color: #fff;
          display: block;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .sod-img:not(:last-child) {
      &::after {
        content: '';
        display: inline-block;
        height: 12px;
        width: 0;
        border: 0.5px solid rgba(102, 102, 102, 1);
        align-self: center;
        line-height: 12px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin: 0 6px 0 10px;
      }
    }
  }
}
</style>
