<template>
  <div class="back-soon">
    <ul class="prod-info-styles">
      <li>
        <p class="label-line">
          <label for="_color" class="blockLabel">
            {{ nl('page_common_color') }}: <strong>{{ baseInfo.shownColor }}</strong></label
          >
        </p>
      </li>
    </ul>
    <p class="back-soon-remind new_back-soon-remind">* {{ nl('page_goods_detail_sod_coming_soon') }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

/**
 * 此组件用于catId3商品没有库存时，详情和quickshop弹窗展示的内容提示，依照ComeSoon组件精简而来
 */
export default {
  name: 'BackSoon',
  languageKeys: ['page_common_color', 'page_goods_detail_sod_coming_soon'],

  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.back-soon {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--color-f9f9f9);
  .back-soon-remind {
    margin-top: 10px;
    line-height: 21px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
  }
}
</style>
