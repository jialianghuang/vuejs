<template>
  <div>
    <div v-for="(list, listIndex) in contentList" :key="listIndex">
      <template v-if="list.list && list.list.length">
        <h1 class="common-title help-shop-by-title">{{ list.title }}</h1>
        <ul class="help-shop-by clearfix">
          <li v-for="(item, index) in list.list" :key="index" :class="{ last: index === list.list.length - 1 || (index + 1) % 5 == 0 }">
            <a :href="countryUrl(item.url)" :aria-label="list.title + ' ' + item.showName + ' link'">
              <p
                :class="[item.class]"
                :style="`background: url(${replaceImgCdnUrl(item.imgUrl)}) no-repeat center / cover;`"
                class="pic"
              ></p>
              <img :src="replaceImgCdnUrl(hoverImage)" class="imageHover" alt="shop by" />
              <h2>{{ item.showName }}</h2>
            </a>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NormalList',
  props: {
    contentList: {
      type: Array,
      default() {
        return []
      }
    },
    hoverImage: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.help-shop-by-title {
  margin: 18px 0 50px;
}
.help-shop-by {
  // padding-left: 6px;
  display: flex;
  flex-wrap: wrap;
  li {
    // float: left;
    // position: relative;
    margin: 0 0 37px 0;
    margin-right: (1293px - 188px * 5) / 4;
    width: 188px;
    text-align: center;
    &.last {
      margin-right: 0;
    }
  }
  .pic {
    display: block;
    width: 100%;
    height: 188px;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
}
@media screen and (max-width: 1370px) {
  .help-shop-by li {
    margin-right: (1203px - 188px * 5) / 4;
  }
}
.a_line_princess {
  background-position: 0 0;
}
.empire {
  background-position: -188px 0;
}
.trumpet_mermaid {
  background-position: -376px 0;
}
.sheath_column {
  background-position: -564px 0;
}

.imageHover {
  position: absolute;
  left: 0;
  top: 0;
  display: none;
}
a:hover .imageHover {
  display: block;
}
h2 {
  margin-top: 13px;
  line-height: 18px;
  text-decoration: underline;
  color: #666;
  font-weight: normal;
  text-transform: uppercase;
}
a:hover h2 {
  color: @theme-color;
}

.shop-body-type-more {
  a {
    margin-left: 18px;
  }
}
</style>
