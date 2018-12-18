# 开源社官网

这是一个基于Hexo构建的静态网站源码。

## 搭建本地环境

···
$ npm install -g cnpm --registry=<https://registry.npm.taobao.org>
···
cnpm install hexo-cli -g

hexo init docs

### 判断方式：

    node -v
    git version

## 预览与构建

cd docs

cnpm install

hexo server

cnpm install hexo-deployer-git --save

## 结构目录

home 目录下是 通过hexo初始化的一个项目目录

## 参考手册

Hexo官网地址:<https://hexo.io>
