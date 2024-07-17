<template>
  <!-- 零售商find a store页面点击左侧城市打开的弹窗 -->
  <div v-if="showDialog">
    <div class="dialog-layer"></div>
    <div class="dialog-content">
      <i @click="showDialog = false" v-track.view.click="{ common: { ec: 'retailer', el: 'storepopupclose' } }">×</i>
      <ul>
        <li v-for="(item, index) in choosedCity.storeList" :key="index">
          <h3>{{ item.storeName }}</h3>
          <div class="store-detail">
            <p>
              <i>{{ nl('page_address_address_desc') }}</i>
              <a
                :href="
                  `https://maps.google.com/maps/dir//${item.storeName}+${item.storeAddress}+${choosedCity.cityName}+${choosedCity.provinceName}+${item.zipcode}`
                "
                v-track.click="{
                  common: {
                    ec: 'retailer',
                    el: 'storeaddress',
                    msg: JSON.stringify({ cityName: choosedCity.cityName, storeName: item.storeName })
                  }
                }"
                target="_blank"
                style="color: #666"
                >{{ item.storeAddress }}<br />
                {{ choosedCity.cityName }},{{ choosedCity.provinceName }}, {{ item.zipcode }}</a
              >
            </p>
            <p>
              <i>{{ nl('page_placeholder_phone') }}</i>
              <a
                :href="`tel:${item.storePhone}`"
                v-track.click="{
                  common: {
                    ec: 'retailer',
                    el: 'storephone',
                    msg: JSON.stringify({ cityName: choosedCity.cityName, storeName: item.storeName })
                  }
                }"
                style="color:#666"
              >
                {{ item.storePhone }}</a
              >
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StoreDialog',
  props: {
    choosedCity: {
      type: Object,
      default() {
        return { storeList: [] }
      }
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
    show() {
      this.showDialog = !this.showDialog
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-layer {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: @fixed-z-index;
}
.dialog-content {
  position: fixed;
  width: 700px;
  top: 50%;
  left: 50%;
  z-index: @fixed-z-index;
  transform: translate(-50%, -50%);
  background: #fff;
  ul {
    overflow-y: auto;
    min-height: 220px;
    max-height: 520px;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #f5f5f5;
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #ccc;
    }
  }

  & > i {
    font-size: 30px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-style: normal;
    cursor: pointer;
    color: #999;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  li {
    padding: 40px;
    border-bottom: 1px solid #eee;
    &:last-child {
      border: none;
    }
    h3 {
      font-family: @font-Ivy-Mode-400;
      font-size: 28px;
      font-weight: 400;
      color: var(--color-121212);
    }
  }
  .store-detail {
    display: flex;
    justify-content: space-between;
    font-family: @font-family-500;
    font-size: 14px;
    p {
      width: 250px;
      &:first-child {
        a {
          cursor: pointer;
        }
      }
    }
    i,
    span {
      display: block;
    }
    i {
      margin: 20px 0;
      color: #999;
      font-style: normal;
    }
    span,
    a {
      color: #666;
      word-break: break-all;
      cursor: pointer;
    }
    a:hover {
      text-decoration-line: underline;
    }
  }
}
</style>
