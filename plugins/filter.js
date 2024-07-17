import Vue from 'vue'

export function trim(str) {
  return str.replace(/(^\s*)(\s*$)/g, '')
}

export function replace(value, before, after) {
  if (!value) return ''
  return value.replace(before, after)
}

const filters = {
  // trim,
  replace
}

export default filters

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
