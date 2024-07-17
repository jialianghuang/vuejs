<template>
  <div class="wgd-description-block">
    <template v-if="baseInfo.isMassProduct != 0">
      <div class="wgd-description-block-left">
        <p v-html="description.template" class="item"></p>
        <p v-html="description.txt" class="item"></p>
      </div>
      <div v-if="description.attrs && !!description.attrs.length" class="wgd-description-block-right">
        <p v-for="(item, index) in description.attrs" :key="index" class="item">
          <span class="item-key">{{ item.key }}: </span>
          <span class="item-value">{{ item.value }}</span>
        </p>
        <p v-if="sodDetailVersionFun(baseInfo)" class="item">
          <span class="item-key">{{ nl('page_common_style') }}: </span>
          <span class="item-value">{{ baseInfo.goodsId }}</span>
        </p>
      </div>
    </template>
    <template v-else>
      <div class="wgd-description-block-left">
        <p v-html="description.template" class="item"></p>
        <p v-if="txtArray[0]" v-html="txtArray[0]" class="item"></p>
      </div>
      <div v-if="txtArray[1]" class="wgd-description-block-right">
        <p v-html="txtArray[1]" class="item"></p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'WGDDecriptionBlock',
  props: {
    description: {
      type: Object,
      default: () => {}
    },
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    txtArray({ description }) {
      const textArr = description.txt.split('¥')
      return textArr || []
    }
  }
}
</script>

<style lang="less" scoped>
.wgd-description-block {
  background-color: #fff;
  display: flex;
  &-left,
  &-right {
    max-width: 690px;
  }

  &-right {
    margin-left: 35px;
    .item {
      .item-key {
        position: relative;
      }
      .item-key::before {
        position: absolute;
        content: '';
        width: 5px;
        height: 5px;
        background-color: #666;
        border-radius: 50%;
        top: 50%;
        left: 0;
        transform: translate(-15px, -50%);
      }
    }
  }
}
</style>
