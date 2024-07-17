<template>
  <div class="review-info">
    <div class="review-info__img">
      <img
        :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/SOD/SOD/d3/46/8a9e29f0b94894379024c41b0cafd346.png')"
        alt="review info"
      />
    </div>
    <div class="review-info__desc">
      <div class="desc__rate">
        <az-rate :value="+item.rating" :readonly="true"></az-rate>
        <span>{{ item.time }}</span>
      </div>
      <div class="desc__title">{{ item.title }}</div>
      <div @click="showMore = !showMore" :class="[showMore ? 'text-auto' : 'text-ellipsis']" class="desc__txt">
        {{ item.txt }}
      </div>
      <div class="desc__author">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import AzRate from '@/components/az-ui/Rate/AzRate'

export default {
  name: 'IndexReviewsItem',
  components: {
    AzRate
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showMore: false
    }
  },
  mounted() {
    // 需要监听resize
    // 1. 全局resize/滚动事件推送
    // 2. css降级
    // let parentHeight = this.$el.querySelector('.desc__txt').offsetHeight()
    // let parentChild = this.$el.querySelector('.desc__txt-detail').offsetHeight()
  }
}
</script>

<style scoped lang="less">
.review-info {
  display: flex;
  padding-top: 60px;
  &__img {
    width: 90px;
    img {
      vertical-align: middle;
      width: 100%;
    }
  }
  &__desc {
    width: 20px + 320px;
    box-sizing: border-box;
    padding-left: 20px;
  }
  .desc {
    &__rate {
      line-height: 29px;
      font-size: 13px;
      display: flex;
      flex-wrap: wrap;
      span {
        margin-left: 5px;
      }
      /deep/ svg {
        width: 20px;
        height: 20px;
      }
      /deep/ .rate-item {
        cursor: auto;
      }
    }
    &__title {
      font-size: 16px;
    }
    &__txt {
      margin-top: 5px;
      position: relative;
      line-height: 18px;
      max-height: 108px;
      cursor: pointer;
    }
    &__author {
      margin-top: 10px;
      font-family: @font-family-600;
    }
  }
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.text-auto {
  overflow: auto;
  height: unset !important;
  max-height: 270px !important;
  &::-webkit-scrollbar {
    width: 5px;
    background-color: #f6f6f6;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e1e1e1;
  }
}
</style>
