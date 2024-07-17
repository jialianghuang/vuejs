<template>
  <div class="r4 big">
    <div class="r4c1">
      <div v-for="(item, index) in bigImg.list.slice(0, 2)" :key="index" :class="{ ['r4c1r' + (index + 1)]: true }">
        <a
          :data-datalayer-category="item.eventCategory"
          :data-datalayer-label="item.eventName"
          :href="countryUrl(item.linkUrl)"
          :target="linkTarget"
          :class="{ need_datalayer: item.eventName && item.eventCategory }"
        >
          <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
          <h2 class="wd-font-md">{{ item.title }}</h2>
          <h3 class="wd-font-sm">{{ item.text }}</h3>
        </a>
      </div>
    </div>
    <div class="r4c2">
      <a
        :data-datalayer-category="bigImg.list[2].eventCategory"
        :data-datalayer-label="bigImg.list[2].eventName"
        :href="countryUrl(bigImg.list[2].linkUrl)"
        :target="linkTarget"
        :class="{ need_datalayer: bigImg.list[2].eventName && bigImg.list[2].eventCategory }"
      >
        <img :src="replaceImgCdnUrl(bigImg.list[2].imgUrl)" :alt="bigImg.list[2].imgAlt" />
        <h2 class="wd-font-md">{{ bigImg.list[2].title }}</h2>
        <h3 class="wd-font-sm">{{ bigImg.list[2].text }}</h3>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WeddingDressesBigImg',
  props: {
    bigImg: {
      type: Object,
      default() {
        return {}
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
.wd-font-bg {
  font-family: @font-family-600, sans-serif;
  color: var(--color-121212);
  font-size: 24px;
  line-height: 42px;
  margin-bottom: 20px;
  font-weight: 400;
}
.wd-font-md {
  font-family: @font-family-600, sans-serif;
  color: var(--color-121212);
  font-size: 18px;
  word-spacing: 1.9px;
  font-weight: 400;
}

.wd-font-sm {
  font-family: @font-family-500, sans-serif;
  color: var(--color-121212);
  font-size: 13px;
  font-weight: 400;
}
.r4.big {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  margin-top: 0;
  h2 {
    margin-bottom: 8px;
  }
  img {
    margin-bottom: 10px;
  }
  a {
    display: block;
    width: 100%;
  }
  .r4c2 {
    img {
      width: 792px;
      height: 556px;
    }
  }
  .r4c1 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .r4c1r1 {
      img {
        width: 320px;
        height: 223px;
      }
    }
    .r4c1r2 {
      img {
        width: 320px;
        height: 223px;
      }
    }
  }
}
</style>
