# 开发规范讨论版
## button 相关规范实现
### 样式类： 
目前使用的css,就从理解和书写的角度来考虑，后面可能需要使用less

## button使用方法
import Button from '...component'

### 使用 
``` 代码区域
 1 默认不传任何参数 但是text是必传参数 表示button名称 <Button text="登入" />
 2. 传递参数 <Button color="red", text="买入平出" startIcon={DownLoad}>

```

## api
## 参数
| 参数 | 作用   |  可选值 |是否必须 或默认值 |
| ---- |  ---- | ----- | ----- |
| size | 定义按钮大小| 'large ' 'middle' 'small'| 'default'|
| text | 按钮名称 | |"默认为登入" |
| startIcon| 带icon按钮 | 可传值 默认大小 16*16 |
|color| 按钮北京颜色| 'transparent' 'red' 'green' 'gradient'| 'transparent'
|endIcon| 带icon按钮| |非必传|
|onClick| 点击事件函数||无|


## 补充 - 关于icon的相关定义与使用
-- 择日在写哈哈 目前脑子里没什么思路