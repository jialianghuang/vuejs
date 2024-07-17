<template>
  <div>
    <!-- swiper loop 到复制元素时，绑定的@click事件会失效,导致当前slide内的元素无法点击,得使用a标签，这时handleClick逻辑也是不执行的 -->
    <a
      v-for="(spotItem, spotIndex) in positions"
      :key="spotIndex"
      :style="{
        left: spotItem.x * 100 + '%',
        top: spotItem.y * 100 + '%',
        width: spotItem.width * 100 + '%',
        height: spotItem.height * 100 + '%'
      }"
      :aria-label="'azazie ' + spotItem.name"
      v-track.viewOnce="{
        id: spotItem.name + 'azazie',
        common: [
          getBiParams(ec, spotItem.name, spotItem.url),
          getNewTrackParams(ec2, 'bannerclickzone', imgUrl, spotIndex + 1, spotItem.name, null)
        ]
      }"
      :target="targetBlank(spotItem.newWindows)"
      :href="countryUrl(spotItem.url)"
      @click.prevent="handleClick(spotItem, ec, spotItem.name, imgUrl, spotIndex + 1)"
      class="hot-link"
    >
      <div style="display:none">azazie</div>
    </a>
  </div>
</template>
<script>
/* 热区配置 */
export default {
  name: 'ImageHotSpot',
  props: {
    positions: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    imgUrl: {
      type: String,
      default: null
    },
    ec: {
      type: String,
      default: 'hotspot'
    },
    targetPage: {
      type: String,
      default: ''
    },
    ec2: {
      type: String,
      default: 'hotspot'
    }
  },
  methods: {
    getBiParams(ec, el, url = '') {
      if (process.server) return
      const obj = {
        ec,
        el,
        msg: JSON.stringify({ url })
      }
      return obj
    },
    handleClick(spotItem, ec, el, cdn, count) {
      // 链接跳转下个页面打点
      if (this.targetPage) {
        const items = [
          { ec, el, ea: 'click', msg: { cdn } },
          {
            ec: this.ec2,
            el: 'bannerclickzone',
            ea: 'click',
            msg: JSON.stringify({
              cdn,
              count,
              clickzone: spotItem.desc || spotItem.name,
              isBridal: Number(this.isBridal)
            })
          }
        ]
        this.buryPoint(this, 'events', items, null, this.targetPage)
      } else {
        const items = [
          { ec, el, ea: 'click', msg: { cdn } },
          {
            ec: this.ec2,
            el: 'bannerclickzone',
            ea: 'click',
            msg: JSON.stringify({
              cdn,
              count,
              clickzone: spotItem.desc || spotItem.name,
              isBridal: Number(this.isBridal)
            })
          }
        ]
        this.buryPoint(this, 'events', items)
      }
      this.$emit('hotSpotClick', spotItem || null)
      if (spotItem.url) {
        if (spotItem.newWindows) {
          window.open(this.countryUrl(spotItem.url))
        } else {
          location.href = this.countryUrl(spotItem.url)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.hot-link {
  display: block;
  position: absolute;
  cursor: pointer;
  // background: red;
}
</style>
