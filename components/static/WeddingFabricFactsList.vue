<template>
  <div>
    <div v-for="(item, index) in lists" :key="index" class="general-card-item">
      <div class="left">
        <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
      </div>
      <div class="right">
        <div class="img-list">
          <a
            v-for="(imgItem, imgIndex) in item.subImgs"
            :key="imgIndex"
            :data-datalayer-category="imgItem.eventCategory"
            :data-datalayer-label="imgItem.eventName"
            :class="{
              need_datalayer: imgItem.eventCategory && imgItem.eventName
            }"
            :href="countryUrl(imgItem.linkUrl)"
            :target="imgItem.linkUrl ? linkTarget : '_self'"
            class="img-item"
          >
            <img :src="replaceImgCdnUrl(imgItem.imgUrl)" :alt="imgItem.imgAlt" />
            <p>{{ imgItem.title }}</p>
          </a>
        </div>
        <div class="text">
          <h1>{{ item.title }}</h1>
          <h3>
            {{ item.text }}
          </h3>
          <ul>
            <li v-for="(textItem, textIndex) in item.details" :key="textIndex">
              {{ textItem }}
            </li>
          </ul>
          <a
            v-for="(entryItem, entryIndex) in item.entrances"
            :key="entryIndex"
            :data-datalayer-category="entryItem.eventCategory"
            :data-datalayer-label="entryItem.eventName"
            :class="{
              need_datalayer: entryItem.eventCategory && entryItem.eventName
            }"
            :target="linkTarget"
            :href="countryUrl(entryItem.linkUrl)"
          >
            {{ entryItem.title }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgOneitemList',
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
.general-card-item {
  display: flex;
  height: 595px;
  width: 100%;
  margin: 30px 0;
  .left {
    img {
      width: 430px;
      height: 595px;
    }
  }
  .right {
    width: 702px;
    padding: 40px 59px;
    background: #fcfcf6;
    .img-list {
      display: flex;
      padding: 0 40px 46px 40px;
      justify-content: center;
      .img-item {
        display: flex;
        flex-direction: column;
        height: 160px;
        margin: 0 20px;
        align-items: center;
        img {
          width: 128px;
          height: 128px;
          margin-bottom: 10px;
          background: #fcfcf6;
        }
        p {
          font-family: @font-family-500, sans-serif;
          color: var(--color-121212);
          font-size: 13px;
          text-align: center;
          align-self: center;
          text-indent: 2px;
        }
      }
    }
    .text {
      h1 {
        font-family: Libre Baskerville Regular, sans-serif;
        margin-bottom: 6px;
        font-size: 24px;
        font-weight: 400;
      }
      a {
        display: block;
        line-height: 26px;
        font-family: @font-family-600, sans-serif;
        color: var(--color-121212);
        font-size: 13px;
        margin-bottom: 10px;
      }
      h3 {
        font-size: 13px;
      }
      ul {
        margin-top: 30px;
        margin-bottom: 41px;
        li {
          position: relative;
          padding-left: 8px;
          font-size: 13px;
          line-height: 26px;
          &:before {
            position: absolute;
            content: '\2022';
            font-family: @font-family-500, sans-serif;
            color: var(--color-121212);
            font-size: 13px;
            left: 0;
          }
        }
      }
    }
  }
}
</style>
