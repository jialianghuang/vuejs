<template>
  <span class="az-service">
    <svg style="position: absolute; width: 0px; height: 0px; overflow: hidden;">
      <symbol id="icon_service_review" viewBox="0 0 1024 1024">
        <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#121212" p-id="29197"></path>
        <path
          d="M219.428571 487.619048h97.52381v243.809523h-97.52381zM707.047619 487.619048h97.52381v243.809523h-97.52381z"
          fill="#FFFFFF"
          p-id="29198"
        ></path>
        <path
          d="M512 219.428571a268.190476 268.190476 0 0 1 267.995429 257.414096L780.190476 487.619048v97.523809h-48.761905v-97.523809a219.428571 219.428571 0 0 0-438.613333-10.337524L292.571429 487.619048v97.523809H243.809524v-97.523809a268.190476 268.190476 0 0 1 268.190476-268.190477zM512 770.438095c50.566095 0 93.281524-34.523429 97.231238-80.164571l0.292572-6.924191V658.285714h-48.761905v25.063619c0 20.284952-21.065143 38.326857-48.761905 38.326857-25.551238 0-45.494857-15.408762-48.37181-33.645714l-0.390095-4.681143V658.285714h-48.761905v25.063619c0 49.005714 44.422095 87.088762 97.52381 87.088762z"
          fill="#FFFFFF"
          p-id="29199"
        ></path>
      </symbol>
    </svg>
    <az-icon @click="showAsk" icon-class="icon_service_review" class="az-service__icon"></az-icon>
    <span class="az-service__tips">{{ nl('page_module_reviews_service') }}</span>
  </span>
</template>

<script>
import azIcon from './../AzIcon'
export default {
  name: 'AzService',
  components: {
    azIcon
  },
  methods: {
    showAsk() {
      this.$emit('openAskPop')
    }
  }
}
</script>

<style lang="less" scoped>
.az-service {
  position: relative;
  &:hover {
    .az-service__tips {
      display: block;
    }
  }
  margin-left: 10px;
}
.az-service__icon {
  width: 21px;
  height: 21px;
  cursor: pointer;
}
.az-service__tips {
  position: absolute;
  display: none;
  width: 134px;
  padding: 6px 15px 4px;
  font-size: 13px;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + 14px);
  z-index: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
  text-align: center;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    border-top: 8px solid #ccc;
    border-right: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
  }
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    border-top: 7px solid #fff;
    border-right: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 7px solid transparent;
    z-index: 1;
  }
}
</style>
