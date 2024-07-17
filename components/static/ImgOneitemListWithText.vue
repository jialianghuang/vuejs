<template>
  <ul>
    <li v-for="(item, index) in lists" :key="index" :class="[item.position == 'left' ? 'p_right' : '']">
      <a
        :data-datalayer-category="item.eventCategory"
        :data-datalayer-label="item.eventName"
        :href="countryUrl(item.linkUrl)"
        :class="{
          need_datalayer: item.eventCategory && item.eventName
        }"
        :target="linkTarget"
      >
        <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
        <div>
          <h4>
            <span>{{ item.header }} </span>{{ item.title }}
          </h4>
          <span>{{ item.text }} ></span>
        </div>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ImgOneItemListWithText',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  }
}
</script>

<style lang="less" scoped>
ul li {
  position: relative;
  width: 1132px;
  height: 870px;
  div {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 600px;
    height: 90px;
    padding: 10px 40px 0;
    background: #f5eef0;
    cursor: pointer;
    img {
      width: 1132px;
      height: 870px;
    }
    h4 {
      font-size: 24px;
      font-family: @font-family-500;
      color: var(--color-121212);
      line-height: 48px;
      font-weight: normal;
      span {
        font-family: @font-family-600;
      }
    }
    & > span {
      font-size: 15px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 15px;
    }
  }
  &.p_right {
    div {
      right: unset;
      left: 0;
    }
  }
}
</style>
