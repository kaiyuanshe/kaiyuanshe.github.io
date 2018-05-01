---
title: 修改内容
tags: 
grammar_cjkRuby: true
---

## 修改目的

将开源社网站中：个人信息->加入开源社->页面中的“你愿意加入哪个开源社工作组”，由原来的文本控件变更为多选控件。

## 修改文件夹的位置

>/kaiyuanshe/system/module/ext/_kaiyuanshe/member

## 修改内容

本次修改，避免了直接修改数据库，以前台修改为主，各文件修改内容如下：

1.  config.php

变更页面中相应位置的控件为多选控件（checkbox）。

2. zh-cn.php

定义页面中，新增的多选控件需要显示的内容，数组名称为 willingList。

3. model.php

在保存函数中，增加处理前台页面传递过来的多选控件的值，将多选控件的值合并成一个值并用“，”分割。

4. join.html.php

页面中增加“checkbox"控件的显示内容

