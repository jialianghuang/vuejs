<template>
  <div v-if="seoFaqList && seoFaqList.length" class="seo-faq-block">
    <div v-for="(item, index) in seoFaqList" :key="index" class="collapse-item">
      <div @click="handleClick(index)" class="title-box">
        <div class="title">{{ item.name }}</div>
        <az-icon v-if="current === index" icon-class="icon-Minus" />
        <az-icon v-else icon-class="icon-Plus" />
      </div>
      <AzCollapseText :collapse="current === index">
        <div v-html="item.value" class="collapse-content"></div>
      </AzCollapseText>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AzCollapseText from '@/components/az-ui/AzCollapseText'
export default {
  name: 'SeoFaq',
  components: { AzCollapseText },
  data() {
    return {
      current: -1
    }
  },
  computed: {
    ...mapState({
      seoFaqList: (state) => state.list.seoFaqList
    })
  },
  methods: {
    handleClick(index) {
      this.current = this.current === index ? -1 : index
    }
  }
}
</script>
<style lang="less" scoped>
.seo-faq-block {
  margin: 15px;
  .collapse-item {
    .title-box {
      display: flex;
      align-items: center;
      border-top: 1px solid #eee;
      .title {
        flex: 1;
        height: 48px;
        line-height: 48px;
        padding: 0;
        font-family: @font-family-500;
      }
    }
    .collapse-content {
      box-sizing: border-box;
      display: block;
      width: 100%;
      margin-bottom: 15px;
    }
  }
}
</style>
