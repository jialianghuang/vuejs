<template>
  <transition name="fade">
    <div v-if="isRender" class="label-box">
      <div @click="checkboxSelect" v-if="!isSelected" :class="{ selected: isSelected }" class="checkbox-box"></div>
      <div @click="checkboxSelect" v-else :class="{ selected: isSelected }" class="checkbox-box">
        <svg class="icon">
          <use xlink:href="#icon-lby_tick_white_s"></use>
        </svg>
      </div>
      <slot>
        <div class="desc">
          <div @click="checkboxSelect">
            <span class="head">{{ nl('page_checkout_phone_subscribe_head') }}</span>
          </div>
          <div>
            <span class="content"
              >{{ nl('page_checkout_phone_subscribe_desc') }}
              <a :href="`${WEB_ROOT}terms_of_use`" class="go-to" target="_blank">{{ nl('page_checkout_phone_subscribe_terms') }}</a> &
              <a :href="`${WEB_ROOT}privacy_policy`" class="go-to" target="_blank"> {{ nl('page_checkout_phone_subscribe_privacy') }}</a
              >.</span
            >
          </div>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CheckBox',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    isRender: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSelected: this.checked
    }
  },
  watch: {
    isRender(val) {
      if (!val) {
        this.isSelected = false
      }
    }
  },
  methods: {
    checkboxSelect() {
      this.isSelected = !this.isSelected
      this.$emit('change', this.isSelected)
    }
  }
}
</script>

<style lang="less" scoped>
.label-box {
  font-size: 12px;
  line-height: 18px;
  color: var(--color-121212);
  display: flex;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
  }
}
.desc {
  margin-top: -4px;
  margin-left: 5px;
  .head {
    font-family: @font-family-600;
  }
  .content {
    font-family: @font-family-500;
    &:hover {
      cursor: default;
    }
  }
}
.checkbox-box {
  border: 1px solid var(--color-121212);
  width: 12px;
  height: 12px;
  line-height: 12px;
  display: inline-block;
  margin-right: 1px;
  box-sizing: border-box;
  flex-shrink: 0;
  &.selected {
    background: #666;
    border-color: #666;
  }
  .icon {
    width: 9px;
    height: 9px;
    color: #fff;
    vertical-align: top;
    fill: currentColor;
    overflow: hidden;
    margin: 1px 0 0 1px;
  }
}
.go-to {
  text-decoration: underline;
  color: var(--color-121212);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
