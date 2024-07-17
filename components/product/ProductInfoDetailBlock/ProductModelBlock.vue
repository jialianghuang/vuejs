<template>
  <div id="product-model-block" :class="blockOpen ? 'open' : 'close'" class="info-block" block-name="model">
    <div @click="toggleBlock('model')" class="block_bar_title">
      <div class="block_bar_desc">{{ nl('page_common_model_info') }}</div>
      <div class="switch">
        <az-icon class="switch_close" icon-class="icon-lby_add" />
        <az-icon class="switch_open" icon-class="icon-lby_subtraction" />
      </div>
    </div>
    <client-only>
      <div class="info-block-container model-info-container">
        <div class="model-box">
          <template v-for="(item, index) in showDetail">
            <section v-if="!!Object.keys(item).length" :key="index" class="model-item">
              <p v-if="shouPlusTitle(index)" class="model-item-text up">
                {{ nl('page_common_plus_size_model') }}
              </p>
              <template v-for="(subItem, key, subIndex) in item">
                <p v-if="subItem" :key="key + subIndex" class="model-item-text">
                  <span>{{ key }}: </span>{{ subItem }}
                </p>
              </template>
            </section>
          </template>
        </div>
        <p v-if="baseInfo.catId != 139" v-html="nl('page_common_model_tips_text')" @click="openSizeChart" class="model-tips-text"></p>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProductModelBlock',
  languageKeys: ['page_common_model_info', 'page_common_plus_size_model', 'page_common_model_tips_text', 'page_size_wearing_size'],
  props: {
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      currentBlock: 'product/getCurrentBlock',
      baseInfo: 'product/getBaseInfo'
    }),
    blockOpen() {
      return this.currentBlock == 'model'
    },
    showDetail({ unit, detailsInfo }) {
      // const text = this.nl('page_size_wearing_size')
      const { modelDetailsConf = {}, plusSizeModelDetailsConf = {} } = detailsInfo.modelInfo || {}
      const list = []
      const tempNormal = JSON.parse(JSON.stringify(modelDetailsConf))
      delete tempNormal.cm
      delete tempNormal.inch
      const tempPlus = JSON.parse(JSON.stringify(plusSizeModelDetailsConf))
      delete tempPlus.cm
      delete tempPlus.inch
      if (Object.keys(modelDetailsConf).length > 0) {
        const normalSize = {
          ...modelDetailsConf[unit],
          ...tempNormal
        }
        list.push(normalSize)
      }
      if (Object.keys(plusSizeModelDetailsConf).length > 0) {
        const plusSize = {
          ...plusSizeModelDetailsConf[unit],
          ...tempPlus
        }
        list.push(plusSize)
      }
      return list
    },
    unit({ country }) {
      if (this.showEuSize) {
        return 'cm'
      }
      return 'inch'
    }
  },
  methods: {
    toggleBlock(val) {
      this.setPoint('entrance', 'click', {
        goodsId: this.baseInfo.goodsId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType,
        cat_id: this.baseInfo.catId
      })
      if (this.blockOpen) {
        this.$store.commit('product/setCurrentBlock', '')
      } else {
        this.$store.commit('product/setCurrentBlock', val)
      }
    },
    shouPlusTitle(index) {
      const { modelDetailsConf = {}, plusSizeModelDetailsConf = {} } = this.detailsInfo.modelInfo || {}
      if (Object.keys(modelDetailsConf).length == 0) {
        return !!Object.keys(plusSizeModelDetailsConf).length && index == 0
      } else {
        return !!Object.keys(plusSizeModelDetailsConf).length && index == 1
      }
    },
    openSizeChart(e) {
      if (e.target && e.target.dataset && e.target.dataset.text == 'size-chart') {
        this.$store.commit('product/setSizeChartLayerShow', true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#product-model-block {
  background-color: #fff;
  .model-box {
    display: flex;
    .model-item {
      width: 200px;
      .model-item-text {
        margin: 5px 0;
        height: 18px;
        line-height: 18px;
        span {
          margin-right: 5px;
          text-transform: capitalize;
        }
        &.up {
          text-transform: uppercase;
        }
      }
    }
  }
  .model-tips-text {
    margin-top: 5px;
    font-size: 13px;
    line-height: 18px;
    color: #666;
  }
}
</style>
<style>
.model-tips-text-a {
  text-decoration: underline;
  text-underline-offset: 1px;
  cursor: pointer;
}
</style>
