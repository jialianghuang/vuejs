<template>
  <div class="brides_nav">
    <div
      @click="
        init = false
        showMenu = !showMenu
      "
      class="first_nav nav_name show"
    >
      <span>{{ menus.title }}</span>
      <template v-if="(init && menus.isActive) || (!init && showMenu)">
        <span class="hide_children">—</span>
      </template>
      <template v-else>
        <span class="show_children">+</span>
      </template>
    </div>
    <ul
      v-if="menus.childNodes && menus.childNodes.length && ((init && menus.isActive) || (!init && showMenu))"
      class="first_nav_children show"
    >
      <li v-for="(menu, menuIndex) in menus.childNodes" :key="menuIndex">
        <div @click="selectIndex(activeIndex === menuIndex ? '' : menuIndex)" class="second_nav nav_name">
          <span>{{ menu.title }}</span>
          <template v-if="(init && menu.isActive) || (!init && activeIndex === menuIndex)">
            <span class="hide_children">—</span>
          </template>
          <template v-else>
            <span class="show_children">+</span>
          </template>
        </div>
        <ul
          v-if="menu.childNodes && menu.childNodes.length && ((init && menu.isActive) || (!init && activeIndex === menuIndex))"
          class="second_nav_children show"
        >
          <li v-for="(item, index) in menu.childNodes" :key="index">
            <a
              v-if="item.isModal"
              @click="$emit('set-style-quiz-layer-show', true)"
              :class="{ need_datalayer: item.eventCategory && item.eventName }"
              :data-datalayer-category="item.eventCategory"
              :data-datalayer-label="item.eventName"
              href="javascript:void(0);"
              >{{ item.title }}</a
            >
            <a
              v-else
              :href="countryUrl(item.linkUrl)"
              :class="{ need_datalayer: item.eventCategory && item.eventName }"
              :data-datalayer-category="item.eventCategory"
              :data-datalayer-label="item.eventName"
              :target="linkTarget"
              >{{ item.title }}</a
            >
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AccordionMenu',
  props: {
    menus: {
      type: Object,
      default() {
        return {}
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  },
  data() {
    return {
      init: true,
      showMenu: true,
      activeIndex: ''
    }
  },
  mounted() {
    this.activeIndex = 1
  },
  methods: {
    selectIndex(index) {
      this.init = false
      this.activeIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
.brides_nav {
  position: absolute;
  left: 70px;
  top: 70px;
  box-sizing: border-box;
  width: 285px;
  background: #fff;
  padding: 30px 30px 18px;
  .first_nav {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 4px solid transparent;
    font-size: 18px;
    font-family: @font-family-600;
    color: var(--color-121212);
    line-height: 18px;
    cursor: pointer;
    .show_children {
      font-size: 30px;
    }
    .hide_children {
      display: inline;
      font-size: 16px;
    }
    &.show {
      border-bottom: 4px solid var(--color-121212);
    }
  }
  .first_nav_children {
    display: none;
    &.show {
      display: block;
    }
    & > li {
      border-top: 1px solid #d7d7d7;
      &:first-child {
        border-top: none;
      }
      &:last-child {
        .second_nav {
          margin-top: 18px;
          line-height: 14px;
        }
        .second_nav_children {
          margin-top: 18px;
        }
      }
      &.show {
        border-color: var(--color-121212);
      }
    }
    .second_nav {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 50px;
      cursor: pointer;
      span:first-child {
        text-transform: uppercase;
      }
      .show_children {
        font-size: 28px;
      }
      .hide_children {
        display: inline;
        font-size: 16px;
      }
    }
    .second_nav_children {
      display: none;
      &.show {
        display: block;
      }
      li {
        margin-bottom: 14px;
        a {
          color: #666;
          font-size: 13px;
          font-family: @font-family-500;
          line-height: 13px;
        }
      }
    }
  }
}
@media (max-width: 1500px) {
  .brides_nav {
    .first_nav {
      padding-bottom: 7px;
      line-height: 25px;
    }
    padding: 26px 30px 14px;
    .first_nav_children {
      .second_nav {
        line-height: 20px;
        padding: 11px 0;
      }
      .second_nav_children li {
        margin-bottom: 6px;
      }
      & > li:last-child {
        .second_nav {
          margin-top: 14px;
          padding: 0;
          line-height: 14px;
        }
        .second_nav_children {
          margin-top: 11px;
          li:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
