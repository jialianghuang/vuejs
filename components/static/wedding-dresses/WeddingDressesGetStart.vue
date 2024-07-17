<template>
  <div>
    <h1 class="wd-font-bg">{{ gettingStarted.title }}</h1>
    <div v-if="gettingStarted.list && gettingStarted.list.length" class="r2">
      <div class="r2c1">
        <a
          :data-datalayer-category="gettingStarted.list[0].eventCategory"
          :data-datalayer-label="gettingStarted.list[0].eventName"
          :href="countryUrl(gettingStarted.list[0].linkUrl)"
          :target="linkTarget"
          :class="{ need_datalayer: gettingStarted.list[0].eventName && gettingStarted.list[0].eventCategory }"
        >
          <img :src="replaceImgCdnUrl(gettingStarted.list[0].imgUrl)" :alt="gettingStarted.list[0].imgAlt" />
          <h2 class="wd-font-md">{{ gettingStarted.list[0].title }}</h2>
          <h3 class="wd-font-sm">{{ gettingStarted.list[0].text }}</h3>
        </a>
      </div>
      <div class="r2c2">
        <div v-for="(item, index) in gettingStarted.list.slice(1)" :key="index" class="r2c2r1">
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
    </div>
  </div>
</template>
<script>
export default {
  name: 'WeddingDressesGetStart',
  props: {
    gettingStarted: {
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
.r2 {
  display: flex;
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 64px;
  a {
    display: block;
    width: 100%;
  }
  h2 {
    margin-bottom: 8px;
  }
  .r2c1 {
    img {
      width: 792px;
      height: 556px;
      margin-bottom: 10px;
    }
  }
  .r2c2 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .r2c2r1 {
      img {
        width: 320px;
        height: 224px;
        margin-bottom: 10px;
      }
    }
    .r2c2r2 {
      img {
        width: 320px;
        height: 224px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
