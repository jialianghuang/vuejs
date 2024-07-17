<template>
  <div id="holiday-tabs" class="holiday-tabs">
    <ul v-for="(item0, index0) in getTabsLines" :key="'content' + index0" class="content">
      <div
        v-for="(item, index) in getCurrentTabs(index0)"
        :key="index"
        :class="{
          hid: item.type === 'empty'
        }"
        v-track.view="{ common: getBiParams(item) }"
        :id="`scroll-item-${item.index}`"
        :style="getItemStyle(item.index)"
        @click="clickItem(item.index)"
        class="scroll-item"
      >
        {{ item.name ? nl(`page_common_landing_tags_${item.name}`) : '' }}
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HolidayTabs',
  props: {
    tabs: {
      type: Array,
      default: () => {
        return []
      }
    },
    activityName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      selIdx: -1
    }
  },
  computed: {
    getTabsLines() {
      let line = (this.tabs.length - 1) / 6 + 1
      line = parseInt(line)
      const result = []
      for (let i = 0; i < line; i++) {
        result.push('item')
      }
      return result
    }
  },
  watch: {},
  mounted() {},
  methods: {
    getCurrentTabs(idx) {
      const result = []
      for (let i = idx * 6; i < idx * 6 + 6; i++) {
        const oItem = this.tabs[i] || { type: 'empty' }
        if (oItem && typeof oItem === 'object') {
          oItem.index = i
        }
        result.push(oItem)
      }
      return result
    },
    getBiParams(item) {
      return {
        ec: this.activityName,
        el: item.name
      }
    },
    clickItem(index) {
      if (index > this.tabs.length - 1) {
        return
      }
      const item = this.tabs[index] || {}
      if (this.selIdx === index) {
        return
      }
      this.buryPoint(this, 'event', {
        ec: this.activityName,
        el: item.name,
        ea: 'click'
      })
      this.selIdx = index
      this.$emit('tabsCallBack', item)
    },
    getItemStyle(index) {
      const result = {}
      if (index === this.selIdx) {
        result.border = '1px solid var(--color-121212)'
        result.color = 'var(--color-121212)'
      }
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.holiday-tabs {
  width: 100%;
  padding: 0px;
  overflow: hidden;
  margin-top: 20px;
  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    column-gap: 15px;
    .scroll-item {
      flex: 1;
      text-align: center;
      display: inline-block;
      line-height: 36px;
      cursor: pointer;
      border: 1px solid transparent;
      color: var(--color-121212);
      background-color: #f7f7f7;
      white-space: nowrap;
      &:first-child {
        margin-left: 0px;
      }
      &:hover {
        color: @theme;
        border: 1px solid @theme;
      }
      &.hid {
        display: none;
        cursor: default;
        background-color: transparent;
        border: 1px solid transparent;
        &:hover {
          border: 1px solid transparent;
        }
      }
    }
  }
}
</style>
