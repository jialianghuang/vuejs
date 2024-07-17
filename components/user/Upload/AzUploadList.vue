<template>
  <div :style="{ 'max-height': (28 + 5) * firstCount - 5 + 'px' }" class="az-upload-list-box">
    <div class="files-list">
      <div v-for="(item, index) in fileList" :key="index" class="item">
        <div class="file-info">
          <az-icon class="file-img" icon-class="icon-ccpa_file"></az-icon>
          <div class="title">{{ getFileName(item) }}</div>
        </div>
        <slot :item="item" :index="index" name="hover"></slot>
        <slot :item="item" :index="index" name="normal"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import AzIcon from '@/components/az-ui/AzIcon'
export default {
  name: 'AzUploadList',
  components: {
    AzIcon
  },
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    firstCount: {
      type: Number,
      default: 6
    }
  },
  mounted() {
    if (this.loadMore) {
      const el = document.querySelector('#download-list')
      const boxHeight = el.offsetHeight
      el.addEventListener('scroll', () => {
        const scrollTop = el.scrollTop
        const clientHeight = el.querySelector('.files-list').offsetHeight
        if (clientHeight - scrollTop - boxHeight <= (28 + 5) * 2) {
          this.loadMore()
        }
      })
    }
  },
  methods: {
    getFileName(item) {
      const name = item.name
      if (this.getNameLength(name) <= 20) {
        return name
      } else {
        return `${this.getLeftName(name)}...${this.getRightName(name)}`
      }
    },
    getNameLength(name) {
      return (name && name.length) || 0
    },
    getLeftName(name) {
      let res = ''
      let length = 10
      for (let i = 0, len = name.length; i < len; i++) {
        if (length) {
          length--
          res += name[i]
        } else {
          break
        }
      }
      return res
    },
    getRightName(name) {
      name = name
        .split('')
        .reverse()
        .join('')
      const rightName = this.getLeftName(name)
        .split('')
        .reverse()
        .join('')
      return rightName
    },
    isCHS(str, index) {
      if (str.charCodeAt(index) > 255 || str.charCodeAt(index) < 0) return true
      else return false
    }
  }
}
</script>

<style lang="less" scoped>
@themeColor: var(--color-121212);
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* 正常情况下滑块的样式 */
::-webkit-scrollbar-thumb {
  background-color: var(--color-cccccc);
  border-radius: 2px;
  // -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

/* 鼠标悬浮在该类指向的控件上时滑块的样式 */
:hover::-webkit-scrollbar-thumb {
  background-color: var(--color-cccccc);
  border-radius: 2px;
  // -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

/* 鼠标悬浮在滑块上时滑块的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-cccccc);
  // -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

/* 正常时候的主干部分 */
::-webkit-scrollbar-track {
  border-radius: 2px;
  // -webkit-box-shadow: inset 0 0 6px #eee;
  background-color: #eee;
}

/* 鼠标悬浮在滚动条上的主干部分 */
::-webkit-scrollbar-track:hover {
  // -webkit-box-shadow: inset 0 0 6px #eee;
  background-color: #eee;
}
.az-upload-list-box {
  max-height: (28 + 5) * 6px - 5px;
  margin-bottom: 50px;
  overflow-y: auto;
}

.files-list {
  margin-top: 12px;
  .item {
    margin-bottom: 5px;
    width: 367px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-121212);
    cursor: pointer;
    &:hover {
      background-color: var(--color-eeeeee);
      color: @themeColor;
      .hover-img {
        display: block;
      }
      .normal-img {
        display: none;
      }
    }
  }
  .file-info {
    margin-left: 5px;
    display: flex;
    align-items: center;
  }
  .file-img {
    width: 16px;
    height: 18px;
    margin-right: 5px;
  }
  .hover-img {
    display: none;
    width: 8px;
    height: 8px;
    margin-right: 10px;
    display: none;
  }
  .normal-img {
    width: 10px;
    height: 10px;
    margin-right: 9px;
  }
}
</style>
