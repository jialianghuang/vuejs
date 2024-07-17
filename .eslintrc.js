module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['@nuxtjs', 'prettier', 'prettier/vue', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-v-for-template-key': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    eqeqeq: 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-eval': [
      'error',
      {
        allowIndirect: true
      }
    ], // default is false
    'vue/no-v-html': 'off'
  }
}
