<template>
  <div @mouseover="handOver" @mousemove="handMove" @mouseout="handOut" class="_magnifier">
    <!-- <client-only v-if="index > 0">
      <img v-lazy="src" :width="width" :height="height" :alt="alt" />
    </client-only> -->
    <img :src="src" :width="width" :height="height" :alt="alt" />
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'AzPicZoom',
  props: {
    index: {
      type: Number,
      default: 0
    },
    src: {
      type: String,
      required: true
    },
    bigsrc: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    configs: {
      type: Object,
      default() {
        return {
          width: 454,
          height: 538,
          maskWidth: 50,
          maskHeight: 50,
          maskColor: '#fff',
          maskOpacity: 0.5
        }
      }
    },
    alt: {
      type: String,
      default: 'img'
    }
  },
  data() {
    return {
      imgObj: {},
      bigImg: {},
      mouseMask: {},
      imgLayer: {},
      imgRect: {}
    }
  },
  methods: {
    handMove(e) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      const objX = e.pageX - this.imgRect.left
      const objY = e.pageY - this.imgRect.top - scrollTop
      let backgroundX = (objX - this.mouseMask.offsetWidth / 2) * (Math.ceil(this.bigImg.width / this.imgObj.offsetWidth) / 1.5)
      let backgroundY = (objY - this.mouseMask.offsetHeight / 2) * (Math.ceil(this.bigImg.height / this.imgObj.offsetHeight) / 1.5)

      // 判断是否超出界限
      let _maskX = objX - this.mouseMask.offsetWidth / 2
      let _maskY = objY - this.mouseMask.offsetHeight / 2
      if (_maskY <= 0) {
        _maskY = 0
      }
      if (_maskY + this.mouseMask.offsetHeight >= this.imgRect.height) {
        _maskY = this.imgRect.height - this.mouseMask.offsetHeight
      }
      if (_maskX <= 0) {
        _maskX = 0
      }
      if (_maskX + this.mouseMask.offsetWidth >= this.imgRect.width) {
        _maskX = this.imgRect.width - this.mouseMask.offsetWidth
      }
      if (this.mouseMask.style) {
        this.mouseMask.style.webkitTransform = `translate3d(${_maskX}px,${_maskY}px,0)`
      }
      // 判断背景图是否小于预览框
      if (backgroundX + this.configs.width >= this.bigImg.width) {
        backgroundX = this.bigImg.width - this.configs.width
      }
      if (backgroundY + this.configs.height >= this.bigImg.height) {
        backgroundY = this.bigImg.height - this.configs.height
      }
      // 初始化时，dom未生成操作导致的
      if (this.imgLayer && this.imgLayer.style) {
        this.imgLayer.style.backgroundPositionX = `-${backgroundX}px `
        this.imgLayer.style.backgroundPositionY = `-${backgroundY}px `
      }
    },
    handOut(e) {
      this.imgLayer.remove && this.imgLayer.remove()
      this.mouseMask.remove && this.mouseMask.remove()
    },
    handOver(e) {
      if (!document.getElementById('_magnifier_layer')) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // 获取大图尺寸
        this.imgObj = this.$el.getElementsByTagName('img')[0]
        this.imgRect = this.imgObj.getBoundingClientRect()
        this.bigImg = new Image()
        this.bigImg.src = this.bigsrc
        // 创建鼠标选择区域
        this.mouseMask = document.createElement('div')
        this.mouseMask.className = '_magnifier_zoom'
        this.mouseMask.style.background = this.configs.maskColor
        this.mouseMask.style.height = this.configs.maskHeight + 'px'
        this.mouseMask.style.width = this.configs.maskWidth + 'px'
        this.mouseMask.style.opacity = this.configs.maskOpacity
        this.imgObj.parentNode.appendChild(this.mouseMask)
        // 创建预览框
        const imgLayer = document.createElement('div')
        this.imgLayer = imgLayer
        const _layerHeight = this.configs.height
        const _layerWidth = this.configs.width
        imgLayer.id = '_magnifier_layer'
        imgLayer.style.width = _layerWidth + 'px'
        imgLayer.style.height = _layerHeight + 'px'
        imgLayer.style.left = this.imgRect.left + this.imgRect.width + 'px'
        imgLayer.style.top = this.imgRect.top + scrollTop + 'px'
        imgLayer.style.backgroundImage = `url('${this.bigsrc}')`
        imgLayer.style.backgroundRepeat = 'no-repeat'
        document.body.appendChild(imgLayer)
      }
    }
  }
}
</script>
<style>
#_magnifier_layer {
  position: absolute;
  z-index: 8;
  background: var(--color-f9f9f9);
  border: 1px solid #999;
}
._magnifier {
  position: relative;
  display: inline-block;
  cursor: crosshair;
}
._magnifier img {
  vertical-align: middle;
}
._magnifier_zoom {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  pointer-events: none;
  border: 1px solid var(--color-121212);
}
</style>
