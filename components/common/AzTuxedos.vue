<template>
  <az-popup
    v-if="visible"
    :overlayZIndex="12"
    :overlayStyle="{ backgroundColor: 'transparent' }"
    :styles="{ boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.25)' }"
    @close-on-click-overlay="clickClose"
    width="600px"
  >
    <div class="az-tuxedos">
      <button @click="clickClose" aria-label="Close button" class="btn-close">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
      </button>
      <img
        class="img"
        src="https://cdn-1.azazie.com/upimg/userfiles/images/1/7f/78/7c13239f8a932b16aaf425abd9a37f78.jpg"
        alt="tuxedos suits"
      />
      <div class="az-tuxedos-main">
        <h3>Who would you like us to partner with?</h3>
        <ul>
          <li
            v-for="(item, index) in options"
            :key="item.key"
            :class="{ selected: item.selected }"
            v-track.view.click="{ common: { ec: 'tuxedos', el: item.key } }"
          >
            <az-checkbox :value="item.selected" @onChange="(e) => handleCheckboxChange(e, index)" theme="primary">{{
              item.name
            }}</az-checkbox>
          </li>
        </ul>
        <az-button @click="clickSubmit" class="btn btn-default">submit</az-button>
        <p v-show="showTips" class="tips">Please select 1 or more options above.</p>
      </div>
    </div>
  </az-popup>
</template>

<script>
import AzPopup from '@/components/az-ui/Popup/AzPopup'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzCheckbox from '@/components/az-ui/AzCheckbox'
/**
 * 临时弹框组件，过后可删
 */
export default {
  components: {
    AzPopup,
    AzButton,
    AzCheckbox
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeout: null,
      showTips: false,
      options: [
        {
          key: 'TheBlackTux',
          name: 'The Black Tux',
          selected: false
        },
        {
          key: 'LittleTuxedos',
          name: 'Little Tuxedos',
          selected: false
        },
        {
          key: 'GenerationTux',
          name: 'Generation Tux',
          selected: false
        },
        {
          key: 'Indochino',
          name: 'Indochino',
          selected: false
        }
      ]
    }
  },
  watch: {
    visible(e) {
      if (e) {
        // 每次展示都随机排序
        this.options.sort((a, b) => {
          return Math.random() - 0.5
        })
        this.setPoint('tuxedos', 'popup', 'view')
        // 定时5s自动关闭
        this.timeout = setTimeout(() => {
          this.$emit('update:visible', false)
        }, 5000)
      } else {
        this.showTips = false
        this.options.forEach((ele) => {
          ele.selected = false
        })
      }
    }
  },
  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
  methods: {
    handleCheckboxChange(e, i) {
      this.options[i].selected = e
      if (e) {
        this.showTips = false
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
      }
    },
    clickClose() {
      this.setPoint('tuxedos', 'popup', 'click')
      clearTimeout(this.timeout)
      this.$emit('update:visible', false)
    },
    clickSubmit() {
      clearTimeout(this.timeout)
      const selected = []
      this.options.forEach((ele) => {
        if (ele.selected) {
          selected.push(ele.key)
        }
      })
      this.setPoint('tuxedos', 'submit', 'click', { selected })
      if (selected.length) {
        this.$emit('update:visible', false)
      } else {
        this.showTips = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-tuxedos {
  width: 600px;
  min-height: 479px;
  margin: 0 auto;
  background: #fff;
  text-align: center;
  position: relative;
  .img {
    width: 100%;
    height: 155px;
    display: block;
  }
  &-main {
    padding-bottom: 40px;
    overflow: hidden;
    h3 {
      font-size: 24px;
      line-height: normal;
      text-transform: uppercase;
      margin: 30px 0px;
      font-family: @font-family-500;
    }
    ul {
      padding: 0px 40px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      li {
        width: 250px;
        margin-bottom: 15px;
        /deep/ .az-checkbox {
          border: 1px solid #ccc;
          background: #fff;
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          border-radius: 0px;
          padding: 0px 20px;
          .az-checkbox-icon {
            margin-right: 20px;
            border-color: #999;
          }
          &:hover {
            border: 1px solid @theme;
            background: var(--color-f1e9e6);
            color: @theme;
          }
        }
        &.selected {
          /deep/ .az-checkbox {
            border: 1px solid @theme;
            background: var(--color-f1e9e6);
            color: @theme;
          }
        }
      }
    }
    .btn-default {
      width: 250px;
      height: 50px;
    }
    .tips {
      font-size: 13px;
      color: #f00;
      margin-top: 5px;
      line-height: normal;
    }
  }
  .btn-close {
    width: 25px;
    height: 25px;
    padding: 5px;
    position: absolute;
    right: 5px;
    top: 5px;
    border: none;
    background: none;
    .icon-close {
      width: 15px;
      height: 15px;
      fill: #fff;
    }
  }
}
</style>
