<template>
  <div v-if="rushSelectItems" class="rush-select">
    <rush-desc v-track.view="{ common: getBiParams() }"></rush-desc>
    <div class="rush-body">
      <div class="rush-text">{{ nl('page_goods_time_colon') }}</div>
      <a-select
        v-track.view="{ common: getBiParams(rushData) }"
        :selectStyle="{ width: '190px', height: '32px' }"
        :selected="rushData"
        :list="rushSelectItems"
        :displayTxt="`txt`"
        @change="rushSelectItemsClick"
        class="rush-select-item"
      ></a-select>
    </div>
  </div>
</template>

<script>
import RushDesc from '@/components/product/RushDesc'
import ASelect from '@/components/az-ui/Select/ASelect'
import { mapState } from 'vuex'
export default {
  name: 'RushSelect',
  languageKeys: ['page_goods_time_colon'],
  components: { RushDesc, ASelect },
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      defaultSelectRush: null,
      rushData: null
    }
  },
  computed: {
    ...mapState('product', ['selectRush']),
    rushSelectItems() {
      return this.getRushSelectItems(this.baseInfo)
    }
  },
  mounted() {
    this.rushData = this.getSelectKey()
  },
  methods: {
    getBiParams(data) {
      if (data) {
        return {
          ec: 'rushproduction',
          el: data === 'rush' ? 'rush' : 'standard',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName
          })
        }
      } else {
        return {
          ec: 'rushproduction',
          el: 'rushproductionavailable',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName
          })
        }
      }
    },
    isRushSelectItems(item) {
      const { key: itemKye } = item
      const { key: selKey } = this.selectRush || this.defaultSelectRush || {}
      if (itemKye && itemKye === selKey) {
        return true
      } else {
        return false
      }
    },
    getSelectKey() {
      const { txt } = this.selectRush || this.defaultSelectRush || {}
      return txt
    },
    getRushSelectItems(baseInfo) {
      const { rushSelectItems } = baseInfo || {}
      const result = []
      if (rushSelectItems && rushSelectItems.length > 0) {
        for (let i = 0; i < rushSelectItems.length; i++) {
          const item = rushSelectItems[i]
          const { key, txt, selected, groupId } = item
          if (selected && !this.selectRush) {
            this.defaultSelectRush = item
            this.$store.commit('product/setSelectRush', item)
          }
          result.push({
            key,
            txt,
            selected,
            groupId
          })
        }
        return result
      } else {
        return null
      }
    },
    rushSelectItemsClick(aItem) {
      const { rushSelectItems } = this.baseInfo || {}
      if (rushSelectItems && rushSelectItems.length > 0) {
        for (let i = 0; i < rushSelectItems.length; i++) {
          const item = rushSelectItems[i]
          const { key } = item
          if (key === aItem.key) {
            this.buryPoint(this, 'event', {
              ec: 'rushproduction',
              el: key === 'rush' ? 'rush' : 'standard',
              ea: 'click',
              msg: JSON.stringify({
                goodsId: this.baseInfo.goodsId,
                cat_name: this.baseInfo.catName
              })
            })
            this.$store.commit('product/setSelectRush', item)
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rush-select {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  .rush-body {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5px;
    .rush-select-item {
      background-color: white;
    }
    .rush-text {
      color: #252235;
      font-size: 13px;
    }
    select {
      background: #fff;
      border: solid 1px #ccc;
      margin-bottom: 5px;
      box-sizing: border-box;
      height: 32px;
      min-width: 124px;
      padding-left: 10px;
      margin-right: 10px;
      color: var(--color-121212);
    }
  }
}
</style>
