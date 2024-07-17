<template>
  <div id="bread_crumb">
    <ul class="breadcrumb clearfix">
      <li class="home">
        <a :title="nl('page_common_home')" :href="countryUrl('/')">{{ nl('page_common_home') }}</a>
      </li>
      <li v-for="(item, index) in listCrumb" :key="index">
        <template v-if="index < listCrumb.length - 1">
          <a :href="item.href" :title="item.name"> {{ nl(item.name) }}</a>
        </template>
        <template v-else>
          <span>{{ nl(item.name) }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    listCrumb: {
      type: Array,
      default() {
        return []
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
  padding: 8px 0 5px;
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
        text-transform: capitalize;
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
