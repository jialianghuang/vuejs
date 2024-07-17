import Vue from 'vue'
function LocalStorage() {}
// module.exports = localStorage

LocalStorage.prototype.getLocalStorage = function(key) {
  return localStorage.getItem(key)
}

LocalStorage.prototype.setLocalStorage = function(key, value) {
  localStorage.setItem(key, value)
}

Vue.prototype.$localStorage = new LocalStorage()
