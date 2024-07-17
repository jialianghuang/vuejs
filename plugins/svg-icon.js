import Vue from 'vue'
import SvgIcon from '../components/az-ui/AzIcon.vue'

Vue.component('svg-icon', SvgIcon)
const req = require.context('@/assets/svgs', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)
