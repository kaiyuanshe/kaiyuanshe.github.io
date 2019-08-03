# 开源社官网

[![Build Status](https://travis-ci.org/kaiyuanshe/kaiyuanshe.svg?branch=hexo)](https://travis-ci.org/kaiyuanshe/kaiyuanshe)

## 参与开发

[改版需求表](https://shimo.im/sheets/NserO6Sk5p0GMxz5/MODOC)

请务必先做好[数据子库的准备](https://github.com/kaiyuanshe/Wiki/#%E6%9C%AC%E6%9C%BA%E7%BC%96%E8%BE%91)！

### 安装

```shell
# 若网速慢，可启用以下环境变量
# GIT_LFS_SKIP_SMUDGE=1

git clone --recurse-submodules \
  https://github.com/kaiyuanshe/kaiyuanshe.git \
  ~/Desktop/KaiYuanShe/OWS/

cd ~/Desktop/KaiYuanShe/OWS/

npm install  &&  npm start
```

### 写作

```shell
cd ~/Desktop/KaiYuanShe/OWS/

hexo new "My Post title"

cd source/

git checkout master  # 确保子模块在 master 分支，否则提交推送后会丢失

code _post/My-Post-title.md  # 用你喜欢的文本编辑器写作

git add _post/My-Post-title.md

git commit -m "[ Add ]  A new Post"

git push
```

### 开发

```shell
cd ~/Desktop/KaiYuanShe/OWS/

git submodule update --remote  # 程序开发后要同步文章目录

git add .

git commit -m "[ Add ]  A new Feature"

git push
```

## 鸣谢

- 静态网站生成器：https://hexo.io/

- 项目搭建工具：https://tech-query.me/create-hexo-wiki/

- 页面模板：https://electronjs.org/

- 日历组件：https://fullcalendar.io/

- 地图组件：https://lbs.amap.com/api/javascript-api/summary

- 博文迁移工具：https://github.com/TechQuery/hexo-migrator-web

- 在线编辑器：https://github.com/kaiyuanshe/git-pager
