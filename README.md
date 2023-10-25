# 开源社官网

该项目是使用 [`create-next-app`][6] 脚手架引导安装，基于 [TypeScript][2]、[Next.js][3]、[Bootstrap][4] 和 [Workbox][5] 的 [React][1] 项目。

[![Deploy to Production environment](https://github.com/kaiyuanshe/kaiyuanshe.github.io/actions/workflows/deploy-production.yml/badge.svg)][8]

## 主要功能

本站不仅承担传统官网的职能，还是一个**同时具备 SSR 和 PWA 能力的 Web 前端基座**，与开源社其它应用项目的前端模块组成一个矩阵。

### 开源社文库

- [前端主页](https://kaiyuanshe.cn/article)
- [前端代码](pages/article/)
- [后端服务](https://kaiyuanshe.feishu.cn/base/bascnClkwE6JnHTYK1p3ln1Crjl)
- [后端代码](models/Product/Article.ts)

### 组织管理系统

- [项目简介](https://kaiyuanshe.feishu.cn/wiki/VpY9wRitDiiObVkNsXycWP3Gnmf)
- [前端主页](https://kaiyuanshe.cn/department)
- [前端代码](pages/department/)
- [后端服务](https://kaiyuanshe.feishu.cn/base/UaJ6b4MtcaywOwsaT7ecyiQuntc)
- [后端代码](models/Personnel/)

### 开放会务系统

- [项目简介](https://kaiyuanshe.feishu.cn/wiki/wikcnuUsRHqJF0qhShySwECmWlx)
- [前端主页](https://kaiyuanshe.cn/activity)
- [前端代码](pages/activity/)
- [后端服务](https://kaiyuanshe.feishu.cn/base/IiihbadUsaCjYSsv9N4cR3XVnWh)
- [后端代码](models/Activity/)

### 开源许可证选择器

- [项目简介](https://kaiyuanshe.feishu.cn/wiki/wikcnRn5pkE3BSvqFUMkJPymaG3)
- [前端主页](https://kaiyuanshe.cn/tool/license-filter)
- [前端代码](pages/tool/license-filter.tsx)

### 中国开源地图

- [项目简介](https://kaiyuanshe.feishu.cn/wiki/wikcnZPJ7YvMU2Qkkxu2GT7TGoh)
- [前端主页](https://kaiyuanshe.cn/organization)
- [前端代码](pages/organization/)
- [后端服务](https://kaiyuanshe.feishu.cn/base/bascnUAyhKLADcw3HyNW5OefrMd?table=tblXlmfjCsoq0sHf&view=vewdl3c59K)
- [后端代码](models/Community/Organization.ts)

## 开源协作

- 申请加入**开源社志愿者**，填表后组长会联系你加入飞书组织：https://kaiyuanshe.feishu.cn/share/base/shrcnfO89tYlYIjZpS5PXJBaK2f
- 参与代码贡献：⚠️ 由于官网项目需要调用飞书 API，需要预先配置才能在本地运行，所有**必须先申请加入 KaiYuanShe GitHub 组织**后，再贡献代码，不能直接 fork 仓库贡献代码。⚠️

## 项目技术栈

- 编程语言: [TypeScript v5][2]
- 组件引擎: [Nextjs v12][3]
- 组件套件: [Bootstrap v5][4]
- PWA 框架: [Workbox v6][5]
- 状态管理: [MobX v6][9]
- CI / CD: [GitHub Actions][11] + [Vercel][12]

## 启动

第一步，[在 NPM 中登录 GitHub 账号][10]；

第二步，在根目录下新建.env.local文件，复制[配置仓库](https://github.com/kaiyuanshe/service-configuration/blob/main/kaiyuanshe.github.io/.env.local)里的配置

第三步，安装依赖并运行开发服务器:

```bash
npm i pnpm -g
pnpm i
pnpm dev
```

在浏览器中打开 http://localhost:3000 查看结果。

[API routes][13] 可以通过 http://localhost:3000/api/hello 访问，对应端点可以在 `pages/api/hello.ts` 中进行修改。

`pages/api` 目录映射为 `/api/*`。此目录中的文件被视为 [API routes][13] 而不是 React 页面。

- [Next.js 文档][14] - 了解 Next.js 功能和 API
- [学习 Next.js][15] - 一个交互式 Next.js 教程

你可以查看 Next.js 的 [GitHub 仓库][16] - 欢迎提供反馈和贡献！

## 部署

### Vercel

- 部署 Next.js 应用程序的最简单方法是使用 Next.js 创建者 Vercel 提供的 [Vercel 平台][12]。

- 查看 [Next.js 部署文档][17] 了解更多详细信息。

### Docker

```shell
pnpm pack-image
pnpm container
```

[1]: https://react.dev/
[2]: https://www.typescriptlang.org/
[3]: https://nextjs.org/
[4]: https://getbootstrap.com/
[5]: https://developers.google.com/web/tools/workbox
[6]: https://github.com/vercel/next.js/tree/canary/packages/create-next-app
[8]: https://github.com/kaiyuanshe/kaiyuanshe.github.io/actions/workflows/deploy-production.yml
[9]: https://zh.mobx.js.org/
[10]: https://github.com/kaiyuanshe/KYS-service#sign-in-github-packages-with-npm
[11]: https://github.com/features/actions
[12]: https://vercel.com/
[13]: https://nextjs.org/docs/api-routes/introduction
[14]: https://nextjs.org/docs
[15]: https://nextjs.org/learn
[16]: https://github.com/vercel/next.js/
[17]: https://nextjs.org/docs/deployment
