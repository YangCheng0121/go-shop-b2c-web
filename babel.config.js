module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // Vant 组件库按需引入配置
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }]
  ]
}
