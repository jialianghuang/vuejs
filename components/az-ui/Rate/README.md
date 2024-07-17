# 星级

# props

| 值 | 含义 | 类型 | 默认值 |
| ---- | ----- | ---- | ---- |
| value | 传入的数值 | Number | `0` |
| total | 共有几颗星 | Number | `5` |
| readonly | 是否只读 | Boolean | `false` |
| fontSize | 字体大小 | String | `14px` |
| space | 间距 | String | `0 3px 0 0` |
| showScore | 是否显示分数 | Boolean | `false` |
| showText | 是否显示辅助文字 | Boolean | `false` |
| texts | 辅助文字 | Array | `['Poor', 'Fair', 'Average', 'Good', 'Excellent']` |
| textStyle | 右侧文字或者分数的样式 | Object | `{}` |

# Events

| 事件名 | 含义 |
| ---- | ----- |
| change | 当前选中值改变时触发 |