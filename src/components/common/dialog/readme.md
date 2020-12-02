# $.dialog

对话框组件。(为了统一，我把他挂在了$下)

此为第三方插件 [github](https://github.com/aui/artDialog) [中文使用参考](http://aui.github.io/artDialog/doc/index.html)

糖饼出品 必属精品

## 功能描述

- 普通对话框
- 模态对话框（带遮罩）
- 气泡浮层（tips）
- 添加按钮
- 控制对话框关闭
- 给对话框左下脚添加复选框
- 阻止对话框关闭
- 不显示关闭按钮
- 创建 iframe 内容

## 快速入门

普通对话框（不带遮罩）

```
var d = $.dialog({
    title: '欢迎',
    content: '欢迎使用 artDialog 对话框组件！'
});
d.show();
```

模态对话框（带遮罩）

```
var d = $.dialog({
    title: 'message',
    content: '<input autofocus />'
});
d.showModal();
```

气泡浮层

```
var d = dialog({
    content: 'Hello World!',
    quickClose: true// 点击空白处快速关闭
});
d.show(document.getElementById('quickref-bubble'));
```