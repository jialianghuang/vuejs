<template>
  <div class="help-shop-by-more">
    <strong>{{ moreOption.title }}:</strong>
    <div class="help-shop-by-more-options">
      <a @click="hrefPoint(item.name)" v-for="(item, index) in moreOption.list" :key="index" :href="countryUrl(item.url)">
        {{ nl(item.nameLanguage) }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoreOption',
  props: {
    moreOption: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    hrefPoint(name) {
      this.buryPoint(this, 'event', {
        ec: 'shopby',
        el: 'typles',
        ea: 'click',
        msg: JSON.stringify({ name })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.help-shop-by-more {
  margin: 50px 0 147px;
  text-align: left;
  text-transform: uppercase;
  margin-bottom: 75px;
  display: flex;
  a {
    float: left;
    margin-left: 15px;
    color: #666;
    text-decoration: underline;
    margin-top: 3px;
    font-size: 12px;
    &:hover {
      color: var(--color-121212);
    }
  }
  strong {
    float: left;
    letter-spacing: 1px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
  }
  .help-shop-by-more-options {
    flex: 1;
  }
}
</style>
