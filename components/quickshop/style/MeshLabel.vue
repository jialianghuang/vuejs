<template>
  <div class="mesh-label">
    <div class="mesh">
      {{ nl('page_goods_mesh_color') }}
    </div>
    <a
      @mouseenter="handOver(true)"
      @mouseleave="handOver(false)"
      @click="hrefPoint"
      :href="getSupportUrl(`/articles/360004846471-What-is-Mesh`, '/articles/8377875')"
      target="_blank"
      class="what-is-mesh"
    >
      (<span class="text">{{ nl('page_goods_what_is_mesh') }}</span
      >):
      <div class="mesh-tips">{{ nl('page_common_what_is_mesh_txt') }}</div>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MeshLabel',
  languageKeys: ['page_goods_mesh_color', 'page_goods_what_is_mesh', 'page_common_what_is_mesh_txt'],
  computed: {
    ...mapState({
      baseInfo: (state) => state.quickshop.baseInfo
    })
  },
  methods: {
    handOver(param) {
      if (param) {
        this.setPoint('color', 'whatismeshpopup', 'view')
      }
    },
    hrefPoint() {
      this.setPoint('color', 'whatismesh', 'click')
    },
    setPoint(ec, el, ea) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_id: this.baseInfo.catId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mesh-label {
  width: 100%;
  margin-bottom: 13px;
  .mesh {
    text-transform: uppercase;
    display: inline-block;
  }
  .what-is-mesh {
    text-transform: none;
    cursor: pointer;
    display: inline-block;
    color: var(--color-121212);
    position: relative;
    &:hover {
      .text {
        color: @theme-color;
      }
      .mesh-tips {
        display: block;
      }
    }
    .mesh-tips {
      display: none;
      position: absolute;
      padding: 12px;
      border: 1px solid #ccc;
      color: var(--color-121212);
      margin-top: 8px;
      z-index: 1;
      background: #fff;
      text-transform: none;
      width: 295px;
      left: 50%;
      transform: translateX(-50%);
      &::before,
      &::after {
        content: '';
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 6px solid #ccc;
        position: absolute;
        top: -7px;
        left: calc(50% - 6px);
      }
      &::after {
        border-bottom-color: #fff;
        top: -5px;
      }
    }
  }
}
</style>
