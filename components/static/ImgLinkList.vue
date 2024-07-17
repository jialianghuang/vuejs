<template>
  <div v-if="lists.length">
    <h3 v-if="title" :class="[titleLayout]" class="list_title">{{ title }}</h3>
    <slot name="bigImg"></slot>
    <div class="img_link_list">
      <template v-for="(item, index) in lists">
        <a
          :key="index"
          :href="countryUrl(item.imgType == 'link' ? item.linkUrl : '')"
          :data-datalayer-category="item.eventCategory"
          :data-datalayer-label="item.eventName"
          :class="{
            need_datalayer: item.eventCategory && item.eventName,
            no_margin_right: (index + 1) % rowCount === 0,
            [textLayout]: true
          }"
          :target="item.imgType == 'link' ? linkTarget : '_self'"
          :aria-label="item.imgAlt + ' ' + nl(item.title) + ' ' + nl(item.text) + ' >'"
          @click="item.imgType == 'dialog' && $emit('set-style-quiz-layer-show', true)"
          v-track.viewOnce.click="item.biParams"
        >
          <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
          <slot :item="item" name="text"
            ><h4>{{ nl(item.title) }}</h4>
            <span v-if="item.text">{{ nl(item.text) }} <template v-if="textArrow">></template></span></slot
          >
        </a>
      </template>
      <span v-for="item in resCount" :key="lists.length + item" class="fill-box">&nbsp;</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgLinkList',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    linkTarget: {
      type: String,
      default: '_blank'
    },
    rowCount: {
      type: Number,
      default: 3
    },
    textLayout: {
      type: String,
      default: '' // ta-left
    },
    titleLayout: {
      type: String,
      default: '' // ta-left
    },
    textArrow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    resCount() {
      const res = this.lists.length % this.rowCount
      return !res ? 0 : this.rowCount - res
    }
  }
}
</script>

<style lang="less" scoped>
.list_title {
  font-size: 24px;
  font-family: @font-family-600;
  color: var(--color-121212);
  line-height: 64px;
  font-weight: normal;
  &.ta-center {
    text-align: center;
  }
}
.img_link_list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0 auto;
  a,
  .fill-box {
    flex: 1;
  }
  a {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    margin-right: 20px;
    // img {
    //   width: 364px;
    //   height: 500px;
    // }
    &.ta-left {
      align-items: flex-start;
    }
    h4 {
      margin-top: 20px;
      margin-bottom: 15px;
      color: var(--color-121212);
      font-size: 18px;
      font-family: @font-family-600;
      line-height: 18px;
      font-weight: normal;
    }
    span {
      color: var(--color-121212);
      line-height: 13px;
      text-transform: uppercase;
    }
    &.no_margin_right {
      margin-right: 0;
    }
  }
}
.fill-box {
  opacity: 0;
}
</style>
