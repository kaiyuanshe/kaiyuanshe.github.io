# 开源社官网 [](https://travis-ci.org/robyle/kaiyuanshe.svg?branch=master)

这是一个基于Hexo构建的静态网站源码。

## 搭建本地环境

    ``
        $ npm install -g cnpm --registry=https://registry.npm.taobao.org
    ``
cnpm install hexo-cli -g

hexo init src

### 判断方式：

    node -v
    git version

## 预览与构建

cd src

cnpm install

hexo server

cnpm install hexo-deployer-git --save

## 结构目录

src 目录下是 通过hexo初始化的一个项目目录,改目录用于程序员进行更新代码，也是Hexo初始化的时候需要一个目录要求的必要选项。

READEME.md 该文件是用于说明引导使用开发项目说明文档。

SUMMARY.md 开源社网站开发及管理总结性说明。

## 参考手册

Hexo官网地址:<https://hexo.io>
