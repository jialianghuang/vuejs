<template>
  <div class="choose-category">
    <div class="choose-category-content">
      <div class="title">
        {{
          theme === 'spring-wedding' ? nl('page_wedding_theme_choose_your_role_spring') : nl('page_wedding_theme_choose_your_role_beach')
        }}
      </div>
      <div class="choose-category-box">
        <template v-for="(item, index) in categoryList">
          <div :key="index" @click="chooseCategory(item, index)" :class="['choose-category-item', { active: currentIndex === index }]">
            {{ item.value }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * wedding-theme主题页 选择category分类组件
 *
 */
export default {
  name: 'ChooseCategory',
  props: {
    theme: {
      type: String,
      default: ''
    },
    categoryList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    chooseCategory(item, index) {
      this.currentIndex = index
      const id = `#${item.key}`
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.choose-category {
  position: relative;
  padding: 80px 3.75% 0;
  .choose-category-content {
    margin: 0 auto;
    max-width: 1600px;
  }
  .title {
    margin: 0 0 30px;
    color: @gray-dark;
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 36px;
    letter-spacing: 2.88px;
    text-transform: uppercase;
    word-break: break-word;
  }
  .choose-category-box {
    background: @bg-color;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .choose-category-item {
    color: @gray-dark;
    text-align: center;
    font-family: @font-family-500;
    font-size: 20px;
    letter-spacing: 2px;
    padding: 21px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    width: calc(20% - 5px);
    cursor: pointer;
  }
  .active {
    border-radius: 10px;
    background: @theme-hover;
    color: @body-bg;
  }
}
</style>
