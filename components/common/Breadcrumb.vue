<template>
  <div id="bread_crumb">
    <ul class="breadcrumb clearfix">
      <li v-for="(item, name, index) in breadCrumbInfo" :key="name" :class="name">
        <a
          v-if="index < Object.keys(breadCrumbInfo).length - 1"
          :href="countryUrl(item.href + (isBridal ? `${item.href.includes('?') ? '&' : '?'}subsite=bridal` : ''))"
          :title="item.title"
          >{{ nl(item.title) }}</a
        >
        <span v-else :title="nl(item.title)">{{ nl(item.title) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    breadCrumbInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
#bread_crumb {
  box-sizing: border-box;
  max-width: 1353px;
  width: 100%;
  margin: 0 auto;
  padding: 15px 0 5px;
  ul {
    li {
      height: 29px;
      float: left;
      position: relative;
      &:nth-child(1) {
        a {
          padding-left: 0;
        }
      }
      span,
      a {
        color: var(--color-121212);
        display: inline-block;
        height: 29px;
        line-height: 29px;
        padding: 0 8px 0 10px;
        &:after {
          content: '';
          position: absolute;
          top: 2px;
          right: -6px;
          background-position: 0 7px;
          width: 7px;
          height: 27px;
          background-image: data-uri('../../assets/images/breadcrumb.png');
          background-repeat: no-repeat;
        }
        &:hover {
          color: @theme-color;
        }
      }
      span {
        &::after {
          display: none;
        }
        &:hover {
          color: var(--color-121212);
        }
      }
    }
  }
}
</style>
