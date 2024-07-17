<template>
  <div class="skeleton-list skeleton-box">
    <skeleton-list-item v-for="item in 48" :key="item" :class="[typeClass, isFirstPlus]"></skeleton-list-item>
    <div class="skeleton-bac-animation"></div>
    <!-- :style="{ width: width(item), marginRight: marginRight(item) }" -->
  </div>
</template>

<script>
import SkeletonListItem from './SkeletonListItem'
export default {
  name: 'SkeletonList',
  components: {
    SkeletonListItem
  },
  props: {
    viewSwitch: {
      type: String,
      default: 'smaller'
    }
  },
  data() {
    return {
      sodViewNew: ''
    }
  },
  computed: {
    typeClass() {
      if (this.$route.query.sod_view === 'petite_plus' || this.sodViewNew === 'petite_plus') {
        return 'smaller-skeleton'
      }
      if (this.viewSwitch === 'smaller') {
        return 'smaller-skeleton'
      } else if (this.viewSwitch === 'holiday') {
        return 'holiday-skeleton'
      } else {
        return 'bigger-skeleton'
      }
    },
    isFirstPlus() {
      return [2, 8].includes(this.catId) && this.$store.state.list.apiViewMode[0] !== 'plus' ? 'first-special-plus' : ''
    }
  },
  mounted() {
    this.sodViewNew = this.$cookie.getCookie('SOD_VIEW_NEW')
  }
}
</script>

<style lang="less" scoped>
.skeleton-box {
  position: relative;
}
.skeleton-bac-animation {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0.5) 50%, hsla(0, 0%, 100%, 0) 80%);
  background-size: 30% 100%;
  background-repeat: no-repeat;
  animation: backpos 0.9s ease-in-out 0s infinite;
}
@keyframes backpos {
  0% {
    background-position-x: -200px;
  }
  to {
    background-position-x: calc(200px + 100%);
  }
}
.skeleton-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  line-height: 1.8;
  clear: both;
  justify-content: space-between;
  .bigger-skeleton {
    // width: 32.6%;
    width: calc((100% - 45px) / 4);
    // &.first-special-plus {
    //   &:nth-child(1) {
    //     width: 65.2%;
    //     margin-right: 1%;
    //     /deep/ .img-box {
    //       padding-top: 69.13%;
    //     }
    //   }
    // }
  }
  .holiday-skeleton {
    width: 19.3%;
    &.first-special-plus {
      &:nth-child(1) {
        width: 48.6%;
        margin-right: 1%;
        /deep/ .img-box {
          padding-top: 69.13%;
        }
      }
    }
  }
  .smaller-skeleton {
    // width: 24.3%;
    width: calc((100% - 60px) / 5);
    // &.first-special-plus {
    //   &:nth-child(1) {
    //     width: 48.6%;
    //     margin-right: 1%;
    //     /deep/ .img-box {
    //       padding-top: 69.13%;
    //     }
    //   }
    // }
  }

  @media screen and (max-width: 1600px) {
    .bigger-skeleton {
      width: calc((100% - 30px) / 3);
    }
    .smaller-skeleton {
      width: calc((100% - 45px) / 4);
    }
  }
  @media screen and (max-width: 1024px) {
    .bigger-skeleton {
      width: 49%;
      &.first-special-plus {
        &:nth-child(1) {
          width: 100%;
          margin-right: 0;
        }
      }
    }
    .holiday-skeleton {
      width: 32%;
      &.first-special-plus {
        &:nth-child(1) {
          width: 64%;
          margin-right: 1.2%;
        }
      }
    }
    .smaller-skeleton {
      width: 32%;
      &.first-special-plus {
        &:nth-child(1) {
          width: 64%;
          margin-right: 1.2%;
        }
      }
    }
  }
}
</style>
